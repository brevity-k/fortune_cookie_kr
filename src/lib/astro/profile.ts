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
    cachedRaw = raw;
    cachedProfile = JSON.parse(raw) as AstroProfile;
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
