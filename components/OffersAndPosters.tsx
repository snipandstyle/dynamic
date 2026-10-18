import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface OffersAndPostersProps {
  onOpenBooking: () => void;
}

export const OffersAndPosters: React.FC<OffersAndPostersProps> = ({ onOpenBooking }) => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [previewPoster, setPreviewPoster] = useState<{ src: string; title: string; code?: string } | null>(null);

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
      code: 'GROOM10',
      discount: 'FLAT 10% OFF',
      title: '10% OFF Orders Above ₹999',
      desc: 'Valid on any artisan dog or cat grooming package when the grooming order exceeds ₹999.',
      badge: 'GROOMING ONLY',
      color: 'bg-sanctuary-gold text-sanctuary-dark',
      category: 'grooming',
    },
  ];

  const dasaraFlyers = [
    {
      id: 'nature_boarding',
      image: '/images/flyer_dasara_boarding_nature.jpg',
      badge: 'DASARA VACATION DEAL',
      badgeColor: 'bg-emerald-500 text-black',
      title: 'Dasara Nature Boarding Resort',
      highlight: '6 Days = 1 Day FREE • Free Spa on 4+ Nts',
      desc: '100% cage-free freedom, fresh air nature walks & 24/7 care away from city noise on Kanakapura Highway.',
      code: 'STAY6FREE1',
      bookingDetail: {
        appliedCouponCode: 'STAY6FREE1',
        type: 'boarding',
        nights: 6,
        serviceName: 'Cage-Free Boarding Floor (6+ Days)',
        basePrice: 625,
      },
    },
    {
      id: 'ayudha_pooja',
      image: '/images/flyer_ayudha_pooja_explosive.jpg',
      badge: 'AYUDHA POOJA MAKEOVER',
      badgeColor: 'bg-amber-400 text-black',
      title: 'Festive Pet Spa & Deep Grooming',
      highlight: '10% OFF Above ₹999 • Free Bath / Nail Clip > ₹500',
      desc: 'Make your pet shine this festival! Tearless organic herbal bath, deshedding & neat hygiene trims for a clean home.',
      code: 'GROOM10',
      bookingDetail: {
        appliedCouponCode: 'GROOM10',
        type: 'grooming',
        serviceName: 'Special Package Care & Spa',
        basePrice: 899,
      },
    },
    {
      id: 'last_minute',
      image: '/images/flyer_dasara_last_minute_boarding.jpg',
      badge: 'LIMITED AVAILABILITY',
      badgeColor: 'bg-red-500 text-white',
      title: 'Holiday Rush: Only 8 Suites Left',
      highlight: 'Zero Wire Cages • On Direct Highway Exit',
      desc: 'Heading out of Bangalore for Dasara? Convenient drop-off on NH 948 Kanakapura Road before hitting holiday traffic.',
      code: 'FREESPA',
      bookingDetail: {
        appliedCouponCode: 'FREESPA',
        type: 'boarding',
        nights: 4,
        serviceName: 'Cage-Free Boarding Floor',
        basePrice: 625,
      },
    },
    {
      id: 'sparkle_grooming',
      image: '/images/flyer_dasara_grooming_makeover.jpg',
      badge: 'SIGNATURE STYLING',
      badgeColor: 'bg-purple-400 text-black',
      title: 'Festive Sparkle Grooming & Spa',
      highlight: 'Full Breed Styling & Therapeutic Medicated Bath',
      desc: 'Certified low-stress handling, sanitized tools, breed-specific trimming, and fresh floral coat misting.',
      code: 'GROOM10',
      bookingDetail: {
        appliedCouponCode: 'GROOM10',
        type: 'grooming',
        serviceName: 'Style Your Pet Breed Trim',
        basePrice: 1799,
      },
    },
  ];

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const handleBookFlyer = (detail: any) => {
    window.dispatchEvent(new CustomEvent('snip_open_booking', { detail }));
  };

  return (
    <section
      id="offers"
      className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-sanctuary-forest text-white relative text-left border-t border-black/5"
    >
      <div className="max-w-6xl mx-auto w-full space-y-8 sm:space-y-10">
        
        {/* Clean Offers Sub-Bar (Heading Removed per user request) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10 text-xs">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-sanctuary-gold text-lg">local_activity</span>
            <span className="font-black text-sanctuary-gold uppercase tracking-wider text-[11px]">
              Active Festival Vouchers • Automatic Discount at Checkout
            </span>
          </div>
          <span className="text-[11px] text-white/70 font-medium">
            📍 Book Online & Show in Store at Kanakapura Main Road Studio
          </span>
        </div>

        {/* 3 Canonical Voucher Cards */}
        <div className="grid sm:grid-cols-3 gap-4">
          {vouchers.map((v) => (
            <div
              key={v.code}
              className="bg-white/5 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-white/15 flex flex-col justify-between space-y-3 hover:border-sanctuary-gold/50 transition-all shadow-md"
            >
              <div className="space-y-2">
                <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full inline-block ${v.color}`}>
                  {v.badge}
                </span>

                <div>
                  <div className="text-xl sm:text-2xl font-black text-sanctuary-gold">{v.discount}</div>
                  <h3 className="text-sm sm:text-base font-black text-white mt-0.5">{v.title}</h3>
                  <p className="text-[11px] text-white/75 mt-0.5 leading-snug">{v.desc}</p>
                </div>

                {/* Promo Code Box */}
                <div className="p-2.5 bg-black/40 rounded-xl border border-white/10 flex items-center justify-between">
                  <span className="font-mono text-sm sm:text-base font-black text-sanctuary-gold tracking-wider">
                    {v.code}
                  </span>
                  <button
                    onClick={() => handleCopy(v.code)}
                    className="text-[10px] text-white/80 hover:text-white underline font-bold"
                  >
                    {copiedCode === v.code ? 'Copied! ✓' : 'Copy Code'}
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
                          basePrice: v.category === 'boarding' ? 625 : 899,
                        },
                      })
                    );
                  }}
                  className="w-full py-2.5 bg-sanctuary-gold hover:bg-amber-400 text-sanctuary-dark rounded-xl font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shadow-sm active:scale-95 cursor-pointer"
                >
                  <span>Apply & Book Now</span>
                  <span className="material-symbols-outlined text-sm font-bold">arrow_forward</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Real Ad Campaign Posters Grid */}
        <div className="space-y-4 pt-4 border-t border-white/10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <h3 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-sanctuary-gold text-xl">campaign</span>
              <span>Official Festival Ad Flyers (Save & Share)</span>
            </h3>
            <span className="text-[11px] text-sanctuary-gold/90 font-bold">
              Tap any flyer to enlarge or instantly book
            </span>
          </div>

          {/* ============================================================ */}
          {/* LAPTOP / DESKTOP VIEW (Dedicated 2-Column Showcase Grid) */}
          {/* ============================================================ */}
          <div className="hidden md:grid md:grid-cols-2 gap-5">
            {dasaraFlyers.map((flyer) => (
              <div
                key={`desktop_${flyer.id}`}
                className="bg-white/10 rounded-3xl overflow-hidden border border-white/15 hover:border-sanctuary-gold/60 transition-all group shadow-xl flex"
              >
                {/* Flyer Visual - full 3:4 portrait poster, completely legible without distortion! */}
                <div
                  onClick={() => setPreviewPoster({ src: flyer.image, title: flyer.title, code: flyer.code })}
                  className="w-48 lg:w-56 aspect-[3/4] shrink-0 relative cursor-pointer overflow-hidden bg-black/60 border-r border-white/10"
                >
                  <img
                    src={flyer.image}
                    alt={flyer.title}
                    className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute top-2 left-2">
                    <span className={`text-[8.5px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm ${flyer.badgeColor}`}>
                      {flyer.badge}
                    </span>
                  </div>
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="py-1 px-2.5 bg-white/95 text-black text-[10px] font-black rounded-lg shadow-md flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs">zoom_in</span>
                      <span>Enlarge</span>
                    </span>
                  </div>
                </div>

                {/* Content & Action alongside the flyer */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-2 text-left">
                  <div className="space-y-1">
                    <span className="text-[10px] text-sanctuary-gold font-bold uppercase tracking-wider block">
                      {flyer.badge}
                    </span>
                    <h4 className="text-sm lg:text-base font-black text-white leading-snug">
                      {flyer.title}
                    </h4>
                    <p className="text-[11px] font-bold text-amber-300">
                      {flyer.highlight}
                    </p>
                    <p className="text-[10px] text-white/70 line-clamp-3 leading-relaxed">
                      {flyer.desc}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-white/10 space-y-2">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-white/60 font-medium">Coupon Code:</span>
                      <span className="font-mono font-black text-sanctuary-gold bg-black/40 px-2 py-0.5 rounded border border-white/10">
                        {flyer.code}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleBookFlyer(flyer.bookingDetail)}
                      className="w-full py-2 bg-sanctuary-gold hover:bg-amber-400 text-sanctuary-dark rounded-xl font-black text-[11px] uppercase tracking-wider transition-all flex items-center justify-center gap-1 shadow-sm active:scale-95 cursor-pointer"
                    >
                      <span>Book with Code {flyer.code}</span>
                      <span className="material-symbols-outlined text-xs">arrow_forward</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ============================================================ */}
          {/* MOBILE VIEW (Dedicated Swipeable Cards - Artwork 100% Clear) */}
          {/* ============================================================ */}
          <div className="block md:hidden">
            <div className="flex overflow-x-auto snap-x snap-mandatory gap-3.5 no-scrollbar pb-2 -mx-4 px-4">
              {dasaraFlyers.map((flyer) => (
                <div
                  key={`mobile_${flyer.id}`}
                  className="w-[82vw] max-w-[310px] shrink-0 snap-center rounded-2xl overflow-hidden border border-white/15 bg-white/10 shadow-xl flex flex-col justify-between"
                >
                  {/* Full uncropped Flyer Visual */}
                  <div
                    onClick={() => setPreviewPoster({ src: flyer.image, title: flyer.title, code: flyer.code })}
                    className="relative w-full aspect-[3/4] overflow-hidden bg-black cursor-pointer"
                  >
                    <img
                      src={flyer.image}
                      alt={flyer.title}
                      className="w-full h-full object-cover object-top"
                    />
                    <div className="absolute top-2 left-2">
                      <span className={`text-[8.5px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm ${flyer.badgeColor}`}>
                        {flyer.badge}
                      </span>
                    </div>
                    <div className="absolute bottom-2 right-2 bg-black/70 text-white text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <span className="material-symbols-outlined text-[10px]">zoom_in</span>
                      <span>Tap to enlarge</span>
                    </div>
                  </div>

                  {/* Dedicated Action Bar UNDER the flyer */}
                  <div className="p-3 bg-gradient-to-r from-sanctuary-forest to-[#1A3326] text-white flex flex-col space-y-2 border-t border-amber-400/30">
                    <div className="text-left">
                      <div className="text-xs font-black text-white leading-tight">
                        {flyer.title}
                      </div>
                      <div className="text-[10px] font-bold text-amber-300 mt-0.5">
                        {flyer.highlight}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleBookFlyer(flyer.bookingDetail)}
                      className="w-full py-2 bg-sanctuary-gold text-sanctuary-dark rounded-xl font-black text-[11px] uppercase tracking-wider flex items-center justify-center gap-1 shadow-sm active:scale-95"
                    >
                      <span>Book with Code {flyer.code}</span>
                      <span className="material-symbols-outlined text-xs">arrow_forward</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center text-[10px] text-white/60 font-bold pt-1 flex items-center justify-center gap-1">
              <span>👉 Swipe to view all 4 festival passes</span>
            </div>
          </div>
        </div>

      </div>

      {/* Full Flyer Lightbox Modal */}
      <AnimatePresence>
        {previewPoster && (
          <div
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
            onClick={() => setPreviewPoster(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#1A1A1A] rounded-2xl max-w-md w-full overflow-hidden border border-white/20 shadow-2xl space-y-3 p-3 text-left"
            >
              <div className="flex items-center justify-between pb-1 px-1 border-b border-white/10">
                <span className="text-xs font-black text-white">{previewPoster.title}</span>
                <button
                  onClick={() => setPreviewPoster(null)}
                  className="size-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">close</span>
                </button>
              </div>

              <div className="rounded-xl overflow-hidden max-h-[70vh] flex items-center justify-center bg-black">
                <img
                  src={previewPoster.src}
                  alt={previewPoster.title}
                  className="w-full h-auto max-h-[70vh] object-contain"
                />
              </div>

              <div className="flex gap-2 pt-1 px-1">
                <a
                  href={previewPoster.src}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-black uppercase tracking-wider text-center flex items-center justify-center gap-1 transition-colors"
                >
                  <span className="material-symbols-outlined text-sm">download</span>
                  <span>Save Flyer</span>
                </a>
                <button
                  onClick={() => {
                    setPreviewPoster(null);
                    window.dispatchEvent(
                      new CustomEvent('snip_open_booking', {
                        detail: {
                          appliedCouponCode: previewPoster.code || 'STAY6FREE1',
                          type: previewPoster.code === 'GROOM10' ? 'grooming' : 'boarding',
                          nights: previewPoster.code === 'STAY6FREE1' ? 6 : 4,
                          serviceName: previewPoster.code === 'GROOM10' ? 'Special Package Care' : 'Cage-Free Boarding Floor',
                          basePrice: previewPoster.code === 'GROOM10' ? 899 : 625,
                        },
                      })
                    );
                  }}
                  className="flex-1 py-2 bg-sanctuary-gold hover:bg-amber-400 text-sanctuary-dark rounded-xl text-xs font-black uppercase tracking-wider text-center flex items-center justify-center gap-1 transition-colors cursor-pointer"
                >
                  <span>Book with Code</span>
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default OffersAndPosters;
