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
    <div className="fixed inset-0 z-[190] flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm">
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

        {/* Banner Header with Spa / Grooming Visual */}
        <div className="relative h-52 sm:h-60 w-full overflow-hidden bg-sanctuary-forest">
          <img
            src="/images/luxury_dog_grooming.jpg"
            alt="Free Furry Fresh Bath Offer"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent" />

          <div className="absolute bottom-3 left-4 right-4 z-10 text-white space-y-1">
            <div className="inline-flex items-center gap-1.5 bg-emerald-500 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
              <span className="size-1.5 rounded-full bg-white animate-pulse" />
              <span>LIMITED-TIME PROMOTION</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black leading-tight text-white">
              Get a FREE Furry Fresh Bath!
            </h3>
            <p className="text-[11px] sm:text-xs text-white/85 font-medium leading-relaxed">
              Book 4+ nights of cage-free boarding on Kanakapura Highway, and your companion gets a complimentary <strong className="text-sanctuary-gold font-bold">₹749 Furry Fresh Spa Bath</strong> before checkout.
            </p>
          </div>
        </div>

        {/* Popup Body */}
        <div className="p-5 sm:p-6 space-y-4">

          {/* Coupon Code Card */}
          <div className="p-3.5 rounded-2xl bg-sanctuary-sand border border-sanctuary-gold/50 flex items-center justify-between shadow-2xs">
            <div>
              <span className="text-[9px] uppercase tracking-widest text-sanctuary-dark/60 font-bold block">
                OFFICIAL VOUCHER CODE
              </span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="font-mono text-xl sm:text-2xl font-black text-sanctuary-forest tracking-wider">
                  FREESPA
                </span>
                <span className="text-[9px] font-black px-2 py-0.5 bg-sanctuary-gold/30 text-sanctuary-dark rounded-md uppercase">
                  Auto-Applied
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs font-black text-emerald-800 bg-emerald-100 px-3 py-1.5 rounded-full border border-emerald-300 inline-block shadow-2xs">
                🎁 ₹749 Value FREE
              </span>
            </div>
          </div>

          {/* Inclusions Breakdown */}
          <div className="space-y-1.5 text-xs text-sanctuary-dark/80 font-medium">
            <div className="flex items-start gap-2">
              <span className="material-symbols-outlined text-emerald-600 text-sm shrink-0 mt-0.5">check_circle</span>
              <span><strong>Furry Fresh Spa Bath:</strong> Warm bubble wash, premium shampoo & conditioner</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="material-symbols-outlined text-emerald-600 text-sm shrink-0 mt-0.5">check_circle</span>
              <span><strong>Full Hygiene Care:</strong> High-velocity fluff dry, gentle ear & eye wax cleanse</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="material-symbols-outlined text-emerald-600 text-sm shrink-0 mt-0.5">check_circle</span>
              <span><strong>100% Floor Freedom:</strong> Zero wire cages, private suites & 2 daily lawn walks</span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="space-y-2 pt-1">
            <button
              onClick={onApplyAndBook}
              className="w-full py-3.5 bg-sanctuary-forest hover:bg-black text-white rounded-xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md active:scale-95"
            >
              <span>Claim FREE Furry Fresh & Book Now</span>
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
