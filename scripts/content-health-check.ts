/**
 * 콘텐츠 상태 점검 스크립트
 *
 * 사용법: npx tsx scripts/content-health-check.ts
 *
 * 운세 데이터와 블로그 포스트의 품질을 점검합니다:
 * - 운세 메시지 수 확인 (카테고리별)
 * - 등급 분포 확인
 * - 중복 메시지 검출
 * - ID 형식 검증
 * - 블로그 포스트 수 확인
 */

import { allFortunes } from '../src/data/fortunes';
import { blogPosts } from '../src/data/blog-posts';
import { CATEGORIES, FORTUNE_ID_PATTERN } from './utils/constants';

function checkFortunes() {
  console.log('═══════════════════════════════════════');
  console.log('  🥠 운세 데이터 상태 점검');
  console.log('═══════════════════════════════════════\n');

  // Category counts
  console.log('📊 카테고리별 메시지 수:');
  const categoryCounts: Record<string, number> = {};
  allFortunes.forEach((f) => {
    categoryCounts[f.category] = (categoryCounts[f.category] || 0) + 1;
  });
  CATEGORIES.forEach((cat) => {
    const count = categoryCounts[cat.key] || 0;
    const status = count >= 30 ? '✅' : '⚠️';
    console.log(`   ${status} ${cat.emoji} ${cat.label} (${cat.key}): ${count}개`);
  });
  console.log(`   총계: ${allFortunes.length}개\n`);

  // Rating distribution
  console.log('📊 등급 분포:');
  const ratingCounts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  allFortunes.forEach((f) => {
    ratingCounts[f.rating] = (ratingCounts[f.rating] || 0) + 1;
  });
  const total = allFortunes.length;
  for (let r = 1; r <= 5; r++) {
    const count = ratingCounts[r];
    const pct = ((count / total) * 100).toFixed(1);
    const bar = '█'.repeat(Math.round(count / total * 40));
    console.log(`   등급 ${r}: ${count}개 (${pct}%) ${bar}`);
  }
  const lowPct = (((ratingCounts[1] + ratingCounts[2]) / total) * 100).toFixed(1);
  const midPct = (((ratingCounts[3] + ratingCounts[4]) / total) * 100).toFixed(1);
  const highPct = ((ratingCounts[5] / total) * 100).toFixed(1);
  console.log(`\n   흉+소흉 (1-2): ${lowPct}% (목표 ~10%)`);
  console.log(`   평+소길 (3-4): ${midPct}% (목표 ~60%)`);
  console.log(`   대길 (5): ${highPct}% (목표 ~30%)\n`);

  // Duplicate check
  console.log('🔍 중복 메시지 검사:');
  const messages = new Set<string>();
  let duplicates = 0;
  allFortunes.forEach((f) => {
    if (messages.has(f.message)) {
      duplicates++;
      console.log(`   ⚠️ 중복: "${f.message.substring(0, 40)}..." (${f.id})`);
    }
    messages.add(f.message);
  });
  if (duplicates === 0) {
    console.log('   ✅ 중복 메시지 없음\n');
  } else {
    console.log(`   ⚠️ ${duplicates}개 중복 발견\n`);
  }

  // ID format check
  console.log('🔍 ID 형식 검사:');
  let idErrors = 0;
  const idPattern = FORTUNE_ID_PATTERN;
  allFortunes.forEach((f) => {
    if (!idPattern.test(f.id)) {
      idErrors++;
      console.log(`   ⚠️ 잘못된 ID 형식: ${f.id}`);
    }
  });
  if (idErrors === 0) {
    console.log('   ✅ 모든 ID 형식 정상\n');
  }

  // ID uniqueness
  const ids = new Set<string>();
  let idDuplicates = 0;
  allFortunes.forEach((f) => {
    if (ids.has(f.id)) {
      idDuplicates++;
      console.log(`   ⚠️ 중복 ID: ${f.id}`);
    }
    ids.add(f.id);
  });
  if (idDuplicates === 0) {
    console.log('🔍 ID 고유성: ✅ 모든 ID 고유\n');
  }
}

function checkBlog() {
  console.log('═══════════════════════════════════════');
  console.log('  📝 블로그 포스트 상태 점검');
  console.log('═══════════════════════════════════════\n');

  console.log(`📊 포스트 수: ${blogPosts.length}개 (AdSense 권장: 10개 이상)`);
  const status = blogPosts.length >= 10 ? '✅' : '⚠️';
  console.log(`   ${status} ${blogPosts.length >= 10 ? '충분함' : '추가 필요'}\n`);

  console.log('📋 포스트 목록:');
  blogPosts.forEach((post, i) => {
    const contentLength = post.content.replace(/<[^>]*>/g, '').length;
    const lenStatus = contentLength >= 800 ? '✅' : '⚠️';
    console.log(`   ${i + 1}. ${post.title}`);
    console.log(`      ${lenStatus} 글자 수: ~${contentLength}자 | 날짜: ${post.date}`);
  });
}

function checkPages() {
  console.log('\n═══════════════════════════════════════');
  console.log('  📄 페이지 수 점검');
  console.log('═══════════════════════════════════════\n');

  const pageCount =
    1 +  // main
    6 +  // categories
    12 + // zodiac animals
    16 + // mbti types
    12 + // horoscope signs
    3 +  // hubs (zodiac, mbti, horoscope)
    2 +  // saju, birth-chart
    1 +  // compatibility
    1 +  // collection
    4 +  // seasonal (new-year, valentines, exam-luck, christmas)
    1 +  // gift (dynamic)
    blogPosts.length + // blog posts
    1 +  // blog list
    4;   // about, privacy, terms, contact

  console.log(`📊 총 페이지: ${pageCount}개 (AdSense 권장: 15개 이상)`);
  console.log(`   ${pageCount >= 15 ? '✅' : '⚠️'} ${pageCount >= 15 ? '충분함' : '추가 필요'}`);
  console.log(`\n   메인: 1개`);
  console.log(`   카테고리: 6개`);
  console.log(`   띠별: 12개`);
  console.log(`   MBTI: 16개`);
  console.log(`   별자리: 12개`);
  console.log(`   허브 (띠별/MBTI/별자리): 3개`);
  console.log(`   사주/출생 차트: 2개`);
  console.log(`   궁합: 1개`);
  console.log(`   도감: 1개`);
  console.log(`   시즌: 4개`);
  console.log(`   선물: 1개 (동적)`);
  console.log(`   블로그: ${blogPosts.length + 1}개 (목록 + ${blogPosts.length} 포스트)`);
  console.log(`   법적/정보: 4개 (소개, 개인정보, 약관, 문의)`);
}

checkFortunes();
checkBlog();
checkPages();

console.log('\n═══════════════════════════════════════');
console.log('  ✅ 점검 완료');
console.log('═══════════════════════════════════════\n');
