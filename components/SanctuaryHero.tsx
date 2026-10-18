import React, { useState } from 'react';
import { addItemToCart } from '../utils/cart';

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
  const [groomSize, setGroomSize] = useState<'small' | 'medium' | 'large'>('small');
  const [groomBreedName, setGroomBreedName] = useState<string>('Shih Tzu');

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
      className="min-h-screen py-5 sm:py-8 lg:py-10 flex flex-col justify-center px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-sanctuary-pearl via-white to-sanctuary-sand/30 relative text-left"
    >
      <div className="max-w-6xl mx-auto w-full space-y-4 sm:space-y-5">
        
        {/* Clean Rating & Trust Strip */}
        <div className="flex items-center justify-between gap-2 pb-2 border-b border-black/5 text-xs">
          <div className="flex items-center gap-1.5 font-bold text-sanctuary-dark">
            <span className="text-amber-500 font-black">★ 4.9 / 5.0</span>
            <span className="text-sanctuary-dark/70 font-semibold">(380+ Verified Reviews)</span>
          </div>
          <div className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-100/70 px-2.5 py-0.5 rounded-full">
            <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>100% Cage-Free Boarding & Studio</span>
          </div>
        </div>

        {/* FULL-WIDTH PROMINENT DASARA & AYUDHA POOJA MASTER BILLBOARD */}
        {/* ============================================================ */}
        {/* RESPONSIVE DASARA & AYUDHA POOJA BANNER (DESKTOP & MOBILE) */}
        {/* ============================================================ */}

        {/* DESKTOP BANNER (Sleek Reduced Height, Ultra-Widescreen) */}
        <div
          onClick={() => {
            if (onOpenBooking) {
              onOpenBooking({
                type: 'boarding',
                serviceName: 'Cage-Free Boarding Floor (6+ Days)',
                basePrice: 625,
                nights: 6,
                appliedCouponCode: 'STAY6FREE1',
              });
            }
          }}
          className="hidden sm:block relative w-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border-2 sm:border-3 border-amber-400 group cursor-pointer transition-all hover:scale-[1.004] hover:border-amber-300 hover:shadow-amber-500/25 bg-black"
        >
          {/* Laptop / Desktop Container matching exact 3.14:1 panoramic aspect ratio */}
          <div className="relative w-full aspect-[1376/438] bg-[#0A261A] overflow-hidden">
            <img
              src="/images/banner_dasara_laptop_wide.jpg"
              alt="Dasara & Ayudha Pooja Celebration Offers • 100% Cage-Free Boarding & Luxury Grooming"
              className="w-full h-full object-cover group-hover:scale-[1.01] transition-transform duration-700"
            />
          </div>

          {/* Slim Dedicated Action Bar UNDER the graphic - Artwork 100% clear */}
          <div className="py-2 px-3.5 bg-gradient-to-r from-sanctuary-forest via-[#162E21] to-[#11241A] text-white flex items-center justify-between gap-3 border-t border-amber-400/40">
            <div className="flex items-center gap-2">
              <span className="bg-amber-400 text-black text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                FESTIVAL PASS
              </span>
              <span className="text-white text-xs font-black drop-shadow">
                STAY6FREE1 (1 Day Free) • GROOM10 (10% OFF Grooming) • FREESPA (Free Spa)
              </span>
            </div>
            <div className="py-1 px-3.5 bg-sanctuary-gold hover:bg-amber-300 text-sanctuary-dark rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-md flex items-center gap-1.5 shrink-0">
              <span>Book Online & Show in Studio</span>
              <span className="material-symbols-outlined text-xs font-black">arrow_forward</span>
            </div>
          </div>
        </div>

        {/* MOBILE BANNER (Dedicated Tall Mobile Layout - ZERO Overcrowding!) */}
        <div
          onClick={() => {
            if (onOpenBooking) {
              onOpenBooking({
                type: 'boarding',
                serviceName: 'Cage-Free Boarding Floor (6+ Days)',
                basePrice: 625,
                nights: 6,
                appliedCouponCode: 'STAY6FREE1',
              });
            }
          }}
          className="block sm:hidden relative w-full rounded-2xl overflow-hidden shadow-xl border-2 border-amber-400 group cursor-pointer bg-black"
        >
          {/* Beautiful 4:3 Mobile View where artwork is completely visible */}
          <div className="relative w-full aspect-[4/3] overflow-hidden bg-black">
            <img
              src="/images/flyer_dasara_boarding_nature.jpg"
              alt="Dasara Holiday Pet Boarding & Grooming"
              className="w-full h-full object-cover object-top"
            />
            <div className="absolute top-2 left-2">
              <span className="bg-amber-400 text-black text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
                🎉 DASARA SPECIAL
              </span>
            </div>
          </div>
          {/* Clean dedicated CTA bar UNDER the image, NOT covering the artwork */}
          <div className="p-2.5 bg-gradient-to-r from-sanctuary-forest to-[#1A3326] text-white flex items-center justify-between gap-2 border-t border-amber-400/40">
            <div className="text-left">
              <div className="text-[11px] font-black text-amber-300">
                Book Online & Show at Studio
              </div>
              <div className="text-[9px] text-white/80 font-medium">
                6+ Days: 1 Day FREE (STAY6FREE1) • 10% OFF Grooming
              </div>
            </div>
            <div className="py-1.5 px-3 bg-sanctuary-gold text-sanctuary-dark rounded-lg text-[10px] font-black uppercase tracking-wider shrink-0 flex items-center gap-0.5 shadow-sm">
              <span>Book Now</span>
              <span className="material-symbols-outlined text-xs font-bold">arrow_forward</span>
            </div>
          </div>
        </div>

        {/* 2-Column Grid */}
        <div className="grid lg:grid-cols-12 gap-6 lg:gap-10 items-center">
          
          {/* Left: Headline & Location / Stress Relief Pitch */}
          <div className="lg:col-span-7 space-y-3">
            
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sanctuary-gold/20 text-sanctuary-dark text-[11px] font-black uppercase tracking-wider border border-sanctuary-gold/30">
              <span className="material-symbols-outlined text-xs text-sanctuary-gold">storefront</span>
              <span>Kanakapura Main Road Studio (Beside Shani Mahatma Temple)</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-5xl font-black text-sanctuary-dark tracking-tight leading-[1.08]">
              Clean Cage-Free <br />
              <span className="text-sanctuary-gold">Pet Boarding</span> & Grooming <br />
              At Our Kanakapura Studio
            </h1>

            {/* Clear Studio Visit & In-Store Discount Notice */}
            <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200 text-amber-950 text-xs font-bold space-y-1">
              <div className="flex items-center gap-1.5 text-sanctuary-forest font-black">
                <span className="material-symbols-outlined text-sm">storefront</span>
                <span>BOOK ONLINE & SHOW IN-STORE TO AVAIL DISCOUNT:</span>
              </div>
              <p className="text-[11px] text-amber-900 font-medium leading-relaxed">
                Reserve your preferred slot online, bring your companion to our studio, and show your booking ID at counter to receive festival offers! (Doorstep pet cab taxi available at extra charge based on distance).
              </p>
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

                  {/* Boarding Calculator CTAs: Add to Cart & Book */}
                  <div className="space-y-1.5">
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          addItemToCart({
                            id: `hero_boarding_${pet}_${pet === 'dog' ? dogSize : catType}_${nights}`,
                            category: 'boarding',
                            name: `${bRate.label} Boarding`,
                            subtitle: `${nights} Nights • Studio Stay`,
                            price: boardingTotal,
                            origPrice: boardingOriginalTotal,
                            nights: nights,
                            petType: pet,
                            petSize: pet === 'dog' ? dogSize : undefined,
                            appliedCouponCode: nights >= 6 ? 'STAY6FREE1' : nights >= 4 ? 'FREESPA' : undefined,
                          });
                        }}
                        className="py-2.5 px-2 bg-amber-50 hover:bg-amber-100 text-amber-950 rounded-xl font-bold text-xs border border-amber-300 flex items-center justify-center gap-1.5 shadow-2xs transition-all active:scale-95"
                      >
                        <span className="material-symbols-outlined text-sm text-amber-700">add_shopping_cart</span>
                        <span>Add to Cart</span>
                      </button>

                      <button
                        type="button"
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
                                nights >= 6 ? 'STAY6FREE1' : nights >= 4 ? 'FREESPA' : undefined,
                            });
                          } else {
                            handleViewBoardingRates();
                          }
                        }}
                        className="py-2.5 px-2 bg-sanctuary-forest hover:bg-black text-white rounded-xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all"
                      >
                        <span>Book Online</span>
                        <span className="material-symbols-outlined text-sm font-bold">arrow_forward</span>
                      </button>
                    </div>
                    <p className="text-[10px] text-center text-sanctuary-dark/75 font-semibold">
                      📍 Book online here & bring your companion to our Kanakapura Road Studio
                    </p>
                  </div>
                </div>
              )}

              {/* GROOMING CALCULATOR */}
              {tab === 'grooming' && (
                <div className="space-y-2.5">
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => {
                        setGroomPet('dog');
                        setGroomSize('small');
                        setGroomBreedName('Shih Tzu');
                      }}
                      className={`py-1.5 px-3 rounded-xl border text-xs font-black transition-all ${
                        groomPet === 'dog' ? 'bg-sanctuary-gold/20 border-sanctuary-gold text-sanctuary-dark' : 'border-black/10'
                      }`}
                    >
                      🐕 Dog Grooming
                    </button>
                    <button
                      onClick={() => {
                        setGroomPet('cat');
                        setGroomBreedName('Persian Cat');
                      }}
                      className={`py-1.5 px-3 rounded-xl border text-xs font-black transition-all ${
                        groomPet === 'cat' ? 'bg-sanctuary-gold/20 border-sanctuary-gold text-sanctuary-dark' : 'border-black/10'
                      }`}
                    >
                      🐈 Cat Grooming
                    </button>
                  </div>

                  {/* Popular Breed Quick Select Chips */}
                  {groomPet === 'dog' ? (
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[10px] font-bold text-sanctuary-dark/70">
                        <span>Select Breed / Size:</span>
                        <span className="text-amber-800 font-extrabold">{groomBreedName} ({groomSize.toUpperCase()})</span>
                      </div>
                      <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pb-0.5">
                        {[
                          { name: 'Shih Tzu', size: 'small' },
                          { name: 'Pug', size: 'small' },
                          { name: 'Beagle', size: 'medium' },
                          { name: 'Indie Dog', size: 'medium' },
                          { name: 'Golden Retriever', size: 'large' },
                          { name: 'Labrador', size: 'large' },
                          { name: 'German Shepherd', size: 'large' },
                        ].map((b) => (
                          <button
                            key={b.name}
                            type="button"
                            onClick={() => {
                              setGroomBreedName(b.name);
                              setGroomSize(b.size as any);
                            }}
                            className={`px-2 py-0.5 rounded-lg text-[10px] font-bold whitespace-nowrap transition-all border ${
                              groomBreedName === b.name
                                ? 'bg-sanctuary-forest text-white border-sanctuary-forest font-black shadow-2xs'
                                : 'bg-white border-black/10 text-sanctuary-dark/80 hover:border-amber-300'
                            }`}
                          >
                            {b.name}
                          </button>
                        ))}
                      </div>

                      {/* Direct Weight Buttons */}
                      <div className="grid grid-cols-3 gap-1 pt-0.5">
                        <button
                          onClick={() => {
                            setGroomSize('small');
                            if (!groomBreedName.includes('Small')) setGroomBreedName('Small Breed');
                          }}
                          className={`py-1 rounded-lg border text-center transition-all ${
                            groomSize === 'small' ? 'bg-sanctuary-forest text-white font-bold' : 'border-black/10 text-[10px]'
                          }`}
                        >
                          <div className="text-[10px] font-bold">Small Breed</div>
                          <div className="text-[8.5px] opacity-75">&lt; 10 kg</div>
                        </button>
                        <button
                          onClick={() => {
                            setGroomSize('medium');
                            if (!groomBreedName.includes('Med')) setGroomBreedName('Medium Breed');
                          }}
                          className={`py-1 rounded-lg border text-center transition-all ${
                            groomSize === 'medium' ? 'bg-sanctuary-forest text-white font-bold' : 'border-black/10 text-[10px]'
                          }`}
                        >
                          <div className="text-[10px] font-bold">Medium Breed</div>
                          <div className="text-[8.5px] opacity-75">10 – 25 kg</div>
                        </button>
                        <button
                          onClick={() => {
                            setGroomSize('large');
                            if (!groomBreedName.includes('Large')) setGroomBreedName('Large Breed');
                          }}
                          className={`py-1 rounded-lg border text-center transition-all ${
                            groomSize === 'large' ? 'bg-sanctuary-forest text-white font-bold' : 'border-black/10 text-[10px]'
                          }`}
                        >
                          <div className="text-[10px] font-bold">Large Breed</div>
                          <div className="text-[8.5px] opacity-75">&gt; 25 kg</div>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
                      {['Persian Cat', 'Indie Cat', 'British Shorthair', 'Maine Coon'].map((c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => setGroomBreedName(c)}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold whitespace-nowrap transition-all border ${
                            groomBreedName === c
                              ? 'bg-sanctuary-forest text-white border-sanctuary-forest font-black'
                              : 'bg-white border-black/10 text-sanctuary-dark/80'
                          }`}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-1.5">
                    {[
                      { id: 'furry-fresh', name: 'Furry Fresh', priceDesc: groomPet === 'cat' ? '₹749' : groomSize === 'small' ? '₹499' : groomSize === 'medium' ? '₹699' : '₹849' },
                      { id: 'special', name: 'Special Package', priceDesc: groomPet === 'cat' ? '₹874' : groomSize === 'small' ? '₹899' : groomSize === 'medium' ? '₹949' : '₹999' },
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

                  <div className="p-2.5 bg-sanctuary-sand rounded-2xl flex items-center justify-between border border-black/5">
                    <div>
                      <div className="text-xs font-black text-sanctuary-dark">
                        {selectedGroom.name} ({groomBreedName})
                      </div>
                      <div className="text-[10px] text-emerald-700 font-bold">Save ₹{selectedGroom.orig - selectedGroom.price}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs line-through text-red-500 font-bold decoration-red-500">₹{selectedGroom.orig}</div>
                      <div className="text-xl font-black text-sanctuary-dark leading-none">₹{selectedGroom.price}</div>
                    </div>
                  </div>

                  {/* Grooming Calculator CTAs: Add to Cart & Book */}
                  <div className="space-y-1.5">
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          addItemToCart({
                            id: `hero_groom_${groomPet}_${groomService}_${groomSize}`,
                            category: 'grooming',
                            name: `${selectedGroom.name} (${groomBreedName})`,
                            subtitle: `${groomPet.toUpperCase()} • Studio Visit`,
                            price: selectedGroom.price,
                            origPrice: selectedGroom.orig,
                            petType: groomPet,
                            petSize: groomPet === 'dog' ? groomSize : undefined,
                            petBreed: groomBreedName,
                            appliedCouponCode: selectedGroom.price >= 1000 ? 'GROOM10' : undefined,
                          });
                        }}
                        className="py-2.5 px-2 bg-amber-50 hover:bg-amber-100 text-amber-950 rounded-xl font-bold text-xs border border-amber-300 flex items-center justify-center gap-1.5 shadow-2xs transition-all active:scale-95"
                      >
                        <span className="material-symbols-outlined text-sm text-amber-700">add_shopping_cart</span>
                        <span>Add to Cart</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          if (onOpenBooking) {
                            onOpenBooking({
                              type: 'grooming',
                              serviceName: `${selectedGroom.name} (${groomBreedName})`,
                              basePrice: selectedGroom.price,
                              origPrice: selectedGroom.orig,
                              petType: groomPet,
                              petSize: groomPet === 'dog' ? groomSize : undefined,
                              petBreed: groomBreedName,
                              appliedCouponCode: selectedGroom.price >= 1000 ? 'GROOM10' : undefined,
                            });
                          } else {
                            handleViewGroomingMenu();
                          }
                        }}
                        className="py-2.5 px-2 bg-sanctuary-forest hover:bg-black text-white rounded-xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all"
                      >
                        <span>Book Now</span>
                        <span className="material-symbols-outlined text-sm font-bold">arrow_forward</span>
                      </button>
                    </div>

                    {/* Direct Link to Grooming Menu */}
                    <button
                      type="button"
                      onClick={handleViewGroomingMenu}
                      className="w-full py-1.5 px-2.5 bg-amber-50/80 hover:bg-amber-100 text-amber-950 rounded-xl text-[10px] font-bold border border-amber-300 transition-colors flex items-center justify-center gap-1 shadow-2xs"
                    >
                      <span className="material-symbols-outlined text-xs text-amber-700">spa</span>
                      <span>View All Grooming Services & Packages ↓</span>
                    </button>
                  </div>
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
