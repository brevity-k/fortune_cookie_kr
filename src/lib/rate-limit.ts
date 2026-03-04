import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

/** Saju AI: 10 requests per day per IP. null if Upstash not configured. */
export const sajuAIRatelimit: Ratelimit | null = (() => {
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    return null;
  }
  return new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(10, '1 d'),
    prefix: 'ratelimit:saju-ai',
    ephemeralCache: new Map(),
  });
})();
