'use client';

import { useCallback } from 'react';
import FortuneCookie from '@/components/cookie/FortuneCookie';
import FortuneShare from '@/components/fortune/FortuneShare';
import { randomFortuneAction } from '@/app/fortune-actions';
import { useFortuneBreak } from '@/hooks/useFortuneBreak';

export default function HomeFortuneWidget() {
  const { fortune, isNew, streak, handleBreak } = useFortuneBreak(
    useCallback(() => randomFortuneAction(), [])
  );

  return (
    <>
      <section className="px-4 relative z-10">
        <FortuneCookie onBreak={handleBreak} streak={streak} isNewCollection={isNew} />
      </section>

      {fortune && (
        <section className="px-4 py-4 max-w-sm mx-auto animate-fade-in-up">
          <FortuneShare fortune={fortune} streak={streak} />
        </section>
      )}
    </>
  );
}
