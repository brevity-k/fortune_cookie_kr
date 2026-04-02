/**
 * Bluesky 자동 포스팅 스크립트
 *
 * 사용법:
 *   npx tsx scripts/post-to-bluesky.ts              # 게시
 *   npx tsx scripts/post-to-bluesky.ts --dry-run     # 미리보기 (게시 안 함)
 *   npx tsx scripts/post-to-bluesky.ts --type blog   # 블로그 포스트 강제
 *   npx tsx scripts/post-to-bluesky.ts --type fortune # 운세 강제
 *   npx tsx scripts/post-to-bluesky.ts --force        # 오늘 이미 게시했어도 강제 실행
 *
 * 환경 변수:
 *   BLUESKY_HANDLE        - Bluesky 핸들 (필수)
 *   BLUESKY_APP_PASSWORD  - Bluesky 앱 비밀번호 (필수)
 */

import { AtpAgent, RichText } from '@atproto/api';
import * as path from 'path';
import { blogPosts, BlogPost } from '../src/data/blog-posts';
import { allFortunes } from '../src/data/fortunes';
import { CATEGORIES, type Fortune, type FortuneCategory } from './utils/constants';
import { readStateFile, writeStateFile } from './utils/json';
import { withRetry } from './utils/retry';

const STATE_FILE = path.join(__dirname, 'bsky-post-state.json');
const SITE_URL = 'https://fortunecookie.ai.kr';
const MAX_GRAPHEMES = 300;

interface BlueskyPostState {
  lastPostDate: string;
  postedSlugs: string[];
  postedFortuneIds: string[];
}

function isBlueskyPostState(data: unknown): data is BlueskyPostState {
  if (typeof data !== 'object' || data === null) return false;
  const obj = data as Record<string, unknown>;
  if (typeof obj.lastPostDate !== 'string') return false;
  if (!Array.isArray(obj.postedSlugs) || !obj.postedSlugs.every((s) => typeof s === 'string')) return false;
  if (obj.postedFortuneIds !== undefined) {
    if (!Array.isArray(obj.postedFortuneIds) || !obj.postedFortuneIds.every((s) => typeof s === 'string')) return false;
  }
  return true;
}

const DEFAULT_STATE: BlueskyPostState = {
  lastPostDate: '',
  postedSlugs: [],
  postedFortuneIds: [],
};

function getState(): BlueskyPostState {
  return readStateFile<BlueskyPostState>(STATE_FILE, DEFAULT_STATE, isBlueskyPostState);
}

function saveState(state: BlueskyPostState): void {
  writeStateFile(STATE_FILE, state);
}

