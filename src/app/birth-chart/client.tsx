'use client';

import { useState, useSyncExternalStore } from 'react';
import { getAstroProfile, clearAstroProfile } from '@/lib/astro/profile';
import { ZODIAC_KOREAN } from '@/lib/astro/constants';
import type { AstroProfile } from '@/lib/astro/types';
import AstroOnboarding from '@/components/astro/AstroOnboarding';
import NatalChartWheel from '@/components/astro/NatalChartWheel';
import PlanetTable from '@/components/astro/PlanetTable';
import BalanceBar from '@/components/astro/BalanceBar';
import AspectGrid from '@/components/astro/AspectGrid';
import AstroInterpretation from '@/components/astro/AstroInterpretation';

function subscribeToProfile(callback: () => void) {
  window.addEventListener('storage', callback);
  return () => window.removeEventListener('storage', callback);
}

function getProfileSnapshot(): AstroProfile | null {
  return getAstroProfile();
}

function getServerSnapshot(): AstroProfile | null {
  return null;
}

export default function AstroDashboard() {
  const storedProfile = useSyncExternalStore(
    subscribeToProfile,
    getProfileSnapshot,
    getServerSnapshot,
  );
  const [profile, setProfile] = useState<AstroProfile | null>(storedProfile);

  function handleComplete(p: AstroProfile) {
    setProfile(p);
  }

  function handleReset() {
    clearAstroProfile();
    setProfile(null);
  }

  if (!profile) {
    return (
      <section className="px-4 py-4">
        <div className="max-w-lg mx-auto">
          <AstroOnboarding onComplete={handleComplete} />
        </div>
      </section>
    );
  }

  const { chart, birthInfo } = profile;
  const sunSign = chart.planets.find((p) => p.planet === 'Sun')?.sign;
  const moonSign = chart.planets.find((p) => p.planet === 'Moon')?.sign;
  const risingSign = chart.ascendant.sign;

  return (
    <section className="px-4 py-4">
      <div className="max-w-lg mx-auto space-y-4">
        {/* Birth Info Summary */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-text-muted">
              {birthInfo.year}년 {birthInfo.month}월 {birthInfo.day}일{' '}
              {String(birthInfo.hour).padStart(2, '0')}:{String(birthInfo.minute).padStart(2, '0')} · {birthInfo.cityName}
            </p>
            <p className="text-xs text-cookie-gold/70 mt-0.5">
              {sunSign && `${ZODIAC_KOREAN[sunSign]} 태양`} · {moonSign && `${ZODIAC_KOREAN[moonSign]} 달`} · {ZODIAC_KOREAN[risingSign]} 상승
            </p>
          </div>
          <button
            onClick={handleReset}
            className="text-xs text-text-muted/70 hover:text-text-secondary transition-colors underline underline-offset-2"
          >
            다시 입력
          </button>
        </div>

        {/* Natal Chart Wheel */}
        <div className="bg-bg-card/30 rounded-xl p-4 border border-white/5 overflow-x-auto">
          <NatalChartWheel chart={chart} />
        </div>

        {/* Planet Positions Table */}
        <div className="bg-bg-card/30 rounded-xl p-4 border border-white/5">
          <PlanetTable chart={chart} />
        </div>

        {/* Element & Modality Balance */}
        <div className="bg-bg-card/30 rounded-xl p-4 border border-white/5">
          <BalanceBar elements={chart.elements} modalities={chart.modalities} />
        </div>

        {/* Aspect Grid */}
        <div className="bg-bg-card/30 rounded-xl p-4 border border-white/5">
          <AspectGrid chart={chart} />
        </div>

        {/* AI Interpretation (auto-fetches) */}
        <AstroInterpretation chart={chart} birthInfo={birthInfo} />
      </div>
    </section>
  );
}
