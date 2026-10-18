import React from 'react';

interface SanctuaryMobileBarProps {
  onOpenBooking?: () => void;
}

export const SanctuaryMobileBar: React.FC<SanctuaryMobileBarProps> = ({ onOpenBooking }) => {
  return (
    <div className="fixed bottom-0 inset-x-0 z-[150] lg:hidden bg-sanctuary-forest/95 backdrop-blur-xl border-t border-white/10 p-2.5 px-4 shadow-[0_-4px_25px_rgba(0,0,0,0.3)] text-left">
      <div className="flex items-center justify-between gap-3 max-w-md mx-auto">
        
        {/* Special Offer Indicator */}
        <div className="flex flex-col text-left">
          <div className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-sanctuary-gold animate-ping" />
            <span className="text-[10px] font-black uppercase tracking-wider text-sanctuary-gold">
              EXCLUSIVE SANCTUARY PERK
            </span>
          </div>
          <span className="text-xs font-black text-white">
            Free Spa Bath • <span className="font-mono text-sanctuary-gold">FREESPA</span>
          </span>
        </div>

        {/* ONLY Book Now Button - No Phone, No WhatsApp */}
        <button
          onClick={onOpenBooking}
          className="py-2.5 px-6 bg-sanctuary-gold hover:bg-white text-sanctuary-dark rounded-xl font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-md active:scale-95 transition-all"
        >
          <span>Book Studio Visit</span>
          <span className="material-symbols-outlined text-sm font-bold">arrow_forward</span>
        </button>

      </div>
    </div>
  );
};

export default SanctuaryMobileBar;
