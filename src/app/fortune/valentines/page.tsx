import type { Metadata } from "next";
import CategoryPageClient from "../[category]/client";

export const metadata: Metadata = {
  title: "발렌타인 사랑운 포춘쿠키 - 2026년 발렌타인데이 운세",
  description: "발렌타인데이 특별 사랑운 포춘쿠키! 쿠키를 깨고 올해 발렌타인의 사랑 운세를 확인하세요. 연인, 짝사랑, 솔로 모두를 위한 무료 사랑 운세.",
  keywords: ["발렌타인", "발렌타인데이 운세", "사랑운", "연애운", "포춘쿠키 사랑"],
  openGraph: {
    title: "💕 발렌타인 사랑운 포춘쿠키",
    description: "발렌타인데이 특별 사랑운을 포춘쿠키로 확인하세요!",
  },
  alternates: {
    canonical: '/fortune/valentines',
  },
};

export default function ValentinesPage() {
  return <CategoryPageClient category="love" />;
}
