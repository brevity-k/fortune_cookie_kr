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
 *   2. Claude API로 800-1500자 한국어 블로그 포스트 생성
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

  const prompt = `당신은 한국어 블로그 콘텐츠 전문 작가입니다. 포춘쿠키/운세/한국 문화 웹사이트의 블로그 포스트를 작성해주세요.

## 주제
- 제목: ${topic.title}
- 설명: ${topic.description}
- 키워드: ${topic.keywords.join(', ')}
- 카테고리: ${topic.category}

## 작성 규칙
1. 분량: 800~1500자 (한국어 기준)
2. 형식: HTML 태그 사용 (<h2>, <p> 태그만 사용)
3. 구조: 서론 → 본론 (h2 소제목 3-5개) → 결론
4. 톤: 친근하고 읽기 쉬운 정보성 글
5. SEO: 키워드를 자연스럽게 포함
6. 정확성: 사실에 기반한 내용만 작성. 확실하지 않은 정보는 "~로 알려져 있습니다", "~라고 합니다" 등의 표현 사용
7. 문화적 맥락: 한국 독자를 대상으로 한국 문화적 맥락에서 서술
8. 포춘쿠키 언급: 글의 맥락에 자연스럽게 어울리는 경우에만 포춘쿠키 체험을 1회 언급. 억지로 넣지 마세요 — 맥락에 맞지 않으면 생략해도 됩니다
9. 결론: 반드시 마지막에 결론 단락을 포함하세요. 글이 중간에 끊기지 않도록 모든 문장을 완성하세요

## 출력 형식
HTML 태그만 출력하세요. 다른 설명이나 마크다운은 사용하지 마세요.
첫 번째 태그는 <p>로 시작하세요 (서론).
소제목은 <h2>를 사용하세요.
마지막은 반드시 완성된 결론 <p> 태그로 끝내세요.

예시:
<p>서론 텍스트...</p>
<h2>소제목 1</h2>
<p>본문...</p>
<h2>소제목 2</h2>
<p>본문...</p>
<p>결론 텍스트...</p>`;

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

  // Insert before the closing ];
  const insertPoint = fileContent.lastIndexOf('];');
  if (insertPoint === -1) {
    throw new Error('Could not find closing ]; in blog-posts.ts');
  }

  const updatedContent =
    fileContent.slice(0, insertPoint) + newPost + '\n' + fileContent.slice(insertPoint);

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

  if (textOnly.length < 500) {
    console.error('  ⚠️ 생성된 콘텐츠가 너무 짧습니다. 다시 시도해주세요.');
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
