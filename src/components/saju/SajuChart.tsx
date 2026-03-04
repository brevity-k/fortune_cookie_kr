'use client';

import type { FormattedFourPillars } from '@/lib/saju/format';
import type { Element } from '@/lib/saju/types';
import { BRANCHES_ANIMAL_KOREAN } from '@/lib/saju/constants';

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

const PILLAR_LABELS = ['시주', '일주', '월주', '년주'] as const;

interface PillarCellProps {
  label: string;
  pillar: FormattedFourPillars['year'] | null;
  isDayMaster?: boolean;
}

function PillarCell({ label, pillar, isDayMaster }: PillarCellProps) {
  if (!pillar) {
    return (
      <div className="flex flex-col items-center gap-1.5">
        <span className="text-xs text-text-muted">{label}</span>
        <div className="w-full bg-white/5 rounded-lg border border-white/10 p-3 text-center">
          <span className="text-lg text-text-muted">?</span>
          <div className="mt-1 text-xs text-text-muted">미입력</div>
        </div>
      </div>
    );
  }

  const animalIndex = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'].indexOf(pillar.branchHanja);
  const animalKorean = animalIndex >= 0 ? BRANCHES_ANIMAL_KOREAN[animalIndex] : '';

  return (
    <div className="flex flex-col items-center gap-1.5">
      <span className={`text-xs ${isDayMaster ? 'text-cookie-gold font-semibold' : 'text-text-muted'}`}>
        {label}
        {isDayMaster && <span className="ml-1 text-[10px]">(일간)</span>}
      </span>
      <div
        className={`w-full rounded-lg border p-3 text-center ${
          isDayMaster ? 'bg-cookie-gold/10 border-cookie-gold/30' : 'bg-white/5 border-white/10'
        }`}
      >
        {/* Stem */}
        <div className="mb-2">
          <span className="text-2xl font-bold" style={{ color: ELEMENT_COLORS[pillar.stemElement] }}>
            {pillar.stemHanja}
          </span>
          <div className="text-xs text-text-muted mt-0.5">
            {pillar.stemKorean} · {ELEMENT_KOREAN[pillar.stemElement]}
          </div>
        </div>
        <div className="border-t border-white/10 my-2" />
        {/* Branch */}
        <div>
          <span className="text-2xl font-bold" style={{ color: ELEMENT_COLORS[pillar.branchElement] }}>
            {pillar.branchHanja}
          </span>
          <div className="text-xs text-text-muted mt-0.5">
            {pillar.branchKorean} · {ELEMENT_KOREAN[pillar.branchElement]}
          </div>
          {animalKorean && (
            <div className="text-xs text-text-muted/70 mt-0.5">{animalKorean}</div>
          )}
        </div>
      </div>
    </div>
  );
}

interface SajuChartProps {
  formattedPillars: FormattedFourPillars;
}

export default function SajuChart({ formattedPillars }: SajuChartProps) {
  const pillars = [
    formattedPillars.hour,
    formattedPillars.day,
    formattedPillars.month,
    formattedPillars.year,
  ];

  return (
    <div className="bg-bg-card/30 rounded-xl p-5 border border-white/5">
      <h3 className="text-sm font-semibold text-cookie-gold mb-4">사주팔자 (四柱八字)</h3>
      <div className="grid grid-cols-4 gap-2">
        {pillars.map((p, i) => (
          <PillarCell key={PILLAR_LABELS[i]} label={PILLAR_LABELS[i]} pillar={p} isDayMaster={i === 1} />
        ))}
      </div>
      <p className="text-xs text-text-muted/70 mt-3 text-center">
        천간(天干)과 지지(地支)로 이루어진 네 기둥 · 일간이 &apos;나&apos;를 나타냅니다
      </p>
    </div>
  );
}
