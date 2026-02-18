import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-bg-secondary/50 border-t border-white/5 mt-auto">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <div>
            <h3 className="text-sm font-semibold text-cookie-gold mb-3">
              운세 카테고리
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/fortune/general"
                  className="text-sm text-text-muted hover:text-text-secondary transition-colors"
                >
                  총운
                </Link>
              </li>
              <li>
                <Link
                  href="/fortune/love"
                  className="text-sm text-text-muted hover:text-text-secondary transition-colors"
                >
                  사랑운
                </Link>
              </li>
              <li>
                <Link
                  href="/fortune/career"
                  className="text-sm text-text-muted hover:text-text-secondary transition-colors"
                >
                  재물운
                </Link>
              </li>
              <li>
                <Link
                  href="/fortune/health"
                  className="text-sm text-text-muted hover:text-text-secondary transition-colors"
                >
                  건강운
                </Link>
              </li>
              <li>
                <Link
                  href="/fortune/study"
                  className="text-sm text-text-muted hover:text-text-secondary transition-colors"
                >
                  학업운
                </Link>
              </li>
              <li>
                <Link
                  href="/fortune/relationship"
                  className="text-sm text-text-muted hover:text-text-secondary transition-colors"
                >
                  대인운
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-cookie-gold mb-3">
              콘텐츠
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/fortune/zodiac"
                  className="text-sm text-text-muted hover:text-text-secondary transition-colors"
                >
                  띠별 운세
                </Link>
              </li>
              <li>
                <Link
                  href="/fortune/mbti"
                  className="text-sm text-text-muted hover:text-text-secondary transition-colors"
                >
                  MBTI 운세
                </Link>
              </li>
              <li>
                <Link
                  href="/fortune/horoscope"
                  className="text-sm text-text-muted hover:text-text-secondary transition-colors"
                >
                  별자리 운세
                </Link>
              </li>
              <li>
                <Link
                  href="/compatibility"
                  className="text-sm text-text-muted hover:text-text-secondary transition-colors"
                >
                  궁합 테스트
                </Link>
              </li>
              <li>
                <Link
                  href="/collection"
                  className="text-sm text-text-muted hover:text-text-secondary transition-colors"
                >
                  도감
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-sm text-text-muted hover:text-text-secondary transition-colors"
                >
                  블로그
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-cookie-gold mb-3">
              정보
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/about"
                  className="text-sm text-text-muted hover:text-text-secondary transition-colors"
                >
                  소개
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-text-muted hover:text-text-secondary transition-colors"
                >
                  문의
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-cookie-gold mb-3">
              법적 고지
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/privacy"
                  className="text-sm text-text-muted hover:text-text-secondary transition-colors"
                >
                  개인정보처리방침
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-sm text-text-muted hover:text-text-secondary transition-colors"
                >
                  이용약관
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/5 pt-6 text-center">
          <p className="text-xs text-text-muted">
            © {new Date().getFullYear()} 포춘쿠키. 본 서비스의 운세는 재미를
            위한 것이며, 실제 미래를 예측하지 않습니다.
          </p>
        </div>
      </div>
    </footer>
  );
}
