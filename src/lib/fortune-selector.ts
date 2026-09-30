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
    return (state >>> 0) / 0x100000000; // [0, 1) — dividing by 0xffffffff could yield 1 → out-of-bounds index
  };
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

export function getFortuneFromId(
  fortunes: Fortune[],
  id: string
): Fortune {
  if (fortunes.length === 0) return fallbackFortune;
  // Gift links carry the sender's fortune id; unknown ids still map to a stable fortune.
  const exact = fortunes.find((f) => f.id === id);
  if (exact) return exact;
  return fortunes[hashString(id) % fortunes.length];
}

/** Same fortune for everyone with the same seed key on the same (KST) day. */
function getSeededDailyFortune(fortunes: Fortune[], seedKey: string): Fortune {
  if (fortunes.length === 0) return fallbackFortune;
  const random = seededRandom(hashString(getTodayString() + seedKey));
  return fortunes[Math.floor(random() * fortunes.length)];
}

export function getZodiacDailyFortune(fortunes: Fortune[], animal: string): Fortune {
  return getSeededDailyFortune(fortunes, 'zodiac_' + animal);
}

export function getHoroscopeDailyFortune(fortunes: Fortune[], sign: string): Fortune {
  return getSeededDailyFortune(fortunes, 'horoscope_' + sign);
}

export function getMBTIDailyFortune(fortunes: Fortune[], mbtiType: string): Fortune {
  return getSeededDailyFortune(fortunes, 'mbti_' + mbtiType.toLowerCase());
}

/** Order-independent key so (A, B) and (B, A) get the same result. */
function pairKey(nameA: string, yearA: number, nameB: string, yearB: number): string {
  const pairs = [[nameA, String(yearA)], [nameB, String(yearB)]].sort(
    (a, b) => a[0].localeCompare(b[0]) || a[1].localeCompare(b[1])
  );
  return pairs[0][0] + pairs[0][1] + pairs[1][0] + pairs[1][1];
}

export function getCompatibilityScore(
  nameA: string,
  yearA: number,
  nameB: string,
  yearB: number
): number {
  const seed = hashString(pairKey(nameA, yearA, nameB, yearB));
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
  const seed = hashString(pairKey(nameA, yearA, nameB, yearB) + 'fortunes');
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
