import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ZODIAC_ANIMALS } from "@/types/zodiac";
import ZodiacFortuneWidget from "./client";
import { ZODIAC_SEO_CONTENT } from "@/data/seo/zodiac-content";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ZodiacSelector from "@/components/fortune/ZodiacSelector";
import SEOContentServer from "@/components/seo/SEOContentServer";

type PageProps = {
  params: Promise<{ animal: string }>;
};

export async function generateStaticParams() {
  return ZODIAC_ANIMALS.map((z) => ({ animal: z.key }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { animal } = await params;
  const zodiac = ZODIAC_ANIMALS.find((z) => z.key === animal);

  if (!zodiac) {
    return { title: "띠별 운세를 찾을 수 없습니다" };
  }

  const yearStr = zodiac.years.slice(-3).join(', ');

  return {
    title: `${zodiac.label} 오늘의 운세 - ${zodiac.emoji} 띠별 포춘쿠키`,
    description: `${zodiac.label}(${yearStr}년생) 오늘의 운세를 포춘쿠키로 확인하세요! 매일 새로운 ${zodiac.label} 운세를 무료로 제공합니다.`,
    keywords: [`${zodiac.label}`, `${zodiac.label} 운세`, '띠별운세', '오늘의 운세', '포춘쿠키'],
    openGraph: {
      title: `${zodiac.emoji} ${zodiac.label} 오늘의 운세 - 포춘쿠키`,
      description: `${zodiac.label} 오늘의 운세를 확인하세요! 포춘쿠키를 깨고 나의 띠별 운세를 알아보세요.`,
    },
    alternates: {
      canonical: `/fortune/zodiac/${animal}`,
    },
  };
}

function FaqJsonLd({ animal }: { animal: string }) {
  const seoContent = ZODIAC_SEO_CONTENT[animal];
  if (!seoContent) return null;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: seoContent.faq.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
  /* eslint-disable-next-line -- JSON-LD from static SEO data, not user input */
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />;
}

export default async function ZodiacPage({ params }: PageProps) {
  const { animal } = await params;
  const zodiac = ZODIAC_ANIMALS.find((z) => z.key === animal);

  if (!zodiac) {
    notFound();
  }

  const yearStr = zodiac.years.slice(-4).join(', ');
  const seoContent = ZODIAC_SEO_CONTENT[animal];

  return (
    <>
      <FaqJsonLd animal={animal} />
      <div className="star-field min-h-dvh flex flex-col">
        <Header />

        <main className="flex-1 pt-14">
          <section className="relative px-4 pt-8 pb-4">
            <div className="max-w-lg mx-auto text-center">
              <span className="text-4xl mb-2 block">{zodiac.emoji}</span>
              <h1 className="text-2xl md:text-3xl font-bold text-text-primary mb-2">
                <span className="text-cookie-gold">{zodiac.label}</span> 오늘의 운세
              </h1>
              <p className="text-sm text-text-muted mb-6">
                {yearStr}년생 | 포춘쿠키를 깨고 확인하세요
              </p>
            </div>
          </section>

          <ZodiacFortuneWidget animal={animal} />

          <section className="px-4 py-8 mt-4">
            <div className="max-w-lg mx-auto">
              <h2 className="text-center text-sm text-text-muted mb-4">
                다른 띠 보기
              </h2>
              <ZodiacSelector activeAnimal={animal} />
            </div>
          </section>

          {seoContent && (
            <SEOContentServer
              title={zodiac.label}
              content={seoContent}
            />
          )}
        </main>

        <Footer />
      </div>
    </>
  );
}
