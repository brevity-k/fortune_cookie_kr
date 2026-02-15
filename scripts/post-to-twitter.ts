/**
 * Twitter/X 자동 포스팅 스크립트
 *
 * 사용법:
 *   npx tsx scripts/post-to-twitter.ts              # 트윗 게시
 *   npx tsx scripts/post-to-twitter.ts --dry-run     # 미리보기 (게시 안 함)
 *   npx tsx scripts/post-to-twitter.ts --type blog   # 블로그 포스트 트윗 강제
 *   npx tsx scripts/post-to-twitter.ts --type fortune # 운세 트윗 강제
 *
 * 환경 변수:
 *   X_CONSUMER_KEY        - X API Consumer Key (필수)
 *   X_SECRET_KEY           - X API Consumer Secret (필수)
 *   X_ACCESS_TOKEN         - X API Access Token (필수)
 *   X_ACCESS_TOKEN_SECRET  - X API Access Token Secret (필수)
 *
 * 동작 원리:
 *   1. 오늘 생성된 블로그 포스트가 있으면 블로그 트윗
 *   2. 없으면 랜덤 카테고리에서 운세 트윗
 *   3. 이미 트윗한 블로그 슬러그는 상태 파일로 중복 방지
 */

import { TwitterApi } from 'twitter-api-v2';
import * as path from 'path';
import { blogPosts, BlogPost } from '../src/data/blog-posts';
import { allFortunes } from '../src/data/fortunes';
import { CATEGORIES, type Fortune, type FortuneCategory } from './utils/constants';
import { readStateFile, writeStateFile } from './utils/json';
import { withRetry } from './utils/retry';

const STATE_FILE = path.join(__dirname, 'twitter-post-state.json');
const SITE_URL = 'https://fortunecookie.ai.kr';

interface TwitterPostState {
  lastPostDate: string;
  postedSlugs: string[];
}

function isTwitterPostState(data: unknown): data is TwitterPostState {
  if (typeof data !== 'object' || data === null) return false;
  const obj = data as Record<string, unknown>;
  return (
    typeof obj.lastPostDate === 'string' &&
    Array.isArray(obj.postedSlugs) &&
    obj.postedSlugs.every((s) => typeof s === 'string')
  );
}

const DEFAULT_STATE: TwitterPostState = {
  lastPostDate: '',
  postedSlugs: [],
};

function getState(): TwitterPostState {
  return readStateFile<TwitterPostState>(STATE_FILE, DEFAULT_STATE, isTwitterPostState);
}

