import type { AstroBirthInfo, AstroProfile } from './types';
import { calculateNatalChart } from './natal-chart';
import { STORAGE_KEYS } from '@/lib/storage-keys';

let cachedRaw: string | null = null;
let cachedProfile: AstroProfile | null = null;

export function saveAstroProfile(birthInfo: AstroBirthInfo): AstroProfile {
  const chart = calculateNatalChart(birthInfo);
  const profile: AstroProfile = {
    birthInfo,
    chart,
    createdAt: new Date().toISOString(),
  };
  if (typeof window !== 'undefined') {
    try {
      const json = JSON.stringify(profile);
      localStorage.setItem(STORAGE_KEYS.ASTRO_PROFILE, json);
      cachedRaw = json;
      cachedProfile = profile;
    } catch { /* Safari private mode */ }
  }
  return profile;
}

function isAstroProfile(v: unknown): v is AstroProfile {
  const p = v as Partial<AstroProfile> | null;
  const chart = p?.chart;
  return !!p && typeof p.birthInfo === 'object' && p.birthInfo !== null
    && !!chart && Array.isArray(chart.planets) && Array.isArray(chart.houses) && Array.isArray(chart.aspects)
    && typeof chart.ascendant === 'object' && chart.ascendant !== null
    && typeof chart.midheaven === 'object' && chart.midheaven !== null
    && typeof chart.elements === 'object' && chart.elements !== null
    && typeof chart.modalities === 'object' && chart.modalities !== null;
}

export function getAstroProfile(): AstroProfile | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ASTRO_PROFILE);
    if (!raw) {
      cachedRaw = null;
      cachedProfile = null;
      return null;
    }
    if (raw === cachedRaw) return cachedProfile;
    const parsed: unknown = JSON.parse(raw);
    cachedRaw = raw;
    // A malformed entry would otherwise crash every render of the birth-chart page.
    cachedProfile = isAstroProfile(parsed) ? parsed : null;
    return cachedProfile;
  } catch {
    cachedRaw = null;
    cachedProfile = null;
    return null;
  }
}

export function clearAstroProfile(): void {
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem(STORAGE_KEYS.ASTRO_PROFILE);
    } catch { /* Safari private mode */ }
    cachedRaw = null;
    cachedProfile = null;
  }
}
