import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: '소개',
  description: '포춘쿠키 서비스 소개 - 매일 무료로 즐기는 온라인 포춘쿠키 운세',
  openGraph: {
    title: '포춘쿠키 소개',
    description: '매일 무료로 즐기는 온라인 포춘쿠키 운세 서비스를 소개합니다.',
  },
  alternates: {
    canonical: '/about',
  },
};

export default function AboutPage() {
  return (
    <div className="star-field min-h-dvh flex flex-col">
      <Header />
      <main className="flex-1 pt-14 px-4 py-12">
        <article className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-cookie-gold mb-8">
            포춘쿠키 소개
          </h1>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-text-primary mb-3">
              서비스 소개
            </h2>
            <p className="text-text-secondary leading-relaxed mb-4">
              포춘쿠키는 매일 무료로 즐길 수 있는 온라인 포춘쿠키 운세 서비스입니다.
              실제 포춘쿠키를 깨는 것처럼 클릭, 드래그, 길게 누르기, 흔들기 등
              다양한 인터랙션으로 쿠키를 깨고, 그 안에 담긴 오늘의 운세를
              확인할 수 있습니다.
            </p>
            <p className="text-text-secondary leading-relaxed">
              사랑운, 재물운, 건강운, 학업운, 대인운, 총운 등 6가지 카테고리에서
              280개 이상의 다양한 운세 메시지를 만나보세요.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-text-primary mb-3">
              포춘쿠키의 유래
            </h2>
            <p className="text-text-secondary leading-relaxed mb-4">
              포춘쿠키는 19세기 후반 미국 캘리포니아에서 일본계 이민자들에 의해
              처음 만들어진 것으로 알려져 있습니다. 일본의 전통 과자인
              &apos;센베이&apos;에 점괘를 넣는 풍습에서 영감을 받았으며,
              이후 미국 전역의 중국 음식점으로 퍼져 나갔습니다.
            </p>
            <p className="text-text-secondary leading-relaxed">
              오늘날 포춘쿠키는 전 세계적으로 사랑받는 문화 아이콘이 되었으며,
              식사 후 작은 행운의 메시지를 받아보는 즐거운 경험을 제공합니다.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-text-primary mb-3">
              이용 방법
            </h2>
            <ul className="space-y-3 text-text-secondary">
              <li className="flex gap-3">
                <span className="text-cookie-gold">1.</span>
                <span>메인 페이지에서 포춘쿠키를 선택합니다.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-cookie-gold">2.</span>
                <span>클릭, 드래그, 길게 누르기, 흔들기, 더블 탭 등 원하는 방법으로 쿠키를 깹니다.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-cookie-gold">3.</span>
                <span>쿠키 안에서 나온 운세 메시지를 확인합니다.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-cookie-gold">4.</span>
                <span>마음에 드는 운세는 카카오톡, 트위터 등으로 친구에게 공유해보세요!</span>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-text-primary mb-3">
              참고 사항
            </h2>
            <p className="text-text-secondary leading-relaxed">
              본 서비스의 운세는 재미와 즐거움을 위한 것이며, 실제 미래를
              예측하거나 보장하지 않습니다. 가벼운 마음으로 즐겨주세요!
            </p>
          </section>
        </article>
      </main>
      <Footer />
    </div>
  );
}
