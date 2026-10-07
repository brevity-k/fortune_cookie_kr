'use client';

import { createContext, useContext, useState, useEffect, useCallback, useMemo, type ReactNode } from 'react';

interface AdsContextValue {
  suppressed: boolean;
  suppress: () => void;
  unsuppress: () => void;
}

const AdsContext = createContext<AdsContextValue>({
  suppressed: false,
  suppress: () => {},
  unsuppress: () => {},
});

export function AdsProvider({ children }: { children: ReactNode }) {
  const [suppressed, setSuppressed] = useState(false);
  const suppress = useCallback(() => setSuppressed(true), []);
  const unsuppress = useCallback(() => setSuppressed(false), []);
  const value = useMemo(() => ({ suppressed, suppress, unsuppress }), [suppressed, suppress, unsuppress]);

  return <AdsContext.Provider value={value}>{children}</AdsContext.Provider>;
}

export function useAdsSuppressed() {
  return useContext(AdsContext).suppressed;
}

export function SuppressAds() {
  const { suppress, unsuppress } = useContext(AdsContext);
  // The provider lives in the root layout, so lift suppression when navigating away.
  useEffect(() => {
    suppress();
    return unsuppress;
  }, [suppress, unsuppress]);
  return null;
}
