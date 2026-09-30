import type { BirthInfo, SajuChart } from './types';
import { calculateFourPillars } from './four-pillars';
import { analyzeFiveElements } from './five-elements';
import { calculateMajorLuckCycles } from './major-luck';
import { STORAGE_KEYS } from '@/lib/storage-keys';

export interface SajuProfile {
  birthInfo: BirthInfo;
  chart: SajuChart;
  createdAt: string;
}

// Cache for useSyncExternalStore — must return the same reference when data hasn't changed
let cachedRaw: string | null = null;
let cachedProfile: SajuProfile | null = null;

export function saveSajuProfile(birthInfo: BirthInfo): SajuProfile {
  const fourPillars = calculateFourPillars(birthInfo);
  const fiveElements = analyzeFiveElements(fourPillars);
  const majorLuckCycles = calculateMajorLuckCycles(birthInfo, fourPillars);

  const profile: SajuProfile = {
    birthInfo,
    chart: { birthInfo, fourPillars, fiveElements, majorLuckCycles },
    createdAt: new Date().toISOString(),
  };

  if (typeof window !== 'undefined') {
    const json = JSON.stringify(profile);
    cachedRaw = json;
    cachedProfile = profile;
    try {
      localStorage.setItem(STORAGE_KEYS.SAJU_PROFILE, json);
    } catch {
      // localStorage unavailable (Safari private mode, quota) — profile lives in memory only
    }
  }

  return profile;
}

export function getSajuProfile(): SajuProfile | null {
  if (typeof window === 'undefined') return null;
  let raw: string | null;
  try {
    raw = localStorage.getItem(STORAGE_KEYS.SAJU_PROFILE);
  } catch {
    // localStorage unavailable — fall back to the in-memory copy from saveSajuProfile
    return cachedProfile;
  }
  if (!raw) {
    cachedRaw = null;
    cachedProfile = null;
    return null;
  }
  if (raw === cachedRaw) return cachedProfile;
  try {
    cachedRaw = raw;
    cachedProfile = JSON.parse(raw) as SajuProfile;
    return cachedProfile;
  } catch {
    cachedRaw = null;
    cachedProfile = null;
    return null;
  }
}

export function clearSajuProfile(): void {
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem(STORAGE_KEYS.SAJU_PROFILE);
    } catch {
      // localStorage unavailable
    }
    cachedRaw = null;
    cachedProfile = null;
  }
}
