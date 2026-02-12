export interface MBTITypeInfo {
  key: string;
  label: string;
  emoji: string;
  description: string;
}

export const MBTI_TYPES: MBTITypeInfo[] = [
  { key: 'intj', label: 'INTJ', emoji: '🧠', description: '용의주도한 전략가' },
  { key: 'intp', label: 'INTP', emoji: '🔬', description: '논리적인 사색가' },
  { key: 'entj', label: 'ENTJ', emoji: '👑', description: '대담한 통솔자' },
  { key: 'entp', label: 'ENTP', emoji: '💡', description: '뜨거운 논쟁을 즐기는 변론가' },
  { key: 'infj', label: 'INFJ', emoji: '🌌', description: '선의의 옹호자' },
  { key: 'infp', label: 'INFP', emoji: '🌸', description: '열정적인 중재자' },
  { key: 'enfj', label: 'ENFJ', emoji: '🌟', description: '정의로운 사회운동가' },
  { key: 'enfp', label: 'ENFP', emoji: '🎭', description: '재기발랄한 활동가' },
  { key: 'istj', label: 'ISTJ', emoji: '📋', description: '청렴결백한 논리주의자' },
  { key: 'isfj', label: 'ISFJ', emoji: '🛡️', description: '용감한 수호자' },
  { key: 'estj', label: 'ESTJ', emoji: '⚖️', description: '엄격한 관리자' },
  { key: 'esfj', label: 'ESFJ', emoji: '🤗', description: '사교적인 외교관' },
  { key: 'istp', label: 'ISTP', emoji: '🔧', description: '만능 재주꾼' },
  { key: 'isfp', label: 'ISFP', emoji: '🎨', description: '호기심 많은 예술가' },
  { key: 'estp', label: 'ESTP', emoji: '🏄', description: '모험을 즐기는 사업가' },
  { key: 'esfp', label: 'ESFP', emoji: '🎉', description: '자유로운 영혼의 연예인' },
];
