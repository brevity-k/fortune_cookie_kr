import type { ZodiacSign, Planet, AspectType, AstroElement, Modality } from './types';

export const ZODIAC_SIGNS: ZodiacSign[] = [
  'Aries', 'Taurus', 'Gemini', 'Cancer',
  'Leo', 'Virgo', 'Libra', 'Scorpio',
  'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces',
];

export const ZODIAC_SYMBOLS: Record<ZodiacSign, string> = {
  Aries: '\u2648', Taurus: '\u2649', Gemini: '\u264A', Cancer: '\u264B',
  Leo: '\u264C', Virgo: '\u264D', Libra: '\u264E', Scorpio: '\u264F',
  Sagittarius: '\u2650', Capricorn: '\u2651', Aquarius: '\u2652', Pisces: '\u2653',
};

export const PLANET_SYMBOLS: Record<Planet, string> = {
  Sun: '\u2609', Moon: '\u263D', Mercury: '\u263F', Venus: '\u2640', Mars: '\u2642',
  Jupiter: '\u2643', Saturn: '\u2644', Uranus: '\u2645', Neptune: '\u2646', Pluto: '\u2647',
  NorthNode: '\u260A',
};

export const SIGN_ELEMENTS: AstroElement[] = [
  'fire', 'earth', 'air', 'water',
  'fire', 'earth', 'air', 'water',
  'fire', 'earth', 'air', 'water',
];

export const SIGN_MODALITIES: Modality[] = [
  'cardinal', 'fixed', 'mutable',
  'cardinal', 'fixed', 'mutable',
  'cardinal', 'fixed', 'mutable',
  'cardinal', 'fixed', 'mutable',
];

export const ASPECT_CONFIGS: { type: AspectType; angle: number; orb: number }[] = [
  { type: 'conjunction', angle: 0, orb: 8 },
  { type: 'sextile', angle: 60, orb: 6 },
  { type: 'square', angle: 90, orb: 8 },
  { type: 'trine', angle: 120, orb: 8 },
  { type: 'opposition', angle: 180, orb: 8 },
];

export const PLANETS: Planet[] = [
  'Sun', 'Moon', 'Mercury', 'Venus', 'Mars',
  'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto',
  'NorthNode',
];

// Korean name mappings
export const ZODIAC_KOREAN: Record<ZodiacSign, string> = {
  Aries: '양자리', Taurus: '황소자리', Gemini: '쌍둥이자리', Cancer: '게자리',
  Leo: '사자자리', Virgo: '처녀자리', Libra: '천칭자리', Scorpio: '전갈자리',
  Sagittarius: '사수자리', Capricorn: '염소자리', Aquarius: '물병자리', Pisces: '물고기자리',
};

export const PLANET_KOREAN: Record<Planet, string> = {
  Sun: '태양', Moon: '달', Mercury: '수성', Venus: '금성', Mars: '화성',
  Jupiter: '목성', Saturn: '토성', Uranus: '천왕성', Neptune: '해왕성', Pluto: '명왕성',
  NorthNode: '북교점',
};

export const ELEMENT_KOREAN: Record<AstroElement, string> = {
  fire: '불', earth: '흙', air: '바람', water: '물',
};

export const MODALITY_KOREAN: Record<Modality, string> = {
  cardinal: '활동궁', fixed: '고정궁', mutable: '변통궁',
};

export const ASPECT_KOREAN: Record<AspectType, string> = {
  conjunction: '합', sextile: '육분', square: '사각', trine: '삼합', opposition: '충',
};
