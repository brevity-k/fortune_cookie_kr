'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, useMotionValue, useAnimation, PanInfo } from 'motion/react';
import confetti from 'canvas-confetti';
import CookieSVG from './CookieSVG';
import InteractionHint from './InteractionHint';
import FortunePaper from './FortunePaper';
import { CookieState, CookieBreakMethod, Fortune } from '@/types/fortune';
import { useSoundEffects } from '@/hooks/useSoundEffects';
import { useShakeDetection } from '@/hooks/useShakeDetection';
import MuteToggle from '@/components/ui/MuteToggle';

interface FortuneCookieProps {
  onBreak: (method: CookieBreakMethod) => Fortune;
  fortune: Fortune | null;
}

export default function FortuneCookie({ onBreak, fortune }: FortuneCookieProps) {
  const [cookieState, setCookieState] = useState<CookieState>('idle');
  const [breakMethod, setBreakMethod] = useState<CookieBreakMethod | null>(null);
  const [longPressProgress, setLongPressProgress] = useState(0);
  const [currentFortune, setCurrentFortune] = useState<Fortune | null>(fortune);

  const clickCountRef = useRef(0);
  const longPressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const longPressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastTapRef = useRef(0);
  const isBreakingRef = useRef(false);
  const isDraggingRef = useRef(false);
  const dragStartPosRef = useRef({ x: 0, y: 0 });

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

        setTimeout(() => {
          setCookieState('revealed');
          play('paper');
        }, 600);
      }, 400);
    },
    [onBreak, play]
  );

  // Click interaction: 3 clicks to break
  const handleClick = useCallback(() => {
    // Ignore click if we just finished a drag
    if (isDraggingRef.current) {
      isDraggingRef.current = false;
      return;
    }
    if (cookieState !== 'idle' && cookieState !== 'crack-1' && cookieState !== 'crack-2') return;

    // Check for double tap
    const now = Date.now();
    if (now - lastTapRef.current < 300) {
      lastTapRef.current = 0;
      triggerBreak('doubletap');
      return;
    }
    lastTapRef.current = now;

    clickCountRef.current += 1;

    if (clickCountRef.current === 1) {
      setCookieState('crack-1');
      play('crack1');
    } else if (clickCountRef.current === 2) {
      setCookieState('crack-2');
      play('crack2');
    } else if (clickCountRef.current >= 3) {
      triggerBreak('click');
    }
  }, [cookieState, triggerBreak, play]);

  // Shake detection (mobile) — enableShake must be called from a user gesture for iOS
  const { enableShake } = useShakeDetection({
    threshold: 15,
    onShake: useCallback(() => {
      if (cookieState !== 'broken' && cookieState !== 'revealed' && cookieState !== 'breaking') {
        triggerBreak('shake');
      }
    }, [cookieState, triggerBreak]),
  });

  // Long press interaction
  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    if (cookieState === 'broken' || cookieState === 'revealed' || cookieState === 'breaking') return;

    // Request DeviceMotion permission on first interaction (required by iOS)
    enableShake();

    dragStartPosRef.current = { x: e.clientX, y: e.clientY };
    isDraggingRef.current = false;

    setLongPressProgress(0);
    const startTime = Date.now();

    longPressIntervalRef.current = setInterval(() => {
      // Cancel long press if dragging
      if (isDraggingRef.current) {
        if (longPressIntervalRef.current) clearInterval(longPressIntervalRef.current);
        setLongPressProgress(0);
        return;
      }
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / 1500, 1);
      setLongPressProgress(progress);

      if (progress >= 1) {
        if (longPressIntervalRef.current) clearInterval(longPressIntervalRef.current);
        if (longPressTimerRef.current) clearTimeout(longPressTimerRef.current);
        triggerBreak('longpress');
      }
    }, 50);

    longPressTimerRef.current = setTimeout(() => {
      // Handled in interval above
    }, 1500);
  }, [cookieState, triggerBreak, enableShake]);

  const handlePointerUp = useCallback(() => {
    if (longPressIntervalRef.current) clearInterval(longPressIntervalRef.current);
    if (longPressTimerRef.current) clearTimeout(longPressTimerRef.current);
    setLongPressProgress(0);
  }, []);

  // Drag interaction
  const handleDragStart = useCallback(() => {
    isDraggingRef.current = true;
    // Cancel long press when dragging starts
    if (longPressIntervalRef.current) clearInterval(longPressIntervalRef.current);
    if (longPressTimerRef.current) clearTimeout(longPressTimerRef.current);
    setLongPressProgress(0);
  }, []);

  const handleDragEnd = useCallback(
    (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      if (cookieState === 'broken' || cookieState === 'revealed' || cookieState === 'breaking') return;

      const velocity = Math.abs(info.velocity.x) + Math.abs(info.velocity.y);
      const distance = Math.abs(info.offset.x) + Math.abs(info.offset.y);

      if (velocity > 300 || distance > 120) {
        triggerBreak('drag');
      } else {
        controls.start({ x: 0, y: 0, transition: { type: 'spring', stiffness: 300 } });
      }
    },
    [cookieState, triggerBreak, controls]
  );

  // Reset
  const handleReset = useCallback(() => {
    confetti.reset();
    setCookieState('idle');
    setBreakMethod(null);
    setCurrentFortune(null);
    setLongPressProgress(0);
    clickCountRef.current = 0;
    isBreakingRef.current = false;
    controls.start({ x: 0, y: 0 });
  }, [controls]);

  // Sync external fortune
  useEffect(() => {
    if (fortune !== null && fortune !== currentFortune) {
      setCurrentFortune(fortune);
    }
  }, [fortune, currentFortune]);

  const isInteractive = cookieState !== 'broken' && cookieState !== 'revealed' && cookieState !== 'breaking';

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] relative">
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
        <FortunePaper fortune={currentFortune} breakMethod={breakMethod} />
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
