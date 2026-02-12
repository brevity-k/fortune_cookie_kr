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

export const metadata: Metadata = {
  title: "Daily Horoscopes & Zodiac Readings | Fortune Cookie",
  description:
    "Read your free daily, weekly, and monthly horoscope for all 12 zodiac signs. Get personalized astrology readings with love, career, and health predictions.",
  keywords: [
    "horoscope today",
    "daily horoscope",
    "zodiac signs",
    "astrology",
    "free horoscope",
    "weekly horoscope",
    "monthly horoscope",
  ],
  openGraph: {
    title: "Daily Horoscopes & Zodiac Readings | Fortune Cookie",
    description:
      "Free daily, weekly, and monthly horoscopes for all 12 zodiac signs. Discover what the stars have in store for you.",
  },
};

function StarRating({ rating, label }: { rating: number; label: string }) {
  return (
    <div className="flex items-center gap-1">
      <span className="text-xs text-text-muted w-14">{label}</span>
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <span
            key={i}
            className={i <= rating ? "text-cookie-gold" : "text-white/10"}
          >
            ★
          </span>
        ))}
      </div>
    </div>
  );
}

export default function HoroscopeHub() {
  const dailyDate = getDailyDate();
  const formattedDate = formatDailyDate(dailyDate);

  return (
    <div className="star-field min-h-dvh flex flex-col">
      <Header />

      <main className="flex-1 pt-14">
        <section className="relative px-4 pt-8 pb-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-3">
              <span className="text-cookie-gold">Daily Horoscopes</span>
            </h1>
            <p className="text-sm text-text-muted mb-2">{formattedDate}</p>
            <p className="text-text-secondary max-w-xl mx-auto">
              Discover what the stars have in store for you. Choose your zodiac
              sign for your personalized daily, weekly, or monthly horoscope
              reading.
            </p>
          </div>
        </section>

        <section className="px-4 py-8">
          <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {ZODIAC_SIGNS.map((sign) => {
              const daily = getDailyHoroscope(sign.key);
              return (
                <Link
                  key={sign.key}
                  href={`/horoscope/daily/${sign.key}`}
                  className="group bg-bg-card/30 rounded-xl p-5 border border-white/5 hover:border-cookie-gold/30 transition-all hover:bg-bg-card/50"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-3xl">{sign.symbol}</span>
                    <div>
                      <h2 className="text-lg font-semibold text-text-primary group-hover:text-cookie-gold transition-colors">
                        {sign.name}
                      </h2>
                      <p className="text-xs text-text-muted">
                        {sign.dateRange}
                      </p>
                    </div>
                    <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-white/5 text-text-muted">
                      {sign.element}
                    </span>
                  </div>

                  {daily && (
                    <>
                      <p className="text-sm text-text-secondary line-clamp-2 mb-3">
                        {daily.text}
                      </p>
                      <div className="space-y-1">
                        <StarRating rating={daily.love} label="Love" />
                        <StarRating rating={daily.career} label="Career" />
                        <StarRating rating={daily.health} label="Health" />
                      </div>
                    </>
                  )}

                  <div className="mt-3 flex gap-2">
                    <span className="text-xs text-cookie-gold/70 group-hover:text-cookie-gold transition-colors">
                      Read full horoscope →
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="px-4 py-6">
          <div className="max-w-4xl mx-auto flex flex-wrap justify-center gap-3">
            {ZODIAC_SIGNS.map((sign) => (
              <div key={sign.key} className="flex gap-1">
                <Link
                  href={`/horoscope/weekly/${sign.key}`}
                  className="text-xs text-text-muted hover:text-cookie-gold transition-colors"
                >
                  {sign.name} Weekly
                </Link>
                <span className="text-white/10">|</span>
                <Link
                  href={`/horoscope/monthly/${sign.key}`}
                  className="text-xs text-text-muted hover:text-cookie-gold transition-colors"
                >
                  Monthly
                </Link>
              </div>
            ))}
          </div>
        </section>

        <section className="px-4 py-8 max-w-3xl mx-auto">
          <div className="bg-bg-card/30 rounded-xl p-6 border border-white/5">
            <h2 className="text-lg font-semibold text-cookie-gold mb-3">
              About Our Horoscopes
            </h2>
            <p className="text-sm text-text-secondary leading-relaxed mb-4">
              Our daily horoscopes are crafted with care, blending traditional
              astrological wisdom with modern interpretations. Each reading
              considers planetary transits, house placements, and elemental
              influences to provide you with meaningful guidance for love,
              career, and health.
            </p>
            <h3 className="text-sm font-semibold text-text-primary mb-2">
              Frequently Asked Questions
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-text-secondary font-medium">
                  How often are horoscopes updated?
                </p>
                <p className="text-xs text-text-muted">
                  Daily horoscopes are refreshed every day. Weekly horoscopes
                  update on Sundays, and monthly horoscopes update on the 1st of
                  each month.
                </p>
              </div>
              <div>
                <p className="text-sm text-text-secondary font-medium">
                  Should I read my Sun sign or Rising sign?
                </p>
                <p className="text-xs text-text-muted">
                  We recommend reading both! Your Sun sign reflects your core
                  identity, while your Rising sign reveals how you present
                  yourself to the world.
                </p>
              </div>
              <div>
                <p className="text-sm text-text-secondary font-medium">
                  Can I also get a fortune cookie reading?
                </p>
                <p className="text-xs text-text-muted">
                  Absolutely! Visit our homepage to break a virtual fortune
                  cookie and receive a personalized fortune message with lucky
                  numbers and colors.
                </p>
              </div>
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
                  item:
                    process.env.NEXT_PUBLIC_SITE_URL ||
                    "https://fortunecookie.ai.kr",
                },
                {
                  "@type": "ListItem",
                  position: 2,
                  name: "Horoscopes",
                  item: `${process.env.NEXT_PUBLIC_SITE_URL || "https://fortunecookie.ai.kr"}/horoscope`,
                },
              ],
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: [
                {
                  "@type": "Question",
                  name: "How often are horoscopes updated?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Daily horoscopes are refreshed every day. Weekly horoscopes update on Sundays, and monthly horoscopes update on the 1st of each month.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Should I read my Sun sign or Rising sign?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "We recommend reading both! Your Sun sign reflects your core identity, while your Rising sign reveals how you present yourself to the world.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Can I also get a fortune cookie reading?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Absolutely! Visit our homepage to break a virtual fortune cookie and receive a personalized fortune message with lucky numbers and colors.",
                  },
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
