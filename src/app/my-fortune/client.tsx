'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import OnboardingQuestions from '@/components/premium/OnboardingQuestions';
import DailyCheckIn from '@/components/premium/DailyCheckIn';
import type { FortuneCategory } from '@/lib/premium/prompts';
import { FORTUNE_CATEGORY_LABELS } from '@/lib/premium/prompts';

interface Props {
  userId: string;
  activeTracks: string[];
  availableTracks: string[];
  hasOnboarded: boolean;
}

interface FortuneData {
  title: string;
  content: string;
  luckyElement?: string;
  luckyPlanet?: string;
  intensity: number;
}

const CATEGORY_ORDER: FortuneCategory[] = ['daily', 'love', 'career', 'health'];
const CATEGORY_EMOJIS: Record<FortuneCategory, string> = {
  daily: '🥠',
  love: '💕',
  career: '💼',
  health: '💚',
  monthly: '📅',
};

function IntensityStars({ value }: { value: number }) {
  return (
    <span className="text-gold-sparkle text-xs">
      {'★'.repeat(value)}
      {'☆'.repeat(5 - value)}
    </span>
  );
}

export default function MyFortuneDashboard({ userId, activeTracks, availableTracks, hasOnboarded }: Props) {
  const [showOnboarding, setShowOnboarding] = useState(!hasOnboarded);
  const [activeTrack, setActiveTrack] = useState<string>(
    activeTracks[0] || availableTracks[0] || 'saju',
  );
  const [fortunes, setFortunes] = useState<Record<string, FortuneData>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [monthlyFortune, setMonthlyFortune] = useState<FortuneData | null>(null);
  const [monthlyLoading, setMonthlyLoading] = useState(false);

  const fetchFortune = useCallback(async (category: FortuneCategory) => {
    const key = `${activeTrack}_${category}`;
    if (fortunes[key] || loading[key]) return;

    setLoading((prev) => ({ ...prev, [key]: true }));
    setErrors((prev) => ({ ...prev, [key]: '' }));

    try {
      const res = await fetch('/api/my-fortune', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ track: activeTrack, category }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || '운세를 불러오지 못했습니다.');
      }

      const { fortune } = await res.json();
      if (category === 'monthly') {
        setMonthlyFortune(fortune);
      } else {
        setFortunes((prev) => ({ ...prev, [key]: fortune }));
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : '오류가 발생했습니다.';
      setErrors((prev) => ({ ...prev, [key]: message }));
    } finally {
      setLoading((prev) => ({ ...prev, [key]: false }));
    }
  }, [activeTrack, fortunes, loading]);

  // No chart data yet
  if (availableTracks.length === 0) {
    return (
      <div className="max-w-lg mx-auto py-12 text-center space-y-4">
        <div className="text-4xl">🥠</div>
        <h1 className="text-xl font-bold text-text-primary">맞춤 운세를 시작하세요</h1>
        <p className="text-sm text-text-secondary">
          먼저 사주 또는 출생 차트를 입력해주세요.
        </p>
        <div className="flex flex-col gap-3 max-w-xs mx-auto">
          <Link
            href="/saju"
            className="bg-cookie-gold/20 text-cookie-gold border border-cookie-gold/30 rounded-xl py-3 px-4 text-sm font-medium hover:bg-cookie-gold/30 transition-colors"
          >
            🔮 사주팔자 입력하기
          </Link>
          <Link
            href="/birth-chart"
            className="bg-bg-card/40 text-text-secondary border border-white/10 rounded-xl py-3 px-4 text-sm font-medium hover:bg-bg-card/60 transition-colors"
          >
            🌌 출생 차트 입력하기
          </Link>
        </div>
      </div>
    );
  }

  // Onboarding
  if (showOnboarding) {
    return (
      <div className="max-w-lg mx-auto py-8 space-y-4">
        <div className="text-center space-y-2">
          <div className="text-3xl">🥠</div>
          <h1 className="text-lg font-bold text-text-primary">당신에 대해 알려주세요</h1>
          <p className="text-xs text-text-secondary">
            간단한 질문에 답하면 첫 운세부터 맞춤으로 드려요.
          </p>
        </div>
        <OnboardingQuestions userId={userId} onComplete={() => setShowOnboarding(false)} />
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto py-4 space-y-5">
      {/* Track selector (if multiple) */}
      {availableTracks.length > 1 && (
        <div className="flex gap-2 justify-center">
          {availableTracks.map((t) => (
            <button
              key={t}
              onClick={() => setActiveTrack(t)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                activeTrack === t
                  ? 'bg-cookie-gold/20 border-cookie-gold/40 text-cookie-gold'
                  : 'bg-bg-card/30 border-white/10 text-text-secondary hover:border-white/20'
              }`}
            >
              {t === 'saju' ? '🔮 사주' : '🌌 별자리'}
            </button>
          ))}
        </div>
      )}

      {/* Daily check-in */}
      <DailyCheckIn userId={userId} />

      {/* Category fortune cards */}
      <div className="space-y-3">
        {CATEGORY_ORDER.map((category) => {
          const key = `${activeTrack}_${category}`;
          const fortune = fortunes[key];
          const isLoading = loading[key];
          const error = errors[key];

          return (
            <FortuneCard
              key={key}
              category={category}
              fortune={fortune}
              loading={isLoading}
              error={error}
              onRequest={() => fetchFortune(category)}
            />
          );
        })}
      </div>

      {/* Monthly fortune */}
      <div className="pt-2">
        <FortuneCard
          category="monthly"
          fortune={monthlyFortune ?? undefined}
          loading={monthlyLoading}
          error={errors[`${activeTrack}_monthly`]}
          onRequest={() => {
            setMonthlyLoading(true);
            fetchFortune('monthly').finally(() => setMonthlyLoading(false));
          }}
        />
      </div>
    </div>
  );
}

function FortuneCard({
  category,
  fortune,
  loading,
  error,
  onRequest,
}: {
  category: FortuneCategory;
  fortune?: FortuneData;
  loading?: boolean;
  error?: string;
  onRequest: () => void;
}) {
  const emoji = CATEGORY_EMOJIS[category];
  const label = FORTUNE_CATEGORY_LABELS[category];

  if (fortune) {
    return (
      <div className="bg-bg-card/40 border border-white/5 rounded-xl p-4 space-y-2 animate-fade-in-up">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-text-primary">
            {emoji} {fortune.title}
          </h3>
          <IntensityStars value={fortune.intensity} />
        </div>
        <p className="text-sm text-text-secondary leading-relaxed">{fortune.content}</p>
        {fortune.luckyElement && (
          <p className="text-xs text-text-muted">행운의 오행: {fortune.luckyElement}</p>
        )}
        {fortune.luckyPlanet && (
          <p className="text-xs text-text-muted">행운의 행성: {fortune.luckyPlanet}</p>
        )}
      </div>
    );
  }

  return (
    <button
      onClick={onRequest}
      disabled={loading}
      className="w-full bg-bg-card/30 border border-white/5 rounded-xl p-4 text-left hover:bg-bg-card/50 transition-colors disabled:opacity-50"
    >
      <div className="flex items-center justify-between">
        <span className="text-sm text-text-secondary">
          {emoji} {label}
        </span>
        {loading ? (
          <span className="text-xs text-text-muted animate-pulse">생성 중...</span>
        ) : error ? (
          <span className="text-xs text-accent-red">{error}</span>
        ) : (
          <span className="text-xs text-cookie-gold">확인하기 →</span>
        )}
      </div>
    </button>
  );
}
