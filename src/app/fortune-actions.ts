'use server';

import { allFortunes } from '@/data/fortunes';
import {
  getRandomFortune,
  getFortuneFromId,
  getDailyFortune,
  getZodiacDailyFortune,
  getHoroscopeDailyFortune,
  getMBTIDailyFortune,
  getCompatibilityFortunes,
} from '@/lib/fortune-selector';
import { Fortune, FortuneCategory } from '@/types/fortune';

export async function randomFortuneAction(category?: FortuneCategory): Promise<Fortune> {
  return getRandomFortune(allFortunes, category);
}

export async function fortuneFromIdAction(id: string): Promise<Fortune> {
  return getFortuneFromId(allFortunes, id);
}

export async function dailyFortuneAction(): Promise<Fortune> {
  return getDailyFortune(allFortunes);
}

export async function zodiacFortuneAction(animal: string): Promise<Fortune> {
  return getZodiacDailyFortune(allFortunes, animal);
}

export async function horoscopeFortuneAction(sign: string): Promise<Fortune> {
  return getHoroscopeDailyFortune(allFortunes, sign);
}

export async function mbtiFortuneAction(mbtiType: string): Promise<Fortune> {
  return getMBTIDailyFortune(allFortunes, mbtiType);
}

export async function compatibilityFortunesAction(
  nameA: string,
  yearA: number,
  nameB: string,
  yearB: number
): Promise<[Fortune, Fortune]> {
  return getCompatibilityFortunes(allFortunes, nameA, yearA, nameB, yearB);
}

export async function collectionDataAction(collectedIds: string[]): Promise<{
  total: number;
  collected: Fortune[];
  categoryTotals: Record<string, number>;
}> {
  const collected = allFortunes.filter((f) => collectedIds.includes(f.id));
  const categoryTotals: Record<string, number> = {};
  for (const f of allFortunes) {
    categoryTotals[f.category] = (categoryTotals[f.category] || 0) + 1;
  }
  return { total: allFortunes.length, collected, categoryTotals };
}
