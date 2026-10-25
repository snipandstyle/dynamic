import { BookingItem } from '../data/catalog';
import { Coupon, evaluateCoupon } from '../data/coupons';
import { query } from './db';

export async function checkoutCoupons(items: BookingItem[], code = '') {
  const result = await query<Coupon>('SELECT * FROM offers WHERE is_active = true AND (valid_until IS NULL OR valid_until >= NOW()) ORDER BY created_at DESC');
  const offers = result.rows.map(offer => ({ ...evaluateCoupon(offer, items), description: offer.description }));
  if (!code) return { offers, applied: undefined };
  const applied = offers.find(offer => offer.code.toUpperCase() === code.trim().toUpperCase());
  if (!applied || !applied.eligible) throw new Error(applied?.reason || 'This coupon is invalid, expired, or no longer available.');
  return { offers, applied };
}
