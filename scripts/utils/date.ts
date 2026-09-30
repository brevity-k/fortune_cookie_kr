/**
 * Date helpers pinned to KST.
 *
 * GitHub Actions runners use UTC, and the daily crons fire at 21:00/23:00 UTC
 * (06:00/08:00 KST the next day) — local time would label content a day early.
 */
export function getKstDateParts(): { year: number; month: number; day: number } {
  const kst = new Date(Date.now() + 9 * 60 * 60 * 1000);
  return { year: kst.getUTCFullYear(), month: kst.getUTCMonth() + 1, day: kst.getUTCDate() };
}

/** Today's date in KST as YYYY-MM-DD. */
export function getTodayDateKST(): string {
  const { year, month, day } = getKstDateParts();
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}
