/**
 * 자동 운세 메시지 생성 스크립트
 *
 * 사용법:
 *   npx tsx scripts/generate-fortunes.ts              # 다음 카테고리로 5개 운세 생성
 *   npx tsx scripts/generate-fortunes.ts --dry-run     # 미리보기 (파일 수정 없음)
 *   npx tsx scripts/generate-fortunes.ts --category love  # 특정 카테고리로 생성
 *
 * 환경 변수:
 *   ANTHROPIC_API_KEY - Claude API 키 (필수)
 *
 * 동작 원리:
 *   1. fortune-generation-state.json에서 다음 카테고리를 결정 (순환)
 *   2. 해당 카테고리 파일에서 기존 운세와 최고 ID를 읽음
 *   3. Claude API로 5개 Fortune 객체를 JSON으로 생성
 *   4. 유효성 검증 후 카테고리 파일에 추가
 *   5. 상태 파일 업데이트
 */

import Anthropic from '@anthropic-ai/sdk';
import * as fs from 'fs';
import * as path from 'path';

const CATEGORY_ORDER = [
  'love',
  'career',
  'health',
  'study',
  'general',
  'relationship',
] as const;

type FortuneCategory = (typeof CATEGORY_ORDER)[number];

interface Fortune {
  id: string;
  category: FortuneCategory;
  message: string;
  interpretation: string;
  luckyNumber: number;
  luckyColor: string;
  rating: 1 | 2 | 3 | 4 | 5;
  emoji: string;
  shareText: string;
}

interface GenerationState {
  lastCategoryIndex: number;
}

const CATEGORY_LABELS: Record<FortuneCategory, string> = {
  love: '사랑운',
  career: '재물운',
  health: '건강운',
  study: '학업운',
  general: '총운',
  relationship: '대인운',
};

const CATEGORY_EXPORT_NAMES: Record<FortuneCategory, string> = {
  love: 'loveFortunes',
  career: 'careerFortunes',
  health: 'healthFortunes',
  study: 'studyFortunes',
  general: 'generalFortunes',
  relationship: 'relationshipFortunes',
};

const STATE_FILE = path.join(__dirname, 'fortune-generation-state.json');
const FORTUNES_DIR = path.join(__dirname, '..', 'src', 'data', 'fortunes');
const COUNT_TO_GENERATE = 5;

function getState(): GenerationState {
  try {
    const data = fs.readFileSync(STATE_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return { lastCategoryIndex: -1 };
  }
}

function saveState(state: GenerationState): void {
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2) + '\n');
}

function getNextCategory(override?: string): FortuneCategory {
  if (override) {
    if (!CATEGORY_ORDER.includes(override as FortuneCategory)) {
      console.error(
        `Invalid category: ${override}. Valid: ${CATEGORY_ORDER.join(', ')}`
      );
      process.exit(1);
    }
    return override as FortuneCategory;
  }

  const state = getState();
  const nextIndex = (state.lastCategoryIndex + 1) % CATEGORY_ORDER.length;
  return CATEGORY_ORDER[nextIndex];
}

function getCategoryFilePath(category: FortuneCategory): string {
  return path.join(FORTUNES_DIR, `${category}.ts`);
}

function readExistingFortunes(category: FortuneCategory): {
  fileContent: string;
  messages: string[];
  highestIdNum: number;
} {
  const filePath = getCategoryFilePath(category);
  const fileContent = fs.readFileSync(filePath, 'utf-8');

  // Extract all messages
  const messageRegex = /message:\s*'([^']+)'/g;
  const messages: string[] = [];
  let match;
  while ((match = messageRegex.exec(fileContent)) !== null) {
    messages.push(match[1]);
  }

  // Find highest ID number
  const idRegex = new RegExp(`${category}_(\\d+)`, 'g');
  let highestIdNum = 0;
  while ((match = idRegex.exec(fileContent)) !== null) {
    const num = parseInt(match[1], 10);
    if (num > highestIdNum) highestIdNum = num;
  }

  return { fileContent, messages, highestIdNum };
}

