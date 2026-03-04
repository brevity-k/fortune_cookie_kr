import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

function createRatelimit(prefix: string, requests: number, window: Parameters<typeof Ratelimit.slidingWindow>[1]) {
  return new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(requests, window),
    prefix: `ratelimit:${prefix}`,
    ephemeralCache: new Map(),
  });
}

/** Saju AI: 10 requests per day per IP */
export const sajuAIRatelimit = createRatelimit('saju-ai', 10, '1 d');
