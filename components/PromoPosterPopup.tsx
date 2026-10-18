import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface PromoPosterPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyAndBook: () => void;
}

export const PromoPosterPopup: React.FC<PromoPosterPopupProps> = ({
  isOpen,
  onClose,
  onApplyAndBook,
}) => {
  const [phoneInput, setPhoneInput] = useState('');
  const [petNameInput, setPetNameInput] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [phoneError, setPhoneError] = useState('');

  // Check if visitor has already unlocked previously
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const existing = localStorage.getItem('snip_visitor_phone');
      if (existing && existing.length >= 10) {
        setPhoneInput(existing);
        setIsUnlocked(true);
      }
    }
  }, []);

  if (!isOpen) return null;

  const handleUnlockOffers = async (e: React.FormEvent) => {
    e.preventDefault();
    setPhoneError('');
    const clean = phoneInput.replace(/\D/g, '').slice(-10);

    if (clean.length < 10) {
      setPhoneError('Please enter a valid 10-digit mobile number.');
      return;
    }

    setIsSubmitting(true);
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('snip_visitor_phone', clean);
        if (petNameInput.trim()) {
          localStorage.setItem('snip_visitor_pet', petNameInput.trim());
        }
      }

      // Real-time lead capture to Neon DB & Admin Dashboard
      await fetch('/api/checkout/draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: clean,
          petName: petNameInput.trim() || 'Companion',
          serviceSummary: 'Unlocked Dasara Offers (STAY6FREE1 + GROOM10)',
          totalAmount: 625,
          status: 'draft',
          lastStep: 'welcome_popup_unlocked',
          notes: 'Visitor unlocked Dasara Festival Passes on landing popup',
        }),
      });

      setIsUnlocked(true);
    } catch (err) {
      console.warn('Draft lead sync notice:', err);
      setIsUnlocked(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClaimAndProceed = () => {
    const clean = phoneInput.replace(/\D/g, '').slice(-10);
    if (clean.length === 10 && typeof window !== 'undefined') {
      localStorage.setItem('snip_visitor_phone', clean);
    }
    onApplyAndBook();
  };

  return (
    <div className="fixed inset-0 z-[190] flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 15 }}
        className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-black/10 relative text-left"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-30 size-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black transition-colors cursor-pointer"
          aria-label="Close offer popup"
        >
          <span className="material-symbols-outlined text-sm">close</span>
        </button>

        {/* Realistic Festive Dasara Banner Header */}
        <div className="relative h-48 sm:h-56 w-full overflow-hidden bg-sanctuary-forest">
          <img
            src="/images/banner_dasara_hero.jpg"
            alt="Dasara Festival Pet Offers Snip & Style"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

          <div className="absolute bottom-3 left-4 right-4 z-10 text-white space-y-1">
            <div className="inline-flex items-center gap-1.5 bg-amber-500 text-sanctuary-dark text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
              <span className="size-1.5 rounded-full bg-white animate-pulse" />
              <span>🪔 DASARA FESTIVAL MEGA OFFERS</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black leading-tight text-white drop-shadow-sm">
              Unlock Your Exclusive Festival Deals!
            </h3>
            <p className="text-[11px] text-white/90 font-medium leading-relaxed">
              Kanakapura Main Road Studio & Resort • 100% Cage-Free
            </p>
          </div>
        </div>

        {/* Popup Body */}
        <div className="p-4 sm:p-6 space-y-3.5">
          {!isUnlocked ? (
            /* LEAD CAPTURE FORM TO UNLOCK OFFERS */
            <form onSubmit={handleUnlockOffers} className="space-y-3">
              <div className="p-3 bg-amber-50/80 rounded-2xl border border-amber-300/80 space-y-1">
                <div className="text-xs font-black text-amber-950 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-amber-600 text-sm">local_activity</span>
                  <span>Enter WhatsApp Number to Claim Vouchers:</span>
                </div>
                <div className="grid grid-cols-2 gap-1.5 pt-1 text-[10px] font-bold text-amber-900">
                  <span className="bg-white/90 p-1.5 rounded-lg border border-amber-200">
                    🎁 <strong>1 Day FREE Boarding</strong> (6+ Nts)
                  </span>
                  <span className="bg-white/90 p-1.5 rounded-lg border border-amber-200">
                    ✂️ <strong>10% OFF Grooming</strong> (&gt; ₹999)
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-wider text-sanctuary-dark/70 block mb-1">
                    Your Mobile Number (WhatsApp Verified) *
                  </label>
                  <div className="flex rounded-xl border border-black/15 overflow-hidden bg-white focus-within:border-sanctuary-gold">
                    <span className="px-3 py-2 bg-black/5 text-xs font-black text-sanctuary-dark/70 border-r border-black/10 flex items-center">
                      +91
                    </span>
                    <input
                      type="tel"
                      required
                      placeholder="10-digit mobile number"
                      value={phoneInput}
                      onChange={(e) => setPhoneInput(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      className="w-full p-2.5 text-xs font-mono font-bold text-sanctuary-dark focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase tracking-wider text-sanctuary-dark/70 block mb-1">
                    Companion Name (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Leo / Bella"
                    value={petNameInput}
                    onChange={(e) => setPetNameInput(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-black/15 text-xs font-medium focus:outline-none focus:border-sanctuary-gold bg-white"
                  />
                </div>
              </div>

              {phoneError && (
                <p className="text-[11px] font-bold text-red-600">{phoneError}</p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-sanctuary-forest hover:bg-black text-white rounded-xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                <span>{isSubmitting ? 'Unlocking...' : 'Unlock Festival Vouchers & Auto-Apply'}</span>
                <span className="material-symbols-outlined text-sm font-bold">lock_open</span>
              </button>

              <p className="text-[9px] text-center text-sanctuary-dark/60 font-medium">
                🔒 We respect your privacy. No spam — instant confirmation & WhatsApp updates only.
              </p>
            </form>
          ) : (
            /* UNLOCKED STATE WITH VOUCHER CARDS */
            <div className="space-y-3">
              <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-300 text-xs text-emerald-950 font-bold flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-emerald-600 text-sm">verified</span>
                  <span>🎉 Vouchers Unlocked for <strong>+91 {phoneInput}</strong></span>
                </span>
                <span className="text-[9px] bg-emerald-600 text-white px-2 py-0.5 rounded-full uppercase">
                  Active
                </span>
              </div>

              {/* Coupon Code 1: STAY6FREE1 */}
              <div className="p-3 rounded-2xl bg-sanctuary-sand border border-sanctuary-gold/60 flex items-center justify-between shadow-2xs">
                <div>
                  <span className="text-[9px] uppercase tracking-widest text-sanctuary-dark/60 font-bold block">
                    CAGE-FREE BOARDING VOUCHER
                  </span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="font-mono text-lg font-black text-sanctuary-forest tracking-wider">
                      STAY6FREE1
                    </span>
                    <span className="text-[9px] font-black px-1.5 py-0.2 bg-amber-400 text-sanctuary-dark rounded uppercase">
                      6+ Nights
                    </span>
                  </div>
                </div>
                <span className="text-[11px] font-black text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full border border-emerald-300">
                  🎁 1 Day 100% FREE
                </span>
              </div>

              {/* Coupon Code 2: GROOM10 */}
              <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-300/80 flex items-center justify-between shadow-2xs">
                <div>
                  <span className="text-[9px] uppercase tracking-widest text-sanctuary-dark/60 font-bold block">
                    STUDIO GROOMING VOUCHER
                  </span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="font-mono text-lg font-black text-sanctuary-forest tracking-wider">
                      GROOM10
                    </span>
                    <span className="text-[9px] font-black px-1.5 py-0.2 bg-sanctuary-gold text-sanctuary-dark rounded uppercase">
                      Above ₹999
                    </span>
                  </div>
                </div>
                <span className="text-[11px] font-black text-amber-900 bg-amber-100 px-2.5 py-1 rounded-full border border-amber-300">
                  ✨ Extra 10% OFF
                </span>
              </div>

              {/* Action CTAs */}
              <div className="space-y-2 pt-1">
                <button
                  onClick={handleClaimAndProceed}
                  className="w-full py-3 bg-sanctuary-forest hover:bg-black text-white rounded-xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 cursor-pointer"
                >
                  <span>Book Now with Unlocked Vouchers</span>
                  <span className="material-symbols-outlined text-sm font-bold">arrow_forward</span>
                </button>
                <button
                  onClick={onClose}
                  className="w-full py-1.5 text-sanctuary-dark/70 hover:text-black font-bold text-xs uppercase tracking-wider text-center transition-colors cursor-pointer"
                >
                  Continue Browsing Menu
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default PromoPosterPopup;
