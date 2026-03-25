import type { Metadata } from "next";
import CategoryFortuneWidget from "../[category]/client";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CategorySelector from "@/components/fortune/CategorySelector";

export const metadata: Metadata = {
  title: "크리스마스 운세 포춘쿠키 - 성탄절 특별 운세 무료",
  description: "크리스마스 특별 포춘쿠키를 깨고 성탄절 운세를 확인하세요! 연말 포춘쿠키로 따뜻한 크리스마스 메시지를 받아보세요. 무료 크리스마스 운세.",
  keywords: ["크리스마스 운세", "성탄절 운세", "크리스마스 포춘쿠키", "연말 운세", "크리스마스 무료 운세", "성탄절 포춘쿠키"],
  openGraph: {
    title: "크리스마스 운세 포춘쿠키",
    description: "크리스마스 특별 포춘쿠키! 성탄절 운세를 무료로 확인하세요.",
  },
  alternates: {
    canonical: '/fortune/christmas',
  },
};

export default function ChristmasPage() {
  return (
    <div className="star-field min-h-dvh flex flex-col">
      <Header />

      <main className="flex-1 pt-14">
        <section className="relative px-4 pt-8 pb-4">
          <div className="max-w-lg mx-auto text-center">
            <span className="text-4xl mb-2 block">🎄</span>
            <h1 className="text-2xl md:text-3xl font-bold text-text-primary mb-2">
              <span className="text-cookie-gold">크리스마스</span> 운세 포춘쿠키
            </h1>
            <p className="text-sm text-text-muted mb-6">
              성탄절 특별 포춘쿠키를 깨고 연말 운세를 확인하세요
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
