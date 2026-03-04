'use client';

import { useState, useCallback } from 'react';
import type { BirthInfo, Gender } from '@/lib/saju/types';

const HOUR_OPTIONS: { value: number | null; label: string }[] = [
  { value: null, label: '모름' },
  { value: 0, label: '자시 (23:30~01:30)' },
  { value: 1, label: '축시 (01:30~03:30)' },
  { value: 3, label: '인시 (03:30~05:30)' },
  { value: 5, label: '묘시 (05:30~07:30)' },
  { value: 7, label: '진시 (07:30~09:30)' },
  { value: 9, label: '사시 (09:30~11:30)' },
  { value: 11, label: '오시 (11:30~13:30)' },
  { value: 13, label: '미시 (13:30~15:30)' },
  { value: 15, label: '신시 (15:30~17:30)' },
  { value: 17, label: '유시 (17:30~19:30)' },
  { value: 19, label: '술시 (19:30~21:30)' },
  { value: 21, label: '해시 (21:30~23:30)' },
];

const currentYear = new Date().getFullYear();

interface SajuOnboardingProps {
  onSubmit: (birthInfo: BirthInfo) => void;
}

export default function SajuOnboarding({ onSubmit }: SajuOnboardingProps) {
  const [year, setYear] = useState<number>(1990);
  const [month, setMonth] = useState<number>(1);
  const [day, setDay] = useState<number>(1);
  const [hour, setHour] = useState<number | null>(null);
  const [gender, setGender] = useState<Gender>('male');

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      onSubmit({ year, month, day, hour, gender });
    },
    [year, month, day, hour, gender, onSubmit]
  );

  const daysInMonth = new Date(year, month, 0).getDate();

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="bg-bg-card/30 rounded-xl p-5 border border-white/5 space-y-4">
        <h3 className="text-sm font-semibold text-cookie-gold">생년월일 입력</h3>

        {/* Year / Month / Day */}
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-xs text-text-muted mb-1">출생 연도</label>
            <select
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="w-full rounded-lg bg-white/5 border border-white/10 text-text-primary text-sm px-3 py-2 focus:outline-none focus:border-cookie-gold/50"
            >
              {Array.from({ length: currentYear - 1920 + 1 }, (_, i) => currentYear - i).map(
                (y) => (
                  <option key={y} value={y}>
                    {y}년
                  </option>
                )
              )}
            </select>
          </div>
          <div>
            <label className="block text-xs text-text-muted mb-1">월</label>
            <select
              value={month}
              onChange={(e) => {
                const newMonth = Number(e.target.value);
                setMonth(newMonth);
                const maxDay = new Date(year, newMonth, 0).getDate();
                if (day > maxDay) setDay(maxDay);
              }}
              className="w-full rounded-lg bg-white/5 border border-white/10 text-text-primary text-sm px-3 py-2 focus:outline-none focus:border-cookie-gold/50"
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                <option key={m} value={m}>
                  {m}월
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-text-muted mb-1">일</label>
            <select
              value={day}
              onChange={(e) => setDay(Number(e.target.value))}
              className="w-full rounded-lg bg-white/5 border border-white/10 text-text-primary text-sm px-3 py-2 focus:outline-none focus:border-cookie-gold/50"
            >
              {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((d) => (
                <option key={d} value={d}>
                  {d}일
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Birth Hour */}
        <div>
          <label className="block text-xs text-text-muted mb-1">태어난 시간 (시주)</label>
          <select
            value={hour ?? ''}
            onChange={(e) => setHour(e.target.value === '' ? null : Number(e.target.value))}
            className="w-full rounded-lg bg-white/5 border border-white/10 text-text-primary text-sm px-3 py-2 focus:outline-none focus:border-cookie-gold/50"
          >
            {HOUR_OPTIONS.map((opt) => (
              <option key={opt.label} value={opt.value ?? ''}>
                {opt.label}
              </option>
            ))}
          </select>
          <p className="text-xs text-text-muted/70 mt-1">모르면 &apos;모름&apos;을 선택하세요. 시주 없이도 분석 가능합니다.</p>
        </div>

        {/* Gender */}
        <div>
          <label className="block text-xs text-text-muted mb-1">성별</label>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setGender('male')}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors border ${
                gender === 'male'
                  ? 'bg-cookie-gold/20 border-cookie-gold/50 text-cookie-gold'
                  : 'bg-white/5 border-white/10 text-text-secondary hover:border-white/20'
              }`}
            >
              남성
            </button>
            <button
              type="button"
              onClick={() => setGender('female')}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors border ${
                gender === 'female'
                  ? 'bg-cookie-gold/20 border-cookie-gold/50 text-cookie-gold'
                  : 'bg-white/5 border-white/10 text-text-secondary hover:border-white/20'
              }`}
            >
              여성
            </button>
          </div>
          <p className="text-xs text-text-muted/70 mt-1">대운(大運) 순행/역행 계산에 필요합니다.</p>
        </div>
      </div>

      <button
        type="submit"
        className="w-full py-3 rounded-xl bg-cookie-gold text-bg-primary font-semibold text-sm hover:bg-gold-sparkle transition-colors"
      >
        사주 분석하기
      </button>
    </form>
  );
}
