/** Funnel events contain no phone numbers, names, booking IDs, or pet details. */
export function trackBookingEvent(event: string, data?: Record<string, number | string>) {
  if (typeof window === 'undefined') return;
  try {
    const umami = (window as Window & { umami?: { track: (name: string, data?: Record<string, number | string>) => unknown } }).umami;
    void Promise.resolve(umami?.track(event, data)).catch(() => {});
  } catch { /* Analytics must never interrupt booking. */ }
}
