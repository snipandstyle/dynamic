import { NextResponse } from 'next/server';
import { validateItem, quoteCart } from '../../../../data/catalog';
import { checkoutCoupons } from '../../../../lib/booking-coupons';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!Array.isArray(body.items) || !body.items.length || body.items.length > 20) throw new Error('Add services to your cart first.');
    const items = body.items.map(validateItem);
    const result = await checkoutCoupons(items, String(body.code || '').slice(0, 50));
    return NextResponse.json({ ...result, total: quoteCart(items).total - (result.applied?.discount || 0) }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Coupons could not be loaded. Please retry.' }, { status: 400 });
  }
}