function saveState(state: TwitterPostState): void {
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

function findTodayBlogPost(state: TwitterPostState): BlogPost | null {
  const today = getTodayDate();
  const candidates = blogPosts.filter(
    (post) => post.date === today && !state.postedSlugs.includes(post.slug)
  );
  return candidates.length > 0 ? candidates[0] : null;
}

function pickRandomFortune(): Fortune {
  const categoryIndex = Math.floor(Math.random() * allFortunes.length);
  return allFortunes[categoryIndex];
}

function buildBlogTweet(post: BlogPost): string {
  const categoryTag = CATEGORY_HASHTAGS.general;
  const url = `${SITE_URL}/blog/${post.slug}`;

  let description = post.description;
  // Template without description to measure space
  const template = `📝 ${post.title}\n\n\n\n👉 ${url}\n\n#포춘쿠키 #운세 #${categoryTag}`;
  const maxDescLen = 280 - template.length;

  if (description.length > maxDescLen) {
    description = description.slice(0, maxDescLen - 1) + '…';
  }

  return `📝 ${post.title}\n\n${description}\n\n👉 ${url}\n\n#포춘쿠키 #운세 #${categoryTag}`;
}

function buildFortuneTweet(fortune: Fortune): string {
  const categoryLabel = getCategoryLabel(fortune.category);
  const categoryTag = CATEGORY_HASHTAGS[fortune.category];

  let message = fortune.message;
  // Template without message to measure space
  const template = `🥠 오늘의 ${categoryLabel}\n\n""\n\n💫 행운의 숫자: ${fortune.luckyNumber} | 행운의 색: ${fortune.luckyColor}\n\n오늘의 운세를 확인하세요 👉 ${SITE_URL}\n\n#포춘쿠키 #오늘의운세 #${categoryTag}`;
  const maxMsgLen = 280 - template.length;

  if (message.length > maxMsgLen) {
    message = message.slice(0, maxMsgLen - 1) + '…';
  }

  return `🥠 오늘의 ${categoryLabel}\n\n"${message}"\n\n💫 행운의 숫자: ${fortune.luckyNumber} | 행운의 색: ${fortune.luckyColor}\n\n오늘의 운세를 확인하세요 👉 ${SITE_URL}\n\n#포춘쿠키 #오늘의운세 #${categoryTag}`;
}

async function postTweet(text: string): Promise<string> {
  const client = new TwitterApi({
    appKey: process.env.X_CONSUMER_KEY!,
    appSecret: process.env.X_SECRET_KEY!,
    accessToken: process.env.X_ACCESS_TOKEN!,
    accessSecret: process.env.X_ACCESS_TOKEN_SECRET!,
  });

  const result = await withRetry(() => client.v2.tweet(text));
  return result.data.id;
}

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const typeIndex = args.indexOf('--type');
  const forceType = typeIndex !== -1 ? args[typeIndex + 1] : undefined;

  if (forceType && forceType !== 'blog' && forceType !== 'fortune') {
    console.error('Invalid --type value. Use "blog" or "fortune".');
    process.exit(1);
  }

  // Check API keys (not needed for dry-run)
  if (!dryRun) {
    const requiredKeys = [
      'X_CONSUMER_KEY',
      'X_SECRET_KEY',
      'X_ACCESS_TOKEN',
      'X_ACCESS_TOKEN_SECRET',
    ];
    const missing = requiredKeys.filter((key) => !process.env[key]);
    if (missing.length > 0) {
      console.error(`Missing environment variables: ${missing.join(', ')}`);
      process.exit(1);
    }
  }

  const state = getState();
  const today = getTodayDate();

  console.log('');
  console.log('========================================');
  console.log('  🐦 Twitter/X 자동 포스팅');
  console.log('========================================');

  let tweetText: string;
  let tweetType: string;
  let blogSlug: string | null = null;

  if (forceType === 'blog' || (!forceType && forceType !== 'fortune')) {
    const blogPost = findTodayBlogPost(state);
    if (blogPost && forceType !== 'fortune') {
      tweetText = buildBlogTweet(blogPost);
      tweetType = '블로그';
      blogSlug = blogPost.slug;
      console.log(`  타입: 블로그 포스트`);
      console.log(`  제목: ${blogPost.title}`);
      console.log(`  슬러그: ${blogPost.slug}`);
    } else if (forceType === 'blog') {
      console.log('  ⚠️ 오늘 게시된 새 블로그 포스트가 없습니다.');
      console.log('  운세 트윗으로 대체합니다.');
      const fortune = pickRandomFortune();
      tweetText = buildFortuneTweet(fortune);
      tweetType = '운세';
      console.log(`  타입: 운세 (${getCategoryLabel(fortune.category)})`);
    } else {
      const fortune = pickRandomFortune();
      tweetText = buildFortuneTweet(fortune);
      tweetType = '운세';
      console.log(`  타입: 운세 (${getCategoryLabel(fortune.category)})`);
    }
  } else {
    const fortune = pickRandomFortune();
    tweetText = buildFortuneTweet(fortune);
    tweetType = '운세';
    console.log(`  타입: 운세 (${getCategoryLabel(fortune.category)})`);
  }

  console.log(`  글자 수: ${tweetText.length}/280`);
  console.log('');
  console.log('  --- 트윗 내용 ---');
  console.log(tweetText);
  console.log('  -----------------');
  console.log('');

  if (tweetText.length > 280) {
    console.error('  ❌ 트윗이 280자를 초과합니다!');
    process.exit(1);
  }

  if (dryRun) {
    console.log('  [DRY RUN] 미리보기 모드 - 트윗을 게시하지 않습니다.');
    console.log('');
    return;
  }

  // Post tweet
  console.log('  트윗 게시 중...');
  const tweetId = await postTweet(tweetText);

  // Update state
  state.lastPostDate = today;
  if (blogSlug) {
    state.postedSlugs.push(blogSlug);
  }
  saveState(state);

  console.log('');
  console.log('  ✅ 트윗 게시 완료!');
  console.log(`  🐦 타입: ${tweetType}`);
  console.log(`  🔗 https://x.com/i/status/${tweetId}`);
  console.log('');
}

main().catch((err) => {
  console.error('Error:', err.message);
  process.exit(1);
});
