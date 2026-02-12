import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import {
  ZODIAC_SIGNS,
  getDailyHoroscope,
  getDailyDate,
  formatDailyDate,
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

  const date = getDailyDate();
  const formatted = formatDailyDate(date);
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://fortunecookie.ai.kr";

  return {
    title: `${zodiac.name} Daily Horoscope Today - ${formatted} | Fortune Cookie`,
    description: `Read today's ${zodiac.name} horoscope (${zodiac.dateRange}). Get your free daily astrology reading with love, career, and health predictions. Updated daily.`,
    keywords: [
      `${zodiac.name.toLowerCase()} horoscope today`,
      `${zodiac.name.toLowerCase()} daily horoscope`,
      `${zodiac.name.toLowerCase()} horoscope`,
      "daily horoscope",
      "horoscope today",
      "free horoscope",
    ],
    openGraph: {
      title: `${zodiac.symbol} ${zodiac.name} Daily Horoscope - ${formatted}`,
      description: `Today's ${zodiac.name} horoscope: love, career, and health predictions. Free daily astrology reading.`,
      url: `${siteUrl}/horoscope/daily/${sign}`,
    },
    alternates: {
      canonical: `${siteUrl}/horoscope/daily/${sign}`,
    },
  };
}

function StarRating({ rating, label }: { rating: number; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-text-muted w-16">{label}</span>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <span
            key={i}
            className={`text-lg ${i <= rating ? "text-cookie-gold" : "text-white/10"}`}
          >
            ★
          </span>
        ))}
      </div>
      <span className="text-xs text-text-muted">{rating}/5</span>
    </div>
  );
}

export default async function DailyHoroscopePage({ params }: PageProps) {
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

  const daily = getDailyHoroscope(sign);
  const dailyDate = getDailyDate();
  const formattedDate = formatDailyDate(dailyDate);
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
              <span className="text-cookie-gold">{zodiac.name}</span> Daily
              Horoscope
            </h1>
            <p className="text-sm text-text-muted mb-1">
              {zodiac.dateRange} | {zodiac.element} Sign
            </p>
            <p className="text-xs text-text-muted">{formattedDate}</p>
          </div>
        </section>

        {daily && (
          <section className="px-4 py-6">
            <div className="max-w-lg mx-auto">
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

                <p className="text-text-secondary leading-relaxed mb-6">
                  {daily.text}
                </p>

                <div className="space-y-2 mb-6">
                  <StarRating rating={daily.love} label="Love" />
                  <StarRating rating={daily.career} label="Career" />
                  <StarRating rating={daily.health} label="Health" />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center bg-white/5 rounded-lg p-3">
                    <p className="text-xs text-text-muted mb-1">
                      Lucky Number
                    </p>
                    <p className="text-xl font-bold text-cookie-gold">
                      {daily.luckyNumber}
                    </p>
                  </div>
                  <div className="text-center bg-white/5 rounded-lg p-3">
                    <p className="text-xs text-text-muted mb-1">Lucky Color</p>
                    <p className="text-sm font-semibold text-cookie-gold capitalize">
                      {daily.luckyColor}
                    </p>
                  </div>
                  <div className="text-center bg-white/5 rounded-lg p-3">
                    <p className="text-xs text-text-muted mb-1">Mood</p>
                    <p className="text-sm font-semibold text-cookie-gold capitalize">
                      {daily.mood}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        <section className="px-4 py-4">
          <div className="max-w-lg mx-auto flex flex-col sm:flex-row gap-3">
            <Link
              href={`/horoscope/weekly/${sign}`}
              className="flex-1 text-center rounded-full border border-cookie-gold/30 px-6 py-3 text-sm text-cookie-gold hover:bg-cookie-gold/10 transition-colors"
            >
              {zodiac.name} Weekly Horoscope
            </Link>
            <Link
              href={`/horoscope/monthly/${sign}`}
              className="flex-1 text-center rounded-full border border-cookie-gold/30 px-6 py-3 text-sm text-cookie-gold hover:bg-cookie-gold/10 transition-colors"
            >
              {zodiac.name} Monthly Horoscope
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
                  href={`/horoscope/daily/${s.key}`}
                  className="text-center rounded-lg bg-bg-card/30 p-2 border border-white/5 hover:border-cookie-gold/30 transition-colors"
                >
                  <span className="text-xl block">{s.symbol}</span>
                  <span className="text-xs text-text-muted">{s.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 py-8 max-w-2xl mx-auto">
          <div className="bg-bg-card/30 rounded-xl p-6 border border-white/5">
            <h2 className="text-lg font-semibold text-cookie-gold mb-3">
              About {zodiac.name} ({zodiac.dateRange})
            </h2>
            <p className="text-sm text-text-secondary leading-relaxed">
              {zodiac.name} is a {zodiac.element.toLowerCase()} sign represented
              by the symbol {zodiac.symbol}. Check back every day for your
              updated daily horoscope reading with personalized love, career, and
              health predictions based on current planetary transits and
              celestial alignments.
            </p>
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
                  name: `${zodiac.name} Daily Horoscope`,
                  item: `${siteUrl}/horoscope/daily/${sign}`,
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
