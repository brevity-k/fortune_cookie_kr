import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HOROSCOPE_SIGNS } from "@/types/horoscope";
import HoroscopeFortuneWidget from "./client";
import { HOROSCOPE_SEO_CONTENT } from "@/data/seo/horoscope-content";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HoroscopeSelector from "@/components/fortune/HoroscopeSelector";
import SEOContentServer from "@/components/seo/SEOContentServer";

type PageProps = {
  params: Promise<{ sign: string }>;
};

export async function generateStaticParams() {
  return HOROSCOPE_SIGNS.map((s) => ({ sign: s.key }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { sign } = await params;
  const horoscope = HOROSCOPE_SIGNS.find((s) => s.key === sign);

  if (!horoscope) {
    return { title: "별자리 운세를 찾을 수 없습니다" };
  }

  return {
    title: `${horoscope.label} 오늘의 운세 - ${horoscope.emoji} 별자리 포춘쿠키`,
    description: `${horoscope.label}(${horoscope.dateRange}) 오늘의 운세를 포춘쿠키로 확인하세요! 매일 새로운 ${horoscope.label} 운세를 무료로 제공합니다.`,
    keywords: [`${horoscope.label}`, `${horoscope.label} 운세`, '별자리운세', '오늘의 운세', '포춘쿠키'],
    openGraph: {
      title: `${horoscope.emoji} ${horoscope.label} 오늘의 운세 - 포춘쿠키`,
      description: `${horoscope.label} 오늘의 운세를 확인하세요! 포춘쿠키를 깨고 나의 별자리 운세를 알아보세요.`,
    },
    alternates: {
      canonical: `/fortune/horoscope/${sign}`,
    },
  };
}

function FaqJsonLd({ sign }: { sign: string }) {
  const seoContent = HOROSCOPE_SEO_CONTENT[sign];
  if (!seoContent) return null;
  // Content is from our own static SEO data definitions, not user input
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: seoContent.faq.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export default async function HoroscopePage({ params }: PageProps) {
  const { sign } = await params;
  const horoscope = HOROSCOPE_SIGNS.find((s) => s.key === sign);

  if (!horoscope) {
    notFound();
  }

  const seoContent = HOROSCOPE_SEO_CONTENT[sign];

  return (
    <>
      <FaqJsonLd sign={sign} />
      <div className="star-field min-h-dvh flex flex-col">
        <Header />

        <main className="flex-1 pt-14">
          <section className="relative px-4 pt-8 pb-4">
            <div className="max-w-lg mx-auto text-center">
              <span className="text-4xl mb-2 block">{horoscope.emoji}</span>
              <h1 className="text-2xl md:text-3xl font-bold text-text-primary mb-2">
                <span className="text-cookie-gold">{horoscope.label}</span> 오늘의 운세
              </h1>
              <p className="text-sm text-text-muted mb-6">
                {horoscope.dateRange} | {horoscope.element}의 별자리 | 포춘쿠키를 깨고 확인하세요
              </p>
            </div>
          </section>

          <HoroscopeFortuneWidget sign={sign} />

          <section className="px-4 py-8 mt-4">
            <div className="max-w-lg mx-auto">
              <h2 className="text-center text-sm text-text-muted mb-4">
                다른 별자리 보기
              </h2>
              <HoroscopeSelector activeSign={sign} />
            </div>
          </section>

          {seoContent && (
            <SEOContentServer
              title={horoscope.label}
              content={seoContent}
            />
          )}
        </main>

        <Footer />
      </div>
    </>
  );
}
