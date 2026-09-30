import type { Metadata } from "next";
import CompatibilityWidget from "./client";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

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
    <div className="star-field min-h-dvh flex flex-col">
      <Header />

      <main className="flex-1 pt-14">
        <section className="relative px-4 pt-8 pb-4">
          <div className="max-w-lg mx-auto text-center">
            <span className="text-4xl mb-2 block">💕</span>
            <h1 className="text-2xl md:text-3xl font-bold text-text-primary mb-2">
              궁합 <span className="text-cookie-gold">포춘쿠키</span>
            </h1>
            <p className="text-sm text-text-muted mb-6">
              두 사람의 이름과 출생연도로 궁합을 확인하세요
            </p>
          </div>
        </section>

        <CompatibilityWidget />

        {/* SEO content */}
        <section className="px-4 py-8 max-w-2xl mx-auto">
          <div className="bg-bg-card/30 rounded-xl p-6 border border-white/5">
            <h2 className="text-lg font-semibold text-cookie-gold mb-3">
              궁합 포춘쿠키란?
            </h2>
            <p className="text-sm text-text-secondary leading-relaxed mb-3">
              궁합 포춘쿠키는 두 사람의 이름과 출생연도를 입력하면 궁합 점수와
              각자의 운세를 포춘쿠키로 알려주는 무료 궁합 테스트입니다.
            </p>
            <p className="text-sm text-text-secondary leading-relaxed">
              연인, 친구, 가족과 함께 재미있게 궁합을 확인해보세요.
              결과를 카카오톡으로 공유하면 더 즐겁습니다!
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
