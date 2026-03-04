import type { HouseCusp } from './types';
import { longitudeToZodiac } from './zodiac';
import { calculateAscendant, calculateMidheaven } from './ascendant';

function normalizeDegrees(deg: number): number {
  return ((deg % 360) + 360) % 360;
}

function clockwiseArc(from: number, to: number): number {
  let arc = from - to;
  if (arc <= 0) arc += 360;
  return arc;
}

function trisectClockwise(from: number, to: number, step: number): number {
  const arc = clockwiseArc(from, to);
  return normalizeDegrees(from - (arc * step) / 3);
}

export function calculateHouseCusps(
  date: Date,
  latitude: number,
  longitude: number
): HouseCusp[] {
  const ascPos = calculateAscendant(date, latitude, longitude);
  const mcPos = calculateMidheaven(date, longitude);

  const asc = ascPos.longitude;
  const mc = mcPos.longitude;
  const dsc = normalizeDegrees(asc + 180);
  const ic = normalizeDegrees(mc + 180);

  const h2 = trisectClockwise(asc, ic, 1);
  const h3 = trisectClockwise(asc, ic, 2);
  const h5 = trisectClockwise(ic, dsc, 1);
  const h6 = trisectClockwise(ic, dsc, 2);
  const h8 = trisectClockwise(dsc, mc, 1);
  const h9 = trisectClockwise(dsc, mc, 2);
  const h11 = trisectClockwise(mc, asc, 1);
  const h12 = trisectClockwise(mc, asc, 2);

  const longitudes = [asc, h2, h3, ic, h5, h6, dsc, h8, h9, mc, h11, h12];

  return longitudes.map((lon, i) => {
    const zodiac = longitudeToZodiac(lon);
    return {
      house: i + 1,
      longitude: zodiac.longitude,
      sign: zodiac.sign,
      degree: zodiac.degree,
    };
  });
}

export function getHouseForLongitude(longitude: number, cusps: HouseCusp[]): number {
  const normalizedLon = normalizeDegrees(longitude);

  for (let i = 0; i < 12; i++) {
    const currentCusp = cusps[i].longitude;
    const nextCusp = cusps[(i + 1) % 12].longitude;

    if (Math.abs(normalizedLon - currentCusp) < 1e-9) {
      return cusps[i].house;
    }

    const arcToNext = clockwiseArc(currentCusp, nextCusp);
    const arcToPoint = clockwiseArc(currentCusp, normalizedLon);

    if (arcToPoint < arcToNext) {
      return cusps[i].house;
    }
  }

  return 1;
}
