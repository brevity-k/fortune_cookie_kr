import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import AstroDashboard from './client';
import { BIRTH_CHART_SEO_CONTENT } from '@/data/seo/birth-chart-content';

export const metadata: Metadata = {
  title: '무료 서양 출생 차트 분석 - 나의 별자리 차트 | 포춘쿠키',
  description:
    '생년월일시와 출생 도시를 입력하면 서양 점성학 출생 차트(Natal Chart)를 무료로 분석합니다. 행성 위치, 하우스, 애스펙트, AI 해석까지 한눈에 확인하세요.',
  keywords: [
    '출생 차트',
    '별자리 차트',
    'natal chart',
    '서양 점성학',
    '상승점',
    '태양 별자리',
    '달 별자리',
    '하우스',
    '행성 위치',
    '무료 출생 차트',
    '포춘쿠키',
  ],
  openGraph: {
    title: '무료 서양 출생 차트 분석 | 포춘쿠키',
    description:
      '출생 정보를 입력하고 나만의 별자리 차트를 무료로 확인하세요. 행성 위치, 하우스, AI 성격 분석까지!',
  },
  alternates: {
    canonical: '/birth-chart',
  },
};

function FaqJsonLd() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: BIRTH_CHART_SEO_CONTENT.faq.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  };
  // JSON-LD from static SEO data file, not user input — safe to use
  // eslint-disable-next-line react/no-danger
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />;
}

export default function BirthChartPage() {
  return (
    <>
      <FaqJsonLd />
      <div className="star-field min-h-dvh flex flex-col">
        <Header />

        <main className="flex-1 pt-14">
          {/* Hero */}
          <section className="relative px-4 pt-8 pb-4">
            <div className="max-w-lg mx-auto text-center">
              <span className="text-4xl mb-2 block">🌌</span>
              <h1 className="text-2xl md:text-3xl font-bold text-text-primary mb-2">
                나의 <span className="text-cookie-gold">출생 차트</span>
              </h1>
              <p className="text-sm text-text-muted max-w-md mx-auto leading-relaxed">
                출생 정보를 입력하면 서양 점성학 기반의 출생 차트를 무료로 분석합니다. 행성 위치, 하우스 배치, AI 성격 해석까지 확인하세요.
              </p>
            </div>
          </section>

          {/* Client-side Dashboard */}
          <AstroDashboard />

          {/* SEO Content: Educational Sections */}
          <section className="px-4 py-8 max-w-2xl mx-auto space-y-6">
            <div className="bg-bg-card/30 rounded-xl p-6 border border-white/5">
              <h2 className="text-lg font-semibold text-cookie-gold mb-3">서양 점성학 소개</h2>
              <p className="text-sm text-text-secondary leading-relaxed">{BIRTH_CHART_SEO_CONTENT.description}</p>
            </div>

            {BIRTH_CHART_SEO_CONTENT.sections.map((section) => (
              <div key={section.title} className="bg-bg-card/30 rounded-xl p-6 border border-white/5">
                <h2 className="text-lg font-semibold text-cookie-gold mb-3">{section.title}</h2>
                <p className="text-sm text-text-secondary leading-relaxed">{section.content}</p>
              </div>
            ))}

            {/* FAQ */}
            <div className="bg-bg-card/30 rounded-xl p-6 border border-white/5">
              <h2 className="text-lg font-semibold text-cookie-gold mb-4">자주 묻는 질문</h2>
              <div className="space-y-2">
                {BIRTH_CHART_SEO_CONTENT.faq.map((item, index) => (
                  <details
                    key={item.q}
                    className="faq-details border border-white/5 rounded-lg overflow-hidden"
                    {...(index === 0 ? { open: true } : {})}
                  >
                    <summary className="px-4 py-3 flex items-center justify-between gap-2 hover:bg-white/5 transition-colors cursor-pointer text-sm font-medium text-text-primary">
                      <span>{item.q}</span>
                      <span className="faq-marker text-text-muted text-lg shrink-0">+</span>
                    </summary>
                    <div className="px-4 pb-3">
                      <p className="text-sm text-text-secondary leading-relaxed">{item.a}</p>
                    </div>
                  </details>
                ))}
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
}
