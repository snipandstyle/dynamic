import React, { useState } from 'react';
import {
  DoodlePaw,
  DoodleSparkle,
  DoodleBone,
  DoodleScissors,
  DoodleBubbles,
  DoodleCrown,
  DoodleWavyLine,
  DoodleHeart,
  DoodleArrow,
  DoodleHome,
  DoodleShield,
} from './Doodles';
import { addItemToCart } from '../utils/cart';

interface EpicDoodleHomescreenProps {
  onOpenBooking: (details?: any) => void;
  onNavigate: (page: string) => void;
}

export const EpicDoodleHomescreen: React.FC<EpicDoodleHomescreenProps> = ({
  onOpenBooking,
  onNavigate,
}) => {
  // Main mode toggle: Boarding vs Grooming
  const [activeTab, setActiveTab] = useState<'boarding' | 'grooming'>('boarding');

  // Boarding configuration
  const [boardPet, setBoardPet] = useState<'dog' | 'cat'>('dog');
  const [boardSize, setBoardSize] = useState<'small' | 'medium' | 'large'>('small');
  const [boardNights, setBoardNights] = useState<number>(4);

  // Grooming configuration
  const [groomPet, setGroomPet] = useState<'dog' | 'cat'>('dog');
  const [groomSize, setGroomSize] = useState<'small' | 'medium' | 'large'>('small');
  const [groomBreed, setGroomBreed] = useState<string>('Shih Tzu');
  const [selectedGroomPackage, setSelectedGroomPackage] = useState<string>('special');

  // Dog breeds list for quick selection
  const dogBreeds = [
    { name: 'Shih Tzu', size: 'small' as const },
    { name: 'Pug', size: 'small' as const },
    { name: 'Pomeranian', size: 'small' as const },
    { name: 'Beagle', size: 'medium' as const },
    { name: 'Indie Dog', size: 'medium' as const },
    { name: 'Cocker Spaniel', size: 'medium' as const },
    { name: 'Golden Retriever', size: 'large' as const },
    { name: 'Labrador', size: 'large' as const },
    { name: 'German Shepherd', size: 'large' as const },
  ];

  // Cat breeds list
  const catBreeds = ['Persian Cat', 'Indie Cat', 'British Shorthair', 'Maine Coon', 'All Cats'];

  // Boarding rates calculation
  const getBoardingRate = () => {
    if (boardPet === 'cat') {
      return { daily: 625, original: 750, name: 'Cozy Cat Condo' };
    }
    if (boardSize === 'small') {
      return { daily: 625, original: 750, name: 'Small Dog Private Suite (<10kg)' };
    }
    if (boardSize === 'medium') {
      return { daily: 750, original: 899, name: 'Medium Dog Private Suite (10–25kg)' };
    }
    return { daily: 875, original: 1050, name: 'Large Dog Luxury Suite (>25kg)' };
  };

  const boardRate = getBoardingRate();
  const boardTotal = boardRate.daily * boardNights;
  const boardOriginalTotal = boardRate.original * boardNights;
  const boardSavings = boardOriginalTotal - boardTotal;

  // Unlocked boarding perks
  const getBoardingPerk = () => {
    if (boardNights >= 6) {
      return {
        badge: '🎉 1 DAY 100% FREE',
        code: 'STAY6FREE1',
        desc: 'Book 6+ days & get 1 full day complimentary!',
      };
    }
    if (boardNights >= 4) {
      return {
        badge: '✨ FREE SPARKLE BATH',
        code: 'FREESPA',
        desc: 'Complimentary Furry Fresh bath on check-out day!',
      };
    }
    return null;
  };

  const activePerk = getBoardingPerk();

  // All 6 Grooming packages
  const groomingPackages = [
    {
      id: 'furry-fresh',
      title: 'Furry Fresh',
      badge: 'HYGIENE CARE',
      badgeBg: 'bg-emerald-100 text-emerald-800',
      popular: false,
      desc: 'Deep cleansing bubble hydrobath, ear wax cleansing, blow-dry & refreshing deodorizing spritz.',
      pricing: { small: 499, medium: 699, large: 849, cat: 749 },
      orig: { small: 649, medium: 899, large: 1099, cat: 999 },
      inclusions: [
        'Warm Bubble Hydrobath',
        'Organic Shampoo & Conditioner',
        'High-Velocity Fluff Blow Dry',
        'Ear Cleaning & Eye Wipes',
        'Deodorizing Cologne Spritz',
      ],
    },
    {
      id: 'special',
      title: 'Special Package',
      badge: '⭐ MOST POPULAR',
      badgeBg: 'bg-amber-400 text-sanctuary-dark font-black',
      popular: true,
      desc: 'Hygiene bath plus essential oral teeth brushing, plaque cleanse, mouth spray & paw pad balm.',
      pricing: { small: 899, medium: 949, large: 999, cat: 874 },
      orig: { small: 1124, medium: 1199, large: 1249, cat: 1199 },
      inclusions: [
        'Everything in Furry Fresh Bath',
        'Teeth Brushing & Plaque Cleanse',
        'Freshening Mouth Spray',
        'Paw Pad Trimming & Herbal Balm',
        'De-tangling Coat Brushing',
      ],
    },
    {
      id: 'style',
      title: 'Style Your Pet',
      badge: 'BREED STYLING',
      badgeBg: 'bg-purple-100 text-purple-900',
      popular: false,
      desc: 'Precision breed standard styling, custom scissor haircut, face shaping, and sanitary trim.',
      pricing: { small: 1799, medium: 1799, large: 1799, cat: 1799 },
      orig: { small: 2249, medium: 2249, large: 2249, cat: 2249 },
      inclusions: [
        'Full Body Breed Haircut & Trim',
        'Face Shaping & Beard Styling',
        'Sanitary Area Hygienic Trim',
        'Nail Clipping & Paw Buffing',
        'Bubble Hydrobath Included',
      ],
    },
    {
      id: 'full',
      title: 'Full Grooming & Spa',
      badge: '👑 ROYAL SPA',
      badgeBg: 'bg-sanctuary-forest text-white',
      popular: false,
      desc: 'The ultimate royal head-to-tail pampering with therapeutic skin bath, full haircut & massage.',
      pricing: { small: 2199, medium: 2199, large: 2199, cat: 2199 },
      orig: { small: 3249, medium: 3249, large: 3249, cat: 3249 },
      inclusions: [
        'Therapeutic Medicated Skin Bath',
        'Full Body Haircut & Scissor Finish',
        'Deep Deshedding Undercoat Treatment',
        'Nail Clipping + Ear & Eye Clean',
        'Relaxing Paw & Coat Massage',
      ],
    },
    {
      id: 'puppy-spa',
      title: 'Puppy / Kitten Gentle Spa',
      badge: '🐾 UNDER 6 MONTHS',
      badgeBg: 'bg-sky-100 text-sky-900',
      popular: false,
      desc: 'Tearless, low-noise gentle wash and cuddle session to make grooming fun for baby pets.',
      pricing: { small: 449, medium: 549, large: 649, cat: 549 },
      orig: { small: 599, medium: 749, large: 849, cat: 749 },
      inclusions: [
        'Gentle Tearless Organic Wash',
        'Low-Noise Warm Fluff Dry',
        'Baby Cuddle & Desensitization',
        'Paw Pad Soothing Moisturizer',
        'Gentle Ear Hygiene Wipe',
      ],
    },
    {
      id: 'medicated-bath',
      title: 'Medicated Anti-Tick Bath',
      badge: '🛡️ SKIN DEFENSE',
      badgeBg: 'bg-rose-100 text-rose-900',
      popular: false,
      desc: 'Clinical therapeutic bath with anti-flea, anti-tick, and anti-fungal soothing formulation.',
      pricing: { small: 699, medium: 899, large: 1099, cat: 899 },
      orig: { small: 899, medium: 1149, large: 1399, cat: 1149 },
      inclusions: [
        'Medicated Anti-Tick & Flea Wash',
        'Anti-Dandruff / Anti-Fungal Soak',
        'Dead Hair Removal & Brushing',
        'Sanitary Gentle Cleansing',
        'High-Velocity Warm Blow Dry',
      ],
    },
  ];

  const currentGroomPkg =
    groomingPackages.find((p) => p.id === selectedGroomPackage) || groomingPackages[1];
  const currentGroomPrice =
    groomPet === 'cat' ? currentGroomPkg.pricing.cat : currentGroomPkg.pricing[groomSize];
  const currentGroomOrig =
    groomPet === 'cat' ? currentGroomPkg.orig.cat : currentGroomPkg.orig[groomSize];
  const currentGroomSavings = currentGroomOrig - currentGroomPrice;

  // Standalone Add-ons
  const addOns = [
    { name: 'Teeth Brushing', price: 186, icon: '🦷' },
    { name: 'Ear & Eye Clean', price: 124, icon: '👁️' },
    { name: 'Paw Pad Balm', price: 124, icon: '🐾' },
    { name: 'Medicated Dip', price: 299, icon: '🫧' },
    { name: 'Full Body Massage', price: 499, icon: '💆' },
    { name: 'Dematting Care', price: 499, icon: '✂️' },
    { name: 'Deshedding Treatment', price: 624, icon: '🐕' },
    { name: 'Waterless Bath', price: 499, icon: '🚿' },
  ];

  return (
    <div className="w-full text-left space-y-6 sm:space-y-10 pb-12 overflow-hidden">
      
      {/* ============================================================ */}
      {/* 1. FESTIVE NOTIFICATION STRIP WITH CUTE DOODLES */}
      {/* ============================================================ */}
      <div className="bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 text-sanctuary-dark px-3 py-2 text-xs font-black flex items-center justify-between shadow-sm">
        <div className="max-w-6xl mx-auto w-full flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 truncate">
            <DoodleSparkle className="w-4 h-4 text-sanctuary-dark shrink-0" />
            <span className="truncate">
              🎉 <strong>Dasara Festive Offer:</strong> 1 Day Free on 6+ Days Boarding (Code: <strong>STAY6FREE1</strong>) • 10% OFF Grooming (Code: <strong>GROOM10</strong>)
            </span>
          </div>
          <button
            onClick={() => onOpenBooking()}
            className="hidden sm:inline-flex items-center gap-1 bg-sanctuary-dark text-white px-3 py-0.5 rounded-full text-[11px] font-bold shrink-0 hover:bg-black transition-colors"
          >
            <span>Claim Discount</span>
            <span className="material-symbols-outlined text-xs">arrow_forward</span>
          </button>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 2. HERO SECTION: PLAYFUL, WARM & IMMEDIATE CLARITY */}
      {/* ============================================================ */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 relative">
        {/* Floating background decorative doodles */}
        <div className="absolute -top-4 right-8 pointer-events-none opacity-20 hidden md:block">
          <DoodlePaw className="w-24 h-24 text-sanctuary-forest transform rotate-12" />
        </div>
        <div className="absolute top-20 -left-6 pointer-events-none opacity-20 hidden md:block">
          <DoodleBone className="w-20 h-20 text-sanctuary-gold transform -rotate-12" />
        </div>

        <div className="space-y-4 sm:space-y-6 text-center max-w-3xl mx-auto pt-2 sm:pt-4">
          
          {/* Cute Trust Badge with Doodles */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-100/90 text-emerald-900 border border-emerald-300/80 text-xs font-black shadow-xs">
            <DoodlePaw className="w-3.5 h-3.5 text-emerald-700" />
            <span>Bangalore's #1 Zero-Cage Pet Sanctuary</span>
            <span className="text-amber-500">★ 4.9 (500+ Google Reviews)</span>
          </div>

          {/* Epic Main Headline with Hand-Drawn Doodle Underline */}
          <div className="relative inline-block">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-sanctuary-dark tracking-tight leading-[1.12]">
              Where Bangalore Pets <br />
              <span className="relative inline-block text-sanctuary-forest">
                Feel Like Family.
                <div className="absolute -bottom-2.5 left-0 right-0 flex justify-center pointer-events-none">
                  <DoodleWavyLine className="w-full h-3 text-sanctuary-gold" />
                </div>
              </span>
            </h1>
          </div>

          <p className="text-sm sm:text-base text-sanctuary-dark/80 font-medium max-w-2xl mx-auto leading-relaxed pt-1">
            Zero metal cages! Private soundproof suites, 3 daily lawn nature walks, and stress-free organic hydrobaths on <strong>Kanakapura Main Road</strong> (Beside Shani Mahatma Temple).
          </p>

          {/* ============================================================ */}
          {/* 3. PROMINENT 2-SERVICE SWITCHER (CENTER STAGE) */}
          {/* ============================================================ */}
          <div className="pt-2 flex justify-center">
            <div className="bg-sanctuary-sand/80 p-1.5 rounded-3xl border-2 border-black/10 inline-flex shadow-sm gap-2">
              <button
                type="button"
                onClick={() => setActiveTab('boarding')}
                className={`py-2.5 px-4 sm:px-6 rounded-2xl font-black text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer ${
                  activeTab === 'boarding'
                    ? 'bg-sanctuary-forest text-white shadow-md scale-102'
                    : 'text-sanctuary-dark/70 hover:text-sanctuary-dark'
                }`}
              >
                <DoodleHome className="w-4 h-4 text-sanctuary-gold" />
                <span>🏡 Cage-Free Boarding</span>
                <span className="text-[10px] bg-white/20 text-white px-2 py-0.5 rounded-full font-bold hidden sm:inline">
                  From ₹625/night
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('grooming')}
                className={`py-2.5 px-4 sm:px-6 rounded-2xl font-black text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer ${
                  activeTab === 'grooming'
                    ? 'bg-sanctuary-forest text-white shadow-md scale-102'
                    : 'text-sanctuary-dark/70 hover:text-sanctuary-dark'
                }`}
              >
                <DoodleScissors className="w-4 h-4 text-emerald-400" />
                <span>✂️ Pet Grooming & Spa</span>
                <span className="text-[10px] bg-white/20 text-white px-2 py-0.5 rounded-full font-bold hidden sm:inline">
                  From ₹499
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* 4. THE INTERACTIVE "CHOOSE SIZE & INSTANT PRICE" CONSOLE */}
        {/* ============================================================ */}
        <div className="mt-6 sm:mt-8 bg-white rounded-3xl p-4 sm:p-7 border-2 border-black/10 shadow-xl relative text-left">
          
          {/* Cute Doodle Stamp */}
          <div className="absolute -top-3.5 right-6 bg-sanctuary-gold text-sanctuary-dark px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider shadow-sm flex items-center gap-1.5 border border-amber-300">
            <DoodleCrown className="w-3.5 h-3.5 text-sanctuary-dark" />
            <span>Instant Transparent Pricing</span>
          </div>

          {/* TAB 1: BOARDING CALCULATOR & SIZE CONSOLE */}
          {activeTab === 'boarding' && (
            <div className="space-y-5">
              
              {/* Species & Header Row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-black/10 pb-3">
                <div>
                  <h3 className="text-lg sm:text-xl font-black text-sanctuary-dark flex items-center gap-2">
                    <span>1. Select Pet & Size</span>
                    <DoodleArrow className="w-5 h-5 text-sanctuary-gold hidden sm:inline" />
                  </h3>
                  <p className="text-xs text-sanctuary-dark/70 font-medium">
                    All overnight stays include 3 daily lawn nature walks, private suite & live WhatsApp video updates.
                  </p>
                </div>

                {/* Dog / Cat Toggle */}
                <div className="flex items-center bg-sanctuary-sand p-1 rounded-2xl border border-black/10 shadow-xs shrink-0 self-start sm:self-auto">
                  <button
                    type="button"
                    onClick={() => setBoardPet('dog')}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all ${
                      boardPet === 'dog'
                        ? 'bg-sanctuary-forest text-white shadow-xs'
                        : 'text-sanctuary-dark/70 hover:text-sanctuary-dark'
                    }`}
                  >
                    🐕 Dogs
                  </button>
                  <button
                    type="button"
                    onClick={() => setBoardPet('cat')}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all ${
                      boardPet === 'cat'
                        ? 'bg-sanctuary-forest text-white shadow-xs'
                        : 'text-sanctuary-dark/70 hover:text-sanctuary-dark'
                    }`}
                  >
                    🐈 Cats
                  </button>
                </div>
              </div>

              {/* 3 Large, Visible Size Cards for Dogs (Front and Center) */}
              {boardPet === 'dog' ? (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    {
                      id: 'small' as const,
                      emoji: '🐶',
                      title: 'Small Breed',
                      weight: '< 10 kg',
                      examples: 'Shih Tzu, Pug, Maltese, Pomeranian, Indie Pups',
                      rate: '₹625 / night',
                      orig: '₹750',
                      save: 'Save ₹125/day',
                    },
                    {
                      id: 'medium' as const,
                      emoji: '🐕',
                      title: 'Medium Breed',
                      weight: '10 – 25 kg',
                      examples: 'Beagle, Indie Dog, Cocker Spaniel, French Bulldog',
                      rate: '₹750 / night',
                      orig: '₹899',
                      save: 'Save ₹149/day',
                    },
                    {
                      id: 'large' as const,
                      emoji: '🦮',
                      title: 'Large Breed',
                      weight: '> 25 kg',
                      examples: 'Golden Retriever, Labrador, GSD, Husky, Rottweiler',
                      rate: '₹875 / night',
                      orig: '₹1050',
                      save: 'Save ₹175/day',
                    },
                  ].map((s) => {
                    const isSelected = boardSize === s.id;
                    return (
                      <div
                        key={s.id}
                        onClick={() => setBoardSize(s.id)}
                        className={`p-3.5 sm:p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200 relative text-left shadow-xs ${
                          isSelected
                            ? 'border-sanctuary-gold bg-amber-50/90 ring-2 ring-sanctuary-gold/40'
                            : 'border-black/10 bg-[#FAF8F5] hover:border-black/25'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">{s.emoji}</span>
                            <div>
                              <div className="text-sm font-black text-sanctuary-dark leading-tight">
                                {s.title}
                              </div>
                              <div className="text-xs font-bold text-sanctuary-gold">
                                {s.weight}
                              </div>
                            </div>
                          </div>
                          {isSelected && (
                            <span className="size-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-black shadow-xs">
                              ✓
                            </span>
                          )}
                        </div>

                        <p className="text-[11px] text-sanctuary-dark/70 font-medium mt-2 leading-snug line-clamp-2">
                          {s.examples}
                        </p>

                        <div className="mt-2.5 pt-2 border-t border-black/5 flex items-baseline justify-between">
                          <span className="text-xs line-through text-red-500 font-bold">
                            {s.orig}
                          </span>
                          <span className="text-base font-black text-sanctuary-dark">
                            {s.rate}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-amber-50/70 border-2 border-sanctuary-gold flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">🐈</span>
                    <div>
                      <div className="text-sm font-black text-sanctuary-dark">
                        Cozy Cat Boarding Condo
                      </div>
                      <div className="text-xs text-sanctuary-dark/70 font-medium">
                        Private multi-tier vertical condo, cozy bedding, soothing music & daily cuddle time.
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs line-through text-red-500 font-bold">₹750</div>
                    <div className="text-lg font-black text-sanctuary-dark">₹625 / night</div>
                  </div>
                </div>
              )}

              {/* Nights Stepper & Coupon Offer Strip */}
              <div className="p-3.5 bg-sanctuary-sand/60 rounded-2xl border border-black/5 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-sanctuary-dark">
                      2. How Many Nights:
                    </span>
                    <span className="text-xs font-bold text-sanctuary-forest bg-white px-2.5 py-0.5 rounded-full border border-black/10">
                      {boardNights} Nights Stay
                    </span>
                  </div>

                  {/* Stepper Buttons */}
                  <div className="flex items-center gap-1.5">
                    {[2, 4, 6, 8, 10, 15].map((n) => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => setBoardNights(n)}
                        className={`px-3 py-1 rounded-xl text-xs font-black transition-all ${
                          boardNights === n
                            ? 'bg-sanctuary-forest text-white shadow-xs'
                            : 'bg-white border border-black/10 text-sanctuary-dark hover:border-amber-400'
                        }`}
                      >
                        {n}d {n >= 6 ? '🎁' : ''}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Perk Callout */}
                {activePerk && (
                  <div className="p-2 rounded-xl bg-emerald-100 text-emerald-900 border border-emerald-400 flex items-center justify-between text-xs font-bold">
                    <div className="flex items-center gap-2">
                      <span className="bg-emerald-600 text-white text-[10px] font-black px-2 py-0.5 rounded-md uppercase">
                        {activePerk.badge}
                      </span>
                      <span>{activePerk.desc}</span>
                    </div>
                    <span className="font-mono bg-white px-2 py-0.5 rounded text-[11px] font-black text-emerald-950">
                      Code: {activePerk.code}
                    </span>
                  </div>
                )}
              </div>

              {/* Total Price Bar & Dual Actions (Add to Cart + Instant Book) */}
              <div className="p-4 bg-gradient-to-r from-[#FAF8F5] via-white to-amber-50/50 rounded-2xl border-2 border-amber-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                <div>
                  <div className="text-xs font-bold text-sanctuary-dark/70">
                    Total for {boardNights} Nights ({boardRate.name}):
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl sm:text-3xl font-black text-sanctuary-dark">
                      ₹{boardTotal}
                    </span>
                    <span className="text-sm line-through text-red-500 font-bold">
                      ₹{boardOriginalTotal}
                    </span>
                    <span className="text-xs font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                      You Save ₹{boardSavings}!
                    </span>
                  </div>
                </div>

                {/* The Two Direct Buttons */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      addItemToCart({
                        id: `board_${boardPet}_${boardSize}_${boardNights}n`,
                        category: 'boarding',
                        name: `${boardRate.name}`,
                        subtitle: `${boardNights} Nights • Private Suite`,
                        price: boardTotal,
                        origPrice: boardOriginalTotal,
                        nights: boardNights,
                        petType: boardPet,
                        petSize: boardPet === 'dog' ? boardSize : undefined,
                        appliedCouponCode: boardNights >= 6 ? 'STAY6FREE1' : undefined,
                      });
                    }}
                    className="py-2.5 px-4 bg-amber-50 hover:bg-amber-100 text-amber-950 border border-amber-300 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all shadow-2xs active:scale-95 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-sm text-amber-700">
                      add_shopping_cart
                    </span>
                    <span>Add to Cart</span>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      onOpenBooking({
                        type: 'boarding',
                        serviceName: boardRate.name,
                        basePrice: boardRate.daily,
                        origPrice: boardRate.original,
                        petType: boardPet,
                        petSize: boardPet === 'dog' ? boardSize : undefined,
                        nights: boardNights,
                        appliedCouponCode: boardNights >= 6 ? 'STAY6FREE1' : undefined,
                      })
                    }
                    className="py-2.5 px-5 bg-sanctuary-forest hover:bg-black text-white rounded-xl font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-md transition-all active:scale-95 cursor-pointer"
                  >
                    <span>Reserve Slot Now</span>
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: GROOMING PACKAGES & SIZE CONSOLE */}
          {activeTab === 'grooming' && (
            <div className="space-y-5">
              
              {/* Species & Header Row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-black/10 pb-3">
                <div>
                  <h3 className="text-lg sm:text-xl font-black text-sanctuary-dark flex items-center gap-2">
                    <span>1. Select Pet Size / Breed</span>
                    <DoodleBubbles className="w-5 h-5 text-sky-400 hidden sm:inline" />
                  </h3>
                  <p className="text-xs text-sanctuary-dark/70 font-medium">
                    Prices below automatically adjust to your pet’s exact weight class.
                  </p>
                </div>

                {/* Dog / Cat Toggle */}
                <div className="flex items-center bg-sanctuary-sand p-1 rounded-2xl border border-black/10 shadow-xs shrink-0 self-start sm:self-auto">
                  <button
                    type="button"
                    onClick={() => {
                      setGroomPet('dog');
                      setGroomBreed('Shih Tzu');
                    }}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all ${
                      groomPet === 'dog'
                        ? 'bg-sanctuary-forest text-white shadow-xs'
                        : 'text-sanctuary-dark/70 hover:text-sanctuary-dark'
                    }`}
                  >
                    🐕 Dogs
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setGroomPet('cat');
                      setGroomBreed('Persian Cat');
                    }}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all ${
                      groomPet === 'cat'
                        ? 'bg-sanctuary-forest text-white shadow-xs'
                        : 'text-sanctuary-dark/70 hover:text-sanctuary-dark'
                    }`}
                  >
                    🐈 Cats
                  </button>
                </div>
              </div>

              {/* 3 Size Cards for Dogs */}
              {groomPet === 'dog' ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      {
                        id: 'small' as const,
                        emoji: '🐶',
                        title: 'Small Breed',
                        weight: '< 10 kg',
                        examples: 'Shih Tzu, Pug, Maltese, Pomeranian',
                        badge: 'From ₹499',
                      },
                      {
                        id: 'medium' as const,
                        emoji: '🐕',
                        title: 'Medium Breed',
                        weight: '10 – 25 kg',
                        examples: 'Beagle, Indie Dog, Cocker Spaniel',
                        badge: 'From ₹699',
                      },
                      {
                        id: 'large' as const,
                        emoji: '🦮',
                        title: 'Large Breed',
                        weight: '> 25 kg',
                        examples: 'Golden Retriever, Labrador, GSD, Husky',
                        badge: 'From ₹849',
                      },
                    ].map((s) => {
                      const isSelected = groomSize === s.id;
                      return (
                        <div
                          key={s.id}
                          onClick={() => {
                            setGroomSize(s.id);
                            setGroomBreed(s.title);
                          }}
                          className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all duration-200 relative text-left shadow-xs ${
                            isSelected
                              ? 'border-sanctuary-gold bg-amber-50/90 ring-2 ring-sanctuary-gold/40'
                              : 'border-black/10 bg-[#FAF8F5] hover:border-black/25'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-2xl">{s.emoji}</span>
                              <div>
                                <div className="text-sm font-black text-sanctuary-dark">
                                  {s.title}
                                </div>
                                <div className="text-xs font-bold text-sanctuary-gold">
                                  {s.weight}
                                </div>
                              </div>
                            </div>
                            {isSelected ? (
                              <span className="size-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-black shadow-xs">
                                ✓
                              </span>
                            ) : (
                              <span className="text-[10px] font-bold text-sanctuary-dark/50">
                                {s.badge}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Quick Breed Filter Chips */}
                  <div className="p-2.5 bg-sanctuary-sand/60 rounded-2xl border border-black/5 flex flex-wrap items-center gap-1.5 text-xs">
                    <span className="text-[11px] font-black text-sanctuary-dark shrink-0">
                      Or tap your breed:
                    </span>
                    {dogBreeds.map((b) => (
                      <button
                        key={b.name}
                        type="button"
                        onClick={() => {
                          setGroomSize(b.size);
                          setGroomBreed(b.name);
                        }}
                        className={`px-2.5 py-1 rounded-xl text-[11px] font-bold whitespace-nowrap transition-all border ${
                          groomBreed === b.name
                            ? 'bg-sanctuary-forest text-white border-sanctuary-forest font-black shadow-xs'
                            : 'bg-white border-black/10 text-sanctuary-dark/80 hover:border-amber-400'
                        }`}
                      >
                        {b.name}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap items-center gap-2">
                  {catBreeds.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setGroomBreed(c)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                        groomBreed === c
                          ? 'bg-sanctuary-forest text-white border-sanctuary-forest font-black shadow-xs'
                          : 'bg-white border-black/10 text-sanctuary-dark hover:border-amber-400'
                      }`}
                    >
                      🐈 {c}
                    </button>
                  ))}
                </div>
              )}

              {/* 4 Clickable Package Selectors */}
              <div className="space-y-2">
                <div className="text-xs font-black text-sanctuary-dark uppercase tracking-wider flex items-center justify-between">
                  <span>2. Pick Package for {groomBreed}:</span>
                  <span className="text-emerald-700 font-bold text-[11px]">
                    Code GROOM10 gives 10% OFF &gt; ₹999
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {groomingPackages.slice(0, 4).map((pkg) => {
                    const price =
                      groomPet === 'cat' ? pkg.pricing.cat : pkg.pricing[groomSize];
                    const isSelected = selectedGroomPackage === pkg.id;

                    return (
                      <div
                        key={pkg.id}
                        onClick={() => setSelectedGroomPackage(pkg.id)}
                        className={`p-3 rounded-2xl border-2 cursor-pointer transition-all text-left flex flex-col justify-between space-y-1 shadow-xs ${
                          isSelected
                            ? 'border-sanctuary-gold bg-amber-50/90 ring-2 ring-sanctuary-gold/40'
                            : 'border-black/10 bg-[#FAF8F5] hover:border-black/25'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between">
                            <span
                              className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${pkg.badgeBg}`}
                            >
                              {pkg.badge}
                            </span>
                            {isSelected && (
                              <span className="text-xs text-emerald-600 font-black">✓</span>
                            )}
                          </div>
                          <div className="text-xs sm:text-sm font-black text-sanctuary-dark leading-tight mt-1">
                            {pkg.title}
                          </div>
                        </div>

                        <div className="text-base sm:text-lg font-black text-sanctuary-dark pt-1 border-t border-black/5">
                          ₹{price}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Selected Grooming Summary & Dual Action Buttons */}
              <div className="p-4 bg-gradient-to-r from-[#FAF8F5] via-white to-amber-50/50 rounded-2xl border-2 border-amber-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                <div>
                  <div className="text-xs font-bold text-sanctuary-dark/70">
                    {currentGroomPkg.title} for {groomBreed} ({groomSize.toUpperCase()}):
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl sm:text-3xl font-black text-sanctuary-dark">
                      ₹{currentGroomPrice}
                    </span>
                    <span className="text-sm line-through text-red-500 font-bold">
                      ₹{currentGroomOrig}
                    </span>
                    <span className="text-xs font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                      Save ₹{currentGroomSavings}!
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      addItemToCart({
                        id: `groom_${currentGroomPkg.id}_${groomPet}_${groomSize}`,
                        category: 'grooming',
                        name: `${currentGroomPkg.title} (${groomBreed})`,
                        subtitle: `${groomPet.toUpperCase()} • Studio Visit`,
                        price: currentGroomPrice,
                        origPrice: currentGroomOrig,
                        petType: groomPet,
                        petSize: groomPet === 'dog' ? groomSize : undefined,
                        petBreed: groomBreed,
                        appliedCouponCode: currentGroomPrice >= 1000 ? 'GROOM10' : undefined,
                      });
                    }}
                    className="py-2.5 px-4 bg-amber-50 hover:bg-amber-100 text-amber-950 border border-amber-300 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all shadow-2xs active:scale-95 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-sm text-amber-700">
                      add_shopping_cart
                    </span>
                    <span>Add to Cart</span>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      onOpenBooking({
                        type: 'grooming',
                        serviceName: `${currentGroomPkg.title} (${groomBreed})`,
                        basePrice: currentGroomPrice,
                        origPrice: currentGroomOrig,
                        petType: groomPet,
                        petSize: groomPet === 'dog' ? groomSize : undefined,
                        petBreed: groomBreed,
                        appliedCouponCode: currentGroomPrice >= 1000 ? 'GROOM10' : undefined,
                      })
                    }
                    className="py-2.5 px-5 bg-sanctuary-forest hover:bg-black text-white rounded-xl font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-md transition-all active:scale-95 cursor-pointer"
                  >
                    <span>Book Appointment</span>
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ============================================================ */}
      {/* 5. DOODLE TRUST PILLARS ("Why Bangalore Pet Parents Love Us") */}
      {/* ============================================================ */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center space-y-1 mb-5">
          <h2 className="text-2xl sm:text-3xl font-black text-sanctuary-dark flex items-center justify-center gap-2">
            <span>Why Pet Parents Trust Us 100%</span>
            <DoodleHeart className="w-5 h-5 text-rose-500" />
          </h2>
          <p className="text-xs sm:text-sm text-sanctuary-dark/70 font-medium">
            Designed from the ground up for zero stress, maximum hygiene & pure cuddle love.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {[
            {
              icon: <DoodleHome className="w-8 h-8 text-emerald-600" />,
              title: 'Zero Wire Cages Ever',
              desc: 'Spacious private suites with orthopedic mattresses and soundproof cozy walls.',
              badge: 'Guaranteed Cage-Free',
            },
            {
              icon: <DoodlePaw className="w-8 h-8 text-amber-500" />,
              title: 'Daily WhatsApp Videos',
              desc: 'Watch HD videos of your baby playing, eating & sniffing morning and night.',
              badge: 'Live CCTV & Updates',
            },
            {
              icon: <DoodleBone className="w-8 h-8 text-sky-500" />,
              title: '3 Lawn Nature Walks',
              desc: 'Sniffing, running on green grass & playing ball with certified caretakers.',
              badge: 'Real Lawn Exercise',
            },
            {
              icon: <DoodleShield className="w-8 h-8 text-purple-600" />,
              title: 'Doorstep AC Pet Cab',
              desc: 'Convenient taxi pickup & drop across Kanakapura Road, JP Nagar & South BLR.',
              badge: 'Stress-Free Commute',
            },
          ].map((card, i) => (
            <div
              key={i}
              className="p-4 rounded-2xl bg-white border border-black/10 shadow-xs hover:shadow-md transition-all space-y-2 relative group"
            >
              <div className="flex items-center justify-between">
                {card.icon}
                <span className="text-[10px] font-black text-sanctuary-forest bg-sanctuary-forest/10 px-2 py-0.5 rounded-full">
                  {card.badge}
                </span>
              </div>
              <h3 className="text-base font-black text-sanctuary-dark pt-1">
                {card.title}
              </h3>
              <p className="text-xs text-sanctuary-dark/70 font-medium leading-relaxed">
                {card.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ============================================================ */}
      {/* 6. ALL 6 GROOMING SERVICES CAROUSEL (Scroll to view all) */}
      {/* ============================================================ */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-sanctuary-dark flex items-center gap-2">
              <span>Complete Grooming & Spa Packages</span>
              <DoodleScissors className="w-5 h-5 text-emerald-600" />
            </h2>
            <p className="text-xs text-sanctuary-dark/70 font-medium">
              Showing exact prices for <strong>{groomBreed} ({groomSize.toUpperCase()})</strong>
            </p>
          </div>
          <span className="text-xs font-bold text-amber-800 bg-amber-100 px-3 py-1 rounded-full hidden sm:inline">
            👉 Scroll right for all 6 packages
          </span>
        </div>

        {/* Horizontal Scrollable Packages */}
        <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-3 -mx-4 px-4 sm:mx-0 sm:px-0 no-scrollbar scroll-smooth">
          {groomingPackages.map((pkg) => {
            const price = groomPet === 'cat' ? pkg.pricing.cat : pkg.pricing[groomSize];
            const orig = groomPet === 'cat' ? pkg.orig.cat : pkg.orig[groomSize];
            const save = orig - price;

            return (
              <div
                key={pkg.id}
                className={`w-[82vw] sm:w-[310px] shrink-0 snap-center bg-white rounded-3xl p-4 sm:p-5 border-2 flex flex-col justify-between space-y-3 shadow-xs hover:shadow-lg transition-all relative ${
                  pkg.popular
                    ? 'border-sanctuary-gold ring-2 ring-sanctuary-gold/40'
                    : 'border-black/10 hover:border-black/20'
                }`}
              >
                {pkg.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-sanctuary-gold text-sanctuary-dark text-[10px] font-black px-3 py-0.5 rounded-full uppercase tracking-wider shadow-sm flex items-center gap-1 z-10 border border-amber-300">
                    <DoodleCrown className="w-3 h-3 text-sanctuary-dark" />
                    <span>Pet Parent Favorite</span>
                  </div>
                )}

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${pkg.badgeBg}`}
                    >
                      {pkg.badge}
                    </span>
                    <span className="text-[10px] font-black text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                      Save ₹{save}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-black text-sanctuary-dark leading-tight">
                      {pkg.title}
                    </h3>
                    <p className="text-[11px] text-sanctuary-dark/70 font-medium mt-1 leading-snug line-clamp-2">
                      {pkg.desc}
                    </p>
                  </div>

                  {/* Price Tag */}
                  <div className="p-2.5 bg-sanctuary-sand/50 rounded-xl border border-black/5 flex items-baseline justify-between">
                    <div>
                      <span className="text-[9px] font-semibold text-sanctuary-dark/60 block">
                        Full Treatment:
                      </span>
                      <span className="text-xs line-through text-red-500 font-bold">
                        ₹{orig}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-black text-sanctuary-dark">
                        ₹{price}
                      </span>
                    </div>
                  </div>

                  {/* Bullet Inclusions */}
                  <div className="space-y-1 pt-1 border-t border-black/5">
                    <span className="text-[9px] font-black uppercase text-sanctuary-dark/50 block">
                      Includes:
                    </span>
                    {pkg.inclusions.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-1.5 text-[11px] leading-tight">
                        <span className="material-symbols-outlined text-emerald-600 text-xs shrink-0 mt-0.5 font-black">
                          check
                        </span>
                        <span className="text-sanctuary-dark/80 font-medium">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Dual Action Buttons */}
                <div className="pt-2 space-y-1.5 border-t border-black/5">
                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        addItemToCart({
                          id: `groom_pkg_${pkg.id}_${groomPet}_${groomSize}`,
                          category: 'grooming',
                          name: `${pkg.title} (${groomBreed})`,
                          subtitle: `${groomPet.toUpperCase()} • Studio Visit`,
                          price: price,
                          origPrice: orig,
                          petType: groomPet,
                          petSize: groomPet === 'dog' ? groomSize : undefined,
                          petBreed: groomBreed,
                        });
                      }}
                      className="py-2 px-1.5 rounded-xl font-bold text-[11px] bg-amber-50 hover:bg-amber-100 text-amber-950 border border-amber-300 flex items-center justify-center gap-1 transition-all active:scale-95 shadow-2xs cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-sm text-amber-700">
                        add_shopping_cart
                      </span>
                      <span>Add to Cart</span>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        onOpenBooking({
                          type: 'grooming',
                          serviceName: `${pkg.title} (${groomBreed})`,
                          basePrice: price,
                          origPrice: orig,
                          petType: groomPet,
                          petSize: groomPet === 'dog' ? groomSize : undefined,
                          petBreed: groomBreed,
                          appliedCouponCode: price >= 1000 ? 'GROOM10' : undefined,
                        })
                      }
                      className="py-2 px-1.5 bg-sanctuary-forest hover:bg-black text-white rounded-xl font-black text-[11px] uppercase tracking-wider flex items-center justify-center gap-1 shadow-sm transition-all active:scale-95 cursor-pointer"
                    >
                      <span>Book Now</span>
                      <span className="material-symbols-outlined text-xs">arrow_forward</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ============================================================ */}
      {/* 7. QUICK ADD-ONS (Click to add to cart) */}
      {/* ============================================================ */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="p-4 sm:p-5 bg-sanctuary-sand/40 rounded-3xl border border-black/10 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl">✨</span>
              <h3 className="text-sm sm:text-base font-black text-sanctuary-dark">
                Quick Spa Add-Ons & Touch-Ups
              </h3>
            </div>
            <span className="text-[11px] text-sanctuary-dark/60 font-semibold hidden sm:inline">
              Tap any treatment to add to your appointment
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
            {addOns.map((addon, i) => (
              <div
                key={i}
                onClick={() => {
                  addItemToCart({
                    id: `addon_${addon.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}`,
                    category: 'grooming',
                    name: addon.name,
                    subtitle: 'Quick Add-On',
                    price: addon.price,
                    origPrice: Math.round(addon.price * 1.25),
                  });
                }}
                className="p-2.5 bg-white rounded-2xl border border-black/10 hover:border-sanctuary-gold text-center cursor-pointer transition-all hover:shadow-xs group"
              >
                <span className="text-2xl block mb-1 group-hover:scale-110 transition-transform">
                  {addon.icon}
                </span>
                <div className="text-[11px] font-black text-sanctuary-dark leading-tight truncate">
                  {addon.name}
                </div>
                <div className="text-xs font-black text-sanctuary-forest mt-0.5">
                  ₹{addon.price}
                </div>
                <div className="text-[9px] font-bold text-amber-800 bg-amber-50 rounded px-1 mt-1 group-hover:bg-amber-100">
                  + Add to Cart
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 8. STUDIO LOCATION & TRANSPARENCY CARD */}
      {/* ============================================================ */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="p-4 sm:p-6 bg-gradient-to-r from-sanctuary-forest to-[#142B20] text-white rounded-3xl shadow-lg flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-left">
            <div className="inline-flex items-center gap-1 text-[11px] font-black text-amber-300 uppercase tracking-wider">
              <span>📍 Visit Our Kanakapura Studio</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              Convenient Drop-Off on Kanakapura Main Road
            </h3>
            <p className="text-xs sm:text-sm text-white/80 font-medium max-w-xl">
              Beside Shani Mahatma Temple, NH 948, Bangalore. Open 9:00 AM – 8:00 PM daily. Show your online booking ID at the counter to avail exclusive festival discounts!
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 w-full sm:w-auto">
            <a
              href="https://maps.app.goo.gl/MqFTrZiLPbttv3eD6"
              target="_blank"
              rel="noopener noreferrer"
              className="py-2.5 px-4 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold border border-white/20 flex items-center justify-center gap-1.5 transition-all w-full sm:w-auto"
            >
              <span className="material-symbols-outlined text-sm text-sanctuary-gold">navigation</span>
              <span>Open in Google Maps</span>
            </a>

            <button
              onClick={() => onOpenBooking()}
              className="py-2.5 px-5 bg-sanctuary-gold hover:bg-amber-300 text-sanctuary-dark rounded-xl text-xs font-black uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-1.5 w-full sm:w-auto cursor-pointer"
            >
              <span>Book Appointment</span>
              <span className="material-symbols-outlined text-sm font-black">arrow_forward</span>
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};

export default EpicDoodleHomescreen;
