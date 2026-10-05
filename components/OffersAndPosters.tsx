import React, { useState } from 'react';

interface OffersAndPostersProps {
  onOpenBooking: () => void;
}

export const OffersAndPosters: React.FC<OffersAndPostersProps> = ({ onOpenBooking }) => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const vouchers = [
    {
      code: 'STAY6FREE1',
      discount: '1 DAY FREE BOARDING',
      title: 'Book 6 Days, Get 1 Day FREE',
      desc: 'Book 6+ nights of cage-free luxury boarding and your companion gets 1 full day 100% free at checkout.',
      badge: '🔥 6+ DAYS BOARDING',
      color: 'bg-emerald-600 text-white font-black',
      category: 'boarding',
      nights: 6,
    },
    {
      code: 'FREESPA',
      discount: 'FREE SPA BATH',
      title: 'Free Furry Fresh Spa (4+ Nights)',
      desc: 'Book 4+ nights boarding and receive a full Furry Fresh Spa bath & blow-dry for ₹0 at checkout.',
      badge: '4+ NIGHTS BOARDING',
      color: 'bg-emerald-700 text-white',
      category: 'boarding',
      nights: 4,
    },
    {
      code: 'FREESPA8',
      discount: 'FREE SPECIAL SPA',
      title: 'Special Spa Package (8+ Nights)',
      desc: 'Book 8+ nights boarding and unlock our Special Deep Spa & Paw Balm treatment for ₹0 at checkout.',
      badge: '8+ NIGHTS BOARDING',
      color: 'bg-amber-600 text-white',
      category: 'boarding',
      nights: 8,
    },
    {
      code: 'GROOM10',
      discount: 'FLAT 10% OFF',
      title: '10% OFF Orders Above ₹999',
      desc: 'Valid on any artisan dog or cat grooming package when the grooming order exceeds ₹999.',
      badge: 'GROOMING ONLY',
      color: 'bg-sanctuary-gold text-sanctuary-dark',
      category: 'grooming',
    },
  ];

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  return (
    <section
      id="offers"
      className="min-h-screen lg:h-screen lg:max-h-screen flex flex-col justify-center py-4 lg:py-6 px-4 sm:px-6 lg:px-8 bg-sanctuary-forest text-white relative text-left border-t border-black/5"
    >
      <div className="max-w-6xl mx-auto w-full space-y-4 sm:space-y-5">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 pb-2 border-b border-white/10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-sanctuary-gold/20 text-sanctuary-gold text-[10px] font-black uppercase tracking-wider mb-1">
              <span>Bangalore Ad Specials</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-white">
              Limited-Time Vouchers & Steal Deals
            </h2>
          </div>
          <p className="text-xs text-white/70 font-medium max-w-sm">
            Copy code to apply directly in online checkout.
          </p>
        </div>

        {/* 4 Voucher Cards Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {vouchers.map((v) => (
            <div
              key={v.code}
              className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/15 flex flex-col justify-between space-y-3 hover:border-sanctuary-gold/50 transition-all"
            >
              <div className="space-y-2">
                <span className={`text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full inline-block ${v.color}`}>
                  {v.badge}
                </span>

                <div>
                  <div className="text-xl font-black text-sanctuary-gold">{v.discount}</div>
                  <h3 className="text-sm font-black text-white mt-0.5">{v.title}</h3>
                  <p className="text-[11px] text-white/70 mt-0.5 leading-snug">{v.desc}</p>
                </div>

                {/* Promo Code Box */}
                <div className="p-2 bg-black/40 rounded-xl border border-white/10 flex items-center justify-between">
                  <span className="font-mono text-sm font-black text-sanctuary-gold tracking-wider">
                    {v.code}
                  </span>
                  <button
                    onClick={() => handleCopy(v.code)}
                    className="text-[10px] text-white/80 hover:text-white underline font-bold"
                  >
                    {copiedCode === v.code ? 'Copied! ✓' : 'Copy'}
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2">
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
                  className="w-full py-2.5 bg-sanctuary-gold hover:bg-amber-400 text-sanctuary-dark rounded-xl font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shadow-sm active:scale-95"
                >
                  <span>Apply & Book Now</span>
                  <span className="material-symbols-outlined text-sm font-bold">arrow_forward</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Real Ad Campaign Posters Preview */}
        <div className="grid sm:grid-cols-2 gap-4 pt-4 border-t border-white/10">
          <div className="bg-white/10 rounded-2xl p-3.5 border border-white/15 flex items-center gap-3.5">
            <img
              src="/images/offer_boarding_6days_free.jpg"
              alt="Book 6 Days Boarding Get 1 Day Free"
              className="size-20 sm:size-24 rounded-xl object-cover object-center shrink-0 border border-white/10 shadow"
            />
            <div className="space-y-1">
              <span className="bg-emerald-400 text-black text-[9px] font-black px-2 py-0.5 rounded uppercase">
                Boarding Privilege
              </span>
              <h4 className="text-sm font-black text-white">Book 6 Days = 1 Day FREE!</h4>
              <p className="text-[11px] text-white/70">
                100% cage-free, air-conditioned suites. Apply code <code className="font-mono font-bold text-sanctuary-gold">STAY6FREE1</code> for a free day.
              </p>
              <button
                onClick={() => {
                  window.dispatchEvent(
                    new CustomEvent('snip_open_booking', {
                      detail: {
                        appliedCouponCode: 'STAY6FREE1',
                        type: 'boarding',
                        nights: 6,
                        serviceName: 'Cage-Free Boarding Floor (6+ Days)',
                        basePrice: 625,
                      },
                    })
                  );
                }}
                className="text-[11px] text-sanctuary-gold underline font-bold hover:text-white"
              >
                Apply & Book 6+ Days &rarr;
              </button>
            </div>
          </div>

          <div className="bg-white/10 rounded-2xl p-3.5 border border-white/15 flex items-center gap-3.5">
            <img
              src="/images/offer_grooming_500_reward.jpg"
              alt="Grooming Spend Over ₹500 Reward"
              className="size-20 sm:size-24 rounded-xl object-cover object-center shrink-0 border border-white/10 shadow"
            />
            <div className="space-y-1">
              <span className="bg-amber-400 text-black text-[9px] font-black px-2 py-0.5 rounded uppercase">
                Grooming Special
              </span>
              <h4 className="text-sm font-black text-white">Grooming &gt; ₹500: Free Bath or Nail Clip</h4>
              <p className="text-[11px] text-white/70">
                Pick your free reward at checkout and show your booking confirmation in-store to claim!
              </p>
              <button
                onClick={() => {
                  window.dispatchEvent(
                    new CustomEvent('snip_open_booking', {
                      detail: {
                        type: 'grooming',
                        serviceName: 'Special Package Grooming',
                        basePrice: 899,
                      },
                    })
                  );
                }}
                className="text-[11px] text-sanctuary-gold underline font-bold hover:text-white"
              >
                Choose Grooming & Claim Perk &rarr;
              </button>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default OffersAndPosters;
