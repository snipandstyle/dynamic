import React from 'react';
import { motion } from 'framer-motion';

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyModal: React.FC<PrivacyModalProps> = ({ isOpen, onClose }) => {
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
              Privacy & Data Policy
            </span>
            <h2 className="text-xl font-black text-sanctuary-dark">
              Privacy Policy & Data Security
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
            Compliant with Digital Personal Data Protection (DPDP) Act, 2023. Facility: Snip & Style, Kanakapura Main Road, Bangalore 560082.
          </p>

          <section className="space-y-1.5">
            <h3 className="text-sm font-black text-sanctuary-dark">1. Information We Collect</h3>
            <p>
              We collect your name, phone number, email, address, and pet information (name, breed, weight, medical conditions, feeding requirements, vaccination logs) solely to provide customized pet boarding, daycare, and professional grooming services.
            </p>
          </section>

          <section className="space-y-1.5">
            <h3 className="text-sm font-black text-sanctuary-dark">2. Daily WhatsApp Updates & Media</h3>
            <p>
              Daily photo and video updates of your pet are sent directly to your authorized WhatsApp number. We do not sell or monetize personal customer media. Any promotional media featuring pets in our facility is shared only with explicit verbal or written parent consent.
            </p>
          </section>

          <section className="space-y-1.5">
            <h3 className="text-sm font-black text-sanctuary-dark">3. Payment Information & Security</h3>
            <p>
              Online payments are processed securely through RBI-licensed payment aggregators (Razorpay). Snip & Style does not store raw credit/debit card numbers or UPI PINs on our servers. All transaction details are encrypted via SSL/TLS encryption.
            </p>
          </section>

          <section className="space-y-1.5">
            <h3 className="text-sm font-black text-sanctuary-dark">4. Data Deletion & Rights</h3>
            <p>
              Pet parents can request complete deletion of their account records or vaccination files at any time by contacting us directly at +91 9739887770 or emailing privacy@snipandstyle.pet.
            </p>
          </section>
        </div>

        <div className="p-4 bg-[#FAF8F5] border-t border-black/5 text-right">
          <button
            onClick={onClose}
            className="py-2 px-5 bg-sanctuary-forest text-white rounded-xl text-xs font-black uppercase tracking-wider hover:bg-black transition-colors"
          >
            Acknowledge & Close
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default PrivacyModal;
