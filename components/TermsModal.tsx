import React from 'react';
import { motion } from 'framer-motion';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TermsModal: React.FC<TermsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[230] flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-black/10 overflow-hidden text-left relative my-6"
      >
        <div className="p-5 sm:p-6 pb-4 flex items-center justify-between border-b border-black/5 bg-[#FAF8F5]">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-sanctuary-gold">
              Legal & Policy
            </span>
            <h2 className="text-xl font-black text-sanctuary-dark">
              Terms of Service & Boarding Agreement
            </h2>
          </div>
          <button
            onClick={onClose}
            className="size-8 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center transition-colors"
          >
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>

        <div className="p-5 sm:p-6 space-y-4 max-h-[70vh] overflow-y-auto text-xs text-sanctuary-dark/80 font-medium leading-relaxed">
          <p className="text-[11px] text-sanctuary-dark/60">
            Last Updated: October 2026. Governing facility: Snip & Style, Site no 61, Beside Shani Mahatma Temple, Kanakapura Main Road, Bangalore, Karnataka 560082.
          </p>

          <section className="space-y-1.5">
            <h3 className="text-sm font-black text-sanctuary-dark">1. Health, Vaccines & Admission Protocol</h3>
            <p>
              All canine guests must have up-to-date vaccinations (Anti-Rabies and DHPPi 7-in-1/9-in-1). Feline guests require valid FVRCP and Rabies certification. Proof of vaccination must be presented via card or digital photo upon check-in. Pets exhibiting signs of contagious infections, severe tick infestation, or respiratory illness may be isolated or refused admission for the safety of other guests.
            </p>
          </section>

          <section className="space-y-1.5">
            <h3 className="text-sm font-black text-sanctuary-dark">2. 100% Cage-Free Environment & Temperament</h3>
            <p>
              Our boarding facility operates on a clean, climate-controlled, cage-free floor. To ensure safety, all dogs undergo a brief temperament evaluation during intake. In the event of persistent aggression toward staff or other pets, our handlers reserve the right to separate the dog into a dedicated individual room.
            </p>
          </section>

          <section className="space-y-1.5">
            <h3 className="text-sm font-black text-sanctuary-dark">3. Highway Vacation Drop-Off & Pickup Timings</h3>
            <p>
              Located on Kanakapura Highway (NH 948), we accommodate scheduled early highway drop-offs for pet parents heading out of Bangalore for vacations or weekend travel. Regular check-in hours are between 09:30 AM and 08:30 PM. Late pickups after 08:30 PM without prior notice may incur standard daycare or additional night charges.
            </p>
          </section>

          <section className="space-y-1.5">
            <h3 className="text-sm font-black text-sanctuary-dark">4. Emergency Veterinary Authorization</h3>
            <p>
              While 24/7 caretakers supervise all pets, pet parents agree that in the event of acute illness or medical emergency, Snip & Style is authorized to engage our on-call veterinarian or transport the pet to the nearest emergency animal clinic. All medical fees incurred will be communicated and borne by the pet parent.
            </p>
          </section>

          <section className="space-y-1.5">
            <h3 className="text-sm font-black text-sanctuary-dark">5. Payments, Cancellation & Refunds</h3>
            <p>
              Bookings may be paid online via Razorpay (UPI, Card, NetBanking) or settled in person upon arrival. Stays cancelled with more than 48 hours notice are eligible for full credit or refund. Milestone free grooming rewards (4+, 8+, 15+ days) are complimentary and non-exchangeable for cash discounts.
            </p>
          </section>
        </div>

        <div className="p-4 bg-[#FAF8F5] border-t border-black/5 text-right">
          <button
            onClick={onClose}
            className="py-2 px-5 bg-sanctuary-forest text-white rounded-xl text-xs font-black uppercase tracking-wider hover:bg-black transition-colors"
          >
            I Understand & Agree
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default TermsModal;
