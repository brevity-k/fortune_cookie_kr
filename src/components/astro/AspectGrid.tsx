'use client';

import type { NatalChart, AspectType } from '@/lib/astro/types';
import { formatAspect } from '@/lib/astro/format';
import { ASPECT_KOREAN } from '@/lib/astro/constants';

const ASPECT_COLORS: Record<AspectType, string> = {
  conjunction: '#fbbf24',
  sextile: '#60a5fa',
  square: '#f87171',
  trine: '#4ade80',
  opposition: '#fb923c',
};

interface Props {
  chart: NatalChart;
}

export default function AspectGrid({ chart }: Props) {
  const aspects = chart.aspects.map(formatAspect);

  if (aspects.length === 0) {
    return (
      <div>
        <h3 className="mb-4 text-lg font-semibold text-cookie-gold">주요 애스펙트 (Aspects)</h3>
        <p className="text-sm text-text-muted">주요 애스펙트가 감지되지 않았습니다.</p>
      </div>
    );
  }

  return (
    <div>
      <h3 className="mb-4 text-lg font-semibold text-cookie-gold">주요 애스펙트 (Aspects)</h3>
      <div className="space-y-1.5">
        {aspects.map((a, i) => {
          const color = ASPECT_COLORS[a.type as AspectType] ?? '#888';
          return (
            <div
              key={`${a.planet1}-${a.type}-${a.planet2}-${i}`}
              className="flex items-center gap-2 rounded-lg border border-white/5 bg-white/3 px-3 py-2 text-sm"
            >
              <span className="text-cookie-gold">{a.planet1Symbol}</span>
              <span className="text-text-secondary min-w-[56px]">
                {a.planet1Korean}
              </span>

              <span className="text-lg" style={{ color }}>
                {a.typeSymbol}
              </span>
              <span className="text-xs min-w-[48px]" style={{ color }}>
                {a.typeKorean}
              </span>

              <span className="text-cookie-gold">{a.planet2Symbol}</span>
              <span className="text-text-secondary min-w-[56px]">
                {a.planet2Korean}
              </span>

              <span className="ml-auto font-mono text-xs text-text-muted">
                {a.orb}
              </span>
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex flex-wrap gap-3 text-xs text-text-muted">
        {(Object.keys(ASPECT_COLORS) as AspectType[]).map((type) => (
          <span key={type} className="flex items-center gap-1">
            <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: ASPECT_COLORS[type] }} />
            <span>{ASPECT_KOREAN[type]}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
