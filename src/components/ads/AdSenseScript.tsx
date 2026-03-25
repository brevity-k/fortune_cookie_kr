'use client';

import { useState, useEffect } from 'react';
import Script from 'next/script';
import { useAdsSuppressed } from './AdsContext';

export default function AdSenseScript() {
  const suppressed = useAdsSuppressed();
  const [ready, setReady] = useState(false);

  // Starts false so the script never renders on the initial synchronous pass.
  // React runs children's effects before siblings, so SuppressAds (in children)
  // sets suppressed=true before this effect fires.
  useEffect(() => { setReady(true); }, []);

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
