import type { Metadata } from "next";
import { notFound } from "next/navigation";
import GiftPageClient from "./client";
import { SuppressAds } from "@/components/ads/AdsContext";
import { allFortunes } from "@/data/fortunes";
import { getFortuneFromId } from "@/lib/fortune-selector";

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  if (!id || id.length > 100) notFound();
  const fortune = getFortuneFromId(allFortunes, id);
  const labels: Record<number, string> = { 1: '흉', 2: '소흉', 3: '평', 4: '소길', 5: '대길' };
  const ratingLabel = labels[fortune.rating] || '평';

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
    <>
      <SuppressAds />
      <GiftPageClient giftId={id} />
    </>
  );
}
