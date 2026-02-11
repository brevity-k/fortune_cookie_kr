import type { Metadata } from "next";
import GiftPageClient from "./client";

export const metadata: Metadata = {
  title: "선물 포춘쿠키",
  description:
    "누군가 당신에게 특별한 포춘쿠키를 선물했어요! 쿠키를 깨고 운세를 확인하세요.",
  openGraph: {
    title: "🎁 선물 포춘쿠키",
    description: "누군가 당신에게 특별한 포춘쿠키를 선물했어요!",
  },
};

export default function GiftPage() {
  return <GiftPageClient />;
}
