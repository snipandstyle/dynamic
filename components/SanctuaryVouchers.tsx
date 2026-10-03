import React, { useState } from 'react';
import { motion } from 'framer-motion';

export const SanctuaryVouchers: React.FC = () => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const vouchers = [
    {
      code: 'FREESPA',
      discount: 'FREE SPA BATH',
      title: 'Free Furry Fresh Spa (4+ Nights)',
      desc: 'Book 4+ nights boarding and receive a full Furry Fresh Spa bath & blow-dry for ₹0 at checkout.',
      badge: '4+ NIGHTS BOARDING',
      badgeColor: 'bg-emerald-700 text-white',
      category: 'boarding',
      nights: 4,
    },
    {
      code: 'FREESPA8',
      discount: 'FREE SPECIAL SPA',
      title: 'Special Spa Package (8+ Nights)',
      desc: 'Book 8+ nights boarding and unlock our Special Deep Spa & Paw Balm treatment for ₹0 at checkout.',
      badge: '8+ NIGHTS BOARDING',
      badgeColor: 'bg-amber-600 text-white',
      category: 'boarding',
      nights: 8,
    },
    {
      code: 'FREESPA15',
      discount: 'FREE FULL GROOM',
      title: 'Full Luxury Grooming (15+ Nights)',
      desc: 'Extended stays of 15+ nights receive a complete breed haircut, style, and luxury bath for ₹0.',
      badge: '15+ NIGHTS BOARDING',
      badgeColor: 'bg-purple-700 text-white',
      category: 'boarding',
      nights: 15,
    },
    {
      code: 'GROOM10',
      discount: 'FLAT 10% OFF',
      title: '10% OFF Orders Above ₹999',
      desc: 'Valid on any artisan dog or cat grooming package when the grooming order exceeds ₹999.',
      badge: 'GROOMING ONLY',
      badgeColor: 'bg-sanctuary-gold text-sanctuary-dark',
      category: 'grooming',
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
            <span>Verified Privileges</span>
          </div>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold leading-tight">
            Official Coupons & <br />
            <span className="italic font-normal text-sanctuary-gold">Complimentary Guest Rewards.</span>
          </h2>

          <p className="text-sm sm:text-base text-white/70 font-medium leading-relaxed">
            Take advantage of our exclusive boarding rewards and grooming discounts. Tap to copy code or click to apply directly in online checkout!
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
                    type="button"
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
                  window.dispatchEvent(
                    new CustomEvent('snip_open_booking', {
                      detail: {
                        appliedCouponCode: v.code,
                        type: v.category === 'boarding' ? 'boarding' : 'grooming',
                        nights: v.nights || 4,
                        serviceName: v.category === 'boarding' ? 'Cage-Free Boarding Floor' : 'Artisan Grooming Care',
                        basePrice: v.category === 'boarding' ? 625 : 1199,
                      },
                    })
                  );
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
