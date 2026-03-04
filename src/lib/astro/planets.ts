import {
  MakeTime,
  SunPosition,
  EclipticGeoMoon,
  GeoVector,
  Ecliptic,
  Body,
} from 'astronomy-engine';
import type { Planet } from './types';
import type { Body as BodyType } from 'astronomy-engine';

function getMeanNorthNodeLongitude(date: Date): number {
  const J2000 = Date.UTC(2000, 0, 1, 12, 0, 0);
  const msPerDay = 86400000;
  const daysPerJulianYear = 365.25;
  const daysSinceJ2000 = (date.getTime() - J2000) / msPerDay;
  const yearsSinceJ2000 = daysSinceJ2000 / daysPerJulianYear;

  const nodeLongitudeAtJ2000 = 125.044522;
  const regressionRatePerYear = 19.35502;

  const longitude = nodeLongitudeAtJ2000 - regressionRatePerYear * yearsSinceJ2000;
  return ((longitude % 360) + 360) % 360;
}

function planetToBody(planet: Planet): BodyType | null {
  const map: Partial<Record<Planet, BodyType>> = {
    Mercury: Body.Mercury as BodyType,
    Venus: Body.Venus as BodyType,
    Mars: Body.Mars as BodyType,
    Jupiter: Body.Jupiter as BodyType,
    Saturn: Body.Saturn as BodyType,
    Uranus: Body.Uranus as BodyType,
    Neptune: Body.Neptune as BodyType,
    Pluto: Body.Pluto as BodyType,
  };
  return map[planet] ?? null;
}

export function getPlanetLongitude(planet: Planet, date: Date): number {
  const astroTime = MakeTime(date);

  if (planet === 'Sun') {
    const sunPos = SunPosition(astroTime);
    return ((sunPos.elon % 360) + 360) % 360;
  }

  if (planet === 'Moon') {
    const moonPos = EclipticGeoMoon(astroTime);
    return ((moonPos.lon % 360) + 360) % 360;
  }

  if (planet === 'NorthNode') {
    return getMeanNorthNodeLongitude(date);
  }

  const body = planetToBody(planet);
  if (!body) {
    throw new Error(`Unknown planet: ${planet}`);
  }

  const geoVec = GeoVector(body, astroTime, true);
  const ecliptic = Ecliptic(geoVec);
  return ((ecliptic.elon % 360) + 360) % 360;
}

export function isRetrograde(planet: Planet, date: Date): boolean {
  if (planet === 'Sun' || planet === 'Moon') {
    return false;
  }

  if (planet === 'NorthNode') {
    return true;
  }

  const oneDay = 86400000;
  const before = new Date(date.getTime() - oneDay);
  const after = new Date(date.getTime() + oneDay);

  const lonBefore = getPlanetLongitude(planet, before);
  const lonAfter = getPlanetLongitude(planet, after);

  let diff = lonAfter - lonBefore;
  if (diff > 180) diff -= 360;
  if (diff < -180) diff += 360;

  return diff < 0;
}

export function getAllPlanetLongitudes(
  date: Date
): { planet: Planet; longitude: number; retrograde: boolean }[] {
  const planets: Planet[] = [
    'Sun', 'Moon', 'Mercury', 'Venus', 'Mars',
    'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto',
    'NorthNode',
  ];

  return planets.map((planet) => ({
    planet,
    longitude: getPlanetLongitude(planet, date),
    retrograde: isRetrograde(planet, date),
  }));
}
