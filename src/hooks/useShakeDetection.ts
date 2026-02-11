'use client';

import { useEffect, useCallback, useRef } from 'react';

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
  const lastAccelRef = useRef<{ x: number; y: number; z: number }>({
    x: 0,
    y: 0,
    z: 0,
  });

  const handleMotion = useCallback(
    (event: DeviceMotionEvent) => {
      const accel = event.accelerationIncludingGravity;
      if (!accel || accel.x === null || accel.y === null || accel.z === null) return;

      const deltaX = Math.abs(accel.x - lastAccelRef.current.x);
      const deltaY = Math.abs(accel.y - lastAccelRef.current.y);
      const deltaZ = Math.abs(accel.z - lastAccelRef.current.z);

      const totalDelta = deltaX + deltaY + deltaZ;

      lastAccelRef.current = {
        x: accel.x,
        y: accel.y,
        z: accel.z,
      };

      const now = Date.now();
      if (totalDelta > threshold && now - lastShakeRef.current > timeout) {
        lastShakeRef.current = now;
        onShake();
      }
    },
    [threshold, timeout, onShake]
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const requestPermission = async () => {
      if (
        typeof DeviceMotionEvent !== 'undefined' &&
        'requestPermission' in DeviceMotionEvent &&
        typeof (DeviceMotionEvent as unknown as { requestPermission: () => Promise<string> }).requestPermission === 'function'
      ) {
        try {
          const permission = await (DeviceMotionEvent as unknown as { requestPermission: () => Promise<string> }).requestPermission();
          if (permission === 'granted') {
            window.addEventListener('devicemotion', handleMotion);
          }
        } catch {
          // Permission denied
        }
      } else {
        window.addEventListener('devicemotion', handleMotion);
      }
    };

    requestPermission();

    return () => {
      window.removeEventListener('devicemotion', handleMotion);
    };
  }, [handleMotion]);
}
