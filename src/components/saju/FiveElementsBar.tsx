'use client';

import type { FiveElementAnalysis, Element } from '@/lib/saju/types';

const ELEMENT_COLORS: Record<Element, string> = {
  wood: '#4ade80',
  fire: '#f87171',
  earth: '#fbbf24',
  metal: '#e2e8f0',
  water: '#60a5fa',
};

const ELEMENT_KOREAN: Record<Element, string> = {
  wood: '목(木)',
  fire: '화(火)',
  earth: '토(土)',
  metal: '금(金)',
  water: '수(水)',
};

const ELEMENT_ORDER: Element[] = ['wood', 'fire', 'earth', 'metal', 'water'];

interface FiveElementsBarProps {
  analysis: FiveElementAnalysis;
}

export default function FiveElementsBar({ analysis }: FiveElementsBarProps) {
  const { counts, total, dayMaster, dayMasterYinYang, isStrong, favorableElement, unfavorableElement } = analysis;

  return (
    <div className="bg-bg-card/30 rounded-xl p-5 border border-white/5 space-y-4">
      <h3 className="text-sm font-semibold text-cookie-gold">오행 분석 (五行)</h3>

      {/* Day Master Info */}
      <div className="flex items-center gap-2 text-xs">
        <span className="text-text-muted">일간(日干):</span>
        <span className="font-medium" style={{ color: ELEMENT_COLORS[dayMaster] }}>
          {ELEMENT_KOREAN[dayMaster]}
        </span>
        <span className="text-text-muted">
          ({dayMasterYinYang === 'yang' ? '양(陽)' : '음(陰)'})
        </span>
        <span className="text-text-muted">·</span>
        <span className="text-text-muted">
          {isStrong ? '신강(身強)' : '신약(身弱)'}
        </span>
      </div>

      {/* Element Bars */}
      <div className="space-y-2">
        {ELEMENT_ORDER.map((el) => {
          const count = counts[el];
          const pct = total > 0 ? (count / total) * 100 : 0;
          const isFavorable = el === favorableElement;
          const isUnfavorable = el === unfavorableElement;

          return (
            <div key={el} className="flex items-center gap-2">
              <span className="text-xs w-14 shrink-0 text-right" style={{ color: ELEMENT_COLORS[el] }}>
                {ELEMENT_KOREAN[el]}
              </span>
              <div className="flex-1 h-5 bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.max(pct, 2)}%`,
                    backgroundColor: ELEMENT_COLORS[el],
                    opacity: 0.8,
                  }}
                />
              </div>
              <span className="text-xs text-text-muted w-6 text-right">{count}</span>
              {isFavorable && <span className="text-xs text-cookie-gold" title="용신(用神)">★</span>}
              {isUnfavorable && <span className="text-xs text-red-400/70" title="기신(忌神)">✕</span>}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 text-xs text-text-muted/70 pt-1">
        <span><span className="text-cookie-gold">★</span> 용신(用神) — 필요한 오행</span>
        <span><span className="text-red-400/70">✕</span> 기신(忌神) — 과한 오행</span>
      </div>
    </div>
  );
}
