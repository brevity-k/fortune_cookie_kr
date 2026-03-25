'use client';

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

interface AdsContextValue {
  suppressed: boolean;
  suppress: () => void;
}

const AdsContext = createContext<AdsContextValue>({
  suppressed: false,
  suppress: () => {},
});

export function AdsProvider({ children }: { children: ReactNode }) {
  const [suppressed, setSuppressed] = useState(false);
  return (
    <AdsContext.Provider value={{ suppressed, suppress: () => setSuppressed(true) }}>
      {children}
    </AdsContext.Provider>
  );
}

export function useAdsSuppressed() {
  return useContext(AdsContext).suppressed;
}

/**
 * Drop this component into any page that should NOT show ads.
 * It signals the AdsProvider to suppress the AdSense script.
 */
export function SuppressAds() {
  const { suppress } = useContext(AdsContext);
  useEffect(() => {
    suppress();
  }, [suppress]);
  return null;
}
