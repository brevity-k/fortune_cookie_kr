export interface ZodiacAnimal {
  key: string;
  label: string;
  emoji: string;
  years: number[];
}

export const ZODIAC_ANIMALS: ZodiacAnimal[] = [
  { key: 'rat', label: '쥐띠', emoji: '🐀', years: [1960, 1972, 1984, 1996, 2008, 2020] },
  { key: 'ox', label: '소띠', emoji: '🐂', years: [1961, 1973, 1985, 1997, 2009, 2021] },
  { key: 'tiger', label: '호랑이띠', emoji: '🐅', years: [1962, 1974, 1986, 1998, 2010, 2022] },
  { key: 'rabbit', label: '토끼띠', emoji: '🐇', years: [1963, 1975, 1987, 1999, 2011, 2023] },
  { key: 'dragon', label: '용띠', emoji: '🐉', years: [1964, 1976, 1988, 2000, 2012, 2024] },
  { key: 'snake', label: '뱀띠', emoji: '🐍', years: [1965, 1977, 1989, 2001, 2013, 2025] },
  { key: 'horse', label: '말띠', emoji: '🐎', years: [1966, 1978, 1990, 2002, 2014, 2026] },
  { key: 'sheep', label: '양띠', emoji: '🐑', years: [1967, 1979, 1991, 2003, 2015, 2027] },
  { key: 'monkey', label: '원숭이띠', emoji: '🐒', years: [1968, 1980, 1992, 2004, 2016, 2028] },
  { key: 'rooster', label: '닭띠', emoji: '🐓', years: [1969, 1981, 1993, 2005, 2017, 2029] },
  { key: 'dog', label: '개띠', emoji: '🐕', years: [1970, 1982, 1994, 2006, 2018, 2030] },
  { key: 'pig', label: '돼지띠', emoji: '🐷', years: [1971, 1983, 1995, 2007, 2019, 2031] },
];
