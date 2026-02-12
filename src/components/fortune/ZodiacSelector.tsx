'use client';

import Link from 'next/link';
import { ZODIAC_ANIMALS } from '@/types/zodiac';

interface ZodiacSelectorProps {
  activeAnimal?: string;
}

export default function ZodiacSelector({ activeAnimal }: ZodiacSelectorProps) {
  return (
    <div className="flex flex-wrap justify-center gap-2">
      {ZODIAC_ANIMALS.map((z) => (
        <Link
          key={z.key}
          href={`/fortune/zodiac/${z.key}`}
          className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm transition-all ${
            activeAnimal === z.key
              ? 'bg-cookie-gold/20 border-cookie-gold/40 text-cookie-gold border'
              : 'bg-bg-card/60 border border-white/5 text-text-secondary hover:border-cookie-gold/20 hover:text-cookie-gold'
          }`}
        >
          <span>{z.emoji}</span>
          <span>{z.label}</span>
        </Link>
      ))}
    </div>
  );
}
