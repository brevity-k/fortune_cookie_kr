import { describe, expect, it } from 'vitest';
import { Body, Observer, SearchAltitude, SearchHourAngle, SunPosition, MakeTime } from 'astronomy-engine';
import { calculateAscendant, calculateMidheaven } from './ascendant';

function angularDistance(a: number, b: number): number {
  const d = Math.abs(((a - b) % 360) + 360) % 360;
  return Math.min(d, 360 - d);
}

// When the Sun's centre crosses the true horizon it sits on the ascendant (rising) or descendant (setting).
// Geometric altitude 0 (no refraction), so the only slack is the Sun's ~0 ecliptic latitude.
const TOLERANCE_DEG = 0.3;

const sites = [
  { name: 'Seoul', lat: 37.5665, lon: 126.978 },
  { name: 'Sydney', lat: -33.8688, lon: 151.2093 },
];

const dates = ['2024-03-20', '2024-06-21', '2024-10-10', '2024-12-21'];

describe.each(sites)('angles at $name', ({ lat, lon }) => {
  const observer = new Observer(lat, lon, 0);

  it.each(dates)('ascendant matches the Sun at sunrise on %s', (day) => {
    const rise = SearchAltitude(Body.Sun, observer, +1, MakeTime(new Date(`${day}T00:00:00Z`)), 2, 0)!;
    const sunLon = SunPosition(rise).elon;
    const asc = calculateAscendant(rise.date, lat, lon).longitude;
    expect(angularDistance(asc, sunLon)).toBeLessThan(TOLERANCE_DEG);
  });

  it.each(dates)('ascendant is opposite the Sun at sunset on %s', (day) => {
    const set = SearchAltitude(Body.Sun, observer, -1, MakeTime(new Date(`${day}T00:00:00Z`)), 2, 0)!;
    const sunLon = SunPosition(set).elon;
    const asc = calculateAscendant(set.date, lat, lon).longitude;
    expect(angularDistance(asc, (sunLon + 180) % 360)).toBeLessThan(TOLERANCE_DEG);
  });

  it.each(dates)('midheaven matches the Sun at upper transit on %s', (day) => {
    const transit = SearchHourAngle(Body.Sun, observer, 0, MakeTime(new Date(`${day}T00:00:00Z`)));
    const sunLon = SunPosition(transit.time).elon;
    const mc = calculateMidheaven(transit.time.date, lon).longitude;
    expect(angularDistance(mc, sunLon)).toBeLessThan(TOLERANCE_DEG);
  });
});
