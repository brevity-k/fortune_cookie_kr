import type { AstroBirthInfo, AstroProfile } from './types';
import { calculateNatalChart } from './natal-chart';
import { STORAGE_KEYS } from '@/lib/storage-keys';

let cachedRaw: string | null = null;
let cachedProfile: AstroProfile | null = null;

function buildProfile(birthInfo: AstroBirthInfo, createdAt: string): AstroProfile {
  return {
    birthInfo,
    chart: calculateNatalChart(birthInfo),
    createdAt,
    birthTimeZone: 'Asia/Seoul',
  };
}

function persistProfile(profile: AstroProfile): void {
  if (typeof window === 'undefined') return;
  try {
    const json = JSON.stringify(profile);
    localStorage.setItem(STORAGE_KEYS.ASTRO_PROFILE, json);
    cachedRaw = json;
    cachedProfile = profile;
  } catch { /* Safari private mode */ }
}

export function saveAstroProfile(birthInfo: AstroBirthInfo): AstroProfile {
  const profile = buildProfile(birthInfo, new Date().toISOString());
  persistProfile(profile);
  return profile;
}

function hasNumericBirthInfo(b: AstroBirthInfo): boolean {
  return [b.year, b.month, b.day, b.hour, b.minute, b.latitude, b.longitude]
    .every((n) => typeof n === 'number' && Number.isFinite(n));
}

/**
 * Charts saved before birth times were read as Asia/Seoul were computed as if
 * the input were UTC (~9h off). Recompute them from the stored birth info.
 */
function migrateProfile(profile: AstroProfile): AstroProfile | null {
  if (profile.birthTimeZone === 'Asia/Seoul') return profile;
  if (!hasNumericBirthInfo(profile.birthInfo)) return null;
  try {
    const migrated = buildProfile(profile.birthInfo, profile.createdAt);
    persistProfile(migrated);
    return migrated;
  } catch {
    return null;
  }
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
    // A malformed entry would otherwise crash every render of the birth-chart page.
    const profile = isAstroProfile(parsed) ? migrateProfile(parsed) : null;
    // A successful migration already cached the re-saved JSON. Otherwise (unchanged,
    // invalid, or the re-save failed) cache against this raw value so the snapshot stays stable.
    if (cachedProfile !== profile) {
      cachedRaw = raw;
      cachedProfile = profile;
    }
    return profile;
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
