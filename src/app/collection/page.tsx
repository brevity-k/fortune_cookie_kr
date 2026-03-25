import type { Metadata } from "next";
import CollectionClient from "./client";
import AdSenseScript from "@/components/ads/AdSenseScript";

export const metadata: Metadata = {
  title: "포춘쿠키 도감 - 수집한 운세 모아보기",
  description: "지금까지 수집한 포춘쿠키 운세를 도감에서 확인하세요! 280개의 운세를 모두 수집해보세요.",
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
    <>
      <CollectionClient />
      <AdSenseScript />
    </>
  );
}
