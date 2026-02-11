export type FortuneCategory =
  | 'love'
  | 'career'
  | 'health'
  | 'study'
  | 'general'
  | 'relationship';

export interface Fortune {
  id: string;
  category: FortuneCategory;
  message: string;
  interpretation: string;
  luckyNumber: number;
  luckyColor: string;
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
