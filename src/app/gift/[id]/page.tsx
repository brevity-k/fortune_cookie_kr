import type { Metadata } from "next";
import { notFound } from "next/navigation";
import GiftFortuneWidget from "./client";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { SuppressAds } from "@/components/ads/AdsContext";
import { allFortunes } from "@/data/fortunes";
import { getFortuneFromId, RATING_LABELS } from "@/lib/fortune-selector";

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  if (!id || id.length > 100) notFound();
  const fortune = getFortuneFromId(allFortunes, id);
  const ratingLabel = RATING_LABELS[fortune.rating] || '평';

  return {
    title: `🎁 선물 포춘쿠키 - ${ratingLabel}`,
    description: "누군가 당신에게 특별한 포춘쿠키를 선물했어요! 쿠키를 깨고 운세를 확인하세요.",
    openGraph: {
      title: `🎁 누군가 포춘쿠키를 보냈어요! (${ratingLabel})`,
      description: "쿠키를 깨고 특별한 운세를 확인하세요!",
    },
  };
}

export default async function GiftPage({ params }: PageProps) {
  const { id } = await params;
  if (!id || id.length > 100) notFound();
  return (
    <div className="star-field min-h-dvh flex flex-col">
      <SuppressAds />
      <Header />
      <main className="flex-1 pt-14">
        <section className="relative px-4 pt-8 pb-4">
          <div className="max-w-lg mx-auto text-center">
            <p className="text-sm text-cookie-gold mb-2">
              🎁 누군가 당신에게 포춘쿠키를 선물했어요!
            </p>
            <h1 className="text-2xl md:text-3xl font-bold text-text-primary mb-2">
              선물 <span className="text-cookie-gold">포춘쿠키</span>
            </h1>
            <p className="text-sm text-text-muted mb-6">
              쿠키를 깨고 특별한 운세를 확인하세요
            </p>
          </div>
        </section>

        <GiftFortuneWidget giftId={id} />
      </main>
      <Footer />
    </div>
  );
}
