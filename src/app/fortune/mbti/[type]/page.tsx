import type { Metadata } from "next";
import { MBTI_TYPES } from "@/types/mbti";
import MBTIPageClient from "./client";
import { MBTI_SEO_CONTENT } from "@/data/seo/mbti-content";

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
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export default async function MBTIPage({ params }: PageProps) {
  const { type } = await params;
  const mbtiKey = type.toLowerCase();
  return (
    <>
      <FaqJsonLd mbtiKey={mbtiKey} />
      <MBTIPageClient mbtiType={mbtiKey} />
    </>
  );
}
