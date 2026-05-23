import Link from 'next/link';
import MobileMenu from './MobileMenu';

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-bg-primary/80 backdrop-blur-md border-b border-white/5 pt-[env(safe-area-inset-top)]">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="text-2xl" role="img" aria-label="fortune cookie">
            🥠
          </span>
          <span className="text-lg font-bold text-cookie-gold group-hover:text-gold-sparkle transition-colors">
            포춘쿠키
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/"
            className="text-sm text-text-secondary hover:text-cookie-gold transition-colors"
          >
            오늘의 운세
          </Link>
          <Link
            href="/fortune/love"
            className="text-sm text-text-secondary hover:text-cookie-gold transition-colors"
          >
            카테고리
          </Link>
          <Link
            href="/compatibility"
            className="text-sm text-text-secondary hover:text-cookie-gold transition-colors"
          >
            궁합
          </Link>
          <Link
            href="/fortune/horoscope/aries"
            className="text-sm text-text-secondary hover:text-cookie-gold transition-colors"
          >
            별자리
          </Link>
          <Link
            href="/saju"
            className="text-sm text-text-secondary hover:text-cookie-gold transition-colors"
          >
            사주
          </Link>
          <Link
            href="/birth-chart"
            className="text-sm text-text-secondary hover:text-cookie-gold transition-colors"
          >
            출생차트
          </Link>
          <Link
            href="/collection"
            className="text-sm text-text-secondary hover:text-cookie-gold transition-colors"
          >
            도감
          </Link>
          <Link
            href="/blog"
            className="text-sm text-text-secondary hover:text-cookie-gold transition-colors"
          >
            블로그
          </Link>
          <Link
            href="/about"
            className="text-sm text-text-secondary hover:text-cookie-gold transition-colors"
          >
            소개
          </Link>
        </nav>

        <MobileMenu />
      </div>
    </header>
  );
}
