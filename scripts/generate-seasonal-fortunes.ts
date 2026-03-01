/**
 * 시즌별 운세 자동 생성 스크립트
 *
 * 사용법:
 *   npx tsx scripts/generate-seasonal-fortunes.ts           # 다가오는 시즌 자동 감지
 *   npx tsx scripts/generate-seasonal-fortunes.ts --dry-run  # 미리보기 (파일 수정 없음)
 *
 * 동작:
 *   1. 현재 날짜 기준으로 10일 이내에 시작하는 시즌 감지
 *   2. 이미 생성된 시즌인지 상태 파일에서 확인
 *   3. Claude API로 시즌 맞춤 운세 생성
 *   4. 카테고리 파일에 추가
 */

import Anthropic from '@anthropic-ai/sdk';
import * as fs from 'fs';
import * as path from 'path';
import { withRetry } from './utils/retry';
import { VALID_COLORS, CATEGORY_LABELS, type Fortune, type FortuneCategory } from './utils/constants';
import {
  extractTextFromResponse,
  parseClaudeJSONArray,
  readStateFile,
  writeStateFile,
  atomicWriteFile,
} from './utils/json';
import { readExistingFortunes, getCategoryFilePath } from './utils/fortune-file';

const SEASONAL_CONFIG = {
  'new-year': {
    months: [1, 2],
    startMonth: 1,
    startDay: 1,
    label: '신년 특별 운세',
    description: '설날과 새해를 맞아 한 해의 운세를 알려주는 특별 메시지',
    categories: ['general', 'career', 'love'] as const,
    count: 6, // 2 per category
  },
  valentine: {
    months: [2],
    startMonth: 2,
    startDay: 4, // 10 days before Valentine's
    label: '발렌타인 사랑운 스페셜',
    description: '발렌타인데이를 위한 특별 사랑운 메시지',
    categories: ['love', 'relationship'] as const,
    count: 6,
  },
  csat: {
    months: [10, 11],
    startMonth: 10,
    startDay: 20,
    label: '수능/시험 특별 학업운',
    description: '수능 시즌을 위한 학업운과 시험운 특별 메시지',
    categories: ['study'] as const,
    count: 5,
  },
  christmas: {
    months: [12],
    startMonth: 12,
    startDay: 15,
    label: '크리스마스 홀리데이 운세',
    description: '크리스마스와 연말을 위한 특별 운세 메시지',
    categories: ['general', 'love', 'relationship'] as const,
    count: 6,
  },
} as const;

type Season = keyof typeof SEASONAL_CONFIG;

interface SeasonalState {
  [year: string]: string[];
}

const STATE_FILE = path.join(__dirname, 'seasonal-generation-state.json');

function isSeasonalState(data: unknown): data is SeasonalState {
  if (typeof data !== 'object' || data === null || Array.isArray(data)) return false;
  for (const [key, value] of Object.entries(data as Record<string, unknown>)) {
    if (!/^\d{4}$/.test(key)) return false;
    if (!Array.isArray(value) || !value.every((v) => typeof v === 'string')) return false;
  }
  return true;
}

function getState(): SeasonalState {
  return readStateFile<SeasonalState>(STATE_FILE, {}, isSeasonalState);
}

function saveState(state: SeasonalState): void {
  writeStateFile(STATE_FILE, state);
}

function getUpcomingSeason(): Season | null {
  const now = new Date();
  const month = now.getMonth() + 1;
  const day = now.getDate();

  for (const [season, config] of Object.entries(SEASONAL_CONFIG)) {
    // Check if we're within the season window (startDay of startMonth to end of last month)
    if (month === config.startMonth && day >= config.startDay) {
      return season as Season;
    }
    // Also match if we're in a later active month
    if ((config.months as readonly number[]).includes(month) && month > config.startMonth) {
      return season as Season;
    }
  }
  return null;
}

