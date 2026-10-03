import React, { useState } from 'react';
import { BookingDetails } from './CheckoutModal';

interface BoardingSectionProps {
  onOpenBooking: (details?: BookingDetails) => void;
}

export const BoardingSection: React.FC<BoardingSectionProps> = ({ onOpenBooking }) => {
  const [petCategory, setPetCategory] = useState<'dog' | 'cat'>('dog');
  const [activeDogIndex, setActiveDogIndex] = useState(0);

  const dogTiers = [
    {
      id: 'small',
      size: 'small' as const,
      title: 'Small Dogs',
      weight: 'Under 10 kg',
      examples: 'Shih Tzu, Pug, Maltese, Beagle, Frenchie, Puppies',
      badge: 'GENTLE & COZY',
      badgeBg: 'bg-emerald-100 text-emerald-800',
      price: 625,
      orig: 750,
      save: 125,
      inclusions: [
        'Private individual AC suite with soundproof walls',
        'Anti-bacterial memory foam orthopaedic bedding',
        '2 daily green lawn walks & interactive play',
        'Twice-daily WhatsApp 4K video reels & updates',
        'Freshly prepared home meals to your schedule',
      ],
    },
    {
      id: 'medium',
      size: 'medium' as const,
      title: 'Medium Dogs',
      weight: '10 – 25 kg',
      examples: 'Labrador, Golden Retriever, Cocker Spaniel, Indies',
      badge: '⭐ MOST POPULAR',
      badgeBg: 'bg-sanctuary-gold text-sanctuary-dark font-black',
      popular: true,
      price: 750,
      orig: 899,
      save: 149,
      inclusions: [
        'Spacious walk-in private suite with glass view door',
        'Hypoallergenic orthopaedic bolster mattress',
        '3 daily active fetch & exercise romps on turf',
        'Daily WhatsApp video reels with assigned caretaker',
        'FREE Furry Fresh Spa refresh on 4+ nights',
      ],
    },
    {
      id: 'large',
      size: 'large' as const,
      title: 'Large Dogs',
      weight: 'Over 25 kg',
      examples: 'German Shepherd, Rottweiler, Husky, Great Dane',
      badge: 'EXTRA SPACIOUS',
      badgeBg: 'bg-sanctuary-forest text-white',
      price: 875,
      orig: 1050,
      save: 175,
      inclusions: [
        'Double-size master suite for big breeds & siblings',
        'King-size orthopaedic bed with high-density foam',
        'High-energy agility runs & muscle stretch walks',
        '24/7 dedicated senior caretaker companionship',
        'Doorstep AC Pet Cab pickup available (+₹299)',
      ],
    },
  ];

  const catTiers = [
    {
      id: 'cat-neutered',
      type: 'neutered' as const,
      title: 'Neutered Cats',
      weight: 'Quiet Feline Loft',
      examples: 'Persian, British Shorthair, Indie Cats, Siamese',
      badge: 'CALM & SOCIAL',
      badgeBg: 'bg-emerald-100 text-emerald-800',
      popular: true,
      price: 625,
      orig: 750,
      save: 125,
      inclusions: [
        'Completely soundproofed loft away from dog barking',
        'Multi-tiered vertical climbing towers & sisal scratching posts',
        'Private sanitized litter box refreshed 3x daily',
        'Daily laser chasing, catnip games & gentle brushing',
        'Twice-daily WhatsApp 4K video reels to pet parents',
      ],
    },
    {
      id: 'cat-non-neutered',
      type: 'non-neutered' as const,
      title: 'Non-Neutered Cats',
      weight: 'Dedicated Isolation Cabin',
      examples: 'Tomcats, Unneutered Queens, Sensitive Felines',
      badge: 'DEDICATED CABIN',
      badgeBg: 'bg-sanctuary-gold text-sanctuary-dark font-black',
      price: 750,
      orig: 899,
      save: 149,
      inclusions: [
        'Individual sanitized private suite with zero cross-contact',
        'Diffused calming Feliway pheromones to reduce stress',
        'Independent playtime sessions with dedicated handler',
        'Special dietary and medical monitoring according to parent instructions',
        'Daily real-time WhatsApp check-ins and video updates',
      ],
    },
  ];

  return (
    <section
      id="boarding"
      className="py-6 sm:py-8 lg:py-8 bg-[#FAF8F5] relative text-left border-t border-black/5"
    >
      <div className="max-w-7xl mx-auto w-full space-y-4 lg:space-y-5 px-4 sm:px-6 lg:px-8">
        
        {/* ============================================================ */}
        {/* COMPACT SECTION HEADER */}
        {/* ============================================================ */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-black/10">
          <div className="space-y-1 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-sanctuary-moss/10 text-sanctuary-moss text-[11px] font-black uppercase tracking-wider">
              <span className="material-symbols-outlined text-xs">nature_people</span>
              <span>100% Single-Floor Studio • Kanakapura Highway (NH 948)</span>
            </div>
            
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-sanctuary-dark tracking-tight leading-tight">
              Transparent <span className="text-sanctuary-gold">Boarding Rates</span> & Inclusions
            </h2>

            <p className="text-xs text-sanctuary-dark/75 font-medium leading-normal hidden sm:block">
              Zero wire cages, climate-controlled AC suites, orthopaedic memory foam bedding, 2 daily nature walks, and real-time WhatsApp 4K journals.
            </p>
          </div>

          {/* Dog vs Cat Category Switcher */}
          <div className="flex items-center bg-white p-1 rounded-xl border border-black/10 shadow-xs self-start md:self-auto">
            <button
              onClick={() => setPetCategory('dog')}
              className={`px-3 py-1 rounded-lg text-xs font-black transition-all flex items-center gap-1.5 ${
                petCategory === 'dog'
                  ? 'bg-sanctuary-forest text-white shadow-xs'
                  : 'text-sanctuary-dark/70 hover:text-sanctuary-dark'
              }`}
            >
              <span>🐕 Dog Boarding</span>
            </button>
            <button
              onClick={() => setPetCategory('cat')}
              className={`px-3 py-1 rounded-lg text-xs font-black transition-all flex items-center gap-1.5 ${
                petCategory === 'cat'
                  ? 'bg-sanctuary-forest text-white shadow-xs'
                  : 'text-sanctuary-dark/70 hover:text-sanctuary-dark'
              }`}
            >
              <span>🐈 Cat Boarding</span>
            </button>
          </div>
        </div>

        {/* ============================================================ */}
        {/* MOBILE SIDE-SCROLLING CARDS / DESKTOP COMPACT GRID */}
        {/* ============================================================ */}
        <div className="relative">
          {petCategory === 'dog' ? (
            <div 
              className="flex md:grid overflow-x-auto snap-x snap-mandatory gap-4 pb-3 md:pb-0 -mx-4 px-4 sm:mx-0 sm:px-0 md:overflow-visible md:grid-cols-3 no-scrollbar scroll-smooth"
              onScroll={(e) => {
                const target = e.currentTarget;
                const scrollLeft = target.scrollLeft;
                const cardWidth = target.offsetWidth * 0.78;
                const index = Math.round(scrollLeft / cardWidth);
                setActiveDogIndex(Math.min(Math.max(index, 0), dogTiers.length - 1));
              }}
            >
              {dogTiers.map((tier) => (
                <div
                  key={tier.id}
                  className={`w-[82vw] sm:w-[320px] md:w-auto shrink-0 snap-center bg-white rounded-2xl p-4 lg:p-5 border flex flex-col justify-between space-y-3.5 transition-all duration-300 relative group shadow-sm hover:shadow-lg ${
                    tier.popular
                      ? 'border-sanctuary-gold ring-2 ring-sanctuary-gold/40'
                      : 'border-black/10 hover:border-black/20'
                  }`}
                >
                  {tier.popular && (
                    <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-sanctuary-gold text-sanctuary-dark text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm flex items-center gap-1 z-10">
                      <span className="material-symbols-outlined text-[11px]">star</span>
                      <span>Most Popular</span>
                    </div>
                  )}

                  <div className="space-y-2.5">
                    {/* Badge & Daily Save */}
                    <div className="flex items-center justify-between">
                      <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${tier.badgeBg}`}>
                        {tier.badge}
                      </span>
                      <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-md">
                        Save ₹{tier.save}/day
                      </span>
                    </div>

                    {/* Title & Breed Examples */}
                    <div>
                      <h3 className="text-lg lg:text-xl font-black text-sanctuary-dark leading-tight">
                        {tier.title}
                      </h3>
                      <div className="text-[11px] font-bold text-sanctuary-gold mt-0.5">
                        {tier.weight}
                      </div>
                      <p className="text-[11px] text-sanctuary-dark/65 font-medium mt-1 leading-snug line-clamp-2">
                        {tier.examples}
                      </p>
                    </div>

                    {/* Pricing Box */}
                    <div className="p-2.5 bg-sanctuary-sand/40 rounded-xl border border-black/5 flex items-baseline justify-between shadow-xs">
                      <div>
                        <span className="text-[9px] text-sanctuary-dark/60 font-semibold block leading-tight">Daily All-Inclusive:</span>
                        <span className="text-xs line-through text-red-500 font-bold decoration-red-500">₹{tier.orig}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-2xl font-black text-sanctuary-dark">₹{tier.price}</span>
                        <span className="text-xs text-sanctuary-dark/60 font-bold"> / night</span>
                      </div>
                    </div>

                    {/* Inclusions Checklist */}
                    <div className="space-y-1 pt-1 border-t border-black/5">
                      <span className="text-[9px] font-black uppercase tracking-wider text-sanctuary-dark/50 block mb-1">
                        Stay Inclusions:
                      </span>
                      {tier.inclusions.map((item, i) => (
                        <div key={i} className="flex items-start gap-1 text-[11px] leading-tight">
                          <span className="material-symbols-outlined text-emerald-600 text-xs shrink-0 mt-0.5">
                            check_circle
                          </span>
                          <span className="text-sanctuary-dark/80 font-medium">
                            {item}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Direct Book Button */}
                  <div className="pt-1">
                    <button
                      onClick={() =>
                        onOpenBooking({
                          type: 'boarding',
                          serviceName: `${tier.title} Boarding`,
                          basePrice: tier.price,
                          petType: 'dog',
                          petSize: tier.size,
                          nights: 4,
                        })
                      }
                      className={`w-full py-2.5 rounded-xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-sm transition-all active:scale-95 ${
                        tier.popular
                          ? 'bg-sanctuary-forest hover:bg-black text-white shadow-md'
                          : 'bg-white hover:bg-sanctuary-sand text-sanctuary-dark border border-black/15'
                      }`}
                    >
                      <span>Reserve {tier.title}</span>
                      <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* CAT TIERS (2 CARDS) */
            <div className="flex md:grid overflow-x-auto snap-x snap-mandatory gap-4 pb-3 md:pb-0 -mx-4 px-4 sm:mx-0 sm:px-0 md:overflow-visible md:grid-cols-2 max-w-4xl mx-auto no-scrollbar">
              {catTiers.map((tier) => (
                <div
                  key={tier.id}
                  className={`w-[82vw] sm:w-[320px] md:w-auto shrink-0 snap-center bg-white rounded-2xl p-4 lg:p-5 border flex flex-col justify-between space-y-3.5 transition-all duration-300 relative shadow-sm hover:shadow-lg ${
                    tier.popular
                      ? 'border-sanctuary-gold ring-2 ring-sanctuary-gold/40'
                      : 'border-black/10 hover:border-black/20'
                  }`}
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${tier.badgeBg}`}>
                        {tier.badge}
                      </span>
                      <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-md">
                        Save ₹{tier.save}/day
                      </span>
                    </div>

                    <div>
                      <h3 className="text-lg lg:text-xl font-black text-sanctuary-dark leading-tight">
                        {tier.title}
                      </h3>
                      <div className="text-[11px] font-bold text-sanctuary-gold mt-0.5">
                        {tier.weight}
                      </div>
                      <p className="text-[11px] text-sanctuary-dark/65 font-medium mt-1 leading-snug line-clamp-2">
                        {tier.examples}
                      </p>
                    </div>

                    <div className="p-2.5 bg-sanctuary-sand/40 rounded-xl border border-black/5 flex items-baseline justify-between shadow-xs">
                      <div>
                        <span className="text-[9px] text-sanctuary-dark/60 font-semibold block leading-tight">Daily All-Inclusive:</span>
                        <span className="text-xs line-through text-red-500 font-bold decoration-red-500">₹{tier.orig}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-2xl font-black text-sanctuary-dark">₹{tier.price}</span>
                        <span className="text-xs text-sanctuary-dark/60 font-bold"> / night</span>
                      </div>
                    </div>

                    <div className="space-y-1 pt-1 border-t border-black/5">
                      <span className="text-[9px] font-black uppercase tracking-wider text-sanctuary-dark/50 block mb-1">
                        Stay Inclusions:
                      </span>
                      {tier.inclusions.map((item, i) => (
                        <div key={i} className="flex items-start gap-1 text-[11px] leading-tight">
                          <span className="material-symbols-outlined text-emerald-600 text-xs shrink-0 mt-0.5">
                            check_circle
                          </span>
                          <span className="text-sanctuary-dark/80 font-medium">
                            {item}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-1">
                    <button
                      onClick={() =>
                        onOpenBooking({
                          type: 'boarding',
                          serviceName: `${tier.title} Boarding`,
                          basePrice: tier.price,
                          petType: 'cat',
                          petSize: 'small',
                          catType: tier.type,
                          nights: 4,
                        })
                      }
                      className="w-full py-2.5 bg-sanctuary-forest hover:bg-black text-white rounded-xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md transition-all active:scale-95"
                    >
                      <span>Reserve {tier.title}</span>
                      <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Mobile Swipe Indicators for Dogs */}
          {petCategory === 'dog' && (
            <div className="flex md:hidden items-center justify-between pt-1 px-1 text-[11px] text-sanctuary-dark/60 font-semibold">
              <span>👉 Swipe weight classes</span>
              <div className="flex items-center gap-1.5">
                {dogTiers.map((_, i) => (
                  <span
                    key={i}
                    className={`h-1.5 rounded-full transition-all ${
                      activeDogIndex === i ? 'w-4 bg-sanctuary-forest' : 'w-1.5 bg-black/20'
                    }`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ============================================================ */}
        {/* COMPACT MILESTONE REWARDS ON EXTENDED STAYS */}
        {/* ============================================================ */}
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-sanctuary-gold text-base">hotel_class</span>
              <h3 className="text-xs sm:text-sm font-black text-sanctuary-dark">
                Extended Stay Perks (Free Spa Treatments)
              </h3>
            </div>
            <span className="text-[10px] text-sanctuary-dark/60 font-semibold hidden sm:inline">Applied automatically in checkout</span>
          </div>

          <div className="flex md:grid overflow-x-auto snap-x gap-2.5 pb-1 -mx-4 px-4 sm:mx-0 sm:px-0 md:overflow-visible md:grid-cols-3 no-scrollbar">
            <div className="min-w-[260px] md:min-w-0 shrink-0 snap-start p-3 rounded-xl bg-sanctuary-forest text-white flex items-center justify-between gap-2.5 shadow-xs border border-emerald-500/20">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-sanctuary-gold text-sanctuary-dark text-[9px] font-black rounded-md uppercase">
                  4+ Nights
                </span>
                <div>
                  <div className="text-xs font-black text-white leading-tight">
                    FREE Furry Fresh Spa
                  </div>
                  <div className="text-[10px] text-white/70">
                    Bath & dry before checkout (₹749 Value)
                  </div>
                </div>
              </div>
              <button
                onClick={() =>
                  onOpenBooking({
                    type: 'boarding',
                    serviceName: 'Boarding Stay',
                    basePrice: 750,
                    petType: 'dog',
                    petSize: 'medium',
                    nights: 4,
                  })
                }
                className="py-1 px-2.5 bg-sanctuary-gold hover:bg-amber-400 text-sanctuary-dark rounded-lg font-black text-[9px] uppercase tracking-wider shrink-0 transition-all shadow-xs"
              >
                Claim
              </button>
            </div>

            <div className="min-w-[260px] md:min-w-0 shrink-0 snap-start p-3 rounded-xl bg-sanctuary-dark text-white flex items-center justify-between gap-2.5 shadow-xs border border-amber-500/20">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-amber-400 text-sanctuary-dark text-[9px] font-black rounded-md uppercase">
                  8+ Nights
                </span>
                <div>
                  <div className="text-xs font-black text-white leading-tight">
                    FREE Special Package
                  </div>
                  <div className="text-[10px] text-white/70">
                    Dental hygiene & paw care (₹999 Value)
                  </div>
                </div>
              </div>
              <button
                onClick={() =>
                  onOpenBooking({
                    type: 'boarding',
                    serviceName: 'Boarding Stay',
                    basePrice: 750,
                    petType: 'dog',
                    petSize: 'medium',
                    nights: 8,
                  })
                }
                className="py-1 px-2.5 bg-amber-400 hover:bg-amber-300 text-sanctuary-dark rounded-lg font-black text-[9px] uppercase tracking-wider shrink-0 transition-all shadow-xs"
              >
                Claim
              </button>
            </div>

            <div className="min-w-[260px] md:min-w-0 shrink-0 snap-start p-3 rounded-xl bg-purple-950 text-white flex items-center justify-between gap-2.5 shadow-xs border border-purple-500/20">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-purple-400 text-purple-950 text-[9px] font-black rounded-md uppercase">
                  15+ Nights
                </span>
                <div>
                  <div className="text-xs font-black text-white leading-tight">
                    FREE Full Grooming
                  </div>
                  <div className="text-[10px] text-white/70">
                    Therapeutic bath & styling (₹2,199 Value)
                  </div>
                </div>
              </div>
              <button
                onClick={() =>
                  onOpenBooking({
                    type: 'boarding',
                    serviceName: 'Boarding Stay',
                    basePrice: 750,
                    petType: 'dog',
                    petSize: 'medium',
                    nights: 15,
                  })
                }
                className="py-1 px-2.5 bg-purple-400 hover:bg-purple-300 text-purple-950 rounded-lg font-black text-[9px] uppercase tracking-wider shrink-0 transition-all shadow-xs"
              >
                Claim
              </button>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* COMPACT 4 FEATURE BADGES STRIP */}
        {/* ============================================================ */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pt-1">
          <div className="p-2.5 bg-white rounded-xl border border-black/5 flex items-center gap-2 shadow-xs">
            <span className="material-symbols-outlined text-sanctuary-forest text-lg">block</span>
            <div>
              <div className="text-[11px] font-black text-sanctuary-dark leading-tight">Zero Wire Cages</div>
              <div className="text-[9px] text-sanctuary-dark/60 font-semibold">100% Floor Freedom</div>
            </div>
          </div>
          <div className="p-2.5 bg-white rounded-xl border border-black/5 flex items-center gap-2 shadow-xs">
            <span className="material-symbols-outlined text-sanctuary-forest text-lg">forest</span>
            <div>
              <div className="text-[11px] font-black text-sanctuary-dark leading-tight">2 Daily Walks</div>
              <div className="text-[9px] text-sanctuary-dark/60 font-semibold">Green Lawn Romp</div>
            </div>
          </div>
          <div className="p-2.5 bg-white rounded-xl border border-black/5 flex items-center gap-2 shadow-xs">
            <span className="material-symbols-outlined text-sanctuary-forest text-lg">videocam</span>
            <div>
              <div className="text-[11px] font-black text-sanctuary-dark leading-tight">Daily 4K WhatsApp</div>
              <div className="text-[9px] text-sanctuary-dark/60 font-semibold">Photo & Video Journal</div>
            </div>
          </div>
          <div className="p-2.5 bg-white rounded-xl border border-black/5 flex items-center gap-2 shadow-xs">
            <span className="material-symbols-outlined text-sanctuary-forest text-lg">local_taxi</span>
            <div>
              <div className="text-[11px] font-black text-sanctuary-dark leading-tight">Doorstep AC Cab</div>
              <div className="text-[9px] text-sanctuary-dark/60 font-semibold">Kanakapura Rd & South BLR</div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default BoardingSection;
