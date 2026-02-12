/**
 * 블로그 주제 자동 보충 스크립트
 *
 * 사용법:
 *   npx tsx scripts/replenish-blog-topics.ts           # 주제 보충 (20개)
 *   npx tsx scripts/replenish-blog-topics.ts --dry-run  # 미리보기
 *   npx tsx scripts/replenish-blog-topics.ts --count 10 # 10개 생성
 *
 * 동작:
 *   1. 현재 주제 큐와 사용 현황 확인
 *   2. 남은 주제가 15개 미만이면 Claude API로 새 주제 생성
 *   3. 기존 주제와 중복되지 않도록 검증
 *   4. blog-topics.ts에 추가
 */

import Anthropic from '@anthropic-ai/sdk';
import * as fs from 'fs';
import * as path from 'path';
import { BLOG_TOPICS, BlogTopic } from './blog-topics';
import { withRetry } from './utils/retry';
import {
  extractTextFromResponse,
  parseClaudeJSONArray,
  readStateFile,
  atomicWriteFile,
} from './utils/json';

const USED_TOPICS_FILE = path.join(__dirname, 'used-topics.json');
const TOPICS_FILE = path.join(__dirname, 'blog-topics.ts');
const MIN_REMAINING = 15;

function getUsedTopics(): string[] {
  return readStateFile<string[]>(USED_TOPICS_FILE, [], Array.isArray);
}

async function generateNewTopics(count: number): Promise<BlogTopic[]> {
  const client = new Anthropic();

  const existingSlugs = BLOG_TOPICS.map((t) => t.slug).join(', ');
  const existingTitles = BLOG_TOPICS.map((t) => t.title).join(', ');

  const prompt = `당신은 한국어 블로그 SEO 전문가입니다. 포춘쿠키/운세/한국 문화 웹사이트(fortunecookie.ai.kr)를 위한 새로운 블로그 주제 ${count}개를 생성해주세요.

## 사이트 특징
- 포춘쿠키 운세 서비스
- 띠별 운세, MBTI 운세, 궁합 테스트 기능 제공
- 한국 사용자 대상

## 기존 주제 (중복 금지)
슬러그: ${existingSlugs}
제목: ${existingTitles}

## 카테고리 분배
- fortune (운세/점술): ${Math.ceil(count * 0.25)}개
- culture (한국 문화): ${Math.ceil(count * 0.15)}개
- lifestyle (라이프스타일): ${Math.ceil(count * 0.2)}개
- seasonal (시즌): ${Math.ceil(count * 0.15)}개
- psychology (심리): ${Math.ceil(count * 0.25)}개

## 출력 형식 (JSON 배열만 출력)
[
  {
    "slug": "kebab-case-english-slug",
    "title": "한국어 제목 (20자 이내)",
    "description": "한국어 설명 (50자 이내)",
    "keywords": ["키워드1", "키워드2", "키워드3", "키워드4"],
    "category": "fortune"
  }
]

## 규칙
1. 슬러그는 영어 kebab-case
2. 기존 주제와 절대 중복 금지
3. 한국에서 검색 볼륨이 있는 키워드 포함
4. 새 기능(띠별운세, MBTI운세, 궁합) 관련 주제도 포함
5. JSON 배열만 출력 (다른 텍스트 없이)`;

  const response = await withRetry(() =>
    client.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 4000,
      messages: [{ role: 'user', content: prompt }],
    })
  );

  const text = extractTextFromResponse(response);
  const parsed = parseClaudeJSONArray<Partial<BlogTopic>>(text);

  // Validate and filter duplicates
  const existingSlugSet = new Set(BLOG_TOPICS.map((t) => t.slug));
  const validTopics: BlogTopic[] = [];

  for (const t of parsed) {
    if (!t.slug || !t.title || !t.description || !t.keywords || !t.category) {
      console.warn(`  Skipping invalid topic: ${JSON.stringify(t)}`);
      continue;
    }
    if (existingSlugSet.has(t.slug)) {
      console.warn(`  Skipping duplicate slug: ${t.slug}`);
      continue;
    }
    const validCategories = ['fortune', 'culture', 'lifestyle', 'seasonal', 'psychology'];
    if (!validCategories.includes(t.category)) {
      t.category = 'lifestyle';
    }
    validTopics.push(t as BlogTopic);
    existingSlugSet.add(t.slug);
  }

  return validTopics;
}

function appendTopicsToFile(topics: BlogTopic[]): void {
  const fileContent = fs.readFileSync(TOPICS_FILE, 'utf-8');

  const newEntries = topics
    .map(
      (t) => `  {
    slug: '${t.slug}',
    title: '${t.title.replace(/'/g, "\\'")}',
    description: '${t.description.replace(/'/g, "\\'")}',
    keywords: [${t.keywords.map((k) => `'${k.replace(/'/g, "\\'")}'`).join(', ')}],
    category: '${t.category}',
  },`
    )
    .join('\n');

  // Insert before the closing ];
  const insertPoint = fileContent.lastIndexOf('];');
  if (insertPoint === -1) {
    throw new Error('Could not find closing ]; in blog-topics.ts');
  }

  const updatedContent =
    fileContent.slice(0, insertPoint) +
    '\n  // === 자동 생성 주제 ===\n' +
    newEntries +
    '\n' +
    fileContent.slice(insertPoint);

  atomicWriteFile(TOPICS_FILE, updatedContent);
}

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const countIdx = args.indexOf('--count');
  const count = countIdx !== -1 ? parseInt(args[countIdx + 1], 10) : 20;

  if (!dryRun && !process.env.ANTHROPIC_API_KEY) {
    console.error('ANTHROPIC_API_KEY environment variable is required.');
    process.exit(1);
  }

  const used = getUsedTopics();
  const remaining = BLOG_TOPICS.filter((t) => !used.includes(t.slug)).length;

  console.log('');
  console.log('========================================');
  console.log('  📝 블로그 주제 자동 보충');
  console.log('========================================');
  console.log(`  전체 주제: ${BLOG_TOPICS.length}개`);
  console.log(`  사용된 주제: ${used.length}개`);
  console.log(`  남은 주제: ${remaining}개`);
  console.log(`  최소 기준: ${MIN_REMAINING}개`);
  console.log('');

  if (remaining >= MIN_REMAINING && !args.includes('--force')) {
    console.log(`  ✅ 남은 주제가 ${MIN_REMAINING}개 이상이므로 보충이 필요하지 않습니다.`);
    console.log('  (강제 실행: --force 플래그 사용)');
    return;
  }

  console.log(`  ${count}개 새 주제를 생성합니다...`);

  if (dryRun) {
    console.log('  [DRY RUN] 미리보기 모드');
    return;
  }

  const newTopics = await generateNewTopics(count);
  console.log(`  ${newTopics.length}개 유효한 주제 생성됨`);

  if (newTopics.length === 0) {
    console.error('  ⚠️ 유효한 주제가 생성되지 않았습니다.');
    process.exit(1);
  }

  appendTopicsToFile(newTopics);

  console.log('');
  console.log('  ✅ 주제 보충 완료!');
  for (const t of newTopics) {
    console.log(`    - [${t.category}] ${t.title} (${t.slug})`);
  }
  console.log('');
}

main().catch((err) => {
  console.error('Error:', err.message);
  process.exit(1);
});
