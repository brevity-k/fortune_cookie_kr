'use client';

import { useState, useEffect, useCallback } from 'react';
import { Fortune } from '@/types/fortune';
import { getDailyFortune } from '@/lib/fortune-selector';
import { getTodayString } from '@/lib/date-utils';
import { STORAGE_KEYS } from '@/lib/storage-keys';
import { allFortunes } from '@/data/fortunes';

const STORAGE_KEY = STORAGE_KEYS.DAILY_FORTUNE;

interface DailyFortuneState {
  fortune: Fortune;
  date: string;
  opened: boolean;
}

export function useDailyFortune() {
  const [dailyState, setDailyState] = useState<DailyFortuneState | null>(null);
  const [hasOpenedToday, setHasOpenedToday] = useState(false);

  useEffect(() => {
    const today = getTodayString();

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed: DailyFortuneState = JSON.parse(stored);
        if (parsed.date === today) {
          setDailyState(parsed);
          setHasOpenedToday(parsed.opened);
          return;
        }
      }
    } catch {
      // localStorage unavailable (Safari private mode, quota exceeded)
    }

    const fortune = getDailyFortune(allFortunes);
    const newState: DailyFortuneState = {
      fortune,
      date: today,
      opened: false,
    };
    setDailyState(newState);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
    } catch {
      // Silent fail - state still works in memory
    }
  }, []);

  const markAsOpened = useCallback(() => {
    if (!dailyState) return;

    const updated = { ...dailyState, opened: true };
    setDailyState(updated);
    setHasOpenedToday(true);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // Silent fail - state still works in memory
    }
  }, [dailyState]);

  return {
    dailyFortune: dailyState?.fortune ?? null,
    hasOpenedToday,
    markAsOpened,
  };
}
