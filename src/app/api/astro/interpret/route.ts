import { NextResponse } from 'next/server';
import { sajuAIRatelimit } from '@/lib/rate-limit';
import { getAnthropicKey } from '@/lib/env';
import { enforceRateLimit, generateJsonInterpretation } from '@/lib/api-helpers';
import { buildInterpretationPrompt } from '@/lib/astro/prompts';
import type { NatalChart, AstroAIInterpretation } from '@/lib/astro/types';

export const runtime = 'nodejs';

function isFiniteNumber(v: unknown): v is number {
  return typeof v === 'number' && Number.isFinite(v);
}

function isObject(v: unknown): v is Record<string, unknown> {
  return !!v && typeof v === 'object';
}

function isValidPoint(v: unknown): boolean {
  return isObject(v)
    && isFiniteNumber(v.longitude) && v.longitude >= 0 && v.longitude <= 360
    && isFiniteNumber(v.degree) && v.degree >= 0 && v.degree <= 30;
}

// Every value interpolated into the prompt must be a bounded number, never free text.
function hasCounts(v: unknown, keys: readonly string[]): boolean {
  return isObject(v) && keys.every((k) => isFiniteNumber(v[k]) && (v[k] as number) >= 0 && (v[k] as number) <= 20);
}

function isValidChart(data: unknown): data is NatalChart {
  if (!isObject(data)) return false;
  const chart = data;
  if (!Array.isArray(chart.planets) || chart.planets.length < 1 || chart.planets.length > 15) return false;
  if (!isValidPoint(chart.ascendant) || !isValidPoint(chart.midheaven)) return false;
  if (!Array.isArray(chart.houses) || chart.houses.length !== 12) return false;
  if (!Array.isArray(chart.aspects) || chart.aspects.length > 100) return false;
  if (!hasCounts(chart.elements, ['fire', 'earth', 'air', 'water'])) return false;
  if (!hasCounts(chart.modalities, ['cardinal', 'fixed', 'mutable'])) return false;

  // Validate planet positions
  for (const p of chart.planets) {
    if (!isObject(p)) return false;
    if (!isFiniteNumber(p.longitude) || p.longitude < 0 || p.longitude > 360) return false;
    if (!isFiniteNumber(p.degree) || p.degree < 0 || p.degree > 30) return false;
    if (!isFiniteNumber(p.house) || p.house < 1 || p.house > 12) return false;
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

const REQUIRED_KEYS: readonly (keyof AstroAIInterpretation)[] = [
  'personality', 'emotions', 'communication', 'love', 'ambition', 'career', 'balance',
];

export async function POST(request: Request) {
  const apiKey = getAnthropicKey();
  if (!apiKey) {
    return NextResponse.json({ error: 'AI 서비스가 현재 이용 불가합니다.' }, { status: 503 });
  }

  // 10 req/day per IP, shared with /api/saju/interpret
  const limited = await enforceRateLimit(request, sajuAIRatelimit, '일일 요청 한도를 초과했습니다. 내일 다시 시도해주세요.');
  if (limited) return limited;

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

  return generateJsonInterpretation({
    apiKey,
    system: SYSTEM_PROMPT,
    prompt: buildInterpretationPrompt(chart),
    requiredKeys: REQUIRED_KEYS,
    logLabel: 'Astro interpretation error',
  });
}
