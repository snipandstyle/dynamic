'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { putBookingItem } from '../utils/booking-cart';
import { BookingItem } from '../data/catalog';
import PackageDetailsModal from './booking/PackageDetailsModal';

interface ServicesPageProps {
  onOpenBooking: (details?: any) => void;
  onNavigate: (page: string) => void;
  initialTab?: 'packages' | 'addons' | 'bundles';
}

export const ServicesPage: React.FC<ServicesPageProps> = ({
  onOpenBooking,
  onNavigate,
}) => {
  const [petType, setPetType] = useState<'dog' | 'cat'>('dog');
  const [size, setSize] = useState<'small' | 'medium' | 'large'>('small');
  const [coat, setCoat] = useState<'short' | 'long'>('short');
  const [detailsServiceId, setDetailsServiceId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; visible: boolean }>({
    message: '',
    visible: false,
  });

  const showToast = (message: string) => {
    setToast({ message, visible: true });
    setTimeout(() => setToast((t) => ({ ...t, visible: false })), 4000);
  };

  // 1. Dog Grooming Packages (Exact from user prompt)
  const dogPackages = [
    {
      id: 'furry-fresh',
      title: 'Furry Fresh',
      sub: 'Basic Hygiene Care',
      tag: 'ESSENTIAL HYGIENE',
      tagBg: 'bg-emerald-100 text-emerald-800',
      desc: 'Essential regular hygiene maintenance focused on deep cleansing without full body styling. Perfect for active dogs needing a refresh.',
      pricing: { small: 499, medium: 699, large: 849 },
      origPricing: { small: 649, medium: 899, large: 1099 },
      inclusions: [
        'Bath with Shampoo & Conditioner',
        'Professional Warm Blow Dry',
        'Combing & Brushing',
        'Ear Cleaning & Eye Cleaning',
      ],
      exclusions: 'Sanitary clipping, haircut, and full body trimming',
    },
    {
      id: 'special-package',
      title: 'Special Package',
      sub: 'Enhanced Care & Dental',
      tag: 'MOST POPULAR',
      tagBg: 'bg-amber-100 text-amber-900 border border-amber-300',
      desc: 'A step up from basic hygiene adding essential dental and paw care to keep breath fresh and paws neat and protected.',
      pricing: { small: 899, medium: 949, large: 999 },
      origPricing: { small: 1124, medium: 1199, large: 1249 },
      popular: true,
      inclusions: [
        'Bath with Shampoo & Conditioner',
        'Professional Blow Dry & Brushing',
        'Ear & Eye Gentle Cleaning',
        'Mouth Spray & Teeth Brushing',
        'Paws & Pad Trimming',
      ],
      exclusions: 'Full body breed styling',
    },
    {
      id: 'style-your-pet',
      title: 'Style Your Pet',
      sub: 'Full Body Styling & Trimming',
      tag: 'SIGNATURE STYLING',
      tagBg: 'bg-purple-100 text-purple-900',
      desc: 'Signature breed styling package. Includes a full body trim tailored to breed standards or custom preferences, plus meticulous face trimming.',
      pricing: { small: 1799, medium: 1799, large: 1799 },
      origPricing: { small: 2249, medium: 2249, large: 2249 },
      inclusions: [
        'Full Body Trimming & Scissor Cut',
        'Meticulous Face Trimming',
        'Free Sanitary Clipping & Brushing',
        'Free Ear & Eye Cleaning + Mouth Spray',
      ],
      exclusions: '',
    },
    {
      id: 'full-grooming',
      title: 'Full Grooming',
      sub: 'Ultimate Head-to-Tail Experience',
      tag: 'THERAPEUTIC LUXURY',
      tagBg: 'bg-emerald-900 text-emerald-100',
      desc: 'Comprehensive head-to-tail pampering featuring a therapeutic medicated bath to protect skin health alongside full grooming luxury.',
      pricing: { small: 2199, medium: 2199, large: 2199 },
      origPricing: { small: 3249, medium: 3249, large: 3249 },
      inclusions: [
        'Bath with Shampoo & Conditioner',
        'Therapeutic Medicated Bath',
        'Hair Styling, Sanitary Trim & Nail Clip',
        'Ear/Eye Clean & Deshedding Treatment',
      ],
      exclusions: '',
    },
  ];

  // 2. Cat Grooming Packages (Exact from user prompt)
  const catPackages = [
    {
      id: 'furry-fresh',
      title: 'Cat Furry Fresh',
      sub: 'Essential Hygiene Bath',
      tag: 'FELINE HYGIENE',
      tagBg: 'bg-emerald-100 text-emerald-800',
      price: 749,
      orig: 949,
      desc: 'Essential hygiene bath, comb out, ear and eye cleansing for cats.',
      inclusions: [
        'Bath with Shampoo & Conditioner',
        'Professional Warm Blow Dry',
        'Combing & Brushing',
        'Ear & Eye Cleaning',
      ],
    },
    {
      id: 'special-package',
      title: 'Cat Special Package',
      sub: 'Enhanced Care & Dental',
      tag: 'ENHANCED CARE',
      tagBg: 'bg-amber-100 text-amber-900',
      price: 874,
      orig: 1099,
      desc: 'Enhanced care with additional dental hygiene and paw care.',
      inclusions: [
        'Bath with Shampoo & Conditioner',
        'Blow Dry & Gentle Brushing',
        'Ear & Eye Cleaning',
        'Mouth Spray & Teeth Brushing',
        'Paws Trimming',
      ],
    },
    {
      id: 'style-your-pet',
      title: 'Style Your Cat',
      sub: 'Professional Feline Styling',
      tag: 'FELINE STYLING',
      tagBg: 'bg-purple-100 text-purple-900',
      price: 1799,
      orig: 2249,
      desc: 'Professional feline styling and neat trims.',
      inclusions: [
        'Full Body Trimming & Face Trim',
        'Free Sanitary Clipping',
        'Free Ear & Eye Cleaning',
        'Free Mouth Spray',
      ],
    },
    {
      id: 'full-grooming',
      title: 'Cat Full Grooming',
      sub: 'Lion / Comb Cut Luxury',
      tag: 'LION / COMB CUT',
      tagBg: 'bg-emerald-900 text-emerald-100',
      price: 2199,
      orig: 2749,
      desc: 'Complete grooming for cats including Lion Cut or Comb Cut if desired, full bath, and mat prevention.',
      inclusions: [
        'Haircut (Lion / Comb Cut)',
        'Full Bath with Shampoo & Conditioner',
        'Nail Clipping & Mat Removal',
        'Ear & Eye Cleaning + Deshedding',
      ],
    },
  ];

  // 3. Individual Add-ons & Quick Care (Dogs & Cats) (Exact from user prompt)
  const individualAddons = [
    {
      id: 'sanitary-waterless',
      name: 'Sanitary & Waterless Bath',
      price: 499,
      orig: 699,
      desc: 'Combined hygiene trim, nail clipping, ear cleaning, paw pad trim, and waterless bath.',
      icon: '🧼',
    },
    {
      id: 'waterless-bath',
      name: 'Waterless Bath (Dry Bath)',
      price: 499,
      orig: 699,
      desc: 'Gentle waterless foam cleanse and coat deodorizing without water stress.',
      icon: '🧴',
    },
    {
      id: 'medicated-bath-addon',
      name: 'Medicated Bath',
      price: 299,
      orig: 499,
      desc: 'Therapeutic medicated shampoo bath for itchy, infected, or sensitive skin.',
      icon: '🌿',
    },
    {
      id: 'body-massage',
      name: 'Body Massage',
      price: 499,
      orig: 699,
      desc: 'Relaxing full body muscle massage and tension relief.',
      icon: '💆',
    },
    {
      id: 'deshedding',
      name: 'Deshedding Treatment',
      price: 624,
      orig: 849,
      desc: 'Specialized deep undercoat removal to drastically cut down shedding.',
      icon: '✨',
    },
    {
      id: 'dematting',
      name: 'Dematting',
      price: 499,
      orig: 699,
      desc: 'Gentle, pain-free knot and mat removal.',
      icon: '✂️',
    },
    {
      id: 'teeth-brushing',
      name: 'Teeth Brushing',
      price: 186,
      orig: 299,
      desc: 'Plaque removal, oral cleaning, and freshening mouth spray.',
      icon: '🪥',
    },
    {
      id: 'ear-eye-clean',
      name: 'Ear & Eye Cleaning',
      price: 124,
      orig: 199,
      desc: 'Wax removal, tear stain cleaning, and gentle hygiene for sensitive areas.',
      icon: '👁️',
    },
    {
      id: 'paw-relaxation',
      name: 'Paw Relaxation',
      price: 124,
      orig: 199,
      desc: 'Deep paw pad cleaning, pad hair trim, massage, and moisturizing balm.',
      icon: '🐾',
    },
    {
      id: 'face-trim',
      name: 'Face Trim (Quick Service)',
      price: 499,
      orig: 699,
      desc: 'Neatens facial hair around eyes, muzzle, and beard shaping.',
      icon: '🐩',
    },
    {
      id: 'waterless-bath-express',
      name: 'Waterless Bath Express',
      price: 749,
      orig: 999,
      desc: 'Waterless bath, deep brush-out, and coat deodorizing spray.',
      icon: '🚿',
    },
  ];

  // 5. Super Saver Bundles (Multi-Session Packages)
  const dogBundles = {
    short: [
      { id: 'bundle-dog-short-3', name: '3 Sessions Full Grooming', small: 4874, medium: 6374, large: 7999, validity: '6 Months' },
      { id: 'bundle-dog-short-6', name: '6 Sessions Full Grooming', small: 8999, medium: 11999, large: 14999, validity: '12 Months', popular: true },
      { id: 'bundle-dog-short-12', name: '12 Sessions Full Grooming', small: 13999, medium: 18749, large: 23374, validity: '16 Months', bestValue: true },
      { id: 'bundle-dog-short-tick-3', name: '3 Sessions Tick & Flea Combo', small: 6874, medium: 9124, large: 11249, validity: '6 Months' },
      { id: 'bundle-dog-short-med-3', name: '3 Sessions Medicated Combo', small: 7499, medium: 9874, large: 12124, validity: '6 Months' },
    ],
    long: [
      { id: 'bundle-dog-long-3', name: '3 Sessions Full Grooming', small: 6374, medium: 7999, large: 8749, validity: '6 Months' },
      { id: 'bundle-dog-long-6', name: '6 Sessions Full Grooming', small: 11999, medium: 14999, large: 16499, validity: '12 Months', popular: true },
      { id: 'bundle-dog-long-12', name: '12 Sessions Full Grooming', small: 18749, medium: 23374, large: 25749, validity: '16 Months', bestValue: true },
      { id: 'bundle-dog-long-tick-3', name: '3 Sessions Tick & Flea Combo', small: 9124, medium: 11249, large: 12499, validity: '6 Months' },
      { id: 'bundle-dog-long-med-3', name: '3 Sessions Medicated Combo', small: 9874, medium: 12124, large: 13499, validity: '6 Months' },
    ],
  };

  const catBundles = [
    { id: 'bundle-cat-3', name: '3 Sessions Full Grooming', short: 4874, long: 6374, validity: '6 Months' },
    { id: 'bundle-cat-6', name: '6 Sessions Full Grooming', short: 8999, long: 11999, validity: '12 Months', popular: true },
    { id: 'bundle-cat-12', name: '12 Sessions Full Grooming', short: 13999, long: 20999, validity: '16 Months', bestValue: true },
    { id: 'bundle-cat-tick-3', name: '3 Sessions Tick & Flea Combo', short: 6874, long: 9124, validity: '6 Months' },
  ];

  const breedHints = {
    small: 'Shih Tzu, Pug, Maltese, Beagle, Frenchie',
    medium: 'Labrador, Golden Retriever, Cocker Spaniel',
    large: 'German Shepherd, Rottweiler, Husky',
  };

  const handleAddPackage = (pkg: any) => {
    const item: BookingItem = {
      id: `grooming-${pkg.id}-${Date.now()}`,
      serviceId: pkg.id,
      category: 'grooming',
      petType,
      petSize: size,
      nights: 1,
      quantity: 1,
      addons: [],
      petName: `${petType === 'dog' ? size.toUpperCase() + ' Dog' : 'Cat'}`,
      breed: petType === 'dog' ? breedHints[size] : 'Cat',
    };
    putBookingItem(item);
    showToast(`✓ Added ${pkg.title} to cart!`);
  };

  const handleAddAddon = (addon: any) => {
    const item: BookingItem = {
      id: `addon-${addon.id}-${Date.now()}`,
      serviceId: addon.id,
      category: 'addon',
      petType,
      petSize: size,
      nights: 1,
      quantity: 1,
      addons: [],
      petName: `${petType === 'dog' ? size.toUpperCase() + ' Dog' : 'Cat'}`,
      breed: petType === 'dog' ? breedHints[size] : 'Cat',
    };
    putBookingItem(item);
    showToast(`✓ Added ${addon.name} to cart!`);
  };

  const handleAddBundle = (bundle: any, coatType: string) => {
    const item: BookingItem = {
      id: `bundle-${bundle.id}-${Date.now()}`,
      serviceId: bundle.id,
      category: 'bundle',
      petType,
      petSize: size,
      nights: 1,
      quantity: 1,
      addons: [],
      petName: `${petType === 'dog' ? size.toUpperCase() + ' Dog' : 'Cat'}`,
      breed: `${coatType} coat`,
    };
    putBookingItem(item);
    showToast(`✓ Added ${bundle.name} to cart!`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 bg-[#FAF8F5] text-left"
    >
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Breadcrumb & Compact Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-sanctuary-dark/60">
            <button onClick={() => onNavigate('home')} className="hover:text-sanctuary-gold">Home</button>
            <span>/</span>
            <span className="text-sanctuary-gold">Grooming &amp; Spa</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-sanctuary-forest bg-emerald-100 px-2.5 py-0.5 rounded-full inline-block mb-1">
                Official snipandstyle.pet Catalog
              </span>
              <h1 className="text-2xl sm:text-4xl font-black text-sanctuary-dark tracking-tight">
                Pet Grooming &amp; <span className="text-sanctuary-gold">Spa Menu</span>
              </h1>
            </div>

            {/* Companion Dogs / Cats Toggle */}
            <div className="flex items-center p-1 bg-white rounded-xl border border-black/10 shadow-xs self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setPetType('dog')}
                className={`py-1.5 px-4 rounded-lg text-xs font-black transition-all ${
                  petType === 'dog' ? 'bg-sanctuary-forest text-white shadow-xs' : 'text-sanctuary-dark/70 hover:text-black'
                }`}
              >
                🐕 Dogs
              </button>
              <button
                type="button"
                onClick={() => setPetType('cat')}
                className={`py-1.5 px-4 rounded-lg text-xs font-black transition-all ${
                  petType === 'cat' ? 'bg-sanctuary-forest text-white shadow-xs' : 'text-sanctuary-dark/70 hover:text-black'
                }`}
              >
                🐈 Cats
              </button>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-sanctuary-dark/75 font-medium max-w-3xl leading-relaxed">
            <strong>Book online &amp; visit our Kanakapura Main Road studio:</strong> Upfront pricing, fear-free handling, and 10% discount on grooming above ₹999 with code <strong className="font-mono text-sanctuary-dark">GROOM10</strong>.
          </p>
        </div>

        {/* Quick Section Anchors & Breed Size Selector */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-black/10 shadow-xs">
          <div className="flex items-center gap-2">
            <a
              href="#packages-section"
              className="py-1 px-3 rounded-lg text-xs font-black bg-sanctuary-forest text-white shadow-xs"
            >
              1. Core Packages
            </a>
            <a
              href="#addons-section"
              className="py-1 px-3 rounded-lg text-xs font-black bg-sanctuary-sand text-sanctuary-dark hover:bg-emerald-100 transition-colors"
            >
              2. Add-ons &amp; Quick Care ↓
            </a>
            <a
              href="#bundles-section"
              className="py-1 px-3 rounded-lg text-xs font-black bg-sanctuary-sand text-sanctuary-dark hover:bg-emerald-100 transition-colors"
            >
              3. Super Saver Bundles ↓
            </a>
          </div>

          {/* Dog Breed Size Selector */}
          {petType === 'dog' && (
            <div className="flex items-center gap-1 text-xs">
              <span className="text-[10px] uppercase text-sanctuary-dark/60 font-black px-1">Breed Size:</span>
              <div className="flex gap-1 bg-sanctuary-sand/60 p-0.5 rounded-lg border border-black/5">
                {(['small', 'medium', 'large'] as const).map((s) => (
                  <button
                    type="button"
                    key={s}
                    onClick={() => setSize(s)}
                    className={`py-1 px-2.5 rounded-md capitalize transition-all text-xs font-black ${
                      size === s ? 'bg-sanctuary-gold text-sanctuary-dark shadow-xs' : 'text-sanctuary-dark/70 hover:text-black'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Dog Breed Hint */}
        {petType === 'dog' && (
          <div className="text-xs text-sanctuary-dark/75 bg-amber-50/70 py-2 px-3 rounded-xl border border-amber-200/60 flex items-center gap-2">
            <span className="font-black text-sanctuary-dark capitalize">{size} Breeds:</span>
            <span>{breedHints[size]}</span>
          </div>
        )}

        {/* ========================================================
            SECTION 1: CORE GROOMING PACKAGES (Compact & Sleek)
            ======================================================== */}
        <section id="packages-section" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-black text-sanctuary-dark flex items-center gap-2">
              <span>🛁</span>
              <span>{petType === 'dog' ? `Dog Grooming Packages (${size.toUpperCase()})` : 'Cat Grooming Packages'}</span>
            </h2>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
              4 Packages Available
            </span>
          </div>

          {petType === 'dog' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {dogPackages.map((pkg) => {
                const price = pkg.pricing[size];
                const orig = pkg.origPricing[size];
                const savings = orig - price;

                return (
                  <div
                    key={pkg.id}
                    onClick={() => setDetailsServiceId(pkg.id)}
                    className={`bg-white rounded-2xl p-4 border flex flex-col justify-between space-y-3 shadow-xs hover:shadow-md hover:border-sanctuary-gold transition-all relative cursor-pointer ${
                      pkg.popular ? 'border-sanctuary-gold ring-1 ring-sanctuary-gold' : 'border-black/10'
                    }`}
                  >
                    {pkg.popular && (
                      <span className="absolute -top-2.5 right-3 bg-sanctuary-gold text-sanctuary-dark text-[8.5px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
                        ★ Popular
                      </span>
                    )}

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className={`text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${pkg.tagBg}`}>
                          {pkg.tag}
                        </span>
                        <span className="text-[8.5px] font-black text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded">
                          Save ₹{savings}
                        </span>
                      </div>

                      <div>
                        <h3 className="text-base font-black text-sanctuary-dark leading-tight">{pkg.title}</h3>
                        <p className="text-[11px] text-sanctuary-dark/65 font-medium leading-snug mt-0.5 line-clamp-2">{pkg.desc}</p>
                      </div>

                      {/* Pricing Tag */}
                      <div className="p-2 bg-sanctuary-sand/70 rounded-xl flex items-baseline justify-between border border-black/5">
                        <del className="text-xs line-through text-red-500 font-bold">
                          ₹{orig}
                        </del>
                        <div className="flex items-baseline gap-1">
                          <span className="text-xl font-black text-sanctuary-dark">
                            ₹{price}
                          </span>
                          <span className="text-[10px] text-sanctuary-dark/60 font-semibold">
                            /session
                          </span>
                        </div>
                      </div>

                      {/* Inclusions List */}
                      <ul className="space-y-1 pt-1 text-[11px] text-sanctuary-dark/80 font-medium">
                        {pkg.inclusions.map((inc, i) => (
                          <li key={i} className="flex items-start gap-1.5 leading-snug">
                            <span className="text-emerald-700 font-bold shrink-0">✓</span>
                            <span>{inc}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-2 border-t border-black/5 space-y-1.5">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDetailsServiceId(pkg.id);
                        }}
                        className="w-full text-center text-[11px] font-black text-sanctuary-forest hover:text-sanctuary-gold underline py-0.5 transition-colors"
                      >
                        View Details &amp; Inclusions →
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddPackage(pkg);
                        }}
                        className="w-full py-2 bg-sanctuary-forest hover:bg-black text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shadow-xs"
                      >
                        <span>Add to Cart</span>
                        <span>•</span>
                        <span>₹{price}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {catPackages.map((pkg) => {
                const savings = pkg.orig - pkg.price;

                return (
                  <div
                    key={pkg.id}
                    onClick={() => setDetailsServiceId(pkg.id)}
                    className="bg-white rounded-2xl p-4 border border-black/10 flex flex-col justify-between space-y-3 shadow-xs hover:shadow-md hover:border-sanctuary-gold transition-all cursor-pointer"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className={`text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${pkg.tagBg}`}>
                          {pkg.tag}
                        </span>
                        <span className="text-[8.5px] font-black text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded">
                          Save ₹{savings}
                        </span>
                      </div>

                      <div>
                        <h3 className="text-base font-black text-sanctuary-dark leading-tight">{pkg.title}</h3>
                        <p className="text-[11px] text-sanctuary-dark/65 font-medium leading-snug mt-0.5 line-clamp-2">{pkg.desc}</p>
                      </div>

                      <div className="p-2 bg-sanctuary-sand/70 rounded-xl flex items-baseline justify-between border border-black/5">
                        <del className="text-xs line-through text-red-500 font-bold">
                          ₹{pkg.orig}
                        </del>
                        <div className="flex items-baseline gap-1">
                          <span className="text-xl font-black text-sanctuary-dark">
                            ₹{pkg.price}
                          </span>
                          <span className="text-[10px] text-sanctuary-dark/60 font-semibold">
                            /session
                          </span>
                        </div>
                      </div>

                      <ul className="space-y-1 pt-1 text-[11px] text-sanctuary-dark/80 font-medium">
                        {pkg.inclusions.map((inc, i) => (
                          <li key={i} className="flex items-start gap-1.5 leading-snug">
                            <span className="text-emerald-700 font-bold shrink-0">✓</span>
                            <span>{inc}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-2 border-t border-black/5 space-y-1.5">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDetailsServiceId(pkg.id);
                        }}
                        className="w-full text-center text-[11px] font-black text-sanctuary-forest hover:text-sanctuary-gold underline py-0.5 transition-colors"
                      >
                        View Details &amp; Inclusions →
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddPackage(pkg);
                        }}
                        className="w-full py-2 bg-sanctuary-forest hover:bg-black text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shadow-xs"
                      >
                        <span>Add to Cart</span>
                        <span>•</span>
                        <span>₹{pkg.price}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* ========================================================
            SECTION 2: INDIVIDUAL ADD-ONS & QUICK CARE (SHOWN DIRECTLY BELOW!)
            ======================================================== */}
        <section id="addons-section" className="space-y-4 pt-4 border-t border-black/10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-full inline-block mb-1">
                A La Carte &amp; Walk-in Care
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-sanctuary-dark flex items-center gap-2">
                <span>✂️</span>
                <span>Individual Add-ons &amp; Quick Care</span>
              </h2>
            </div>
            <p className="text-xs text-sanctuary-dark/65 font-medium">
              Click &ldquo;+ Add to Cart&rdquo; to add individually or attach to your visit.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {individualAddons.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl p-4 border border-black/10 shadow-xs flex flex-col justify-between space-y-2.5 hover:shadow-md transition-all"
              >
                <div className="space-y-1.5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{item.icon}</span>
                      <h4 className="text-sm font-black text-sanctuary-dark leading-tight">{item.name}</h4>
                    </div>
                    <div className="flex items-baseline gap-1.5 shrink-0">
                      <del className="text-[11px] line-through text-red-500 font-bold">
                        ₹{item.orig}
                      </del>
                      <span className="text-sm font-black text-sanctuary-forest">
                        ₹{item.price}
                      </span>
                    </div>
                  </div>
                  <p className="text-[11.5px] text-sanctuary-dark/70 font-medium leading-snug">{item.desc}</p>
                </div>

                <div className="pt-2 border-t border-black/5 flex items-center justify-between gap-2">
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                    Save ₹{item.orig - item.price}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleAddAddon(item)}
                    className="py-1.5 px-3 bg-sanctuary-sand hover:bg-sanctuary-forest hover:text-white text-sanctuary-dark rounded-xl font-bold text-xs uppercase tracking-wider transition-colors flex items-center gap-1"
                  >
                    <span>+ Add to Cart</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ========================================================
            SECTION 3: SUPER SAVER BUNDLES (SHOWN DIRECTLY BELOW!)
            ======================================================== */}
        <section id="bundles-section" className="space-y-4 pt-4 border-t border-black/10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-purple-700 bg-purple-100 px-2.5 py-0.5 rounded-full inline-block mb-1">
                Multi-Session Packages
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-sanctuary-dark flex items-center gap-2">
                <span>💎</span>
                <span>Super Saver Multi-Session Bundles</span>
              </h2>
            </div>
            
            {petType === 'dog' && (
              <div className="flex items-center p-1 bg-white rounded-xl border border-black/10 text-xs font-bold self-start">
                <span className="text-[10px] text-sanctuary-dark/60 font-black px-2 uppercase">Coat:</span>
                <button
                  type="button"
                  onClick={() => setCoat('short')}
                  className={`py-1 px-3 rounded-lg transition-all ${
                    coat === 'short' ? 'bg-sanctuary-forest text-white shadow-xs' : 'text-sanctuary-dark/70'
                  }`}
                >
                  Short Coat
                </button>
                <button
                  type="button"
                  onClick={() => setCoat('long')}
                  className={`py-1 px-3 rounded-lg transition-all ${
                    coat === 'long' ? 'bg-sanctuary-forest text-white shadow-xs' : 'text-sanctuary-dark/70'
                  }`}
                >
                  Long Coat
                </button>
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl p-4 sm:p-6 border border-black/10 shadow-xs overflow-x-auto">
            {petType === 'dog' ? (
              <table className="w-full text-left text-xs min-w-[580px]">
                <thead>
                  <tr className="border-b border-black/10 text-sanctuary-dark/60 uppercase font-black text-[10px]">
                    <th className="py-2.5 px-3">Package</th>
                    <th className="py-2.5 px-3">Small Dog</th>
                    <th className="py-2.5 px-3">Medium Dog</th>
                    <th className="py-2.5 px-3">Large Dog</th>
                    <th className="py-2.5 px-3">Validity</th>
                    <th className="py-2.5 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5">
                  {dogBundles[coat].map((b) => (
                    <tr key={b.id} className="hover:bg-[#FAF8F5] transition-colors">
                      <td className="py-3 px-3 font-bold text-sanctuary-dark">
                        {b.name}
                        {b.popular && (
                          <span className="ml-2 text-[8px] bg-sanctuary-gold text-sanctuary-dark font-black px-1.5 py-0.5 rounded">
                            Popular
                          </span>
                        )}
                        {b.bestValue && (
                          <span className="ml-2 text-[8px] bg-purple-600 text-white font-black px-1.5 py-0.5 rounded">
                            Best Value
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3 font-black text-sanctuary-forest">₹{b.small.toLocaleString('en-IN')}</td>
                      <td className="py-3 px-3 font-black text-sanctuary-forest">₹{b.medium.toLocaleString('en-IN')}</td>
                      <td className="py-3 px-3 font-black text-sanctuary-forest">₹{b.large.toLocaleString('en-IN')}</td>
                      <td className="py-3 px-3 font-semibold text-sanctuary-dark/60">{b.validity}</td>
                      <td className="py-3 px-3 text-right">
                        <button
                          type="button"
                          onClick={() => handleAddBundle(b, `${coat} coat`)}
                          className="py-1 px-3 bg-sanctuary-forest hover:bg-black text-white rounded-lg text-xs font-bold uppercase transition-colors"
                        >
                          Book Bundle
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <table className="w-full text-left text-xs min-w-[500px]">
                <thead>
                  <tr className="border-b border-black/10 text-sanctuary-dark/60 uppercase font-black text-[10px]">
                    <th className="py-2.5 px-3">Package</th>
                    <th className="py-2.5 px-3">Short Coat</th>
                    <th className="py-2.5 px-3">Long Coat</th>
                    <th className="py-2.5 px-3">Validity</th>
                    <th className="py-2.5 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5">
                  {catBundles.map((b) => (
                    <tr key={b.id} className="hover:bg-[#FAF8F5] transition-colors">
                      <td className="py-3 px-3 font-bold text-sanctuary-dark">{b.name}</td>
                      <td className="py-3 px-3 font-black text-sanctuary-forest">₹{b.short.toLocaleString('en-IN')}</td>
                      <td className="py-3 px-3 font-black text-sanctuary-forest">₹{b.long.toLocaleString('en-IN')}</td>
                      <td className="py-3 px-3 font-semibold text-sanctuary-dark/60">{b.validity}</td>
                      <td className="py-3 px-3 text-right">
                        <button
                          type="button"
                          onClick={() => handleAddBundle(b, 'cat')}
                          className="py-1 px-3 bg-sanctuary-forest hover:bg-black text-white rounded-lg text-xs font-bold uppercase transition-colors"
                        >
                          Book Bundle
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>

      </div>

      {/* Floating Added-to-Cart Toast */}
      {toast.visible && (
        <aside
          role="status"
          aria-live="polite"
          className="fixed bottom-6 right-6 z-50 bg-[#142b20] text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-4 border border-[#fed65b]/40 animate-bounce"
        >
          <span className="text-xs font-bold text-[#fed65b]">{toast.message}</span>
          <Link
            href="/cart"
            className="py-1 px-3 bg-[#fed65b] text-[#142b20] rounded-xl text-xs font-black uppercase tracking-wider hover:bg-white transition-colors"
          >
            View Cart →
          </Link>
        </aside>
      )}

      {/* Full Package Details Modal */}
      {detailsServiceId && (
        <PackageDetailsModal
          isOpen={!!detailsServiceId}
          onClose={() => setDetailsServiceId(null)}
          serviceId={detailsServiceId}
          petType={petType}
          petSize={size}
          onAddedToCart={(msg) => showToast(msg)}
        />
      )}
    </motion.div>
  );
};

export default ServicesPage;
