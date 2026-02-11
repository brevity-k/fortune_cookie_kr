'use client';

import { useState, useEffect, useCallback } from 'react';
import { Fortune } from '@/types/fortune';
import { getDailyFortune } from '@/lib/fortune-selector';
import { allFortunes } from '@/data/fortunes';

const STORAGE_KEY = 'fortune_cookie_daily';

interface DailyFortuneState {
  fortune: Fortune;
  date: string;
  opened: boolean;
}

function getTodayString(): string {
  const today = new Date();
  return `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
}

export function useDailyFortune() {
  const [dailyState, setDailyState] = useState<DailyFortuneState | null>(null);
  const [hasOpenedToday, setHasOpenedToday] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    const today = getTodayString();

    if (stored) {
      try {
        const parsed: DailyFortuneState = JSON.parse(stored);
        if (parsed.date === today) {
          setDailyState(parsed);
          setHasOpenedToday(parsed.opened);
          return;
        }
      } catch {
        // Invalid stored data, continue to create new
      }
    }

    const fortune = getDailyFortune(allFortunes);
    const newState: DailyFortuneState = {
      fortune,
      date: today,
      opened: false,
    };
    setDailyState(newState);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
  }, []);

  const markAsOpened = useCallback(() => {
    if (!dailyState) return;

    const updated = { ...dailyState, opened: true };
    setDailyState(updated);
    setHasOpenedToday(true);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }, [dailyState]);

  return {
    dailyFortune: dailyState?.fortune ?? null,
    hasOpenedToday,
    markAsOpened,
  };
}
