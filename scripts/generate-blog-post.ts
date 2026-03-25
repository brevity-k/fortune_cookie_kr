/**
 * 자동 블로그 포스트 생성 스크립트
 *
 * 사용법:
 *   npx tsx scripts/generate-blog-post.ts           # 다음 주제로 포스트 생성
 *   npx tsx scripts/generate-blog-post.ts --dry-run  # 미리보기 (파일 수정 없음)
 *   npx tsx scripts/generate-blog-post.ts --topic <slug>  # 특정 주제로 생성
 *
 * 환경 변수:
 *   ANTHROPIC_API_KEY - Claude API 키 (필수)
 *
 * 동작 원리:
 *   1. blog-topics.ts에서 다음 미사용 주제를 선택
 *   2. Claude API로 3000-5000자 심층 한국어 블로그 포스트 생성
 *   3. src/data/blog-posts.ts에 새 포스트 추가
 *   4. scripts/used-topics.json에 사용된 주제 기록
 */

import Anthropic from '@anthropic-ai/sdk';
import * as fs from 'fs';
import * as path from 'path';
import { BLOG_TOPICS, BlogTopic } from './blog-topics';
import { withRetry } from './utils/retry';
import {
  extractTextFromResponse,
  readStateFile,
  writeStateFile,
  atomicWriteFile,
} from './utils/json';

const USED_TOPICS_FILE = path.join(__dirname, 'used-topics.json');
const BLOG_POSTS_FILE = path.join(__dirname, '..', 'src', 'data', 'blog-posts.ts');

function isStringArray(data: unknown): data is string[] {
  return Array.isArray(data) && data.every((item) => typeof item === 'string');
}

function getUsedTopics(): string[] {
  return readStateFile<string[]>(USED_TOPICS_FILE, [], isStringArray);
}

function saveUsedTopics(topics: string[]): void {
  writeStateFile(USED_TOPICS_FILE, topics);
}

function getNextTopic(specificSlug?: string): BlogTopic | null {
  const used = getUsedTopics();

  if (specificSlug) {
    const topic = BLOG_TOPICS.find((t) => t.slug === specificSlug);
    if (!topic) {
      console.error(`Topic not found: ${specificSlug}`);
      return null;
    }
    if (used.includes(specificSlug)) {
      console.warn(`Topic already used: ${specificSlug} (will generate anyway)`);
    }
    return topic;
  }

  const available = BLOG_TOPICS.filter((t) => !used.includes(t.slug));
  if (available.length === 0) {
    console.log('All topics have been used! Resetting queue...');
    saveUsedTopics([]);
    return BLOG_TOPICS[0];
  }

  return available[0];
}

