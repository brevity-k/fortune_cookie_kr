/**
 * 콘텐츠 무결성 검증 스크립트 (CI용)
 *
 * 사용법: npx tsx scripts/validate-content.ts
 *
 * 운세 데이터와 블로그 포스트의 무결성을 검증합니다.
 * 오류 발견 시 exit code 1로 종료하여 CI 게이트로 사용 가능합니다.
 */

import { allFortunes } from '../src/data/fortunes';
import { blogPosts } from '../src/data/blog-posts';
import {
  CATEGORIES,
  FORTUNE_CATEGORIES,
  VALID_COLORS,
  FORTUNE_ID_PATTERN,
} from './utils/constants';

let errors = 0;
let warnings = 0;

function error(msg: string) {
  console.error(`ERROR: ${msg}`);
  errors++;
}

function warn(msg: string) {
  console.warn(`WARN: ${msg}`);
  warnings++;
}

function ok(msg: string) {
  console.log(`OK: ${msg}`);
}

// --- 운세 데이터 검증 ---

function validateFortunes() {
  console.log('\n=== 운세 데이터 검증 ===\n');

  if (allFortunes.length === 0) {
    error('운세 데이터가 비어있습니다');
    return;
  }

  // 카테고리별 개수
  const categoryCounts: Record<string, number> = {};
  for (const f of allFortunes) {
    categoryCounts[f.category] = (categoryCounts[f.category] || 0) + 1;
  }

  for (const cat of CATEGORIES) {
    const count = categoryCounts[cat.key] || 0;
    if (count < 10) {
      error(`카테고리 "${cat.label}" (${cat.key})에 ${count}개만 있음 (최소: 10개)`);
    }
  }

  // ID 형식 검증
  const idPattern = FORTUNE_ID_PATTERN;
  let idErrors = 0;
  for (const f of allFortunes) {
    if (!idPattern.test(f.id)) {
      idErrors++;
      if (idErrors <= 5) {
        error(`잘못된 ID 형식: ${f.id}`);
      }
    }
  }
  if (idErrors > 5) {
    error(`... 외 ${idErrors - 5}개 ID 형식 오류`);
  }

  // ID 고유성
  const ids = new Set<string>();
  let idDuplicates = 0;
  for (const f of allFortunes) {
    if (ids.has(f.id)) {
      idDuplicates++;
      if (idDuplicates <= 3) {
        error(`중복 ID: ${f.id}`);
      }
    }
    ids.add(f.id);
  }
  if (idDuplicates > 3) {
    error(`... 외 ${idDuplicates - 3}개 ID 중복`);
  }

  // 메시지 중복
  const messages = new Set<string>();
  let msgDuplicates = 0;
  for (const f of allFortunes) {
    const normalized = f.message.trim();
    if (messages.has(normalized)) {
      msgDuplicates++;
      if (msgDuplicates <= 3) {
        warn(`중복 메시지: "${f.message.substring(0, 40)}..." (${f.id})`);
      }
    }
    messages.add(normalized);
  }
  if (msgDuplicates > 3) {
    warn(`... 외 ${msgDuplicates - 3}개 메시지 중복`);
  }

  // 필수 필드 검증
  const validCategories: readonly string[] = FORTUNE_CATEGORIES;
  for (const f of allFortunes) {
    if (!validCategories.includes(f.category)) {
      error(`${f.id}: category 값이 유효하지 않음 ("${f.category}")`);
    }
    if (!f.message || f.message.length < 5) {
      error(`${f.id}: message 필드가 비어있거나 너무 짧음`);
    }
    if (f.message && f.message.length > 200) {
      warn(`${f.id}: message가 200자 초과 (${f.message.length}자)`);
    }
    if (!f.interpretation) {
      error(`${f.id}: interpretation 필드 누락`);
    }
    if (typeof f.rating !== 'number' || f.rating < 1 || f.rating > 5) {
      error(`${f.id}: rating 범위 초과 (${f.rating})`);
    }
    if (typeof f.luckyNumber !== 'number' || f.luckyNumber < 1 || f.luckyNumber > 99) {
      error(`${f.id}: luckyNumber 범위 이상 (${f.luckyNumber})`);
    }
    if (!f.luckyColor) {
      warn(`${f.id}: luckyColor 누락`);
    } else if (!VALID_COLORS.includes(f.luckyColor)) {
      error(`${f.id}: luckyColor 값이 유효하지 않음 ("${f.luckyColor}")`);
    }
    if (!f.emoji) {
      error(`${f.id}: emoji 누락`);
    }
    if (!f.shareText) {
      error(`${f.id}: shareText 누락`);
    }
  }

  ok(`${CATEGORIES.length}개 카테고리, ${allFortunes.length}개 운세`);
  for (const cat of CATEGORIES) {
    const count = categoryCounts[cat.key] || 0;
    console.log(`  ${cat.emoji} ${cat.label} (${cat.key}): ${count}개`);
  }
}

// --- 블로그 포스트 검증 ---

function validateBlog() {
  console.log('\n=== 블로그 포스트 검증 ===\n');

  if (blogPosts.length === 0) {
    error('블로그 포스트가 없습니다');
    return;
  }

  const slugs = new Set<string>();
  for (const post of blogPosts) {
    // 필수 필드
    if (!post.slug) error(`블로그: slug 누락 (title: ${post.title})`);
    if (!post.title) error(`블로그: title 누락 (slug: ${post.slug})`);
    if (!post.description) error(`블로그: description 누락 (${post.slug})`);
    if (!post.date) error(`블로그: date 누락 (${post.slug})`);
    if (!post.content || post.content.trim().length < 100) {
      error(`블로그: content가 비어있거나 너무 짧음 (${post.slug})`);
    }

    // slug 고유성
    if (slugs.has(post.slug)) {
      error(`블로그: 중복 slug: ${post.slug}`);
    }
    slugs.add(post.slug);

    // 날짜 형식
    if (post.date && !/^\d{4}-\d{2}-\d{2}$/.test(post.date)) {
      warn(`블로그: 날짜 형식 이상 (${post.slug}): ${post.date}`);
    }
  }

  ok(`${blogPosts.length}개 블로그 포스트 검증 완료`);
}

// --- 메인 ---

console.log('콘텐츠 무결성 검증');
console.log('==================');

validateFortunes();
validateBlog();

console.log('\n==================');
console.log(`결과: ${errors}개 오류, ${warnings}개 경고`);

if (errors > 0) {
  console.error('\n검증 실패 ❌');
  process.exit(1);
} else {
  console.log('\n검증 통과 ✅');
}
