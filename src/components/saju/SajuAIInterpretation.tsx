'use client';

import type { SajuAIInterpretation } from '@/lib/saju/types';

const SECTIONS: { key: keyof SajuAIInterpretation; label: string; emoji: string }[] = [
  { key: 'personality', label: '성격과 기질', emoji: '🪞' },
  { key: 'career', label: '직업과 재물', emoji: '💼' },
  { key: 'relationships', label: '대인관계와 연애', emoji: '💕' },
  { key: 'health', label: '건강 경향', emoji: '🌿' },
  { key: 'currentLuck', label: '현재 운세 흐름', emoji: '🌊' },
  { key: 'advice', label: '실천 조언', emoji: '✨' },
];

interface SajuAIInterpretationProps {
  interpretation: SajuAIInterpretation | null;
  loading: boolean;
  error: string | null;
  onRequest: () => void;
  onRetry: () => void;
}

function SkeletonCard() {
  return (
    <div className="bg-bg-card/30 rounded-xl p-5 border border-white/5 animate-pulse">
      <div className="h-4 w-28 bg-white/10 rounded mb-3" />
      <div className="space-y-2">
        <div className="h-3 bg-white/5 rounded w-full" />
        <div className="h-3 bg-white/5 rounded w-5/6" />
        <div className="h-3 bg-white/5 rounded w-4/6" />
      </div>
    </div>
  );
}

export default function SajuAIInterpretationView({
  interpretation,
  loading,
  error,
  onRequest,
  onRetry,
}: SajuAIInterpretationProps) {
  // Idle state — show CTA button
  if (!interpretation && !loading && !error) {
    return (
      <div className="bg-gradient-to-b from-cookie-gold/5 to-transparent rounded-xl p-6 border border-cookie-gold/20 text-center">
        <p className="text-sm text-text-secondary mb-1">
          사주 원국을 바탕으로 AI가 상세 해석을 제공합니다
        </p>
        <p className="text-xs text-text-muted mb-4">
          오행 균형, 대운 흐름까지 종합 분석
        </p>
        <button
          onClick={onRequest}
          className="inline-flex items-center gap-2 px-6 py-3 bg-cookie-gold/90 hover:bg-cookie-gold text-bg-deep font-semibold rounded-xl transition-colors text-sm"
        >
          <span>AI 상세 해석 받기</span>
        </button>
      </div>
    );
  }

  // Loading state — skeleton
  if (loading) {
    return (
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-cookie-gold flex items-center gap-2">
          <span className="inline-block w-4 h-4 border-2 border-cookie-gold border-t-transparent rounded-full animate-spin" />
          AI 해석 생성 중...
        </h3>
        {Array.from({ length: 6 }, (_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-bg-card/30 rounded-xl p-5 border border-red-500/20 text-center">
        <p className="text-sm text-red-400 mb-3">{error}</p>
        <button
          onClick={onRetry}
          className="px-5 py-2 bg-white/10 hover:bg-white/15 text-text-primary rounded-lg transition-colors text-sm"
        >
          다시 시도
        </button>
      </div>
    );
  }

  // Success state — show 6 sections
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-cookie-gold">AI 상세 해석</h3>
      {SECTIONS.map(({ key, label, emoji }) => (
        <div key={key} className="bg-bg-card/30 rounded-xl p-5 border border-white/5">
          <h4 className="text-sm font-semibold text-cookie-gold mb-2">
            {emoji} {label}
          </h4>
          <p className="text-sm text-text-secondary leading-relaxed">
            {interpretation![key]}
          </p>
        </div>
      ))}
      <p className="text-xs text-text-muted/50 text-center">
        AI 해석은 사주명리학 원리에 기반한 참고용이며, 전문 상담을 대체하지 않습니다.
      </p>
    </div>
  );
}
