import React, { useState } from 'react';

export const SanctuarySuites: React.FC = () => {
  const [selectedSuiteIdx, setSelectedSuiteIdx] = useState<number>(1); // Default to Executive Garden Villa

  const suites = [
    {
      id: 'meadow',
      name: 'The Meadow View Suite',
      badge: 'Best for Small Breeds',
      sizeTarget: 'Puppies & Small Dogs (<10kg)',
      dims: '45 sq. ft. Private Room',
      origPrice: 625,
      price: 562,
      camName: 'Meadow Suite 01 (Puppy Lounge)',
      image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&q=80&w=900',
      highlights: [
        'Individual climate-controlled quiet AC room (22°C)',
        'Plush orthopaedic memory foam anti-bacterial bedding',
        '3 daily outdoor lawn romps on green turf',
        'Daily 4K WhatsApp photo & video updates',
        'Hand-fed meals according to parent instructions',
      ],
    },
    {
      id: 'executive',
      name: 'The Executive Garden Villa',
      badge: 'Most Popular',
      sizeTarget: 'Medium Dogs (10–25kg) & Active Breeds',
      dims: '75 sq. ft. Walk-in Villa',
      origPrice: 750,
      price: 675,
      camName: 'Garden Villa 04 (Executive AC)',
      image: 'https://images.unsplash.com/photo-1544568100-847a948585b9?auto=format&fit=crop&q=80&w=900',
      highlights: [
        'Spacious walk-in private suite with glass view door',
        'Hypoallergenic medical-grade plush mattress',
        '4 daily outdoor agility & fetch sessions on turf',
        'Daily WhatsApp video reels with assigned handler',
        'Complimentary ₹800 Furry Fresh Spa on 4+ nights',
      ],
    },
    {
      id: 'presidential',
      name: 'The Presidential Suite',
      badge: 'Ultimate Space',
      sizeTarget: 'Large Dogs (>25kg) & Pet Siblings',
      dims: '120 sq. ft. Master Villa',
      origPrice: 875,
      price: 787,
      camName: 'Presidential 01 (Master Lawn Suite)',
      image: 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&q=80&w=900',
      highlights: [
        'Double-size master suite for Goldens, Labs & Huskies',
        'King-size orthopaedic bed with bolster pillows',
        'Dedicated senior handler & private cuddle time',
        'Free doorstep AC Pet Taxi pickup on 5+ nights',
        'Complimentary ultrasonic dental care & paw spa',
      ],
    },
    {
      id: 'cat-loft',
      name: 'The Feline Cloud Loft',
      badge: '100% Cat Sanctuary',
      sizeTarget: 'Cats of All Personalities',
      dims: 'Soundproofed Multi-Level Loft',
      origPrice: 625,
      price: 562,
      camName: 'Feline Sanctuary Loft 02',
      image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=900',
      highlights: [
        'Completely soundproofed away from dog barking',
        'Multi-tiered vertical climbing towers & sisal posts',
        'Private sanitized litter box refreshed 3x daily',
        'Soothing Feliway pheromone scent diffusion',
        'Daily laser games, catnip stimulation & grooming',
      ],
    }
  ];

  const current = suites[selectedSuiteIdx];

  return (
    <section
      id="boarding"
      className="min-h-screen lg:h-screen lg:max-h-screen flex flex-col justify-center px-4 sm:px-6 lg:px-8 py-6 bg-sanctuary-sand/40 relative overflow-hidden border-t border-black/5 text-left"
    >
      <div className="max-w-7xl mx-auto w-full space-y-4">
        
        {/* Compact Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 pb-2 border-b border-black/5">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-sanctuary-moss/10 text-sanctuary-moss text-[10px] font-black uppercase tracking-wider mb-1">
              <span className="material-symbols-outlined text-xs">hotel</span>
              <span>The Suite Collection • 100% Cage-Free</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-serif font-bold text-sanctuary-dark">
              Private, Climate-Controlled Luxury Suites
            </h2>
          </div>
          <p className="text-xs text-sanctuary-dark/70 font-medium max-w-sm">
            Zero wire cages. Each companion enjoys individual AC regulation, sanitized bedding, and daily green lawn romps.
          </p>
        </div>

        {/* 2-Column Suite Explorer that fits on 1 Screen */}
        <div className="grid lg:grid-cols-12 gap-6 items-center">
          
          {/* Left: Suite Tabs & Selected Suite Card */}
          <div className="lg:col-span-5 space-y-3">
            
            {/* 4 Interactive Suite Tabs */}
            <div className="grid grid-cols-2 gap-2">
              {suites.map((s, idx) => (
                <button
                  key={s.id}
                  onClick={() => setSelectedSuiteIdx(idx)}
                  className={`p-2.5 rounded-2xl border text-left transition-all ${
                    selectedSuiteIdx === idx
                      ? 'bg-sanctuary-forest text-white border-sanctuary-forest shadow-md'
                      : 'bg-white border-black/10 text-sanctuary-dark hover:border-black/20'
                  }`}
                >
                  <div className={`text-[9px] font-bold uppercase tracking-wider ${selectedSuiteIdx === idx ? 'text-sanctuary-gold' : 'text-sanctuary-gold'}`}>
                    {s.badge}
                  </div>
                  <div className="text-xs font-black truncate mt-0.5">{s.name}</div>
                  <div className={`text-[10px] font-bold ${selectedSuiteIdx === idx ? 'text-white/80' : 'text-sanctuary-dark/60'}`}>
                    ₹{s.price}/night
                  </div>
                </button>
              ))}
            </div>

            {/* Selected Suite Inclusions Card */}
            <div className="bg-white rounded-3xl p-5 border border-black/10 shadow-lg space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-black text-sanctuary-dark">{current.name}</h3>
                  <div className="text-[11px] text-sanctuary-dark/60">{current.sizeTarget} • {current.dims}</div>
                </div>
                <div className="text-right">
                  <span className="text-xs line-through text-red-500 font-bold decoration-red-500 block">₹{current.origPrice}</span>
                  <span className="text-xl font-black text-sanctuary-dark">₹{current.price}</span>
                  <span className="text-[9px] font-bold text-emerald-700 block">/ Night</span>
                </div>
              </div>

              {/* Inclusions checklist */}
              <div className="space-y-1.5 pt-2 border-t border-black/5 text-xs text-sanctuary-dark/80">
                {current.highlights.map((item, i) => (
                  <div key={i} className="flex items-start gap-1.5">
                    <span className="material-symbols-outlined text-emerald-600 text-sm shrink-0">check_circle</span>
                    <span className="text-[11px] font-medium leading-tight">{item}</span>
                  </div>
                ))}
              </div>

              {/* Action Reserve Button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => window.dispatchEvent(new CustomEvent('snip_open_booking'))}
                  className="w-full py-3 bg-sanctuary-forest hover:bg-black text-white rounded-xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all"
                >
                  <span>Book {current.name}</span>
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
              </div>
            </div>

          </div>

          {/* Right: Suite Photography & 4K Live Camera Mockup */}
          <div className="lg:col-span-7">
            <div className="bg-black rounded-3xl overflow-hidden border-2 border-white/20 shadow-2xl relative">
              {/* Live stream badge */}
              <div className="absolute top-3 left-3 z-20 flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-bold text-white">
                <span className="size-2 rounded-full bg-red-500 animate-ping" />
                <span className="font-mono text-red-400">LIVE 4K CCTV</span>
                <span className="text-white/40">|</span>
                <span>{current.camName}</span>
              </div>

              {/* Suite View Image */}
              <div className="relative h-64 sm:h-80 w-full overflow-hidden">
                <img
                  src={current.image}
                  alt={current.name}
                  className="w-full h-full object-cover transition-all duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
              </div>

              {/* Stream Stats Footer */}
              <div className="bg-sanctuary-charcoal p-3 px-5 flex items-center justify-between text-xs text-white/80">
                <div className="flex items-center gap-2 text-[11px]">
                  <span className="material-symbols-outlined text-sm text-emerald-400">thermostat</span>
                  <span>22.5°C Ambient AC</span>
                  <span className="text-white/30">•</span>
                  <span className="text-sanctuary-gold font-bold">Orthopaedic Memory Foam</span>
                </div>
                <div className="text-[10px] font-mono text-white/50">
                  <span>FPS: 60 • 4K ULTRA HD</span>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default SanctuarySuites;
