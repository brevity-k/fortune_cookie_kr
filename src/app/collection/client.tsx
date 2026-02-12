'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useFortuneCollection } from '@/hooks/useFortuneCollection';
import { allFortunes } from '@/data/fortunes';
import { CATEGORIES } from '@/types/fortune';
import { getRatingStars, getRatingLabel } from '@/lib/fortune-selector';

export default function CollectionClient() {
  const { collectedIds, count } = useFortuneCollection();
  const total = allFortunes.length;
  const percentage = total > 0 ? Math.round((count / total) * 100) : 0;

  const collectedFortunes = allFortunes.filter((f) => collectedIds.includes(f.id));

  // Group by category
  const grouped = CATEGORIES.map((cat) => ({
    ...cat,
    fortunes: collectedFortunes.filter((f) => f.category === cat.key),
    total: allFortunes.filter((f) => f.category === cat.key).length,
  }));

  return (
    <div className="star-field min-h-dvh flex flex-col">
      <Header />

      <main className="flex-1 pt-14">
        <section className="relative px-4 pt-8 pb-4">
          <div className="max-w-lg mx-auto text-center">
            <span className="text-4xl mb-2 block">📖</span>
            <h1 className="text-2xl md:text-3xl font-bold text-text-primary mb-2">
              포춘쿠키 <span className="text-cookie-gold">도감</span>
            </h1>
            <p className="text-sm text-text-muted mb-6">
              포춘쿠키를 깨서 운세를 수집하세요
            </p>
          </div>
        </section>

        {/* Progress */}
        <section className="px-4 max-w-lg mx-auto mb-8">
          <div className="bg-bg-card/40 rounded-xl p-5 border border-white/5 text-center">
            <div className="text-3xl font-bold text-cookie-gold mb-1">
              {count} <span className="text-lg text-text-muted font-normal">/ {total}</span>
            </div>
            <div className="w-full bg-bg-primary/60 rounded-full h-2.5 mb-2">
              <motion.div
                className="bg-cookie-gold h-2.5 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
              />
            </div>
            <p className="text-xs text-text-muted">{percentage}% 수집 완료</p>
          </div>
        </section>

        {/* Category breakdown */}
        <section className="px-4 max-w-2xl mx-auto mb-8">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {grouped.map((g) => (
              <div
                key={g.key}
                className="bg-bg-card/30 rounded-lg p-3 border border-white/5 text-center"
              >
                <span className="text-xl">{g.emoji}</span>
                <p className="text-sm text-text-secondary font-medium mt-1">{g.label}</p>
                <p className="text-xs text-text-muted">
                  {g.fortunes.length} / {g.total}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Collected fortunes */}
        {collectedFortunes.length > 0 ? (
          <section className="px-4 max-w-2xl mx-auto mb-8">
            <h2 className="text-sm text-text-muted mb-4 text-center">수집한 운세</h2>
            <div className="grid gap-3">
              {collectedFortunes.map((f) => {
                const cat = CATEGORIES.find((c) => c.key === f.category);
                return (
                  <div
                    key={f.id}
                    className="bg-bg-card/30 rounded-lg p-4 border border-white/5"
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{f.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-text-primary leading-relaxed">{f.message}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <span
                            className="text-xs px-2 py-0.5 rounded-full"
                            style={{
                              backgroundColor: `${cat?.color}20`,
                              color: cat?.color,
                            }}
                          >
                            {cat?.label}
                          </span>
                          <span className="text-xs text-amber-400">
                            {getRatingStars(f.rating)} {getRatingLabel(f.rating)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        ) : (
          <section className="px-4 max-w-lg mx-auto mb-8 text-center">
            <p className="text-sm text-text-muted mb-4">아직 수집한 운세가 없어요!</p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-cookie-gold/20 border border-cookie-gold/30 text-cookie-gold hover:bg-cookie-gold/30 transition-colors text-sm font-medium"
            >
              🥠 포춘쿠키 열러 가기
            </Link>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
