'use client';

import { useCallback } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import FortuneCookie from '@/components/cookie/FortuneCookie';
import FortuneShare from '@/components/fortune/FortuneShare';
import { fortuneFromIdAction } from '@/app/fortune-actions';
import { useFortuneBreak } from '@/hooks/useFortuneBreak';

interface GiftFortuneWidgetProps {
  giftId: string;
}

export default function GiftFortuneWidget({ giftId }: GiftFortuneWidgetProps) {
  const { fortune, isNew, streak, handleBreak } = useFortuneBreak(
    useCallback(() => fortuneFromIdAction(giftId), [giftId])
  );

  return (
    <>
      <section className="px-4 relative z-10">
        <FortuneCookie onBreak={handleBreak} streak={streak} isNewCollection={isNew} />
      </section>

      {fortune && (
        <section className="px-4 py-4 max-w-sm mx-auto animate-fade-in-up">
          <FortuneShare fortune={fortune} streak={streak} />

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
    </>
  );
}
