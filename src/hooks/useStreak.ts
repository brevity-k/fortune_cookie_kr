'use client';

import { useState, useEffect, useCallback } from 'react';
import { getTodayString, getYesterdayString } from '@/lib/date-utils';
import { STORAGE_KEYS } from '@/lib/storage-keys';

interface StreakData {
  lastVisitDate: string;
  currentStreak: number;
  maxStreak: number;
}

const STORAGE_KEY = STORAGE_KEYS.STREAK;

function loadStreak(): StreakData {
  if (typeof window === 'undefined') {
    return { lastVisitDate: '', currentStreak: 0, maxStreak: 0 };
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (typeof parsed?.lastVisitDate === 'string' && Number.isFinite(parsed.currentStreak)) {
        return { maxStreak: 0, ...parsed };
      }
    }
  } catch {}
  return { lastVisitDate: '', currentStreak: 0, maxStreak: 0 };
}

function saveStreak(data: StreakData) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {}
}

export function useStreak() {
  const [streak, setStreak] = useState<StreakData>({ lastVisitDate: '', currentStreak: 0, maxStreak: 0 });

  useEffect(() => {
    // Read after mount (not in the useState initializer) to keep SSR/hydration output identical.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStreak(loadStreak());
  }, []);

  const recordVisit = useCallback(() => {
    const today = getTodayString();
    const yesterday = getYesterdayString();
    const current = loadStreak();

    if (current.lastVisitDate === today) return current;

    let newStreak: number;
    if (current.lastVisitDate === yesterday) {
      newStreak = current.currentStreak + 1;
    } else {
      newStreak = 1;
    }

    const updated: StreakData = {
      lastVisitDate: today,
      currentStreak: newStreak,
      maxStreak: Math.max(current.maxStreak, newStreak),
    };

    saveStreak(updated);
    setStreak(updated);
    return updated;
  }, []);

  return { streak, recordVisit };
}
