import { Fortune, FortuneCategory } from '@/types/fortune';

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
  const today = new Date();
  const dateStr = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
  const seed = hashString(dateStr + (category || 'all'));
  const random = seededRandom(seed);

  const filtered = category
    ? fortunes.filter((f) => f.category === category)
    : fortunes;

  const index = Math.floor(random() * filtered.length);
  return filtered[index];
}

export function getRandomFortune(
  fortunes: Fortune[],
  category?: FortuneCategory,
  excludeId?: string
): Fortune {
  const filtered = category
    ? fortunes.filter((f) => f.category === category)
    : fortunes;

  const available = excludeId
    ? filtered.filter((f) => f.id !== excludeId)
    : filtered;

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
  const seed = hashString(id);
  const index = seed % fortunes.length;
  return fortunes[index];
}

export function getZodiacDailyFortune(
  fortunes: Fortune[],
  animal: string
): Fortune {
  const today = new Date();
  const dateStr = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
  const seed = hashString(dateStr + 'zodiac_' + animal);
  const random = seededRandom(seed);
  const index = Math.floor(random() * fortunes.length);
  return fortunes[index];
}

export function getMBTIDailyFortune(
  fortunes: Fortune[],
  mbtiType: string
): Fortune {
  const today = new Date();
  const dateStr = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
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
  const seed = hashString(nameA + yearA + nameB + yearB);
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
  const seed = hashString(nameA + yearA + nameB + yearB + 'fortunes');
  const random = seededRandom(seed);
  const idxA = Math.floor(random() * fortunes.length);
  let idxB = Math.floor(random() * fortunes.length);
  if (idxB === idxA) idxB = (idxB + 1) % fortunes.length;
  return [fortunes[idxA], fortunes[idxB]];
}

export function getRatingStars(rating: number): string {
  return '★'.repeat(rating) + '☆'.repeat(5 - rating);
}

export function getRatingLabel(rating: number): string {
  const labels: Record<number, string> = {
    1: '흉',
    2: '소흉',
    3: '평',
    4: '소길',
    5: '대길',
  };
  return labels[rating] || '평';
}
