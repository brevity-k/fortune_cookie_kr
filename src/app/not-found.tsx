import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="star-field min-h-dvh flex flex-col items-center justify-center px-4">
      <div className="text-6xl mb-6">🥠</div>
      <h2 className="text-2xl font-bold text-cookie-gold mb-3">
        페이지를 찾을 수 없어요
      </h2>
      <p className="text-text-secondary mb-8 text-center max-w-md">
        요청하신 페이지가 존재하지 않거나 이동되었습니다.
      </p>
      <Link
        href="/"
        className="px-6 py-3 bg-cookie-gold/20 border border-cookie-gold/30 rounded-xl text-cookie-gold font-medium hover:bg-cookie-gold/30 transition-colors"
      >
        홈으로 돌아가기
      </Link>
    </div>
  );
}
