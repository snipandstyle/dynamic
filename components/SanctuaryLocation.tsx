import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const SanctuaryLocation: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'What do I need to bring for boarding?',
      a: 'Updated vaccination card, their usual food to prevent tummy upset, and a comfort toy/blanket. We provide memory foam beds, RO water, sanitized bowls, and toys.'
    },
    {
      q: 'How often will I get photo/video updates?',
      a: 'Twice daily on WhatsApp! Video clips and candid photos after morning lawn play/breakfast and in the evening. You can also text the caretaker anytime.'
    },
    {
      q: 'Are pets kept in cages at any point?',
      a: 'NEVER. Snip & Style is 100% cage-free. Companions stay in private suites with thick orthopaedic mattresses and solid acoustic partition walls.'
    },
    {
      q: 'What if my pet is nervous or needs medicine?',
      a: 'Our staff are certified in fear-free handling. Anxious pets receive quiet suites and gentle one-on-one time. Prescription medications are administered on schedule at zero extra cost.'
    }
  ];

  return (
    <section
      id="location"
      className="min-h-screen lg:h-screen lg:max-h-screen flex flex-col justify-center px-4 sm:px-6 lg:px-8 py-6 bg-sanctuary-sand/40 relative overflow-hidden border-t border-black/5 text-left"
    >
      <div className="max-w-7xl mx-auto w-full space-y-4">
        
        {/* Compact Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 pb-2 border-b border-black/5">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-sanctuary-moss/10 text-sanctuary-moss text-[10px] font-black uppercase tracking-wider mb-1">
              <span className="material-symbols-outlined text-xs">location_on</span>
              <span>Kanakapura Main Road, Bangalore</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-serif font-bold text-sanctuary-dark">
              Visit The Sanctuary & Common Questions
            </h2>
          </div>
          <p className="text-xs text-sanctuary-dark/70 font-medium max-w-sm">
            Open 7 days a week (09:30 AM – 08:30 PM) with doorstep pet pickup transit.
          </p>
        </div>

        {/* 2-Column Split that fits on 1 Screen */}
        <div className="grid lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Left: Studio Location & Pet Pickup */}
          <div className="lg:col-span-6 bg-white rounded-3xl p-5 sm:p-6 border border-black/10 shadow-lg flex flex-col justify-between space-y-4">
            <div className="space-y-4">
              {/* Address */}
              <div className="flex items-start gap-3">
                <div className="size-10 rounded-xl bg-sanctuary-gold/15 text-sanctuary-dark flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-xl">storefront</span>
                </div>
                <div>
                  <h3 className="text-sm font-black text-sanctuary-dark">Resort & Studio Address</h3>
                  <p className="text-xs text-sanctuary-dark/80 font-medium mt-0.5 leading-relaxed">
                    Site no 61, Kanakapura Main Road, Beside Shani Mahatma Temple, Bangalore 560082
                  </p>
                  <span className="inline-block mt-1 text-[10px] font-bold text-emerald-800 bg-emerald-100/60 px-2 py-0.5 rounded-full">
                    Dedicated customer parking available
                  </span>
                </div>
              </div>

              {/* Hours & Contact */}
              <div className="grid grid-cols-2 gap-3 pt-1 border-t border-black/5">
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-sanctuary-dark/50 font-black">Operating Hours</div>
                  <div className="text-xs font-black text-sanctuary-dark mt-0.5">Open 7 Days • 365 Days</div>
                  <div className="text-xs text-sanctuary-gold font-bold">09:30 AM – 08:30 PM</div>
                </div>

                <div>
                  <div className="text-[10px] uppercase tracking-wider text-sanctuary-dark/50 font-black">Direct Studio Hotline</div>
                  <a href="tel:+919739887770" className="text-xs font-black text-sanctuary-dark hover:text-sanctuary-gold block mt-0.5">
                    +91 9739887770
                  </a>
                  <div className="text-[10px] text-sanctuary-dark/60 font-medium">Instant caretaker support</div>
                </div>
              </div>

              {/* Pet Pickup Coverage */}
              <div className="p-3 bg-sanctuary-sand rounded-2xl space-y-1">
                <div className="text-xs font-black text-sanctuary-dark flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm text-amber-600">local_taxi</span>
                  <span>Doorstep Pet Pickup Coverage</span>
                </div>
                <p className="text-[11px] text-sanctuary-dark/70 font-medium">
                  JP Nagar, Jayanagar, Banashankari, Kanakapura Rd, Bannerghatta Rd, RR Nagar.
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-2 pt-2">
              <a
                href="https://maps.google.com/?q=Snip+and+Style+Kanakapura+Road+Bengaluru"
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 px-3 bg-sanctuary-forest hover:bg-black text-white rounded-xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-sm text-center"
              >
                <span className="material-symbols-outlined text-sm">navigation</span>
                <span>Directions</span>
              </a>

              <button
                type="button"
                onClick={() => window.dispatchEvent(new CustomEvent('snip_open_booking'))}
                className="py-2.5 px-3 bg-sanctuary-gold hover:bg-amber-400 text-sanctuary-dark rounded-xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-sm text-center"
              >
                <span className="material-symbols-outlined text-sm">calendar_month</span>
                <span>Reserve Online</span>
              </button>
            </div>
          </div>

          {/* Right: Concise FAQ Accordion */}
          <div className="lg:col-span-6 bg-white rounded-3xl p-5 sm:p-6 border border-black/10 shadow-lg flex flex-col justify-between space-y-3">
            <div className="space-y-2">
              <h3 className="text-sm font-black text-sanctuary-dark mb-2">Common Questions Before Booking</h3>
              {faqs.map((faq, i) => {
                const isOpen = openFaq === i;
                return (
                  <div
                    key={i}
                    className={`rounded-2xl border transition-all ${
                      isOpen ? 'bg-sanctuary-pearl border-sanctuary-gold/40' : 'bg-white border-black/10'
                    }`}
                  >
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : i)}
                      className="w-full p-3 text-left flex items-center justify-between gap-2"
                    >
                      <span className="text-xs font-black text-sanctuary-dark">{faq.q}</span>
                      <span className="material-symbols-outlined text-sm text-sanctuary-gold shrink-0">
                        {isOpen ? 'expand_less' : 'expand_more'}
                      </span>
                    </button>
                    {isOpen && (
                      <div className="px-3 pb-3 text-[11px] text-sanctuary-dark/75 font-medium leading-relaxed border-t border-black/5 pt-1.5">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Minimal Footer Strip */}
            <div className="pt-3 border-t border-black/5 flex items-center justify-between text-[10px] text-sanctuary-dark/60 font-semibold">
              <span>© {new Date().getFullYear()} Snip & Style Pet Resort & Spa</span>
              <span className="text-sanctuary-gold font-bold">100% Cage-Free Certified</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default SanctuaryLocation;
