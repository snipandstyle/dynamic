import React, { useState } from 'react';

interface SanctuaryHeroProps {
  onExploreBoarding: () => void;
  onExploreGrooming: () => void;
  onOpenBooking?: (details?: any) => void;
}

export const SanctuaryHero: React.FC<SanctuaryHeroProps> = ({
  onExploreBoarding,
  onExploreGrooming,
  onOpenBooking,
}) => {
  const [tab, setTab] = useState<'boarding' | 'grooming'>('boarding');

  const handleViewBoardingRates = () => {
    setTab('boarding');
    const el = document.getElementById('boarding');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      onExploreBoarding();
    }
  };

  const handleViewGroomingMenu = () => {
    setTab('grooming');
    const el = document.getElementById('grooming');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      onExploreGrooming();
    }
  };

  // Boarding state
  const [pet, setPet] = useState<'dog' | 'cat'>('dog');
  const [dogSize, setDogSize] = useState<'small' | 'medium' | 'large'>('small');
  const [catType, setCatType] = useState<'neutered' | 'non-neutered'>('neutered');
  const [nights, setNights] = useState<number>(4);

  // Grooming state
  const [groomService, setGroomService] = useState<'furry-fresh' | 'special' | 'style' | 'full'>('special');
  const [groomPet, setGroomPet] = useState<'dog' | 'cat'>('dog');
  const [groomSize, setGroomSize] = useState<'small' | 'medium' | 'large'>('medium');

  // Rates calculation - Exact by kg
  const getBoardingRate = () => {
    if (pet === 'cat') {
      if (catType === 'neutered') return { original: 750, discounted: 625, label: 'Neutered Cat' };
      return { original: 899, discounted: 750, label: 'Non-Neutered Cat' };
    }
    if (dogSize === 'small') return { original: 750, discounted: 625, label: 'Small Dog (< 10 kg)' };
    if (dogSize === 'medium') return { original: 899, discounted: 750, label: 'Medium Dog (10 – 25 kg)' };
    return { original: 1050, discounted: 875, label: 'Large Dog (> 25 kg)' };
  };

  const bRate = getBoardingRate();
  const boardingTotal = bRate.discounted * nights;
  const boardingOriginalTotal = bRate.original * nights;

  // Milestone perks
  const getMilestonePerk = () => {
    if (nights >= 15) return { title: 'FREE Full Package Grooming Treatment', value: '₹2,199 Value' };
    if (nights >= 8) return { title: 'FREE Special Package Treatment', value: '₹999 Value' };
    if (nights >= 6) return { title: '1 Day FREE Boarding (Code: STAY6FREE1)', value: `₹${bRate.discounted} Value` };
    if (nights >= 4) return { title: 'FREE Furry Fresh Refresh', value: '₹749 Value' };
    return null;
  };

  const milestone = getMilestonePerk();

  // Grooming rates from prompt
  const getGroomPrice = () => {
    if (groomPet === 'cat') {
      if (groomService === 'furry-fresh') return { name: 'Furry Fresh', price: 749, orig: 999 };
      if (groomService === 'special') return { name: 'Special Package', price: 874, orig: 1199 };
      if (groomService === 'style') return { name: 'Style Your Pet', price: 1799, orig: 2249 };
      return { name: 'Full Grooming (Lion/Comb Cut)', price: 2199, orig: 3249 };
    } else {
      if (groomService === 'furry-fresh') {
        const prices = { small: 499, medium: 699, large: 849 };
        const origs = { small: 649, medium: 899, large: 1099 };
        return { name: 'Furry Fresh', price: prices[groomSize], orig: origs[groomSize] };
      }
      if (groomService === 'special') {
        const prices = { small: 899, medium: 949, large: 999 };
        const origs = { small: 1124, medium: 1199, large: 1249 };
        return { name: 'Special Package', price: prices[groomSize], orig: origs[groomSize] };
      }
      if (groomService === 'style') {
        return { name: 'Style Your Pet', price: 1799, orig: 2249 };
      }
      return { name: 'Full Grooming', price: 2199, orig: 3249 };
    }
  };

  const selectedGroom = getGroomPrice();

  return (
    <section
      id="hero"
      className="min-h-screen lg:h-screen lg:max-h-screen flex flex-col justify-center px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3 lg:py-4 bg-gradient-to-b from-sanctuary-pearl via-white to-sanctuary-sand/30 relative text-left"
    >
      <div className="max-w-6xl mx-auto w-full space-y-2.5 sm:space-y-3">
        
        {/* Clean Rating & Trust Strip (Uncluttered) */}
        <div className="flex items-center justify-between gap-2 pb-2 border-b border-black/5 text-xs">
          <div className="flex items-center gap-1.5 font-bold text-sanctuary-dark">
            <span className="text-amber-500 font-black">★ 4.9 / 5.0</span>
            <span className="text-sanctuary-dark/70 font-semibold">(380+ Verified Reviews)</span>
          </div>
          <div className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded-full">
            <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>100% Cage-Free Boarding</span>
          </div>
        </div>

        {/* LIVE PROMOTIONS HIGHLIGHT STRIP */}
        <div className="bg-gradient-to-r from-amber-50/90 via-emerald-50/80 to-amber-50/90 p-2 sm:p-2.5 rounded-2xl border border-sanctuary-gold/40 flex flex-wrap items-center justify-between gap-2 text-xs shadow-xs">
          <div className="flex items-center gap-2">
            <span className="text-base">🎁</span>
            <div>
              <span className="font-black text-sanctuary-dark text-[11px] sm:text-xs">
                Active Promotions:
              </span>
              <span className="text-[11px] text-sanctuary-dark/85 font-medium ml-1.5">
                <strong>Book 6 Days Boarding, Get 1 Day FREE</strong> (Code: <code className="font-mono font-bold text-sanctuary-forest">STAY6FREE1</code>) • <strong>Spend ₹500+ on Grooming = FREE Bath or Nail Clip!</strong>
              </span>
            </div>
          </div>
          <button
            onClick={() => {
              if (onOpenBooking) {
                onOpenBooking({
                  type: 'boarding',
                  serviceName: 'Cage-Free Boarding (6+ Days Deal)',
                  basePrice: 625,
                  origPrice: 750,
                  nights: 6,
                  appliedCouponCode: 'STAY6FREE1',
                });
              }
            }}
            className="px-2.5 py-1 bg-sanctuary-forest hover:bg-black text-white text-[10px] font-black uppercase tracking-wider rounded-lg transition-colors ml-auto sm:ml-0 shadow-xs"
          >
            Claim 6-Day Deal
          </button>
        </div>

        {/* 2-Column Grid */}
        <div className="grid lg:grid-cols-12 gap-6 lg:gap-10 items-center">
          
          {/* Left: Headline & Location / Stress Relief Pitch */}
          <div className="lg:col-span-7 space-y-3">
            
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sanctuary-gold/20 text-sanctuary-dark text-[11px] font-black uppercase tracking-wider border border-sanctuary-gold/30">
              <span className="material-symbols-outlined text-xs text-sanctuary-gold">storefront</span>
              <span>Book Online & Visit Our Pet Studio • Kanakapura Road</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-sanctuary-dark tracking-tight leading-[1.08]">
              Clean Cage-Free <br />
              <span className="text-sanctuary-gold">Pet Boarding</span> & Grooming <br />
              At Our Kanakapura Studio
            </h1>

            <p className="text-xs sm:text-sm text-sanctuary-dark/75 font-medium leading-relaxed max-w-xl">
              <strong>Book your appointment online & visit our pet studio:</strong> Reserve your date and time slot, bring your furry companion to our Kanakapura Main Road studio, and our fear-free certified groomers pamper them on-site with zero waiting queue. (Doorstep pet cab pickup also available!)
            </p>

            {/* Visual Banner (Desktop / Tablet only to prevent mobile clutter) */}
            <div className="hidden sm:block relative rounded-2xl overflow-hidden shadow-md border border-black/10 group">
              <img
                src="/images/hero_banner_pets.jpg"
                alt="Snip & Style Pets"
                className="w-full h-24 sm:h-28 object-cover object-top group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent flex items-end p-2.5 justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="bg-sanctuary-gold text-sanctuary-dark text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
                    Location Advantage
                  </span>
                  <span className="text-white text-xs font-bold drop-shadow">
                    NH 948 Kanakapura Main Road • Direct Exit Route
                  </span>
                </div>
                <div className="flex items-center gap-1 bg-black/60 px-2 py-0.5 rounded-lg text-[10px] text-white font-bold">
                  <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>100% Floor Freedom</span>
                </div>
              </div>
            </div>

            {/* Clean Key Inclusions Strip (Spacious on Mobile) */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 py-1 text-xs text-sanctuary-dark/80 font-bold">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-emerald-600 text-sm">check_circle</span>
                <span>Zero Wire Cages</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-emerald-600 text-sm">check_circle</span>
                <span>Private Suites</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-emerald-600 text-sm">check_circle</span>
                <span>Daily Nature Walks</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-emerald-600 text-sm">check_circle</span>
                <span>Daily WhatsApp Journals</span>
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 pt-1">
              <button
                onClick={handleViewBoardingRates}
                className="flex-1 sm:flex-initial py-2.5 px-5 bg-sanctuary-forest hover:bg-black text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-sm text-center flex items-center justify-center gap-1.5"
              >
                <span>View Boarding Rates</span>
                <span className="material-symbols-outlined text-sm">arrow_downward</span>
              </button>
              <button
                onClick={handleViewGroomingMenu}
                className="flex-1 sm:flex-initial py-2.5 px-5 bg-white hover:bg-sanctuary-sand text-sanctuary-dark border border-black/10 rounded-xl font-bold text-xs uppercase tracking-wider transition-all text-center flex items-center justify-center gap-1.5"
              >
                <span>Grooming Menu</span>
                <span className="material-symbols-outlined text-sm">arrow_downward</span>
              </button>
            </div>

          </div>

          {/* Right: Price & Reservation Calculator */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-xl border border-black/10 text-left space-y-3">
              
              {/* Tab Switcher */}
              <div className="grid grid-cols-2 p-1 bg-sanctuary-sand rounded-xl text-xs font-black">
                <button
                  onClick={() => setTab('boarding')}
                  className={`py-1.5 rounded-lg transition-all ${
                    tab === 'boarding' ? 'bg-sanctuary-forest text-white shadow-xs' : 'text-sanctuary-dark/70'
                  }`}
                >
                  Pet Boarding
                </button>
                <button
                  onClick={() => setTab('grooming')}
                  className={`py-1.5 rounded-lg transition-all ${
                    tab === 'grooming' ? 'bg-sanctuary-forest text-white shadow-xs' : 'text-sanctuary-dark/70'
                  }`}
                >
                  Spa & Grooming
                </button>
              </div>

              {/* BOARDING CALCULATOR */}
              {tab === 'boarding' && (
                <div className="space-y-2.5">
                  {/* Companion Switcher */}
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setPet('dog')}
                      className={`py-1.5 px-3 rounded-xl border text-xs font-black transition-all ${
                        pet === 'dog' ? 'bg-sanctuary-gold/20 border-sanctuary-gold text-sanctuary-dark' : 'border-black/10'
                      }`}
                    >
                      Dog Boarding
                    </button>
                    <button
                      onClick={() => setPet('cat')}
                      className={`py-1.5 px-3 rounded-xl border text-xs font-black transition-all ${
                        pet === 'cat' ? 'bg-sanctuary-gold/20 border-sanctuary-gold text-sanctuary-dark' : 'border-black/10'
                      }`}
                    >
                      Cat Boarding
                    </button>
                  </div>

                  {/* Weight in kg for Dog / Cat Classification */}
                  {pet === 'dog' ? (
                    <div className="grid grid-cols-3 gap-1.5">
                      <button
                        onClick={() => setDogSize('small')}
                        className={`py-1.5 rounded-lg border text-center transition-all ${
                          dogSize === 'small' ? 'bg-sanctuary-forest text-white font-bold' : 'border-black/10 text-xs'
                        }`}
                      >
                        <div className="text-[11px] font-bold">Small Breed</div>
                        <div className="text-[9px] opacity-75">&lt; 10 kg</div>
                      </button>
                      <button
                        onClick={() => setDogSize('medium')}
                        className={`py-1.5 rounded-lg border text-center transition-all ${
                          dogSize === 'medium' ? 'bg-sanctuary-forest text-white font-bold' : 'border-black/10 text-xs'
                        }`}
                      >
                        <div className="text-[11px] font-bold">Medium Breed</div>
                        <div className="text-[9px] opacity-75">10 – 25 kg</div>
                      </button>
                      <button
                        onClick={() => setDogSize('large')}
                        className={`py-1.5 rounded-lg border text-center transition-all ${
                          dogSize === 'large' ? 'bg-sanctuary-forest text-white font-bold' : 'border-black/10 text-xs'
                        }`}
                      >
                        <div className="text-[11px] font-bold">Large Breed</div>
                        <div className="text-[9px] opacity-75">&gt; 25 kg</div>
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-1.5">
                      <button
                        onClick={() => setCatType('neutered')}
                        className={`py-1.5 rounded-lg border text-center transition-all ${
                          catType === 'neutered' ? 'bg-sanctuary-forest text-white font-bold' : 'border-black/10 text-xs'
                        }`}
                      >
                        <div className="text-[11px] font-bold">Neutered / Spayed</div>
                        <div className="text-[9px] opacity-75">₹625 / day</div>
                      </button>
                      <button
                        onClick={() => setCatType('non-neutered')}
                        className={`py-1.5 rounded-lg border text-center transition-all ${
                          catType === 'non-neutered' ? 'bg-sanctuary-forest text-white font-bold' : 'border-black/10 text-xs'
                        }`}
                      >
                        <div className="text-[11px] font-bold">Non-Neutered</div>
                        <div className="text-[9px] opacity-75">₹750 / day</div>
                      </button>
                    </div>
                  )}

                  {/* Nights Duration & Presets */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs font-bold">
                      <span className="text-sanctuary-dark">Duration of Stay:</span>
                      <span className="text-sanctuary-gold font-black bg-sanctuary-gold/15 px-2 py-0.5 rounded-full text-xs">
                        {nights} {nights === 1 ? 'Night' : 'Nights'}
                      </span>
                    </div>

                    <div className="grid grid-cols-4 gap-1 text-center">
                      {[
                        { n: 2, label: '2 Nights', perk: 'Standard' },
                        { n: 4, label: '4 Nights', perk: 'FREE REFRESH' },
                        { n: 8, label: '8 Nights', perk: 'FREE SPECIAL' },
                        { n: 15, label: '15 Nights', perk: 'FREE FULL PKG' },
                      ].map((item) => (
                        <button
                          key={item.n}
                          type="button"
                          onClick={() => setNights(item.n)}
                          className={`p-1 rounded-xl border transition-all flex flex-col items-center justify-center ${
                            nights === item.n
                              ? 'bg-sanctuary-forest text-white border-sanctuary-forest shadow-xs'
                              : 'bg-sanctuary-sand/50 text-sanctuary-dark border-black/10 hover:border-sanctuary-gold'
                          }`}
                        >
                          <span className="text-[10px] font-black">{item.label}</span>
                          <span className={`text-[8px] font-extrabold ${nights === item.n ? 'text-amber-300' : 'text-emerald-700'}`}>
                            {item.perk}
                          </span>
                        </button>
                      ))}
                    </div>

                    <input
                      type="range"
                      min="1"
                      max="30"
                      value={nights}
                      onChange={(e) => setNights(Number(e.target.value))}
                      className="w-full accent-sanctuary-gold cursor-pointer"
                    />
                  </div>

                  {/* Milestone Perk Callout */}
                  <div className={`p-2 rounded-xl text-center text-xs font-black transition-all border ${
                    nights >= 15
                      ? 'bg-purple-100/90 text-purple-950 border-purple-300 shadow-xs'
                      : nights >= 8
                      ? 'bg-amber-100/90 text-amber-950 border-amber-300 shadow-xs'
                      : nights >= 6
                      ? 'bg-emerald-100/95 text-emerald-950 border-emerald-400 shadow-xs ring-1 ring-emerald-400'
                      : nights >= 4
                      ? 'bg-emerald-100/90 text-emerald-950 border-emerald-300 shadow-xs'
                      : 'bg-sanctuary-sand text-sanctuary-dark/70 border-black/5'
                  }`}>
                    {milestone ? (
                      <span>UNLOCKED: {milestone.title} ({milestone.value}) Included With Stay</span>
                    ) : (
                      <span>Book 6+ Days to get 1 Day FREE, or 4+ Days for Free Furry Fresh Bath!</span>
                    )}
                  </div>

                  {/* Rate Card with RED Strikethrough Price */}
                  <div className="p-2.5 bg-sanctuary-sand rounded-2xl flex items-center justify-between border border-black/5">
                    <div>
                      <div className="text-[10px] text-sanctuary-dark/60 font-semibold">{bRate.label} (₹{bRate.discounted}/day)</div>
                      <div className="text-xs font-black text-sanctuary-dark">Total for {nights} Night{nights > 1 ? 's' : ''}:</div>
                      <div className="text-[9px] font-black text-emerald-700">Save ₹{boardingOriginalTotal - boardingTotal} on Stay</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs line-through text-red-500 font-bold decoration-red-500">₹{boardingOriginalTotal}</div>
                      <div className="text-xl font-black text-sanctuary-dark leading-none">₹{boardingTotal}</div>
                    </div>
                  </div>

                  {/* Native Booking CTA */}
                  <button
                    onClick={() => {
                      if (onOpenBooking) {
                        onOpenBooking({
                          type: 'boarding',
                          serviceName: `${bRate.label} Boarding`,
                          basePrice: bRate.discounted,
                          origPrice: bRate.original,
                          petType: pet,
                          petSize: pet === 'dog' ? dogSize : undefined,
                          catType: pet === 'cat' ? catType : undefined,
                          nights: nights,
                          appliedCouponCode:
                            nights >= 15 ? 'FREESPA15' : nights >= 8 ? 'FREESPA8' : nights >= 6 ? 'STAY6FREE1' : nights >= 4 ? 'FREESPA' : undefined,
                        });
                      } else {
                        handleViewBoardingRates();
                      }
                    }}
                    className="w-full py-2.5 bg-sanctuary-forest hover:bg-black text-white rounded-xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all"
                  >
                    <span>Book Stay Now</span>
                    <span className="material-symbols-outlined text-sm font-bold">arrow_forward</span>
                  </button>
                </div>
              )}

              {/* GROOMING CALCULATOR */}
              {tab === 'grooming' && (
                <div className="space-y-2.5">
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setGroomPet('dog')}
                      className={`py-1.5 px-3 rounded-xl border text-xs font-black transition-all ${
                        groomPet === 'dog' ? 'bg-sanctuary-gold/20 border-sanctuary-gold text-sanctuary-dark' : 'border-black/10'
                      }`}
                    >
                      Dog Grooming
                    </button>
                    <button
                      onClick={() => setGroomPet('cat')}
                      className={`py-1.5 px-3 rounded-xl border text-xs font-black transition-all ${
                        groomPet === 'cat' ? 'bg-sanctuary-gold/20 border-sanctuary-gold text-sanctuary-dark' : 'border-black/10'
                      }`}
                    >
                      Cat Grooming
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-1.5">
                    {[
                      { id: 'furry-fresh', name: 'Furry Fresh', priceDesc: groomPet === 'cat' ? '₹749' : 'from ₹499' },
                      { id: 'special', name: 'Special Package', priceDesc: groomPet === 'cat' ? '₹874' : 'from ₹899' },
                      { id: 'style', name: 'Style Your Pet', priceDesc: '₹1,799' },
                      { id: 'full', name: 'Full Grooming', priceDesc: '₹2,199' },
                    ].map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setGroomService(item.id as any)}
                        className={`p-2 rounded-xl border text-left transition-all ${
                          groomService === item.id ? 'bg-sanctuary-gold/20 border-sanctuary-gold text-sanctuary-dark font-black' : 'border-black/10'
                        }`}
                      >
                        <div className="text-[11px] leading-tight font-black">{item.name}</div>
                        <div className="text-[10px] text-sanctuary-gold font-bold">{item.priceDesc}</div>
                      </button>
                    ))}
                  </div>

                  {groomPet === 'dog' && (
                    <div className="grid grid-cols-3 gap-1.5">
                      <button
                        onClick={() => setGroomSize('small')}
                        className={`py-1.5 rounded-lg border text-xs font-bold transition-all ${
                          groomSize === 'small' ? 'bg-sanctuary-forest text-white' : 'border-black/10'
                        }`}
                      >
                        Small (&lt; 10 kg)
                      </button>
                      <button
                        onClick={() => setGroomSize('medium')}
                        className={`py-1.5 rounded-lg border text-xs font-bold transition-all ${
                          groomSize === 'medium' ? 'bg-sanctuary-forest text-white' : 'border-black/10'
                        }`}
                      >
                        Med (10 – 25 kg)
                      </button>
                      <button
                        onClick={() => setGroomSize('large')}
                        className={`py-1.5 rounded-lg border text-xs font-bold transition-all ${
                          groomSize === 'large' ? 'bg-sanctuary-forest text-white' : 'border-black/10'
                        }`}
                      >
                        Large (&gt; 25 kg)
                      </button>
                    </div>
                  )}

                  <div className="p-2.5 bg-sanctuary-sand rounded-2xl flex items-center justify-between border border-black/5">
                    <div>
                      <div className="text-xs font-black text-sanctuary-dark">{selectedGroom.name}</div>
                      <div className="text-[10px] text-emerald-700 font-bold">Save ₹{selectedGroom.orig - selectedGroom.price}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs line-through text-red-500 font-bold decoration-red-500">₹{selectedGroom.orig}</div>
                      <div className="text-xl font-black text-sanctuary-dark leading-none">₹{selectedGroom.price}</div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      if (onOpenBooking) {
                        onOpenBooking({
                          type: 'grooming',
                          serviceName: `${selectedGroom.name} (${groomPet === 'cat' ? 'Cat' : `${groomSize.toUpperCase()} Dog`})`,
                          basePrice: selectedGroom.price,
                          origPrice: selectedGroom.orig,
                          petType: groomPet,
                          petSize: groomPet === 'dog' ? groomSize : undefined,
                          appliedCouponCode: selectedGroom.price >= 1000 ? 'GROOM10' : undefined,
                        });
                      } else {
                        handleViewGroomingMenu();
                      }
                    }}
                    className="w-full py-2.5 bg-sanctuary-forest hover:bg-black text-white rounded-xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all"
                  >
                    <span>Book Grooming Now</span>
                    <span className="material-symbols-outlined text-sm font-bold">arrow_forward</span>
                  </button>
                </div>
              )}

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default SanctuaryHero;
