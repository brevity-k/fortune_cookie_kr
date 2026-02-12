import type { Metadata } from "next";
import CategoryPageClient from "../[category]/client";

export const metadata: Metadata = {
  title: "수능 합격 운세 포춘쿠키 - 시험 행운 확인",
  description: "수능, 시험, 자격증 준비 중이라면 포춘쿠키로 합격 운세를 확인하세요! 쿠키를 깨고 시험 행운을 점쳐보세요. 무료 학업운 운세.",
  keywords: ["수능 운세", "시험 운세", "합격 운세", "학업운", "수능 행운", "자격증 운세"],
  openGraph: {
    title: "📚 수능 합격 운세 포춘쿠키",
    description: "포춘쿠키로 시험 행운을 확인하세요! 합격 기원 운세를 무료로 제공합니다.",
  },
};

export default function ExamLuckPage() {
  return <CategoryPageClient category="study" />;
}
