'use client';

import { useCallback, useState } from 'react';
import FortuneCookie from '@/components/cookie/FortuneCookie';
import FortuneShare from '@/components/fortune/FortuneShare';
import HoroscopeSelector from '@/components/fortune/HoroscopeSelector';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Fortune, CookieBreakMethod } from '@/types/fortune';
import { getHoroscopeDailyFortune } from '@/lib/fortune-selector';
import { allFortunes } from '@/data/fortunes';
import { HOROSCOPE_SIGNS } from '@/types/horoscope';
import { useStreak } from '@/hooks/useStreak';
import { useFortuneCollection } from '@/hooks/useFortuneCollection';
import { trackStreak } from '@/lib/analytics';

interface HoroscopePageClientProps {
  sign: string;
}

export default function HoroscopePageClient({ sign }: HoroscopePageClientProps) {
  const horoscope = HOROSCOPE_SIGNS.find((s) => s.key === sign);
  const [fortune, setFortune] = useState<Fortune | null>(null);
  const [isNew, setIsNew] = useState(false);
  const { streak, recordVisit } = useStreak();
  const { addToCollection } = useFortuneCollection();

  const handleBreak = useCallback(
    (_method: CookieBreakMethod): Fortune => {
      const result = getHoroscopeDailyFortune(allFortunes, sign);
      setFortune(result);
      const updated = recordVisit();
      if (updated.currentStreak > 1) {
        trackStreak(updated.currentStreak);
      }
      setIsNew(addToCollection(result.id));
      return result;
    },
    [sign, recordVisit, addToCollection]
  );

  if (!horoscope) {
    return (
      <div className="star-field min-h-dvh flex flex-col">
        <Header />
        <main className="flex-1 pt-14 flex items-center justify-center">
          <p className="text-text-muted">존재하지 않는 별자리입니다.</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="star-field min-h-dvh flex flex-col">
      <Header />

      <main className="flex-1 pt-14">
        <section className="relative px-4 pt-8 pb-4">
          <div className="max-w-lg mx-auto text-center">
            <span className="text-4xl mb-2 block">{horoscope.emoji}</span>
            <h1 className="text-2xl md:text-3xl font-bold text-text-primary mb-2">
              <span className="text-cookie-gold">{horoscope.label}</span> 오늘의 운세
            </h1>
            <p className="text-sm text-text-muted mb-6">
              {horoscope.dateRange} | {horoscope.element}의 별자리 | 포춘쿠키를 깨고 확인하세요
            </p>
          </div>
        </section>

        <section className="px-4 relative z-10">
          <FortuneCookie onBreak={handleBreak} fortune={fortune} streak={streak.currentStreak} isNewCollection={isNew} />
        </section>

        {fortune && (
          <section className="px-4 py-4 max-w-sm mx-auto animate-fade-in-up">
            <FortuneShare fortune={fortune} streak={streak.currentStreak} />
          </section>
        )}

        <section className="px-4 py-8 mt-4">
          <div className="max-w-lg mx-auto">
            <h2 className="text-center text-sm text-text-muted mb-4">
              다른 별자리 보기
            </h2>
            <HoroscopeSelector activeSign={sign} />
          </div>
        </section>

        <section className="px-4 py-8 max-w-2xl mx-auto">
          <div className="bg-bg-card/30 rounded-xl p-6 border border-white/5">
            <h2 className="text-lg font-semibold text-cookie-gold mb-3">
              {horoscope.label} 운세란?
            </h2>
            <p className="text-sm text-text-secondary leading-relaxed">
              {horoscope.label}({horoscope.dateRange})의 오늘 하루 운세를 포춘쿠키로 확인해보세요.
              매일 달라지는 별자리 운세를 통해 오늘 하루의 방향을 가볍게 점쳐볼 수 있습니다.
              {horoscope.label}은(는) {horoscope.element}의 원소에 속하는 별자리로,
              서양 점성술에 기반한 재미있는 운세입니다.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
