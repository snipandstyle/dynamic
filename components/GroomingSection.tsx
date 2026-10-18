import React, { useState, useRef } from 'react';
import { BookingDetails } from './CheckoutModal';
import { addItemToCart } from '../utils/cart';

interface GroomingSectionProps {
  onOpenBooking: (details?: BookingDetails) => void;
}

export const GroomingSection: React.FC<GroomingSectionProps> = ({ onOpenBooking }) => {
  const [petType, setPetType] = useState<'dog' | 'cat'>('dog');
  const [size, setSize] = useState<'small' | 'medium' | 'large'>('small');
  const [selectedBreed, setSelectedBreed] = useState<string>('Small Breeds (<10kg)');
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

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
    { name: 'Husky / Rottweiler', size: 'large' as const },
  ];

  const catBreeds = [
    'All Cats',
    'Persian Cat',
    'Indie Cat',
    'British Shorthair',
    'Maine Coon',
    'Siamese Cat',
  ];

  const handleSelectDogSize = (s: 'small' | 'medium' | 'large') => {
    setSize(s);
    const label = s === 'small' ? 'Small Breeds (<10kg)' : s === 'medium' ? 'Medium Breeds (10–25kg)' : 'Large Breeds (>25kg)';
    setSelectedBreed(label);
  };

  const handleSelectDogBreed = (breed: { name: string; size: 'small' | 'medium' | 'large' }) => {
    setSize(breed.size);
    setSelectedBreed(breed.name);
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -340, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 340, behavior: 'smooth' });
    }
  };

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
        'Teeth Brushing & Plaque Cleanse',
        'Freshening Mouth Spray',
        'Paw Pad Trimming & Soothing Balm',
        'Combing & Brushing',
        'Gentle Ear & Eye Cleaning',
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
    {
      id: 'puppy-kitten-spa',
      title: 'Puppy / Kitten Gentle Spa',
      subtitle: 'First Grooming Experience',
      tag: '🐾 PUPPY & KITTEN',
      tagBg: 'bg-sky-100 text-sky-900',
      popular: false,
      desc: 'Gentle, stress-free introduction to grooming for puppies and kittens under 6 months.',
      pricing: { small: 449, medium: 549, large: 649, cat: 549 },
      origPricing: { small: 599, medium: 749, large: 849, cat: 749 },
      inclusions: [
        'Gentle Tearless Shampoo Hydrobath',
        'Low-Noise Warm Fluff Blow Dry',
        'Puppy Cuddle & Desensitization',
        'Gentle Ear & Eye Wipe',
        'Paw Pad Moisturizing Balm',
      ],
      note: 'Ideal for pups & kittens under 6 months.',
    },
    {
      id: 'medicated-bath',
      title: 'Medicated & Anti-Tick Bath',
      subtitle: 'Therapeutic Skin Shield',
      tag: '🛡️ SKIN HEALTH',
      tagBg: 'bg-rose-100 text-rose-900',
      popular: false,
      desc: 'Clinical treatment bath with anti-fungal, anti-dandruff and anti-tick formulation for skin relief.',
      pricing: { small: 699, medium: 899, large: 1099, cat: 899 },
      origPricing: { small: 899, medium: 1149, large: 1399, cat: 1149 },
      inclusions: [
        'Medicated Anti-Tick & Flea Hydrobath',
        'Anti-Fungal Soothing Soak',
        'Dead Hair Removal & De-tangling',
        'Sanitary Area Gentle Wash',
        'High-Velocity Warm Blow Dry',
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
      <div className="max-w-7xl mx-auto w-full space-y-4 lg:space-y-4">
        
        {/* ============================================================ */}
        {/* PROMINENT FULL-WIDTH SIZE & BREED SELECTION CONSOLE */}
        {/* ============================================================ */}
        <div className="space-y-3 pb-2 border-b border-black/10">
          
          {/* Header & Title */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-sanctuary-gold/15 text-sanctuary-dark text-[11px] font-black uppercase tracking-wider">
                <span className="material-symbols-outlined text-xs text-sanctuary-gold">spa</span>
                <span>Fear-Free Certified Stylists • 10% OFF Code: GROOM10</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-sanctuary-dark tracking-tight leading-tight">
                Signature <span className="text-sanctuary-gold">Pet Grooming</span> & Spa Menu
              </h2>
            </div>

            {/* Species Toggle (Dogs vs Cats) */}
            <div className="flex items-center bg-sanctuary-sand p-1 rounded-2xl border border-black/10 shadow-xs shrink-0 self-start sm:self-auto">
              <button
                type="button"
                onClick={() => {
                  setPetType('dog');
                  setSelectedBreed('Small Breeds (<10kg)');
                }}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center gap-1.5 ${
                  petType === 'dog'
                    ? 'bg-sanctuary-forest text-white shadow-sm'
                    : 'text-sanctuary-dark/70 hover:text-sanctuary-dark'
                }`}
              >
                <span>🐕</span>
                <span>Dog Grooming</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setPetType('cat');
                  setSelectedBreed('All Cats');
                }}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center gap-1.5 ${
                  petType === 'cat'
                    ? 'bg-sanctuary-forest text-white shadow-sm'
                    : 'text-sanctuary-dark/70 hover:text-sanctuary-dark'
                }`}
              >
                <span>🐈</span>
                <span>Cat Grooming</span>
              </button>
            </div>
          </div>

          {/* HIGH-VISIBILITY 3 SIZE CARDS FOR DOGS (CANNOT BE MISSED) */}
          {petType === 'dog' ? (
            <div className="space-y-2.5">
              <div className="text-xs font-black text-sanctuary-dark uppercase tracking-wider flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sanctuary-gold text-base">straighten</span>
                <span>Step 1: Choose Your Dog's Size (All Prices Below Adjust Instantly):</span>
              </div>

              {/* 3 Prominent Responsive Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
                {[
                  {
                    id: 'small' as const,
                    emoji: '🐶',
                    title: 'Small Breed',
                    weight: 'Under 10 kg',
                    examples: 'Shih Tzu, Pug, Maltese, Pomeranian, Lhasa, Indie Pups',
                    badge: 'From ₹499',
                  },
                  {
                    id: 'medium' as const,
                    emoji: '🐕',
                    title: 'Medium Breed',
                    weight: '10 – 25 kg',
                    examples: 'Beagle, Indie Dog, Cocker Spaniel, French Bulldog, Corgi',
                    badge: 'From ₹699',
                  },
                  {
                    id: 'large' as const,
                    emoji: '🦮',
                    title: 'Large Breed',
                    weight: 'Over 25 kg',
                    examples: 'Golden Retriever, Labrador, German Shepherd, Husky, Rottweiler',
                    badge: 'From ₹849',
                  },
                ].map((s) => {
                  const isSelected = size === s.id;
                  return (
                    <div
                      key={s.id}
                      onClick={() => handleSelectDogSize(s.id)}
                      className={`p-3.5 sm:p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200 relative text-left shadow-xs hover:shadow-md ${
                        isSelected
                          ? 'border-sanctuary-gold bg-amber-50/90 ring-2 ring-sanctuary-gold/40'
                          : 'border-black/10 bg-white hover:border-black/25'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{s.emoji}</span>
                          <div>
                            <h3 className="text-sm sm:text-base font-black text-sanctuary-dark leading-tight">
                              {s.title}
                            </h3>
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
                          <span className="text-[10px] font-bold text-sanctuary-dark/50 bg-black/5 px-2 py-0.5 rounded-full">
                            {s.badge}
                          </span>
                        )}
                      </div>

                      <p className="text-[11px] text-sanctuary-dark/70 font-medium mt-2 leading-snug line-clamp-2">
                        {s.examples}
                      </p>

                      <div className="mt-2 pt-2 border-t border-black/5 flex items-center justify-between text-[10px] font-bold">
                        <span className={isSelected ? 'text-emerald-800 font-black' : 'text-sanctuary-dark/60'}>
                          {isSelected ? '● ACTIVE SIZE SELECTED' : 'Click to select size'}
                        </span>
                        <span className="text-sanctuary-gold font-black">
                          {s.badge}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Quick Breed Filter Chips */}
              <div className="p-2.5 bg-sanctuary-sand/60 rounded-2xl border border-black/5 flex flex-wrap items-center gap-1.5 text-xs">
                <span className="text-[11px] font-black text-sanctuary-dark shrink-0">
                  Or pick by breed:
                </span>
                <button
                  type="button"
                  onClick={() => handleSelectDogSize(size)}
                  className={`px-2.5 py-1 rounded-xl text-[11px] font-black whitespace-nowrap transition-all border ${
                    selectedBreed.includes('Breeds')
                      ? 'bg-sanctuary-forest text-white border-sanctuary-forest shadow-xs'
                      : 'bg-white border-black/10 text-sanctuary-dark/80 hover:border-amber-400'
                  }`}
                >
                  All {size.charAt(0).toUpperCase() + size.slice(1)} Breeds
                </button>
                {dogBreeds.map((b) => (
                  <button
                    key={b.name}
                    type="button"
                    onClick={() => handleSelectDogBreed(b)}
                    className={`px-2.5 py-1 rounded-xl text-[11px] font-bold whitespace-nowrap transition-all border ${
                      selectedBreed === b.name
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
            /* CAT SIZE / BREED CONSOLE */
            <div className="space-y-2.5">
              <div className="text-xs font-black text-sanctuary-dark uppercase tracking-wider flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sanctuary-gold text-base">pets</span>
                <span>Select Cat Breed / Coat Type (All Packages Adjust Below):</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                {catBreeds.map((catName) => {
                  const isSelected = selectedBreed === catName;
                  return (
                    <div
                      key={catName}
                      onClick={() => setSelectedBreed(catName)}
                      className={`p-3 rounded-2xl border-2 cursor-pointer transition-all text-center shadow-xs ${
                        isSelected
                          ? 'border-sanctuary-gold bg-amber-50/90 ring-2 ring-sanctuary-gold/40'
                          : 'border-black/10 bg-white hover:border-black/25'
                      }`}
                    >
                      <span className="text-xl block mb-1">🐈</span>
                      <div className="text-xs font-black text-sanctuary-dark leading-tight">
                        {catName}
                      </div>
                      <div className="text-[10px] text-sanctuary-gold font-bold mt-1">
                        {isSelected ? '✓ Selected' : 'Tap to select'}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Verified Selection Banner */}
          <div className="p-2 sm:p-2.5 rounded-xl bg-gradient-to-r from-emerald-50 to-amber-50 border border-emerald-300/80 flex items-center justify-between text-xs text-sanctuary-dark">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-emerald-600 text-sm font-black">check_circle</span>
              <span className="font-bold text-[11px] sm:text-xs">
                Active Selection: <strong className="text-emerald-900 font-black">{selectedBreed} {petType === 'dog' ? `(${size.toUpperCase()} - ${size === 'small' ? '<10kg' : size === 'medium' ? '10–25kg' : '>25kg'})` : ''}</strong>
              </span>
            </div>
            <span className="text-[10px] font-bold text-sanctuary-dark/70 hidden sm:inline">
              ✓ All package prices below reflect this selection
            </span>
          </div>
        </div>

        {/* ============================================================ */}
        {/* SLIM AYUDHA POOJA & DASARA FESTIVE GROOMING STRIP */}
        {/* ============================================================ */}
        <div
          onClick={() => onOpenBooking({
            type: 'grooming',
            serviceName: 'Special Package Care & Spa',
            basePrice: petType === 'cat' ? 874 : packages[1].pricing[size],
            appliedCouponCode: 'GROOM10',
          })}
          className="flex items-center justify-between p-2.5 sm:p-3 rounded-2xl bg-gradient-to-r from-amber-900 via-amber-800 to-amber-950 text-white cursor-pointer hover:shadow-md transition-all border border-amber-400/50"
        >
          <div className="flex items-center gap-2.5">
            <span className="bg-amber-400 text-black text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-wide">
              🎉 10% OFF
            </span>
            <div>
              <p className="text-xs sm:text-sm font-black text-white leading-tight">
                Ayudha Pooja & Dasara Pet Makeover • Spend ₹500+ for Free In-Store Bath Reward
              </p>
              <p className="text-[10px] text-amber-200 font-medium hidden sm:block">
                Use code <span className="font-bold text-yellow-300">GROOM10</span> on grooming packages above ₹999 • Kanakapura Main Road Studio
              </p>
            </div>
          </div>
          <button className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-black text-xs font-black rounded-xl uppercase tracking-wider shrink-0 transition-transform active:scale-95 flex items-center gap-1 shadow-sm">
            <span>Claim Offer</span>
            <span className="material-symbols-outlined text-xs">arrow_forward</span>
          </button>
        </div>

        {/* ============================================================ */}
        {/* HORIZONTAL SCROLL CAROUSEL: ALL SERVICES (Scroll right for more) */}
        {/* ============================================================ */}
        <div className="space-y-2">
          {/* Section header for the services with desktop scroll buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm font-black text-sanctuary-dark">
                Available Packages for {selectedBreed}:
              </span>
              <span className="text-[10px] text-amber-800 font-bold bg-amber-100 px-2 py-0.5 rounded-full">
                👉 Scroll right to view all {packages.length} services
              </span>
            </div>

            {/* Desktop Left / Right Scroll Buttons */}
            <div className="hidden sm:flex items-center gap-1.5">
              <button
                type="button"
                onClick={scrollLeft}
                className="size-7 rounded-lg border border-black/15 bg-white hover:bg-sanctuary-sand text-sanctuary-dark flex items-center justify-center transition-all shadow-2xs"
                title="Scroll Left"
              >
                <span className="material-symbols-outlined text-base">chevron_left</span>
              </button>
              <button
                type="button"
                onClick={scrollRight}
                className="size-7 rounded-lg border border-black/15 bg-white hover:bg-sanctuary-sand text-sanctuary-dark flex items-center justify-center transition-all shadow-2xs"
                title="Scroll Right"
              >
                <span className="material-symbols-outlined text-base">chevron_right</span>
              </button>
            </div>
          </div>

          {/* Carousel Track */}
          <div className="relative">
            <div 
              ref={scrollContainerRef}
              className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-3 -mx-4 px-4 sm:mx-0 sm:px-0 no-scrollbar scroll-smooth"
              onScroll={(e) => {
                const target = e.currentTarget;
                const scrollLeft = target.scrollLeft;
                const cardWidth = 320;
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
                    className={`w-[84vw] sm:w-[320px] shrink-0 snap-center bg-[#FAF8F5] rounded-2xl p-4 border flex flex-col justify-between space-y-3 transition-all duration-300 relative group shadow-sm hover:shadow-lg ${
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

                    <div className="space-y-2">
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
                        <h3 className="text-lg font-black text-sanctuary-dark leading-tight">
                          {pkg.title}
                        </h3>
                        <div className="text-[11px] font-bold text-sanctuary-gold mt-0.5">
                          {pkg.subtitle}
                        </div>
                        <p className="text-[11px] text-sanctuary-dark/70 font-medium mt-1 leading-snug line-clamp-2">
                          {pkg.desc}
                        </p>
                      </div>

                      {/* Pricing Box (Shows selected size price directly!) */}
                      <div className="p-2.5 bg-white rounded-xl border border-black/5 flex items-baseline justify-between shadow-xs">
                        <div>
                          <span className="text-[9px] text-sanctuary-dark/60 font-semibold block leading-tight">
                            {petType === 'cat' ? 'Cat Price:' : `${size.toUpperCase()} (${selectedBreed}):`}
                          </span>
                          <span className="text-xs line-through text-red-500 font-bold decoration-red-500">₹{orig}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-2xl font-black text-sanctuary-dark">₹{price}</span>
                        </div>
                      </div>

                      {/* Inclusions */}
                      <div className="space-y-1 pt-1 border-t border-black/5">
                        <span className="text-[9px] font-black uppercase tracking-wider text-sanctuary-dark/50 block mb-0.5">
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
                          <div className="text-[9px] text-amber-800 font-semibold italic pt-0.5">
                            *{pkg.note}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Dual Action Buttons: Add to Cart & Book Now */}
                    <div className="pt-2 space-y-1.5 border-t border-black/5">
                      <div className="grid grid-cols-2 gap-1.5">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            addItemToCart({
                              id: `groom_${pkg.id}_${petType}_${size}`,
                              category: 'grooming',
                              name: `${pkg.title} (${selectedBreed})`,
                              subtitle: petType === 'cat' ? 'Cat Grooming' : `${size.toUpperCase()}`,
                              price: price,
                              origPrice: orig,
                              petType: petType,
                              petSize: petType === 'dog' ? size : undefined,
                              petBreed: selectedBreed,
                            });
                          }}
                          className="py-2 px-1.5 rounded-xl font-bold text-[11px] bg-amber-50 hover:bg-amber-100 text-amber-950 border border-amber-300 flex items-center justify-center gap-1 transition-all active:scale-95 shadow-2xs"
                        >
                          <span className="material-symbols-outlined text-sm text-amber-700">add_shopping_cart</span>
                          <span>Add to Cart</span>
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            onOpenBooking({
                              type: 'grooming',
                              serviceName: `${pkg.title} (${selectedBreed})`,
                              basePrice: price,
                              origPrice: orig,
                              petType: petType,
                              petSize: petType === 'dog' ? size : undefined,
                              petBreed: selectedBreed,
                              appliedCouponCode: price >= 1000 ? 'GROOM10' : undefined,
                            })
                          }
                          className={`py-2 px-1.5 rounded-xl font-black text-[11px] uppercase tracking-wider flex items-center justify-center gap-1 shadow-sm transition-all active:scale-95 ${
                            pkg.popular
                              ? 'bg-sanctuary-forest hover:bg-black text-white shadow-md'
                              : 'bg-sanctuary-dark hover:bg-black text-white'
                          }`}
                        >
                          <span>Book Now</span>
                          <span className="material-symbols-outlined text-xs">arrow_forward</span>
                        </button>
                      </div>

                      <p className="text-[9px] text-center text-sanctuary-dark/65 font-semibold">
                        📍 Book online & visit studio at your selected time
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Mobile Swipe Indicators */}
            <div className="flex sm:hidden items-center justify-between pt-1 px-1 text-[11px] text-sanctuary-dark/60 font-semibold">
              <span>👉 Swipe for {packages.length} packages</span>
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
            <span className="text-[10px] text-sanctuary-dark/70 font-bold hidden sm:inline">
              Click any service to add to cart or checkout
            </span>
          </div>

          {/* Horizontal scroll on mobile, compact 8-column grid on desktop */}
          <div className="flex overflow-x-auto lg:grid lg:grid-cols-8 gap-2 no-scrollbar py-0.5">
            {quickAddons.map((addon, i) => (
              <div
                key={i}
                onClick={() => {
                  addItemToCart({
                    id: `addon_${addon.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}`,
                    category: 'grooming',
                    name: addon.name,
                    subtitle: 'Add-on Treatment',
                    price: addon.price,
                    origPrice: Math.round(addon.price * 1.25),
                  });
                }}
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
                <div className="text-[8.5px] font-bold text-amber-800 bg-amber-50 rounded px-1 mt-1 group-hover:bg-amber-100">
                  + Add to Cart
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
