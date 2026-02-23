import type { Metadata } from "next";
import CategoryFortuneWidget from "../[category]/client";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CategorySelector from "@/components/fortune/CategorySelector";

export const metadata: Metadata = {
  title: "발렌타인 사랑운 포춘쿠키 - 2026년 발렌타인데이 운세",
  description: "발렌타인데이 특별 사랑운 포춘쿠키! 쿠키를 깨고 올해 발렌타인의 사랑 운세를 확인하세요. 연인, 짝사랑, 솔로 모두를 위한 무료 사랑 운세.",
  keywords: ["발렌타인", "발렌타인데이 운세", "사랑운", "연애운", "포춘쿠키 사랑"],
  openGraph: {
    title: "발렌타인 사랑운 포춘쿠키",
    description: "발렌타인데이 특별 사랑운을 포춘쿠키로 확인하세요!",
  },
  alternates: {
    canonical: '/fortune/valentines',
  },
};

export default function ValentinesPage() {
  return (
    <div className="star-field min-h-dvh flex flex-col">
      <Header />

      <main className="flex-1 pt-14">
        <section className="relative px-4 pt-8 pb-4">
          <div className="max-w-lg mx-auto text-center">
            <span className="text-4xl mb-2 block">💕</span>
            <h1 className="text-2xl md:text-3xl font-bold text-text-primary mb-2">
              발렌타인 <span className="text-cookie-gold">사랑운</span> 포춘쿠키
            </h1>
            <p className="text-sm text-text-muted mb-6">
              쿠키를 깨고 올해 발렌타인의 사랑 운세를 확인하세요
            </p>
          </div>
        </section>

        <CategoryFortuneWidget category="love" />

        <section className="px-4 py-8 mt-4">
          <div className="max-w-lg mx-auto">
            <h2 className="text-center text-sm text-text-muted mb-4">
              다른 카테고리 보기
            </h2>
            <CategorySelector activeCategory="love" />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
