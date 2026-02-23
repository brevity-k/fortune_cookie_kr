'use client';

import { useCallback, useState } from 'react';
import FortuneCookie from '@/components/cookie/FortuneCookie';
import FortuneShare from '@/components/fortune/FortuneShare';
import { Fortune, FortuneCategory, CookieBreakMethod } from '@/types/fortune';
import { getRandomFortune } from '@/lib/fortune-selector';
import { allFortunes } from '@/data/fortunes';
import { useStreak } from '@/hooks/useStreak';
import { useFortuneCollection } from '@/hooks/useFortuneCollection';
import { trackStreak } from '@/lib/analytics';

interface CategoryFortuneWidgetProps {
  category: FortuneCategory;
}

export default function CategoryFortuneWidget({ category }: CategoryFortuneWidgetProps) {
  const [fortune, setFortune] = useState<Fortune | null>(null);
  const [isNew, setIsNew] = useState(false);
  const { streak, recordVisit } = useStreak();
  const { addToCollection } = useFortuneCollection();

  const handleBreak = useCallback(
    (_method: CookieBreakMethod): Fortune => {
      const result = getRandomFortune(allFortunes, category);
      setFortune(result);
      const updated = recordVisit();
      if (updated.currentStreak > 1) {
        trackStreak(updated.currentStreak);
      }
      setIsNew(addToCollection(result.id));
      return result;
    },
    [category, recordVisit, addToCollection]
  );

  return (
    <>
      <section className="px-4 relative z-10">
        <FortuneCookie onBreak={handleBreak} fortune={fortune} streak={streak.currentStreak} isNewCollection={isNew} />
      </section>

      {fortune && (
        <section className="px-4 py-4 max-w-sm mx-auto animate-fade-in-up">
          <FortuneShare fortune={fortune} streak={streak.currentStreak} />
        </section>
      )}
    </>
  );
}
