import type { Metadata } from "next";
import { HOROSCOPE_SIGNS } from "@/types/horoscope";
import HoroscopePageClient from "./client";
import { HOROSCOPE_SEO_CONTENT } from "@/data/seo/horoscope-content";

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
  return (
    <>
      <FaqJsonLd sign={sign} />
      <HoroscopePageClient sign={sign} />
    </>
  );
}
