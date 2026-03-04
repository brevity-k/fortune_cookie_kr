'use client';

import { useState } from 'react';
import type { NatalChart, AstroAIInterpretation } from '@/lib/astro/types';
import { STORAGE_KEYS } from '@/lib/storage-keys';
import { trackAstro } from '@/lib/analytics';

function getCacheKey(birthInfo: { year: number; month: number; day: number; hour: number; minute: number }): string {
  return `${STORAGE_KEYS.ASTRO_AI_PREFIX}${birthInfo.year}_${birthInfo.month}_${birthInfo.day}_${birthInfo.hour}_${birthInfo.minute}`;
}

function getCachedInterpretation(key: string): AstroAIInterpretation | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function cacheInterpretation(key: string, data: AstroAIInterpretation) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch { /* Safari private mode */ }
}

const SECTIONS: { key: keyof AstroAIInterpretation; label: string; icon: string }[] = [
  { key: 'personality', label: '성격과 정체성', icon: '\u2600\uFE0F' },
  { key: 'emotions', label: '감정과 내면', icon: '\uD83C\uDF19' },
  { key: 'communication', label: '소통과 사고', icon: '\uD83D\uDCAC' },
  { key: 'love', label: '사랑과 관계', icon: '\uD83D\uDC95' },
  { key: 'ambition', label: '야망과 행동력', icon: '\uD83D\uDD25' },
  { key: 'career', label: '직업과 성취', icon: '\uD83C\uDFAF' },
  { key: 'balance', label: '에너지 균형', icon: '\u2696\uFE0F' },
];

interface Props {
  chart: NatalChart;
  birthInfo: { year: number; month: number; day: number; hour: number; minute: number };
}

export default function AstroInterpretation({ chart, birthInfo }: Props) {
  const [interpretation, setInterpretation] = useState<AstroAIInterpretation | null>(() => {
    const key = getCacheKey(birthInfo);
    return getCachedInterpretation(key);
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleGenerate() {
    setLoading(true);
    setError('');
    trackAstro('request');

    try {
      const res = await fetch('/api/astro/interpret', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chart }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        const serverMsg = typeof body.error === 'string' && body.error.length < 200 ? body.error : null;
        throw new Error(serverMsg || 'AI 해석 요청에 실패했습니다.');
      }

      const { interpretation: data } = await res.json() as { interpretation: AstroAIInterpretation };
      setInterpretation(data);
      cacheInterpretation(getCacheKey(birthInfo), data);
      trackAstro('success');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'AI 해석 중 오류가 발생했습니다.');
      trackAstro('error');
    } finally {
      setLoading(false);
    }
  }

  // Show button if no cached result and not yet requested
  if (!interpretation && !loading && !error) {
    return (
      <div className="bg-bg-card/30 rounded-xl p-6 border border-white/5 text-center">
        <h3 className="mb-2 text-lg font-semibold text-cookie-gold">AI 출생 차트 해석</h3>
        <p className="text-sm text-text-muted mb-4">
          AI가 출생 차트를 분석하여 성격, 감정, 관계 등 7가지 영역의 맞춤 해석을 제공합니다.
        </p>
        <button
          onClick={handleGenerate}
          className="rounded-full bg-cookie-gold px-6 py-2.5 text-sm font-medium text-bg-primary hover:bg-cookie-gold/90 transition"
        >
          AI 해석 보기
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-bg-card/30 rounded-xl p-6 border border-white/5">
        <h3 className="mb-4 text-lg font-semibold text-cookie-gold">AI 출생 차트 해석</h3>
        <div className="space-y-4">
          {SECTIONS.map(({ key }) => (
            <div key={key} className="animate-pulse">
              <div className="h-4 w-32 rounded bg-white/5 mb-2" />
              <div className="h-3 w-full rounded bg-white/5 mb-1" />
              <div className="h-3 w-3/4 rounded bg-white/5" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-bg-card/30 rounded-xl p-6 border border-white/5">
        <h3 className="mb-2 text-lg font-semibold text-cookie-gold">AI 출생 차트 해석</h3>
        <p className="text-sm text-text-muted mb-3">{error}</p>
        <button
          onClick={handleGenerate}
          className="rounded-full bg-cookie-gold px-5 py-2 text-sm font-medium text-bg-primary hover:bg-cookie-gold/90 transition"
        >
          다시 시도
        </button>
      </div>
    );
  }

  if (!interpretation) return null;

  return (
    <div className="bg-bg-card/30 rounded-xl p-6 border border-white/5">
      <h3 className="mb-4 text-lg font-semibold text-cookie-gold">AI 출생 차트 해석</h3>
      <div className="space-y-4">
        {SECTIONS.map(({ key, label, icon }) => {
          const text = interpretation[key];
          if (!text) return null;
          return (
            <div key={key} className="rounded-xl border border-white/5 bg-white/3 p-4">
              <div className="mb-1 text-sm font-medium text-cookie-gold/70">
                {icon} {label}
              </div>
              <p className="text-sm text-text-secondary leading-relaxed">{text}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
