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

interface CategoryPageClientProps {
  category: FortuneCategory;
}

export default function CategoryPageClient({ category }: CategoryPageClientProps) {
  const categoryInfo = CATEGORIES.find((c) => c.key === category);
  const [fortune, setFortune] = useState<Fortune | null>(null);

  const handleBreak = useCallback(
    (_method: CookieBreakMethod): Fortune => {
      const result = getRandomFortune(allFortunes, category);
      setFortune(result);
      return result;
    },
    [category]
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
          <FortuneCookie onBreak={handleBreak} fortune={fortune} />
        </section>

        {fortune && (
          <section className="px-4 py-4 max-w-sm mx-auto animate-fade-in-up">
            <FortuneShare fortune={fortune} />
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

        <section className="px-4 py-8 max-w-2xl mx-auto">
          <div className="bg-bg-card/30 rounded-xl p-6 border border-white/5">
            <h2 className="text-lg font-semibold text-cookie-gold mb-3">
              {categoryInfo.label}이란?
            </h2>
            <p className="text-sm text-text-secondary leading-relaxed">
              {category === 'love' &&
                '사랑운은 연애, 결혼, 짝사랑, 이별, 재회 등 사랑과 관련된 전반적인 운세를 다룹니다. 오늘 당신의 사랑에 어떤 기운이 감도는지 포춘쿠키로 확인해보세요.'}
              {category === 'career' &&
                '재물운은 직장 생활, 사업, 투자, 재테크, 부업 등 경제적인 운세를 다룹니다. 오늘의 재물운을 확인하고 현명한 경제 활동을 계획해보세요.'}
              {category === 'health' &&
                '건강운은 신체적, 정신적 건강과 활력에 대한 운세를 다룹니다. 오늘의 건강 운세를 확인하고 자신의 몸과 마음을 돌보는 하루를 보내세요.'}
              {category === 'study' &&
                '학업운은 공부, 시험, 자격증, 자기계발 등 학습과 관련된 운세를 다룹니다. 수능, 공무원 시험, 자격증 준비 중이라면 오늘의 학업운을 확인해보세요.'}
              {category === 'general' &&
                '총운은 오늘 하루의 전반적인 운세와 행운을 다룹니다. 사랑, 재물, 건강 등 모든 분야를 아우르는 종합적인 운세를 포춘쿠키로 확인해보세요.'}
              {category === 'relationship' &&
                '대인운은 친구, 가족, 직장 동료, 새로운 만남 등 인간관계 전반에 대한 운세를 다룹니다. 오늘의 대인운을 확인하고 소중한 관계를 가꿔보세요.'}
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
