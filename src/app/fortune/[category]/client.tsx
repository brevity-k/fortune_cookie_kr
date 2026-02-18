'use client';

import { useCallback, useState } from 'react';
import FortuneCookie from '@/components/cookie/FortuneCookie';
import FortuneShare from '@/components/fortune/FortuneShare';
import CategorySelector from '@/components/fortune/CategorySelector';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Fortune, FortuneCategory, CookieBreakMethod, CATEGORIES } from '@/types/fortune';
import { getRandomFortune } from '@/lib/fortune-selector';
import { allFortunes } from '@/data/fortunes';
import { useStreak } from '@/hooks/useStreak';
import { useFortuneCollection } from '@/hooks/useFortuneCollection';
import { trackStreak } from '@/lib/analytics';
import SEOContentSection from '@/components/seo/SEOContentSection';
import { CATEGORY_SEO_CONTENT } from '@/data/seo/category-content';

interface CategoryPageClientProps {
  category: FortuneCategory;
}

export default function CategoryPageClient({ category }: CategoryPageClientProps) {
  const categoryInfo = CATEGORIES.find((c) => c.key === category);
  const [fortune, setFortune] = useState<Fortune | null>(null);
  const [isNew, setIsNew] = useState(false);
  const { streak, recordVisit } = useStreak();
  const { addToCollection } = useFortuneCollection();

  const handleBreak = useCallback(
    (_method: CookieBreakMethod): Fortune => {
      const result = getRandomFortune(allFortunes, category);
      setFortune(result);
      const updated = recordVisit();
      if (updated.currentStreak > 1) {
        trackStreak(updated.currentStreak);
      }
      setIsNew(addToCollection(result.id));
      return result;
    },
    [category, recordVisit, addToCollection]
  );

  if (!categoryInfo) {
    return (
      <div className="star-field min-h-dvh flex flex-col">
        <Header />
        <main className="flex-1 pt-14 flex items-center justify-center">
          <p className="text-text-muted">존재하지 않는 카테고리입니다.</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="star-field min-h-dvh flex flex-col">
      <Header />

      <main className="flex-1 pt-14">
        <section className="relative px-4 pt-8 pb-4">
          <div className="max-w-lg mx-auto text-center">
            <span className="text-4xl mb-2 block">{categoryInfo.emoji}</span>
            <h1 className="text-2xl md:text-3xl font-bold text-text-primary mb-2">
              오늘의{' '}
              <span className="text-cookie-gold">{categoryInfo.label}</span>
            </h1>
            <p className="text-sm text-text-muted mb-6">
              {categoryInfo.description}
            </p>
          </div>
        </section>

        <section className="px-4 relative z-10">
          <FortuneCookie onBreak={handleBreak} fortune={fortune} streak={streak.currentStreak} isNewCollection={isNew} />
        </section>

        {fortune && (
          <section className="px-4 py-4 max-w-sm mx-auto animate-fade-in-up">
            <FortuneShare fortune={fortune} streak={streak.currentStreak} />
          </section>
        )}

        <section className="px-4 py-8 mt-4">
          <div className="max-w-lg mx-auto">
            <h2 className="text-center text-sm text-text-muted mb-4">
              다른 카테고리 보기
            </h2>
            <CategorySelector activeCategory={category} />
          </div>
        </section>

        {CATEGORY_SEO_CONTENT[category] && (
          <SEOContentSection
            title={categoryInfo.label}
            content={CATEGORY_SEO_CONTENT[category]}
          />
        )}
      </main>

      <Footer />
    </div>
  );
}
