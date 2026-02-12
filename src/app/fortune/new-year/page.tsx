import type { Metadata } from "next";
import CategoryPageClient from "../[category]/client";

export const metadata: Metadata = {
  title: "2026 신년운세 포춘쿠키 - 새해 운세 무료 확인",
  description: "2026년 신년운세를 포춘쿠키로 확인하세요! 새해 첫 포춘쿠키를 깨고 올해의 총운을 점쳐보세요. 무료 신년 운세.",
  keywords: ["신년운세", "2026 운세", "새해 운세", "신년 포춘쿠키", "올해 운세", "무료 신년운세"],
  openGraph: {
    title: "🎆 2026 신년운세 포춘쿠키",
    description: "새해 첫 포춘쿠키! 2026년 운세를 무료로 확인하세요.",
  },
  alternates: {
    canonical: '/fortune/new-year',
  },
};

export default function NewYearPage() {
  return <CategoryPageClient category="general" />;
}
