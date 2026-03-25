import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MBTI_TYPES } from "@/types/mbti";
import MBTIFortuneWidget from "./client";
import { MBTI_SEO_CONTENT } from "@/data/seo/mbti-content";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MBTISelector from "@/components/fortune/MBTISelector";
import SEOContentServer from "@/components/seo/SEOContentServer";

type PageProps = {
  params: Promise<{ type: string }>;
};

export async function generateStaticParams() {
  return MBTI_TYPES.map((m) => ({ type: m.key }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { type } = await params;
  const mbti = MBTI_TYPES.find((m) => m.key === type.toLowerCase());

  if (!mbti) {
    return { title: "MBTI 유형을 찾을 수 없습니다" };
  }

  return {
    title: `${mbti.label} 오늘의 운세 - ${mbti.description} 포춘쿠키`,
    description: `${mbti.label}(${mbti.description})를 위한 오늘의 포춘쿠키 운세! 매일 새로운 ${mbti.label} 맞춤 운세를 무료로 확인하세요.`,
    keywords: [`${mbti.label}`, `${mbti.label} 운세`, 'MBTI 운세', 'MBTI 포춘쿠키', '오늘의 운세'],
    openGraph: {
      title: `${mbti.emoji} ${mbti.label} 오늘의 운세 - 포춘쿠키`,
      description: `${mbti.label}(${mbti.description})를 위한 오늘의 포춘쿠키!`,
    },
    alternates: {
      canonical: `/fortune/mbti/${type.toLowerCase()}`,
    },
  };
}

function FaqJsonLd({ mbtiKey }: { mbtiKey: string }) {
  const seoContent = MBTI_SEO_CONTENT[mbtiKey];
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
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />;
}

export default async function MBTIPage({ params }: PageProps) {
  const { type } = await params;
  const mbtiKey = type.toLowerCase();
  const mbti = MBTI_TYPES.find((m) => m.key === mbtiKey);

  if (!mbti) {
    notFound();
  }

  const seoContent = MBTI_SEO_CONTENT[mbtiKey];

  return (
    <>
      <FaqJsonLd mbtiKey={mbtiKey} />
      <div className="star-field min-h-dvh flex flex-col">
        <Header />

        <main className="flex-1 pt-14">
          <section className="relative px-4 pt-8 pb-4">
            <div className="max-w-lg mx-auto text-center">
              <span className="text-4xl mb-2 block">{mbti.emoji}</span>
              <h1 className="text-2xl md:text-3xl font-bold text-text-primary mb-2">
                <span className="text-cookie-gold">{mbti.label}</span> 오늘의 운세
              </h1>
              <p className="text-sm text-text-muted mb-3">
                {mbti.description}
              </p>
              <p className="text-xs text-text-muted/70 max-w-md mx-auto mb-6 leading-relaxed">
                {mbti.label}({mbti.description})를 위한 맞춤 포춘쿠키 운세. 당신의 성격 유형에 맞는 오늘의 운세를 확인하세요.
              </p>
            </div>
          </section>

          <MBTIFortuneWidget mbtiType={mbtiKey} />

          <section className="px-4 py-8 mt-4">
            <div className="max-w-lg mx-auto">
              <h2 className="text-center text-sm text-text-muted mb-4">
                다른 MBTI 보기
              </h2>
              <MBTISelector activeType={mbtiKey} />
            </div>
          </section>

          {seoContent && (
            <SEOContentServer
              title={mbti.label}
              content={seoContent}
            />
          )}
        </main>

        <Footer />
      </div>
    </>
  );
}
