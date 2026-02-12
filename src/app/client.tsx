'use client';

import { useCallback, useState } from 'react';
import FortuneCookie from '@/components/cookie/FortuneCookie';
import FortuneShare from '@/components/fortune/FortuneShare';
import CategorySelector from '@/components/fortune/CategorySelector';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Fortune, CookieBreakMethod } from '@/types/fortune';
import { getRandomFortune } from '@/lib/fortune-selector';
import { allFortunes } from '@/data/fortunes';
import { useStreak } from '@/hooks/useStreak';
import { useFortuneCollection } from '@/hooks/useFortuneCollection';
import { trackStreak } from '@/lib/analytics';

export default function HomeClient() {
  const [fortune, setFortune] = useState<Fortune | null>(null);
  const [isNew, setIsNew] = useState(false);
  const { streak, recordVisit } = useStreak();
  const { addToCollection } = useFortuneCollection();

  const handleBreak = useCallback((_method: CookieBreakMethod): Fortune => {
    const result = getRandomFortune(allFortunes);
    setFortune(result);
    const updated = recordVisit();
    if (updated.currentStreak > 1) {
      trackStreak(updated.currentStreak);
    }
    setIsNew(addToCollection(result.id));
    return result;
  }, [recordVisit, addToCollection]);

  return (
    <div className="star-field min-h-dvh flex flex-col">
      <Header />

      <main className="flex-1 pt-14">
        {/* Hero section */}
        <section className="relative px-4 pt-8 pb-4">
          <div className="max-w-lg mx-auto text-center">
            <h1 className="text-2xl md:text-3xl font-bold text-text-primary mb-2">
              오늘의 <span className="text-cookie-gold">포춘쿠키</span>
            </h1>
            <p className="text-sm text-text-muted mb-6">
              쿠키를 깨고 오늘의 운세를 확인하세요
            </p>
          </div>
        </section>

        {/* Cookie interaction area */}
        <section className="px-4 relative z-10">
          <FortuneCookie onBreak={handleBreak} fortune={fortune} streak={streak.currentStreak} isNewCollection={isNew} />
        </section>

        {/* Share buttons (after fortune revealed) */}
        {fortune && (
          <section className="px-4 py-4 max-w-sm mx-auto animate-fade-in-up">
            <FortuneShare fortune={fortune} streak={streak.currentStreak} />
          </section>
        )}

        {/* Category selector */}
        <section className="px-4 py-8 mt-4">
          <div className="max-w-lg mx-auto">
            <h2 className="text-center text-sm text-text-muted mb-4">
              카테고리별 운세 보기
            </h2>
            <CategorySelector />
          </div>
        </section>

        {/* SEO content */}
        <section className="px-4 py-8 max-w-2xl mx-auto">
          <div className="bg-bg-card/30 rounded-xl p-6 border border-white/5">
            <h2 className="text-lg font-semibold text-cookie-gold mb-3">
              포춘쿠키란?
            </h2>
            <p className="text-sm text-text-secondary leading-relaxed mb-4">
              포춘쿠키(Fortune Cookie)는 안에 운세가 적힌 종이가 들어있는 쿠키입니다.
              주로 중국 음식점에서 식사 후 제공되며, 쿠키를 깨면 그 안에서
              행운의 메시지, 격언, 또는 운세를 발견할 수 있습니다.
            </p>
            <p className="text-sm text-text-secondary leading-relaxed mb-4">
              포춘쿠키 온라인에서는 실제 쿠키를 깨는 것처럼 클릭, 드래그,
              길게 누르기, 흔들기 등 다양한 방법으로 쿠키를 깨고 오늘의
              운세를 확인할 수 있습니다.
            </p>
            <p className="text-sm text-text-secondary leading-relaxed">
              사랑운, 재물운, 건강운, 학업운, 대인운, 총운 등 6가지
              카테고리에서 매일 새로운 운세를 무료로 만나보세요. 친구에게
              공유하여 함께 오늘의 운세를 확인해보는 것도 좋습니다!
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
