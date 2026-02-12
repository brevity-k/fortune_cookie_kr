'use client';

import { useCallback, useState } from 'react';
import FortuneCookie from '@/components/cookie/FortuneCookie';
import FortuneShare from '@/components/fortune/FortuneShare';
import ZodiacSelector from '@/components/fortune/ZodiacSelector';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Fortune, CookieBreakMethod } from '@/types/fortune';
import { getZodiacDailyFortune } from '@/lib/fortune-selector';
import { allFortunes } from '@/data/fortunes';
import { ZODIAC_ANIMALS } from '@/types/zodiac';
import { useStreak } from '@/hooks/useStreak';
import { useFortuneCollection } from '@/hooks/useFortuneCollection';
import { trackStreak } from '@/lib/analytics';

interface ZodiacPageClientProps {
  animal: string;
}

export default function ZodiacPageClient({ animal }: ZodiacPageClientProps) {
  const zodiac = ZODIAC_ANIMALS.find((z) => z.key === animal);
  const [fortune, setFortune] = useState<Fortune | null>(null);
  const [isNew, setIsNew] = useState(false);
  const { streak, recordVisit } = useStreak();
  const { addToCollection } = useFortuneCollection();

  const handleBreak = useCallback(
    (_method: CookieBreakMethod): Fortune => {
      const result = getZodiacDailyFortune(allFortunes, animal);
      setFortune(result);
      const updated = recordVisit();
      if (updated.currentStreak > 1) {
        trackStreak(updated.currentStreak);
      }
      setIsNew(addToCollection(result.id));
      return result;
    },
    [animal, recordVisit, addToCollection]
  );

  if (!zodiac) {
    return (
      <div className="star-field min-h-dvh flex flex-col">
        <Header />
        <main className="flex-1 pt-14 flex items-center justify-center">
          <p className="text-text-muted">존재하지 않는 띠입니다.</p>
        </main>
        <Footer />
      </div>
    );
  }

  const yearStr = zodiac.years.slice(-4).join(', ');

  return (
    <div className="star-field min-h-dvh flex flex-col">
      <Header />

      <main className="flex-1 pt-14">
        <section className="relative px-4 pt-8 pb-4">
          <div className="max-w-lg mx-auto text-center">
            <span className="text-4xl mb-2 block">{zodiac.emoji}</span>
            <h1 className="text-2xl md:text-3xl font-bold text-text-primary mb-2">
              <span className="text-cookie-gold">{zodiac.label}</span> 오늘의 운세
            </h1>
            <p className="text-sm text-text-muted mb-6">
              {yearStr}년생 | 포춘쿠키를 깨고 확인하세요
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
              다른 띠 보기
            </h2>
            <ZodiacSelector activeAnimal={animal} />
          </div>
        </section>

        <section className="px-4 py-8 max-w-2xl mx-auto">
          <div className="bg-bg-card/30 rounded-xl p-6 border border-white/5">
            <h2 className="text-lg font-semibold text-cookie-gold mb-3">
              {zodiac.label} 운세란?
            </h2>
            <p className="text-sm text-text-secondary leading-relaxed">
              {zodiac.label}({yearStr}년생)의 오늘 하루 운세를 포춘쿠키로 확인해보세요.
              매일 달라지는 띠별 운세를 통해 오늘 하루의 방향을 가볍게 점쳐볼 수 있습니다.
              띠별 운세는 12지신(십이지) 동물에 기반한 한국 전통 운세로,
              재미와 영감을 위한 것입니다.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
