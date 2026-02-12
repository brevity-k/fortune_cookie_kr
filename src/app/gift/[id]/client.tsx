'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import FortuneCookie from '@/components/cookie/FortuneCookie';
import FortuneShare from '@/components/fortune/FortuneShare';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Fortune, CookieBreakMethod } from '@/types/fortune';
import { allFortunes } from '@/data/fortunes';
import { getFortuneFromId } from '@/lib/fortune-selector';

interface GiftPageClientProps {
  giftId: string;
}

export default function GiftPageClient({ giftId }: GiftPageClientProps) {
  const [fortune, setFortune] = useState<Fortune | null>(null);

  const handleBreak = useCallback((_method: CookieBreakMethod): Fortune => {
    const result = getFortuneFromId(allFortunes, giftId);
    setFortune(result);
    return result;
  }, [giftId]);

  return (
    <div className="star-field min-h-dvh flex flex-col">
      <Header />
      <main className="flex-1 pt-14">
        <section className="relative px-4 pt-8 pb-4">
          <div className="max-w-lg mx-auto text-center">
            <p className="text-sm text-cookie-gold mb-2">
              🎁 누군가 당신에게 포춘쿠키를 선물했어요!
            </p>
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

            {/* Viral CTA: Send your own cookie */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="mt-6 text-center"
            >
              <p className="text-sm text-text-muted mb-3">
                나도 친구에게 포춘쿠키를 보내볼까요?
              </p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-cookie-gold/20 border border-cookie-gold/30 text-cookie-gold hover:bg-cookie-gold/30 transition-colors text-sm font-medium"
              >
                🥠 나도 포춘쿠키 보내기
              </Link>
            </motion.div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}