function getTodayDate(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

const CATEGORY_HASHTAGS: Record<FortuneCategory, string> = {
  love: '사랑운',
  career: '재물운',
  health: '건강운',
  study: '학업운',
  general: '오늘의운세',
  relationship: '대인운',
};

function getCategoryLabel(category: FortuneCategory): string {
  const info = CATEGORIES.find((c) => c.key === category);
  return info ? info.label : '운세';
}

function graphemeLength(text: string): number {
  const segmenter = new Intl.Segmenter('ko', { granularity: 'grapheme' });
  return [...segmenter.segment(text)].length;
}

function findTodayBlogPost(state: BlueskyPostState): BlogPost | null {
  const today = getTodayDate();
  const candidates = blogPosts.filter(
    (post) => post.date === today && !state.postedSlugs.includes(post.slug)
  );
  return candidates.length > 0 ? candidates[0] : null;
}

function pickRandomFortune(postedIds: string[]): { fortune: Fortune; resetted: boolean } {
  const posted = new Set(postedIds);
  const available = allFortunes.filter((f) => !posted.has(f.id));
  const resetted = available.length === 0;
  if (resetted) {
    console.log('  🔄 모든 운세를 게시했습니다. 큐를 리셋합니다.');
  }
  const pool = resetted ? allFortunes : available;
  const index = Math.floor(Math.random() * pool.length);
  return { fortune: pool[index], resetted };
}

function buildBlogPost(post: BlogPost): string {
  const categoryTag = CATEGORY_HASHTAGS.general;
  const url = `${SITE_URL}/blog/${post.slug}`;

  let description = post.description;
  const template = `📝 ${post.title}\n\n\n\n👉 ${url}\n\n#포춘쿠키 #운세 #${categoryTag}`;
  const maxDescLen = MAX_GRAPHEMES - graphemeLength(template);

  if (graphemeLength(description) > maxDescLen) {
    const segmenter = new Intl.Segmenter('ko', { granularity: 'grapheme' });
    const segments = [...segmenter.segment(description)];
    description = segments.slice(0, maxDescLen - 1).map((s) => s.segment).join('') + '…';
  }

  return `📝 ${post.title}\n\n${description}\n\n👉 ${url}\n\n#포춘쿠키 #운세 #${categoryTag}`;
}

function buildFortunePost(fortune: Fortune): string {
  const categoryLabel = getCategoryLabel(fortune.category);
  const categoryTag = CATEGORY_HASHTAGS[fortune.category];

  let message = fortune.message;
  const template = `🥠 오늘의 ${categoryLabel}\n\n""\n\n💫 행운의 숫자: ${fortune.luckyNumber} | 행운의 색: ${fortune.luckyColor}\n\n오늘의 운세를 확인하세요 👉 ${SITE_URL}\n\n#포춘쿠키 #오늘의운세 #${categoryTag}`;
  const maxMsgLen = MAX_GRAPHEMES - graphemeLength(template);

  if (graphemeLength(message) > maxMsgLen) {
    const segmenter = new Intl.Segmenter('ko', { granularity: 'grapheme' });
    const segments = [...segmenter.segment(message)];
    message = segments.slice(0, maxMsgLen - 1).map((s) => s.segment).join('') + '…';
  }

  return `🥠 오늘의 ${categoryLabel}\n\n"${message}"\n\n💫 행운의 숫자: ${fortune.luckyNumber} | 행운의 색: ${fortune.luckyColor}\n\n오늘의 운세를 확인하세요 👉 ${SITE_URL}\n\n#포춘쿠키 #오늘의운세 #${categoryTag}`;
}

async function postToBluesky(text: string, agent: AtpAgent): Promise<string> {
  const rt = new RichText({ text });
  await rt.detectFacets(agent);
  const result = await withRetry(() =>
    agent.post({ text: rt.text, facets: rt.facets, createdAt: new Date().toISOString() })
  );
  return result.uri;
}

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const force = args.includes('--force');
  const typeIndex = args.indexOf('--type');
  const forceType = typeIndex !== -1 ? args[typeIndex + 1] : undefined;

  if (forceType && forceType !== 'blog' && forceType !== 'fortune') {
    console.error('Invalid --type value. Use "blog" or "fortune".');
    process.exit(1);
  }

  if (!dryRun) {
    const missing = ['BLUESKY_HANDLE', 'BLUESKY_APP_PASSWORD'].filter((key) => !process.env[key]);
    if (missing.length > 0) {
      console.error(`Missing environment variables: ${missing.join(', ')}`);
      process.exit(1);
    }
  }

  const state = getState();
  if (!state.postedFortuneIds) {
    state.postedFortuneIds = [];
  }
  const today = getTodayDate();

  console.log('');
  console.log('========================================');
  console.log('  🦋 Bluesky 자동 포스팅');
  console.log('========================================');

  if (state.lastPostDate === today && !force && !dryRun) {
    console.log(`  ⚠️ 오늘(${today}) 이미 Bluesky에 게시했습니다.`);
    console.log('  --force 플래그로 강제 실행할 수 있습니다.');
    console.log('');
    return;
  }

  let postText: string;
  let postType: string;
  let blogSlug: string | null = null;
  let fortuneId: string | null = null;
  let fortuneQueueResetted = false;

  if (forceType === 'blog' || (!forceType && forceType !== 'fortune')) {
    const blogPost = findTodayBlogPost(state);
    if (blogPost && forceType !== 'fortune') {
      postText = buildBlogPost(blogPost);
      postType = '블로그';
      blogSlug = blogPost.slug;
      console.log(`  타입: 블로그 포스트`);
      console.log(`  제목: ${blogPost.title}`);
      console.log(`  슬러그: ${blogPost.slug}`);
    } else if (forceType === 'blog') {
      console.log('  ⚠️ 오늘 게시된 새 블로그 포스트가 없습니다.');
      console.log('  운세 포스트로 대체합니다.');
      const { fortune, resetted } = pickRandomFortune(state.postedFortuneIds);
      fortuneQueueResetted = resetted;
      postText = buildFortunePost(fortune);
      postType = '운세';
      fortuneId = fortune.id;
      console.log(`  타입: 운세 (${getCategoryLabel(fortune.category)})`);
    } else {
      const { fortune, resetted } = pickRandomFortune(state.postedFortuneIds);
      fortuneQueueResetted = resetted;
      postText = buildFortunePost(fortune);
      postType = '운세';
      fortuneId = fortune.id;
      console.log(`  타입: 운세 (${getCategoryLabel(fortune.category)})`);
    }
  } else {
    const { fortune, resetted } = pickRandomFortune(state.postedFortuneIds);
    fortuneQueueResetted = resetted;
    postText = buildFortunePost(fortune);
    postType = '운세';
    fortuneId = fortune.id;
    console.log(`  타입: 운세 (${getCategoryLabel(fortune.category)})`);
  }

  console.log(`  글자 수: ${graphemeLength(postText)}/${MAX_GRAPHEMES}`);
  console.log('');
  console.log('  --- 포스트 내용 ---');
  console.log(postText);
  console.log('  -------------------');
  console.log('');

  if (graphemeLength(postText) > MAX_GRAPHEMES) {
    console.error(`  ❌ 포스트가 ${MAX_GRAPHEMES} grapheme을 초과합니다!`);
    process.exit(1);
  }

  if (dryRun) {
    console.log('  [DRY RUN] 미리보기 모드 - 게시하지 않습니다.');
    console.log('');
    return;
  }

  console.log('  Bluesky 게시 중...');
  const agent = new AtpAgent({ service: 'https://bsky.social' });
  await withRetry(() =>
    agent.login({
      identifier: process.env.BLUESKY_HANDLE!,
      password: process.env.BLUESKY_APP_PASSWORD!,
    })
  );

  const postUri = await postToBluesky(postText, agent);

  state.lastPostDate = today;
  if (blogSlug) {
    state.postedSlugs.push(blogSlug);
  }
  if (fortuneId) {
    if (fortuneQueueResetted) {
      state.postedFortuneIds = [fortuneId];
    } else {
      state.postedFortuneIds.push(fortuneId);
    }
  }
  saveState(state);

  console.log('');
  console.log('  ✅ Bluesky 게시 완료!');
  console.log(`  🦋 타입: ${postType}`);
  console.log(`  🔗 ${postUri}`);
  console.log('');
}

main().catch((err) => {
  console.error('Error:', err.message);
  process.exit(1);
});
