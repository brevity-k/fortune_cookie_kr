'use client';

import { useState, useSyncExternalStore } from 'react';
import { createClient } from '@/lib/supabase/client';

interface DailyCheckInProps {
  onSubmit?: () => void;
}

const PROMPTS = [
  '오늘 마음에 걸리는 게 있나요?',
  '요즘 어떤 일에 에너지를 쏟고 있나요?',
  '최근 기분이 어떤가요?',
  '오늘 어떤 하루가 되었으면 하나요?',
  '요즘 가장 많이 생각하는 것은?',
];

function getTodayKey(): string {
  const today = new Date().toISOString().split('T')[0];
  return `premium_checkin_${today}`;
}

const noop = () => () => {};
const getCheckedIn = () => {
  try { return localStorage.getItem(getTodayKey()) === '1'; } catch { return false; }
};
const getServerCheckedIn = () => true; // SSR: assume checked in (hide widget to avoid flicker)

export default function DailyCheckIn({ onSubmit }: DailyCheckInProps) {
  const alreadyCheckedIn = useSyncExternalStore(noop, getCheckedIn, getServerCheckedIn);
  const [dismissed, setDismissed] = useState(false);
  const [text, setText] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const prompt = PROMPTS[new Date().getDate() % PROMPTS.length];

  if (alreadyCheckedIn || dismissed || saved) return null;

  function markDone() {
    try {
      localStorage.setItem(getTodayKey(), '1');
    } catch { /* Safari private mode */ }
  }

  async function handleSubmit() {
    if (!text.trim()) return;

    setSaving(true);
    setError(null);
    const supabase = createClient();

    // Get authenticated user server-side instead of trusting props
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setError('로그인이 필요합니다.');
      setSaving(false);
      return;
    }

    const { error: insertError } = await supabase.from('user_context').insert({
      user_id: user.id,
      content: text.trim().slice(0, 1000),
      context_type: 'daily_check_in',
    });

    if (insertError) {
      setError('저장에 실패했습니다. 다시 시도해주세요.');
      setSaving(false);
      return;
    }

    markDone();
    setSaved(true);
    setSaving(false);
    onSubmit?.();
  }

  function handleSkip() {
    markDone();
    setDismissed(true);
  }

  return (
    <div className="bg-bg-card/40 border border-white/5 rounded-xl p-4 space-y-3">
      <p className="text-sm text-text-primary">{prompt}</p>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="한두 마디만 적어주세요"
        rows={2}
        maxLength={300}
        className="w-full bg-bg-card/30 border border-white/10 rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted/50 focus:outline-none focus:border-cookie-gold/40 resize-none"
      />
      {error && <p className="text-xs text-accent-red">{error}</p>}
      <div className="flex items-center justify-between">
        <button
          onClick={handleSkip}
          className="text-xs text-text-muted/70 hover:text-text-secondary transition-colors"
        >
          건너뛰기
        </button>
        <button
          onClick={handleSubmit}
          disabled={saving || !text.trim()}
          className="text-xs bg-cookie-gold/20 text-cookie-gold border border-cookie-gold/30 rounded-lg px-3 py-1.5 hover:bg-cookie-gold/30 transition-colors disabled:opacity-50"
        >
          {saving ? '저장 중...' : '확인'}
        </button>
      </div>
    </div>
  );
}
