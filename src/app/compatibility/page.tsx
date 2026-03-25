import type { Metadata } from "next";
import CompatibilityClient from "./client";
import AdSenseScript from "@/components/ads/AdSenseScript";

export const metadata: Metadata = {
  title: "궁합 포춘쿠키 - 두 사람의 궁합을 확인하세요",
  description: "포춘쿠키로 두 사람의 궁합을 테스트해보세요! 이름과 생년을 입력하고 쿠키를 깨면 궁합 점수와 운세가 나타납니다. 무료 궁합 테스트!",
  keywords: ["궁합", "궁합 테스트", "이름 궁합", "연인 궁합", "포춘쿠키 궁합", "무료 궁합"],
  openGraph: {
    title: "🥠💕 궁합 포춘쿠키 - 두 사람의 궁합 확인",
    description: "포춘쿠키로 궁합을 테스트해보세요! 두 사람이 각자 쿠키를 깨면 궁합 결과가 나타납니다.",
  },
  alternates: {
    canonical: '/compatibility',
  },
};

export default function CompatibilityPage() {
  return (
    <>
      <CompatibilityClient />
      <AdSenseScript />
    </>
  );
}
