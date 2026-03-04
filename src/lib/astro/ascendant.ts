import { MakeTime, SiderealTime, e_tilt } from 'astronomy-engine';
import type { ZodiacPosition } from './types';
import { longitudeToZodiac } from './zodiac';

function getLocalSiderealTime(date: Date, longitude: number): number {
  const astroTime = MakeTime(date);
  const gast = SiderealTime(astroTime);
  let lst = gast + longitude / 15;
  lst = ((lst % 24) + 24) % 24;
  return lst;
}

function getObliquity(date: Date): number {
  const astroTime = MakeTime(date);
  const tilt = e_tilt(astroTime);
  return tilt.tobl;
}

export function calculateAscendant(
  date: Date,
  latitude: number,
  longitude: number
): ZodiacPosition {
  const lst = getLocalSiderealTime(date, longitude);
  const ramc = lst * 15;

  const eps = getObliquity(date) * (Math.PI / 180);
  const ramcRad = ramc * (Math.PI / 180);
  const latRad = latitude * (Math.PI / 180);

  const y = -Math.cos(ramcRad);
  const x = Math.sin(eps) * Math.tan(latRad) + Math.cos(eps) * Math.sin(ramcRad);

  let ascDeg = Math.atan2(y, x) * (180 / Math.PI);
  ascDeg = ((ascDeg % 360) + 360) % 360;

  return longitudeToZodiac(ascDeg);
}

export function calculateMidheaven(
  date: Date,
  longitude: number
): ZodiacPosition {
  const lst = getLocalSiderealTime(date, longitude);
  const ramc = lst * 15;

  const eps = getObliquity(date) * (Math.PI / 180);
  const ramcRad = ramc * (Math.PI / 180);

  const y = Math.sin(ramcRad);
  const x = Math.cos(ramcRad) * Math.cos(eps);

  let mcDeg = Math.atan2(y, x) * (180 / Math.PI);
  mcDeg = ((mcDeg % 360) + 360) % 360;

  return longitudeToZodiac(mcDeg);
}
