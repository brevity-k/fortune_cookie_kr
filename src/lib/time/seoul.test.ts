import { describe, expect, it } from 'vitest';
import { seoulOffsetMs, seoulWallTimeToUtc } from './seoul';

const iso = (y: number, mo: number, d: number, h: number, mi: number) =>
  seoulWallTimeToUtc(y, mo, d, h, mi).toISOString();

// Cross-check against the runtime tz database, not hard-coded assumptions.
function tzdbOffset(isoUtc: string): string {
  const fmt = new Intl.DateTimeFormat('en-US', { timeZone: 'Asia/Seoul', timeZoneName: 'longOffset' });
  return fmt.formatToParts(new Date(isoUtc)).find((p) => p.type === 'timeZoneName')!.value;
}

describe('seoulWallTimeToUtc', () => {
  it('converts a modern KST time (UTC+9)', () => {
    expect(iso(1995, 6, 15, 14, 30)).toBe('1995-06-15T05:30:00.000Z');
    expect(tzdbOffset('1995-06-15T05:30:00Z')).toBe('GMT+09:00');
  });

  it('applies 1988 Korean DST (UTC+10)', () => {
    expect(iso(1988, 7, 1, 12, 0)).toBe('1988-07-01T02:00:00.000Z');
    expect(tzdbOffset('1988-07-01T02:00:00Z')).toBe('GMT+10:00');
  });

  it('applies the 1954-1961 UTC+8:30 standard time', () => {
    expect(iso(1960, 1, 1, 12, 0)).toBe('1960-01-01T03:30:00.000Z');
    expect(tzdbOffset('1960-01-01T03:30:00Z')).toBe('GMT+08:30');
  });

  it('applies 1950s summer time (UTC+9:30)', () => {
    expect(iso(1958, 7, 1, 12, 0)).toBe('1958-07-01T02:30:00.000Z');
  });

  it('crosses the UTC date boundary', () => {
    expect(iso(2000, 1, 1, 0, 0)).toBe('1999-12-31T15:00:00.000Z');
  });

  it('resolves a DST gap with the pre-transition offset (1987-05-10 02:30 does not exist)', () => {
    // Clocks jumped 02:00 -> 03:00; 02:30 is read as +09:00, i.e. 03:30 KDT.
    expect(iso(1987, 5, 10, 2, 30)).toBe('1987-05-09T17:30:00.000Z');
  });

  it('resolves a DST overlap with the earlier instant (1987-10-11 02:30 occurs twice)', () => {
    expect(iso(1987, 10, 11, 2, 30)).toBe('1987-10-10T16:30:00.000Z');
    expect(iso(1987, 10, 11, 3, 0)).toBe('1987-10-10T18:00:00.000Z');
  });

  it('round-trips every hour of a DST year back to the same wall time', () => {
    for (let t = Date.UTC(1987, 0, 1); t < Date.UTC(1988, 0, 1); t += 3 * 60 * 60 * 1000 + 17 * 60 * 1000) {
      const minute = Math.floor(t / 60000) * 60000;
      const wall = new Date(minute + seoulOffsetMs(minute));
      const back = seoulWallTimeToUtc(
        wall.getUTCFullYear(), wall.getUTCMonth() + 1, wall.getUTCDate(), wall.getUTCHours(), wall.getUTCMinutes()
      );
      // Only ambiguous (overlap) wall times may map to a different, earlier instant.
      expect(back.getTime()).toBeLessThanOrEqual(minute);
      expect(back.getTime() + seoulOffsetMs(back.getTime())).toBe(wall.getTime());
    }
  });
});
