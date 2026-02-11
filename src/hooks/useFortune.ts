'use client';

import { useState, useCallback } from 'react';
import { Fortune, FortuneCategory } from '@/types/fortune';
import { getDailyFortune, getRandomFortune } from '@/lib/fortune-selector';
import { allFortunes } from '@/data/fortunes';

export function useFortune(category?: FortuneCategory) {
  const [fortune, setFortune] = useState<Fortune | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);

  const revealDailyFortune = useCallback(() => {
    const daily = getDailyFortune(allFortunes, category);
    setFortune(daily);
    setIsRevealed(true);
    return daily;
  }, [category]);

  const revealRandomFortune = useCallback(() => {
    const random = getRandomFortune(allFortunes, category, fortune?.id);
    setFortune(random);
    setIsRevealed(true);
    return random;
  }, [category, fortune?.id]);

  const reset = useCallback(() => {
    setFortune(null);
    setIsRevealed(false);
  }, []);

  return {
    fortune,
    isRevealed,
    revealDailyFortune,
    revealRandomFortune,
    reset,
  };
}
