/**
 * Analytics and UTM tracking utility for ad campaigns
 */

export interface UTMParams {
  source?: string;
  medium?: string;
  campaign?: string;
  term?: string;
  content?: string;
  adSet?: string;
}

const UTM_STORAGE_KEY = 'snip_style_utm';

/**
 * Parses UTM parameters from the current URL and persists them in sessionStorage.
 */
export function getUTMParams(): UTMParams {
  if (typeof window === 'undefined') return {};

  try {
    const searchParams = new URLSearchParams(window.location.search);
    const hasUtm = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'].some(key =>
      searchParams.has(key)
    );

    if (hasUtm) {
      const utm: UTMParams = {
        source: searchParams.get('utm_source') || undefined,
        medium: searchParams.get('utm_medium') || undefined,
        campaign: searchParams.get('utm_campaign') || undefined,
        term: searchParams.get('utm_term') || undefined,
        content: searchParams.get('utm_content') || undefined,
        adSet: searchParams.get('utm_id') || undefined,
      };
      sessionStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(utm));
      return utm;
    }

    const saved = sessionStorage.getItem(UTM_STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Error parsing UTM parameters:', e);
  }

  return {};
}

/**
 * Checks if the current visitor arrived from a paid ad or campaign link.
 */
export function isAdVisitor(): boolean {
  if (typeof window === 'undefined') return false;
  const searchParams = new URLSearchParams(window.location.search);
  const pathname = window.location.pathname.toLowerCase();

  return (
    searchParams.has('ad') ||
    searchParams.get('page') === 'boarding' ||
    searchParams.get('landing') === 'boarding' ||
    searchParams.has('utm_source') ||
    searchParams.has('gclid') ||
    searchParams.has('fbclid') ||
    pathname.includes('/boarding')
  );
}

/**
 * Fires an event to Meta Pixel, Google Analytics (gtag), or custom DOM events.
 */
export function trackEvent(eventName: string, data?: Record<string, unknown>) {
  if (typeof window === 'undefined') return;

  // Custom DOM event for GTM or listeners
  const customEvent = new CustomEvent(`snip_${eventName}`, { detail: data });
  window.dispatchEvent(customEvent);

  // Meta Pixel (fbq) if installed
  if (typeof (window as unknown as { fbq?: (...args: unknown[]) => void }).fbq === 'function') {
    (window as unknown as { fbq: (...args: unknown[]) => void }).fbq('trackCustom', eventName, data);
  }

  // Google Analytics / Gtag if installed
  if (typeof (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag === 'function') {
    (window as unknown as { gtag: (...args: unknown[]) => void }).gtag('event', eventName, data);
  }
}
