export interface HoroscopeSign {
  key: string;
  label: string;
  emoji: string;
  dateRange: string;
  element: string;
}

export const HOROSCOPE_SIGNS: HoroscopeSign[] = [
  { key: 'aries', label: '양자리', emoji: '♈', dateRange: '3.21 - 4.19', element: '불' },
  { key: 'taurus', label: '황소자리', emoji: '♉', dateRange: '4.20 - 5.20', element: '흙' },
  { key: 'gemini', label: '쌍둥이자리', emoji: '♊', dateRange: '5.21 - 6.21', element: '바람' },
  { key: 'cancer', label: '게자리', emoji: '♋', dateRange: '6.22 - 7.22', element: '물' },
  { key: 'leo', label: '사자자리', emoji: '♌', dateRange: '7.23 - 8.22', element: '불' },
  { key: 'virgo', label: '처녀자리', emoji: '♍', dateRange: '8.23 - 9.22', element: '흙' },
  { key: 'libra', label: '천칭자리', emoji: '♎', dateRange: '9.23 - 10.22', element: '바람' },
  { key: 'scorpio', label: '전갈자리', emoji: '♏', dateRange: '10.23 - 11.22', element: '물' },
  { key: 'sagittarius', label: '사수자리', emoji: '♐', dateRange: '11.23 - 12.21', element: '불' },
  { key: 'capricorn', label: '염소자리', emoji: '♑', dateRange: '12.22 - 1.19', element: '흙' },
  { key: 'aquarius', label: '물병자리', emoji: '♒', dateRange: '1.20 - 2.18', element: '바람' },
  { key: 'pisces', label: '물고기자리', emoji: '♓', dateRange: '2.19 - 3.20', element: '물' },
];