async function generateBlogPost(topic: BlogTopic): Promise<string> {
  const client = new Anthropic();

  // Internal pages for contextual linking
  const internalLinks = [
    { path: '/', label: '오늘의 포춘쿠키', keywords: ['운세', '포춘쿠키', '오늘의 운세'] },
    { path: '/fortune/love', label: '사랑운 포춘쿠키', keywords: ['사랑운', '연애운', '사랑'] },
    { path: '/fortune/career', label: '재물운 포춘쿠키', keywords: ['재물운', '금전운', '직장운', '취업운'] },
    { path: '/fortune/health', label: '건강운 포춘쿠키', keywords: ['건강운', '건강'] },
    { path: '/fortune/study', label: '학업운 포춘쿠키', keywords: ['학업운', '시험운', '수능'] },
    { path: '/compatibility', label: '궁합 포춘쿠키', keywords: ['궁합', '커플', '연인'] },
    { path: '/fortune/horoscope', label: '별자리 운세', keywords: ['별자리', '별자리운세', '호로스코프'] },
    { path: '/fortune/zodiac', label: '띠별 운세', keywords: ['띠별운세', '띠', '12간지'] },
    { path: '/fortune/mbti', label: 'MBTI 운세', keywords: ['MBTI', 'mbti'] },
  ];

  // Find relevant internal links based on topic keywords
  const relevantLinks = internalLinks.filter((link) =>
    link.keywords.some(
      (kw) =>
        topic.keywords.some((tk) => tk.includes(kw) || kw.includes(tk)) ||
        topic.title.includes(kw) ||
        topic.description.includes(kw)
    )
  );

  // Always include the homepage link
  if (!relevantLinks.some((l) => l.path === '/')) {
    relevantLinks.unshift(internalLinks[0]);
  }

  const linkSuggestions = relevantLinks
    .slice(0, 3)
    .map((l) => `  - <a href="https://fortunecookie.ai.kr${l.path}">${l.label}</a>`)
    .join('\n');

  const prompt = `당신은 깊이 있는 분석과 풍부한 사례를 구사하는 한국어 매거진 칼럼니스트입니다. 포춘쿠키/운세 웹사이트(fortunecookie.ai.kr)의 심층 블로그 포스트를 작성해주세요.

## 주제
- 제목: ${topic.title}
- 설명: ${topic.description}
- 키워드: ${topic.keywords.join(', ')}
- 카테고리: ${topic.category}

## 보이스 & 톤 (가장 중요)
- 백과사전/위키피디아 식 나열 절대 금지. "오늘은 ~에 대해 알아보겠습니다" 같은 진부한 서론 금지.
- 첫 문장부터 독자를 잡는 구체적인 장면, 질문, 또는 도발적 주장으로 시작하세요.
- 2인칭 대화체 ("당신도 그런 적 있지 않나요?", "솔직히 말해봅시다") 적극 활용.
- 단순 정보 나열이 아니라 "왜?"를 집요하게 파고드는 분석과 관점을 제시하세요.
- 심리학 개념(바넘 효과, 확증편향, 통제 환상 등)이나 사회 현상을 자연스럽게 엮으세요.
- 한국 사회 맥락의 구체적 데이터/사례를 포함하세요 (앱 다운로드 수, 문화 현상, 역사적 사실, 통계 수치 등).
- 감정 흐름: 공감(hook) → 분석(insight) → 깊은 탐구(deep dive) → 실용적 조언 또는 여운(closing).

## 심층 콘텐츠 요구사항 (반드시 지킬 것)
1. 각 섹션에서 하나의 핵심 주장을 깊이 파고드세요. 얕게 여러 개를 나열하지 마세요.
2. 구체적 사례나 에피소드를 최소 2개 포함하세요 (역사적 사건, 실험 결과, 문화 현상, 일상 장면 등).
3. 숫자/데이터를 최소 3개 이상 포함하세요 (연도, 통계, 비율, 금액 등 — 검증 가능한 사실 기반).
4. 하나의 주제를 다각도로 분석하세요: 심리학적 관점, 역사적 맥락, 한국 사회 맥락 중 최소 2가지.
5. 독자가 실제로 적용할 수 있는 구체적 조언이나 행동 가이드를 포함하세요.
6. 단순히 "~입니다"로 끝나는 문단 대신, 반문/질문/반전으로 다음 문단에 대한 기대를 만드세요.

## 절대 하지 말 것
- "~에 대해 알아보겠습니다", "~를 살펴보겠습니다" 같은 진부한 도입부
- 내용 없이 일반론만 반복하는 문단
- 모든 항목을 동등하게 나열하는 리스트형 구성 (깊이 있게 2-3개를 파는 게 얕게 5개 나열보다 낫다)
- "~라고 합니다"로만 끝나는 수동적 서술 연속
- 근거 없는 주장이나 출처를 확인할 수 없는 통계

## 작성 규칙
1. 분량: 3000~5000자 (한국어 기준, 매거진 칼럼 수준의 깊이)
2. 형식: HTML 태그 사용
   - <h2>: 주요 섹션 제목 (호기심을 유발하는 문장형)
   - <h3>: 섹션 내 소주제 (필요한 경우만)
   - <p>: 본문 문단
   - <strong>: 핵심 문장 강조
   - <blockquote>: 인용구, 핵심 통찰, 독자에게 던지는 질문
   - <ul>/<ol> + <li>: 실용적 팁, 체크리스트, 단계별 가이드 (남용 금지 — 글 전체에서 1-2회만)
3. 구조:
   - 후크 (첫 1-2문단): 구체적 장면이나 도발적 질문으로 시작
   - 본론 (h2 소제목 4-6개): 각 섹션은 하나의 핵심 주장 + 근거 + 사례
   - 실용 섹션 (1개): 독자가 바로 적용할 수 있는 구체적 조언
   - 클로징 (마지막 1-2문단): 따뜻하면서도 여운이 남는 결론
4. SEO: 키워드를 자연스럽게 포함하되, SEO를 위해 문장을 어색하게 만들지 마세요
5. 정확성: 사실에 기반한 내용만 작성. 심리학 개념을 인용할 때는 개념명을 명시하세요
6. 포춘쿠키/사이트 언급: 글의 맥락에 자연스럽게 어울리는 경우에만 언급. 억지로 넣지 마세요
7. 결론: 반드시 마지막에 따뜻하면서도 여운이 남는 결론 단락을 포함하세요

## 내부 링크 (자연스러운 문맥에서 1-2개만 삽입)
아래 링크 중 글의 흐름에 자연스럽게 어울리는 것만 본문 중간에 삽입하세요. 억지로 모든 링크를 넣지 마세요.
${linkSuggestions}

## 참고할 톤 예시
좋은 첫 문장: "면접 전날 밤, 새벽 2시. 잠이 안 와서 켠 핸드폰으로 '오늘의 운세'를 검색해본 적 있나요?"
좋은 소제목: "모르는 게 가장 무섭다 — 불확실성 회피 심리"
좋은 인용: <blockquote>"우리가 두려워하는 것은 미래 그 자체가 아니라, 미래를 모른다는 사실이다."</blockquote>
나쁜 첫 문장: "오늘은 타로 카드의 기본 구성과 의미에 대해 알아보겠습니다."
나쁜 소제목: "타로 카드의 종류"

## 출력 형식
HTML 태그만 출력하세요. 다른 설명이나 마크다운은 사용하지 마세요.
첫 번째 태그는 <p>로 시작하세요 (후크).
소제목은 <h2>를 사용하세요. 섹션 내 소주제가 필요하면 <h3>을 사용하세요.
강조할 핵심 문장에는 <strong>을 사용하세요.
인용구나 핵심 질문은 <blockquote>로 감싸세요.
실용적 팁은 <ul> 또는 <ol>로 정리하되 글 전체에서 1-2회만 사용하세요.
마지막은 반드시 완성된 결론 <p> 태그로 끝내세요.`;

  const response = await withRetry(() =>
    client.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 8192,
      messages: [{ role: 'user', content: prompt }],
    })
  );

  return extractTextFromResponse(response);
}

