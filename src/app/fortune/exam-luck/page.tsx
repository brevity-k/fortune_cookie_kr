import type { Metadata } from "next";
import CategoryFortuneWidget from "../[category]/client";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CategorySelector from "@/components/fortune/CategorySelector";

export const metadata: Metadata = {
  title: "수능 합격 운세 포춘쿠키 - 시험 행운 확인",
  description: "수능, 시험, 자격증 준비 중이라면 포춘쿠키로 합격 운세를 확인하세요! 쿠키를 깨고 시험 행운을 점쳐보세요. 무료 학업운 운세.",
  keywords: ["수능 운세", "시험 운세", "합격 운세", "학업운", "수능 행운", "자격증 운세"],
  openGraph: {
    title: "수능 합격 운세 포춘쿠키",
    description: "포춘쿠키로 시험 행운을 확인하세요! 합격 기원 운세를 무료로 제공합니다.",
  },
  alternates: {
    canonical: '/fortune/exam-luck',
  },
};

export default function ExamLuckPage() {
  return (
    <div className="star-field min-h-dvh flex flex-col">
      <Header />

      <main className="flex-1 pt-14">
        <section className="relative px-4 pt-8 pb-4">
          <div className="max-w-lg mx-auto text-center">
            <span className="text-4xl mb-2 block">📚</span>
            <h1 className="text-2xl md:text-3xl font-bold text-text-primary mb-2">
              수능 <span className="text-cookie-gold">합격 운세</span> 포춘쿠키
            </h1>
            <p className="text-sm text-text-muted mb-6">
              쿠키를 깨고 시험 행운을 점쳐보세요
            </p>
          </div>
        </section>

        <CategoryFortuneWidget category="study" />

        <section className="px-4 py-8 mt-4">
          <div className="max-w-lg mx-auto">
            <h2 className="text-center text-sm text-text-muted mb-4">
              다른 카테고리 보기
            </h2>
            <CategorySelector activeCategory="study" />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
