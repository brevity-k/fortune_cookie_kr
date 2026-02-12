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
type FortuneCategory = 'love' | 'career' | 'health' | 'study' | 'general' | 'relationship';

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

interface SeasonalState {
  [year: string]: string[];
}

const CATEGORY_LABELS: Record<FortuneCategory, string> = {
  love: '사랑운',
  career: '재물운',
  health: '건강운',
  study: '학업운',
  general: '총운',
  relationship: '대인운',
};

const STATE_FILE = path.join(__dirname, 'seasonal-generation-state.json');
const FORTUNES_DIR = path.join(__dirname, '..', 'src', 'data', 'fortunes');

function getState(): SeasonalState {
  try {
    return JSON.parse(fs.readFileSync(STATE_FILE, 'utf-8'));
  } catch {
    return {};
  }
}

function saveState(state: SeasonalState): void {
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2) + '\n');
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

function getHighestIdNum(category: FortuneCategory): number {
  const filePath = path.join(FORTUNES_DIR, `${category}.ts`);
  const content = fs.readFileSync(filePath, 'utf-8');
  const regex = new RegExp(`${category}_(\\d+)`, 'g');
  let highest = 0;
  let match;
  while ((match = regex.exec(content)) !== null) {
    const num = parseInt(match[1], 10);
    if (num > highest) highest = num;
  }
  return highest;
}

function getExistingMessages(category: FortuneCategory): string[] {
  const filePath = path.join(FORTUNES_DIR, `${category}.ts`);
  const content = fs.readFileSync(filePath, 'utf-8');
  const regex = /message:\s*'([^']+)'/g;
  const messages: string[] = [];
  let match;
  while ((match = regex.exec(content)) !== null) {
    messages.push(match[1]);
  }
  return messages;
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
6. **luckyColor**: 빨간색/파란색/초록색/노란색/보라색/분홍색/금색/은색/하늘색/주황색/흰색 중
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

  const textBlock = response.content.find((b) => b.type === 'text');
  if (!textBlock || textBlock.type !== 'text') throw new Error('No text response');

  let json = textBlock.text.trim();
  if (json.startsWith('```')) {
    json = json.replace(/^```(?:json)?\s*\n?/, '').replace(/\n?```\s*$/, '');
  }
  json = json.replace(/,\s*([}\]])/g, '$1');

  return JSON.parse(json) as Fortune[];
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

function appendFortunesToFile(category: FortuneCategory, fortunes: Fortune[]): void {
  const filePath = path.join(FORTUNES_DIR, `${category}.ts`);
  const content = fs.readFileSync(filePath, 'utf-8');
  const code = fortunes.map(formatFortuneAsCode).join('\n');

  const insertPoint = content.lastIndexOf('];');
  if (insertPoint === -1) throw new Error(`Could not find ]; in ${category}.ts`);

  const updated = content.slice(0, insertPoint) + code + '\n' + content.slice(insertPoint);
  fs.writeFileSync(filePath, updated);
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

    const highestId = getHighestIdNum(cat);
    const existing = getExistingMessages(cat);

    console.log(`  ${CATEGORY_LABELS[cat]} (${cat}) - ${count}개 생성 중...`);
    const fortunes = await generateSeasonalFortunes(
      season,
      cat,
      count,
      highestId + 1,
      existing
    );

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
