/**
 * Centralized localStorage key definitions.
 * All keys MUST use this constant to prevent typos and enable easy auditing.
 * Format: fortune_cookie_{feature}
 */
export const STORAGE_KEYS = {
  DAILY_FORTUNE: 'fortune_cookie_daily',
  STREAK: 'fortune_cookie_streak',
  COLLECTION: 'fortune_cookie_collection',
  MUTED: 'fortune_cookie_muted',
} as const;
