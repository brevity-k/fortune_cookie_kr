import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { STORAGE_KEYS } from '@/lib/storage-keys';
import { calculateNatalChart } from './natal-chart';
import type { AstroBirthInfo } from './types';

const birthInfo: AstroBirthInfo = {
  year: 2000, month: 3, day: 20, hour: 12, minute: 0, latitude: 37.5665, longitude: 126.978, cityName: 'Seoul',
};

function stubStorage(store: Map<string, string>) {
  vi.stubGlobal('window', {});
  vi.stubGlobal('localStorage', {
    getItem: (k: string) => store.get(k) ?? null,
    setItem: (k: string, v: string) => void store.set(k, v),
    removeItem: (k: string) => void store.delete(k),
  });
}

describe('getAstroProfile migration', () => {
  beforeEach(() => vi.resetModules());
  afterEach(() => vi.unstubAllGlobals());

  it('recomputes a chart saved before KST handling and re-saves it', async () => {
    // Legacy chart (computed as UTC) had the Sun in Aries for this birth time.
    const legacyChart = { ...calculateNatalChart(birthInfo), planets: [{ planet: 'Sun', sign: 'Aries' }] };
    const store = new Map([[STORAGE_KEYS.ASTRO_PROFILE as string, JSON.stringify({
      birthInfo, chart: legacyChart, createdAt: '2025-01-01T00:00:00.000Z',
    })]]);
    stubStorage(store);
    const { getAstroProfile } = await import('./profile');

    const profile = getAstroProfile()!;
    expect(profile.birthTimeZone).toBe('Asia/Seoul');
    expect(profile.createdAt).toBe('2025-01-01T00:00:00.000Z');
    expect(profile.chart.planets.find((p) => p.planet === 'Sun')!.sign).toBe('Pisces');
    expect(JSON.parse(store.get(STORAGE_KEYS.ASTRO_PROFILE)!).birthTimeZone).toBe('Asia/Seoul');
    // Stable snapshot for useSyncExternalStore.
    expect(getAstroProfile()).toBe(profile);
  });

  it('returns a stable snapshot when the migrated profile cannot be saved', async () => {
    const store = new Map([[STORAGE_KEYS.ASTRO_PROFILE as string, JSON.stringify({
      birthInfo, chart: calculateNatalChart(birthInfo), createdAt: '2025-01-01T00:00:00.000Z',
    })]]);
    stubStorage(store);
    vi.stubGlobal('localStorage', {
      getItem: (k: string) => store.get(k) ?? null,
      setItem: () => { throw new Error('QuotaExceededError'); },
      removeItem: () => {},
    });
    const { getAstroProfile } = await import('./profile');

    const first = getAstroProfile();
    expect(first?.birthTimeZone).toBe('Asia/Seoul');
    expect(getAstroProfile()).toBe(first);
  });
});
