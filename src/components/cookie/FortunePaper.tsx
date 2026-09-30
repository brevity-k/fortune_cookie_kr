'use client';

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Fortune, CookieBreakMethod, CATEGORIES } from '@/types/fortune';
import { getRatingStars, getRatingLabel } from '@/lib/fortune-selector';

interface FortunePaperProps {
  fortune: Fortune;
  breakMethod: CookieBreakMethod | null;
  streak?: number;
  isNewCollection?: boolean;
}

export default function FortunePaper({ fortune, breakMethod, streak = 0, isNewCollection = false }: FortunePaperProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [showDetails, setShowDetails] = useState(false);
  const category = CATEGORIES.find((c) => c.key === fortune.category);

  // Typewriter effect (parent keys this component by fortune id, so state starts fresh per fortune)
  useEffect(() => {
    let index = 0;
    const text = fortune.message;
    let detailsTimer: ReturnType<typeof setTimeout> | undefined;

    const timer = setInterval(() => {
      index += 1;
      setDisplayedText(text.slice(0, index));
      if (index >= text.length) {
        clearInterval(timer);
        detailsTimer = setTimeout(() => setShowDetails(true), 300);
      }
    }, 50);

    return () => {
      clearInterval(timer);
      clearTimeout(detailsTimer);
    };
  }, [fortune.message]);

  return (
    <motion.div
      initial={{ scaleY: 0, scaleX: 0.5, opacity: 0 }}
      animate={{ scaleY: 1, scaleX: 1, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="w-full max-w-sm mx-auto"
    >
      <div className="fortune-paper rounded-lg p-6 text-center relative overflow-hidden">
        {/* Category badge */}
        <div className="flex justify-center mb-4">
          <span
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
            style={{
              backgroundColor: `${category?.color}20`,
              color: category?.color,
            }}
          >
            {category?.emoji} {category?.label}
          </span>
        </div>

        {/* Fortune emoji */}
        <div className="text-4xl mb-4">{fortune.emoji}</div>

        {/* Main message with typewriter */}
        <p className="text-lg font-medium text-gray-800 leading-relaxed min-h-[3rem] mb-3">
          {displayedText}
          {displayedText.length < fortune.message.length && (
            <span className="inline-block w-0.5 h-5 bg-gray-800 animate-pulse ml-0.5 align-middle" />
          )}
        </p>

        {/* Details appear after typewriter */}
        {showDetails && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Interpretation */}
            <p className="text-sm text-gray-600 mb-4 leading-relaxed">
              {fortune.interpretation}
            </p>

            {/* Divider */}
            <div className="border-t border-amber-200/50 my-4" />

            {/* Fortune details */}
            <div className="grid grid-cols-3 gap-3 text-xs text-gray-600">
              <div>
                <p className="text-gray-400 mb-1">운세 등급</p>
                <p className="rating-star text-sm">
                  {getRatingStars(fortune.rating)}
                </p>
                <p className="text-amber-700 font-medium">
                  {getRatingLabel(fortune.rating)}
                </p>
              </div>
              <div>
                <p className="text-gray-400 mb-1">행운의 숫자</p>
                <p className="text-xl font-bold text-amber-700">
                  {fortune.luckyNumber}
                </p>
              </div>
              <div>
                <p className="text-gray-400 mb-1">행운의 색</p>
                <p className="text-sm font-medium text-amber-700">
                  {fortune.luckyColor}
                </p>
              </div>
            </div>

            {/* Streak & Collection badges */}
            {(streak > 1 || isNewCollection) && (
              <div className="flex justify-center gap-2 mt-3">
                {streak > 1 && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    🔥 연속 {streak}일째
                  </span>
                )}
                {isNewCollection && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    ✨ New!
                  </span>
                )}
              </div>
            )}

            {/* Break method badge */}
            {breakMethod && (
              <div className="mt-4 pt-3 border-t border-amber-200/30">
                <span className="text-xs text-gray-400">
                  {breakMethod === 'click' && '🖱️ 클릭으로 열었습니다'}
                  {breakMethod === 'drag' && '💨 던져서 열었습니다'}
                  {breakMethod === 'longpress' && '💪 꾹 눌러서 열었습니다'}
                  {breakMethod === 'shake' && '📱 흔들어서 열었습니다'}
                  {breakMethod === 'doubletap' && '⚡ 태권 가르기로 열었습니다'}
                </span>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
