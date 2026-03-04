'use client';

import { useState, useRef, useEffect } from 'react';
import type { City } from '@/lib/astro/types';
import citiesData from '@/data/cities.json';

const cities = citiesData as City[];

// Korean → English city name mapping for Korean input search
const KOREAN_CITY_NAMES: Record<string, string[]> = {
  // South Korea
  서울: ['Seoul'], 부산: ['Busan'], 인천: ['Incheon'], 대구: ['Daegu'],
  대전: ['Daejeon'], 광주: ['Gwangju'], 울산: ['Ulsan'], 수원: ['Suwon'],
  성남: ['Seongnam'], 고양: ['Goyang'], 용인: ['Yongin'], 창원: ['Changwon'],
  청주: ['Cheongju'], 전주: ['Jeonju'], 천안: ['Cheonan'], 안산: ['Ansan'],
  안양: ['Anyang'], 남양주: ['Namyangju'], 화성: ['Hwaseong'], 평택: ['Pyeongtaek'],
  제주: ['Jeju'], 포항: ['Pohang'], 김해: ['Gimhae'], 구미: ['Gumi'],
  진주: ['Jinju'], 원주: ['Wonju'], 춘천: ['Chuncheon'], 강릉: ['Gangneung'],
  목포: ['Mokpo'], 여수: ['Yeosu'], 순천: ['Suncheon'], 군산: ['Gunsan'],
  익산: ['Iksan'], 양산: ['Yangsan'], 경주: ['Gyeongju'], 거제: ['Geoje'],
  세종: ['Sejong'], 파주: ['Paju'], 김포: ['Gimpo'], 시흥: ['Siheung'],
  의정부: ['Uijeongbu'], 광명: ['Gwangmyeong'], 하남: ['Hanam'],
  이천: ['Icheon'], 양주: ['Yangju'], 오산: ['Osan'], 구리: ['Guri'],
  안성: ['Anseong'], 포천: ['Pocheon'], 의왕: ['Uiwang'], 여주: ['Yeoju'],
  동해: ['Donghae'], 속초: ['Sokcho'], 삼척: ['Samcheok'], 태백: ['Taebaek'],
  충주: ['Chungju'], 제천: ['Jecheon'], 보령: ['Boryeong'], 아산: ['Asan'],
  서산: ['Seosan'], 논산: ['Nonsan'], 당진: ['Dangjin'], 공주: ['Gongju'],
  정읍: ['Jeongeup'], 남원: ['Namwon'], 김제: ['Gimje'], 나주: ['Naju'],
  광양: ['Gwangyang'], 통영: ['Tongyeong'], 사천: ['Sacheon'], 밀양: ['Miryang'],
  // North Korea
  평양: ['Pyongyang'], 개성: ['Kaesong'],
  // Japan
  도쿄: ['Tokyo'], 오사카: ['Osaka'], 교토: ['Kyoto'], 나고야: ['Nagoya'],
  후쿠오카: ['Fukuoka'], 삿포로: ['Sapporo'], 요코하마: ['Yokohama'],
  고베: ['Kobe'], 히로시마: ['Hiroshima'], 나라: ['Nara'],
  // China
  베이징: ['Beijing'], 상하이: ['Shanghai'], 홍콩: ['Hong Kong'],
  광저우: ['Guangzhou'], 선전: ['Shenzhen'], 칭다오: ['Qingdao'],
  시안: ['Xian'], 청두: ['Chengdu'], 난징: ['Nanjing'], 항저우: ['Hangzhou'],
  다롄: ['Dalian'], 톈진: ['Tianjin'], 하얼빈: ['Harbin'], 우한: ['Wuhan'],
  // Taiwan
  타이베이: ['Taipei'], 가오슝: ['Kaohsiung'],
  // Southeast Asia
  방콕: ['Bangkok'], 싱가포르: ['Singapore'], 하노이: ['Hanoi'],
  호치민: ['Ho Chi Minh City'], 자카르타: ['Jakarta'], 마닐라: ['Manila'],
  쿠알라룸푸르: ['Kuala Lumpur'], 발리: ['Bali'],
  // USA
  뉴욕: ['New York'], 로스앤젤레스: ['Los Angeles'], 시카고: ['Chicago'],
  샌프란시스코: ['San Francisco'], 워싱턴: ['Washington'], 보스턴: ['Boston'],
  시애틀: ['Seattle'], 라스베이거스: ['Las Vegas'], 호놀룰루: ['Honolulu'],
  휴스턴: ['Houston'], 댈러스: ['Dallas'], 애틀랜타: ['Atlanta'],
  마이애미: ['Miami'], 필라델피아: ['Philadelphia'], 피닉스: ['Phoenix'],
  샌디에이고: ['San Diego'], 덴버: ['Denver'], 포틀랜드: ['Portland'],
  // Canada
  토론토: ['Toronto'], 밴쿠버: ['Vancouver'], 몬트리올: ['Montreal'],
  오타와: ['Ottawa'], 캘거리: ['Calgary'],
  // Europe
  런던: ['London'], 파리: ['Paris'], 베를린: ['Berlin'], 로마: ['Rome'],
  마드리드: ['Madrid'], 바르셀로나: ['Barcelona'], 암스테르담: ['Amsterdam'],
  브뤼셀: ['Brussels'], 비엔나: ['Vienna'], 프라하: ['Prague'],
  부다페스트: ['Budapest'], 취리히: ['Zurich'], 제네바: ['Geneva'],
  뮌헨: ['Munich'], 프랑크푸르트: ['Frankfurt'], 함부르크: ['Hamburg'],
  밀라노: ['Milan'], 리스본: ['Lisbon'], 아테네: ['Athens'],
  바르샤바: ['Warsaw'], 코펜하겐: ['Copenhagen'], 스톡홀름: ['Stockholm'],
  오슬로: ['Oslo'], 헬싱키: ['Helsinki'], 더블린: ['Dublin'],
  에든버러: ['Edinburgh'], 맨체스터: ['Manchester'],
  // Oceania
  시드니: ['Sydney'], 멜버른: ['Melbourne'], 브리즈번: ['Brisbane'],
  오클랜드: ['Auckland'], 웰링턴: ['Wellington'],
  // Other
  두바이: ['Dubai'], 이스탄불: ['Istanbul'], 카이로: ['Cairo'],
  모스크바: ['Moscow'], 상트페테르부르크: ['Saint Petersburg'],
  뭄바이: ['Mumbai'], 뉴델리: ['New Delhi'], 텔아비브: ['Tel Aviv'],
  리우데자네이루: ['Rio de Janeiro'], 상파울루: ['Sao Paulo'],
  멕시코시티: ['Mexico City'], 부에노스아이레스: ['Buenos Aires'],
};

