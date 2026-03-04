'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

interface DailyCheckInProps {
  userId: string;
  onSubmit?: () => void;
}

const PROMPTS = [
  '오늘 마음에 걸리는 게 있나요?',
  '요즘 어떤 일에 에너지를 쏟고 있나요?',
  '최근 기분이 어떤가요?',
  '오늘 어떤 하루가 되었으면 하나요?',
  '요즘 가장 많이 생각하는 것은?',
];

function getTodayKey(userId: string): string {
  const today = new Date().toISOString().split('T')[0];
  return `premium_checkin_${userId}_${today}`;
}

export default function DailyCheckIn({ userId, onSubmit }: DailyCheckInProps) {
  const [dismissed, setDismissed] = useState(true);
  const [text, setText] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const prompt = PROMPTS[new Date().getDate() % PROMPTS.length];

  useEffect(() => {
    try {
      const done = localStorage.getItem(getTodayKey(userId));
      setDismissed(done === '1');
    } catch {
      setDismissed(false);
    }
  }, [userId]);

  if (dismissed || saved) return null;

  function markDone() {
    try {
      localStorage.setItem(getTodayKey(userId), '1');
    } catch { /* Safari private mode */ }
  }

  async function handleSubmit() {
    if (!text.trim()) return;

    setSaving(true);
    const supabase = createClient();
    await supabase.from('user_context').insert({
      user_id: userId,
      content: text.trim(),
      context_type: 'daily_check_in',
    });
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
