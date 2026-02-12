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

interface MBTIPageClientProps {
  mbtiType: string;
}

export default function MBTIPageClient({ mbtiType }: MBTIPageClientProps) {
  const mbti = MBTI_TYPES.find((m) => m.key === mbtiType);
  const [fortune, setFortune] = useState<Fortune | null>(null);

  const handleBreak = useCallback(
    (_method: CookieBreakMethod): Fortune => {
      const result = getMBTIDailyFortune(allFortunes, mbtiType);
      setFortune(result);
      return result;
    },
    [mbtiType]
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
          <FortuneCookie onBreak={handleBreak} fortune={fortune} />
        </section>

        {fortune && (
          <section className="px-4 py-4 max-w-sm mx-auto animate-fade-in-up">
            <FortuneShare fortune={fortune} />
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

        <section className="px-4 py-8 max-w-2xl mx-auto">
          <div className="bg-bg-card/30 rounded-xl p-6 border border-white/5">
            <h2 className="text-lg font-semibold text-cookie-gold mb-3">
              {mbti.label} 포춘쿠키란?
            </h2>
            <p className="text-sm text-text-secondary leading-relaxed">
              {mbti.label}({mbti.description}) 유형을 위한 맞춤 포춘쿠키 운세입니다.
              매일 달라지는 MBTI별 운세를 통해 오늘 하루의 기운을 가볍게 점쳐보세요.
              포춘쿠키를 깨는 재미와 함께 나의 성격 유형에 맞는 운세 메시지를
              확인할 수 있습니다.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
