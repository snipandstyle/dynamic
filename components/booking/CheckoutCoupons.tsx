"use client";
import React, { useEffect, useState } from 'react';
import { BookingItem, money } from '../../data/catalog';
import { CouponResult } from '../../data/coupons';

export default function CheckoutCoupons({ items, applied, onApply, disabled }: {
  items: BookingItem[]; applied?: CouponResult; onApply: (coupon: CouponResult | undefined) => void; disabled: boolean;
}) {
  const [offers, setOffers] = useState<(CouponResult & { description: string })[]>([]);
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [reload, setReload] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    onApply(undefined);
    setBusy(true);
    setError('');
    fetch('/api/booking/coupons', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ items }), signal: controller.signal })
      .then(async response => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error);
        setOffers(data.offers);
      }).catch(err => { if (!controller.signal.aborted) setError(err instanceof Error ? err.message : 'Could not load coupons.'); })
      .finally(() => { if (!controller.signal.aborted) setBusy(false); });
    return () => controller.abort();
  }, [items, onApply, reload]);
  async function apply(value: string) {
    setBusy(true); setError('');
    try {
      const response = await fetch('/api/booking/coupons', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ items, code: value }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      onApply(data.applied); setCode('');
    } catch (err) { setError(err instanceof Error ? err.message : 'Could not apply coupon.'); }
    finally { setBusy(false); }
  }
  return <section className="pet-coupons" aria-label="Checkout coupons">
    <h3>Offers & coupons</h3>
    <p className="pet-small pet-muted">Choose one coupon. Your automatic boarding rewards stay included.</p>
    {applied && <div className="pet-coupon-applied" role="status"><strong>{applied.code}</strong> · {applied.discount ? `${money(applied.discount)} saved` : applied.reason}<button type="button" disabled={disabled || busy} onClick={() => onApply(undefined)}>Remove</button></div>}
    <div className="pet-coupon-entry"><input aria-label="Coupon code" placeholder="Enter coupon code" value={code} disabled={disabled || busy} onChange={e => setCode(e.target.value.toUpperCase())}/><button type="button" className="pet-button pet-button-light" disabled={disabled || busy || !code.trim()} onClick={() => void apply(code)}>Apply</button></div>
    {busy && <p role="status" className="pet-small">Checking offers…</p>}
    {error && <p role="alert" className="pet-error">{error} <button type="button" disabled={disabled || busy} onClick={() => setReload(value => value + 1)}>Retry</button></p>}
    {offers.map(offer => <article key={offer.code} className="pet-coupon-card"><div><strong>{offer.code}</strong><h4>{offer.title}</h4><p>{offer.description}</p><small>{offer.reason}</small></div><button type="button" disabled={disabled || busy || !offer.eligible || offer.automatic || applied?.code === offer.code} onClick={() => void apply(offer.code)}>{offer.automatic ? 'Included' : applied?.code === offer.code ? 'Applied' : 'Apply'}</button></article>)}
    {!busy && !error && !offers.length && <p className="pet-small">No additional coupons are available right now. Advertised prices and automatic rewards still apply.</p>}
  </section>;
}
