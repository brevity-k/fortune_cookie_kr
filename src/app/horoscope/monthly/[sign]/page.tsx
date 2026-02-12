import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import {
  ZODIAC_SIGNS,
  getMonthlyHoroscope,
  getMonthlyDate,
  formatMonthYear,
} from "@/lib/horoscopes";

export const revalidate = 43200;

type PageProps = {
  params: Promise<{ sign: string }>;
};

export function generateStaticParams() {
  return ZODIAC_SIGNS.map((s) => ({ sign: s.key }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { sign } = await params;
  const zodiac = ZODIAC_SIGNS.find((s) => s.key === sign);
  if (!zodiac) return { title: "Horoscope not found" };

  const month = getMonthlyDate();
  const formatted = formatMonthYear(month);
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://fortunecookie.ai.kr";

  return {
    title: `${zodiac.name} Monthly Horoscope - ${formatted} | Fortune Cookie`,
    description: `${zodiac.name} horoscope for ${formatted}. Get your free monthly astrology reading with love, career, health predictions, and advice.`,
    keywords: [
      `${zodiac.name.toLowerCase()} monthly horoscope`,
      `${zodiac.name.toLowerCase()} horoscope ${formatted.toLowerCase()}`,
      "monthly horoscope",
      "astrology this month",
    ],
    openGraph: {
      title: `${zodiac.symbol} ${zodiac.name} Monthly Horoscope - ${formatted}`,
      description: `${zodiac.name} monthly horoscope with love, career, health, and life advice for ${formatted}.`,
      url: `${siteUrl}/horoscope/monthly/${sign}`,
    },
    alternates: {
      canonical: `${siteUrl}/horoscope/monthly/${sign}`,
    },
  };
}

export default async function MonthlyHoroscopePage({ params }: PageProps) {
  const { sign } = await params;
  const zodiac = ZODIAC_SIGNS.find((s) => s.key === sign);

  if (!zodiac) {
    return (
      <div className="star-field min-h-dvh flex flex-col">
        <Header />
        <main className="flex-1 pt-14 flex items-center justify-center">
          <p className="text-text-muted">Zodiac sign not found.</p>
        </main>
        <Footer />
      </div>
    );
  }

  const monthly = getMonthlyHoroscope(sign);
  const month = getMonthlyDate();
  const formattedMonth = formatMonthYear(month);
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://fortunecookie.ai.kr";

  return (
    <div className="star-field min-h-dvh flex flex-col">
      <Header />

      <main className="flex-1 pt-14">
        <section className="relative px-4 pt-8 pb-4">
          <div className="max-w-lg mx-auto text-center">
            <span className="text-5xl mb-3 block">{zodiac.symbol}</span>
            <h1 className="text-2xl md:text-3xl font-bold text-text-primary mb-2">
              <span className="text-cookie-gold">{zodiac.name}</span> Monthly
              Horoscope
            </h1>
            <p className="text-sm text-text-muted mb-1">
              {zodiac.dateRange} | {zodiac.element} Sign
            </p>
            <p className="text-xs text-text-muted">{formattedMonth}</p>
          </div>
        </section>

        {monthly && (
          <section className="px-4 py-6">
            <div className="max-w-lg mx-auto space-y-4">
              <div className="relative bg-bg-card/40 rounded-2xl p-6 border border-white/5">
                <div className="absolute top-3 left-3 text-cookie-gold/20 text-lg">
                  ✦
                </div>
                <div className="absolute top-3 right-3 text-cookie-gold/20 text-lg">
                  ✦
                </div>
                <div className="absolute bottom-3 left-3 text-cookie-gold/20 text-lg">
                  ✦
                </div>
                <div className="absolute bottom-3 right-3 text-cookie-gold/20 text-lg">
                  ✦
                </div>

                <h2 className="text-lg font-semibold text-cookie-gold mb-3">
                  {formattedMonth} Overview
                </h2>
                <p className="text-text-secondary leading-relaxed">
                  {monthly.overview}
                </p>
              </div>

              <div className="bg-bg-card/40 rounded-2xl p-6 border border-white/5">
                <h2 className="text-lg font-semibold text-pink-400 mb-3">
                  ♥ Love & Relationships
                </h2>
                <p className="text-text-secondary leading-relaxed">
                  {monthly.love}
                </p>
              </div>

              <div className="bg-bg-card/40 rounded-2xl p-6 border border-white/5">
                <h2 className="text-lg font-semibold text-blue-400 mb-3">
                  ★ Career & Finance
                </h2>
                <p className="text-text-secondary leading-relaxed">
                  {monthly.career}
                </p>
              </div>

              <div className="bg-bg-card/40 rounded-2xl p-6 border border-white/5">
                <h2 className="text-lg font-semibold text-green-400 mb-3">
                  ✚ Health & Wellness
                </h2>
                <p className="text-text-secondary leading-relaxed">
                  {monthly.health}
                </p>
              </div>

              <div className="bg-bg-card/40 rounded-2xl p-6 border border-white/5 bg-gradient-to-br from-cookie-gold/5 to-transparent">
                <h2 className="text-lg font-semibold text-cookie-gold mb-3">
                  Monthly Advice
                </h2>
                <p className="text-text-secondary leading-relaxed italic">
                  &ldquo;{monthly.advice}&rdquo;
                </p>
              </div>
            </div>
          </section>
        )}

        <section className="px-4 py-4">
          <div className="max-w-lg mx-auto flex flex-col sm:flex-row gap-3">
            <Link
              href={`/horoscope/daily/${sign}`}
              className="flex-1 text-center rounded-full border border-cookie-gold/30 px-6 py-3 text-sm text-cookie-gold hover:bg-cookie-gold/10 transition-colors"
            >
              {zodiac.name} Daily Horoscope
            </Link>
            <Link
              href={`/horoscope/weekly/${sign}`}
              className="flex-1 text-center rounded-full border border-cookie-gold/30 px-6 py-3 text-sm text-cookie-gold hover:bg-cookie-gold/10 transition-colors"
            >
              {zodiac.name} Weekly Horoscope
            </Link>
          </div>
        </section>

        <section className="px-4 py-4">
          <div className="max-w-lg mx-auto text-center">
            <Link
              href="/"
              className="inline-block rounded-full bg-cookie-gold px-8 py-3 text-sm font-semibold text-bg-primary hover:bg-gold-sparkle transition-colors"
            >
              Break a Fortune Cookie for {zodiac.name}
            </Link>
          </div>
        </section>

        <section className="px-4 py-8 mt-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-center text-sm text-text-muted mb-4">
              Other Signs
            </h2>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
              {ZODIAC_SIGNS.filter((s) => s.key !== sign).map((s) => (
                <Link
                  key={s.key}
                  href={`/horoscope/monthly/${s.key}`}
                  className="text-center rounded-lg bg-bg-card/30 p-2 border border-white/5 hover:border-cookie-gold/30 transition-colors"
                >
                  <span className="text-xl block">{s.symbol}</span>
                  <span className="text-xs text-text-muted">{s.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                {
                  "@type": "ListItem",
                  position: 1,
                  name: "Home",
                  item: siteUrl,
                },
                {
                  "@type": "ListItem",
                  position: 2,
                  name: "Horoscopes",
                  item: `${siteUrl}/horoscope`,
                },
                {
                  "@type": "ListItem",
                  position: 3,
                  name: `${zodiac.name} Monthly Horoscope`,
                  item: `${siteUrl}/horoscope/monthly/${sign}`,
                },
              ],
            }),
          }}
        />
      </main>

      <Footer />
    </div>
  );
}
