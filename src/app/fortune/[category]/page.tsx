import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CATEGORIES, FortuneCategory } from "@/types/fortune";
import CategoryFortuneWidget from "./client";
import { CATEGORY_SEO_CONTENT } from "@/data/seo/category-content";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CategorySelector from "@/components/fortune/CategorySelector";
import SEOContentServer from "@/components/seo/SEOContentServer";
import Link from "next/link";

type PageProps = {
  params: Promise<{ category: string }>;
};

export async function generateStaticParams() {
  return CATEGORIES.map((c) => ({ category: c.key }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category } = await params;
  const categoryInfo = CATEGORIES.find((c) => c.key === category);

  if (!categoryInfo) {
    return { title: "카테고리를 찾을 수 없습니다" };
  }

  return {
    title: `${categoryInfo.label} - 오늘의 ${categoryInfo.label} 운세`,
    description: `${categoryInfo.description}. 포춘쿠키를 깨고 오늘의 ${categoryInfo.label}을 확인하세요!`,
    openGraph: {
      title: `${categoryInfo.emoji} ${categoryInfo.label} - 포춘쿠키 운세`,
      description: `${categoryInfo.description}. 매일 새로운 ${categoryInfo.label}을 무료로 확인하세요.`,
    },
    alternates: {
      canonical: `/fortune/${category}`,
    },
  };
}

function FaqJsonLd({ category }: { category: string }) {
  const seoContent = CATEGORY_SEO_CONTENT[category];
  if (!seoContent) return null;
  // JSON-LD uses only static data from our own SEO content definitions - safe from XSS
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

export default async function CategoryPage({ params }: PageProps) {
  const { category } = await params;
  const categoryInfo = CATEGORIES.find((c) => c.key === category);

  if (!categoryInfo) {
    notFound();
  }

  const seoContent = CATEGORY_SEO_CONTENT[category];

  return (
    <>
      <FaqJsonLd category={category} />
      <div className="star-field min-h-dvh flex flex-col">
        <Header />

        <main className="flex-1 pt-14">
          <section className="relative px-4 pt-8 pb-4">
            <div className="max-w-lg mx-auto text-center">
              <span className="text-4xl mb-2 block">{categoryInfo.emoji}</span>
              <h1 className="text-2xl md:text-3xl font-bold text-text-primary mb-2">
                오늘의{' '}
                <span className="text-cookie-gold">{categoryInfo.label}</span>
              </h1>
              <p className="text-sm text-text-muted mb-3">
                {categoryInfo.description}
              </p>
              {seoContent && (
                <p className="text-xs text-text-muted/70 max-w-md mx-auto mb-6 leading-relaxed">
                  매일 새로운 {categoryInfo.label}을 포춘쿠키로 확인하세요. 행운의 숫자, 행운의 색과 함께 오늘 하루에 대한 영감을 얻을 수 있습니다.
                </p>
              )}
            </div>
          </section>

          <CategoryFortuneWidget category={category as FortuneCategory} />

          <section className="px-4 py-8 mt-4">
            <div className="max-w-lg mx-auto">
              <h2 className="text-center text-sm text-text-muted mb-4">
                다른 카테고리 보기
              </h2>
              <CategorySelector activeCategory={category as FortuneCategory} />
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

          {seoContent && (
            <SEOContentServer
              title={categoryInfo.label}
              content={seoContent}
            />
          )}
        </main>

        <Footer />
      </div>
    </>
  );
}
