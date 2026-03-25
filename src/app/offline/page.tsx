import type { Metadata } from "next";
import Link from "next/link";
import { SuppressAds } from "@/components/ads/AdsContext";

export const metadata: Metadata = {
  title: "오프라인 - 포춘쿠키",
  description: "인터넷 연결이 끊겼습니다. 연결 후 다시 시도해주세요.",
  robots: { index: false, follow: false },
};

export default function OfflinePage() {
  return (
    <div className="star-field min-h-dvh flex flex-col items-center justify-center px-4">
      <SuppressAds />
      <div className="text-6xl mb-6">🥠</div>
      <h1 className="text-2xl font-bold text-text-primary mb-3">
        인터넷 연결이 끊겼어요
      </h1>
      <p className="text-sm text-text-muted mb-6 text-center">
        포춘쿠키를 열려면 인터넷 연결이 필요합니다.<br />
        연결 후 다시 시도해주세요.
      </p>
      <Link
        href="/"
        className="px-6 py-3 rounded-full bg-cookie-gold/20 border border-cookie-gold/30 text-cookie-gold hover:bg-cookie-gold/30 transition-colors text-sm font-medium"
      >
        다시 시도하기
      </Link>
    </div>
  );
}
