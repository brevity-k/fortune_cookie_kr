export const FORTUNE_CATEGORIES = [
  'love',
  'career',
  'health',
  'study',
  'general',
  'relationship',
] as const;

export type FortuneCategory = (typeof FORTUNE_CATEGORIES)[number];

export const VALID_COLORS = [
  '빨간색',
  '파란색',
  '초록색',
  '노란색',
  '보라색',
  '분홍색',
  '금색',
  '은색',
  '하늘색',
  '주황색',
  '흰색',
  '검정색',
  '검은색',
  '남색',
  '연두색',
  '갈색',
  '회색',
] as const;

export type ValidColor = (typeof VALID_COLORS)[number];

export interface Fortune {
  id: string;
  category: FortuneCategory;
  message: string;
  interpretation: string;
  luckyNumber: number;
  luckyColor: ValidColor;
  rating: 1 | 2 | 3 | 4 | 5;
  emoji: string;
  shareText: string;
}

export interface CategoryInfo {
  key: FortuneCategory;
  label: string;
  emoji: string;
  description: string;
  color: string;
}

export const CATEGORIES: CategoryInfo[] = [
  {
    key: 'general',
    label: '총운',
    emoji: '🔮',
    description: '오늘의 전체적인 운세를 확인해보세요',
    color: '#9B59B6',
  },
  {
    key: 'love',
    label: '사랑운',
    emoji: '💕',
    description: '사랑과 연애에 대한 운세',
    color: '#E74C3C',
  },
  {
    key: 'career',
    label: '재물운',
    emoji: '💰',
    description: '직장, 사업, 재물에 대한 운세',
    color: '#F39C12',
  },
  {
    key: 'health',
    label: '건강운',
    emoji: '💚',
    description: '건강과 활력에 대한 운세',
    color: '#2ECC71',
  },
  {
    key: 'study',
    label: '학업운',
    emoji: '📚',
    description: '학업, 시험, 자기개발에 대한 운세',
    color: '#3498DB',
  },
  {
    key: 'relationship',
    label: '대인운',
    emoji: '🤝',
    description: '인간관계와 소통에 대한 운세',
    color: '#1ABC9C',
  },
];

export const CATEGORY_LABELS: Record<FortuneCategory, string> =
  Object.fromEntries(CATEGORIES.map((c) => [c.key, c.label])) as Record<
    FortuneCategory,
    string
  >;

// NOTE: Category names here must match FORTUNE_CATEGORIES above.
// Using a literal regex (vs dynamic RegExp) for better static analysis and zero runtime cost.
export const FORTUNE_ID_PATTERN =
  /^(love|career|health|study|general|relationship)_\d{3}$/;

export type CookieBreakMethod =
  | 'click'
  | 'drag'
  | 'longpress'
  | 'shake'
  | 'doubletap';

export type CookieState =
  | 'idle'
  | 'crack-1'
  | 'crack-2'
  | 'breaking'
  | 'broken'
  | 'revealed';
