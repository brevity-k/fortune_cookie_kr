/**
 * Shared date utilities for consistent date string formatting.
 *
 * IMPORTANT: The format YYYY-M-D (no zero-padding) is used throughout the app
 * for localStorage keys and daily fortune seeding. Do NOT change this format
 * as it would break existing user state.
 */

export function getTodayString(): string {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

export function getYesterdayString(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}