async function generateSeasonalFortunes(
  season: Season,
  category: FortuneCategory,
  count: number,
  startId: number,
  existingMessages: string[]
): Promise<Fortune[]> {
  const client = new Anthropic();
  const config = SEASONAL_CONFIG[season];
  const categoryLabel = CATEGORY_LABELS[category];

  const ids = Array.from({ length: count }, (_, i) => {
    const num = String(startId + i).padStart(3, '0');
    return `${category}_${num}`;
  });

  const prompt = `당신은 한국어 포춘쿠키 운세 메시지 전문 작가입니다. "${config.label}" 시즌의 "${categoryLabel}" 운세 메시지 ${count}개를 JSON 배열로 생성해주세요.

## 시즌 정보
- 시즌: ${config.label}
- 설명: ${config.description}

## 기존 메시지 (중복 금지)
${existingMessages.slice(-20).map((m) => `- ${m}`).join('\n')}

## 생성 규칙
1. **ID**: ${ids.map((id) => `"${id}"`).join(', ')}
2. **category**: "${category}"
3. **message**: 시즌 테마를 반영한 운세 (20-50자)
4. **interpretation**: 시즌에 맞는 해석과 조언 (40-80자)
5. **luckyNumber**: 1-99
6. **luckyColor**: ${VALID_COLORS.join('/')} 중
7. **rating**: 시즌 특별 운세이므로 3-5 위주 (긍정적)
8. **emoji**: 시즌 + 메시지와 어울리는 이모지 1개
9. **shareText**: "🥠 ${config.label}: {message} - 포춘쿠키에서 확인하세요!" 형식
10. message와 interpretation에 작은따옴표(') 사용 금지

## 출력
JSON 배열만 출력. 마크다운 코드 블록 없이.`;

  const response = await withRetry(() =>
    client.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 4000,
      messages: [{ role: 'user', content: prompt }],
    })
  );

  const text = extractTextFromResponse(response);
  return parseClaudeJSONArray<Fortune>(text);
}

function formatFortuneAsCode(f: Fortune): string {
  return `  {
    id: '${f.id}',
    category: '${f.category}',
    message: '${f.message.replace(/'/g, "\\'")}',
    interpretation: '${f.interpretation.replace(/'/g, "\\'")}',
    luckyNumber: ${f.luckyNumber},
    luckyColor: '${f.luckyColor}',
    rating: ${f.rating},
    emoji: '${f.emoji}',
    shareText: '${f.shareText.replace(/'/g, "\\'")}',
  },`;
}