function getSampleFortunes(fileContent: string): string {
  // Extract fortune objects by splitting on opening braces with id field
  const blocks: string[] = [];
  const lines = fileContent.split('\n');
  let current = '';
  let depth = 0;
  let inBlock = false;

  for (const line of lines) {
    if (!inBlock && line.includes("id: '") && line.trim().startsWith("id:")) {
      // Found the start of a fortune's id field - backtrack to opening brace
      inBlock = true;
      current = '  {\n' + line + '\n';
      depth = 1;
      continue;
    }
    if (inBlock) {
      current += line + '\n';
      if (line.includes('},')) {
        blocks.push(current.trim().replace(/,\s*$/, ''));
        current = '';
        inBlock = false;
        depth = 0;
      }
    }
  }

  if (blocks.length === 0) return '';

  // Pick 2-3 samples from different positions
  const indices: number[] = [0];
  if (blocks.length > 5) indices.push(Math.floor(blocks.length / 2));
  if (blocks.length > 2) indices.push(blocks.length - 1);

  return indices
    .map((i) => blocks[i])
    .filter(Boolean)
    .join(',\n  ');
}

async function generateFortunes(
  category: FortuneCategory,
  startId: number,
  existingMessages: string[],
  sampleFortunes: string
): Promise<Fortune[]> {
  const client = new Anthropic();

  const ids = Array.from({ length: COUNT_TO_GENERATE }, (_, i) => {
    const num = String(startId + i).padStart(3, '0');
    return `${category}_${num}`;
  });

  const categoryLabel = CATEGORY_LABELS[category];

  const prompt = `당신은 한국어 포춘쿠키 운세 메시지 전문 작가입니다. "${categoryLabel}" 카테고리의 운세 메시지 ${COUNT_TO_GENERATE}개를 JSON 배열로 생성해주세요.

## 기존 스타일 참고 (같은 카테고리)
${sampleFortunes}

## 기존 메시지 목록 (중복 금지)
${existingMessages.map((m) => `- ${m}`).join('\n')}

## 생성 규칙

1. **ID**: 순서대로 ${ids.map((id) => `"${id}"`).join(', ')}
2. **category**: "${category}"
3. **message**: 한 문장의 운세 메시지 (20-50자). 운세다운 표현, 다양한 톤 (긍정/조언/경고)
4. **interpretation**: 운세에 대한 해석과 조언 (40-80자). 구체적이고 실용적인 내용
5. **luckyNumber**: 1-99 사이 숫자 (기존과 겹쳐도 무관)
6. **luckyColor**: 한국어 색상명 (빨간색, 파란색, 초록색, 노란색, 보라색, 분홍색, 금색, 은색, 하늘색, 주황색, 흰색 중)
7. **rating**: 1(흉) ~ 5(대길). 분포: ${COUNT_TO_GENERATE}개 중 약 0-1개 rating 1-2, 3개 rating 3-4, 1-2개 rating 5
8. **emoji**: 메시지와 어울리는 이모지 1개
9. **shareText**: "🥠 오늘의 ${categoryLabel}: {message} - 포춘쿠키에서 확인하세요!" 형식

## 품질 기준
- 기존 메시지와 의미가 겹치지 않는 **새로운** 내용
- 한국 문화적 맥락에 맞는 자연스러운 한국어
- 오락 목적의 운세이므로 과도하게 부정적이지 않게
- message에 작은따옴표(')는 사용하지 말 것 (코드 파싱 문제)
- interpretation에도 작은따옴표(')는 사용하지 말 것

## 출력 형식
**반드시 JSON 배열만** 출력하세요. 다른 텍스트나 마크다운 코드 블록은 포함하지 마세요.

[
  {
    "id": "${ids[0]}",
    "category": "${category}",
    "message": "...",
    "interpretation": "...",
    "luckyNumber": 00,
    "luckyColor": "...",
    "rating": 0,
    "emoji": "...",
    "shareText": "🥠 오늘의 ${categoryLabel}: ... - 포춘쿠키에서 확인하세요!"
  }
]`;

  const response = await client.messages.create({
    model: 'claude-sonnet-4-5-20250929',
    max_tokens: 4000,
    messages: [{ role: 'user', content: prompt }],
  });

  const textBlock = response.content.find((block) => block.type === 'text');
  if (!textBlock || textBlock.type !== 'text') {
    throw new Error('No text response from API');
  }

  let jsonText = textBlock.text.trim();

  // Strip markdown code fences if present
  if (jsonText.startsWith('```')) {
    jsonText = jsonText
      .replace(/^```(?:json)?\s*\n?/, '')
      .replace(/\n?```\s*$/, '');
  }

  const fortunes: Fortune[] = JSON.parse(jsonText);
  return fortunes;
}

