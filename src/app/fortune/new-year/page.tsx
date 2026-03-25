import type { Metadata } from "next";
import CategoryFortuneWidget from "../[category]/client";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CategorySelector from "@/components/fortune/CategorySelector";

export const metadata: Metadata = {
  title: "2026 신년운세 포춘쿠키 - 새해 운세 무료 확인",
  description: "2026년 신년운세를 포춘쿠키로 확인하세요! 새해 첫 포춘쿠키를 깨고 올해의 총운을 점쳐보세요. 무료 신년 운세.",
  keywords: ["신년운세", "2026 운세", "새해 운세", "신년 포춘쿠키", "올해 운세", "무료 신년운세"],
  openGraph: {
    title: "2026 신년운세 포춘쿠키",
    description: "새해 첫 포춘쿠키! 2026년 운세를 무료로 확인하세요.",
  },
  alternates: {
    canonical: '/fortune/new-year',
  },
};

export default function NewYearPage() {
  return (
    <div className="star-field min-h-dvh flex flex-col">
      <Header />

      <main className="flex-1 pt-14">
        <section className="relative px-4 pt-8 pb-4">
          <div className="max-w-lg mx-auto text-center">
            <span className="text-4xl mb-2 block">🎆</span>
            <h1 className="text-2xl md:text-3xl font-bold text-text-primary mb-2">
              2026 <span className="text-cookie-gold">신년운세</span> 포춘쿠키
            </h1>
            <p className="text-sm text-text-muted mb-6">
              새해 첫 포춘쿠키를 깨고 올해의 총운을 점쳐보세요
            </p>
          </div>
        </section>

        <CategoryFortuneWidget category="general" />

        <section className="px-4 py-8 mt-4">
          <div className="max-w-lg mx-auto">
            <h2 className="text-center text-sm text-text-muted mb-4">
              다른 카테고리 보기
            </h2>
            <CategorySelector />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
