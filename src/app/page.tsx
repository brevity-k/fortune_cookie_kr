import type { Metadata } from 'next';
import HomeFortuneWidget from './client';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CategorySelector from '@/components/fortune/CategorySelector';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '포춘쿠키 - 오늘의 운세 | 무료 포춘쿠키 운세',
  description:
    '포춘쿠키를 깨고 오늘의 운세를 확인하세요! 사랑운, 재물운, 건강운, 학업운, 대인운 등 다양한 카테고리의 무료 운세를 매일 새롭게 만나보세요.',
  openGraph: {
    title: '포춘쿠키 - 오늘의 운세 | 무료 포춘쿠키 운세',
    description:
      '포춘쿠키를 깨고 오늘의 운세를 확인하세요! 매일 새로운 운세를 무료로 확인하세요.',
    type: 'website',
    locale: 'ko_KR',
  },
  alternates: {
    canonical: '/',
  },
};

export default function HomePage() {
  return (
    <div className="star-field min-h-dvh flex flex-col">
      <Header />

      <main className="flex-1 pt-14">
        <section className="relative px-4 pt-8 pb-4">
          <div className="max-w-lg mx-auto text-center">
            <h1 className="text-2xl md:text-3xl font-bold text-text-primary mb-2">
              오늘의 <span className="text-cookie-gold">포춘쿠키</span>
            </h1>
            <p className="text-sm text-text-muted mb-6">
              쿠키를 깨고 오늘의 운세를 확인하세요
            </p>
          </div>
        </section>

        <HomeFortuneWidget />

        <section className="px-4 py-8 mt-4">
          <div className="max-w-lg mx-auto">
            <h2 className="text-center text-sm text-text-muted mb-4">
              카테고리별 운세 보기
            </h2>
            <CategorySelector />
          </div>
        </section>

        <nav className="px-4 pb-4 max-w-lg mx-auto">
          <h2 className="text-center text-sm text-text-muted mb-3">더 많은 운세</h2>
          <div className="flex flex-wrap justify-center gap-2">
            <Link href="/fortune/horoscope" className="text-xs text-text-secondary hover:text-cookie-gold transition-colors px-3 py-1.5 rounded-full bg-bg-card/60 border border-white/5">별자리 운세</Link>
            <Link href="/fortune/zodiac" className="text-xs text-text-secondary hover:text-cookie-gold transition-colors px-3 py-1.5 rounded-full bg-bg-card/60 border border-white/5">띠별 운세</Link>
            <Link href="/fortune/mbti" className="text-xs text-text-secondary hover:text-cookie-gold transition-colors px-3 py-1.5 rounded-full bg-bg-card/60 border border-white/5">MBTI 운세</Link>
            <Link href="/compatibility" className="text-xs text-text-secondary hover:text-cookie-gold transition-colors px-3 py-1.5 rounded-full bg-bg-card/60 border border-white/5">궁합 테스트</Link>
          </div>
        </nav>

        <section className="px-4 py-8 max-w-2xl mx-auto">
          <article className="bg-bg-card/30 rounded-xl p-6 border border-white/5">
            <h2 className="text-lg font-semibold text-cookie-gold mb-3">
              포춘쿠키란?
            </h2>
            <p className="text-sm text-text-secondary leading-relaxed mb-4">
              포춘쿠키(Fortune Cookie)는 안에 운세가 적힌 종이가 들어있는 쿠키입니다.
              주로 중국 음식점에서 식사 후 제공되며, 쿠키를 깨면 그 안에서
              행운의 메시지, 격언, 또는 운세를 발견할 수 있습니다.
            </p>
            <p className="text-sm text-text-secondary leading-relaxed mb-4">
              포춘쿠키 온라인에서는 실제 쿠키를 깨는 것처럼 클릭, 드래그,
              길게 누르기, 흔들기 등 다양한 방법으로 쿠키를 깨고 오늘의
              운세를 확인할 수 있습니다.
            </p>
            <p className="text-sm text-text-secondary leading-relaxed">
              사랑운, 재물운, 건강운, 학업운, 대인운, 총운 등 6가지
              카테고리에서 매일 새로운 운세를 무료로 만나보세요. 친구에게
              공유하여 함께 오늘의 운세를 확인해보는 것도 좋습니다!
            </p>
          </article>
        </section>
      </main>

      <Footer />
    </div>
  );
}