function validateFortunes(
  fortunes: Fortune[],
  category: FortuneCategory,
  startId: number,
  existingMessages: string[]
): string[] {
  const errors: string[] = [];

  if (fortunes.length !== COUNT_TO_GENERATE) {
    errors.push(
      `Expected ${COUNT_TO_GENERATE} fortunes, got ${fortunes.length}`
    );
  }

  const validColors = [
    '빨간색',
    '파란색',
    '초록색',
    '노란색',
    '보라색',
    '분홍색',
    '금색',
    '은색',
    '하늘색',
    '주황색',
    '흰색',
  ];

  fortunes.forEach((f, i) => {
    const expectedNum = String(startId + i).padStart(3, '0');
    const expectedId = `${category}_${expectedNum}`;

    if (f.id !== expectedId) {
      errors.push(`Fortune ${i}: expected id "${expectedId}", got "${f.id}"`);
    }
    if (f.category !== category) {
      errors.push(
        `Fortune ${i}: expected category "${category}", got "${f.category}"`
      );
    }
    if (!f.message || typeof f.message !== 'string') {
      errors.push(`Fortune ${i}: missing or invalid message`);
    }
    if (!f.interpretation || typeof f.interpretation !== 'string') {
      errors.push(`Fortune ${i}: missing or invalid interpretation`);
    }
    if (
      typeof f.luckyNumber !== 'number' ||
      f.luckyNumber < 1 ||
      f.luckyNumber > 99
    ) {
      errors.push(
        `Fortune ${i}: luckyNumber must be 1-99, got ${f.luckyNumber}`
      );
    }
    if (!validColors.includes(f.luckyColor)) {
      errors.push(
        `Fortune ${i}: invalid luckyColor "${f.luckyColor}". Valid: ${validColors.join(', ')}`
      );
    }
    if (![1, 2, 3, 4, 5].includes(f.rating)) {
      errors.push(`Fortune ${i}: rating must be 1-5, got ${f.rating}`);
    }
    if (!f.emoji || typeof f.emoji !== 'string') {
      errors.push(`Fortune ${i}: missing or invalid emoji`);
    }
    if (!f.shareText || typeof f.shareText !== 'string') {
      errors.push(`Fortune ${i}: missing or invalid shareText`);
    }
    if (f.message && existingMessages.includes(f.message)) {
      errors.push(`Fortune ${i}: duplicate message "${f.message}"`);
    }
    if (f.message && f.message.includes("'")) {
      errors.push(
        `Fortune ${i}: message contains single quote which breaks code parsing`
      );
    }
    if (f.interpretation && f.interpretation.includes("'")) {
      errors.push(
        `Fortune ${i}: interpretation contains single quote which breaks code parsing`
      );
    }
  });

  return errors;
}

