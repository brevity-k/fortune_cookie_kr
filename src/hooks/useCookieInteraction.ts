'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useAnimation, PanInfo } from 'motion/react';
import { useSoundEffects } from '@/hooks/useSoundEffects';
import { CookieState, CookieBreakMethod } from '@/types/fortune';

const DOUBLE_TAP_THRESHOLD_MS = 300;

interface CookieInteractionOptions {
  cookieState: CookieState;
  triggerBreak: (method: CookieBreakMethod) => void;
  play: ReturnType<typeof useSoundEffects>['play'];
  enableShake: () => void;
  setCookieState: React.Dispatch<React.SetStateAction<CookieState>>;
  controls: ReturnType<typeof useAnimation>;
}

interface CookieInteractionResult {
  longPressProgress: number;
  handleClick: () => void;
  handlePointerDown: (e: React.PointerEvent) => void;
  handlePointerUp: () => void;
  handleDragStart: () => void;
  handleDragEnd: (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => void;
  resetInteraction: () => void;
}

export function useCookieInteraction({
  cookieState,
  triggerBreak,
  play,
  enableShake,
  setCookieState,
  controls,
}: CookieInteractionOptions): CookieInteractionResult {
  const [longPressProgress, setLongPressProgress] = useState(0);

  const clickCountRef = useRef(0);
  const lastTapRef = useRef(0);
  const isDraggingRef = useRef(false);
  const dragStartPosRef = useRef({ x: 0, y: 0 });
  const longPressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const longPressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Click interaction: 3 clicks to break
  const handleClick = useCallback(() => {
    // Ignore click if we just finished a drag
    if (isDraggingRef.current) {
      isDraggingRef.current = false;
      return;
    }
    if (cookieState !== 'idle' && cookieState !== 'crack-1' && cookieState !== 'crack-2') return;

    // Request DeviceMotion permission on first click (iOS requires user gesture from click/touchend)
    enableShake();

    // Check for double tap
    const now = Date.now();
    if (now - lastTapRef.current < DOUBLE_TAP_THRESHOLD_MS) {
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
  }, [cookieState, triggerBreak, play, enableShake, setCookieState]);

  // Long press interaction
  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    if (cookieState === 'broken' || cookieState === 'revealed' || cookieState === 'breaking') return;

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
  }, [cookieState, triggerBreak]);

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

  const resetInteraction = useCallback(() => {
    clickCountRef.current = 0;
    isDraggingRef.current = false;
  }, []);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (longPressIntervalRef.current) clearInterval(longPressIntervalRef.current);
      if (longPressTimerRef.current) clearTimeout(longPressTimerRef.current);
    };
  }, []);

  return {
    longPressProgress,
    handleClick,
    handlePointerDown,
    handlePointerUp,
    handleDragStart,
    handleDragEnd,
    resetInteraction,
  };
}
