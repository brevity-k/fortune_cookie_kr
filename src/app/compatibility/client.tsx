'use client';

import { useState, useCallback } from 'react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { Fortune } from '@/types/fortune';
import { getCompatibilityScore, getRatingStars } from '@/lib/fortune-selector';
import { compatibilityFortunesAction } from '@/app/fortune-actions';
import { useShareFortune } from '@/hooks/useShareFortune';
import { SITE_URL } from '@/lib/env';

const MIN_BIRTH_YEAR = 1940;
const MAX_BIRTH_YEAR = 2010;

type Step = 'input' | 'result';

function getScoreEmoji(score: number): string {
  if (score >= 85) return '💖';
  if (score >= 70) return '💕';
  if (score >= 55) return '😊';
  return '🤔';
}

function getScoreMessage(score: number): string {
  if (score >= 85) return '환상의 궁합! 천생연분이에요!';
  if (score >= 70) return '아주 좋은 궁합이에요! 서로 잘 맞아요.';
  if (score >= 55) return '괜찮은 궁합이에요. 노력하면 더 좋아질 거예요!';
  return '서로 다른 점이 많지만, 그래서 더 재미있을 수 있어요!';
}

export default function CompatibilityWidget() {
  const [step, setStep] = useState<Step>('input');
  const [nameA, setNameA] = useState('');
  const [yearA, setYearA] = useState('');
  const [nameB, setNameB] = useState('');
  const [yearB, setYearB] = useState('');
  const [score, setScore] = useState(0);
  const [fortunes, setFortunes] = useState<[Fortune, Fortune] | null>(null);
  const { shareViaKakao } = useShareFortune();

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameA.trim() || !yearA.trim() || !nameB.trim() || !yearB.trim()) return;

    const yA = parseInt(yearA, 10);
    const yB = parseInt(yearB, 10);
    const isValidYear = (y: number) => !isNaN(y) && y >= MIN_BIRTH_YEAR && y <= MAX_BIRTH_YEAR;
    if (!isValidYear(yA) || !isValidYear(yB)) return;
    const s = getCompatibilityScore(nameA.trim(), yA, nameB.trim(), yB);
    let fA: Fortune, fB: Fortune;
    try {
      [fA, fB] = await compatibilityFortunesAction(nameA.trim(), yA, nameB.trim(), yB);
    } catch {
      alert('궁합 결과를 불러오지 못했습니다. 다시 시도해주세요.');
      return;
    }

    setScore(s);
    setFortunes([fA, fB]);
    setStep('result');

    confetti({
      particleCount: 60,
      spread: 80,
      origin: { y: 0.4 },
      colors: ['#FFD700', '#E74C3C', '#FF69B4', '#FFF8E7'],
    });
  }, [nameA, yearA, nameB, yearB]);

  const handleReset = () => {
    setStep('input');
    setNameA('');
    setYearA('');
    setNameB('');
    setYearB('');
    setScore(0);
    setFortunes(null);
  };

  const shareResult = () => {
    if (!fortunes) return;
    const fakeFortune: Fortune = {
      ...fortunes[0],
      shareText: `🥠💕 궁합 테스트 결과: ${nameA} ❤️ ${nameB} = ${score}%! ${getScoreEmoji(score)} ${getScoreMessage(score)}`,
    };
    shareViaKakao(fakeFortune);
  };

  const copyResult = async () => {
    if (!fortunes) return;
    const text = `🥠💕 궁합 포춘쿠키 결과\n\n${nameA} ❤️ ${nameB} = ${score}%\n${getScoreEmoji(score)} ${getScoreMessage(score)}\n\n${SITE_URL}/compatibility`;
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      alert('결과를 복사하지 못했습니다.');
    }
  };

  return (
    <>
      {step === 'input' && (
        <section className="px-4 max-w-md mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Person A */}
            <div className="bg-bg-card/40 rounded-xl p-5 border border-white/5">
              <p className="text-sm text-cookie-gold font-medium mb-3">첫 번째 사람</p>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="이름"
                  value={nameA}
                  onChange={(e) => setNameA(e.target.value)}
                  maxLength={20}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-bg-primary/60 border border-white/10 text-text-primary placeholder:text-text-muted text-sm focus:outline-none focus:border-cookie-gold/40"
                />
                <input
                  type="number"
                  placeholder="출생연도 (예: 1995)"
                  value={yearA}
                  onChange={(e) => setYearA(e.target.value)}
                  min={MIN_BIRTH_YEAR}
                  max={MAX_BIRTH_YEAR}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-bg-primary/60 border border-white/10 text-text-primary placeholder:text-text-muted text-sm focus:outline-none focus:border-cookie-gold/40"
                />
              </div>
            </div>

            {/* Heart divider */}
            <div className="text-center text-2xl">❤️</div>

            {/* Person B */}
            <div className="bg-bg-card/40 rounded-xl p-5 border border-white/5">
              <p className="text-sm text-cookie-gold font-medium mb-3">두 번째 사람</p>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="이름"
                  value={nameB}
                  onChange={(e) => setNameB(e.target.value)}
                  maxLength={20}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-bg-primary/60 border border-white/10 text-text-primary placeholder:text-text-muted text-sm focus:outline-none focus:border-cookie-gold/40"
                />
                <input
                  type="number"
                  placeholder="출생연도 (예: 1997)"
                  value={yearB}
                  onChange={(e) => setYearB(e.target.value)}
                  min={MIN_BIRTH_YEAR}
                  max={MAX_BIRTH_YEAR}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-bg-primary/60 border border-white/10 text-text-primary placeholder:text-text-muted text-sm focus:outline-none focus:border-cookie-gold/40"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-full bg-cookie-gold/20 border border-cookie-gold/30 text-cookie-gold hover:bg-cookie-gold/30 transition-colors font-medium"
            >
              🥠 궁합 확인하기
            </button>
          </form>
        </section>
      )}

      {step === 'result' && fortunes && (
        <section className="px-4 max-w-md mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            {/* Score */}
            <div className="bg-bg-card/40 rounded-xl p-6 border border-white/5 mb-6">
              <p className="text-sm text-text-muted mb-2">{nameA} ❤️ {nameB}</p>
              <div className="text-6xl font-bold text-cookie-gold mb-2">
                {score}%
              </div>
              <div className="text-3xl mb-3">{getScoreEmoji(score)}</div>
              <p className="text-sm text-text-secondary">{getScoreMessage(score)}</p>
            </div>

            {/* Two fortunes side by side */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {[fortunes[0], fortunes[1]].map((f, i) => (
                <div key={i} className="fortune-paper rounded-lg p-4 text-center">
                  <p className="text-xs text-gray-500 mb-1">{i === 0 ? nameA : nameB}의 운세</p>
                  <div className="text-2xl mb-2">{f.emoji}</div>
                  <p className="text-xs text-gray-700 leading-relaxed mb-2">{f.message}</p>
                  <p className="text-xs text-amber-600">{getRatingStars(f.rating)}</p>
                </div>
              ))}
            </div>

            {/* Share buttons */}
            <div className="flex flex-wrap justify-center gap-3 mb-6">
              <button
                onClick={shareResult}
                className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#FEE500] text-[#191919] text-sm font-medium hover:brightness-95 transition"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#191919">
                  <path d="M12 3C6.48 3 2 6.58 2 10.94c0 2.8 1.86 5.27 4.66 6.67-.15.56-.96 3.6-.99 3.82 0 0-.02.17.09.24.11.06.24.01.24.01.32-.04 3.7-2.44 4.28-2.86.55.08 1.13.12 1.72.12 5.52 0 10-3.58 10-7.94S17.52 3 12 3z" />
                </svg>
                카카오톡
              </button>
              <button
                onClick={copyResult}
                className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-bg-card border border-white/10 text-text-secondary text-sm hover:text-cookie-gold transition"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
                결과 복사
              </button>
            </div>

            <button
              onClick={handleReset}
              className="px-6 py-3 rounded-full bg-cookie-gold/20 border border-cookie-gold/30 text-cookie-gold hover:bg-cookie-gold/30 transition-colors text-sm font-medium"
            >
              🥠 다시 하기
            </button>
          </motion.div>
        </section>
      )}
    </>
  );
}
