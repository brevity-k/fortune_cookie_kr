'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function MobileMenu() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <button
        className="md:hidden p-2.5 min-w-[44px] min-h-[44px] text-text-secondary hover:text-cookie-gold transition-colors"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-label="메뉴 열기"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          {isMenuOpen ? (
            <path d="M18 6L6 18M6 6l12 12" />
          ) : (
            <path d="M3 12h18M3 6h18M3 18h18" />
          )}
        </svg>
      </button>

      {isMenuOpen && (
        <nav className="md:hidden bg-bg-secondary/95 backdrop-blur-md border-b border-white/5">
          <div className="max-w-5xl mx-auto px-4 py-4 flex flex-col gap-3">
            <Link
              href="/"
              className="text-text-secondary hover:text-cookie-gold transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              🥠 오늘의 운세
            </Link>
            <Link
              href="/fortune/love"
              className="text-text-secondary hover:text-cookie-gold transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              🔮 카테고리별 운세
            </Link>
            <Link
              href="/compatibility"
              className="text-text-secondary hover:text-cookie-gold transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              💕 궁합 테스트
            </Link>
            <Link
              href="/fortune/horoscope/aries"
              className="text-text-secondary hover:text-cookie-gold transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              ⭐ 별자리 운세
            </Link>
            <Link
              href="/saju"
              className="text-text-secondary hover:text-cookie-gold transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              🔮 사주팔자
            </Link>
            <Link
              href="/birth-chart"
              className="text-text-secondary hover:text-cookie-gold transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              🌌 출생 차트
            </Link>
            <Link
              href="/collection"
              className="text-text-secondary hover:text-cookie-gold transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              📖 도감
            </Link>
            <Link
              href="/blog"
              className="text-text-secondary hover:text-cookie-gold transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              📝 블로그
            </Link>
            <Link
              href="/about"
              className="text-text-secondary hover:text-cookie-gold transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              ℹ️ 소개
            </Link>
          </div>
        </nav>
      )}
    </>
  );
}
