import React, { useState } from 'react';

export const LocationAndContact: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'What do I need to bring for boarding?',
      a: 'Updated vaccination card, their usual food to prevent upset stomach, and a comfort toy/blanket. We provide clean bedding, filtered RO water, bowls, and toys.'
    },
    {
      q: 'How often will I get photo and video updates?',
      a: 'Twice daily on WhatsApp! Video clips and photos after morning play/breakfast and in the evening. You can also text the caretaker anytime for updates.'
    },
    {
      q: 'Are pets ever kept in cages?',
      a: 'Never. Snip & Style is 100% cage-free. Companions stay in our clean boarding floor with soft bedding and freedom to move and rest.'
    },
    {
      q: 'What if my companion needs medicine or special care?',
      a: 'Our staff are certified in gentle handling. Prescribed oral medications, eye drops, or senior diets are administered accurately on schedule at zero extra cost.'
    }
  ];

  return (
    <section
      id="location"
      className="min-h-screen lg:h-screen lg:max-h-screen flex flex-col justify-center px-4 sm:px-6 lg:px-8 py-4 lg:py-6 bg-white relative text-left border-t border-black/5"
    >
      <div className="max-w-6xl mx-auto w-full space-y-4">
        
        {/* Compact Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 pb-2 border-b border-black/5">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-sanctuary-moss/10 text-sanctuary-moss text-[10px] font-black uppercase tracking-wider mb-1">
              <span>Studio & Contact</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-sanctuary-dark">
              Location & Common Questions
            </h2>
          </div>
          <p className="text-xs text-sanctuary-dark/70 font-medium max-w-sm">
            Kanakapura Main Road, Bangalore • Open 7 Days (09:30 AM – 08:30 PM)
          </p>
        </div>

        {/* 2-Column Split that fits on 1 Screen */}
        <div className="grid lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Left: Studio Location & Pet Pickup */}
          <div className="lg:col-span-6 bg-sanctuary-sand/40 rounded-3xl p-5 border border-black/10 flex flex-col justify-between space-y-4">
            <div className="space-y-3.5">
              {/* Address */}
              <div className="flex items-start gap-3">
                <div className="size-10 rounded-xl bg-sanctuary-forest text-sanctuary-gold flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-xl">storefront</span>
                </div>
                <div>
                  <h3 className="text-sm font-black text-sanctuary-dark">Studio & Boarding Address</h3>
                  <p className="text-xs text-sanctuary-dark/80 font-medium mt-0.5 leading-relaxed">
                    Site no 61, Kanakapura Main Road, Beside Shani Mahatma Temple, Bangalore 560082
                  </p>
                  <span className="inline-block mt-1 text-[10px] font-bold text-emerald-800 bg-emerald-100/60 px-2 py-0.5 rounded-full">
                    Customer parking available in front of studio
                  </span>
                </div>
              </div>

              {/* Hours & Phone */}
              <div className="grid grid-cols-2 gap-3 pt-1 border-t border-black/5">
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-sanctuary-dark/50 font-bold">Hours</div>
                  <div className="text-xs font-black text-sanctuary-dark mt-0.5">Open 7 Days • 365 Days</div>
                  <div className="text-xs text-sanctuary-gold font-bold">09:30 AM – 08:30 PM</div>
                </div>

                <div>
                  <div className="text-[10px] uppercase tracking-wider text-sanctuary-dark/50 font-bold">Online Portal</div>
                  <div className="text-xs font-black text-sanctuary-dark mt-0.5">Instant Confirmation</div>
                  <div className="text-[10px] text-emerald-700 font-semibold">24/7 Booking Engine</div>
                </div>
              </div>

              {/* Doorstep Cab */}
              <div className="p-2.5 bg-white rounded-xl border border-black/5 space-y-0.5">
                <div className="text-xs font-black text-sanctuary-dark flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm text-amber-600">local_taxi</span>
                  <span>Doorstep Pet Pickup Service</span>
                </div>
                <p className="text-[11px] text-sanctuary-dark/70 font-medium">
                  Covering JP Nagar, Jayanagar, Banashankari, Kanakapura Rd, Bannerghatta Rd, RR Nagar.
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <a
                href="https://maps.app.goo.gl/MqFTrZiLPbttv3eD6"
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 px-3 bg-sanctuary-forest hover:bg-black text-white rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-xs"
              >
                <span className="material-symbols-outlined text-sm">navigation</span>
                <span>Google Maps</span>
              </a>

              <button
                onClick={() => {
                  window.dispatchEvent(new CustomEvent('snip_open_booking'));
                  const btn = document.querySelector('button[title="Customer Login & Stays"]');
                }}
                className="py-2.5 px-3 bg-sanctuary-sand hover:bg-black/10 text-sanctuary-dark border border-black/10 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-xs"
              >
                <span className="material-symbols-outlined text-sm font-bold">event</span>
                <span>Book Now</span>
              </button>
            </div>
          </div>

          {/* Right: Concise FAQ Accordion */}
          <div className="lg:col-span-6 bg-sanctuary-sand/40 rounded-3xl p-5 border border-black/10 flex flex-col justify-between space-y-3">
            <div className="space-y-2">
              <h3 className="text-sm font-black text-sanctuary-dark mb-1">Common Questions</h3>
              {faqs.map((faq, i) => {
                const isOpen = openFaq === i;
                return (
                  <div
                    key={i}
                    className={`rounded-2xl border transition-all ${
                      isOpen ? 'bg-white border-sanctuary-gold/40 shadow-xs' : 'bg-white/60 border-black/5'
                    }`}
                  >
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : i)}
                      className="w-full p-2.5 px-3 text-left flex items-center justify-between gap-2"
                    >
                      <span className="text-xs font-black text-sanctuary-dark">{faq.q}</span>
                      <span className="material-symbols-outlined text-sm text-sanctuary-gold shrink-0">
                        {isOpen ? 'expand_less' : 'expand_more'}
                      </span>
                    </button>
                    {isOpen && (
                      <div className="px-3 pb-2.5 text-[11px] text-sanctuary-dark/75 font-medium leading-relaxed border-t border-black/5 pt-1.5">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Clean Minimal Footer */}
            <div className="pt-2 border-t border-black/5 flex items-center justify-between text-[10px] text-sanctuary-dark/60 font-semibold">
              <span>© {new Date().getFullYear()} Snip & Style • Kanakapura Road, Bangalore</span>
              <span className="text-sanctuary-gold font-bold">100% Cage-Free</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default LocationAndContact;
