'use client';

import type { MajorLuckCycle, Element } from '@/lib/saju/types';
import { formatPillar } from '@/lib/saju/format';
import { STEM_ELEMENTS, BRANCH_ELEMENTS } from '@/lib/saju/constants';

const ELEMENT_COLORS: Record<Element, string> = {
  wood: '#4ade80',
  fire: '#f87171',
  earth: '#fbbf24',
  metal: '#e2e8f0',
  water: '#60a5fa',
};

interface MajorLuckTimelineProps {
  cycles: MajorLuckCycle[];
  currentAge: number;
}

export default function MajorLuckTimeline({ cycles, currentAge }: MajorLuckTimelineProps) {
  return (
    <div className="bg-bg-card/30 rounded-xl p-5 border border-white/5">
      <h3 className="text-sm font-semibold text-cookie-gold mb-4">대운 (大運)</h3>
      <p className="text-xs text-text-muted/70 mb-4">10년 단위로 변하는 큰 운의 흐름입니다.</p>

      <div className="flex gap-1.5 overflow-x-auto pb-2">
        {cycles.map((cycle) => {
          const formatted = formatPillar({ stem: cycle.stem, branch: cycle.branch });
          const stemEl = STEM_ELEMENTS[cycle.stem];
          const branchEl = BRANCH_ELEMENTS[cycle.branch];
          const endAge = cycle.startAge + 9;
          const isCurrent = currentAge >= cycle.startAge && currentAge <= endAge;

          return (
            <div
              key={cycle.startAge}
              className={`flex flex-col items-center rounded-lg border p-2 min-w-[60px] ${
                isCurrent
                  ? 'bg-cookie-gold/10 border-cookie-gold/30'
                  : 'bg-white/5 border-white/10'
              }`}
            >
              <span className={`text-[10px] mb-1 ${isCurrent ? 'text-cookie-gold font-semibold' : 'text-text-muted'}`}>
                {cycle.startAge}~{endAge}세
              </span>
              <span className="text-base font-bold" style={{ color: ELEMENT_COLORS[stemEl] }}>
                {formatted.stemHanja}
              </span>
              <span className="text-base font-bold" style={{ color: ELEMENT_COLORS[branchEl] }}>
                {formatted.branchHanja}
              </span>
              {isCurrent && (
                <span className="text-[10px] text-cookie-gold mt-1">현재</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
