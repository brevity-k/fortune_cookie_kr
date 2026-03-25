'use client';

import { createContext, useContext, useState, useEffect, useCallback, useMemo, type ReactNode } from 'react';

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
  const suppress = useCallback(() => setSuppressed(true), []);
  const value = useMemo(() => ({ suppressed, suppress }), [suppressed, suppress]);

  return <AdsContext.Provider value={value}>{children}</AdsContext.Provider>;
}

export function useAdsSuppressed() {
  return useContext(AdsContext).suppressed;
}

export function SuppressAds() {
  const { suppress } = useContext(AdsContext);
  useEffect(() => { suppress(); }, [suppress]);
  return null;
}
