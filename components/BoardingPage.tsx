import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface BoardingPageProps {
  onOpenBooking: (details?: any) => void;
  onNavigate: (page: string) => void;
}

export const BoardingPage: React.FC<BoardingPageProps> = ({ onOpenBooking, onNavigate }) => {
  const [pet, setPet] = useState<'dog' | 'cat'>('dog');
  const [dogSize, setDogSize] = useState<'small' | 'medium' | 'large'>('medium');
  const [catType, setCatType] = useState<'neutered' | 'non-neutered'>('neutered');
  const [nights, setNights] = useState<number>(4);
  const [toyBundle, setToyBundle] = useState<boolean>(false);
  const [medCare, setMedCare] = useState<boolean>(false);

  // Exact Official Rates by Weight
  const dogRates = [
    {
      id: 'small',
      title: 'Small Dogs (< 10 kg)',
      sub: 'Shih Tzu, Pug, Maltese, Beagle, Frenchie (< 10 kg)',
      price: 625,
      orig: 750,
      save: 125,
      popular: false,
    },
    {
      id: 'medium',
      title: 'Medium Dogs (10 – 25 kg)',
      sub: 'Cocker Spaniel, Indies, Boxer (10 – 25 kg)',
      price: 750,
      orig: 899,
      save: 149,
      popular: true,
    },
    {
      id: 'large',
      title: 'Large Dogs (> 25 kg)',
      sub: 'Labrador, Golden Retriever, German Shepherd, Husky (> 25 kg)',
      price: 875,
      orig: 1050,
      save: 175,
      popular: false,
    },
  ];

  const catRates = [
    {
      id: 'neutered',
      title: 'Neutered / Spayed Cats',
      sub: 'Quiet private cabin with peaceful individual haven',
      price: 625,
      orig: 750,
      save: 125,
      popular: true,
    },
    {
      id: 'non-neutered',
      title: 'Non-Neutered Cats',
      sub: 'Dedicated peaceful private space with individual care',
      price: 750,
      orig: 899,
      save: 149,
      popular: false,
    },
  ];

  // Boarding Add-ons
  const boardingAddons = [
    {
      id: 'toy-bundle',
      title: 'Active Toy Bundle',
      price: 186,
      desc: 'Interactive toys, plushies, and chew toys for active mental stimulation.',
      icon: 'toys',
    },
    {
      id: 'med-care',
      title: 'Medication Care',
      price: 374,
      desc: 'Timed medical routines, oral medicine administration, and health tracking.',
      icon: 'medication',
    },
  ];

  // Milestone Rewards
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

  // Calculator computation
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

  const currentMilestonePerk = () => {
    if (nights >= 15) return { title: 'FREE Full Package Grooming Treatment', value: '₹2,199 Value FREE' };
    if (nights >= 8) return { title: 'FREE Special Package Grooming Treatment', value: '₹999 Value FREE' };
    if (nights >= 4) return { title: 'FREE Furry Fresh Grooming Refresh', value: '₹749 Value FREE' };
    return null;
  };

  const milestone = currentMilestonePerk();

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
    { icon: 'restaurant', title: 'Regular Diet / Food', desc: 'Enough dry kibble or wet food for your pet’s stay.' },
    { icon: 'medication', title: 'Medications (if any)', desc: 'Clear dosage instructions for our caregivers.' },
    { icon: 'favorite', title: 'Favorite Blanket or Toy', desc: 'Helps your companion settle in with familiar home scent.' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-[#FAF8F5] text-left"
    >
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Breadcrumb & Header */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-sanctuary-dark/60">
            <button onClick={() => onNavigate('home')} className="hover:text-sanctuary-gold">Home</button>
            <span>/</span>
            <span className="text-sanctuary-gold">Cage-Free Boarding</span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-sanctuary-moss/10 text-sanctuary-moss text-[11px] font-black uppercase tracking-wider">
            <span>Kanakapura Highway (NH 948) • Easy Drop-Off On Vacation Route</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-sanctuary-dark tracking-tight leading-tight">
            Clean Cage-Free <span className="text-sanctuary-gold">Pet Boarding.</span>
          </h1>

          <p className="text-sm sm:text-base text-sanctuary-dark/75 font-medium max-w-2xl leading-relaxed">
            Zero wire cages, zero loneliness. A clean, cage-free boarding floor with private orthopaedic bedding, nature walks, city stress relief, and daily WhatsApp updates while you travel.
          </p>
        </div>

        {/* 2-Column Split: Image Showcase & Real Rates */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Studio Photo & Inclusions */}
          <div className="lg:col-span-5 space-y-4">
            <div className="rounded-3xl overflow-hidden shadow-xl border border-black/10 relative group">
              <img
                src="/images/clean_dog_boarding.jpg"
                alt="Clean Boarding Floor"
                className="w-full h-72 sm:h-80 object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent flex flex-col justify-end p-5 text-white">
                <span className="bg-emerald-600 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider w-fit mb-2">
                  100% Cage-Free
                </span>
                <h3 className="text-lg font-black text-white">Nature Walks & City Stress Relief</h3>
                <p className="text-xs text-white/80 font-medium">
                  Located away from city pollution and traffic. Sanitized bedding, 2 daily walks, and 24/7 caretaker on site.
                </p>
              </div>
            </div>

            {/* Standard Inclusions Card */}
            <div className="p-4 bg-white rounded-2xl border border-black/10 shadow-xs space-y-2.5">
              <div className="text-xs font-black uppercase tracking-wider text-sanctuary-forest flex items-center gap-1.5">
                <span className="material-symbols-outlined text-base text-sanctuary-gold">verified</span>
                <span>Included in Every Stay</span>
              </div>
              <ul className="text-xs text-sanctuary-dark/80 space-y-1.5 font-medium">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-black">✓</span>
                  <span><strong>Dog Stays:</strong> Private climate-controlled cabin, premium meals, treats, 2 customized nature walks daily, lawn play sessions, 24/7 supervision, and daily WhatsApp photo updates.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-black">✓</span>
                  <span><strong>Cat Stays:</strong> Private quiet cabin, cozy haven, custom feeding schedules, and daily photo updates.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Right: Boarding Rate Cards */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Rates Switcher Tabs */}
            <div className="flex items-center justify-between pb-1">
              <h3 className="text-lg font-black text-sanctuary-dark">Daily Per-Day Boarding Rates</h3>
              <div className="flex bg-sanctuary-sand p-1 rounded-xl gap-1">
                <button
                  onClick={() => setPet('dog')}
                  className={`px-3 py-1 rounded-lg text-xs font-black transition-all ${
                    pet === 'dog' ? 'bg-sanctuary-forest text-white shadow-xs' : 'text-sanctuary-dark/70'
                  }`}
                >
                  Dog Rates
                </button>
                <button
                  onClick={() => setPet('cat')}
                  className={`px-3 py-1 rounded-lg text-xs font-black transition-all ${
                    pet === 'cat' ? 'bg-sanctuary-forest text-white shadow-xs' : 'text-sanctuary-dark/70'
                  }`}
                >
                  Cat Rates
                </button>
              </div>
            </div>

            {/* Dynamic Cards Grid */}
            <div className="grid sm:grid-cols-2 gap-3.5">
              {(pet === 'dog' ? dogRates : catRates).map((r) => (
                <div
                  key={r.id}
                  className={`bg-white rounded-2xl p-4 sm:p-5 border flex flex-col justify-between space-y-3 shadow-xs hover:shadow-md transition-all relative ${
                    r.popular ? 'border-sanctuary-gold ring-1 ring-sanctuary-gold' : 'border-black/10'
                  }`}
                >
                  {r.popular && (
                    <span className="absolute -top-2.5 right-4 bg-sanctuary-gold text-sanctuary-dark text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                      Most Popular
                    </span>
                  )}

                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-base font-black text-sanctuary-dark">{r.title}</h3>
                        <span className="text-[9px] font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.2 rounded">
                          Save ₹{r.save}/day
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs line-through text-red-500 font-bold decoration-red-500 block">
                          ₹{r.orig}
                        </span>
                        <span className="text-xl font-black text-sanctuary-dark leading-none">
                          ₹{r.price}
                        </span>
                        <span className="text-[9px] font-bold text-emerald-700">/day</span>
                      </div>
                    </div>
                    <p className="text-[11px] text-sanctuary-dark/65 font-semibold pt-1">{r.sub}</p>
                  </div>

                  <div className="pt-2 border-t border-black/5">
                    <button
                      onClick={() =>
                        onOpenBooking({
                          type: 'boarding',
                          serviceName: `${r.title} Boarding`,
                          basePrice: r.price,
                          origPrice: r.orig,
                          petType: 'dog',
                          petSize: r.id as any,
                          nights: 4,
                        })
                      }
                      className="w-full py-2 bg-sanctuary-forest hover:bg-black text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-colors text-center flex items-center justify-center gap-1.5 shadow-xs"
                    >
                      <span>Book This Rate</span>
                      <span className="material-symbols-outlined text-sm font-bold">arrow_forward</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Boarding Add-ons */}
            <div className="pt-2">
              <div className="text-xs font-black uppercase tracking-wider text-sanctuary-gold mb-2">
                Optional Boarding Add-ons
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                {boardingAddons.map((addon) => (
                  <div key={addon.id} className="p-3 bg-white rounded-xl border border-black/10 flex items-start gap-2.5">
                    <div className="size-8 rounded-lg bg-sanctuary-sand text-sanctuary-forest flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-base">{addon.icon}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-black text-sanctuary-dark">{addon.title}</h4>
                        <span className="text-xs font-black text-emerald-800">+₹{addon.price}</span>
                      </div>
                      <p className="text-[10px] text-sanctuary-dark/65 font-medium leading-tight mt-0.5">{addon.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Free Milestone Rewards on Stays */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-sanctuary-gold">
                Complimentary Milestone Perks
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-sanctuary-dark">
                Free Grooming Treatments on Every Extended Stay
              </h3>
            </div>
            <span className="hidden sm:inline-block text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
              Automatically Applied
            </span>
          </div>

          <div className="grid sm:grid-cols-3 gap-3.5">
            {milestones.map((m, i) => (
              <div key={i} className="p-4 bg-white rounded-2xl border border-black/10 shadow-xs flex flex-col justify-between space-y-2 hover:shadow-md transition-all">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${m.badgeBg}`}>
                      {m.days}
                    </span>
                    <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      {m.value}
                    </span>
                  </div>
                  <h4 className="text-sm font-black text-sanctuary-dark pt-1">{m.reward}</h4>
                  <p className="text-[11px] text-sanctuary-dark/70 font-medium leading-relaxed">{m.desc}</p>
                </div>
                <button
                  onClick={() =>
                    onOpenBooking({
                      type: 'boarding',
                      serviceName: 'Cage-Free Boarding Floor',
                      basePrice: 625,
                      nights: m.nights,
                      appliedCouponCode: m.nights >= 15 ? 'FREESPA15' : m.nights >= 8 ? 'FREESPA8' : 'FREESPA',
                    })
                  }
                  className="w-full py-1.5 bg-sanctuary-sand hover:bg-sanctuary-forest hover:text-white rounded-lg text-[10px] font-black uppercase tracking-wider transition-colors text-center"
                >
                  Book Stay & Claim
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Interactive Instant Nights Calculator */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-black/10 shadow-lg space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-black/5 pb-3">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-sanctuary-gold">
                Live Pricing Calculator
              </span>
              <h3 className="text-xl font-black text-sanctuary-dark">Estimate Your Pet's Boarding Total</h3>
            </div>
            <span className="text-xs text-sanctuary-dark/60 font-semibold">Special Direct Pricing with Free Milestones</span>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Pet Type */}
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-sanctuary-dark/70">Companion</label>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  onClick={() => setPet('dog')}
                  className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                    pet === 'dog' ? 'bg-sanctuary-forest text-white border-sanctuary-forest' : 'border-black/10'
                  }`}
                >
                  Dog
                </button>
                <button
                  onClick={() => setPet('cat')}
                  className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                    pet === 'cat' ? 'bg-sanctuary-forest text-white border-sanctuary-forest' : 'border-black/10'
                  }`}
                >
                  Cat
                </button>
              </div>
            </div>

            {/* Size for Dog or Cat Type */}
            {pet === 'dog' ? (
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-sanctuary-dark/70">Dog Breed Weight</label>
                <div className="grid grid-cols-3 gap-1">
                  {[
                    { id: 'small', label: '< 10 kg' },
                    { id: 'medium', label: '10–25 kg' },
                    { id: 'large', label: '> 25 kg' },
                  ].map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setDogSize(s.id as any)}
                      className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                        dogSize === s.id ? 'bg-sanctuary-forest text-white border-sanctuary-forest' : 'border-black/10'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-sanctuary-dark/70">Cat Type</label>
                <div className="grid grid-cols-2 gap-1">
                  <button
                    onClick={() => setCatType('neutered')}
                    className={`py-2 rounded-xl text-[11px] font-bold border transition-all ${
                      catType === 'neutered' ? 'bg-sanctuary-forest text-white border-sanctuary-forest' : 'border-black/10'
                    }`}
                  >
                    Neutered (₹625)
                  </button>
                  <button
                    onClick={() => setCatType('non-neutered')}
                    className={`py-2 rounded-xl text-[11px] font-bold border transition-all ${
                      catType === 'non-neutered' ? 'bg-sanctuary-forest text-white border-sanctuary-forest' : 'border-black/10'
                    }`}
                  >
                    Non-Neut (₹750)
                  </button>
                </div>
              </div>
            )}

            {/* Duration Slider & Presets */}
            <div className="sm:col-span-2 space-y-1">
              <div className="flex justify-between items-center text-xs font-bold">
                <span>Duration:</span>
                <span className="text-sanctuary-gold font-black bg-sanctuary-gold/15 px-2 py-0.5 rounded-full">
                  {nights} Nights
                </span>
              </div>
              <div className="grid grid-cols-4 gap-1 pb-1">
                {[
                  { n: 2, label: '2 N', perk: 'Standard' },
                  { n: 4, label: '4 N', perk: 'FREE REFRESH' },
                  { n: 8, label: '8 N', perk: 'FREE SPECIAL' },
                  { n: 15, label: '15 N', perk: 'FREE FULL PKG' },
                ].map((item) => (
                  <button
                    key={item.n}
                    type="button"
                    onClick={() => setNights(item.n)}
                    className={`py-1 px-1 rounded-lg border text-center transition-all ${
                      nights === item.n
                        ? 'bg-sanctuary-forest text-white border-sanctuary-forest font-bold'
                        : 'bg-sanctuary-sand/40 text-sanctuary-dark border-black/10'
                    }`}
                  >
                    <div className="text-[10px] font-black">{item.label}</div>
                    <div className={`text-[8px] font-extrabold ${nights === item.n ? 'text-amber-300' : 'text-emerald-700'}`}>
                      {item.perk}
                    </div>
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
          </div>

          {/* Add-ons Toggles */}
          <div className="p-3 bg-sanctuary-sand/50 rounded-2xl flex flex-wrap items-center gap-4">
            <span className="text-xs font-black text-sanctuary-dark">Include Add-ons:</span>
            <label className="flex items-center gap-2 text-xs font-bold cursor-pointer">
              <input
                type="checkbox"
                checked={toyBundle}
                onChange={(e) => setToyBundle(e.target.checked)}
                className="rounded accent-sanctuary-forest size-4"
              />
              <span>Active Toy Bundle (+₹186)</span>
            </label>
            <label className="flex items-center gap-2 text-xs font-bold cursor-pointer">
              <input
                type="checkbox"
                checked={medCare}
                onChange={(e) => setMedCare(e.target.checked)}
                className="rounded accent-sanctuary-forest size-4"
              />
              <span>Medication Care (+₹374)</span>
            </label>
          </div>

          {/* Calculator Output & Action */}
          <div className="p-4 bg-sanctuary-sand rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 border border-black/5">
            <div>
              <div className="text-xs text-sanctuary-dark/70 font-semibold">
                Estimated Total for {nights} Night{nights > 1 ? 's' : ''}:
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-xs line-through text-red-500 font-bold decoration-red-500">
                  ₹{origTotal}
                </span>
                <span className="text-2xl font-black text-sanctuary-dark">
                  ₹{total}
                </span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                  You Save ₹{origTotal - total}
                </span>
              </div>
              {milestone && (
                <div className="text-[11px] font-bold text-emerald-800 mt-1 flex items-center gap-1">
                  <span>UNLOCKED: {milestone.title} ({milestone.value})</span>
                </div>
              )}
            </div>

            <button
              onClick={() =>
                onOpenBooking({
                  type: 'boarding',
                  serviceName: `${pet === 'cat' ? (catType === 'neutered' ? 'Neutered Cat' : 'Non-Neutered Cat') : `${dogSize.toUpperCase()} Dog`} Boarding`,
                  basePrice: dailyRate,
                  origPrice: dailyOrig,
                  petType: pet,
                  petSize: pet === 'dog' ? dogSize : undefined,
                  catType: pet === 'cat' ? catType : undefined,
                  nights: nights,
                  appliedCouponCode: nights >= 15 ? 'FREESPA15' : nights >= 8 ? 'FREESPA8' : nights >= 4 ? 'FREESPA' : undefined,
                })
              }
              className="w-full sm:w-auto py-3 px-6 bg-sanctuary-forest hover:bg-black text-white rounded-xl font-black text-xs uppercase tracking-wider transition-all shadow-md shrink-0"
            >
              Book with Milestone Rewards
            </button>
          </div>
        </div>

        {/* Daily Life Timeline */}
        <div className="space-y-4">
          <div className="text-left">
            <span className="text-[10px] font-black uppercase tracking-wider text-sanctuary-gold">
              Predictable, Stress-Free Schedule
            </span>
            <h3 className="text-2xl font-black text-sanctuary-dark mt-0.5">
              Daily Schedule on Our Boarding Floor
            </h3>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {timeline.map((t, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-4 border border-black/10 shadow-xs space-y-1.5 hover:shadow-md transition-all"
              >
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-sanctuary-sand text-sanctuary-forest inline-block">
                  {t.time}
                </span>
                <h4 className="text-xs font-black text-sanctuary-dark">{t.title}</h4>
                <p className="text-[11px] text-sanctuary-dark/70 font-medium leading-relaxed">{t.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Intake Checklist */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-black/10 shadow-sm space-y-4">
          <h3 className="text-xl font-black text-sanctuary-dark">What to Bring on Check-in Day</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {checklist.map((item, i) => (
              <div key={i} className="flex gap-3 items-start">
                <div className="size-10 rounded-xl bg-sanctuary-sand text-sanctuary-forest flex items-center justify-center font-black shrink-0">
                  <span className="material-symbols-outlined text-xl">{item.icon}</span>
                </div>
                <div>
                  <h4 className="text-xs font-black text-sanctuary-dark">{item.title}</h4>
                  <p className="text-[11px] text-sanctuary-dark/70 font-medium leading-snug mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </motion.div>
  );
};

export default BoardingPage;
