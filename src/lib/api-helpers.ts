import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import type { RateLimiter } from '@/lib/rate-limit';

function getClientIp(request: Request): string | null {
  return request.headers.get('x-real-ip') || request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || null;
}

/** Applies a per-IP rate limit. Returns an error response to send, or null to proceed. */
export async function enforceRateLimit(
  request: Request,
  limiter: RateLimiter,
  limitMessage: string,
): Promise<NextResponse | null> {
  const ip = getClientIp(request);
  if (!ip) {
    return NextResponse.json({ error: '요청을 처리할 수 없습니다.' }, { status: 403 });
  }
  const { success, reset } = await limiter.limit(ip);
  if (!success) {
    return NextResponse.json(
      { error: limitMessage },
      { status: 429, headers: { 'Retry-After': Math.ceil((reset - Date.now()) / 1000).toString() } },
    );
  }
  return null;
}

const MAX_FIELD_LENGTH = 1000;

/**
 * Asks Claude for a flat JSON object of Korean text fields and returns it as
 * `{ interpretation }`, or a user-facing error response. Transient API errors
 * (429/5xx/overloaded) are retried by the SDK itself.
 */
export async function generateJsonInterpretation(opts: {
  apiKey: string;
  system: string;
  prompt: string;
  requiredKeys: readonly string[];
  logLabel: string;
}): Promise<NextResponse> {
  const client = new Anthropic({ apiKey: opts.apiKey, maxRetries: 2, timeout: 60_000 });

  try {
    const message = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 2048,
      temperature: 0.7,
      system: opts.system,
      messages: [{ role: 'user', content: opts.prompt }],
    });

    const text = message.content[0]?.type === 'text' ? message.content[0].text : '';
    const cleaned = text.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
    const interpretation: Record<string, unknown> = JSON.parse(cleaned);

    for (const key of opts.requiredKeys) {
      const value = interpretation[key];
      if (typeof value !== 'string' || !value || value.length > MAX_FIELD_LENGTH) {
        console.error(`${opts.logLabel}: invalid field "${key}" in AI response`);
        return NextResponse.json({ error: 'AI 응답 형식 오류입니다. 다시 시도해주세요.' }, { status: 502 });
      }
    }

    return NextResponse.json({ interpretation });
  } catch (error) {
    console.error(`${opts.logLabel}:`, error);
    if (error instanceof SyntaxError) {
      return NextResponse.json({ error: 'AI 응답 형식 오류입니다. 다시 시도해주세요.' }, { status: 502 });
    }
    if (error instanceof Anthropic.RateLimitError) {
      return NextResponse.json({ error: '요청이 너무 많습니다. 잠시 후 다시 시도해주세요.' }, { status: 429 });
    }
    if (error instanceof Anthropic.AuthenticationError) {
      return NextResponse.json({ error: 'AI 서비스 인증 오류입니다.' }, { status: 503 });
    }
    if (error instanceof Anthropic.APIError && error.status === 529) {
      return NextResponse.json({ error: 'AI 서버가 일시적으로 과부하 상태입니다. 잠시 후 다시 시도해주세요.' }, { status: 503 });
    }
    return NextResponse.json({ error: 'AI 해석 중 오류가 발생했습니다. 다시 시도해주세요.' }, { status: 500 });
  }
}
