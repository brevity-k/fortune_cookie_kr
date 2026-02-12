'use client';

import Link from 'next/link';
import { MBTI_TYPES } from '@/types/mbti';

interface MBTISelectorProps {
  activeType?: string;
}

export default function MBTISelector({ activeType }: MBTISelectorProps) {
  return (
    <div className="grid grid-cols-4 gap-2 max-w-md mx-auto">
      {MBTI_TYPES.map((m) => (
        <Link
          key={m.key}
          href={`/fortune/mbti/${m.key}`}
          className={`flex flex-col items-center gap-1 px-2 py-2.5 rounded-lg text-xs transition-all ${
            activeType === m.key
              ? 'bg-cookie-gold/20 border-cookie-gold/40 text-cookie-gold border'
              : 'bg-bg-card/60 border border-white/5 text-text-secondary hover:border-cookie-gold/20 hover:text-cookie-gold'
          }`}
        >
          <span className="text-lg">{m.emoji}</span>
          <span className="font-medium">{m.label}</span>
        </Link>
      ))}
    </div>
  );
}