function getTodayDate(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function escapeForTemplate(str: string): string {
  return str.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$/g, '\\$');
}

function appendBlogPost(
  topic: BlogTopic,
  content: string,
  date: string
): void {
  const fileContent = fs.readFileSync(BLOG_POSTS_FILE, 'utf-8');

  const newPost = `  {
    slug: '${topic.slug}',
    title: '${topic.title.replace(/'/g, "\\'")}',
    description:
      '${topic.description.replace(/'/g, "\\'")}',
    date: '${date}',
    content: \`
      ${escapeForTemplate(content)}
    \`,
  },`;

  // Insert at the beginning of the array (newest first)
  const marker = 'BlogPost[] = [';
  const insertPoint = fileContent.indexOf(marker);
  if (insertPoint === -1) {
    throw new Error('Could not find BlogPost[] = [ in blog-posts.ts');
  }

  const arrayStart = insertPoint + marker.length - 1;
  const updatedContent =
    fileContent.slice(0, arrayStart + 1) + '\n' + newPost + fileContent.slice(arrayStart + 1);

  atomicWriteFile(BLOG_POSTS_FILE, updatedContent);
}

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const topicIndex = args.indexOf('--topic');
  const specificSlug = topicIndex !== -1 ? args[topicIndex + 1] : undefined;

  // Check API key (not needed for dry-run)
  if (!dryRun && !process.env.ANTHROPIC_API_KEY) {
    console.error('ANTHROPIC_API_KEY environment variable is required.');
    console.error('Set it in .env.local or export it before running this script.');
    process.exit(1);
  }

  // Get next topic
  const topic = getNextTopic(specificSlug);
  if (!topic) {
    process.exit(1);
  }

  const used = getUsedTopics();
  const remaining = BLOG_TOPICS.filter((t) => !used.includes(t.slug)).length;

  console.log('');
  console.log('========================================');
  console.log('  📝 블로그 포스트 자동 생성');
  console.log('========================================');
  console.log(`  주제: ${topic.title}`);
  console.log(`  슬러그: ${topic.slug}`);
  console.log(`  카테고리: ${topic.category}`);
  console.log(`  키워드: ${topic.keywords.join(', ')}`);
  console.log(`  남은 주제: ${remaining}/${BLOG_TOPICS.length}개`);
  console.log('');

  if (dryRun) {
    console.log('  [DRY RUN] 미리보기 모드 - 파일을 수정하지 않습니다.');
    console.log('');
    return;
  }

  // Generate content
  console.log('  Claude API로 콘텐츠 생성 중...');
  const content = await generateBlogPost(topic);
  const date = getTodayDate();

  // Validate content
  const textOnly = content.replace(/<[^>]*>/g, '');
  console.log(`  생성된 콘텐츠: ~${textOnly.length}자`);

  if (textOnly.length < 2000) {
    console.error('  ⚠️ 생성된 콘텐츠가 너무 짧습니다 (최소 2000자). 다시 시도해주세요.');
    process.exit(1);
  }

  // Append to blog-posts.ts
  console.log('  blog-posts.ts에 포스트 추가 중...');
  appendBlogPost(topic, content, date);

  // Mark topic as used
  used.push(topic.slug);
  saveUsedTopics(used);

  console.log('');
  console.log('  ✅ 블로그 포스트 추가 완료!');
  console.log(`  📄 ${topic.title}`);
  console.log(`  📅 ${date}`);
  console.log(`  📊 ~${textOnly.length}자`);
  console.log(`  🔗 /blog/${topic.slug}`);
  console.log('');
}

main().catch((err) => {
  console.error('Error:', err.message);
  process.exit(1);
});
