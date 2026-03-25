import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import SajuDashboard from './client';
import { SAJU_SEO_CONTENT } from '@/data/seo/saju-content';

export const metadata: Metadata = {
  title: '무료 사주팔자 분석 - 나의 사주 보기 | 포춘쿠키',
  description:
    '생년월일시를 입력하면 사주팔자(四柱八字)를 무료로 분석합니다. 오행 균형, 일간 해석, 대운 흐름까지 한눈에 확인하세요.',
  keywords: [
    '사주',
    '사주팔자',
    '무료 사주',
    '사주 보기',
    '오행',
    '사주 분석',
    '사주명리',
    '대운',
    '일간',
    '용신',
    '포춘쿠키',
  ],
  openGraph: {
    title: '무료 사주팔자 분석 - 나의 사주 보기 | 포춘쿠키',
    description:
      '생년월일시를 입력하고 사주팔자를 무료로 분석하세요. 오행 균형, 대운 흐름, 일간 해석까지!',
  },
  alternates: {
    canonical: '/saju',
  },
};

function FaqJsonLd() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: SAJU_SEO_CONTENT.faq.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  };
  /* eslint-disable-next-line -- JSON-LD from static SEO data, not user input */
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />;
}

export default function SajuPage() {
  return (
    <>
      <FaqJsonLd />
      <div className="star-field min-h-dvh flex flex-col">
        <Header />

        <main className="flex-1 pt-14">
          {/* Hero */}
          <section className="relative px-4 pt-8 pb-4">
            <div className="max-w-lg mx-auto text-center">
              <span className="text-4xl mb-2 block">🔮</span>
              <h1 className="text-2xl md:text-3xl font-bold text-text-primary mb-2">
                나의 <span className="text-cookie-gold">사주팔자</span>
              </h1>
              <p className="text-sm text-text-muted max-w-md mx-auto leading-relaxed">
                생년월일시를 입력하면 사주팔자를 무료로 분석합니다. 오행 균형, 일간 성격, 대운 흐름까지 한눈에 확인하세요.
              </p>
            </div>
          </section>

          {/* Client-side Saju Dashboard */}
          <SajuDashboard />

          {/* SEO Content: Educational Sections */}
          <section className="px-4 py-8 max-w-2xl mx-auto space-y-6">
            <div className="bg-bg-card/30 rounded-xl p-6 border border-white/5">
              <h2 className="text-lg font-semibold text-cookie-gold mb-3">사주명리학 소개</h2>
              <p className="text-sm text-text-secondary leading-relaxed">{SAJU_SEO_CONTENT.description}</p>
            </div>

            {SAJU_SEO_CONTENT.sections.map((section) => (
              <div key={section.title} className="bg-bg-card/30 rounded-xl p-6 border border-white/5">
                <h2 className="text-lg font-semibold text-cookie-gold mb-3">{section.title}</h2>
                <p className="text-sm text-text-secondary leading-relaxed">{section.content}</p>
              </div>
            ))}

            {/* FAQ */}
            <div className="bg-bg-card/30 rounded-xl p-6 border border-white/5">
              <h2 className="text-lg font-semibold text-cookie-gold mb-4">자주 묻는 질문</h2>
              <div className="space-y-2">
                {SAJU_SEO_CONTENT.faq.map((item, index) => (
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
