'use client';

import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'fortune_cookie_collection';

function loadCollection(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return [];
}

function saveCollection(ids: string[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch {}
}

export function useFortuneCollection() {
  const [collectedIds, setCollectedIds] = useState<string[]>([]);

  useEffect(() => {
    setCollectedIds(loadCollection());
  }, []);

  const addToCollection = useCallback((fortuneId: string): boolean => {
    const current = loadCollection();
    if (current.includes(fortuneId)) return false;

    const updated = [...current, fortuneId];
    saveCollection(updated);
    setCollectedIds(updated);
    return true; // is new
  }, []);

  const isCollected = useCallback((fortuneId: string): boolean => {
    return collectedIds.includes(fortuneId);
  }, [collectedIds]);

  return { collectedIds, addToCollection, isCollected, count: collectedIds.length };
}
