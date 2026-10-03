import React, { useState } from 'react';

interface OffersAndPostersProps {
  onOpenBooking: () => void;
}

export const OffersAndPosters: React.FC<OffersAndPostersProps> = ({ onOpenBooking }) => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const vouchers = [
    {
      code: 'SNIP15',
      discount: '15% OFF',
      title: 'First-Timer Welcome Offer',
      desc: 'Valid on any grooming package or boarding stay.',
      badge: 'POPULAR',
      color: 'bg-sanctuary-gold text-sanctuary-dark',
    },
    {
      code: 'SNIPVIP20',
      discount: '20% OFF',
      title: 'VIP Weekend Flash Special',
      desc: 'Exclusive discount on full breed haircuts and styling.',
      badge: 'LIMITED SLOTS',
      color: 'bg-sanctuary-forest text-white',
    },
    {
      code: 'FREESPA',
      discount: 'FREE REFRESH',
      title: '4+ Days Stay Reward',
      desc: 'Complimentary Furry Fresh grooming refresh (bath & dry) before checkout.',
      badge: 'BOARDING SPECIAL',
      color: 'bg-emerald-700 text-white',
    },
    {
      code: 'PETCAB50',
      discount: '50% OFF CAB',
      title: 'Doorstep AC Pet Taxi',
      desc: 'Half price pet taxi pickup and drop across South Bangalore.',
      badge: 'DOORSTEP TAXI',
      color: 'bg-purple-700 text-white',
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
                  onClick={onOpenBooking}
                  className="w-full py-2.5 bg-sanctuary-gold hover:bg-amber-400 text-sanctuary-dark rounded-xl font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shadow-sm"
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
              src="/images/before_after_grooming.jpg"
              alt="Before & After Grooming"
              className="size-20 sm:size-24 rounded-xl object-cover object-top shrink-0 border border-white/10 shadow"
            />
            <div className="space-y-1">
              <span className="bg-amber-400 text-black text-[9px] font-black px-2 py-0.5 rounded uppercase">
                Summer Special
              </span>
              <h4 className="text-sm font-black text-white">First 10 Customers FREE Bath</h4>
              <p className="text-[11px] text-white/70">
                New guests at our Kanakapura Road studio get a complimentary bath with grooming.
              </p>
              <button
                onClick={onOpenBooking}
                className="text-[11px] text-sanctuary-gold underline font-bold hover:text-white"
              >
                Claim in Checkout &rarr;
              </button>
            </div>
          </div>

          <div className="bg-white/10 rounded-2xl p-3.5 border border-white/15 flex items-center gap-3.5">
            <img
              src="/images/brand_flyer_boarding.jpg"
              alt="Clean Cat & Dog Boarding"
              className="size-20 sm:size-24 rounded-xl object-cover object-top shrink-0 border border-white/10 shadow"
            />
            <div className="space-y-1">
              <span className="bg-emerald-400 text-black text-[9px] font-black px-2 py-0.5 rounded uppercase">
                Holiday Stay Reward
              </span>
              <h4 className="text-sm font-black text-white">4+ Days = Free Grooming Refresh</h4>
              <p className="text-[11px] text-white/70">
                100% cage-free, air-conditioned studio floor with daily WhatsApp photo updates.
              </p>
              <button
                onClick={onOpenBooking}
                className="text-[11px] text-sanctuary-gold underline font-bold hover:text-white"
              >
                Book Nights & Get Spa &rarr;
              </button>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default OffersAndPosters;
