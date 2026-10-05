import React from 'react';
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
  if (!isOpen) return null;

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
          className="absolute top-3 right-3 z-30 size-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black transition-colors"
          aria-label="Close offer popup"
        >
          <span className="material-symbols-outlined text-sm">close</span>
        </button>

        {/* Realistic Banner Header with 6 Days Boarding Visual (No humans) */}
        <div className="relative h-52 sm:h-60 w-full overflow-hidden bg-sanctuary-forest">
          <img
            src="/images/offer_boarding_6days_free.jpg"
            alt="Book 6 Days Boarding, Get 1 Day Free Offer"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

          <div className="absolute bottom-3 left-4 right-4 z-10 text-white space-y-1">
            <div className="inline-flex items-center gap-1.5 bg-emerald-500 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
              <span className="size-1.5 rounded-full bg-white animate-pulse" />
              <span>FLAGSHIP PROMOTION • ZERO CAGES</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black leading-tight text-white">
              Book 6 Days Boarding, Get 1 Day FREE!
            </h3>
            <p className="text-[11px] sm:text-xs text-white/90 font-medium leading-relaxed">
              Reserve 6 or more nights of cage-free luxury boarding on Kanakapura Highway, and your companion gets their 6th day <strong className="text-sanctuary-gold font-bold">100% complimentary</strong>!
            </p>
          </div>
        </div>

        {/* Popup Body */}
        <div className="p-5 sm:p-6 space-y-3.5">

          {/* Coupon Code Card */}
          <div className="p-3.5 rounded-2xl bg-sanctuary-sand border border-sanctuary-gold/60 flex items-center justify-between shadow-2xs">
            <div>
              <span className="text-[9px] uppercase tracking-widest text-sanctuary-dark/60 font-bold block">
                OFFICIAL VOUCHER CODE
              </span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="font-mono text-xl sm:text-2xl font-black text-sanctuary-forest tracking-wider">
                  STAY6FREE1
                </span>
                <span className="text-[9px] font-black px-2 py-0.5 bg-sanctuary-gold/30 text-sanctuary-dark rounded-md uppercase">
                  Auto-Applied
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs font-black text-emerald-800 bg-emerald-100 px-3 py-1.5 rounded-full border border-emerald-300 inline-block shadow-2xs">
                🎁 1 Day FREE (Save ₹625–₹875)
              </span>
            </div>
          </div>

          {/* Inclusions Breakdown */}
          <div className="space-y-1.5 text-xs text-sanctuary-dark/80 font-medium">
            <div className="flex items-start gap-2">
              <span className="material-symbols-outlined text-emerald-600 text-sm shrink-0 mt-0.5">check_circle</span>
              <span><strong>1 Full Day Free:</strong> Automatically deducted when reserving 6+ nights stay</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="material-symbols-outlined text-emerald-600 text-sm shrink-0 mt-0.5">check_circle</span>
              <span><strong>100% Cage-Free Luxury:</strong> Private suites, thick bedding & twice-daily lawn walks</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="material-symbols-outlined text-emerald-600 text-sm shrink-0 mt-0.5">check_circle</span>
              <span><strong>Daily WhatsApp Journals:</strong> Photos and video clips sent directly to your phone</span>
            </div>
          </div>

          {/* Secondary Grooming Offer Notice */}
          <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-300 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="text-base">🛁</span>
              <div>
                <span className="font-black text-amber-950 block text-[11px]">
                  Grooming Special: Orders Above ₹500
                </span>
                <span className="text-[10px] text-amber-900/80 font-medium">
                  Choose a <strong>FREE Bath</strong> or <strong>FREE Nail Clipping</strong> at checkout!
                </span>
              </div>
            </div>
            <span className="text-[9px] font-black uppercase text-amber-800 bg-amber-200/80 px-2 py-0.5 rounded-full shrink-0">
              Claim in Store
            </span>
          </div>

          {/* Action CTAs */}
          <div className="space-y-2 pt-1">
            <button
              onClick={onApplyAndBook}
              className="w-full py-3.5 bg-sanctuary-forest hover:bg-black text-white rounded-xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md active:scale-95"
            >
              <span>Claim 1 Day FREE & Book 6+ Days</span>
              <span className="material-symbols-outlined text-sm font-bold">arrow_forward</span>
            </button>
            <button
              onClick={onClose}
              className="w-full py-2 bg-sanctuary-sand/60 hover:bg-sanctuary-sand text-sanctuary-dark/80 hover:text-black rounded-xl font-bold text-xs uppercase tracking-wider text-center transition-colors"
            >
              Explore Website First
            </button>
          </div>

        </div>
      </motion.div>
    </div>
  );
};

export default PromoPosterPopup;
