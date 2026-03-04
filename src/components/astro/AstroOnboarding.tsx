'use client';

import { useState, type FormEvent } from 'react';
import { saveAstroProfile } from '@/lib/astro/profile';
import type { AstroProfile, City } from '@/lib/astro/types';
import CityAutocomplete from './CityAutocomplete';

interface Props {
  onComplete: (profile: AstroProfile) => void;
}

export default function AstroOnboarding({ onComplete }: Props) {
  const [error, setError] = useState('');
  const [city, setCity] = useState<City | null>(null);
  const [cityDisplay, setCityDisplay] = useState('');

  function handleCitySelect(c: City) {
    setCity(c);
    setCityDisplay(`${c.name}, ${c.country}`);
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');

    const form = e.currentTarget;
    const dateStr = (form.elements.namedItem('birthdate') as HTMLInputElement).value;
    const timeStr = (form.elements.namedItem('birthtime') as HTMLInputElement).value;

    if (!dateStr) {
      setError('생년월일을 입력해주세요.');
      return;
    }
    if (!timeStr) {
      setError('태어난 시간을 입력해주세요.');
      return;
    }
    if (!city) {
      setError('출생 도시를 선택해주세요.');
      return;
    }

    const [yearStr, monthStr, dayStr] = dateStr.split('-');
    const [hourStr, minuteStr] = timeStr.split(':');

    const year = parseInt(yearStr);
    const month = parseInt(monthStr);
    const day = parseInt(dayStr);
    const hour = parseInt(hourStr);
    const minute = parseInt(minuteStr);

    if (year < 1900 || year > 2100) {
      setError('유효한 출생 연도를 입력해주세요 (1900-2100).');
      return;
    }

    try {
      const profile = saveAstroProfile({
        year,
        month,
        day,
        hour,
        minute,
        latitude: city.lat,
        longitude: city.lng,
        cityName: city.name,
      });
      onComplete(profile);
    } catch {
      setError('차트 계산에 실패했습니다. 입력 정보를 확인해주세요.');
    }
  }

  const inputClasses =
    'w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-text-primary placeholder:text-text-muted/50 transition focus:border-cookie-gold/40 focus:outline-none focus:ring-1 focus:ring-cookie-gold/20';

  return (
    <form onSubmit={handleSubmit} className="bg-bg-card/30 rounded-xl p-6 border border-white/5">
      <h2 className="mb-2 text-xl font-semibold text-cookie-gold">
        출생 차트 계산하기
      </h2>
      <p className="mb-6 text-sm text-text-muted">
        정확한 출생 정보를 입력하면 행성 위치, 하우스, 애스펙트(Aspects)가 포함된 출생 차트를 생성합니다.
      </p>

      <div className="space-y-4">
        <div>
          <label htmlFor="birthdate" className="mb-1 block text-sm font-medium text-cookie-gold/70">
            생년월일 *
          </label>
          <input
            id="birthdate"
            name="birthdate"
            type="date"
            required
            min="1900-01-01"
            max="2100-12-31"
            className={inputClasses}
          />
        </div>

        <div>
          <label htmlFor="birthtime" className="mb-1 block text-sm font-medium text-cookie-gold/70">
            태어난 시간 *
          </label>
          <input
            id="birthtime"
            name="birthtime"
            type="time"
            required
            className={inputClasses}
          />
          <p className="mt-1 text-xs text-text-muted/70">
            정확한 시간이 있어야 상승점(ASC)과 하우스를 계산할 수 있습니다.
          </p>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-cookie-gold/70">
            출생 도시 *
          </label>
          <CityAutocomplete value={cityDisplay} onSelect={handleCitySelect} />
          <p className="mt-1 text-xs text-text-muted/70">
            2글자 이상 입력 후 목록에서 선택하세요.
          </p>
        </div>

        {error && <p className="text-sm text-red-400">{error}</p>}

        <button
          type="submit"
          className="w-full rounded-lg bg-cookie-gold px-6 py-3 font-semibold text-bg-primary transition hover:bg-cookie-gold/90"
        >
          차트 보기
        </button>
      </div>
    </form>
  );
}
