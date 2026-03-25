import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '소개 - 포춘쿠키 운세 서비스',
  description:
    '포춘쿠키 서비스 소개 - 매일 무료로 즐기는 온라인 포춘쿠키 운세. 사랑운, 재물운, 건강운, 학업운, 대인운, 총운 등 300개 이상의 운세 메시지를 인터랙티브 쿠키 깨기로 확인하세요.',
  openGraph: {
    title: '포춘쿠키 소개 - 매일 무료 운세',
    description:
      '한국 최초의 인터랙티브 포춘쿠키 운세 서비스. 쿠키를 깨고 오늘의 운세를 확인하세요.',
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

          <section className="mb-10">
            <h2 className="text-xl font-semibold text-text-primary mb-3">
              서비스 소개
            </h2>
            <p className="text-text-secondary leading-relaxed mb-4">
              포춘쿠키(fortunecookie.ai.kr)는 매일 무료로 즐길 수 있는 온라인
              포춘쿠키 운세 서비스입니다. 실제 포춘쿠키를 깨는 것처럼 클릭,
              드래그, 길게 누르기, 흔들기, 더블 탭 등 5가지 인터랙션으로 쿠키를
              깨고, 그 안에 담긴 오늘의 운세를 확인할 수 있습니다.
            </p>
            <p className="text-text-secondary leading-relaxed mb-4">
              사랑운, 재물운, 건강운, 학업운, 대인운, 총운 등 6가지 카테고리에서
              300개 이상의 다양한 운세 메시지를 만나보세요. 여기에 별자리 운세
              12종, 띠별 운세 12종, MBTI별 운세 16종까지 더해 매일 새로운
              운세 경험을 제공합니다.
            </p>
            <p className="text-text-secondary leading-relaxed">
              포춘쿠키는 단순한 운세 결과 제공을 넘어, 쿠키를 깨는 과정 자체를
              즐거운 경험으로 만들었습니다. 모바일과 데스크톱 모두에서 최적화된
              인터랙션을 제공하며, 카카오톡, 트위터 등을 통해 친구와 운세를
              공유할 수 있습니다.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-semibold text-text-primary mb-3">
              서비스 철학
            </h2>
            <p className="text-text-secondary leading-relaxed mb-4">
              포춘쿠키는 &quot;가장 재미있는 방식으로 운세를 확인하는 곳&quot;을
              지향합니다. 기존의 운세 서비스가 텍스트 결과를 단순히 보여주는
              방식이라면, 포춘쿠키는 쿠키를 직접 깨는 인터랙티브 체험을 통해
              운세를 확인하는 독특한 경험을 제공합니다.
            </p>
            <p className="text-text-secondary leading-relaxed mb-4">
              우리는 운세가 하루를 시작하는 작은 즐거움이 될 수 있다고
              믿습니다. 대길이 나오면 자신감을 얻고, 흉이 나오면 조심하는
              마음가짐으로 하루를 보내는 것 — 이 소소한 루틴이 일상에 긍정적인
              리듬을 만들어준다고 생각합니다.
            </p>
            <p className="text-text-secondary leading-relaxed">
              또한 운세를 친구, 연인, 가족과 공유하며 대화의 소재로 활용하는
              문화를 만들어가고자 합니다. &quot;오늘 대길 나왔는데 너는?&quot;
              이라는 한마디가 즐거운 소통의 시작이 될 수 있습니다.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-semibold text-text-primary mb-3">
              포춘쿠키의 역사와 문화적 의미
            </h2>
            <p className="text-text-secondary leading-relaxed mb-4">
              포춘쿠키는 19세기 후반 미국 캘리포니아에서 일본계 이민자들에 의해
              처음 만들어진 것으로 알려져 있습니다. 일본의 전통 과자인
              &apos;센베이&apos;에 점괘를 넣는 풍습에서 영감을 받았으며,
              이후 미국 전역의 중국 음식점으로 퍼져 나갔습니다.
            </p>
            <p className="text-text-secondary leading-relaxed mb-4">
              한국에서는 중화 요리점에서 식사 후 포춘쿠키를 제공하는 문화가
              자리 잡으면서 대중에게 익숙해졌습니다. 쿠키 안에 담긴 짧은
              메시지를 확인하는 순간의 설렘과 기대감은 동서양을 막론하고
              보편적인 즐거움이 되었습니다.
            </p>
            <p className="text-text-secondary leading-relaxed">
              오늘날 포춘쿠키는 전 세계적으로 사랑받는 문화 아이콘이 되었으며,
              연간 30억 개 이상이 생산됩니다. 식사 후 작은 행운의 메시지를
              받아보는 이 즐거운 경험을 온라인으로 재현한 것이 바로 포춘쿠키
              서비스입니다.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-semibold text-text-primary mb-3">
              콘텐츠 품질 기준
            </h2>
            <p className="text-text-secondary leading-relaxed mb-4">
              포춘쿠키의 모든 운세 메시지는 한국어 원문으로 작성되며, 엄격한
              품질 기준을 거쳐 제공됩니다. 각 메시지에는 운세 본문, 상세 해석,
              행운의 숫자(1~99), 행운의 색, 등급(1~5단계), 공유 텍스트가
              포함되어 있어 풍부한 운세 경험을 제공합니다.
            </p>
            <p className="text-text-secondary leading-relaxed mb-4">
              운세 등급은 한국 전통 운세 체계에 맞춰 대흉(1등급)부터
              대길(5등급)까지 5단계로 구분됩니다. 이는 한국의 사주, 토정비결
              등에서 사용하는 전통적인 분류 체계를 현대적으로 재해석한
              것입니다.
            </p>
            <p className="text-text-secondary leading-relaxed">
              블로그 콘텐츠는 한국의 운세 문화, 전통 풍습, 심리학적 관점 등을
              다루며, 전문 에디터의 검수를 거쳐 게시됩니다. 현재 25편 이상의
              심층 기사가 게시되어 있으며, 지속적으로 새로운 콘텐츠가
              추가되고 있습니다.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-semibold text-text-primary mb-3">
              쿠키 깨기 인터랙션 안내
            </h2>
            <p className="text-text-secondary leading-relaxed mb-4">
              포춘쿠키는 5가지 방법으로 쿠키를 깰 수 있습니다. 각 방법마다
              고유한 감각적 경험을 제공하며, 사운드 효과와 진동 피드백이
              함께합니다.
            </p>
            <ul className="space-y-3 text-text-secondary mb-4">
              <li className="flex gap-3">
                <span className="text-cookie-gold shrink-0">1.</span>
                <span>
                  <strong className="text-text-primary">클릭/탭</strong> —
                  쿠키를 3번 클릭하면 금이 가기 시작하고, 마지막 클릭에
                  쿠키가 깨집니다. 가장 직관적인 방법입니다.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-cookie-gold shrink-0">2.</span>
                <span>
                  <strong className="text-text-primary">드래그 후 던지기</strong>{' '}
                  — 쿠키를 잡고 빠르게 던지면 깨집니다. 실제로 쿠키를
                  바닥에 던지는 듯한 역동적인 느낌을 줍니다.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-cookie-gold shrink-0">3.</span>
                <span>
                  <strong className="text-text-primary">꾹 누르기</strong> —
                  쿠키를 1.5초간 길게 누르면 원형 프로그레스 바가 채워지며
                  깨집니다. 천천히 집중하는 명상적 경험을 제공합니다.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-cookie-gold shrink-0">4.</span>
                <span>
                  <strong className="text-text-primary">흔들기</strong> —
                  모바일에서 기기를 흔들면 쿠키가 깨집니다. DeviceMotion API를
                  활용한 모바일 전용 인터랙션입니다.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-cookie-gold shrink-0">5.</span>
                <span>
                  <strong className="text-text-primary">더블 탭</strong> —
                  빠르게 두 번 탭하면 쿠키가 즉시 깨집니다. 가장 빠른
                  방법으로 재방문 시 편리합니다.
                </span>
              </li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-semibold text-text-primary mb-3">
              주요 기능
            </h2>
            <ul className="space-y-3 text-text-secondary">
              <li className="flex gap-3">
                <span className="text-cookie-gold shrink-0">
                  &#x2022;
                </span>
                <span>
                  <strong className="text-text-primary">일일 운세</strong> —
                  매일 날짜 기반으로 새로운 운세가 제공됩니다. 같은 날에는
                  동일한 운세가 나와 하루의 가이드로 활용할 수 있습니다.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-cookie-gold shrink-0">
                  &#x2022;
                </span>
                <span>
                  <strong className="text-text-primary">
                    별자리/띠별/MBTI 운세
                  </strong>{' '}
                  — 서양 별자리(12종), 동양 띠(12종), MBTI(16종) 등 개인
                  특성에 맞춘 맞춤 운세를 제공합니다.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-cookie-gold shrink-0">
                  &#x2022;
                </span>
                <span>
                  <strong className="text-text-primary">궁합 테스트</strong> —
                  두 사람이 각자 쿠키를 깨서 궁합 결과를 확인할 수 있습니다.
                  연인, 친구, 동료와 함께 즐겨보세요.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-cookie-gold shrink-0">
                  &#x2022;
                </span>
                <span>
                  <strong className="text-text-primary">포춘쿠키 도감</strong> —
                  지금까지 받은 운세를 수집하고 카테고리별 진행률을 확인할 수
                  있습니다. 모든 운세를 모아보세요.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-cookie-gold shrink-0">
                  &#x2022;
                </span>
                <span>
                  <strong className="text-text-primary">선물 포춘쿠키</strong> —
                  친구에게 포춘쿠키 링크를 보내면 미개봉 쿠키가 전달됩니다.
                  특별한 날 마음을 전하는 새로운 방법입니다.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-cookie-gold shrink-0">
                  &#x2022;
                </span>
                <span>
                  <strong className="text-text-primary">연속 방문 스트릭</strong>{' '}
                  — 매일 방문하면 연속 방문 일수가 기록됩니다. 꾸준한 운세
                  확인 습관을 만들어보세요.
                </span>
              </li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-semibold text-text-primary mb-3">
              카테고리 안내
            </h2>
            <div className="space-y-3 text-text-secondary">
              <p className="leading-relaxed">
                포춘쿠키는 삶의 주요 영역을 6가지 카테고리로 나누어 운세를
                제공합니다.{' '}
                <Link
                  href="/fortune/general"
                  className="text-cookie-gold hover:underline"
                >
                  총운
                </Link>
                은 하루의 전반적인 흐름을,{' '}
                <Link
                  href="/fortune/love"
                  className="text-cookie-gold hover:underline"
                >
                  사랑운
                </Link>
                은 연애와 관계를,{' '}
                <Link
                  href="/fortune/career"
                  className="text-cookie-gold hover:underline"
                >
                  재물운
                </Link>
                은 직장과 경제 활동을 다룹니다.
              </p>
              <p className="leading-relaxed">
                <Link
                  href="/fortune/health"
                  className="text-cookie-gold hover:underline"
                >
                  건강운
                </Link>
                은 신체적, 정신적 웰빙을,{' '}
                <Link
                  href="/fortune/study"
                  className="text-cookie-gold hover:underline"
                >
                  학업운
                </Link>
                은 공부와 시험을,{' '}
                <Link
                  href="/fortune/relationship"
                  className="text-cookie-gold hover:underline"
                >
                  대인운
                </Link>
                은 인간관계 전반을 아우릅니다. 총운을 먼저 확인한 후 관심 있는
                카테고리를 추가로 확인하면 더 풍부한 운세 경험을 할 수
                있습니다.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-text-primary mb-3">
              참고 사항
            </h2>
            <p className="text-text-secondary leading-relaxed mb-4">
              본 서비스의 운세는 재미와 즐거움을 위한 오락 콘텐츠이며, 실제
              미래를 예측하거나 보장하지 않습니다. 중요한 의사결정은 반드시
              전문가의 조언을 구하시기 바랍니다.
            </p>
            <p className="text-text-secondary leading-relaxed">
              포춘쿠키는 개인정보를 수집하지 않으며, 운세 기록은 사용자의
              브라우저(localStorage)에만 저장됩니다. 서비스 이용에 대한 자세한
              내용은{' '}
              <Link
                href="/privacy"
                className="text-cookie-gold hover:underline"
              >
                개인정보처리방침
              </Link>
              과{' '}
              <Link
                href="/terms"
                className="text-cookie-gold hover:underline"
              >
                이용약관
              </Link>
              을 참고해주세요. 서비스 관련 문의는{' '}
              <Link
                href="/contact"
                className="text-cookie-gold hover:underline"
              >
                문의 페이지
              </Link>
              를 통해 접수할 수 있습니다.
            </p>
          </section>
        </article>
      </main>
      <Footer />
    </div>
  );
}
