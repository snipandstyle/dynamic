'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { putBookingItem } from '../utils/booking-cart';
import { BookingItem, money } from '../data/catalog';

interface BoardingPageProps {
  onOpenBooking?: (details?: any) => void;
  onNavigate?: (page: string) => void;
}

export const BoardingPage: React.FC<BoardingPageProps> = ({ onOpenBooking, onNavigate }) => {
  const [pet, setPet] = useState<'dog' | 'cat'>('dog');
  const [dogSize, setDogSize] = useState<'small' | 'medium' | 'large'>('small');
  const [catType, setCatType] = useState<'neutered' | 'non-neutered'>('neutered');
  const [nights, setNights] = useState<number>(4);
  const [toyBundle, setToyBundle] = useState<boolean>(false);
  const [medCare, setMedCare] = useState<boolean>(false);
  const [activePhoto, setActivePhoto] = useState<number>(0);
  const [toast, setToast] = useState<{ message: string; visible: boolean }>({
    message: '',
    visible: false,
  });

  const showToast = (message: string) => {
    setToast({ message, visible: true });
    setTimeout(() => setToast((t) => ({ ...t, visible: false })), 4000);
  };

  // Real Authentic Photos for Dogs and Cats
  const dogPhotos = [
    {
      src: '/images/generated/luxury-cage-free-suite.jpg',
      title: '100% Cage-Free Suites',
      sub: 'Sanitized orthopaedic bedding, climate-controlled comfort on Kanakapura Rd.',
    },
    {
      src: '/images/generated/cosy-boarding.webp',
      title: 'Cozy Overnight Haven',
      sub: 'Stress-free environment with loving 24/7 on-site caretakers.',
    },
    {
      src: '/images/generated/pet-happy-place.webp',
      title: 'Spacious Green Play Lawns',
      sub: '2 daily outdoor nature walks and supervised social play in open grounds.',
    },
  ];

  const catPhotos = [
    {
      src: '/images/generated/cat-care.webp',
      title: 'Private Quiet Feline Haven',
      sub: 'Sound-isolated haven away from dogs with comfortable climbing and resting perches.',
    },
    {
      src: '/images/generated/cosy-boarding.webp',
      title: 'Sanitized Cozy Suites',
      sub: 'Individual suites with daily freshened litter, soft bedding & custom feeding schedules.',
    },
    {
      src: '/images/generated/pet-happy-place.webp',
      title: 'Loving 24/7 Supervision',
      sub: 'Gentle stress-free care with daily WhatsApp photo & video updates for parents.',
    },
  ];

  const currentPhotos = pet === 'cat' ? catPhotos : dogPhotos;

  // Exact Official Rates by Weight & Pet Type
  const dogRates = [
    {
      id: 'small' as const,
      title: 'Small Dogs (< 10 kg)',
      sub: 'Shih Tzu, Pug, Maltese, Beagle, Frenchie (< 10 kg)',
      price: 625,
      orig: 750,
      save: 125,
      emoji: '🐶',
    },
    {
      id: 'medium' as const,
      title: 'Medium Dogs (10 – 25 kg)',
      sub: 'Cocker Spaniel, Indies, Boxer, Corgi (10 – 25 kg)',
      price: 750,
      orig: 899,
      save: 149,
      emoji: '🐕',
    },
    {
      id: 'large' as const,
      title: 'Large Dogs (> 25 kg)',
      sub: 'Labrador, Golden Retriever, German Shepherd, Husky (> 25 kg)',
      price: 875,
      orig: 1050,
      save: 175,
      emoji: '🦮',
    },
  ];

  const catRates = [
    {
      id: 'neutered' as const,
      title: 'Neutered / Spayed Cats',
      sub: 'Quiet private cabin with peaceful individual haven',
      price: 625,
      orig: 750,
      save: 125,
      emoji: '🐱',
    },
    {
      id: 'non-neutered' as const,
      title: 'Non-Neutered Cats',
      sub: 'Dedicated peaceful private enclosure with individual care',
      price: 750,
      orig: 899,
      save: 149,
      emoji: '🐈',
    },
  ];

  // Pricing calculations
  const getDailyRate = () => {
    if (pet === 'cat') {
      return catType === 'neutered' ? 625 : 750;
    }
    if (dogSize === 'small') return 625;
    if (dogSize === 'medium') return 750;
    return 875;
  };

  const getDailyOrig = () => {
    if (pet === 'cat') {
      return catType === 'neutered' ? 750 : 899;
    }
    if (dogSize === 'small') return 750;
    if (dogSize === 'medium') return 899;
    return 1050;
  };

  const dailyRate = getDailyRate();
  const dailyOrig = getDailyOrig();
  const baseTotal = dailyRate * nights;
  const baseOrigTotal = dailyOrig * nights;
  const addonsCost = (toyBundle ? 186 : 0) + (medCare ? 374 : 0);
  const total = baseTotal + addonsCost;
  const origTotal = baseOrigTotal + addonsCost;
  const totalSavings = origTotal - total;

  // Dynamic 1-More-Night Nudge
  const getNudge = (currentNights: number) => {
    if (currentNights < 4) {
      const diff = 4 - currentNights;
      return {
        targetNights: 4,
        diff,
        message: diff === 1
          ? 'Add 1 more night to get FREE Furry Fresh Grooming Refresh (₹749 value)!'
          : `Add ${diff} more nights to get FREE Furry Fresh Grooming Refresh (₹749 value)!`,
        actionText: diff === 1 ? '+ Add 1 Night' : `+ Add ${diff} Nights`,
        badge: '🎁 FREE GROOMING UNLOCK',
        color: 'gold',
      };
    } else if (currentNights === 5) {
      return {
        targetNights: 6,
        diff: 1,
        message: 'Add 1 more night to get 1 Full Day 100% FREE with code STAY6FREE1!',
        actionText: '+ Add 1 Night',
        badge: '🎉 1 DAY FREE',
        color: 'green',
      };
    } else if (currentNights >= 4 && currentNights < 8) {
      const diff = 8 - currentNights;
      return {
        targetNights: 8,
        diff,
        message: diff === 1
          ? 'Add 1 more night to get FREE Special Package Grooming Treatment (₹999 value)!'
          : `Add ${diff} more nights to get FREE Special Package Grooming Treatment (₹999 value)!`,
        actionText: diff === 1 ? '+ Add 1 Night' : `+ Add ${diff} Nights`,
        badge: '💎 UPGRADE REWARD',
        color: 'gold',
      };
    } else if (currentNights >= 8 && currentNights < 15) {
      const diff = 15 - currentNights;
      return {
        targetNights: 15,
        diff,
        message: diff === 1
          ? 'Add 1 more night to get FREE Full Package Grooming Treatment (₹2,199 value)!'
          : `Add ${diff} more nights to get FREE Full Package Grooming Treatment (₹2,199 value)!`,
        actionText: diff === 1 ? '+ Add 1 Night' : `+ Add ${diff} Nights`,
        badge: '👑 ULTIMATE REWARD',
        color: 'gold',
      };
    }
    return {
      targetNights: 15,
      diff: 0,
      message: 'Ultimate Extended Stay Perks Unlocked: FREE Full Package Grooming (₹2,199 Value)!',
      actionText: '',
      badge: '✨ VIP PERKS ACTIVE',
      color: 'gold',
    };
  };

  const nudge = getNudge(nights);

  // Milestone Perks
  const milestones = [
    {
      nights: 4,
      days: '4+ Days Stay',
      reward: 'FREE Furry Fresh Grooming Refresh',
      value: '₹499–₹749 Value',
      desc: 'Complimentary bath with shampoo & conditioner, blow dry, combing, ear & eye cleaning before checkout.',
      badgeBg: 'bg-emerald-100 text-emerald-800',
    },
    {
      nights: 6,
      days: '6+ Days Stay',
      reward: '1 Day 100% FREE (Code: STAY6FREE1)',
      value: 'Save 1 Full Night',
      desc: 'Stay 6 or more nights and get 1 complete overnight stay completely complimentary.',
      badgeBg: 'bg-emerald-600 text-white font-black',
    },
    {
      nights: 8,
      days: '8+ Days Stay',
      reward: 'FREE Special Package Treatment',
      value: '₹899–₹999 Value',
      desc: 'Includes fresh spa bath, teeth brushing, freshening mouth spray, and neat paw pad trimming.',
      badgeBg: 'bg-amber-100 text-amber-900',
    },
    {
      nights: 15,
      days: '15+ Days Stay',
      reward: 'FREE Full Package Grooming Treatment',
      value: '₹2,199 Value',
      desc: 'Ultimate head-to-tail pampering featuring therapeutic medicated bath, full body styling, and deshedding.',
      badgeBg: 'bg-purple-100 text-purple-900',
    },
  ];

  // Primary Add to Cart Action
  const handleAddToCart = () => {
    const addonsList: string[] = [];
    if (toyBundle) addonsList.push('toy-bundle');
    if (medCare) addonsList.push('med-care');

    const item: BookingItem = {
      id: `boarding-${Date.now()}`,
      serviceId: 'boarding',
      category: 'boarding',
      petType: pet,
      petSize: pet === 'dog' ? dogSize : 'small',
      catType: pet === 'cat' ? catType : undefined,
      nights,
      quantity: 1,
      addons: addonsList,
      petName: `${pet === 'dog' ? dogSize.toUpperCase() + ' Dog' : 'Cat'}`,
      breed: pet === 'dog' ? `${dogSize} dog` : catType === 'neutered' ? 'Neutered cat' : 'Non-neutered cat',
    };

    putBookingItem(item);
    showToast(`✓ Added ${nights} Nights Boarding (${money(total)}) to Cart!`);
  };

  const timeline = [
    { time: '07:30 AM', title: 'Morning Nature Walk & Stretch', desc: 'Gentle outdoor nature walk and bathroom break in green, open grounds.' },
    { time: '08:30 AM', title: 'Nutritious Breakfast & Fresh Water', desc: 'Individual feeding according to your pet’s exact diet and schedule.' },
    { time: '11:00 AM', title: 'Supervised Social Play & Agility', desc: 'Interactive games, ball fetch, and mental stimulation in clean play zones.' },
    { time: '01:30 PM', title: 'Quiet Afternoon Nap on Boarding Floor', desc: 'Rest on clean orthopaedic bedding with calm acoustic ambiance.' },
    { time: '04:30 PM', title: 'Daily WhatsApp Photo & Video Updates', desc: 'Photos and updates sent directly to parents so you see them happy and relaxed.' },
    { time: '06:00 PM', title: 'Evening Nature Walk & Play', desc: 'Second outdoor walk in fresh air before evening winds down.' },
    { time: '07:30 PM', title: 'Wholesome Dinner & Medication', desc: 'Evening meal served, with medical routines administered if requested.' },
    { time: '09:30 PM', title: 'Bedtime with 24/7 On-Site Caretaker', desc: 'Tucked in on sanitized bedding, monitored throughout the night.' },
  ];

  const checklist = [
    { icon: 'vaccines', title: 'Vaccination Proof', desc: 'Anti-Rabies & DHPPi (dogs) or FVRCP (cats) records.' },
    { icon: 'restaurant', title: 'Regular Diet / Food', desc: 'Enough dry kibble or wet food for your pet’s stay duration.' },
    { icon: 'medication', title: 'Medications (if any)', desc: 'Clear dosage instructions for our trained caretakers.' },
    { icon: 'favorite', title: 'Favorite Blanket or Toy', desc: 'Helps your companion settle in with familiar home comfort.' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 bg-[#FAF8F5] text-left"
    >
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Breadcrumb & Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-sanctuary-dark/60">
            {onNavigate ? (
              <button onClick={() => onNavigate('home')} className="hover:text-sanctuary-gold">Home</button>
            ) : (
              <Link href="/" className="hover:text-sanctuary-gold">Home</Link>
            )}
            <span>/</span>
            <span className="text-sanctuary-gold">Cage-Free Boarding</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-sanctuary-forest bg-emerald-100 px-2.5 py-0.5 rounded-full inline-block mb-1">
                Bengaluru&apos;s #1 Cage-Free Pet Resort • Kanakapura Main Road
              </span>
              <h1 className="text-2xl sm:text-4xl font-black text-sanctuary-dark tracking-tight">
                Zero Wire Cages. <span className="text-sanctuary-gold">Total Freedom.</span>
              </h1>
            </div>

            {/* Companion Toggle */}
            <div className="flex items-center p-1 bg-white rounded-xl border border-black/10 shadow-xs self-start sm:self-auto">
              <button
                type="button"
                onClick={() => {
                  setPet('dog');
                  setActivePhoto(0);
                }}
                className={`py-1.5 px-4 rounded-lg text-xs font-black transition-all ${
                  pet === 'dog' ? 'bg-sanctuary-forest text-white shadow-xs' : 'text-sanctuary-dark/70 hover:text-black'
                }`}
              >
                🐕 Dogs
              </button>
              <button
                type="button"
                onClick={() => {
                  setPet('cat');
                  setActivePhoto(0);
                }}
                className={`py-1.5 px-4 rounded-lg text-xs font-black transition-all ${
                  pet === 'cat' ? 'bg-sanctuary-forest text-white shadow-xs' : 'text-sanctuary-dark/70 hover:text-black'
                }`}
              >
                🐈 Cats
              </button>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-sanctuary-dark/75 font-medium max-w-3xl leading-relaxed">
            <strong>Book online &amp; drop off at our Kanakapura Main Road studio:</strong> Site no. 61, beside Shani Mahatma Temple, Bengaluru 560082. Clean, climate-controlled suites with orthopaedic bedding, 2 daily nature walks, loving caretakers, and daily WhatsApp photo &amp; video updates while you travel.
          </p>
        </div>

        {/* ========================================================
            UNIFIED BOARDING BOOKING CARD (Photos + Live Rate + Stepper)
            ======================================================== */}
        <div className="bg-white rounded-3xl border border-black/10 shadow-md overflow-hidden">
          <div className="grid lg:grid-cols-12 items-stretch">
            
            {/* Left: Interactive Real Photo Gallery */}
            <div className="lg:col-span-5 relative bg-[#142b20] min-h-[340px] sm:min-h-[400px] flex flex-col justify-between p-5 text-white overflow-hidden">
              <img
                src={currentPhotos[activePhoto]?.src || '/images/clean_dog_boarding.jpg'}
                alt={currentPhotos[activePhoto]?.title || 'Boarding facility'}
                className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = '/images/clean_dog_boarding.jpg';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/30 pointer-events-none" />

              {/* Badges on Top */}
              <div className="relative z-10 space-y-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 text-sanctuary-dark text-[11px] font-black shadow-md">
                  <span>✨</span>
                  <span>100% Zero Wire Cages</span>
                </span>
                <div className="flex flex-wrap gap-1.5">
                  <span className="text-[10px] font-bold bg-white/20 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-white/25">✓ 24/7 Caretaker</span>
                  <span className="text-[10px] font-bold bg-white/20 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-white/25">✓ 2 Daily Walks</span>
                  <span className="text-[10px] font-bold bg-white/20 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-white/25">✓ WhatsApp Videos</span>
                </div>
              </div>

              {/* Bottom Caption & Thumbnail Switcher */}
              <div className="relative z-10 space-y-3 pt-12">
                <div>
                  <h3 className="text-lg sm:text-xl font-black text-white leading-tight">
                    {currentPhotos[activePhoto]?.title}
                  </h3>
                  <p className="text-xs text-white/80 font-medium leading-snug mt-1">
                    {currentPhotos[activePhoto]?.sub}
                  </p>
                </div>

                {/* Thumbnails */}
                <div className="flex items-center gap-2 pt-1">
                  {currentPhotos.map((p, idx) => (
                    <button
                      key={p.src}
                      type="button"
                      onClick={() => setActivePhoto(idx)}
                      aria-label={`View photo ${idx + 1}`}
                      className={`size-10 sm:size-11 rounded-xl overflow-hidden border-2 transition-all ${
                        activePhoto === idx ? 'border-sanctuary-gold scale-105 shadow-md' : 'border-white/50 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={p.src} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Booking Configurator & Live Price */}
            <div className="lg:col-span-7 p-5 sm:p-7 flex flex-col justify-between space-y-5">
              
              {/* Pet Size / Type Selection */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black uppercase tracking-wider text-sanctuary-dark/70">
                    {pet === 'dog' ? 'Select Breed Weight (Live Rates):' : 'Select Cat Type:'}
                  </label>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                    Save up to ₹175/day
                  </span>
                </div>

                {pet === 'dog' ? (
                  <div className="grid grid-cols-3 gap-2">
                    {dogRates.map((option) => (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => setDogSize(option.id)}
                        className={`p-3 rounded-2xl border text-left transition-all relative flex flex-col justify-between ${
                          dogSize === option.id
                            ? 'border-sanctuary-forest bg-emerald-50/50 ring-1 ring-sanctuary-forest shadow-xs'
                            : 'border-black/10 hover:border-black/20 bg-white'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-lg">{option.emoji}</span>
                          {dogSize === option.id && (
                            <span className="text-[9px] font-black text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded">
                              Selected
                            </span>
                          )}
                        </div>
                        <div className="mt-2">
                          <h4 className="text-xs font-black text-sanctuary-dark leading-tight">{option.title}</h4>
                          <div className="flex items-baseline gap-1 mt-1">
                            <span className="text-base font-black text-sanctuary-dark">₹{option.price}</span>
                            <span className="text-[10px] text-sanctuary-dark/60 font-semibold">/day</span>
                          </div>
                          <del className="text-[10px] text-red-500 font-bold block">₹{option.orig}</del>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    {catRates.map((option) => (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => setCatType(option.id)}
                        className={`p-3.5 rounded-2xl border text-left transition-all relative flex flex-col justify-between ${
                          catType === option.id
                            ? 'border-sanctuary-forest bg-emerald-50/50 ring-1 ring-sanctuary-forest shadow-xs'
                            : 'border-black/10 hover:border-black/20 bg-white'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xl">{option.emoji}</span>
                          {catType === option.id && (
                            <span className="text-[9px] font-black text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded">
                              Selected
                            </span>
                          )}
                        </div>
                        <div className="mt-2">
                          <h4 className="text-xs font-black text-sanctuary-dark leading-tight">{option.title}</h4>
                          <p className="text-[10px] text-sanctuary-dark/60 font-medium leading-tight mt-0.5">{option.sub}</p>
                          <div className="flex items-baseline gap-1 mt-1.5">
                            <span className="text-lg font-black text-sanctuary-dark">₹{option.price}</span>
                            <span className="text-[10px] text-sanctuary-dark/60 font-semibold">/day</span>
                            <del className="text-[10px] text-red-500 font-bold ml-1">₹{option.orig}</del>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Length of Stay Stepper & Live Calculation */}
              <div className="p-3.5 bg-sanctuary-sand/60 rounded-2xl border border-black/5 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-sanctuary-dark/60 block">
                    Daily Rate Applied:
                  </span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl font-black text-sanctuary-dark">₹{dailyRate}</span>
                    <span className="text-xs text-sanctuary-dark/60 font-semibold">/ day</span>
                    <del className="text-xs text-red-500 font-bold ml-1">₹{dailyOrig}</del>
                  </div>
                </div>

                {/* Stepper */}
                <div className="flex items-center gap-3">
                  <span className="text-xs font-black text-sanctuary-dark">Length of Stay:</span>
                  <div className="flex items-center bg-white rounded-xl border border-black/10 shadow-xs overflow-hidden">
                    <button
                      type="button"
                      disabled={nights <= 1}
                      onClick={() => setNights((n) => Math.max(1, n - 1))}
                      className="size-8 flex items-center justify-center font-black text-base hover:bg-sanctuary-sand transition-colors disabled:opacity-40"
                    >
                      −
                    </button>
                    <span className="px-3 font-mono font-black text-sm text-sanctuary-dark">
                      {nights} {nights === 1 ? 'Night' : 'Nights'}
                    </span>
                    <button
                      type="button"
                      disabled={nights >= 60}
                      onClick={() => setNights((n) => Math.min(60, n + 1))}
                      className="size-8 flex items-center justify-center font-black text-base hover:bg-sanctuary-sand transition-colors disabled:opacity-40"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Dynamic 1-More-Night Milestone Nudge */}
              <div className={`p-3 rounded-2xl border flex items-center justify-between gap-3 ${
                nudge.color === 'green' ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-amber-50 border-amber-200 text-amber-900'
              }`}>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black px-2 py-0.5 rounded-full bg-white shadow-xs">
                    {nudge.badge}
                  </span>
                  <span className="text-xs font-bold leading-tight">
                    {nudge.message}
                  </span>
                </div>
                {nudge.actionText && (
                  <button
                    type="button"
                    onClick={() => setNights(nudge.targetNights)}
                    className="py-1 px-3 bg-sanctuary-dark hover:bg-black text-[#fed65b] rounded-xl text-xs font-black shrink-0 transition-all shadow-xs"
                  >
                    {nudge.actionText}
                  </button>
                )}
              </div>

              {/* Optional Add-ons Checkboxes */}
              <div className="flex flex-wrap items-center gap-4 text-xs font-bold">
                <span className="text-sanctuary-dark/70 uppercase text-[10px] font-black">Optional Care:</span>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={toyBundle}
                    onChange={(e) => setToyBundle(e.target.checked)}
                    className="accent-sanctuary-forest rounded size-4"
                  />
                  <span>Active Toy Bundle (+₹186)</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={medCare}
                    onChange={(e) => setMedCare(e.target.checked)}
                    className="accent-sanctuary-forest rounded size-4"
                  />
                  <span>Medication Routine Care (+₹374)</span>
                </label>
              </div>

              {/* Primary 1-Click Action Button */}
              <div className="pt-2 border-t border-black/5 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div>
                  <div className="text-[10px] font-black uppercase tracking-wider text-sanctuary-dark/60">
                    Total for {nights} {nights === 1 ? 'Night' : 'Nights'}:
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-sanctuary-dark leading-none">₹{total}</span>
                    <del className="text-xs text-red-500 font-bold">₹{origTotal}</del>
                    <span className="text-[10px] font-black text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                      You Save ₹{totalSavings}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="w-full sm:w-auto py-3 px-6 bg-sanctuary-forest hover:bg-black text-[#fed65b] rounded-2xl font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                >
                  <span>🛍️ Add Boarding to Cart • ₹{total}</span>
                </button>
              </div>

            </div>
          </div>
        </div>

        {/* ========================================================
            SECTION 2: MILESTONE PERKS GRID
            ======================================================== */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-sanctuary-gold">
                Complimentary Extended Stay Rewards
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-sanctuary-dark">
                Free Grooming Treatments on Every Stay
              </h2>
            </div>
            <span className="hidden sm:inline-block text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
              Automatically Applied at Checkout
            </span>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {milestones.map((m, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-4 border border-black/10 shadow-xs flex flex-col justify-between space-y-3 hover:shadow-md transition-all"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${m.badgeBg}`}>
                      {m.days}
                    </span>
                    <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      {m.value}
                    </span>
                  </div>
                  <h3 className="text-sm font-black text-sanctuary-dark pt-1">{m.reward}</h3>
                  <p className="text-[11px] text-sanctuary-dark/70 font-medium leading-relaxed">{m.desc}</p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setNights(m.nights);
                    window.scrollTo({ top: 120, behavior: 'smooth' });
                  }}
                  className="w-full py-2 bg-sanctuary-sand hover:bg-sanctuary-forest hover:text-white rounded-xl text-[10px] font-black uppercase tracking-wider transition-colors text-center"
                >
                  Select {m.nights} Nights Stay →
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* ========================================================
            SECTION 3: DAILY ROUTINE TIMELINE
            ======================================================== */}
        <section className="space-y-4">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-sanctuary-gold">
              Predictable, Stress-Free Daily Life
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-sanctuary-dark mt-0.5">
              Daily Schedule on Our Boarding Floor
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {timeline.map((t, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-4 border border-black/10 shadow-xs space-y-1.5 hover:shadow-md transition-all"
              >
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-sanctuary-sand text-sanctuary-forest inline-block">
                  {t.time}
                </span>
                <h3 className="text-xs font-black text-sanctuary-dark">{t.title}</h3>
                <p className="text-[11px] text-sanctuary-dark/70 font-medium leading-relaxed">{t.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ========================================================
            SECTION 4: WHAT TO BRING CHECKLIST & STUDIO ADDRESS
            ======================================================== */}
        <div className="grid sm:grid-cols-2 gap-4">
          {/* Checklist */}
          <div className="bg-white rounded-3xl p-6 border border-black/10 shadow-xs space-y-3">
            <h3 className="text-lg font-black text-sanctuary-dark">What to Bring on Check-in Day</h3>
            <div className="space-y-2.5">
              {checklist.map((item, i) => (
                <div key={i} className="flex gap-2.5 items-start">
                  <div className="size-7 rounded-lg bg-sanctuary-sand text-sanctuary-forest flex items-center justify-center font-black shrink-0 text-xs">
                    ✓
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-sanctuary-dark">{item.title}</h4>
                    <p className="text-[11px] text-sanctuary-dark/70 font-medium leading-snug">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Location & Studio Drop-off */}
          <div className="bg-white rounded-3xl p-6 border border-black/10 shadow-xs space-y-3 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-sanctuary-forest bg-emerald-100 px-2 py-0.5 rounded-full inline-block mb-1.5">
                Drop-Off &amp; Pick-Up Studio
              </span>
              <h3 className="text-lg font-black text-sanctuary-dark">Snip &amp; Style Pet Sanctuary</h3>
              <p className="text-xs text-sanctuary-dark/75 font-medium leading-relaxed mt-1">
                Site no. 61, Beside Shani Mahatma Temple, Kanakapura Main Road, Bengaluru, Karnataka 560082.
              </p>
              <ul className="text-xs text-sanctuary-dark/80 font-medium space-y-1 mt-3">
                <li>• Safe double-gated entry for zero accidental escapes.</li>
                <li>• Easy curbside parking on vacation departure route (NH 948).</li>
                <li>• 24/7 on-site caretaker and emergency vet on call.</li>
              </ul>
            </div>

            <div className="pt-2">
              <a
                href="https://maps.google.com/?q=Site+no.+61+Kanakapura+Main+Road+Bengaluru"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-black text-sanctuary-forest hover:text-sanctuary-gold underline"
              >
                <span>View Google Maps Directions →</span>
              </a>
            </div>
          </div>
        </div>

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
    </motion.div>
  );
};

export default BoardingPage;
