import { describe, expect, it } from 'vitest';
import { calculateNatalChart } from './natal-chart';
import { getAllPlanetLongitudes } from './planets';
import { longitudeToZodiac } from './zodiac';
import type { AstroBirthInfo } from './types';

const SEOUL = { latitude: 37.5665, longitude: 126.978, cityName: 'Seoul' };

function signsAt(date: Date) {
  const planets = getAllPlanetLongitudes(date);
  const lon = (name: string) => planets.find((p) => p.planet === name)!.longitude;
  return { sun: longitudeToZodiac(lon('Sun')).sign, moon: longitudeToZodiac(lon('Moon')).sign };
}

function sign(chart: ReturnType<typeof calculateNatalChart>, planet: string) {
  return chart.planets.find((p) => p.planet === planet)!.sign;
}

describe('calculateNatalChart birth time zone', () => {
  it('treats 2000-03-20 12:00 as KST: Sun still in Pisces (old UTC reading gave Aries)', () => {
    // The 2000 March equinox was 07:35 UTC (16:35 KST). Noon KST is 03:00Z, before it.
    const info: AstroBirthInfo = { year: 2000, month: 3, day: 20, hour: 12, minute: 0, ...SEOUL };
    const chart = calculateNatalChart(info);

    const buggy = signsAt(new Date(Date.UTC(2000, 2, 20, 12, 0))); // previous behaviour
    expect(buggy.sun).toBe('Aries');
    expect(buggy.moon).toBe('Libra');

    expect(sign(chart, 'Sun')).toBe('Pisces');
    expect(sign(chart, 'Moon')).toBe('Virgo');
    expect(signsAt(new Date('2000-03-20T03:00:00Z'))).toEqual({ sun: 'Pisces', moon: 'Virgo' });
  });

  it('uses the 1988 DST offset (UTC+10) for chart positions', () => {
    const info: AstroBirthInfo = { year: 1988, month: 7, day: 1, hour: 12, minute: 0, ...SEOUL };
    const chart = calculateNatalChart(info);
    const expected = getAllPlanetLongitudes(new Date('1988-07-01T02:00:00Z'));
    for (const p of chart.planets) {
      const e = expected.find((x) => x.planet === p.planet)!;
      expect(p.longitude).toBeCloseTo(e.longitude, 6);
    }
    // Moon moved from Aquarius (UTC reading) to Capricorn (correct KDT reading).
    expect(sign(chart, 'Moon')).toBe('Capricorn');
  });
});
