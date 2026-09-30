import type { Metadata } from "next";
import CollectionWidget from "./client";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { allFortunes } from "@/data/fortunes";

export const metadata: Metadata = {
  title: "포춘쿠키 도감 - 수집한 운세 모아보기",
  description: `지금까지 수집한 포춘쿠키 운세를 도감에서 확인하세요! ${allFortunes.length}개의 운세를 모두 수집해보세요.`,
  openGraph: {
    title: "📖 포춘쿠키 도감",
    description: "수집한 포춘쿠키 운세를 도감에서 확인하세요!",
  },
  alternates: {
    canonical: '/collection',
  },
};

export default function CollectionPage() {
  return (
    <div className="star-field min-h-dvh flex flex-col">
      <Header />

      <main className="flex-1 pt-14">
        <section className="relative px-4 pt-8 pb-4">
          <div className="max-w-lg mx-auto text-center">
            <span className="text-4xl mb-2 block">📖</span>
            <h1 className="text-2xl md:text-3xl font-bold text-text-primary mb-2">
              포춘쿠키 <span className="text-cookie-gold">도감</span>
            </h1>
            <p className="text-sm text-text-muted mb-6">
              포춘쿠키를 깨서 운세를 수집하세요
            </p>
          </div>
        </section>

        <CollectionWidget />
      </main>

      <Footer />
    </div>
  );
}
