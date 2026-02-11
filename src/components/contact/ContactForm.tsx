'use client';

import { useState, FormEvent } from 'react';

type FormStatus = 'idle' | 'loading' | 'success' | 'error';

export default function ContactForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<FormStatus>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message }),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus('error');
        setErrorMessage(data.error || '오류가 발생했습니다.');
        return;
      }

      setStatus('success');
      setName('');
      setEmail('');
      setMessage('');
    } catch {
      setStatus('error');
      setErrorMessage('네트워크 오류가 발생했습니다. 인터넷 연결을 확인해주세요.');
    }
  };

  if (status === 'success') {
    return (
      <div className="bg-bg-card/50 rounded-xl p-8 border border-white/5 text-center">
        <div className="text-5xl mb-4">🥠</div>
        <h3 className="text-xl font-semibold text-cookie-gold mb-3">
          문의가 접수되었습니다!
        </h3>
        <p className="text-text-secondary leading-relaxed mb-6">
          입력하신 이메일로 접수 확인 메일을 보내드렸습니다.<br />
          평일 기준 1~2영업일 이내에 답변 드리겠습니다.
        </p>
        <button
          onClick={() => setStatus('idle')}
          className="px-6 py-2.5 rounded-full bg-bg-card border border-white/10 text-text-secondary text-sm hover:text-cookie-gold transition"
        >
          추가 문의하기
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-bg-card/50 rounded-xl p-6 border border-white/5 space-y-5"
    >
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-cookie-gold mb-1.5">
          이름
        </label>
        <input
          id="name"
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="홍길동"
          className="w-full px-4 py-2.5 rounded-lg bg-bg-primary/50 border border-white/10 text-text-primary placeholder:text-text-muted text-sm focus:outline-none focus:border-cookie-gold/50 transition"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-cookie-gold mb-1.5">
          이메일
        </label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="example@email.com"
          className="w-full px-4 py-2.5 rounded-lg bg-bg-primary/50 border border-white/10 text-text-primary placeholder:text-text-muted text-sm focus:outline-none focus:border-cookie-gold/50 transition"
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-cookie-gold mb-1.5">
          문의 내용
        </label>
        <textarea
          id="message"
          required
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="문의사항을 입력해주세요"
          className="w-full px-4 py-2.5 rounded-lg bg-bg-primary/50 border border-white/10 text-text-primary placeholder:text-text-muted text-sm focus:outline-none focus:border-cookie-gold/50 transition resize-none"
        />
      </div>

      {status === 'error' && (
        <p className="text-accent-red text-sm">{errorMessage}</p>
      )}

      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-cookie-gold text-bg-primary font-medium text-sm hover:brightness-110 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === 'loading' ? (
          <>
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            전송 중...
          </>
        ) : (
          '문의 보내기'
        )}
      </button>
    </form>
  );
}
