'use client';

import Link from 'next/link';
import { CATEGORIES, FortuneCategory } from '@/types/fortune';

interface CategorySelectorProps {
  activeCategory?: FortuneCategory;
}

export default function CategorySelector({ activeCategory }: CategorySelectorProps) {
  return (
    <div className="flex flex-wrap justify-center gap-2">
      {CATEGORIES.map((cat) => (
        <Link
          key={cat.key}
          href={`/fortune/${cat.key}`}
          className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm transition-all ${
            activeCategory === cat.key
              ? 'bg-cookie-gold/20 border-cookie-gold/40 text-cookie-gold border'
              : 'bg-bg-card/60 border border-white/5 text-text-secondary hover:border-cookie-gold/20 hover:text-cookie-gold'
          }`}
        >
          <span>{cat.emoji}</span>
          <span>{cat.label}</span>
        </Link>
      ))}
    </div>
  );
}
