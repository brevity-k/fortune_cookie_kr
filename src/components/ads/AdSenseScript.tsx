'use client';

import { useState, useEffect } from 'react';
import Script from 'next/script';
import { useAdsSuppressed } from './AdsContext';

export default function AdSenseScript() {
  const suppressed = useAdsSuppressed();
  const [ready, setReady] = useState(false);

  // Delay one tick so SuppressAds (which fires in useEffect) can run first
  useEffect(() => {
    const id = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(id);
  }, []);

  if (!process.env.NEXT_PUBLIC_ADSENSE_CLIENT || !ready || suppressed) {
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
