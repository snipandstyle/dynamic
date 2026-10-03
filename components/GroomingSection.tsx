import React, { useState } from 'react';
import { BookingDetails } from './CheckoutModal';

interface GroomingSectionProps {
  onOpenBooking: (details?: BookingDetails) => void;
}

export const GroomingSection: React.FC<GroomingSectionProps> = ({ onOpenBooking }) => {
  const [petType, setPetType] = useState<'dog' | 'cat'>('dog');
  const [size, setSize] = useState<'small' | 'medium' | 'large'>('small');
  const [activeCardIndex, setActiveCardIndex] = useState(0);

  const packages = [
    {
      id: 'furry-fresh',
      title: 'Furry Fresh',
      subtitle: 'Basic Hygiene Care',
      tag: 'HYGIENE CARE',
      tagBg: 'bg-emerald-100 text-emerald-800',
      popular: false,
      desc: 'Essential regular hygiene maintenance focused on deep cleansing without full body styling.',
      pricing: { small: 499, medium: 699, large: 849, cat: 749 },
      origPricing: { small: 649, medium: 899, large: 1099, cat: 999 },
      inclusions: [
        'Bath with Premium Shampoo & Conditioner',
        'Professional High-Velocity Blow Dry',
        'Combing & Brushing / De-tangling',
        'Gentle Ear Cleaning & Wax Removal',
        'Soothing Eye Cleaning',
        'Coat Deodorizing Spritz',
      ],
      note: 'Excludes sanitary clipping & haircut.',
    },
    {
      id: 'special-package',
      title: 'Special Package',
      subtitle: 'Enhanced Care & Dental',
      tag: '⭐ MOST POPULAR',
      tagBg: 'bg-sanctuary-gold text-sanctuary-dark font-black',
      popular: true,
      desc: 'Step up from basic hygiene adding essential dental hygiene, mouth spray, and paw pad balm.',
      pricing: { small: 899, medium: 949, large: 999, cat: 874 },
      origPricing: { small: 1124, medium: 1199, large: 1249, cat: 1199 },
      inclusions: [
        'Bath with Shampoo & Conditioner',
        'Professional High-Velocity Blow Dry',
        'Combing & Brushing',
        'Ear Cleaning & Eye Cleaning',
        'Freshening Mouth Spray',
        'Teeth Brushing & Plaque Cleanse',
        'Paw Pad Trimming & Soothing Balm',
      ],
    },
    {
      id: 'style-your-pet',
      title: 'Style Your Pet',
      subtitle: 'Full Body Breed Styling',
      tag: 'BREED STYLING',
      tagBg: 'bg-purple-100 text-purple-900',
      popular: false,
      desc: 'Signature breed styling package. Includes full body trim tailored to breed standards and face shaping.',
      pricing: { small: 1799, medium: 1799, large: 1799, cat: 1799 },
      origPricing: { small: 2249, medium: 2249, large: 2249, cat: 2249 },
      inclusions: [
        'Full Body Trimming & Scissor Styling',
        'Face Trimming & Beard Shaping',
        'Sanitary Clipping (Free Included)',
        'Ear & Eye Cleaning (Free Included)',
        'Combing & High-Velocity Blow Dry',
        'Freshening Mouth Spray (Free)',
      ],
    },
    {
      id: 'full-grooming',
      title: 'Full Grooming',
      subtitle: 'Ultimate Spa & Medicated Bath',
      tag: '👑 ULTIMATE SPA',
      tagBg: 'bg-sanctuary-forest text-white',
      popular: false,
      desc: 'Comprehensive head-to-tail pampering with therapeutic medicated bath to protect skin and coat.',
      pricing: { small: 2199, medium: 2199, large: 2199, cat: 2199 },
      origPricing: { small: 3249, medium: 3249, large: 3249, cat: 3249 },
      inclusions: [
        'Therapeutic Medicated Bath (Skin Relief)',
        'Shampoo & Conditioner Wash',
        'Full Body Haircut & Scissor Styling',
        'Deep Deshedding Treatment',
        'Sanitary Trim & Nail Clipping',
        'Ear & Eye Deep Clean + Mouth Spray',
      ],
    },
  ];

  const quickAddons = [
    { name: 'Teeth Brushing', price: 186, icon: 'dentistry' },
    { name: 'Ear & Eye Clean', price: 124, icon: 'visibility' },
    { name: 'Paw Relaxation', price: 124, icon: 'pets' },
    { name: 'Medicated Bath', price: 299, icon: 'medical_services' },
    { name: 'Body Massage', price: 499, icon: 'spa' },
    { name: 'Dematting', price: 499, icon: 'brush' },
    { name: 'Deshedding', price: 624, icon: 'content_cut' },
    { name: 'Waterless Bath', price: 499, icon: 'shower' },
  ];

  return (
    <section
      id="grooming"
      className="py-6 sm:py-8 lg:py-6 lg:min-h-screen lg:flex lg:flex-col lg:justify-center px-4 sm:px-6 lg:px-8 bg-white relative text-left border-t border-black/5"
    >
      <div className="max-w-7xl mx-auto w-full space-y-4 lg:space-y-5">
        
        {/* ============================================================ */}
        {/* COMPACT SECTION HEADER */}
        {/* ============================================================ */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-black/10">
          <div className="space-y-1 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-sanctuary-gold/15 text-sanctuary-dark text-[11px] font-black uppercase tracking-wider">
              <span className="material-symbols-outlined text-xs text-sanctuary-gold">spa</span>
              <span>Fear-Free Certified Stylists • 10% OFF Code: GROOM10</span>
            </div>
            
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-sanctuary-dark tracking-tight leading-tight">
              Signature <span className="text-sanctuary-gold">Pet Grooming</span> & Spa Menu
            </h2>

            <p className="text-xs text-sanctuary-dark/75 font-medium leading-normal hidden sm:block">
              Warm bubble hydrobaths, organic hypoallergenic shampoos, oral dental hygiene, and precision breed styling tailored to your pet’s skin health.
            </p>
          </div>

          {/* Species & Size Switcher Controls */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Dog / Cat Toggle */}
            <div className="flex items-center bg-sanctuary-sand p-1 rounded-xl border border-black/10 shadow-xs">
              <button
                onClick={() => setPetType('dog')}
                className={`px-3 py-1 rounded-lg text-xs font-black transition-all ${
                  petType === 'dog'
                    ? 'bg-sanctuary-forest text-white shadow-xs'
                    : 'text-sanctuary-dark/70 hover:text-sanctuary-dark'
                }`}
              >
                🐕 Dogs
              </button>
              <button
                onClick={() => setPetType('cat')}
                className={`px-3 py-1 rounded-lg text-xs font-black transition-all ${
                  petType === 'cat'
                    ? 'bg-sanctuary-forest text-white shadow-xs'
                    : 'text-sanctuary-dark/70 hover:text-sanctuary-dark'
                }`}
              >
                🐈 Cats
              </button>
            </div>

            {/* Dog Size Selector */}
            {petType === 'dog' && (
              <div className="flex items-center bg-white p-1 rounded-xl border border-black/10 shadow-xs">
                {[
                  { id: 'small', label: 'Small (<10kg)' },
                  { id: 'medium', label: 'Medium (10–25kg)' },
                  { id: 'large', label: 'Large (>25kg)' },
                ].map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setSize(s.id as any)}
                    className={`px-2 py-1 rounded-lg text-[11px] font-black transition-all ${
                      size === s.id
                        ? 'bg-sanctuary-gold text-sanctuary-dark shadow-xs'
                        : 'text-sanctuary-dark/70 hover:text-sanctuary-dark'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ============================================================ */}
        {/* MOBILE SIDE-SCROLLING / DESKTOP COMPACT 4-GRID */}
        {/* ============================================================ */}
        <div className="relative">
          <div 
            className="flex lg:grid overflow-x-auto snap-x snap-mandatory gap-4 pb-3 lg:pb-0 -mx-4 px-4 sm:mx-0 sm:px-0 lg:overflow-visible lg:grid-cols-4 no-scrollbar scroll-smooth"
            onScroll={(e) => {
              const target = e.currentTarget;
              const scrollLeft = target.scrollLeft;
              const cardWidth = target.offsetWidth * 0.78;
              const index = Math.round(scrollLeft / cardWidth);
              setActiveCardIndex(Math.min(Math.max(index, 0), packages.length - 1));
            }}
          >
            {packages.map((pkg) => {
              const price = petType === 'cat' ? pkg.pricing.cat : pkg.pricing[size];
              const orig = petType === 'cat' ? pkg.origPricing.cat : pkg.origPricing[size];
              const save = orig - price;

              return (
                <div
                  key={pkg.id}
                  className={`w-[82vw] sm:w-[320px] lg:w-auto shrink-0 snap-center bg-[#FAF8F5] rounded-2xl p-4 lg:p-4 border flex flex-col justify-between space-y-3.5 transition-all duration-300 relative group shadow-sm hover:shadow-lg ${
                    pkg.popular
                      ? 'border-sanctuary-gold ring-2 ring-sanctuary-gold/40 bg-white'
                      : 'border-black/10 hover:border-black/20'
                  }`}
                >
                  {pkg.popular && (
                    <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-sanctuary-gold text-sanctuary-dark text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm flex items-center gap-1 z-10">
                      <span className="material-symbols-outlined text-[11px]">star</span>
                      <span>Most Popular</span>
                    </div>
                  )}

                  <div className="space-y-2.5">
                    {/* Badge & Save */}
                    <div className="flex items-center justify-between">
                      <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${pkg.tagBg}`}>
                        {pkg.tag}
                      </span>
                      <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-md">
                        Save ₹{save}
                      </span>
                    </div>

                    {/* Title & Subtitle */}
                    <div>
                      <h3 className="text-lg lg:text-xl font-black text-sanctuary-dark leading-tight">
                        {pkg.title}
                      </h3>
                      <div className="text-[11px] font-bold text-sanctuary-gold mt-0.5">
                        {pkg.subtitle}
                      </div>
                      <p className="text-[11px] text-sanctuary-dark/70 font-medium mt-1 leading-snug line-clamp-2">
                        {pkg.desc}
                      </p>
                    </div>

                    {/* Pricing Box */}
                    <div className="p-2.5 bg-white rounded-xl border border-black/5 flex items-baseline justify-between shadow-xs">
                      <div>
                        <span className="text-[9px] text-sanctuary-dark/60 font-semibold block leading-tight">Full Package:</span>
                        <span className="text-xs line-through text-red-500 font-bold decoration-red-500">₹{orig}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-2xl font-black text-sanctuary-dark">₹{price}</span>
                      </div>
                    </div>

                    {/* Inclusions */}
                    <div className="space-y-1 pt-1 border-t border-black/5">
                      <span className="text-[9px] font-black uppercase tracking-wider text-sanctuary-dark/50 block mb-1">
                        Includes:
                      </span>
                      {pkg.inclusions.slice(0, 5).map((item, i) => (
                        <div key={i} className="flex items-start gap-1 text-[11px] leading-tight">
                          <span className="material-symbols-outlined text-emerald-600 text-xs shrink-0 mt-0.5">
                            check_circle
                          </span>
                          <span className="text-sanctuary-dark/80 font-medium">
                            {item}
                          </span>
                        </div>
                      ))}
                      {pkg.note && (
                        <div className="text-[9px] text-sanctuary-dark/50 italic pt-0.5">
                          *{pkg.note}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Book Package Button */}
                  <div className="pt-1">
                    <button
                      onClick={() =>
                        onOpenBooking({
                          type: 'grooming',
                          serviceName: pkg.title,
                          basePrice: price,
                          petType: petType,
                          petSize: size,
                        })
                      }
                      className={`w-full py-2.5 rounded-xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-sm transition-all active:scale-95 ${
                        pkg.popular
                          ? 'bg-sanctuary-forest hover:bg-black text-white shadow-md'
                          : 'bg-white hover:bg-sanctuary-sand text-sanctuary-dark border border-black/15'
                      }`}
                    >
                      <span>Book {pkg.title}</span>
                      <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Mobile Swipe Indicators */}
          <div className="flex lg:hidden items-center justify-between pt-1 px-1 text-[11px] text-sanctuary-dark/60 font-semibold">
            <span className="flex items-center gap-1">
              <span>👉 Swipe for more packages</span>
            </span>
            <div className="flex items-center gap-1.5">
              {packages.map((_, i) => (
                <span
                  key={i}
                  className={`h-1.5 rounded-full transition-all ${
                    activeCardIndex === i ? 'w-4 bg-sanctuary-forest' : 'w-1.5 bg-black/20'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* COMPACT INDIVIDUAL ADD-ONS & QUICK CARE STRIP */}
        {/* ============================================================ */}
        <div className="p-3.5 sm:p-4 bg-sanctuary-sand/40 rounded-2xl border border-black/10 space-y-2">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-sanctuary-gold text-base">content_cut</span>
              <h3 className="text-xs sm:text-sm font-black text-sanctuary-dark">
                Quick Add-Ons & Standalone Care
              </h3>
            </div>
            <button
              onClick={() => onOpenBooking()}
              className="py-1 px-2.5 bg-sanctuary-forest hover:bg-black text-white rounded-lg font-bold text-[10px] uppercase tracking-wider transition-colors shrink-0"
            >
              Add In Checkout
            </button>
          </div>

          {/* Horizontal scroll on mobile, compact 8-column grid on desktop */}
          <div className="flex overflow-x-auto lg:grid lg:grid-cols-8 gap-2 no-scrollbar py-0.5">
            {quickAddons.map((addon, i) => (
              <div
                key={i}
                onClick={() => onOpenBooking()}
                className="min-w-[105px] lg:min-w-0 p-2 bg-white rounded-xl border border-black/10 hover:border-sanctuary-gold text-center cursor-pointer transition-all hover:shadow-xs group shrink-0"
              >
                <span className="material-symbols-outlined text-sanctuary-gold text-base block mb-0.5 group-hover:scale-110 transition-transform">
                  {addon.icon}
                </span>
                <div className="text-[10px] font-black text-sanctuary-dark leading-tight truncate">
                  {addon.name}
                </div>
                <div className="text-[11px] font-black text-sanctuary-forest mt-0.5">
                  ₹{addon.price}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default GroomingSection;
