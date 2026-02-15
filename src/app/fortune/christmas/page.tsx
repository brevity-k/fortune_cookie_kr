import type { Metadata } from "next";
import CategoryPageClient from "../[category]/client";

export const metadata: Metadata = {
  title: "크리스마스 운세 포춘쿠키 - 성탄절 특별 운세 무료",
  description: "크리스마스 특별 포춘쿠키를 깨고 성탄절 운세를 확인하세요! 연말 포춘쿠키로 따뜻한 크리스마스 메시지를 받아보세요. 무료 크리스마스 운세.",
  keywords: ["크리스마스 운세", "성탄절 운세", "크리스마스 포춘쿠키", "연말 운세", "크리스마스 무료 운세", "성탄절 포춘쿠키"],
  openGraph: {
    title: "🎄 크리스마스 운세 포춘쿠키",
    description: "크리스마스 특별 포춘쿠키! 성탄절 운세를 무료로 확인하세요.",
  },
  alternates: {
    canonical: '/fortune/christmas',
  },
};

export default function ChristmasPage() {
  return <CategoryPageClient category="general" />;
}
