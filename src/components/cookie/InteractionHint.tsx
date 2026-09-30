'use client';

import { useSyncExternalStore } from 'react';

const subscribe = () => () => {};
const isTouchDevice = () => 'ontouchstart' in window || navigator.maxTouchPoints > 0;

export default function InteractionHint() {
  // Server snapshot is false so hydration matches; the client re-renders with the real value.
  const isMobile = useSyncExternalStore(subscribe, isTouchDevice, () => false);

  return (
    <div className="flex flex-wrap justify-center gap-3 mt-6 animate-fade-in-up">
      <HintChip icon="👆" label="클릭하기" />
      <HintChip icon="✊" label="꾹 누르기" />
      <HintChip icon="👋" label="드래그하기" />
      <HintChip icon="⚡" label="더블 탭" />
      {isMobile && <HintChip icon="📱" label="흔들기" />}
    </div>
  );
}

function HintChip({ icon, label }: { icon: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-bg-card/60 border border-white/5 text-xs text-text-muted">
      <span>{icon}</span>
      <span>{label}</span>
    </span>
  );
}
