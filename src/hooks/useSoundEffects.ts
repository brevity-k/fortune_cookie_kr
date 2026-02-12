'use client';

import { useCallback, useRef, useEffect, useState } from 'react';
import { Howl } from 'howler';
import { STORAGE_KEYS } from '@/lib/storage-keys';

const SOUNDS = {
  crack1: '/sounds/crack-1.mp3',
  crack2: '/sounds/crack-2.mp3',
  break: '/sounds/break.mp3',
  paper: '/sounds/paper.mp3',
  sparkle: '/sounds/sparkle.mp3',
} as const;

type SoundName = keyof typeof SOUNDS;

export function useSoundEffects() {
  const soundsRef = useRef<Record<string, Howl>>({});
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    // Check stored mute preference
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.MUTED);
      if (stored === 'true') {
        setIsMuted(true);
      }
    } catch {
      // localStorage unavailable (e.g. private browsing)
    }

    // Preload sounds
    Object.entries(SOUNDS).forEach(([name, src]) => {
      soundsRef.current[name] = new Howl({
        src: [src],
        volume: 0.5,
        preload: true,
      });
    });

    return () => {
      Object.values(soundsRef.current).forEach((sound) => sound.unload());
    };
  }, []);

  const play = useCallback(
    (name: SoundName) => {
      if (isMuted) return;
      soundsRef.current[name]?.play();
    },
    [isMuted]
  );

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(STORAGE_KEYS.MUTED, String(next));
      } catch {
        // localStorage unavailable
      }
      return next;
    });
  }, []);

  return { play, isMuted, toggleMute };
}