// Build reverse lookup: English name → Korean name (for display)
const ENGLISH_TO_KOREAN: Record<string, string> = {};
for (const [korean, englishNames] of Object.entries(KOREAN_CITY_NAMES)) {
  for (const en of englishNames) {
    ENGLISH_TO_KOREAN[en.toLowerCase()] = korean;
  }
}

interface Props {
  value: string;
  onSelect: (city: City) => void;
}

export default function CityAutocomplete({ value, onSelect }: Props) {
  const [query, setQuery] = useState(value);
  const [open, setOpen] = useState(false);
  const [matches, setMatches] = useState<City[]>([]);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setQuery(value);
  }, [value]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  function handleChange(q: string) {
    setQuery(q);
    if (q.length < 2) {
      setMatches([]);
      setOpen(false);
      return;
    }
    const lower = q.toLowerCase();

    // Check if query matches a Korean city name → resolve to English names
    const koreanMatches = new Set<string>();
    for (const [korean, englishNames] of Object.entries(KOREAN_CITY_NAMES)) {
      if (korean.startsWith(q)) {
        for (const en of englishNames) koreanMatches.add(en.toLowerCase());
      }
    }

    const filtered = cities
      .filter(
        (c) =>
          c.name.toLowerCase().startsWith(lower) ||
          koreanMatches.has(c.name.toLowerCase()),
      )
      .slice(0, 8);
    setMatches(filtered);
    setOpen(filtered.length > 0);
  }

  function getKoreanName(city: City): string | null {
    return ENGLISH_TO_KOREAN[city.name.toLowerCase()] ?? null;
  }

  function displayName(city: City): string {
    const kr = getKoreanName(city);
    return kr ? `${kr} (${city.name}), ${city.country}` : `${city.name}, ${city.country}`;
  }

  function handleSelect(city: City) {
    setQuery(displayName(city));
    setOpen(false);
    onSelect(city);
  }

  return (
    <div ref={wrapRef} className="relative">
      <input
        type="text"
        value={query}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="서울, Seoul, Tokyo..."
        autoComplete="off"
        className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-text-primary placeholder:text-text-muted/50 transition focus:border-cookie-gold/40 focus:outline-none focus:ring-1 focus:ring-cookie-gold/20"
      />
      {open && matches.length > 0 && (
        <ul className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-white/10 bg-bg-card shadow-lg">
          {matches.map((city, i) => (
            <li key={`${city.name}-${city.country}-${i}`}>
              <button
                type="button"
                onClick={() => handleSelect(city)}
                className="w-full px-4 py-2.5 text-left text-sm text-text-secondary transition hover:bg-cookie-gold/10 hover:text-text-primary"
              >
                {getKoreanName(city) && (
                  <span className="text-text-primary">{getKoreanName(city)} </span>
                )}
                {city.name}, <span className="text-text-muted">{city.country}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
