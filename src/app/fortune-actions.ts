'use server';

// Server actions are public POST endpoints — validate every argument.

import { allFortunes } from '@/data/fortunes';
import {
  getRandomFortune,
  getFortuneFromId,
  getZodiacDailyFortune,
  getHoroscopeDailyFortune,
  getMBTIDailyFortune,
  getCompatibilityFortunes,
} from '@/lib/fortune-selector';
import { Fortune, FortuneCategory, FORTUNE_CATEGORIES } from '@/types/fortune';

const MAX_KEY_LENGTH = 100;

function isShortString(value: unknown): value is string {
  return typeof value === 'string' && value.length > 0 && value.length <= MAX_KEY_LENGTH;
}

function isCategory(value: unknown): value is FortuneCategory {
  return (FORTUNE_CATEGORIES as readonly unknown[]).includes(value);
}

export async function randomFortuneAction(category?: FortuneCategory): Promise<Fortune> {
  return getRandomFortune(allFortunes, isCategory(category) ? category : undefined);
}

export async function fortuneFromIdAction(id: string): Promise<Fortune> {
  return getFortuneFromId(allFortunes, isShortString(id) ? id : '');
}

export async function zodiacFortuneAction(animal: string): Promise<Fortune> {
  return getZodiacDailyFortune(allFortunes, isShortString(animal) ? animal : '');
}

export async function horoscopeFortuneAction(sign: string): Promise<Fortune> {
  return getHoroscopeDailyFortune(allFortunes, isShortString(sign) ? sign : '');
}

export async function mbtiFortuneAction(mbtiType: string): Promise<Fortune> {
  return getMBTIDailyFortune(allFortunes, isShortString(mbtiType) ? mbtiType : '');
}

export async function compatibilityFortunesAction(
  nameA: string,
  yearA: number,
  nameB: string,
  yearB: number
): Promise<[Fortune, Fortune]> {
  if (!isShortString(nameA) || !isShortString(nameB) || !Number.isInteger(yearA) || !Number.isInteger(yearB)) {
    throw new Error('Invalid compatibility input');
  }
  return getCompatibilityFortunes(allFortunes, nameA, yearA, nameB, yearB);
}

export async function collectionDataAction(collectedIds: string[]): Promise<{
  total: number;
  collected: Fortune[];
  categoryTotals: Record<string, number>;
}> {
  // Collection can never exceed the fortune pool; cap to bound work on hostile input.
  const ids = new Set(
    Array.isArray(collectedIds) ? collectedIds.slice(0, allFortunes.length).filter(isShortString) : []
  );
  const collected = allFortunes.filter((f) => ids.has(f.id));
  const categoryTotals: Record<string, number> = {};
  for (const f of allFortunes) {
    categoryTotals[f.category] = (categoryTotals[f.category] || 0) + 1;
  }
  return { total: allFortunes.length, collected, categoryTotals };
}
