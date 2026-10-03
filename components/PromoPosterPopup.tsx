import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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
    <div className="fixed inset-0 z-[190] flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-black/10 relative text-left"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-30 size-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black transition-colors"
          aria-label="Close poster"
        >
          <span className="material-symbols-outlined text-sm">close</span>
        </button>

        {/* Poster Image Header */}
        <div className="relative h-56 sm:h-64 w-full overflow-hidden bg-sanctuary-forest">
          <img
            src="/images/stylish_pet_haircut.jpg"
            alt="Pet Glow-Up Offer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
          
          <div className="absolute bottom-3 left-4 right-4 z-10 text-white space-y-1">
            <span className="inline-block bg-sanctuary-gold text-sanctuary-dark text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              EXCLUSIVE FLASH VOUCHER
            </span>
            <h3 className="text-xl sm:text-2xl font-black leading-tight text-white">
              Flat 20% OFF or Free Grooming Refresh!
            </h3>
            <p className="text-[11px] text-white/80 font-medium">
              Valid on all salon grooming packages or 4+ days cage-free boarding.
            </p>
          </div>
        </div>

        {/* Poster Body */}
        <div className="p-5 sm:p-6 space-y-4">
          
          {/* Coupon Display Box */}
          <div className="p-3.5 rounded-2xl bg-sanctuary-sand border border-sanctuary-gold/40 flex items-center justify-between">
            <div>
              <span className="text-[9px] uppercase tracking-widest text-sanctuary-dark/50 font-bold block">
                USE VOUCHER CODE:
              </span>
              <span className="font-mono text-xl font-black text-sanctuary-dark tracking-widest">
                SNIPVIP20
              </span>
            </div>
            <span className="text-xs font-black text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
              Save 20% Instantly
            </span>
          </div>

          <div className="space-y-1 text-xs text-sanctuary-dark/75 font-medium">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-emerald-600 text-sm">check_circle</span>
              <span>100% Cage-Free AC Boarding Floor on Kanakapura Road</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-emerald-600 text-sm">check_circle</span>
              <span>Twice-daily WhatsApp video updates to parents</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-1">
            <button
              onClick={onApplyAndBook}
              className="w-full py-3.5 bg-sanctuary-forest hover:bg-black text-white rounded-xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md active:scale-95"
            >
              <span>Apply 20% OFF & Open Booking</span>
              <span className="material-symbols-outlined text-sm font-bold">arrow_forward</span>
            </button>
            <button
              onClick={onClose}
              className="w-full py-2 bg-sanctuary-sand hover:bg-black/10 text-sanctuary-dark rounded-xl font-bold text-xs uppercase tracking-wider text-center transition-colors"
            >
              Maybe Later
            </button>
          </div>

        </div>
      </motion.div>
    </div>
  );
};

export default PromoPosterPopup;
