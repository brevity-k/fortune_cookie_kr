export function trackEvent(action: string, category: string, label?: string) {
  if (typeof window === 'undefined') return;

  const gtag = (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag;
  if (gtag) {
    gtag('event', action, {
      event_category: category,
      event_label: label,
    });
  }
}

export function trackCookieBreak(method: string) {
  trackEvent('cookie_break', 'interaction', method);
}

export function trackFortuneReveal(category: string) {
  trackEvent('fortune_reveal', 'fortune', category);
}

export function trackShare(platform: string) {
  trackEvent('share', 'social', platform);
}
