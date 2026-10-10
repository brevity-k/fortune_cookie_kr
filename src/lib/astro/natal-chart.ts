import type { AstroBirthInfo, NatalChart } from './types';
import { getAllPlanetLongitudes } from './planets';
import { longitudeToZodiac } from './zodiac';
import { calculateAscendant, calculateMidheaven } from './ascendant';
import { calculateHouseCusps, getHouseForLongitude } from './houses';
import { detectAspects } from './aspects';
import { countElements, countModalities } from './balance';
import { seoulWallTimeToUtc } from '@/lib/time/seoul';

export function calculateNatalChart(birthInfo: AstroBirthInfo): NatalChart {
  // Birth date/time is entered as Korean wall-clock time (Asia/Seoul), including
  // historical offsets (UTC+8:30, 1948-1988 DST), not as UTC.
  const birthDate = seoulWallTimeToUtc(
    birthInfo.year, birthInfo.month, birthInfo.day, birthInfo.hour, birthInfo.minute
  );

  const rawPlanets = getAllPlanetLongitudes(birthDate);
  const ascendant = calculateAscendant(birthDate, birthInfo.latitude, birthInfo.longitude);
  const midheaven = calculateMidheaven(birthDate, birthInfo.longitude);
  const houses = calculateHouseCusps(birthDate, birthInfo.latitude, birthInfo.longitude);

  const planets = rawPlanets.map((rp) => {
    const zodiac = longitudeToZodiac(rp.longitude);
    return {
      planet: rp.planet,
      longitude: rp.longitude,
      sign: zodiac.sign,
      degree: zodiac.degree,
      house: getHouseForLongitude(rp.longitude, houses),
      retrograde: rp.retrograde,
    };
  });

  const aspects = detectAspects(planets);
  const elements = countElements(planets, ascendant, midheaven);
  const modalities = countModalities(planets, ascendant, midheaven);

  return { planets, ascendant, midheaven, houses, aspects, elements, modalities };
}
