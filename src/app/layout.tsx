import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import "./globals.css";

const notoSansKr = Noto_Sans_KR({
  variable: "--font-noto-sans-kr",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "포춘쿠키 - 오늘의 운세 | 무료 포춘쿠키 운세",
    template: "%s | 포춘쿠키",
  },
  description:
    "포춘쿠키를 깨고 오늘의 운세를 확인하세요! 사랑운, 재물운, 건강운, 학업운, 대인운 등 다양한 카테고리의 무료 운세를 매일 새롭게 만나보세요.",
  keywords: [
    "포춘쿠키",
    "오늘의 운세",
    "무료 운세",
    "포춘쿠키 운세",
    "오늘의 포춘쿠키",
    "사랑 운세",
    "재물운",
    "건강운",
    "학업운",
    "대인운",
    "일일 운세",
    "운세 보기",
  ],
  authors: [{ name: "포춘쿠키" }],
  openGraph: {
    type: "website",
    locale: "ko_KR",
    siteName: "포춘쿠키",
    title: "포춘쿠키 - 오늘의 운세 | 무료 포춘쿠키 운세",
    description:
      "포춘쿠키를 깨고 오늘의 운세를 확인하세요! 매일 새로운 운세를 무료로 확인하세요.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "포춘쿠키 - 오늘의 운세",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "포춘쿠키 - 오늘의 운세",
    description: "포춘쿠키를 깨고 오늘의 운세를 확인하세요!",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION || "",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        {process.env.NEXT_PUBLIC_ADSENSE_CLIENT && (
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_CLIENT}`}
            crossOrigin="anonymous"
            strategy-hint="lazyOnload"
          />
        )}
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
                `,
              }}
            />
          </>
        )}
      </head>
      <body className={`${notoSansKr.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
