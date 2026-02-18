'use client';

import { useCallback, useState } from 'react';
import FortuneCookie from '@/components/cookie/FortuneCookie';
import FortuneShare from '@/components/fortune/FortuneShare';
import MBTISelector from '@/components/fortune/MBTISelector';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Fortune, CookieBreakMethod } from '@/types/fortune';
import { getMBTIDailyFortune } from '@/lib/fortune-selector';
import { allFortunes } from '@/data/fortunes';
import { MBTI_TYPES } from '@/types/mbti';
import { useStreak } from '@/hooks/useStreak';
import { useFortuneCollection } from '@/hooks/useFortuneCollection';
import { trackStreak } from '@/lib/analytics';
import SEOContentSection from '@/components/seo/SEOContentSection';
import { MBTI_SEO_CONTENT } from '@/data/seo/mbti-content';

interface MBTIPageClientProps {
  mbtiType: string;
}

export default function MBTIPageClient({ mbtiType }: MBTIPageClientProps) {
  const mbti = MBTI_TYPES.find((m) => m.key === mbtiType);
  const [fortune, setFortune] = useState<Fortune | null>(null);
  const [isNew, setIsNew] = useState(false);
  const { streak, recordVisit } = useStreak();
  const { addToCollection } = useFortuneCollection();

  const handleBreak = useCallback(
    (_method: CookieBreakMethod): Fortune => {
      const result = getMBTIDailyFortune(allFortunes, mbtiType);
      setFortune(result);
      const updated = recordVisit();
      if (updated.currentStreak > 1) {
        trackStreak(updated.currentStreak);
      }
      setIsNew(addToCollection(result.id));
      return result;
    },
    [mbtiType, recordVisit, addToCollection]
  );

  if (!mbti) {
    return (
      <div className="star-field min-h-dvh flex flex-col">
        <Header />
        <main className="flex-1 pt-14 flex items-center justify-center">
          <p className="text-text-muted">존재하지 않는 MBTI 유형입니다.</p>
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
            <span className="text-4xl mb-2 block">{mbti.emoji}</span>
            <h1 className="text-2xl md:text-3xl font-bold text-text-primary mb-2">
              <span className="text-cookie-gold">{mbti.label}</span> 오늘의 운세
            </h1>
            <p className="text-sm text-text-muted mb-6">
              {mbti.description} | 포춘쿠키를 깨고 확인하세요
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
              다른 MBTI 보기
            </h2>
            <MBTISelector activeType={mbtiType} />
          </div>
        </section>

        {MBTI_SEO_CONTENT[mbtiType] && (
          <SEOContentSection
            title={mbti.label}
            content={MBTI_SEO_CONTENT[mbtiType]}
          />
        )}
      </main>

      <Footer />
    </div>
  );
}
