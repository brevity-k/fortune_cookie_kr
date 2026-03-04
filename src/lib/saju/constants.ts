import type { Element, YinYang } from './types';

// 천간 (Heavenly Stems) — 10 stems
export const STEMS_HANJA = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'] as const;
export const STEMS_KOREAN = ['갑', '을', '병', '정', '무', '기', '경', '신', '임', '계'] as const;

// 지지 (Earthly Branches) — 12 branches
export const BRANCHES_HANJA = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'] as const;
export const BRANCHES_KOREAN = ['자', '축', '인', '묘', '진', '사', '오', '미', '신', '유', '술', '해'] as const;
export const BRANCHES_ANIMAL = ['Rat', 'Ox', 'Tiger', 'Rabbit', 'Dragon', 'Snake', 'Horse', 'Goat', 'Monkey', 'Rooster', 'Dog', 'Pig'] as const;
export const BRANCHES_ANIMAL_KOREAN = ['쥐', '소', '호랑이', '토끼', '용', '뱀', '말', '양', '원숭이', '닭', '개', '돼지'] as const;

// 오행 (Five Elements) mapping for stems
export const STEM_ELEMENTS: Element[] = ['wood', 'wood', 'fire', 'fire', 'earth', 'earth', 'metal', 'metal', 'water', 'water'];

// 음양 (Yin/Yang) mapping for stems
export const STEM_YINYANG: YinYang[] = ['yang', 'yin', 'yang', 'yin', 'yang', 'yin', 'yang', 'yin', 'yang', 'yin'];

// 오행 mapping for branches
export const BRANCH_ELEMENTS: Element[] = ['water', 'earth', 'wood', 'wood', 'earth', 'fire', 'fire', 'earth', 'metal', 'metal', 'earth', 'water'];

// 오호둔 (五虎遁): year stem → first month stem index
// 甲/己→丙(2), 乙/庚→戊(4), 丙/辛→庚(6), 丁/壬→壬(8), 戊/癸→甲(0)
export const MONTH_STEM_START = [2, 4, 6, 8, 0, 2, 4, 6, 8, 0] as const;

// 오자둔 (五子遁): day stem → first hour (子시) stem index
// 甲/己→甲(0), 乙/庚→丙(2), 丙/辛→戊(4), 丁/壬→庚(6), 戊/癸→壬(8)
export const HOUR_STEM_START = [0, 2, 4, 6, 8, 0, 2, 4, 6, 8] as const;

// 절기 (Solar term boundaries) — defines saju month transitions
// Each entry: solar term name, Korean name, gregorian month, approx day, saju month (1-12), branch index
export interface SolarTermBoundary {
  name: string;
  korean: string;
  month: number;   // Gregorian month (1-12)
  day: number;     // Approximate day
  sajuMonth: number; // Saju month (1-12)
  branchIndex: number; // Earthly branch index for this month
}

export const SOLAR_TERM_BOUNDARIES: SolarTermBoundary[] = [
  { name: 'Ipchun',     korean: '입춘', month: 2,  day: 4,  sajuMonth: 1,  branchIndex: 2  }, // 인월
  { name: 'Gyeongchip', korean: '경칩', month: 3,  day: 6,  sajuMonth: 2,  branchIndex: 3  }, // 묘월
  { name: 'Cheongmyeong', korean: '청명', month: 4,  day: 5,  sajuMonth: 3,  branchIndex: 4  }, // 진월
  { name: 'Ipha',       korean: '입하', month: 5,  day: 6,  sajuMonth: 4,  branchIndex: 5  }, // 사월
  { name: 'Mangjong',   korean: '망종', month: 6,  day: 6,  sajuMonth: 5,  branchIndex: 6  }, // 오월
  { name: 'Soseo',      korean: '소서', month: 7,  day: 7,  sajuMonth: 6,  branchIndex: 7  }, // 미월
  { name: 'Ipchu',      korean: '입추', month: 8,  day: 7,  sajuMonth: 7,  branchIndex: 8  }, // 신월
  { name: 'Baengno',    korean: '백로', month: 9,  day: 8,  sajuMonth: 8,  branchIndex: 9  }, // 유월
  { name: 'Hallo',      korean: '한로', month: 10, day: 8,  sajuMonth: 9,  branchIndex: 10 }, // 술월
  { name: 'Ipdong',     korean: '입동', month: 11, day: 7,  sajuMonth: 10, branchIndex: 11 }, // 해월
  { name: 'Daesseol',   korean: '대설', month: 12, day: 7,  sajuMonth: 11, branchIndex: 0  }, // 자월
  { name: 'Sohan',      korean: '소한', month: 1,  day: 6,  sajuMonth: 12, branchIndex: 1  }, // 축월
];

// 상생 (generating cycle): wood→fire→earth→metal→water→wood
export const GENERATING_CYCLE: Record<Element, Element> = {
  wood: 'fire',
  fire: 'earth',
  earth: 'metal',
  metal: 'water',
  water: 'wood',
};

// 상극 (overcoming cycle): wood→earth, earth→water, water→fire, fire→metal, metal→wood
export const OVERCOMING_CYCLE: Record<Element, Element> = {
  wood: 'earth',
  earth: 'water',
  water: 'fire',
  fire: 'metal',
  metal: 'wood',
};

// Reverse of generating: which element generates this one?
export const GENERATED_BY: Record<Element, Element> = {
  wood: 'water',
  fire: 'wood',
  earth: 'fire',
  metal: 'earth',
  water: 'metal',
};
