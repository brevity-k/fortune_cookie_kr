import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

function createRatelimit(prefix: string, requests: number, window: string): Ratelimit | null {
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    return null;
  }
  return new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(requests, window as '1 d'),
    prefix,
    ephemeralCache: new Map(),
  });
}

/** Saju AI: 10 requests per day per IP. null if Upstash not configured. */
export const sajuAIRatelimit = createRatelimit('ratelimit:saju-ai', 10, '1 d');

/** Premium fortune: 30 requests per day per user. null if Upstash not configured. */
export const premiumFortuneRatelimit = createRatelimit('ratelimit:premium-fortune', 30, '1 d');
