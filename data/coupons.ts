import { BookingItem, quoteCart } from './catalog';

export type Coupon = {
  code: string; title: string; description: string; is_active: boolean;
  valid_until?: string | null; discount_type: string; discount_percent?: number | string;
  discount_amount?: number | string; max_discount_amount?: number | string | null;
  min_order_amount?: number | string; min_nights?: number | string; min_days?: number | string;
  applicable_category?: string; free_package_name?: string | null;
};
export type CouponResult = { code: string; title: string; eligible: boolean; reason: string; discount: number; automatic: boolean; benefit?: string };

export function evaluateCoupon(offer: Coupon, items: BookingItem[], now = Date.now()): CouponResult {
  const quote = quoteCart(items);
  const category = offer.applicable_category || 'all';
  const lines = quote.lines.filter(line => category === 'all' || line.item.category === category);
  const subtotal = lines.reduce((sum, line) => sum + line.total, 0);
  const nights = Number(offer.min_nights || (category === 'boarding' ? offer.min_days : 0) || 0);
  const base = { code: offer.code, title: offer.title, eligible: false, reason: '', discount: 0, automatic: false };
  if (!offer.is_active || (offer.valid_until && new Date(offer.valid_until).getTime() < now)) return { ...base, reason: 'This coupon has expired or is inactive.' };
  if (!lines.length) return { ...base, reason: `Add an eligible ${category === 'all' ? 'service' : category + ' service'} to use this coupon.` };
  if (subtotal < Number(offer.min_order_amount || 0)) return { ...base, reason: `Requires ₹${Number(offer.min_order_amount).toLocaleString('en-IN')} in eligible services.` };
  if (nights && !lines.some(line => line.item.category === 'boarding' && line.item.nights >= nights)) return { ...base, reason: `Requires a boarding stay of at least ${nights} nights.` };
  if (offer.code.toUpperCase() === 'STAY6FREE1') return { ...base, eligible: true, automatic: true, reason: 'Your free boarding night is already included in the total.' };
  if (offer.discount_type === 'free_package') {
    const automatic = offer.code.toUpperCase() === 'FREESPA' && lines.some(line => !!line.perk);
    return { ...base, eligible: true, automatic, benefit: offer.free_package_name || offer.title, reason: automatic ? 'Your complimentary departure grooming is already included.' : 'Complimentary treatment included with this booking.' };
  }
  const percent = Number(offer.discount_percent || 0);
  let discount = offer.discount_type === 'percentage' ? subtotal * Math.min(100, Math.max(0, percent)) / 100 : Math.max(0, Number(offer.discount_amount || 0));
  if (offer.max_discount_amount != null && Number(offer.max_discount_amount) > 0) discount = Math.min(discount, Number(offer.max_discount_amount));
  discount = Math.min(subtotal, Math.round(discount * 100) / 100);
  if (!Number.isFinite(discount) || discount <= 0) return { ...base, reason: 'This coupon does not provide a discount for this cart.' };
  return { ...base, eligible: true, discount, reason: 'Available for this booking.' };
}