function sanitizeFortunes(fortunes: Fortune[]): void {
  const validColors: readonly string[] = VALID_COLORS;

  for (const f of fortunes) {
    if (!validColors.includes(f.luckyColor)) {
      const original = f.luckyColor;
      f.luckyColor = VALID_COLORS[Math.floor(Math.random() * VALID_COLORS.length)];
      console.log(
        `  ⚠️ luckyColor 자동 수정: "${original}" → "${f.luckyColor}"`
      );
    }

    for (const field of ['message', 'interpretation', 'shareText'] as const) {
      if (f[field] && f[field].includes("'")) {
        f[field] = f[field].replace(/'/g, '\u2019');
        console.log(`  ⚠️ ${field}의 작은따옴표 자동 수정 (${f.id})`);
      }
    }
  }
}

function validateFortunes(
  fortunes: Fortune[],
  category: FortuneCategory,
  existingMessages: string[]
): string[] {
  const errors: string[] = [];
  const validColors: readonly string[] = VALID_COLORS;

  fortunes.forEach((f, i) => {
    if (f.category !== category) {
      errors.push(`Fortune ${i}: expected category "${category}", got "${f.category}"`);
    }
    if (!f.message || typeof f.message !== 'string') {
      errors.push(`Fortune ${i}: missing or invalid message`);
    }
    if (!f.interpretation || typeof f.interpretation !== 'string') {
      errors.push(`Fortune ${i}: missing or invalid interpretation`);
    }
    if (typeof f.luckyNumber !== 'number' || f.luckyNumber < 1 || f.luckyNumber > 99) {
      errors.push(`Fortune ${i}: luckyNumber must be 1-99, got ${f.luckyNumber}`);
    }
    if (!validColors.includes(f.luckyColor)) {
      errors.push(`Fortune ${i}: invalid luckyColor "${f.luckyColor}"`);
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
      errors.push(`Fortune ${i}: message contains single quote which breaks code parsing`);
    }
    if (f.interpretation && f.interpretation.includes("'")) {
      errors.push(`Fortune ${i}: interpretation contains single quote which breaks code parsing`);
    }
  });

  return errors;
}

function appendFortunesToFile(category: FortuneCategory, fortunes: Fortune[]): void {
  const filePath = getCategoryFilePath(category);
  const content = fs.readFileSync(filePath, 'utf-8');
  const code = fortunes.map(formatFortuneAsCode).join('\n');

  const insertPoint = content.lastIndexOf('];');
  if (insertPoint === -1) throw new Error(`Could not find ]; in ${category}.ts`);

  const updated = content.slice(0, insertPoint) + code + '\n' + content.slice(insertPoint);
  atomicWriteFile(filePath, updated);
}

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');

  if (!dryRun && !process.env.ANTHROPIC_API_KEY) {
    console.error('ANTHROPIC_API_KEY environment variable is required.');
    process.exit(1);
  }

  const season = getUpcomingSeason();
  const year = String(new Date().getFullYear());

  console.log('');
  console.log('========================================');
  console.log('  🎄 시즌별 운세 자동 생성');
  console.log('========================================');

  if (!season) {
    console.log('  현재 다가오는 시즌이 없습니다. 종료합니다.');
    console.log('');
    return;
  }

  const config = SEASONAL_CONFIG[season];
  const state = getState();
  const yearState = state[year] || [];

  if (yearState.includes(season)) {
    console.log(`  ${year}년 "${config.label}" 시즌은 이미 생성되었습니다. 종료합니다.`);
    console.log('');
    return;
  }

  console.log(`  시즌: ${config.label} (${season})`);
  console.log(`  카테고리: ${config.categories.join(', ')}`);
  console.log(`  생성 수: ${config.count}개`);
  console.log('');

  if (dryRun) {
    console.log('  [DRY RUN] 미리보기 모드 - 파일을 수정하지 않습니다.');
    console.log('');
    return;
  }

  // Distribute count across categories
  const perCategory = Math.ceil(config.count / config.categories.length);
  let totalGenerated = 0;

  for (const category of config.categories) {
    const cat = category as FortuneCategory;
    const count = Math.min(perCategory, config.count - totalGenerated);
    if (count <= 0) break;

    const { highestIdNum: highestId, messages: existing } = readExistingFortunes(cat);

    console.log(`  ${CATEGORY_LABELS[cat]} (${cat}) - ${count}개 생성 중...`);
    const fortunes = await generateSeasonalFortunes(
      season,
      cat,
      count,
      highestId + 1,
      existing
    );

    // Sanitize fixable issues (invalid colors, single quotes)
    sanitizeFortunes(fortunes);

    // Validate before writing
    console.log(`  유효성 검증 중...`);
    const errors = validateFortunes(fortunes, cat, existing);
    if (errors.length > 0) {
      console.error('');
      console.error('  ❌ 유효성 검증 실패:');
      errors.forEach((e) => console.error(`    - ${e}`));
      console.error('');
      process.exit(1);
    }

    appendFortunesToFile(cat, fortunes);
    totalGenerated += fortunes.length;

    for (const f of fortunes) {
      console.log(`    [${f.id}] (★${f.rating}) ${f.emoji} ${f.message}`);
    }
  }

  // Update state
  state[year] = [...yearState, season];
  saveState(state);

  console.log('');
  console.log(`  ✅ ${config.label} 시즌 운세 ${totalGenerated}개 추가 완료!`);
  console.log('');
}

main().catch((err) => {
  console.error('Error:', err.message);
  process.exit(1);
});
