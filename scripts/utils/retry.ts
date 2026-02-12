/**
 * Retry utility with exponential backoff for Claude API calls.
 */

const RETRYABLE_STATUS_CODES = [429, 500, 502, 503];
const RETRYABLE_ERROR_TYPES = ['overloaded_error', 'rate_limit_error'];

function isRetryable(error: unknown): boolean {
  if (error instanceof Error) {
    const msg = error.message.toLowerCase();
    if (
      msg.includes('network') ||
      msg.includes('econnreset') ||
      msg.includes('timeout') ||
      msg.includes('fetch failed')
    ) {
      return true;
    }
  }

  const statusCode = (error as { status?: number })?.status;
  if (statusCode && RETRYABLE_STATUS_CODES.includes(statusCode)) return true;

  const errorType = (error as { error?: { type?: string } })?.error?.type;
  if (errorType && RETRYABLE_ERROR_TYPES.includes(errorType)) return true;

  return false;
}

export async function withRetry<T>(
  fn: () => Promise<T>,
  maxAttempts = 3,
  baseDelayMs = 2000
): Promise<T> {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (attempt === maxAttempts || !isRetryable(error)) {
        throw error;
      }
      const delay = baseDelayMs * Math.pow(2, attempt - 1);
      console.log(
        `  ⚠️ API 호출 실패 (시도 ${attempt}/${maxAttempts}). ${delay / 1000}초 후 재시도...`
      );
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
  throw new Error('Unreachable');
}
