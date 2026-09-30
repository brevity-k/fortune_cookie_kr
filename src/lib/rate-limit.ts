import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

export interface RateLimiter {
  limit(identifier: string): Promise<{ success: boolean; reset: number }>;
}

const WINDOW_MS = { '1 h': 60 * 60 * 1000, '1 d': 24 * 60 * 60 * 1000 } as const;
type Window = keyof typeof WINDOW_MS;

const MAX_TRACKED_IPS = 10_000;

/**
 * Per-instance fixed-window fallback used when Upstash is not configured.
 * Weaker than Redis (each function instance counts separately), but the paid
 * routes are never left unthrottled and never go down for missing config.
 */
function createMemoryLimiter(requests: number, windowMs: number): RateLimiter {
  const hits = new Map<string, { count: number; reset: number }>();
  return {
    async limit(identifier) {
      const now = Date.now();
      let entry = hits.get(identifier);
      if (!entry || entry.reset <= now) {
        if (hits.size >= MAX_TRACKED_IPS) {
          for (const [key, value] of hits) if (value.reset <= now) hits.delete(key);
          if (hits.size >= MAX_TRACKED_IPS) hits.clear();
        }
        entry = { count: 0, reset: now + windowMs };
        hits.set(identifier, entry);
      }
      entry.count += 1;
      return { success: entry.count <= requests, reset: entry.reset };
    },
  };
}

function createLimiter(requests: number, window: Window, prefix: string): RateLimiter {
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    if (process.env.NODE_ENV === 'production') {
      console.warn(`[rate-limit] Upstash not configured; using in-memory limiter for ${prefix}`);
    }
    return createMemoryLimiter(requests, WINDOW_MS[window]);
  }
  return new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(requests, window),
    prefix,
    ephemeralCache: new Map(),
  });
}

/** Saju + astro AI interpretation: 10 requests per day per IP (shared pool). */
export const sajuAIRatelimit = createLimiter(10, '1 d', 'ratelimit:saju-ai');

/** Contact form: 5 requests per hour per IP. */
export const contactRatelimit = createLimiter(5, '1 h', 'ratelimit:contact');
