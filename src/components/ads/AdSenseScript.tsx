'use client';

import Script from 'next/script';

export default function AdSenseScript() {
  if (!process.env.NEXT_PUBLIC_ADSENSE_CLIENT) {
    return null;
  }

  return (
    <Script
      id="adsense"
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_CLIENT}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
}
