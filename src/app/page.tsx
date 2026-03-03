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

        <section className="px-4 py-8 max-w-2xl mx-auto space-y-6">
          <article className="bg-bg-card/30 rounded-xl p-6 border border-white/5">
            <h2 className="text-lg font-semibold text-cookie-gold mb-3">
              포춘쿠키란?
            </h2>
            <p className="text-sm text-text-secondary leading-relaxed mb-4">
              포춘쿠키(Fortune Cookie)는 안에 운세가 적힌 종이가 들어있는 쿠키입니다.
              주로 중국 음식점에서 식사 후 제공되며, 쿠키를 깨면 그 안에서
              행운의 메시지, 격언, 또는 운세를 발견할 수 있습니다. 19세기 후반
              미국 캘리포니아에서 일본계 이민자들에 의해 처음 만들어진 것으로
              알려져 있으며, 오늘날에는 전 세계적으로 연간 30억 개 이상이
              생산되는 문화 아이콘이 되었습니다.
            </p>
            <p className="text-sm text-text-secondary leading-relaxed mb-4">
              한국에서도 중화 요리점에서 식후 포춘쿠키를 받아보는 문화가
              익숙합니다. 쿠키를 깨는 순간의 설렘, 안에 담긴 메시지를 확인하는
              기대감은 동서양을 막론하고 보편적인 즐거움입니다. 포춘쿠키
              온라인에서는 이 경험을 디지털로 재현하여 누구나 언제 어디서든
              무료로 즐길 수 있게 만들었습니다.
            </p>
            <p className="text-sm text-text-secondary leading-relaxed mb-4">
              포춘쿠키 온라인에서는 실제 쿠키를 깨는 것처럼 클릭, 드래그,
              길게 누르기, 흔들기, 더블 탭 등 5가지 방법으로 쿠키를 깨고
              오늘의 운세를 확인할 수 있습니다. 각 방법마다 고유한 사운드
              효과와 시각적 피드백이 제공되어 매번 새로운 경험을 선사합니다.
            </p>
            <p className="text-sm text-text-secondary leading-relaxed">
              사랑운, 재물운, 건강운, 학업운, 대인운, 총운 등 6가지
              카테고리에서 300개 이상의 운세 메시지를 만나보세요. 별자리,
              띠별, MBTI 등 개인 특성에 맞춘 맞춤 운세도 제공합니다.
              친구에게 공유하여 함께 오늘의 운세를 확인해보는 것도 좋습니다!
            </p>
          </article>

          <article className="bg-bg-card/30 rounded-xl p-6 border border-white/5">
            <h2 className="text-lg font-semibold text-cookie-gold mb-3">
              쿠키 깨기 방법 안내
            </h2>
            <p className="text-sm text-text-secondary leading-relaxed mb-4">
              포춘쿠키를 깨는 5가지 인터랙션을 소개합니다. 각 방법마다
              독특한 경험을 제공하니 다양하게 시도해보세요.
            </p>
            <ul className="space-y-3 text-sm text-text-secondary">
              <li className="flex gap-3">
                <span className="text-cookie-gold shrink-0 font-semibold">클릭</span>
                <span>쿠키를 3번 클릭하면 금이 가면서 깨집니다. 가장 기본적이고 직관적인 방법입니다.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-cookie-gold shrink-0 font-semibold">드래그</span>
                <span>쿠키를 잡고 빠르게 던지세요. 속도가 빠를수록 시원하게 깨집니다.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-cookie-gold shrink-0 font-semibold">꾹 누르기</span>
                <span>1.5초간 길게 누르면 프로그레스 바가 채워지며 깨집니다. 천천히 집중하는 느낌입니다.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-cookie-gold shrink-0 font-semibold">흔들기</span>
                <span>모바일에서 기기를 흔들면 쿠키가 깨집니다. 스마트폰 전용 인터랙션입니다.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-cookie-gold shrink-0 font-semibold">더블 탭</span>
                <span>빠르게 두 번 탭하면 즉시 깨집니다. 가장 빠른 방법으로, 익숙해지면 편리합니다.</span>
              </li>
            </ul>
          </article>

          <article className="bg-bg-card/30 rounded-xl p-6 border border-white/5">
            <h2 className="text-lg font-semibold text-cookie-gold mb-3">
              운세 카테고리 소개
            </h2>
            <div className="space-y-3 text-sm text-text-secondary">
              <p className="leading-relaxed">
                포춘쿠키는 삶의 주요 영역을 6가지 카테고리로 나누어 운세를 제공합니다.
                각 카테고리는 50개 이상의 고유한 운세 메시지를 보유하고 있으며,
                매일 날짜 기반으로 새로운 운세가 선정됩니다.
              </p>
              <ul className="space-y-2">
                <li className="flex gap-2">
                  <Link href="/fortune/general" className="text-cookie-gold hover:underline shrink-0">총운</Link>
                  <span>— 하루의 전반적인 운세 흐름을 종합적으로 확인합니다.</span>
                </li>
                <li className="flex gap-2">
                  <Link href="/fortune/love" className="text-cookie-gold hover:underline shrink-0">사랑운</Link>
                  <span>— 연애, 결혼, 짝사랑, 인연 등 사랑에 관한 운세입니다.</span>
                </li>
                <li className="flex gap-2">
                  <Link href="/fortune/career" className="text-cookie-gold hover:underline shrink-0">재물운</Link>
                  <span>— 직장, 사업, 투자, 재테크 등 경제 활동 운세입니다.</span>
                </li>
                <li className="flex gap-2">
                  <Link href="/fortune/health" className="text-cookie-gold hover:underline shrink-0">건강운</Link>
                  <span>— 신체적 건강과 정신적 웰빙에 관한 운세입니다.</span>
                </li>
                <li className="flex gap-2">
                  <Link href="/fortune/study" className="text-cookie-gold hover:underline shrink-0">학업운</Link>
                  <span>— 공부, 시험, 자격증, 자기계발 등 학습 운세입니다.</span>
                </li>
                <li className="flex gap-2">
                  <Link href="/fortune/relationship" className="text-cookie-gold hover:underline shrink-0">대인운</Link>
                  <span>— 친구, 가족, 동료 등 인간관계 전반의 운세입니다.</span>
                </li>
              </ul>
            </div>
          </article>

          <article className="bg-bg-card/30 rounded-xl p-6 border border-white/5">
            <h2 className="text-lg font-semibold text-cookie-gold mb-4">자주 묻는 질문</h2>
            <div className="space-y-2">
              <details open className="border border-white/5 rounded-lg overflow-hidden">
                <summary className="px-4 py-3 flex items-center justify-between gap-2 hover:bg-white/5 transition-colors cursor-pointer text-sm font-medium text-text-primary">
                  <span>포춘쿠키 운세는 정말 무료인가요?</span>
                  <span className="text-text-muted text-lg shrink-0">+</span>
                </summary>
                <div className="px-4 pb-3">
                  <p className="text-sm text-text-secondary leading-relaxed">네, 포춘쿠키의 모든 운세 서비스는 완전 무료입니다. 총운, 사랑운, 재물운, 건강운, 학업운, 대인운은 물론 별자리 운세, 띠별 운세, MBTI 운세, 궁합 테스트까지 모두 무료로 이용할 수 있습니다. 회원가입이나 로그인도 필요하지 않습니다.</p>
                </div>
              </details>
              <details className="border border-white/5 rounded-lg overflow-hidden">
                <summary className="px-4 py-3 flex items-center justify-between gap-2 hover:bg-white/5 transition-colors cursor-pointer text-sm font-medium text-text-primary">
                  <span>운세는 매일 바뀌나요?</span>
                  <span className="text-text-muted text-lg shrink-0">+</span>
                </summary>
                <div className="px-4 pb-3">
                  <p className="text-sm text-text-secondary leading-relaxed">네, 일일 운세는 날짜 기반으로 매일 자동 갱신됩니다. 같은 날에는 동일한 운세가 나오므로 하루의 가이드로 활용할 수 있습니다. 추가로 운세를 보고 싶으면 &quot;다시 뽑기&quot; 버튼으로 랜덤 운세를 확인할 수 있습니다.</p>
                </div>
              </details>
              <details className="border border-white/5 rounded-lg overflow-hidden">
                <summary className="px-4 py-3 flex items-center justify-between gap-2 hover:bg-white/5 transition-colors cursor-pointer text-sm font-medium text-text-primary">
                  <span>운세 등급은 어떻게 매겨지나요?</span>
                  <span className="text-text-muted text-lg shrink-0">+</span>
                </summary>
                <div className="px-4 pb-3">
                  <p className="text-sm text-text-secondary leading-relaxed">포춘쿠키 운세는 한국 전통 운세 체계에 맞춰 1등급(대흉)부터 5등급(대길)까지 5단계로 구분됩니다. 각 등급에는 행운의 숫자(1~99)와 행운의 색도 함께 제공되어 하루에 작은 재미를 더합니다.</p>
                </div>
              </details>
              <details className="border border-white/5 rounded-lg overflow-hidden">
                <summary className="px-4 py-3 flex items-center justify-between gap-2 hover:bg-white/5 transition-colors cursor-pointer text-sm font-medium text-text-primary">
                  <span>모바일에서도 이용할 수 있나요?</span>
                  <span className="text-text-muted text-lg shrink-0">+</span>
                </summary>
                <div className="px-4 pb-3">
                  <p className="text-sm text-text-secondary leading-relaxed">네, 포춘쿠키는 모바일과 데스크톱 모두 완벽하게 지원합니다. 특히 모바일에서는 흔들기 인터랙션을 추가로 이용할 수 있으며, PWA(Progressive Web App)를 지원하여 홈 화면에 추가하면 앱처럼 사용할 수 있습니다.</p>
                </div>
              </details>
              <details className="border border-white/5 rounded-lg overflow-hidden">
                <summary className="px-4 py-3 flex items-center justify-between gap-2 hover:bg-white/5 transition-colors cursor-pointer text-sm font-medium text-text-primary">
                  <span>운세를 친구에게 공유할 수 있나요?</span>
                  <span className="text-text-muted text-lg shrink-0">+</span>
                </summary>
                <div className="px-4 pb-3">
                  <p className="text-sm text-text-secondary leading-relaxed">네, 운세 결과를 카카오톡, 트위터(X), 클립보드 복사 등 다양한 방법으로 공유할 수 있습니다. 또한 선물 포춘쿠키 기능을 통해 친구에게 미개봉 쿠키 링크를 직접 보낼 수도 있습니다.</p>
                </div>
              </details>
            </div>
          </article>
        </section>
      </main>

      <Footer />
    </div>
  );
}
