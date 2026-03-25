import type { Metadata } from "next";
import Link from "next/link";
import { HOROSCOPE_SIGNS } from "@/types/horoscope";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "별자리 운세 - 12별자리 오늘의 포춘쿠키 운세",
  description:
    "양자리부터 물고기자리까지 12별자리 오늘의 운세를 포춘쿠키로 확인하세요! 매일 새로운 별자리별 무료 운세, 행운의 숫자와 색, 궁합 정보를 제공합니다.",
  keywords: [
    "별자리 운세",
    "오늘의 별자리 운세",
    "12별자리",
    "양자리 운세",
    "포춘쿠키",
    "무료 운세",
  ],
  openGraph: {
    title: "별자리 운세 - 12별자리 오늘의 포춘쿠키",
    description:
      "양자리부터 물고기자리까지! 나의 별자리 운세를 포춘쿠키로 확인해보세요.",
  },
  alternates: {
    canonical: "/fortune/horoscope",
  },
};

const ELEMENT_COLORS: Record<string, string> = {
  불: "text-red-400",
  흙: "text-amber-400",
  바람: "text-sky-400",
  물: "text-blue-400",
};

const ELEMENT_BG: Record<string, string> = {
  불: "bg-red-400/10",
  흙: "bg-amber-400/10",
  바람: "bg-sky-400/10",
  물: "bg-blue-400/10",
};

export default function HoroscopeHubPage() {
  const elements = ["불", "흙", "바람", "물"];

  return (
    <div className="star-field min-h-dvh flex flex-col">
      <Header />

      <main className="flex-1 pt-14">
        <section className="relative px-4 pt-8 pb-4">
          <div className="max-w-2xl mx-auto text-center">
            <span className="text-4xl mb-2 block">⭐</span>
            <h1 className="text-2xl md:text-3xl font-bold text-text-primary mb-3">
              <span className="text-cookie-gold">별자리 운세</span> 포춘쿠키
            </h1>
            <p className="text-sm text-text-muted mb-6 max-w-lg mx-auto">
              서양 점성술에 기반한 12별자리 오늘의 운세를 포춘쿠키로 확인하세요.
              매일 별자리별로 새로운 운세 메시지, 행운의 숫자와 색이 제공됩니다.
            </p>
          </div>
        </section>

        <section className="px-4 py-6">
          <div className="max-w-2xl mx-auto">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {HOROSCOPE_SIGNS.map((sign) => (
                <Link
                  key={sign.key}
                  href={`/fortune/horoscope/${sign.key}`}
                  className="bg-bg-card/30 rounded-xl p-4 border border-white/5 hover:border-cookie-gold/30 hover:bg-bg-card/50 transition-all group text-center"
                >
                  <span className="text-3xl block mb-2">{sign.emoji}</span>
                  <h2 className="text-sm font-semibold text-text-primary group-hover:text-cookie-gold transition-colors">
                    {sign.label}
                  </h2>
                  <p className="text-xs text-text-muted mt-1">
                    {sign.dateRange}
                  </p>
                  <span
                    className={`text-xs mt-1 inline-block px-2 py-0.5 rounded-full ${ELEMENT_BG[sign.element]} ${ELEMENT_COLORS[sign.element]}`}
                  >
                    {sign.element}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 py-8 max-w-2xl mx-auto">
          <div className="bg-bg-card/30 rounded-xl p-6 border border-white/5">
            <h2 className="text-lg font-semibold text-cookie-gold mb-3">
              별자리 운세란?
            </h2>
            <p className="text-sm text-text-secondary leading-relaxed mb-4">
              별자리 운세는 태양이 황도대(Zodiac)의 12궁 중 어느 별자리에
              위치하느냐에 따라 개인의 성격, 운세, 궁합 등을 점치는 서양 점성술
              체계입니다. 태양의 위치는 생년월일에 따라 결정되며, 각 별자리는
              불, 흙, 바람, 물의 네 가지 원소 중 하나에 속합니다.
            </p>
            <p className="text-sm text-text-secondary leading-relaxed mb-4">
              포춘쿠키의 별자리 운세는 매일 날짜와 별자리 정보를 기반으로
              새로운 운세 메시지를 제공합니다. 같은 날에는 같은 결과가 나오며,
              행운의 숫자와 행운의 색도 함께 안내해드립니다. 오락을 위한
              재미있는 콘텐츠이니 가벼운 마음으로 즐겨보세요.
            </p>

            <h3 className="text-sm font-semibold text-text-primary mb-2">
              4원소별 특징
            </h3>
            <div className="grid grid-cols-2 gap-3 mb-4">
              {elements.map((el) => {
                const signs = HOROSCOPE_SIGNS.filter(
                  (s) => s.element === el
                );
                return (
                  <div
                    key={el}
                    className={`rounded-lg p-3 ${ELEMENT_BG[el]}`}
                  >
                    <p
                      className={`text-sm font-semibold ${ELEMENT_COLORS[el]} mb-1`}
                    >
                      {el}의 별자리
                    </p>
                    <p className="text-xs text-text-muted">
                      {signs.map((s) => s.label).join(", ")}
                    </p>
                  </div>
                );
              })}
            </div>

            <h3 className="text-sm font-semibold text-text-primary mb-2">
              별자리 운세 활용 팁
            </h3>
            <ul className="space-y-1.5 text-sm text-text-secondary">
              <li className="flex items-start gap-2">
                <span className="text-cookie-gold mt-0.5 shrink-0">•</span>
                <span>
                  매일 아침 자신의 별자리 운세를 확인하며 하루를 긍정적으로
                  시작해보세요.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cookie-gold mt-0.5 shrink-0">•</span>
                <span>
                  행운의 색을 옷이나 액세서리에 포인트로 활용하면 기분
                  전환에 도움이 됩니다.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cookie-gold mt-0.5 shrink-0">•</span>
                <span>
                  궁합이 좋은 별자리 친구와 함께 운세를 확인하면 더
                  재미있습니다.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cookie-gold mt-0.5 shrink-0">•</span>
                <span>
                  별자리 운세와 띠별 운세를 함께 확인하면 동서양 관점의
                  운세를 모두 즐길 수 있습니다.
                </span>
              </li>
            </ul>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
