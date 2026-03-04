'use client';

import { useState, useCallback, useEffect, useSyncExternalStore } from 'react';
import type { BirthInfo, SajuAIInterpretation } from '@/lib/saju/types';
import { formatFourPillars } from '@/lib/saju/format';
import { saveSajuProfile, getSajuProfile, clearSajuProfile } from '@/lib/saju/profile';
import type { SajuProfile } from '@/lib/saju/profile';
import { STORAGE_KEYS } from '@/lib/storage-keys';
import { trackSajuAI } from '@/lib/analytics';
import Link from 'next/link';
import SajuOnboarding from '@/components/saju/SajuOnboarding';
import SajuChart from '@/components/saju/SajuChart';
import FiveElementsBar from '@/components/saju/FiveElementsBar';
import MajorLuckTimeline from '@/components/saju/MajorLuckTimeline';
import SajuInterpretation from '@/components/saju/SajuInterpretation';
import SajuAIInterpretationView from '@/components/saju/SajuAIInterpretation';

function subscribeToProfile(callback: () => void) {
  window.addEventListener('storage', callback);
  return () => window.removeEventListener('storage', callback);
}

function getProfileSnapshot(): SajuProfile | null {
  return getSajuProfile();
}

function getServerSnapshot(): SajuProfile | null {
  return null;
}

function getAICacheKey(info: BirthInfo): string {
  return `${STORAGE_KEYS.SAJU_AI_PREFIX}${info.year}_${info.month}_${info.day}_${info.hour ?? 'x'}_${info.gender}`;
}

function getCachedAI(info: BirthInfo): SajuAIInterpretation | null {
  try {
    const raw = localStorage.getItem(getAICacheKey(info));
    if (!raw) return null;
    return JSON.parse(raw) as SajuAIInterpretation;
  } catch {
    return null;
  }
}

function cacheAI(info: BirthInfo, data: SajuAIInterpretation): void {
  try {
    localStorage.setItem(getAICacheKey(info), JSON.stringify(data));
  } catch { /* Safari private mode */ }
}

export default function SajuDashboard() {
  const profile = useSyncExternalStore(subscribeToProfile, getProfileSnapshot, getServerSnapshot);
  const [localProfile, setLocalProfile] = useState<SajuProfile | null>(null);
  const [aiInterpretation, setAiInterpretation] = useState<SajuAIInterpretation | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  const currentProfile = localProfile ?? profile;

  // Load cached AI result when profile changes
  useEffect(() => {
    if (currentProfile) {
      const cached = getCachedAI(currentProfile.chart.birthInfo);
      if (cached) setAiInterpretation(cached);
    }
  }, [currentProfile]);

  const handleSubmit = useCallback((birthInfo: BirthInfo) => {
    const saved = saveSajuProfile(birthInfo);
    setLocalProfile(saved);
    // Check cache for the new profile
    const cached = getCachedAI(birthInfo);
    if (cached) setAiInterpretation(cached);
  }, []);

  const handleReset = useCallback(() => {
    clearSajuProfile();
    setLocalProfile(null);
    setAiInterpretation(null);
    setAiLoading(false);
    setAiError(null);
  }, []);

  const handleAIRequest = useCallback(async () => {
    if (!currentProfile) return;

    setAiLoading(true);
    setAiError(null);
    trackSajuAI('request');

    try {
      const res = await fetch('/api/saju/interpret', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentProfile.chart),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        const serverMsg = typeof data.error === 'string' && data.error.length < 200 ? data.error : null;
        throw new Error(serverMsg || '요청에 실패했습니다.');
      }

      const { interpretation } = await res.json() as { interpretation: SajuAIInterpretation };
      setAiInterpretation(interpretation);
      cacheAI(currentProfile.chart.birthInfo, interpretation);
      trackSajuAI('success');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'AI 해석 중 오류가 발생했습니다.';
      setAiError(message);
      trackSajuAI('error');
    } finally {
      setAiLoading(false);
    }
  }, [currentProfile]);

  if (!currentProfile) {
    return (
      <section className="px-4 py-4">
        <div className="max-w-lg mx-auto">
          <SajuOnboarding onSubmit={handleSubmit} />
        </div>
      </section>
    );
  }

  const { chart } = currentProfile;
  const formattedPillars = formatFourPillars(chart.fourPillars);
  const currentAge = new Date().getFullYear() - chart.birthInfo.year;

  return (
    <section className="px-4 py-4">
      <div className="max-w-lg mx-auto space-y-4">
        {/* Birth Info Summary */}
        <div className="flex items-center justify-between">
          <p className="text-xs text-text-muted">
            {chart.birthInfo.year}년 {chart.birthInfo.month}월 {chart.birthInfo.day}일
            {chart.birthInfo.hour !== null ? ` ${chart.birthInfo.hour}시` : ''} · {chart.birthInfo.gender === 'male' ? '남' : '여'}
          </p>
          <button
            onClick={handleReset}
            className="text-xs text-text-muted/70 hover:text-text-secondary transition-colors underline underline-offset-2"
          >
            다시 입력
          </button>
        </div>

        {/* Four Pillars Chart */}
        <SajuChart formattedPillars={formattedPillars} />

        {/* Five Elements Analysis */}
        <FiveElementsBar analysis={chart.fiveElements} />

        {/* Major Luck Timeline */}
        {chart.majorLuckCycles.length > 0 && (
          <MajorLuckTimeline cycles={chart.majorLuckCycles} currentAge={currentAge} />
        )}

        {/* Static Interpretation */}
        <SajuInterpretation analysis={chart.fiveElements} />

        {/* AI Interpretation */}
        <SajuAIInterpretationView
          interpretation={aiInterpretation}
          loading={aiLoading}
          error={aiError}
          onRequest={handleAIRequest}
          onRetry={handleAIRequest}
        />

        {/* Premium CTA */}
        <div className="bg-cookie-gold/5 border border-cookie-gold/20 rounded-xl p-5 text-center space-y-2">
          <p className="text-sm text-text-secondary">
            매일 업데이트되는 나만의 사주 운세가 궁금하세요?
          </p>
          <Link
            href="/premium?track=saju"
            className="inline-block bg-cookie-gold/20 text-cookie-gold border border-cookie-gold/30 rounded-lg px-5 py-2.5 text-sm font-medium hover:bg-cookie-gold/30 transition-colors"
          >
            나의 운세 보기
          </Link>
        </div>
      </div>
    </section>
  );
}
