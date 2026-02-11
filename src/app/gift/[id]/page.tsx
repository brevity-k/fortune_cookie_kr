'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import FortuneCookie from '@/components/cookie/FortuneCookie';
import FortuneShare from '@/components/fortune/FortuneShare';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Fortune, CookieBreakMethod } from '@/types/fortune';
import { allFortunes } from '@/data/fortunes';

function getFortuneFromId(id: string): Fortune {
  // Use the gift ID as a seed to deterministically select a fortune
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    const char = id.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  const index = Math.abs(hash) % allFortunes.length;
  return allFortunes[index];
}

export default function GiftPage() {
  const params = useParams();
  const giftId = params.id as string;
  const [fortune, setFortune] = useState<Fortune | null>(null);
  const [isGift, setIsGift] = useState(true);

  useEffect(() => {
    if (giftId) {
      setIsGift(true);
    }
  }, [giftId]);

  const handleBreak = (_method: CookieBreakMethod): Fortune => {
    const result = getFortuneFromId(giftId);
    setFortune(result);
    return result;
  };

  return (
    <div className="star-field min-h-dvh flex flex-col">
      <Header />
      <main className="flex-1 pt-14">
        <section className="relative px-4 pt-8 pb-4">
          <div className="max-w-lg mx-auto text-center">
            {isGift && (
              <p className="text-sm text-cookie-gold mb-2">
                🎁 누군가 당신에게 포춘쿠키를 선물했어요!
              </p>
            )}
            <h1 className="text-2xl md:text-3xl font-bold text-text-primary mb-2">
              선물 <span className="text-cookie-gold">포춘쿠키</span>
            </h1>
            <p className="text-sm text-text-muted mb-6">
              쿠키를 깨고 특별한 운세를 확인하세요
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
      </main>
      <Footer />
    </div>
  );
}
