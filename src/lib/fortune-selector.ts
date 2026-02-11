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
