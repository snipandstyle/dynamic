"use client";
import React, { useEffect, useRef, useState } from 'react';
import { Icon } from './BookingUI';
import { trackBookingEvent } from '../../utils/booking-analytics';

type Offer = { code: string; title: string; description: string; valid_until?: string };
const CAPTURED = 'snip_offer_lead_saved_v2';
const DISMISSED = 'snip_offer_dismissed_v2';
export default function UnlockOffersModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [phone, setPhone] = useState('');
  const [offers, setOffers] = useState<Offer[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [error, setError] = useState('');
  const card = useRef<HTMLDivElement>(null);
  function close() {
    setIsOpen(false);
    try { sessionStorage.setItem(DISMISSED, '1'); } catch { /* Browsing remains available. */ }
  }
  useEffect(() => {
    const open = () => { setError(''); setIsOpen(true); };
    window.addEventListener('snip_open_offers', open);
    let timer: ReturnType<typeof setTimeout> | undefined;
    try {
      if (!localStorage.getItem(CAPTURED) && !sessionStorage.getItem(DISMISSED)) timer = setTimeout(() => { if (!document.querySelector('[role="dialog"]')) open(); }, 6000);
    } catch { timer = setTimeout(open, 6000); }
    return () => { clearTimeout(timer); window.removeEventListener('snip_open_offers', open); };
  }, []);
  useEffect(() => {
    if (!isOpen) return;
    trackBookingEvent('offers_popup_view');
    const controller = new AbortController();
    void fetch('/api/offers', { cache: 'no-store', signal: controller.signal }).then(async response => {
      if (!response.ok) throw new Error('Offers are temporarily unavailable. You can still browse and book.');
      const data = await response.json();
      setOffers((data.offers || []).filter((offer: Offer) => !offer.valid_until || new Date(offer.valid_until).getTime() >= Date.now()));
    }).catch(err => { if (!controller.signal.aborted) setError(err.message); });
    const previous = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    card.current?.querySelector<HTMLElement>('button')?.focus();
    const keydown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close();
      if (event.key === 'Tab') {
        const controls = card.current?.querySelectorAll<HTMLElement>('button:not(:disabled), input, a[href]');
        if (!controls?.length) return;
        const first = controls[0], last = controls[controls.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener('keydown', keydown);
    return () => { controller.abort(); document.body.style.overflow = overflow; document.removeEventListener('keydown', keydown); previous?.focus(); };
  }, [isOpen]);
  async function submit(event: React.FormEvent) {
    event.preventDefault();
    const cleanPhone = phone.replace(/\D/g, '');
    if (!/^[6-9]\d{9}$/.test(cleanPhone)) { setError('Enter a valid 10-digit Indian mobile number.'); return; }
    setSubmitting(true); setError('');
    try {
      const response = await fetch('/api/checkout/draft', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, signal: AbortSignal.timeout(15000),
        body: JSON.stringify({ phone: cleanPhone, status: 'draft', lastStep: 'landing_offer_unlock', notes: 'Offer enquiry submitted on ' + window.location.pathname }),
      });
      const result = await response.json();
      if (!response.ok || !result.success || !result.id) throw new Error('We couldn’t save your number. Please retry, or continue browsing.');
      try { localStorage.setItem(CAPTURED, '1'); localStorage.setItem('snip_user_phone', cleanPhone); } catch { /* The lead is already saved on the server. */ }
      setUnlocked(true); trackBookingEvent('offer_lead_saved');
    } catch (err) { setError(err instanceof Error ? err.message : 'Could not save your number. Please retry.'); trackBookingEvent('offer_lead_failed'); }
    finally { setSubmitting(false); }
  }
  if (!isOpen) return null;
  return <div className="ref-lead-overlay" role="dialog" aria-modal="true" aria-labelledby="lead-modal-title" onClick={close}>
    <div className="ref-lead-card ref-lead-compact" ref={card} onClick={event => event.stopPropagation()}>
      <button type="button" className="ref-lead-close" aria-label="Close offer modal" onClick={close}>×</button>
      <div className="ref-lead-picture"><img src="/images/generated/pet-happy-place.webp" alt="Happy dogs and a cat relaxing together" width={680} height={240}/><span><Icon name="sparkle" size={12}/> A little treat, on us</span></div>
      <div className="ref-lead-compact-body">
      <div className="ref-lead-header"><h3 id="lead-modal-title">{unlocked ? 'Your offers are unlocked!' : 'Happy pets. Lovely offers.'}</h3><p>{unlocked ? 'Your number is saved. Use eligible codes at checkout.' : 'Unlock grooming & stay offers with your number.'}</p></div>
      {unlocked && <div className="ref-lead-code-chips">{offers.map(offer => <code key={offer.code} title={offer.title}>{offer.code}</code>)}</div>}
      {error && <p className="ref-lead-error" role="alert">{error}</p>}
      {!unlocked ? <form onSubmit={submit} className="ref-lead-form">
        <label htmlFor="offer-phone">Mobile / WhatsApp number</label><div className="ref-lead-input-wrap"><span className="ref-lead-prefix">+91</span><input id="offer-phone" type="tel" inputMode="numeric" autoComplete="tel-national" maxLength={10} placeholder="10-digit mobile number" value={phone} onChange={event => setPhone(event.target.value.replace(/\D/g, '').slice(0, 10))} required /></div>
        <button type="submit" className="ref-lead-submit-btn" disabled={submitting}>{submitting ? 'Saving your enquiry…' : 'Unlock offers →'}</button>
        <p className="ref-lead-guarantee">By submitting, you agree to studio contact about your enquiry &amp; offers. <a href="/privacy">Privacy</a></p>
        <button type="button" className="pet-edit-link" onClick={close}>Continue browsing</button>
      </form> : <><span className="pet-small" role="status">Enquiry saved ✓</span><button type="button" className="ref-lead-submit-btn" onClick={() => { close(); document.getElementById('grooming-packages')?.scrollIntoView({ behavior: 'smooth' }); }}>Explore grooming →</button><button type="button" className="pet-edit-link" onClick={() => { close(); document.getElementById('boarding-packages')?.scrollIntoView({ behavior: 'smooth' }); }}>Explore boarding →</button></>}
      </div>
    </div>
  </div>;
}
