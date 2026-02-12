'use client';

import { useCallback, useEffect, useRef } from 'react';

interface ShakeOptions {
  threshold?: number;
  timeout?: number;
  onShake: () => void;
}

export function useShakeDetection({
  threshold = 15,
  timeout = 1000,
  onShake,
}: ShakeOptions) {
  const lastShakeRef = useRef<number>(0);
  const lastAccelRef = useRef<{ x: number; y: number; z: number } | null>(null);
  const listeningRef = useRef(false);
  const onShakeRef = useRef(onShake);

  // Keep callback ref current to avoid stale closures in the event listener
  useEffect(() => {
    onShakeRef.current = onShake;
  }, [onShake]);

  const handleMotion = useCallback(
    (event: DeviceMotionEvent) => {
      const accel = event.accelerationIncludingGravity;
      if (!accel || accel.x === null || accel.y === null || accel.z === null) return;

      const current = { x: accel.x, y: accel.y, z: accel.z };

      // Skip the first reading to avoid false positive from initial {0,0,0}
      if (lastAccelRef.current === null) {
        lastAccelRef.current = current;
        return;
      }

      const deltaX = Math.abs(current.x - lastAccelRef.current.x);
      const deltaY = Math.abs(current.y - lastAccelRef.current.y);
      const deltaZ = Math.abs(current.z - lastAccelRef.current.z);
      const totalDelta = deltaX + deltaY + deltaZ;

      lastAccelRef.current = current;

      const now = Date.now();
      if (totalDelta > threshold && now - lastShakeRef.current > timeout) {
        lastShakeRef.current = now;
        onShakeRef.current();
      }
    },
    [threshold, timeout]
  );

  // Clean up event listener on unmount
  useEffect(() => {
    return () => {
      if (listeningRef.current) {
        window.removeEventListener('devicemotion', handleMotion);
        listeningRef.current = false;
      }
    };
  }, [handleMotion]);

  // Must be called from a user gesture (e.g. pointerdown, click) for iOS support
  const enableShake = useCallback(async () => {
    if (typeof window === 'undefined' || listeningRef.current) return;

    if (
      typeof DeviceMotionEvent !== 'undefined' &&
      'requestPermission' in DeviceMotionEvent &&
      typeof (DeviceMotionEvent as unknown as { requestPermission: () => Promise<string> }).requestPermission === 'function'
    ) {
      try {
        const permission = await (DeviceMotionEvent as unknown as { requestPermission: () => Promise<string> }).requestPermission();
        if (permission === 'granted') {
          window.addEventListener('devicemotion', handleMotion);
          listeningRef.current = true;
        }
      } catch {
        // Permission denied
      }
    } else if (typeof DeviceMotionEvent !== 'undefined') {
      window.addEventListener('devicemotion', handleMotion);
      listeningRef.current = true;
    }
  }, [handleMotion]);

  return { enableShake };
}
