'use client';

import Link from 'next/link';
import { HOROSCOPE_SIGNS } from '@/types/horoscope';

interface HoroscopeSelectorProps {
  activeSign?: string;
}

export default function HoroscopeSelector({ activeSign }: HoroscopeSelectorProps) {
  return (
    <div className="flex flex-wrap justify-center gap-2">
      {HOROSCOPE_SIGNS.map((s) => (
        <Link
          key={s.key}
          href={`/fortune/horoscope/${s.key}`}
          className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm transition-all ${
            activeSign === s.key
              ? 'bg-cookie-gold/20 border-cookie-gold/40 text-cookie-gold border'
              : 'bg-bg-card/60 border border-white/5 text-text-secondary hover:border-cookie-gold/20 hover:text-cookie-gold'
          }`}
        >
          <span>{s.emoji}</span>
          <span>{s.label}</span>
        </Link>
      ))}
    </div>
  );
}
