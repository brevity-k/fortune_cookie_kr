import { Fortune, FortuneCategory } from '@/types/fortune';
import { getTodayString } from '@/lib/date-utils';

const fallbackFortune: Fortune = {
  id: 'general_000',
  category: 'general',
  message: '오늘 하루도 행운이 가득하길!',
  interpretation: '좋은 일이 생길 거예요.',
  luckyNumber: 7,
  luckyColor: '금색',
  rating: 3,
  emoji: '🥠',
  shareText: '오늘 하루도 행운이 가득하길! 🥠',
};

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

function seededRandom(seed: number): () => number {
  let state = seed;
  return () => {
    state = (state * 1664525 + 1013904223) & 0xffffffff;
    return (state >>> 0) / 0xffffffff;
  };
}

export function getDailyFortune(
  fortunes: Fortune[],
  category?: FortuneCategory
): Fortune {
  if (fortunes.length === 0) {
    return fallbackFortune;
  }

  const dateStr = getTodayString();
  const seed = hashString(dateStr + (category || 'all'));
  const random = seededRandom(seed);

  const filtered = category
    ? fortunes.filter((f) => f.category === category)
    : fortunes;

  if (filtered.length === 0) return fortunes[0];

  const index = Math.floor(random() * filtered.length);
  return filtered[index];
}

export function getRandomFortune(
  fortunes: Fortune[],
  category?: FortuneCategory,
  excludeId?: string
): Fortune {
  if (fortunes.length === 0) return fallbackFortune;

  const filtered = category
    ? fortunes.filter((f) => f.category === category)
    : fortunes;

  if (filtered.length === 0) return fortunes[0];

  const available = excludeId
    ? filtered.filter((f) => f.id !== excludeId)
    : filtered;

  if (available.length === 0) return filtered[0];

  const index = Math.floor(Math.random() * available.length);
  return available[index];
}

export function getFortunesByCategory(
  fortunes: Fortune[],
  category: FortuneCategory
): Fortune[] {
  return fortunes.filter((f) => f.category === category);
}

export function getFortuneFromId(
  fortunes: Fortune[],
  id: string
): Fortune {
  if (fortunes.length === 0) return fallbackFortune;
  const seed = hashString(id);
  const index = seed % fortunes.length;
  return fortunes[index];
}

export function getZodiacDailyFortune(
  fortunes: Fortune[],
  animal: string
): Fortune {
  if (fortunes.length === 0) return fallbackFortune;
  const dateStr = getTodayString();
  const seed = hashString(dateStr + 'zodiac_' + animal);
  const random = seededRandom(seed);
  const index = Math.floor(random() * fortunes.length);
  return fortunes[index];
}

export function getHoroscopeDailyFortune(
  fortunes: Fortune[],
  sign: string
): Fortune {
  if (fortunes.length === 0) return fallbackFortune;
  const dateStr = getTodayString();
  const seed = hashString(dateStr + 'horoscope_' + sign);
  const random = seededRandom(seed);
  const index = Math.floor(random() * fortunes.length);
  return fortunes[index];
}

export function getMBTIDailyFortune(
  fortunes: Fortune[],
  mbtiType: string
): Fortune {
  if (fortunes.length === 0) return fallbackFortune;
  const dateStr = getTodayString();
  const seed = hashString(dateStr + 'mbti_' + mbtiType.toLowerCase());
  const random = seededRandom(seed);
  const index = Math.floor(random() * fortunes.length);
  return fortunes[index];
}

export function getCompatibilityScore(
  nameA: string,
  yearA: number,
  nameB: string,
  yearB: number
): number {
  const pairs = [[nameA, String(yearA)], [nameB, String(yearB)]].sort(
    (a, b) => a[0].localeCompare(b[0]) || a[1].localeCompare(b[1])
  );
  const seed = hashString(pairs[0][0] + pairs[0][1] + pairs[1][0] + pairs[1][1]);
  const random = seededRandom(seed);
  return Math.floor(random() * 56) + 40; // 40-95%
}

export function getCompatibilityFortunes(
  fortunes: Fortune[],
  nameA: string,
  yearA: number,
  nameB: string,
  yearB: number
): [Fortune, Fortune] {
  if (fortunes.length === 0) return [fallbackFortune, fallbackFortune];
  if (fortunes.length === 1) return [fortunes[0], fortunes[0]];
  const pairs = [[nameA, String(yearA)], [nameB, String(yearB)]].sort(
    (a, b) => a[0].localeCompare(b[0]) || a[1].localeCompare(b[1])
  );
  const seed = hashString(pairs[0][0] + pairs[0][1] + pairs[1][0] + pairs[1][1] + 'fortunes');
  const random = seededRandom(seed);
  const idxA = Math.floor(random() * fortunes.length);
  let idxB = Math.floor(random() * fortunes.length);
  if (idxB === idxA) idxB = (idxB + 1) % fortunes.length;
  return [fortunes[idxA], fortunes[idxB]];
}

export const RATING_LABELS: Record<number, string> = {
  1: '흉',
  2: '소흉',
  3: '평',
  4: '소길',
  5: '대길',
};

export function getRatingStars(rating: number): string {
  return '★'.repeat(rating) + '☆'.repeat(5 - rating);
}

export function getRatingLabel(rating: number): string {
  return RATING_LABELS[rating] || '평';
}