function formatFortuneAsCode(f: Fortune): string {
  const escapedMessage = f.message.replace(/'/g, "\\'");
  const escapedInterpretation = f.interpretation.replace(/'/g, "\\'");
  const escapedShareText = f.shareText.replace(/'/g, "\\'");

  return `  {
    id: '${f.id}',
    category: '${f.category}',
    message: '${escapedMessage}',
    interpretation: '${escapedInterpretation}',
    luckyNumber: ${f.luckyNumber},
    luckyColor: '${f.luckyColor}',
    rating: ${f.rating},
    emoji: '${f.emoji}',
    shareText: '${escapedShareText}',
  },`;
}

function appendFortunesToFile(
  category: FortuneCategory,
  fortunes: Fortune[]
): void {
  const filePath = getCategoryFilePath(category);
  const fileContent = fs.readFileSync(filePath, 'utf-8');

  const fortuneCode = fortunes.map(formatFortuneAsCode).join('\n');

  // Insert before the closing ];
  const insertPoint = fileContent.lastIndexOf('];');
  if (insertPoint === -1) {
    throw new Error(`Could not find closing ]; in ${category}.ts`);
  }

  const updatedContent =
    fileContent.slice(0, insertPoint) +
    fortuneCode +
    '\n' +
    fileContent.slice(insertPoint);

  fs.writeFileSync(filePath, updatedContent);
}

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const categoryIndex = args.indexOf('--category');
  const categoryOverride =
    categoryIndex !== -1 ? args[categoryIndex + 1] : undefined;

  // Check API key (not needed for dry-run)
  if (!dryRun && !process.env.ANTHROPIC_API_KEY) {
    console.error('ANTHROPIC_API_KEY environment variable is required.');
    console.error(
      'Set it in .env.local or export it before running this script.'
    );
    process.exit(1);
  }

  // Determine category
  const category = getNextCategory(categoryOverride);
  const categoryLabel = CATEGORY_LABELS[category];
  const { fileContent, messages, highestIdNum } =
    readExistingFortunes(category);
  const startId = highestIdNum + 1;

  console.log('');
  console.log('========================================');
  console.log('  🥠 운세 메시지 자동 생성');
  console.log('========================================');
  console.log(`  카테고리: ${categoryLabel} (${category})`);
  console.log(`  기존 운세: ${messages.length}개`);
  console.log(
    `  새 ID 범위: ${category}_${String(startId).padStart(3, '0')} ~ ${category}_${String(startId + COUNT_TO_GENERATE - 1).padStart(3, '0')}`
  );
  console.log(`  생성 개수: ${COUNT_TO_GENERATE}개`);
  console.log('');

  if (dryRun) {
    console.log(
      '  [DRY RUN] 미리보기 모드 - 파일을 수정하지 않습니다.'
    );
    console.log(
      `  다음 실행 시 "${categoryLabel}" 카테고리로 ${COUNT_TO_GENERATE}개가 생성됩니다.`
    );
    console.log('');
    return;
  }

  // Generate fortunes via Claude API
  console.log('  Claude API로 운세 생성 중...');
  const sampleFortunes = getSampleFortunes(fileContent);
  const fortunes = await generateFortunes(
    category,
    startId,
    messages,
    sampleFortunes
  );

  // Validate
  console.log('  유효성 검증 중...');
  const errors = validateFortunes(fortunes, category, startId, messages);
  if (errors.length > 0) {
    console.error('');
    console.error('  ❌ 유효성 검증 실패:');
    errors.forEach((e) => console.error(`    - ${e}`));
    console.error('');
    console.error('  다시 시도해주세요.');
    process.exit(1);
  }

  // Append to file
  console.log(`  ${category}.ts에 운세 추가 중...`);
  appendFortunesToFile(category, fortunes);

  // Update state
  const newIndex = CATEGORY_ORDER.indexOf(category);
  saveState({ lastCategoryIndex: newIndex });

  console.log('');
  console.log('  ✅ 운세 메시지 추가 완료!');
  console.log(`  📂 카테고리: ${categoryLabel} (${category})`);
  console.log(`  📊 추가: ${fortunes.length}개 (총 ${messages.length + fortunes.length}개)`);
  console.log('  📝 생성된 운세:');
  fortunes.forEach((f) => {
    console.log(
      `    [${f.id}] (★${f.rating}) ${f.emoji} ${f.message}`
    );
  });
  console.log('');
}

main().catch((err) => {
  console.error('Error:', err.message);
  process.exit(1);
});
