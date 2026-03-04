import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { sajuAIRatelimit } from '@/lib/rate-limit';
import type { SajuChart, SajuAIInterpretation } from '@/lib/saju/types';
import {
  STEMS_HANJA,
  STEMS_KOREAN,
  BRANCHES_HANJA,
  BRANCHES_KOREAN,
  STEM_ELEMENTS,
  STEM_YINYANG,
  BRANCH_ELEMENTS,
  BRANCHES_ANIMAL_KOREAN,
} from '@/lib/saju/constants';

export const runtime = 'nodejs';

const ELEMENT_KOREAN: Record<string, string> = {
  wood: '목(木)', fire: '화(火)', earth: '토(土)', metal: '금(金)', water: '수(水)',
};

const YINYANG_KOREAN: Record<string, string> = {
  yang: '양(陽)', yin: '음(陰)',
};

function formatPillarDescription(stem: number, branch: number): string {
  const s = ((stem % 10) + 10) % 10;
  const b = ((branch % 12) + 12) % 12;
  return `${STEMS_HANJA[s]}${BRANCHES_HANJA[b]}(${STEMS_KOREAN[s]}${BRANCHES_KOREAN[b]}) [${ELEMENT_KOREAN[STEM_ELEMENTS[s]]}/${YINYANG_KOREAN[STEM_YINYANG[s]]}] 지지:${ELEMENT_KOREAN[BRANCH_ELEMENTS[b]]}/${BRANCHES_ANIMAL_KOREAN[b]}`;
}

function buildSajuDescription(chart: SajuChart): string {
  const { birthInfo, fourPillars, fiveElements, majorLuckCycles } = chart;
  const lines: string[] = [];

  lines.push(`생년월일: ${birthInfo.year}년 ${birthInfo.month}월 ${birthInfo.day}일${birthInfo.hour !== null ? ` ${birthInfo.hour}시` : ''} (${birthInfo.gender === 'male' ? '남' : '여'})`);
  lines.push('');
  lines.push('【사주 원국】');
  lines.push(`년주: ${formatPillarDescription(fourPillars.year.stem, fourPillars.year.branch)}`);
  lines.push(`월주: ${formatPillarDescription(fourPillars.month.stem, fourPillars.month.branch)}`);
  lines.push(`일주: ${formatPillarDescription(fourPillars.day.stem, fourPillars.day.branch)}`);
  if (fourPillars.hour) {
    lines.push(`시주: ${formatPillarDescription(fourPillars.hour.stem, fourPillars.hour.branch)}`);
  }

  lines.push('');
  lines.push('【오행 분석】');
  lines.push(`일간: ${ELEMENT_KOREAN[fiveElements.dayMaster]} ${YINYANG_KOREAN[fiveElements.dayMasterYinYang]}`);
  lines.push(`신강/신약: ${fiveElements.isStrong ? '신강(身強)' : '신약(身弱)'}`);
  lines.push(`오행 분포: 목${fiveElements.counts.wood} 화${fiveElements.counts.fire} 토${fiveElements.counts.earth} 금${fiveElements.counts.metal} 수${fiveElements.counts.water}`);
  lines.push(`용신: ${ELEMENT_KOREAN[fiveElements.favorableElement]}`);
  lines.push(`기신: ${ELEMENT_KOREAN[fiveElements.unfavorableElement]}`);

  if (majorLuckCycles.length > 0) {
    lines.push('');
    lines.push('【대운 흐름】');
    const currentAge = new Date().getFullYear() - birthInfo.year;
    for (const cycle of majorLuckCycles.slice(0, 6)) {
      const s = ((cycle.stem % 10) + 10) % 10;
      const b = ((cycle.branch % 12) + 12) % 12;
      const marker = currentAge >= cycle.startAge && currentAge < cycle.startAge + 10 ? ' ← 현재' : '';
      lines.push(`${cycle.startAge}세: ${STEMS_HANJA[s]}${BRANCHES_HANJA[b]}(${ELEMENT_KOREAN[STEM_ELEMENTS[s]]})${marker}`);
    }
  }

  return lines.join('\n');
}

function isInteger(v: unknown): v is number {
  return typeof v === 'number' && Number.isInteger(v);
}

function isValidPillar(p: unknown): boolean {
  if (!p || typeof p !== 'object') return false;
  const pillar = p as Record<string, unknown>;
  return isInteger(pillar.stem) && pillar.stem >= 0 && pillar.stem <= 9
    && isInteger(pillar.branch) && pillar.branch >= 0 && pillar.branch <= 11;
}

