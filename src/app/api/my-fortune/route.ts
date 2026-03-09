import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@/lib/supabase/server';
import { isSubscribed } from '@/lib/subscription';
import { premiumFortuneRatelimit } from '@/lib/rate-limit';
import {
  buildSajuFortunePrompt,
  buildAstroFortunePrompt,
  type FortuneTrack,
  type FortuneCategory,
} from '@/lib/premium/prompts';

export const runtime = 'nodejs';

const VALID_TRACKS: FortuneTrack[] = ['saju', 'astro'];
const VALID_CATEGORIES: FortuneCategory[] = ['daily', 'love', 'career', 'health', 'monthly'];

function getTodayDateString(): string {
  return new Date().toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  });
}

export async function POST(request: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'AI 서비스가 현재 이용 불가합니다.' }, { status: 503 });
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 });
  }

  const subscribed = await isSubscribed(supabase, user.id);
  if (!subscribed) {
    return NextResponse.json({ error: '프리미엄 구독이 필요합니다.' }, { status: 403 });
  }

  // Rate limit by user ID (30 req/day)
  if (premiumFortuneRatelimit) {
    const { success, reset } = await premiumFortuneRatelimit.limit(user.id);
    if (!success) {
      return NextResponse.json(
        { error: '일일 요청 한도를 초과했습니다. 내일 다시 시도해주세요.' },
        { status: 429, headers: { 'Retry-After': Math.ceil((reset - Date.now()) / 1000).toString() } },
      );
    }
  } else {
    console.warn('[SECURITY] Premium fortune rate limiting disabled — Upstash not configured');
  }

  let body: { track?: string; category?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: '잘못된 요청입니다.' }, { status: 400 });
  }

  const track = body.track as FortuneTrack;
  const category = (body.category || 'daily') as FortuneCategory;

  if (!VALID_TRACKS.includes(track)) {
    return NextResponse.json({ error: '유효하지 않은 트랙입니다.' }, { status: 400 });
  }
  if (!VALID_CATEGORIES.includes(category)) {
    return NextResponse.json({ error: '유효하지 않은 카테고리입니다.' }, { status: 400 });
  }

  // Check cache
  const today = new Date().toISOString().split('T')[0];
  const { data: cached } = await supabase
    .from('daily_fortunes')
    .select('content')
    .eq('user_id', user.id)
    .eq('track', track)
    .eq('fortune_date', today)
    .eq('category', category)
    .single();

  if (cached) {
    return NextResponse.json({ fortune: cached.content });
  }

  // Fetch user chart
  const { data: chartRow } = await supabase
    .from('user_charts')
    .select('chart_data, birth_info')
    .eq('user_id', user.id)
    .eq('track', track)
    .single();

  if (!chartRow) {
    return NextResponse.json({ error: '차트 데이터가 없습니다. 먼저 사주/출생차트를 입력해주세요.' }, { status: 404 });
  }

  // Fetch recent user context (last 20 entries)
  const { data: contextRows } = await supabase
    .from('user_context')
    .select('id, content, context_type, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(20);

  const contextEntries = (contextRows || []).map((r) => ({
    content: r.content,
    context_type: r.context_type,
    created_at: r.created_at,
  }));

  // Build prompt based on track — truncate chart data to limit prompt injection surface
  const currentDate = getTodayDateString();
  const rawChart = typeof chartRow.chart_data === 'string'
    ? chartRow.chart_data
    : JSON.stringify(chartRow.chart_data, null, 2);
  const chartDescription = rawChart.slice(0, 3000);

  const { system, user: userMessage } = track === 'saju'
    ? buildSajuFortunePrompt(chartDescription, category, contextEntries, currentDate)
    : buildAstroFortunePrompt(chartDescription, category, contextEntries, currentDate);

  // Generate fortune
  const client = new Anthropic({ apiKey });

  let lastError: unknown;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const message = await client.messages.create({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 2048,
        temperature: 0.8,
        system,
        messages: [{ role: 'user', content: userMessage }],
      });

      const text = message.content[0]?.type === 'text' ? message.content[0].text : '';
      const cleaned = text.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
      const parsed = JSON.parse(cleaned);

      // Validate and sanitize AI output
      if (
        typeof parsed.title !== 'string' || !parsed.title ||
        typeof parsed.content !== 'string' || !parsed.content ||
        typeof parsed.intensity !== 'number'
      ) {
        return NextResponse.json({ error: 'AI 응답 형식 오류입니다.' }, { status: 500 });
      }

      const fortune = {
        title: parsed.title.slice(0, 50),
        content: parsed.content.slice(0, 2000),
        intensity: Math.min(5, Math.max(1, Math.round(parsed.intensity))),
        luckyElement: typeof parsed.luckyElement === 'string' ? parsed.luckyElement.slice(0, 10) : undefined,
        luckyPlanet: typeof parsed.luckyPlanet === 'string' ? parsed.luckyPlanet.slice(0, 20) : undefined,
      };

      // Cache
      const contextIds = (contextRows || []).map((r) => r.id);
      const { error: cacheError } = await supabase.from('daily_fortunes').insert({
        user_id: user.id,
        track,
        fortune_date: today,
        category,
        content: fortune,
        context_snapshot: contextIds,
      });
      if (cacheError) {
        console.error('Failed to cache daily fortune:', cacheError.message);
      }

      return NextResponse.json({ fortune });
    } catch (error) {
      lastError = error;
      if (error instanceof Anthropic.RateLimitError) {
        return NextResponse.json({ error: '요청이 너무 많습니다. 잠시 후 다시 시도해주세요.' }, { status: 429 });
      }
      if (error instanceof Anthropic.AuthenticationError) {
        return NextResponse.json({ error: 'AI 서비스 인증 오류입니다.' }, { status: 503 });
      }
      // Retry on JSON parse errors (AI may return valid JSON next attempt)
      if (error instanceof SyntaxError && attempt < 2) {
        console.warn('AI response JSON parse failed, retrying:', error.message);
        await new Promise((r) => setTimeout(r, 1000 * (attempt + 1)));
        continue;
      }
      const status = (error as { status?: number }).status;
      if ((status === 529 || status === 500 || status === 502 || status === 503) && attempt < 2) {
        await new Promise((r) => setTimeout(r, 1000 * (attempt + 1)));
        continue;
      }
      break;
    }
  }

  console.error('Premium fortune generation error:', lastError);
  return NextResponse.json({ error: '운세 생성 중 오류가 발생했습니다. 다시 시도해주세요.' }, { status: 500 });
}
