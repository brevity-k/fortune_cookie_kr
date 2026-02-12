'use client';

import Script from 'next/script';

export default function KakaoScript() {
  const kakaoKey = process.env.NEXT_PUBLIC_KAKAO_KEY;
  if (!kakaoKey) return null;

  return (
    <Script
      src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.4/kakao.min.js"
      strategy="afterInteractive"
      onLoad={() => {
        if (window.Kakao && !window.Kakao.isInitialized()) {
          try {
            window.Kakao.init(kakaoKey);
          } catch (error) {
            console.error('[KakaoScript] Initialization failed:', error);
          }
        }
      }}
      onError={(e) => {
        console.error('[KakaoScript] SDK failed to load:', e);
      }}
    />
  );
}
