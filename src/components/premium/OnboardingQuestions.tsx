'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

interface OnboardingQuestionsProps {
  userId: string;
  onComplete: () => void;
}

const TOPIC_CHIPS = [
  { label: '직업/재물', value: 'career' },
  { label: '연애/관계', value: 'love' },
  { label: '건강', value: 'health' },
  { label: '학업/자기계발', value: 'study' },
  { label: '가정/가족', value: 'family' },
];

interface Step {
  question: string;
  type: 'chips' | 'text';
  placeholder?: string;
  contextType: string;
  topic?: string;
}

const STEPS: Step[] = [
  {
    question: '요즘 가장 관심 있는 분야는 무엇인가요?',
    type: 'chips',
    contextType: 'onboarding',
    topic: 'general',
  },
  {
    question: '최근 삶에서 큰 변화가 있었나요?',
    type: 'text',
    placeholder: '이직, 이사, 연애 시작 등...',
    contextType: 'onboarding',
    topic: 'general',
  },
  {
    question: '지금 가장 고민되는 것이 있다면?',
    type: 'text',
    placeholder: '자유롭게 적어주세요',
    contextType: 'onboarding',
  },
  {
    question: '올해 이루고 싶은 것이 있나요?',
    type: 'text',
    placeholder: '목표, 소원, 바람 등...',
    contextType: 'onboarding',
  },
];

export default function OnboardingQuestions({ userId, onComplete }: OnboardingQuestionsProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [textValue, setTextValue] = useState('');
  const [selectedChips, setSelectedChips] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  const step = STEPS[currentStep];
  const isLast = currentStep === STEPS.length - 1;

  async function saveAndNext() {
    const supabase = createClient();
    const hasInput =
      step.type === 'chips' ? selectedChips.length > 0 : textValue.trim().length > 0;

    if (hasInput) {
      setSaving(true);
      const content =
        step.type === 'chips' ? selectedChips.join(', ') : textValue.trim();

      await supabase.from('user_context').insert({
        user_id: userId,
        content,
        context_type: step.contextType,
        topic: step.topic || null,
      });
      setSaving(false);
    }

    if (isLast) {
      onComplete();
    } else {
      setCurrentStep((prev) => prev + 1);
      setTextValue('');
      setSelectedChips([]);
    }
  }

  function toggleChip(value: string) {
    setSelectedChips((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
    );
  }

  return (
    <div className="bg-bg-card/40 border border-white/5 rounded-xl p-6 space-y-5">
      {/* Progress */}
      <div className="flex gap-1.5">
        {STEPS.map((_, i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-colors ${
              i <= currentStep ? 'bg-cookie-gold' : 'bg-white/10'
            }`}
          />
        ))}
      </div>

      {/* Question */}
      <p className="text-sm font-medium text-text-primary">{step.question}</p>

      {/* Input */}
      {step.type === 'chips' ? (
        <div className="flex flex-wrap gap-2">
          {TOPIC_CHIPS.map((chip) => (
            <button
              key={chip.value}
              onClick={() => toggleChip(chip.value)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                selectedChips.includes(chip.value)
                  ? 'bg-cookie-gold/20 border-cookie-gold/40 text-cookie-gold'
                  : 'bg-bg-card/30 border-white/10 text-text-secondary hover:border-white/20'
              }`}
            >
              {chip.label}
            </button>
          ))}
        </div>
      ) : (
        <textarea
          value={textValue}
          onChange={(e) => setTextValue(e.target.value)}
          placeholder={step.placeholder}
          rows={2}
          maxLength={500}
          className="w-full bg-bg-card/30 border border-white/10 rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted/50 focus:outline-none focus:border-cookie-gold/40 resize-none"
        />
      )}

      {/* Actions */}
      <div className="flex items-center justify-between">
        <button
          onClick={saveAndNext}
          disabled={saving}
          className="text-xs text-text-muted/70 hover:text-text-secondary transition-colors"
        >
          건너뛰기
        </button>
        <button
          onClick={saveAndNext}
          disabled={saving}
          className="text-sm bg-cookie-gold/20 text-cookie-gold border border-cookie-gold/30 rounded-lg px-4 py-2 hover:bg-cookie-gold/30 transition-colors disabled:opacity-50"
        >
          {saving ? '저장 중...' : isLast ? '시작하기' : '다음'}
        </button>
      </div>
    </div>
  );
}
