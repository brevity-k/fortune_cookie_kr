import type { Metadata } from "next";
import { CATEGORIES, FortuneCategory } from "@/types/fortune";
import CategoryPageClient from "./client";
import { CATEGORY_SEO_CONTENT } from "@/data/seo/category-content";

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
  return (
    <>
      <FaqJsonLd category={category} />
      <CategoryPageClient category={category as FortuneCategory} />
    </>
  );
}
