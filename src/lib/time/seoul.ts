/**
 * Convert Asia/Seoul wall-clock date/time into UTC instants using the IANA
 * time zone database bundled with the JS runtime (Intl, full ICU).
 *
 * Korea's offset has not always been UTC+9: it was UTC+8:30 in 1908-1911 and
 * 1954-1961, and observed DST in 1948-1951, 1955-1960 and 1987-1988. A fixed
 * +9h shift (or treating the input as UTC) puts historical birth times off by
 * up to 10 hours, so the offset is always derived from the tz database.
 */

const SEOUL_TZ = 'Asia/Seoul';
const HOUR_MS = 60 * 60 * 1000;

let formatter: Intl.DateTimeFormat | null = null;

function getFormatter(): Intl.DateTimeFormat {
  formatter ??= new Intl.DateTimeFormat('en-US', {
    timeZone: SEOUL_TZ,
    hourCycle: 'h23',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    era: 'short',
  });
  return formatter;
}

/** Offset of Asia/Seoul from UTC (ms, local minus UTC) at the given instant. */
export function seoulOffsetMs(utcMs: number): number {
  const parts: Record<string, string> = {};
  for (const p of getFormatter().formatToParts(new Date(utcMs))) parts[p.type] = p.value;
  let year = Number(parts.year);
  if (parts.era === 'BC' || parts.era === 'B') year = 1 - year;
  const wall = Date.UTC(
    year,
    Number(parts.month) - 1,
    Number(parts.day),
    Number(parts.hour),
    Number(parts.minute),
    Number(parts.second),
  );
  // Formatting drops milliseconds; compare against the instant floored to the second.
  return wall - Math.floor(utcMs / 1000) * 1000;
}

/**
 * Interpret a wall-clock time in Asia/Seoul and return the UTC instant.
 * `month` is 1-12.
 *
 * Ambiguous/nonexistent local times around offset changes are resolved like
 * Temporal's 'compatible' disambiguation:
 * - overlap (clocks set back, local time occurs twice): the earlier instant;
 * - gap (clocks set forward, local time never occurs): the offset in effect
 *   before the transition, which lands the same distance past the gap.
 */
export function seoulWallTimeToUtc(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
): Date {
  const wallMs = Date.UTC(year, month - 1, day, hour, minute);
  // Offset changes in Asia/Seoul are months apart, so +/-1 day brackets at most one.
  const offsetBefore = seoulOffsetMs(wallMs - 24 * HOUR_MS);
  const offsetAfter = seoulOffsetMs(wallMs + 24 * HOUR_MS);

  const valid = [offsetBefore, offsetAfter]
    .map((offset) => wallMs - offset)
    .filter((utcMs) => utcMs + seoulOffsetMs(utcMs) === wallMs);

  if (valid.length > 0) return new Date(Math.min(...valid));
  return new Date(wallMs - offsetBefore);
}
