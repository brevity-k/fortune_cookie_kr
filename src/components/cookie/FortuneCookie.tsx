'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, useMotionValue, useAnimation } from 'motion/react';
import confetti from 'canvas-confetti';
import CookieSVG from './CookieSVG';
import InteractionHint from './InteractionHint';
import FortunePaper from './FortunePaper';
import { CookieState, CookieBreakMethod, Fortune } from '@/types/fortune';
import { useSoundEffects } from '@/hooks/useSoundEffects';
import { useShakeDetection } from '@/hooks/useShakeDetection';
import { useCookieInteraction } from '@/hooks/useCookieInteraction';
import { trackCookieBreak, trackFortuneReveal } from '@/lib/analytics';
import MuteToggle from '@/components/ui/MuteToggle';

interface FortuneCookieProps {
  onBreak: (method: CookieBreakMethod) => Fortune;
  fortune: Fortune | null;
  streak?: number;
  isNewCollection?: boolean;
}

export default function FortuneCookie({ onBreak, fortune, streak = 0, isNewCollection = false }: FortuneCookieProps) {
  const [cookieState, setCookieState] = useState<CookieState>('idle');
  const [breakMethod, setBreakMethod] = useState<CookieBreakMethod | null>(null);
  const [currentFortune, setCurrentFortune] = useState<Fortune | null>(fortune);

  const containerRef = useRef<HTMLDivElement>(null);
  const isBreakingRef = useRef(false);

  const x = useMotionValue(0);
  const controls = useAnimation();
  const { play, isMuted, toggleMute } = useSoundEffects();

  const triggerBreak = useCallback(
    (method: CookieBreakMethod) => {
      if (isBreakingRef.current) return;
      isBreakingRef.current = true;
      setBreakMethod(method);

      setCookieState('breaking');
      play('break');
      trackCookieBreak(method);

      setTimeout(() => {
        setCookieState('broken');

        // Fire confetti
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.5 },
          colors: ['#FFD700', '#D4A574', '#C73E3E', '#FFF8E7'],
        });

        play('sparkle');

        const result = onBreak(method);
        setCurrentFortune(result);
        trackFortuneReveal(result.category);

        setTimeout(() => {
          setCookieState('revealed');
          play('paper');
        }, 600);
      }, 400);
    },
    [onBreak, play]
  );

  // Shake detection (mobile) — enableShake must be called from a user gesture for iOS
  const { enableShake } = useShakeDetection({
    threshold: 15,
    onShake: useCallback(() => {
      if (cookieState !== 'broken' && cookieState !== 'revealed' && cookieState !== 'breaking') {
        triggerBreak('shake');
      }
    }, [cookieState, triggerBreak]),
  });

  const { longPressProgress, handleClick, handlePointerDown, handlePointerUp, handleDragStart, handleDragEnd, resetInteraction } =
    useCookieInteraction({ cookieState, triggerBreak, play, enableShake, setCookieState, controls });

  // Reset
  const handleReset = useCallback(() => {
    confetti.reset();
    setCookieState('idle');
    setBreakMethod(null);
    setCurrentFortune(null);
    resetInteraction();
    isBreakingRef.current = false;
    x.set(0);
    controls.start({ x: 0, y: 0 });
  }, [controls, x, resetInteraction]);

  // Auto-scroll to fortune result on reveal
  useEffect(() => {
    if (cookieState === 'revealed') {
      const timer = setTimeout(() => {
        containerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 900);
      return () => clearTimeout(timer);
    }
  }, [cookieState]);

  // Sync external fortune
  useEffect(() => {
    if (fortune !== null && fortune !== currentFortune) {
      setCurrentFortune(fortune);
    }
  }, [fortune, currentFortune]);

  const isInteractive = cookieState !== 'broken' && cookieState !== 'revealed' && cookieState !== 'breaking';

  return (
    <div ref={containerRef} className="flex flex-col items-center justify-center min-h-[60vh] relative">
      {/* Cookie Container */}
      {cookieState !== 'revealed' && (
        <motion.div
          className={`relative cursor-pointer select-none ${
            isInteractive ? 'animate-cookie-float animate-cookie-glow' : ''
          }`}
          style={{
            width: 'min(80vw, 300px)',
            height: 'min(56vw, 210px)',
            x,
          }}
          animate={controls}
          drag={isInteractive}
          dragConstraints={{ left: -150, right: 150, top: -100, bottom: 100 }}
          dragElastic={0.7}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onClick={isInteractive ? handleClick : undefined}
          onPointerDown={isInteractive ? handlePointerDown : undefined}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          whileTap={isInteractive ? { scale: 0.95 } : undefined}
          whileHover={isInteractive ? { scale: 1.05 } : undefined}
          role="button"
          aria-label="포춘쿠키를 깨보세요"
          tabIndex={0}
        >
          <CookieSVG state={cookieState} longPressProgress={longPressProgress} />

          {/* Glow effect behind cookie */}
          {isInteractive && (
            <div className="absolute inset-0 -z-10 rounded-full bg-cookie-gold/10 blur-3xl scale-150" />
          )}
        </motion.div>
      )}

      {/* Fortune Paper */}
      {cookieState === 'revealed' && currentFortune && (
        <FortunePaper fortune={currentFortune} breakMethod={breakMethod} streak={streak} isNewCollection={isNewCollection} />
      )}

      {/* Interaction hints */}
      {cookieState === 'idle' && <InteractionHint />}

      {/* Break method indicator */}
      {cookieState === 'broken' && breakMethod && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-text-muted mt-4"
        >
          {breakMethod === 'click' && '🖱️ 클릭으로 깼어요!'}
          {breakMethod === 'drag' && '💨 던져서 깼어요!'}
          {breakMethod === 'longpress' && '💪 눌러서 으깼어요!'}
          {breakMethod === 'shake' && '📱 흔들어서 깼어요!'}
          {breakMethod === 'doubletap' && '⚡ 태권 가르기!'}
        </motion.p>
      )}

      {/* Try again button */}
      {cookieState === 'revealed' && (
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
          onClick={handleReset}
          className="mt-8 px-6 py-3 rounded-full bg-cookie-gold/20 border border-cookie-gold/30 text-cookie-gold hover:bg-cookie-gold/30 transition-colors text-sm font-medium"
        >
          🥠 다시 뽑기
        </motion.button>
      )}

      <MuteToggle isMuted={isMuted} onToggle={toggleMute} />
    </div>
  );
}
