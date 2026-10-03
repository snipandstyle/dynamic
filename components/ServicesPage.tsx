import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface ServicesPageProps {
  onOpenBooking: () => void;
  onNavigate: (page: string) => void;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({ onOpenBooking, onNavigate }) => {
  const [petType, setPetType] = useState<'dog' | 'cat'>('dog');
  const [size, setSize] = useState<'small' | 'medium' | 'large'>('small');
  const [coat, setCoat] = useState<'short' | 'long'>('short');
  const [activeTab, setActiveTab] = useState<'packages' | 'addons' | 'bundles'>('packages');

  // 1. Dog Grooming Packages (Exact from prompt)
  const dogPackages = [
    {
      id: 'dog-furry-fresh',
      title: 'Furry Fresh (Basic Hygiene Care)',
      tag: 'ESSENTIAL HYGIENE',
      tagBg: 'bg-emerald-100 text-emerald-800',
      desc: 'Essential regular hygiene maintenance focused on deep cleansing without full body styling. Perfect for active dogs needing a refresh.',
      pricing: { small: 499, medium: 699, large: 849 },
      origPricing: { small: 649, medium: 899, large: 1099 },
      inclusions: [
        'Bath with Shampoo & Conditioner',
        'Professional Blow Dry',
        'Combing & Brushing',
        'Ear Cleaning',
        'Eye Cleaning',
      ],
      exclusions: ['Sanitary clipping', 'Haircut', 'Full body trimming'],
    },
    {
      id: 'dog-special',
      title: 'Special Package (Enhanced Care & Dental)',
      tag: 'MOST POPULAR',
      tagBg: 'bg-sanctuary-gold text-sanctuary-dark',
      desc: 'A step up from basic hygiene adding essential dental and paw care to keep breath fresh and paws neat and protected.',
      pricing: { small: 899, medium: 949, large: 999 },
      origPricing: { small: 1124, medium: 1199, large: 1249 },
      popular: true,
      inclusions: [
        'Bath with Shampoo & Conditioner',
        'Professional Blow Dry',
        'Combing & Brushing',
        'Ear Cleaning & Eye Cleaning',
        'Mouth Spray',
        'Teeth Brushing',
        'Paws Trimming',
      ],
      exclusions: ['Full body breed styling'],
    },
    {
      id: 'dog-style',
      title: 'Style Your Pet (Full Body Styling & Trimming)',
      tag: 'SIGNATURE STYLING',
      tagBg: 'bg-purple-100 text-purple-900',
      desc: 'Signature breed styling package. Includes a full body trim tailored to breed standards or custom preferences, plus meticulous face trimming.',
      pricing: { small: 1799, medium: 1799, large: 1799 },
      origPricing: { small: 2249, medium: 2249, large: 2249 },
      inclusions: [
        'Full Body Trimming & Scissor Cut',
        'Meticulous Face Trimming',
        'Ear Cleaning (Free)',
        'Eye Cleaning (Free)',
        'Sanitary Clipping (Free)',
        'Combing & Brushing (Free)',
        'Mouth Spray (Free)',
      ],
      exclusions: [],
    },
    {
      id: 'dog-full-grooming',
      title: 'Full Grooming (Ultimate Head-to-Tail Experience)',
      tag: 'THERAPEUTIC SPA',
      tagBg: 'bg-sanctuary-forest text-white',
      desc: 'Comprehensive head-to-tail pampering featuring a therapeutic medicated bath to protect skin health alongside full grooming luxury.',
      pricing: { small: 2199, medium: 2199, large: 2199 },
      origPricing: { small: 3249, medium: 3249, large: 3249 },
      inclusions: [
        'Bath with Shampoo & Conditioner',
        'Therapeutic Medicated Bath',
        'Hair Styling & Trimming',
        'Sanitary Trim',
        'Nail Clipping',
        'Ear Cleaning & Eye Cleaning',
        'Combing & Brushing',
        'Deshedding Treatment',
      ],
      exclusions: [],
    },
  ];

  // 2. Cat Grooming Packages (Exact from prompt)
  const catPackages = [
    {
      id: 'cat-furry-fresh',
      title: 'Cat Furry Fresh',
      tag: 'FELINE HYGIENE',
      tagBg: 'bg-emerald-100 text-emerald-800',
      price: 749,
      orig: 949,
      desc: 'Essential hygiene bath, comb out, ear and eye cleansing for cats.',
      inclusions: [
        'Bath with Shampoo & Conditioner',
        'Professional Blow Dry',
        'Combing & Brushing',
        'Ear Cleaning',
        'Eye Cleaning',
      ],
      exclusions: ['Sanitary clipping', 'Haircut'],
    },
    {
      id: 'cat-special',
      title: 'Cat Special Package',
      tag: '⭐ ENHANCED DENTAL & PAWS',
      tagBg: 'bg-sanctuary-gold text-sanctuary-dark',
      price: 874,
      orig: 1099,
      desc: 'Enhanced care with additional dental hygiene and paw care.',
      inclusions: [
        'Bath with Shampoo & Conditioner',
        'Blow Dry',
        'Combing & Brushing',
        'Ear & Eye Cleaning',
        'Mouth Spray',
        'Teeth Brushing',
        'Paws Trimming',
      ],
      exclusions: ['Full breed styling'],
    },
    {
      id: 'cat-style',
      title: 'Style Your Cat',
      tag: 'FELINE STYLING',
      tagBg: 'bg-purple-100 text-purple-900',
      price: 1799,
      orig: 2249,
      desc: 'Professional feline styling and neat trims.',
      inclusions: [
        'Full Body Trimming',
        'Face Trimming',
        'Free Sanitary Clipping',
        'Free Ear & Eye Cleaning',
        'Free Mouth Spray',
      ],
      exclusions: [],
    },
    {
      id: 'cat-full-grooming',
      title: 'Cat Full Grooming',
      tag: 'LION / COMB CUT',
      tagBg: 'bg-sanctuary-forest text-white',
      price: 2199,
      orig: 2749,
      desc: 'Complete grooming for cats including Lion Cut or Comb Cut if desired, full bath, and mat prevention.',
      inclusions: [
        'Haircut (Lion/Comb Cut)',
        'Bath with Shampoo & Conditioner',
        'Nail Clipping',
        'Ear & Eye Cleaning',
        'Mat Removal',
        'Deshedding Treatment',
      ],
      exclusions: [],
    },
  ];

  // 3. Individual Add-ons & Quick Care (Dogs & Cats) (Exact from prompt)
  const individualAddons = [
    {
      name: 'Sanitary & Waterless Bath',
      price: '₹499',
      desc: 'Combined hygiene trim, nail clipping, ear cleaning, paw pad trim, and waterless bath.',
      icon: 'sanitizer',
    },
    {
      name: 'Waterless Bath (Dry Bath)',
      price: '₹499',
      desc: 'Gentle waterless foam cleanse and coat deodorizing without water stress.',
      icon: 'air',
    },
    {
      name: 'Medicated Bath',
      price: '₹299',
      desc: 'Therapeutic medicated shampoo bath for itchy, infected, or sensitive skin.',
      icon: 'medication',
    },
    {
      name: 'Body Massage',
      price: '₹499',
      desc: 'Relaxing full body muscle massage and tension relief.',
      icon: 'spa',
    },
    {
      name: 'Deshedding Treatment',
      price: '₹624',
      desc: 'Specialized deep undercoat removal to drastically cut down shedding.',
      icon: 'brush',
    },
    {
      name: 'Dematting',
      price: '₹499',
      desc: 'Gentle, pain-free knot and mat removal.',
      icon: 'content_cut',
    },
    {
      name: 'Teeth Brushing',
      price: '₹186',
      desc: 'Plaque removal, oral cleaning, and freshening mouth spray.',
      icon: 'dentistry',
    },
    {
      name: 'Ear & Eye Cleaning',
      price: '₹124',
      desc: 'Wax removal, tear stain cleaning, and gentle hygiene for sensitive areas.',
      icon: 'visibility',
    },
    {
      name: 'Paw Relaxation',
      price: '₹124',
      desc: 'Deep paw pad cleaning, pad hair trim, massage, and moisturizing balm.',
      icon: 'pets',
    },
    {
      name: 'Face Trim (Quick Service)',
      price: '₹499 (Walk-in) / ₹625 (Home)',
      desc: 'Neatens facial hair around eyes, muzzle, and beard shaping.',
      icon: 'face_retouching_natural',
    },
    {
      name: 'Waterless Bath Express',
      price: '₹749 (Walk-in) / ₹938 (Home)',
      desc: 'Waterless bath, deep brush-out, and coat deodorizing spray.',
      icon: 'shower',
    },
  ];

  // 5. Super Saver Bundles (Multi-Session Packages) (Exact from prompt)
  const dogBundles = {
    short: [
      { name: '3 Sessions Full Grooming', small: '₹4,874', medium: '₹6,374', large: '₹7,999', validity: '6 Months' },
      { name: '6 Sessions Full Grooming', small: '₹8,999', medium: '₹11,999', large: '₹14,999', validity: '12 Months', popular: true },
      { name: '12 Sessions Full Grooming', small: '₹13,999', medium: '₹18,749', large: '₹23,374', validity: '16 Months', bestValue: true },
      { name: '3 Sessions Tick & Flea Combo', small: '₹6,874', medium: '₹9,124', large: '₹11,249', validity: '6 Months' },
      { name: '3 Sessions Medicated Combo', small: '₹7,499', medium: '₹9,874', large: '₹12,124', validity: '6 Months' },
    ],
    long: [
      { name: '3 Sessions Full Grooming', small: '₹6,374', medium: '₹7,999', large: '₹8,749', validity: '6 Months' },
      { name: '6 Sessions Full Grooming', small: '₹11,999', medium: '₹14,999', large: '₹16,499', validity: '12 Months', popular: true },
      { name: '12 Sessions Full Grooming', small: '₹18,749', medium: '₹23,374', large: '₹25,749', validity: '16 Months', bestValue: true },
      { name: '3 Sessions Tick & Flea Combo', small: '₹9,124', medium: '₹11,249', large: '₹12,499', validity: '6 Months' },
      { name: '3 Sessions Medicated Combo', small: '₹9,874', medium: '₹12,124', large: '₹13,499', validity: '6 Months' },
    ],
  };

  const catBundles = [
    { name: '3 Sessions Full Grooming', short: '₹4,874', long: '₹6,374', validity: '6 Months' },
    { name: '6 Sessions Full Grooming', short: '₹8,999', long: '₹11,999', validity: '12 Months', popular: true },
    { name: '12 Sessions Full Grooming', short: '₹13,999', long: '₹20,999', validity: '16 Months', bestValue: true },
    { name: '3 Sessions Tick & Flea Combo', short: '₹6,874', long: '₹9,124', validity: '6 Months' },
  ];

  const breedHints = {
    small: 'Shih Tzu, Pug, Maltese, Beagle, Frenchie',
    medium: 'Labrador, Golden Retriever, Cocker Spaniel',
    large: 'German Shepherd, Rottweiler, Husky',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-[#FAF8F5] text-left"
    >
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* Breadcrumb & Header */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-sanctuary-dark/60">
            <button onClick={() => onNavigate('home')} className="hover:text-sanctuary-gold">Home</button>
            <span>/</span>
            <span className="text-sanctuary-gold">Grooming & Spa</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-sanctuary-gold/20 text-sanctuary-dark text-[11px] font-black uppercase tracking-wider mb-2">
                <span>Official snipandstyle.pet Service Menu</span>
              </div>
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-sanctuary-dark tracking-tight leading-tight">
                Pet Grooming & <span className="text-sanctuary-gold">Spa Menu.</span>
              </h1>
            </div>

            {/* Companion Toggle */}
            <div className="flex items-center p-1 bg-white rounded-2xl border border-black/10 shadow-xs self-start sm:self-auto">
              <button
                onClick={() => setPetType('dog')}
                className={`py-2 px-5 rounded-xl text-xs font-black transition-all ${
                  petType === 'dog' ? 'bg-sanctuary-forest text-white shadow-xs' : 'text-sanctuary-dark/70'
                }`}
              >
                Dogs
              </button>
              <button
                onClick={() => setPetType('cat')}
                className={`py-2 px-5 rounded-xl text-xs font-black transition-all ${
                  petType === 'cat' ? 'bg-sanctuary-forest text-white shadow-xs' : 'text-sanctuary-dark/70'
                }`}
              >
                Cats
              </button>
            </div>
          </div>

          <p className="text-sm sm:text-base text-sanctuary-dark/75 font-medium max-w-2xl leading-relaxed">
            All services feature tearless organic shampoos, UV-sterilized clippers, low-stress fear-free handling, and 10% discount on grooming above ₹999 using code <strong className="font-mono text-sanctuary-dark">GROOM10</strong>.
          </p>
        </div>

        {/* Tab Switcher: Packages vs Add-ons vs Super Saver */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-black/10 pb-4">
          <div className="flex items-center gap-2">
            {[
              { id: 'packages', label: 'Core Packages' },
              { id: 'addons', label: 'Add-ons & Quick Care' },
              { id: 'bundles', label: 'Super Saver Bundles' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-2 px-4 rounded-xl text-xs font-black transition-all ${
                  activeTab === tab.id
                    ? 'bg-sanctuary-forest text-white shadow-xs'
                    : 'bg-white text-sanctuary-dark/70 border border-black/10 hover:border-sanctuary-gold'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Dog Size Picker (shown only when Dog & Packages active) */}
          {petType === 'dog' && activeTab === 'packages' && (
            <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 p-1 bg-white rounded-xl border border-black/10 text-xs">
              <span className="text-[10px] uppercase text-sanctuary-dark/50 px-2 font-black">Breed Size:</span>
              <div className="flex gap-1">
                {(['small', 'medium', 'large'] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={`py-1 px-3 rounded-lg capitalize transition-all font-bold ${
                      size === s ? 'bg-sanctuary-gold text-sanctuary-dark font-black' : 'text-sanctuary-dark/70'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Breed Hint when Dog Packages active */}
        {petType === 'dog' && activeTab === 'packages' && (
          <div className="text-xs text-sanctuary-dark/60 bg-sanctuary-sand/40 p-2.5 rounded-xl border border-black/5 flex items-center gap-2">
            <span className="font-black text-sanctuary-dark capitalize">{size} Breeds:</span>
            <span>{breedHints[size]}</span>
          </div>
        )}

        {/* TAB 1: CORE PACKAGES */}
        {activeTab === 'packages' && (
          <div>
            {petType === 'dog' ? (
              <div className="grid sm:grid-cols-2 gap-6">
                {dogPackages.map((pkg) => {
                  const price = pkg.pricing[size];
                  const orig = pkg.origPricing[size];
                  const savings = orig - price;

                  return (
                    <div
                      key={pkg.id}
                      className={`bg-white rounded-3xl p-6 border flex flex-col justify-between space-y-4 shadow-xs hover:shadow-xl transition-all relative ${
                        pkg.popular ? 'border-sanctuary-gold ring-1 ring-sanctuary-gold' : 'border-black/10'
                      }`}
                    >
                      {pkg.popular && (
                        <span className="absolute -top-3 right-6 bg-sanctuary-gold text-sanctuary-dark text-[9px] font-black px-3 py-0.5 rounded-full uppercase tracking-wider">
                          Most Popular
                        </span>
                      )}

                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className={`text-[8px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full ${pkg.tagBg}`}>
                            {pkg.tag}
                          </span>
                          <span className="text-[9px] font-black text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                            Save ₹{savings}
                          </span>
                        </div>

                        <div>
                          <h3 className="text-lg font-black text-sanctuary-dark leading-tight">{pkg.title}</h3>
                          <p className="text-xs text-sanctuary-dark/70 font-medium mt-1 leading-snug">{pkg.desc}</p>
                        </div>

                        {/* Red Strikethrough Pricing Box */}
                        <div className="p-3 bg-sanctuary-sand rounded-xl flex items-baseline justify-between border border-black/5">
                          <span className="text-xs line-through text-red-500 font-bold decoration-red-500">
                            ₹{orig}
                          </span>
                          <span className="text-2xl font-black text-sanctuary-dark leading-none">
                            ₹{price}
                          </span>
                        </div>

                        {/* Inclusions */}
                        <div className="space-y-1.5 pt-2 border-t border-black/5">
                          <div className="text-[10px] font-black uppercase tracking-wider text-sanctuary-dark/60">
                            Includes:
                          </div>
                          {pkg.inclusions.map((inc, i) => (
                            <div key={i} className="flex items-start gap-1.5 text-xs text-sanctuary-dark/80 font-medium leading-tight">
                              <span className="text-emerald-600 font-bold">✓</span>
                              <span>{inc}</span>
                            </div>
                          ))}
                          {pkg.exclusions.length > 0 && (
                            <div className="pt-1 text-[11px] text-black/40 italic">
                              Note: Excludes {pkg.exclusions.join(', ')}.
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="pt-3 border-t border-black/5">
                        <button
                          onClick={onOpenBooking}
                          className="w-full py-2.5 bg-sanctuary-forest hover:bg-black text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-colors text-center flex items-center justify-center gap-1.5 shadow-xs"
                        >
                          <span>Book with 15% OFF</span>
                          <span className="material-symbols-outlined text-sm font-bold">arrow_forward</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* Cat Packages */
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {catPackages.map((pkg) => {
                  const savings = pkg.orig - pkg.price;

                  return (
                    <div
                      key={pkg.id}
                      className="bg-white rounded-3xl p-5 border border-black/10 flex flex-col justify-between space-y-4 shadow-xs hover:shadow-xl transition-all"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className={`text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${pkg.tagBg}`}>
                            {pkg.tag}
                          </span>
                          <span className="text-[9px] font-black text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                            Save ₹{savings}
                          </span>
                        </div>

                        <div>
                          <h3 className="text-lg font-black text-sanctuary-dark leading-tight">{pkg.title}</h3>
                          <p className="text-xs text-sanctuary-dark/70 font-medium mt-1 leading-snug">{pkg.desc}</p>
                        </div>

                        <div className="p-2.5 bg-sanctuary-sand rounded-xl flex items-baseline justify-between border border-black/5">
                          <span className="text-xs line-through text-red-500 font-bold decoration-red-500">
                            ₹{pkg.orig}
                          </span>
                          <span className="text-2xl font-black text-sanctuary-dark leading-none">
                            ₹{pkg.price}
                          </span>
                        </div>

                        <div className="space-y-1.5 pt-2 border-t border-black/5">
                          <div className="text-[10px] font-black uppercase tracking-wider text-sanctuary-dark/60">
                            Includes:
                          </div>
                          {pkg.inclusions.map((inc, i) => (
                            <div key={i} className="flex items-start gap-1.5 text-xs text-sanctuary-dark/80 font-medium leading-tight">
                              <span className="text-emerald-600 font-bold">✓</span>
                              <span>{inc}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="pt-3 border-t border-black/5">
                        <button
                          onClick={onOpenBooking}
                          className="w-full py-2 bg-sanctuary-forest hover:bg-black text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-colors text-center flex items-center justify-center gap-1.5 shadow-xs"
                        >
                          <span>Book with 15% OFF</span>
                          <span className="material-symbols-outlined text-sm font-bold">arrow_forward</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: INDIVIDUAL ADD-ONS & QUICK CARE */}
        {activeTab === 'addons' && (
          <div className="space-y-4">
            <div className="p-3 bg-blue-50 text-blue-900 rounded-xl text-xs font-semibold border border-blue-200">
              <span className="font-bold">Notice:</span> All add-ons can be booked individually as walk-in quick care, or attached to any main grooming package!
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {individualAddons.map((item, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl p-5 border border-black/10 shadow-xs flex flex-col justify-between space-y-3 hover:shadow-md transition-all"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className="size-9 rounded-xl bg-sanctuary-sand text-sanctuary-forest flex items-center justify-center font-black">
                          <span className="material-symbols-outlined text-lg">{item.icon}</span>
                        </div>
                        <h4 className="text-sm font-black text-sanctuary-dark leading-tight">{item.name}</h4>
                      </div>
                      <span className="text-sm font-black text-sanctuary-gold shrink-0">{item.price}</span>
                    </div>
                    <p className="text-xs text-sanctuary-dark/70 font-medium leading-relaxed">{item.desc}</p>
                  </div>

                  <div className="pt-2 border-t border-black/5">
                    <button
                      onClick={onOpenBooking}
                      className="w-full py-2 bg-sanctuary-sand hover:bg-sanctuary-forest hover:text-white text-sanctuary-dark rounded-xl font-bold text-xs uppercase tracking-wider text-center transition-colors"
                    >
                      Book Add-on
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: SUPER SAVER BUNDLES (Exact Table & Multi-session Packages) */}
        {activeTab === 'bundles' && (
          <div className="space-y-8">
            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-amber-950 text-xs font-medium flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <span><strong>Super Saver Multi-Session Bundles</strong>: Enjoy massive savings, priority scheduling, and deep conditioning by purchasing sessions in advance!</span>
              <span className="text-[10px] font-black uppercase bg-amber-500 text-white px-2.5 py-1 rounded-lg shrink-0">Priority Pass</span>
            </div>

            {/* Dog Bundles Section */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-black/10 shadow-md space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-black/5 pb-4">
                <div>
                  <h3 className="text-xl font-black text-sanctuary-dark">Dog Multi-Session Bundles</h3>
                  <p className="text-xs text-sanctuary-dark/60 font-medium">Select your companion's coat type to view exact multi-session packages</p>
                </div>
                <div className="flex items-center p-1 bg-sanctuary-sand rounded-xl text-xs font-bold">
                  <button
                    onClick={() => setCoat('short')}
                    className={`py-1 px-4 rounded-lg transition-all ${
                      coat === 'short' ? 'bg-sanctuary-forest text-white shadow-xs' : 'text-sanctuary-dark/70'
                    }`}
                  >
                    Short Coat
                  </button>
                  <button
                    onClick={() => setCoat('long')}
                    className={`py-1 px-4 rounded-lg transition-all ${
                      coat === 'long' ? 'bg-sanctuary-forest text-white shadow-xs' : 'text-sanctuary-dark/70'
                    }`}
                  >
                    Long Coat
                  </button>
                </div>
              </div>

              {/* Responsive Table for Dog Bundles */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-black/10 text-sanctuary-dark/60 uppercase font-black text-[10px]">
                      <th className="py-3 px-3">Package Name</th>
                      <th className="py-3 px-3">Small Dog</th>
                      <th className="py-3 px-3">Medium Dog</th>
                      <th className="py-3 px-3">Large Dog</th>
                      <th className="py-3 px-3">Validity</th>
                      <th className="py-3 px-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/5">
                    {dogBundles[coat].map((b, i) => (
                      <tr key={i} className="hover:bg-sanctuary-sand/30 transition-colors">
                        <td className="py-3.5 px-3 font-black text-sanctuary-dark">
                          <div className="flex items-center gap-1.5">
                            <span>{b.name}</span>
                            {b.popular && (
                              <span className="text-[8px] bg-sanctuary-gold text-sanctuary-dark font-black px-1.5 py-0.2 rounded">POPULAR</span>
                            )}
                            {b.bestValue && (
                              <span className="text-[8px] bg-emerald-600 text-white font-black px-1.5 py-0.2 rounded">BEST VALUE</span>
                            )}
                          </div>
                        </td>
                        <td className="py-3.5 px-3 font-black text-sanctuary-dark">{b.small}</td>
                        <td className="py-3.5 px-3 font-black text-sanctuary-dark">{b.medium}</td>
                        <td className="py-3.5 px-3 font-black text-sanctuary-dark">{b.large}</td>
                        <td className="py-3.5 px-3 text-sanctuary-dark/70 font-bold">{b.validity}</td>
                        <td className="py-3.5 px-3 text-right">
                          <button
                            onClick={onOpenBooking}
                            className="py-1.5 px-3.5 bg-sanctuary-forest hover:bg-black text-white rounded-lg font-bold text-[10px] uppercase tracking-wider inline-block transition-colors"
                          >
                            Buy Pass
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Cat Bundles Section */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-black/10 shadow-md space-y-6">
              <div className="border-b border-black/5 pb-4">
                <h3 className="text-xl font-black text-sanctuary-dark">Cat Multi-Session Bundles</h3>
                <p className="text-xs text-sanctuary-dark/60 font-medium">Full grooming and anti-tick bundles tailored specifically for felines</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-black/10 text-sanctuary-dark/60 uppercase font-black text-[10px]">
                      <th className="py-3 px-3">Package Name</th>
                      <th className="py-3 px-3">Short Coat</th>
                      <th className="py-3 px-3">Long Coat</th>
                      <th className="py-3 px-3">Validity</th>
                      <th className="py-3 px-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/5">
                    {catBundles.map((b, i) => (
                      <tr key={i} className="hover:bg-sanctuary-sand/30 transition-colors">
                        <td className="py-3.5 px-3 font-black text-sanctuary-dark">
                          <div className="flex items-center gap-1.5">
                            <span>{b.name}</span>
                            {b.popular && (
                              <span className="text-[8px] bg-sanctuary-gold text-sanctuary-dark font-black px-1.5 py-0.2 rounded">POPULAR</span>
                            )}
                            {b.bestValue && (
                              <span className="text-[8px] bg-emerald-600 text-white font-black px-1.5 py-0.2 rounded">BEST VALUE</span>
                            )}
                          </div>
                        </td>
                        <td className="py-3.5 px-3 font-black text-sanctuary-dark">{b.short}</td>
                        <td className="py-3.5 px-3 font-black text-sanctuary-dark">{b.long}</td>
                        <td className="py-3.5 px-3 text-sanctuary-dark/70 font-bold">{b.validity}</td>
                        <td className="py-3.5 px-3 text-right">
                          <button
                            onClick={onOpenBooking}
                            className="py-1.5 px-3.5 bg-sanctuary-forest hover:bg-black text-white rounded-lg font-bold text-[10px] uppercase tracking-wider inline-block transition-colors"
                          >
                            Buy Pass
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* Bottom Booking Strip */}
        <div className="p-6 bg-sanctuary-forest text-white rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
          <div>
            <h3 className="text-lg font-black text-white">Ready for a transformation?</h3>
            <p className="text-xs text-white/75 mt-0.5">
              Book online instantly. Apply promo code <span className="font-mono text-sanctuary-gold font-bold">GROOM10</span> for 10% OFF grooming (above ₹999) or <span className="font-mono text-sanctuary-gold font-bold">FREESPA</span> on 4+ nights boarding.
            </p>
          </div>
          <button
            onClick={onOpenBooking}
            className="py-3 px-8 bg-sanctuary-gold hover:bg-white text-sanctuary-dark rounded-xl font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shrink-0 transition-colors shadow-md"
          >
            <span>Book Grooming Now</span>
            <span className="material-symbols-outlined text-sm font-bold">arrow_forward</span>
          </button>
        </div>

      </div>
    </motion.div>
  );
};

export default ServicesPage;
