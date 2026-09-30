/**
 * 시즌별 운세 콘텐츠 관리 스크립트
 *
 * 사용법:
 *   npx tsx scripts/add-seasonal-fortunes.ts [season]
 *
 * 시즌:
 *   new-year      설날 특별 운세 (1-2월)
 *   valentine     발렌타인 사랑운 (2월)
 *   csat          수능/학업운 (11월)
 *   christmas     크리스마스 운세 (12월)
 *   check         현재 월에 맞는 시즌 콘텐츠 확인
 *
 * 이 스크립트는 시즌별 운세 파일의 존재 여부를 확인하고,
 * 누락된 시즌 콘텐츠에 대한 가이드를 제공합니다.
 */

import { getKstDateParts } from './utils/date';

const SEASONAL_CONFIG = {
  'new-year': {
    months: [1, 2],
    label: '신년 특별 운세',
    description: '설날과 새해를 맞아 한 해의 운세를 알려주는 특별 메시지',
    categories: ['general', 'career', 'love'],
    suggestedCount: 20,
  },
  valentine: {
    months: [2],
    label: '발렌타인 사랑운 스페셜',
    description: '발렌타인데이를 위한 특별 사랑운 메시지',
    categories: ['love', 'relationship'],
    suggestedCount: 15,
  },
  csat: {
    months: [10, 11],
    label: '수능/시험 특별 학업운',
    description: '수능 시즌을 위한 학업운과 시험운 특별 메시지',
    categories: ['study'],
    suggestedCount: 15,
  },
  christmas: {
    months: [12],
    label: '크리스마스 홀리데이 운세',
    description: '크리스마스와 연말을 위한 특별 운세 메시지',
    categories: ['general', 'love', 'relationship'],
    suggestedCount: 15,
  },
} as const;

type Season = keyof typeof SEASONAL_CONFIG;

function getCurrentSeason(): Season | null {
  const { month } = getKstDateParts();
  for (const [season, config] of Object.entries(SEASONAL_CONFIG)) {
    if ((config.months as readonly number[]).includes(month)) {
      return season as Season;
    }
  }
  return null;
}

function main() {
  const arg = process.argv[2] || 'check';

  if (arg === 'check') {
    const currentSeason = getCurrentSeason();
    const { month } = getKstDateParts();
    console.log(`\n📅 현재 월: ${month}월`);

    if (currentSeason) {
      const config = SEASONAL_CONFIG[currentSeason];
      console.log(`\n🎉 현재 시즌: ${config.label}`);
      console.log(`📝 설명: ${config.description}`);
      console.log(`📂 관련 카테고리: ${config.categories.join(', ')}`);
      console.log(`📊 권장 추가 메시지 수: ${config.suggestedCount}개`);
      console.log(`\n💡 시즌 콘텐츠를 추가하려면:`);
      console.log(`   1. src/data/fortunes/ 아래 해당 카테고리 파일에 시즌 메시지 추가`);
      console.log(`   2. 시즌이 끝나면 메시지를 제거하거나 유지 (선택)`);
    } else {
      console.log(`\n📌 현재 특별 시즌이 아닙니다.`);
      console.log(`\n📋 예정된 시즌:`);
      for (const [, config] of Object.entries(SEASONAL_CONFIG)) {
        console.log(`   - ${config.months.map((m) => `${m}월`).join(', ')}: ${config.label}`);
      }
    }

    console.log(`\n💡 자동 시즌 운세 생성: npx tsx scripts/generate-seasonal-fortunes.ts`);
    return;
  }

  if (arg in SEASONAL_CONFIG) {
    const config = SEASONAL_CONFIG[arg as Season];
    console.log(`\n🎉 시즌: ${config.label}`);
    console.log(`\n📋 시즌 콘텐츠 추가 가이드:`);
    console.log(`\n1. 운세 메시지 추가 (${config.suggestedCount}개 권장):`);
    config.categories.forEach((cat) => {
      console.log(`   - src/data/fortunes/${cat}.ts 파일 편집`);
    });
    console.log(`\n2. 블로그 포스트 추가 (1-2개 권장):`);
    console.log(`   - src/data/blog-posts.ts 파일 편집`);
    console.log(`   - 시즌에 맞는 주제로 800-1500자 한국어 콘텐츠 작성`);
    console.log(`\n3. 배포:`);
    console.log(`   - git add . && git commit -m "feat: add ${arg} seasonal content"`);
    console.log(`   - git push (Vercel 자동 배포)`);
  } else {
    console.log(`\n❌ 알 수 없는 시즌: ${arg}`);
    console.log(`사용 가능: ${Object.keys(SEASONAL_CONFIG).join(', ')}, check`);
  }
}

main();
