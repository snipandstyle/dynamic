import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const SanctuaryFAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'What do I need to pack for my companion’s boarding stay?',
      a: 'All you need to bring is your companion’s updated vaccination card, sufficient quantity of their usual food (to prevent any tummy upset), and a favorite comfort toy or blanket with your scent. We provide plush orthopaedic memory foam bedding, stainless steel sanitized bowls, fresh filtered RO drinking water, and plenty of interactive enrichment toys!'
    },
    {
      q: 'How often will I receive photo and video updates of my companion?',
      a: 'You will receive at least two video updates and candid playtime photos every day directly on your WhatsApp! One after their morning meadow play and breakfast, and one in the evening. You can also message our dedicated caretaker anytime between 9:30 AM and 8:30 PM for instant real-time checks.'
    },
    {
      q: 'Are the pets kept in wire cages or metal crates at any point?',
      a: 'NEVER. Snip & Style Sanctuary is strictly 100% cage-free. We believe wire cages cause immense psychological trauma and confinement panic. Every guest stays in a private, individual suite with thick orthopaedic mattresses and solid acoustic walls. They are free to move, stretch, and relax.'
    },
    {
      q: 'What if my companion is nervous, shy, or has special medical needs?',
      a: 'Our staff are certified in fear-free handling techniques. Anxious companions are given private quiet suites and gentle one-on-one attention without any forced social interactions. If your companion requires prescription medications, eye drops, or special senior care, our trained team administers them on precise schedules at no extra charge.'
    },
    {
      q: 'How do I claim the Free Spa Bath or Grooming Discounts?',
      a: 'Enter code FREESPA during checkout when booking 4 or more nights of boarding to get a complimentary Furry Fresh Spa Bath (₹749 value) at ₹0! For longer stays, code FREESPA8 (8+ nights) unlocks a Free Special Spa Package, and FREESPA15 (15+ nights) unlocks a Free Full Luxury Grooming. For grooming appointments above ₹999, apply coupon GROOM10 for 10% OFF!'
    },
    {
      q: 'Can I visit the Kanakapura Road studio before booking?',
      a: 'Yes, we strongly encourage it! Bring your companion to our studio anytime between 9:30 AM and 8:30 PM. Take a walk through our private suites, inspect our sanitized grooming stations, and let your companion experience a free 30-minute sniffing and play session on our green turf meadow.'
    }
  ];

  return (
    <section id="faq" className="py-20 px-4 sm:px-6 lg:px-8 bg-white relative overflow-hidden border-t border-black/5 text-left">
      <div className="max-w-5xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sanctuary-moss/10 border border-sanctuary-moss/20 text-sanctuary-moss text-xs font-black uppercase tracking-wider">
            <span className="material-symbols-outlined text-sm">help</span>
            <span>Frequently Asked Questions</span>
          </div>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold text-sanctuary-dark leading-tight">
            Everything You Need to Know <br />
            <span className="italic font-normal text-sanctuary-gold">Before Your Companion's Stay.</span>
          </h2>

          <p className="text-sm sm:text-base text-sanctuary-dark/70 font-medium max-w-xl mx-auto">
            Got questions? We believe in 100% honesty and complete transparency.
          </p>
        </div>

        {/* Accordion */}
        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className={`rounded-2xl border transition-all ${
                  isOpen
                    ? 'bg-sanctuary-pearl border-sanctuary-gold/50 shadow-md'
                    : 'bg-white border-black/10 hover:border-black/20'
                }`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4"
                >
                  <span className="text-sm sm:text-base font-black text-sanctuary-dark">
                    {faq.q}
                  </span>
                  <div
                    className={`size-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 ${
                      isOpen
                        ? 'bg-sanctuary-gold text-sanctuary-dark rotate-180 font-bold'
                        : 'bg-sanctuary-sand text-sanctuary-dark/70'
                    }`}
                  >
                    <span className="material-symbols-outlined text-lg">expand_more</span>
                  </div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 sm:px-6 sm:pb-6 text-xs sm:text-sm text-sanctuary-dark/75 font-medium leading-relaxed border-t border-black/5 pt-3">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* Help Banner */}
        <div className="p-6 sm:p-8 rounded-3xl bg-sanctuary-sand border border-black/10 flex flex-col sm:flex-row items-center justify-between gap-6 text-left shadow-sm">
          <div className="space-y-1">
            <h3 className="text-lg font-black text-sanctuary-dark">Still have a question about your pet?</h3>
            <p className="text-xs text-sanctuary-dark/65 font-medium">
              Our lead veterinarian and certified stylists are ready to answer all dietary, behavioral, or medical questions.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full sm:w-auto">
            <a
              href="tel:+919739887770"
              className="w-full sm:w-auto px-5 py-3 bg-white border border-black/15 hover:border-black/30 text-sanctuary-dark rounded-xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-xs active:scale-95"
            >
              <span className="material-symbols-outlined text-base text-sanctuary-gold">call</span>
              <span>Call Concierge</span>
            </a>
            <button
              onClick={() => window.dispatchEvent(new CustomEvent('snip_open_booking'))}
              className="w-full sm:w-auto px-6 py-3 bg-sanctuary-forest hover:bg-black text-white rounded-xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md active:scale-95"
            >
              <span className="material-symbols-outlined text-base text-sanctuary-gold">calendar_month</span>
              <span>Book Online</span>
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};

export default SanctuaryFAQ;
