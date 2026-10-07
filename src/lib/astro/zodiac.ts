import type { ZodiacPosition } from './types';
import { ZODIAC_SIGNS } from './constants';

export function longitudeToZodiac(longitude: number): ZodiacPosition {
  const normalized = ((longitude % 360) + 360) % 360;
  const signIndex = Math.floor(normalized / 30);
  const degree = normalized % 30;
  return {
    sign: ZODIAC_SIGNS[signIndex],
    degree,
    longitude: normalized,
  };
}
