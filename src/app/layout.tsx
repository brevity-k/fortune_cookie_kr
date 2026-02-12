import type { Metadata, Viewport } from "next";
import { Noto_Sans_KR } from "next/font/google";
import KakaoScript from "@/components/KakaoScript";
import "./globals.css";

const notoSansKr = Noto_Sans_KR({
  variable: "--font-noto-sans-kr",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: '#1A0F2E',
  viewportFit: 'cover',
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://fortunecookie.ai.kr"),
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
  },
  twitter: {
    card: "summary_large_image",
    title: "포춘쿠키 - 오늘의 운세",
    description: "포춘쿠키를 깨고 오늘의 운세를 확인하세요!",
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    google: "0Qs_NRonZJTlJQzm_7gdXWtg4Kgxtwba6UIE71qvgbE",
    other: {
      "naver-site-verification": ["a559aa985e044be33ec42400206408dc4327ae22"],
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" translate="no">
      <head>
        <meta name="google" content="notranslate" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: '포춘쿠키 - 오늘의 운세',
              url: process.env.NEXT_PUBLIC_SITE_URL || 'https://fortunecookie.ai.kr',
              description: '포춘쿠키를 깨고 오늘의 운세를 확인하세요! 사랑운, 재물운, 건강운, 학업운, 대인운 등 다양한 카테고리의 무료 운세를 매일 새롭게 만나보세요.',
              inLanguage: 'ko',
              potentialAction: {
                '@type': 'SearchAction',
                target: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://fortunecookie.ai.kr'}/fortune/{category}`,
                'query-input': 'required name=category',
              },
            }),
          }}
        />
        {process.env.NEXT_PUBLIC_ADSENSE_CLIENT && (
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_CLIENT}`}
            crossOrigin="anonymous"
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
        <KakaoScript />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js');
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