function isValidElement(v: unknown): boolean {
  return v === 'wood' || v === 'fire' || v === 'earth' || v === 'metal' || v === 'water';
}

function isValidChart(data: unknown): data is SajuChart {
  if (!data || typeof data !== 'object') return false;
  const chart = data as Record<string, unknown>;
  if (!chart.birthInfo || !chart.fourPillars || !chart.fiveElements) return false;

  // Validate birthInfo bounds
  const bi = chart.birthInfo as Record<string, unknown>;
  if (!isInteger(bi.year) || bi.year < 1900 || bi.year > new Date().getFullYear()) return false;
  if (!isInteger(bi.month) || bi.month < 1 || bi.month > 12) return false;
  if (!isInteger(bi.day) || bi.day < 1 || bi.day > 31) return false;
  if (bi.hour !== null && (!isInteger(bi.hour) || bi.hour < 0 || bi.hour > 23)) return false;
  if (bi.gender !== 'male' && bi.gender !== 'female') return false;

  // Validate four pillars
  const fp = chart.fourPillars as Record<string, unknown>;
  if (!isValidPillar(fp.year) || !isValidPillar(fp.month) || !isValidPillar(fp.day)) return false;
  if (fp.hour !== null && !isValidPillar(fp.hour)) return false;

  // Validate five elements
  const fe = chart.fiveElements as Record<string, unknown>;
  if (!isValidElement(fe.dayMaster) || !isValidElement(fe.favorableElement) || !isValidElement(fe.unfavorableElement)) return false;
  if (fe.dayMasterYinYang !== 'yang' && fe.dayMasterYinYang !== 'yin') return false;
  if (typeof fe.isStrong !== 'boolean') return false;
  const counts = fe.counts as Record<string, unknown> | undefined;
  if (!counts) return false;
  for (const el of ['wood', 'fire', 'earth', 'metal', 'water']) {
    if (!isInteger(counts[el]) || (counts[el] as number) < 0 || (counts[el] as number) > 20) return false;
  }

  // Validate majorLuckCycles — must be array, capped at 20
  if (!Array.isArray(chart.majorLuckCycles) || chart.majorLuckCycles.length > 20) return false;

  return true;
}

const SYSTEM_PROMPT = `당신은 한국 전통 사주명리학 전문가입니다. 사주 원국, 오행 분석, 대운 흐름을 바탕으로 맞춤 해석을 제공합니다.

반드시 아래 JSON 형식으로만 응답하세요. 다른 텍스트 없이 JSON만 출력합니다.
{
  "personality": "성격과 기질 (2-4문장)",
  "career": "직업과 재물운 (2-4문장)",
  "relationships": "대인관계와 연애운 (2-4문장)",
  "health": "건강 경향 (2-3문장)",
  "currentLuck": "현재 운세 흐름 (2-3문장, 대운 기반)",
  "advice": "실천 조언 (2-3문장, 구체적)"
}

규칙:
- 한국어로만 작성
- 사주명리 용어를 자연스럽게 포함하되 쉽게 설명
- 긍정적이고 실용적인 조언 위주
- 각 항목 2-4문장, 전체 500-800자`;

export async function POST(request: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'AI 서비스가 현재 이용 불가합니다.' }, { status: 503 });
  }

  // Rate limit by IP (10 req/day) — skipped if Upstash not configured
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

  if (!isValidChart(body)) {
    return NextResponse.json({ error: '유효하지 않은 사주 데이터입니다.' }, { status: 400 });
  }

  const description = buildSajuDescription(body);

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
        messages: [{ role: 'user', content: `다음 사주를 해석해주세요.\n\n${description}` }],
      });

      const text = message.content[0]?.type === 'text' ? message.content[0].text : '';
      const cleaned = text.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
      const interpretation: SajuAIInterpretation = JSON.parse(cleaned);

      // Validate required fields + length cap
      const required = ['personality', 'career', 'relationships', 'health', 'currentLuck', 'advice'] as const;
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

  console.error('Saju AI error:', lastError);
  const status = (lastError as { status?: number }).status;
  if (status === 529) {
    return NextResponse.json({ error: 'AI 서버가 일시적으로 과부하 상태입니다. 잠시 후 다시 시도해주세요.' }, { status: 503 });
  }
  return NextResponse.json({ error: 'AI 해석 중 오류가 발생했습니다. 다시 시도해주세요.' }, { status: 500 });
}
