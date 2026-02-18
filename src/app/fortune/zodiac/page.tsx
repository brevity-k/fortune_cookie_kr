import type { Metadata } from "next";
import Link from "next/link";
import { ZODIAC_ANIMALS } from "@/types/zodiac";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "띠별 운세 - 12띠 오늘의 포춘쿠키 운세",
  description:
    "쥐띠부터 돼지띠까지 12띠별 오늘의 운세를 포춘쿠키로 확인하세요! 한국 전통 12지신 기반 매일 새로운 무료 띠별 운세, 행운의 숫자와 색을 제공합니다.",
  keywords: [
    "띠별 운세",
    "오늘의 띠별 운세",
    "12지신",
    "띠별운세 2026",
    "포춘쿠키",
    "무료 운세",
  ],
  openGraph: {
    title: "띠별 운세 - 12띠 오늘의 포춘쿠키",
    description:
      "쥐띠부터 돼지띠까지! 나의 띠별 운세를 포춘쿠키로 확인해보세요.",
  },
  alternates: {
    canonical: "/fortune/zodiac",
  },
};

export default function ZodiacHubPage() {
  return (
    <div className="star-field min-h-dvh flex flex-col">
      <Header />

      <main className="flex-1 pt-14">
        <section className="relative px-4 pt-8 pb-4">
          <div className="max-w-2xl mx-auto text-center">
            <span className="text-4xl mb-2 block">🐲</span>
            <h1 className="text-2xl md:text-3xl font-bold text-text-primary mb-3">
              <span className="text-cookie-gold">띠별 운세</span> 포춘쿠키
            </h1>
            <p className="text-sm text-text-muted mb-6 max-w-lg mx-auto">
              한국 전통 12지신에 기반한 띠별 오늘의 운세를 포춘쿠키로
              확인하세요. 매일 띠별로 새로운 운세 메시지, 행운의 숫자와 색이
              제공됩니다.
            </p>
          </div>
        </section>

        <section className="px-4 py-6">
          <div className="max-w-2xl mx-auto">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {ZODIAC_ANIMALS.map((zodiac) => {
                const recentYears = zodiac.years.slice(-3).join(", ");
                return (
                  <Link
                    key={zodiac.key}
                    href={`/fortune/zodiac/${zodiac.key}`}
                    className="bg-bg-card/30 rounded-xl p-4 border border-white/5 hover:border-cookie-gold/30 hover:bg-bg-card/50 transition-all group text-center"
                  >
                    <span className="text-3xl block mb-2">
                      {zodiac.emoji}
                    </span>
                    <h2 className="text-sm font-semibold text-text-primary group-hover:text-cookie-gold transition-colors">
                      {zodiac.label}
                    </h2>
                    <p className="text-xs text-text-muted mt-1">
                      {recentYears}년생
                    </p>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        <section className="px-4 py-8 max-w-2xl mx-auto">
          <div className="bg-bg-card/30 rounded-xl p-6 border border-white/5">
            <h2 className="text-lg font-semibold text-cookie-gold mb-3">
              띠별 운세란?
            </h2>
            <p className="text-sm text-text-secondary leading-relaxed mb-4">
              띠별 운세는 한국의 전통 12지신(십이지)에 기반한 동양 점성술
              체계입니다. 태어난 해에 따라 쥐, 소, 호랑이, 토끼, 용, 뱀, 말,
              양, 원숭이, 닭, 개, 돼지의 12동물 중 하나의 띠가 정해지며, 12년
              주기로 순환합니다. 각 동물은 고유한 성격 특성과 운의 흐름을
              상징합니다.
            </p>
            <p className="text-sm text-text-secondary leading-relaxed mb-4">
              한국에서는 신년이 되면 &ldquo;올해는 ○○띠의 해&rdquo;라며 띠별
              운세에 큰 관심을 갖습니다. 특히 자신의 띠가 돌아오는
              본명년(12년 주기)에는 특별한 기운이 있다고 여깁니다. 2026년은
              말의 해(병오년)로, 말띠에게 의미 있는 한 해입니다.
            </p>
            <p className="text-sm text-text-secondary leading-relaxed mb-4">
              포춘쿠키의 띠별 운세는 매일 날짜와 띠 정보를 기반으로 새로운
              운세 메시지를 제공합니다. 같은 날에는 같은 결과가 나오며, 행운의
              숫자와 행운의 색도 함께 안내됩니다.
            </p>

            <h3 className="text-sm font-semibold text-text-primary mb-2">
              12지신 순서와 의미
            </h3>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-4">
              {ZODIAC_ANIMALS.map((z, i) => (
                <div
                  key={z.key}
                  className="bg-white/5 rounded-lg p-2 text-center"
                >
                  <span className="text-lg">{z.emoji}</span>
                  <p className="text-xs text-text-secondary mt-0.5">
                    {i + 1}. {z.label}
                  </p>
                </div>
              ))}
            </div>

            <h3 className="text-sm font-semibold text-text-primary mb-2">
              띠별 운세 활용 팁
            </h3>
            <ul className="space-y-1.5 text-sm text-text-secondary">
              <li className="flex items-start gap-2">
                <span className="text-cookie-gold mt-0.5 shrink-0">•</span>
                <span>
                  매일 아침 자신의 띠별 운세를 확인하며 하루를 시작해보세요.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cookie-gold mt-0.5 shrink-0">•</span>
                <span>
                  가족의 띠를 함께 확인하면 아침 대화 소재로 좋습니다.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cookie-gold mt-0.5 shrink-0">•</span>
                <span>
                  띠별 운세와 별자리 운세를 함께 보면 동양과 서양 관점의
                  운세를 모두 즐길 수 있습니다.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cookie-gold mt-0.5 shrink-0">•</span>
                <span>
                  본명년(자신의 띠 해)에는 특별히 관심을 갖고 운세를
                  확인해보세요.
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
