'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Unhandled error:', error);
  }, [error]);

  return (
    <div className="star-field min-h-dvh flex flex-col items-center justify-center px-4">
      <div className="text-6xl mb-6">🥠</div>
      <h2 className="text-2xl font-bold text-cookie-gold mb-3">
        앗, 쿠키가 깨져버렸어요!
      </h2>
      <p className="text-text-secondary mb-8 text-center max-w-md">
        예상치 못한 오류가 발생했습니다. 다시 시도해주세요.
      </p>
      <button
        onClick={reset}
        className="px-6 py-3 bg-cookie-gold/20 border border-cookie-gold/30 rounded-xl text-cookie-gold font-medium hover:bg-cookie-gold/30 transition-colors"
      >
        다시 시도하기
      </button>
    </div>
  );
}
