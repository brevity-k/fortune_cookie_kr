'use client';

import { useCallback, useState } from 'react';
import { Fortune } from '@/types/fortune';
import { useStreak } from '@/hooks/useStreak';
import { useFortuneCollection } from '@/hooks/useFortuneCollection';
import { trackStreak } from '@/lib/analytics';

/**
 * Shared cookie-break flow for fortune widgets: fetch a fortune, record the
 * daily streak, and add it to the collection.
 *
 * `fetchFortune` should be memoized (useCallback) to keep `handleBreak` stable.
 */
export function useFortuneBreak(fetchFortune: () => Promise<Fortune>) {
  const [fortune, setFortune] = useState<Fortune | null>(null);
  const [isNew, setIsNew] = useState(false);
  const { streak, recordVisit } = useStreak();
  const { addToCollection } = useFortuneCollection();

  const handleBreak = useCallback(async (): Promise<Fortune> => {
    const result = await fetchFortune();
    setFortune(result);
    const updated = recordVisit();
    if (updated.currentStreak > 1) {
      trackStreak(updated.currentStreak);
    }
    setIsNew(addToCollection(result.id));
    return result;
  }, [fetchFortune, recordVisit, addToCollection]);

  return { fortune, isNew, streak: streak.currentStreak, handleBreak };
}
