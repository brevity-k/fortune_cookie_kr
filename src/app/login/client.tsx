'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

type AuthMethod = 'kakao' | 'google' | 'email';

function getSafeRedirect(raw: string | null): string {
  if (!raw || !raw.startsWith('/') || raw.startsWith('//') || raw.includes('..') || raw.includes('@')) {
    return '/my-fortune';
  }
  try {
    const url = new URL(raw, 'http://localhost');
    if (url.hostname !== 'localhost') return '/my-fortune';
  } catch {
    return '/my-fortune';
  }
  return raw;
}

export default function LoginForm() {
  const searchParams = useSearchParams();
  const redirect = getSafeRedirect(searchParams.get('redirect'));
  const error = searchParams.get('error');

  const [email, setEmail] = useState('');
  const [showEmail, setShowEmail] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [loading, setLoading] = useState<AuthMethod | null>(null);
  const [authError, setAuthError] = useState<string | null>(
    error === 'auth' ? '로그인에 실패했습니다. 다시 시도해주세요.' : null,
  );

  const supabase = createClient();

  async function handleOAuth(provider: 'kakao' | 'google') {
    setLoading(provider);
    setAuthError(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback?redirect=${encodeURIComponent(redirect)}`,
      },
    });
    if (error) {
      setAuthError('로그인에 실패했습니다. 다시 시도해주세요.');
      setLoading(null);
    }
  }

  async function handleEmailLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading('email');
    setAuthError(null);
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?redirect=${encodeURIComponent(redirect)}`,
      },
    });
    if (error) {
      setAuthError('이메일 전송에 실패했습니다. 다시 시도해주세요.');
    } else {
      setEmailSent(true);
    }
    setLoading(null);
  }

  if (emailSent) {
    return (
      <div className="w-full max-w-sm text-center space-y-4">
        <div className="text-4xl">📧</div>
        <h1 className="text-xl font-bold text-text-primary">메일을 확인하세요</h1>
        <p className="text-sm text-text-secondary">
          <span className="text-cookie-gold">{email}</span>으로 로그인 링크를 보냈습니다.
        </p>
        <button
          onClick={() => setEmailSent(false)}
          className="text-sm text-text-muted hover:text-text-secondary transition-colors underline underline-offset-2"
        >
          다시 시도
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm space-y-6">
      <div className="text-center space-y-2">
        <div className="text-4xl">🥠</div>
        <h1 className="text-xl font-bold text-text-primary">로그인</h1>
        <p className="text-sm text-text-secondary">맞춤 운세 서비스를 시작하세요</p>
      </div>

      {authError && (
        <div className="bg-accent-red/10 border border-accent-red/20 rounded-lg px-4 py-3 text-sm text-accent-red">
          {authError}
        </div>
      )}

      <div className="space-y-3">
        {/* Kakao Login */}
        <button
          onClick={() => handleOAuth('kakao')}
          disabled={loading !== null}
          className="w-full flex items-center justify-center gap-2 bg-[#FEE500] text-[#191919] font-medium py-3 px-4 rounded-xl hover:bg-[#FDD835] transition-colors disabled:opacity-50"
        >
          {loading === 'kakao' ? (
            <span className="animate-spin text-lg">⏳</span>
          ) : (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M10 3C5.58 3 2 5.72 2 9.07c0 2.16 1.46 4.06 3.63 5.12l-.92 3.41c-.08.28.24.51.49.35l4.07-2.67c.24.02.48.04.73.04 4.42 0 8-2.72 8-6.07C18 5.72 14.42 3 10 3z"
                fill="#191919"
              />
            </svg>
          )}
          카카오로 시작하기
        </button>

        {/* Google Login */}
        <button
          onClick={() => handleOAuth('google')}
          disabled={loading !== null}
          className="w-full flex items-center justify-center gap-2 bg-white text-gray-700 font-medium py-3 px-4 rounded-xl hover:bg-gray-50 transition-colors border border-gray-200 disabled:opacity-50"
        >
          {loading === 'google' ? (
            <span className="animate-spin text-lg">⏳</span>
          ) : (
            <svg width="20" height="20" viewBox="0 0 20 20">
              <path d="M19.6 10.23c0-.68-.06-1.36-.18-2.01H10v3.8h5.38a4.6 4.6 0 01-2 3.02v2.5h3.24c1.89-1.74 2.98-4.3 2.98-7.31z" fill="#4285F4" />
              <path d="M10 20c2.7 0 4.96-.9 6.62-2.42l-3.24-2.51c-.9.6-2.04.96-3.38.96-2.6 0-4.8-1.76-5.58-4.12H1.08v2.6A9.99 9.99 0 0010 20z" fill="#34A853" />
              <path d="M4.42 11.91A6.01 6.01 0 014.1 10c0-.66.12-1.3.32-1.91V5.49H1.08A9.99 9.99 0 000 10c0 1.61.39 3.14 1.08 4.49l3.34-2.58z" fill="#FBBC05" />
              <path d="M10 3.96c1.47 0 2.78.5 3.82 1.5l2.86-2.87C14.96.99 12.7 0 10 0A9.99 9.99 0 001.08 5.49l3.34 2.6C5.2 5.73 7.4 3.96 10 3.96z" fill="#EA4335" />
            </svg>
          )}
          Google로 시작하기
        </button>

        {/* Email Toggle */}
        {!showEmail && (
          <button
            onClick={() => setShowEmail(true)}
            className="w-full text-sm text-text-muted hover:text-text-secondary transition-colors py-2"
          >
            이메일로 로그인
          </button>
        )}

        {/* Email Magic Link */}
        {showEmail && (
          <form onSubmit={handleEmailLogin} className="space-y-3">
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="이메일 주소"
                required
                className="w-full bg-bg-card/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-text-primary placeholder:text-text-muted/50 focus:outline-none focus:border-cookie-gold/50"
              />
            </div>
            <button
              type="submit"
              disabled={loading !== null || !email.trim()}
              className="w-full bg-cookie-gold/20 text-cookie-gold font-medium py-3 px-4 rounded-xl hover:bg-cookie-gold/30 transition-colors border border-cookie-gold/30 disabled:opacity-50"
            >
              {loading === 'email' ? '전송 중...' : '로그인 링크 받기'}
            </button>
          </form>
        )}
      </div>

      <p className="text-xs text-text-muted/70 text-center">
        로그인 시 <a href="/terms" className="underline underline-offset-2">이용약관</a>과{' '}
        <a href="/privacy" className="underline underline-offset-2">개인정보처리방침</a>에 동의합니다.
      </p>
    </div>
  );
}
