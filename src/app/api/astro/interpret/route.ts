import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { sajuAIRatelimit } from '@/lib/rate-limit';
import { buildInterpretationPrompt } from '@/lib/astro/prompts';
import type { NatalChart, AstroAIInterpretation } from '@/lib/astro/types';

export const runtime = 'nodejs';

function isValidChart(data: unknown): data is NatalChart {
  if (!data || typeof data !== 'object') return false;
  const chart = data as Record<string, unknown>;
  if (!Array.isArray(chart.planets) || chart.planets.length < 1 || chart.planets.length > 15) return false;
  if (!chart.ascendant || typeof chart.ascendant !== 'object') return false;
  if (!chart.midheaven || typeof chart.midheaven !== 'object') return false;
  if (!Array.isArray(chart.houses) || chart.houses.length !== 12) return false;
  if (!Array.isArray(chart.aspects)) return false;
  if (!chart.elements || typeof chart.elements !== 'object') return false;
  if (!chart.modalities || typeof chart.modalities !== 'object') return false;

  // Validate planet positions
  for (const p of chart.planets as Record<string, unknown>[]) {
    if (typeof p.longitude !== 'number' || p.longitude < 0 || p.longitude > 360) return false;
    if (typeof p.degree !== 'number' || p.degree < 0 || p.degree > 30) return false;
    if (typeof p.house !== 'number' || p.house < 1 || p.house > 12) return false;
  }

  return true;
}

const SYSTEM_PROMPT = `당신은 서양 점성학 전문가입니다. 출생 차트 데이터를 바탕으로 맞춤 해석을 제공합니다.

반드시 아래 JSON 형식으로만 응답하세요. 다른 텍스트 없이 JSON만 출력합니다.
{
  "personality": "성격과 정체성 (2-3문장)",
  "emotions": "감정과 내면 (2-3문장)",
  "communication": "소통과 사고 (2-3문장)",
  "love": "사랑과 관계 (2-3문장)",
  "ambition": "야망과 행동력 (2-3문장)",
  "career": "직업과 성취 (2-3문장)",
  "balance": "에너지 균형 (2-3문장)"
}

규칙:
- 한국어로만 작성
- 점성술 용어를 자연스럽게 포함하되 쉽게 설명
- 따뜻하고 격려하는 톤으로, 차트 데이터에 근거
- 각 항목 2-3문장, 전체 500-800자`;

export async function POST(request: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'AI 서비스가 현재 이용 불가합니다.' }, { status: 503 });
  }

  // Rate limit by IP (shared pool with saju: 10 req/day)
  if (sajuAIRatelimit) {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'anonymous';
    const { success, reset } = await sajuAIRatelimit.limit(ip);
    if (!success) {
      return NextResponse.json(
        { error: '일일 요청 한도를 초과했습니다. 내일 다시 시도해주세요.' },
        { status: 429, headers: { 'Retry-After': Math.ceil((reset - Date.now()) / 1000).toString() } },
      );
    }
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: '잘못된 요청입니다.' }, { status: 400 });
  }

  const chart = (body as Record<string, unknown>)?.chart;
  if (!isValidChart(chart)) {
    return NextResponse.json({ error: '유효하지 않은 차트 데이터입니다.' }, { status: 400 });
  }

  const prompt = buildInterpretationPrompt(chart);

  const client = new Anthropic({ apiKey });

  // Retry up to 2 times for transient errors (overloaded, network)
  let lastError: unknown;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const message = await client.messages.create({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 2048,
        temperature: 0.7,
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: prompt }],
      });

      const text = message.content[0]?.type === 'text' ? message.content[0].text : '';
      const cleaned = text.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
      const interpretation: AstroAIInterpretation = JSON.parse(cleaned);

      // Validate required fields
      const required = ['personality', 'emotions', 'communication', 'love', 'ambition', 'career', 'balance'] as const;
      for (const key of required) {
        if (typeof interpretation[key] !== 'string' || !interpretation[key] || interpretation[key].length > 1000) {
          return NextResponse.json({ error: 'AI 응답 형식 오류입니다. 다시 시도해주세요.' }, { status: 500 });
        }
      }

      return NextResponse.json({ interpretation });
    } catch (error) {
      lastError = error;
      if (error instanceof Anthropic.RateLimitError) {
        return NextResponse.json({ error: '요청이 너무 많습니다. 잠시 후 다시 시도해주세요.' }, { status: 429 });
      }
      if (error instanceof Anthropic.AuthenticationError) {
        return NextResponse.json({ error: 'AI 서비스 인증 오류입니다.' }, { status: 503 });
      }
      // Retry on overloaded (529) or server errors
      const status = (error as { status?: number }).status;
      if (status === 529 || status === 500 || status === 502 || status === 503) {
        if (attempt < 2) {
          await new Promise((r) => setTimeout(r, 1000 * (attempt + 1)));
          continue;
        }
      }
      break;
    }
  }

  console.error('Astro interpretation error:', lastError);
  const errStatus = (lastError as { status?: number }).status;
  if (errStatus === 529) {
    return NextResponse.json({ error: 'AI 서버가 일시적으로 과부하 상태입니다. 잠시 후 다시 시도해주세요.' }, { status: 503 });
  }
  return NextResponse.json({ error: 'AI 해석 중 오류가 발생했습니다. 다시 시도해주세요.' }, { status: 500 });
}
