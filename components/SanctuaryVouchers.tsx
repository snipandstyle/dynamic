import React, { useState } from 'react';
import { motion } from 'framer-motion';

export const SanctuaryVouchers: React.FC = () => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const vouchers = [
    {
      code: 'ROYALPET15',
      discount: 'FLAT 15% OFF',
      title: 'First-Timer Royal Welcome',
      desc: 'Valid on any salon grooming package or luxury boarding stay. No minimum spend.',
      badge: 'HOTTEST OFFER',
      badgeColor: 'bg-sanctuary-gold text-sanctuary-dark',
      whatsappMsg: 'Hi Snip & Style! I would like to claim 15% OFF with code ROYALPET15.',
    },
    {
      code: 'FREESPA4',
      discount: 'FREE ₹800 SPA',
      title: '4+ Nights Holiday Reward',
      desc: 'Includes full warm hydromassage, fluff blow-dry, and ear hygiene before heading home.',
      badge: 'BOARDING SPECIAL',
      badgeColor: 'bg-emerald-700 text-white',
      whatsappMsg: 'Hi Snip & Style! I am booking 4+ nights and claiming my Free ₹800 Spa Bath.',
    },
    {
      code: 'PETCAB50',
      discount: '50% OFF PET TAXI',
      title: 'Doorstep AC Chauffeur',
      desc: 'Safe, stress-free pickup and drop-off in our climate-controlled pet cab (5+ nights).',
      badge: 'TRAVEL CONVENIENCE',
      badgeColor: 'bg-sanctuary-forest text-white',
      whatsappMsg: 'Hi Snip & Style! I would like to claim 50% OFF pet cab pickup with code PETCAB50.',
    },
    {
      code: 'PUPPY20',
      discount: 'FLAT 20% OFF',
      title: 'Puppy & Kitten First Glow-Up',
      desc: 'Gentle, slow-paced introduction groom for fur babies under 6 months old.',
      badge: 'YOUNG PETS',
      badgeColor: 'bg-purple-700 text-white',
      whatsappMsg: 'Hi Snip & Style! I want to claim 20% OFF puppy intro groom with code PUPPY20.',
    },
  ];

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  return (
    <section id="offers" className="py-20 px-4 sm:px-6 lg:px-8 bg-sanctuary-forest text-white relative overflow-hidden text-left">
      <div className="absolute top-0 right-0 w-96 h-96 bg-sanctuary-gold/10 blur-[130px] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-12 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sanctuary-gold/20 border border-sanctuary-gold/30 text-sanctuary-gold text-xs font-black uppercase tracking-wider">
            <span className="material-symbols-outlined text-sm">local_activity</span>
            <span>Bangalore Exclusive Privileges</span>
          </div>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold leading-tight">
            Unmissable Offers & <br />
            <span className="italic font-normal text-sanctuary-gold">Complimentary Guest Rewards.</span>
          </h2>

          <p className="text-sm sm:text-base text-white/70 font-medium leading-relaxed">
            Take advantage of these limited-time promotional vouchers. Tap to copy code or click to apply directly in online checkout!
          </p>
        </div>

        {/* 4 Voucher Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {vouchers.map((v) => (
            <div
              key={v.code}
              className="bg-white/5 backdrop-blur-md rounded-3xl p-6 border border-white/15 flex flex-col justify-between space-y-5 hover:border-sanctuary-gold/50 transition-all duration-300 relative group"
            >
              <div className="space-y-4">
                {/* Badge */}
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full ${v.badgeColor}`}>
                    {v.badge}
                  </span>
                </div>

                {/* Discount & Title */}
                <div>
                  <div className="text-2xl font-black text-sanctuary-gold tracking-tight">
                    {v.discount}
                  </div>
                  <h3 className="text-lg font-black text-white mt-1">
                    {v.title}
                  </h3>
                  <p className="text-xs text-white/70 font-medium mt-1 leading-relaxed">
                    {v.desc}
                  </p>
                </div>

                {/* Code Pill */}
                <div className="p-3 bg-black/40 rounded-2xl border border-white/10 flex items-center justify-between">
                  <div>
                    <span className="text-[9px] uppercase tracking-widest text-white/50 block">Promo Code:</span>
                    <span className="font-mono text-base font-black text-sanctuary-gold tracking-wider">
                      {v.code}
                    </span>
                  </div>
                  <button
                    onClick={() => handleCopy(v.code)}
                    className="py-1.5 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold transition-colors"
                  >
                    {copiedCode === v.code ? 'Copied! ✓' : 'Copy'}
                  </button>
                </div>
              </div>

              {/* Checkout apply button */}
              <button
                type="button"
                onClick={() => {
                  handleCopy(v.code);
                  window.dispatchEvent(new CustomEvent('snip_open_booking'));
                }}
                className="w-full py-3 bg-sanctuary-gold hover:bg-amber-500 text-sanctuary-dark rounded-xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95"
              >
                <span>Apply in Checkout</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default SanctuaryVouchers;
