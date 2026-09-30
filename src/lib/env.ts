// Centralized environment configuration.

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://fortunecookie.ai.kr';

function getValidatedEnv(key: string, prefix: string): string | null {
  const value = process.env[key];
  if (!value) return null;
  if (!value.startsWith(prefix)) {
    console.error(`Invalid ${key}: expected prefix "${prefix}"`);
    return null;
  }
  return value;
}

export function getAnthropicKey(): string | null {
  return getValidatedEnv('ANTHROPIC_API_KEY', 'sk-ant-');
}

export function getResendKey(): string | null {
  return getValidatedEnv('RESEND_API_KEY', 're_');
}
