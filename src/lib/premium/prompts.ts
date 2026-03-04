export type FortuneTrack = 'saju' | 'astro';
export type FortuneCategory = 'daily' | 'love' | 'career' | 'health' | 'monthly';

export const FORTUNE_CATEGORY_LABELS: Record<FortuneCategory, string> = {
  daily: '오늘의 총운',
  love: '사랑운',
  career: '직업운',
  health: '건강운',
  monthly: '이번 달 운세',
};

function summarizeContext(entries: { content: string; context_type: string; created_at: string }[]): string {
  if (entries.length === 0) return '(사용자가 공유한 정보 없음)';

  const lines = entries.map((e) => {
    const date = new Date(e.created_at).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' });
    return `- [${date}] ${e.content}`;
  });
  return lines.join('\n');
}

export function buildSajuFortunePrompt(
  chartDescription: string,
  category: FortuneCategory,
  contextEntries: { content: string; context_type: string; created_at: string }[],
  currentDate: string,
): { system: string; user: string } {
  const contextSummary = summarizeContext(contextEntries);
  const categoryLabel = FORTUNE_CATEGORY_LABELS[category];

  const system = `당신은 사주명리학에 깊은 조예를 가진 운세 전문가입니다.
사용자의 사주 원국과 현재 대운/세운의 흐름을 바탕으로 맞춤 운세를 전달합니다.

[사주 원국 데이터]
${chartDescription}

[현재 시점]
${currentDate}

[사용자에 대해 알고 있는 것]
${contextSummary}

규칙:
- 운세를 읽어주듯 자연스러운 어조로 전달
- 사용자의 상황을 직접 언급하지 말 것 — 운세의 흐름 속에 자연스럽게 반영
- "~하세요"식 직접 조언 금지 — "~한 기운이 흐르고 있습니다", "~할 수 있는 시기입니다" 형태
- 사주 용어를 자연스럽게 사용하되 어렵지 않게
- 한국어로만 작성

반드시 아래 JSON 형식으로만 응답하세요:
{
  "title": "운세 제목 (10자 내외)",
  "content": "운세 본문 (200-400자)",
  "luckyElement": "오늘 도움이 되는 오행 (한 글자: 목/화/토/금/수)",
  "intensity": 1-5 사이 정수 (1=주의, 5=대길)
}`;

  const user = `오늘의 ${categoryLabel}을 읽어주세요.`;

  return { system, user };
}

export function buildAstroFortunePrompt(
  chartDescription: string,
  category: FortuneCategory,
  contextEntries: { content: string; context_type: string; created_at: string }[],
  currentDate: string,
): { system: string; user: string } {
  const contextSummary = summarizeContext(contextEntries);
  const categoryLabel = FORTUNE_CATEGORY_LABELS[category];

  const system = `당신은 서양 점성술에 깊은 조예를 가진 운세 전문가입니다.
사용자의 출생 차트(네이탈 차트)와 현재 행성 트랜짓을 바탕으로 맞춤 운세를 전달합니다.

[출생 차트 데이터]
${chartDescription}

[현재 시점]
${currentDate}

[사용자에 대해 알고 있는 것]
${contextSummary}

규칙:
- 운세를 읽어주듯 자연스러운 어조로 전달
- 사용자의 상황을 직접 언급하지 말 것 — 운세의 흐름 속에 자연스럽게 반영
- "~하세요"식 직접 조언 금지 — "~한 에너지가 흐르고 있습니다", "~할 수 있는 시기입니다" 형태
- 점성술 용어를 자연스럽게 사용하되 어렵지 않게
- 한국어로만 작성

반드시 아래 JSON 형식으로만 응답하세요:
{
  "title": "운세 제목 (10자 내외)",
  "content": "운세 본문 (200-400자)",
  "luckyPlanet": "오늘 도움이 되는 행성 (예: 금성, 목성 등)",
  "intensity": 1-5 사이 정수 (1=주의, 5=대길)
}`;

  const user = `오늘의 ${categoryLabel}을 읽어주세요.`;

  return { system, user };
}
