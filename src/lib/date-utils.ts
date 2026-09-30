/**
 * Shared date utilities for consistent date string formatting.
 *
 * IMPORTANT: The format YYYY-M-D (no zero-padding) is used throughout the app
 * for localStorage keys and daily fortune seeding. Do NOT change this format
 * as it would break existing user state.
 *
 * Dates are computed in KST (UTC+9, no DST) rather than the runtime's local
 * zone: server actions run in UTC on Vercel, so local time would make the
 * server's "today" lag Korean users' "today" from 00:00 to 09:00 KST.
 */

const KST_OFFSET_MS = 9 * 60 * 60 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;

function kstDateString(dayOffset: number): string {
  const d = new Date(Date.now() + KST_OFFSET_MS + dayOffset * DAY_MS);
  return `${d.getUTCFullYear()}-${d.getUTCMonth() + 1}-${d.getUTCDate()}`;
}

export function getTodayString(): string {
  return kstDateString(0);
}

export function getYesterdayString(): string {
  return kstDateString(-1);
}
