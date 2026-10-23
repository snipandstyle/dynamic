import React, { useState } from 'react';

export const AtelierSpaMenu: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'sculpt' | 'bath' | 'medicated' | 'cat'>('all');
  const [size, setSize] = useState<'small' | 'medium' | 'large'>('small');

  const services = [
    {
      id: 'furry-fresh',
      category: 'bath',
      tag: 'ESSENTIAL HYGIENE',
      tagBg: 'bg-emerald-100 text-emerald-800',
      title: 'Furry Fresh (Basic Hygiene Care)',
      desc: 'Essential regular hygiene maintenance focused on deep cleansing without full body styling. Perfect for active dogs needing a refresh.',
      duration: '45–60 min',
      pricing: { small: 499, medium: 699, large: 849, original: 649 },
      inclusions: [
        'Bath with Shampoo & Conditioner',
        'Professional Blow Dry',
        'Combing & Brushing',
        'Ear Cleaning',
        'Eye Cleaning',
      ],
      whatsappMsg: 'Hi Snip & Style Atelier! I would like to book Furry Fresh.',
    },
    {
      id: 'special-package',
      category: 'bath',
      tag: '⭐ MOST POPULAR',
      tagBg: 'bg-sanctuary-gold text-sanctuary-dark font-black',
      title: 'Special Package (Enhanced Care & Dental)',
      desc: 'A step up from basic hygiene adding essential dental and paw care to keep breath fresh and paws neat and protected.',
      duration: '60–75 min',
      pricing: { small: 899, medium: 949, large: 999, original: 1124 },
      inclusions: [
        'Bath with Shampoo & Conditioner',
        'Professional Blow Dry',
        'Combing & Brushing',
        'Ear Cleaning & Eye Cleaning',
        'Mouth Spray',
        'Teeth Brushing',
        'Paws Trimming',
        'Nail Clipping',
      ],
      whatsappMsg: 'Hi Snip & Style Atelier! I would like to book the Special Package.',
    },
    {
      id: 'sculpt',
      category: 'sculpt',
      tag: 'BREED STYLING',
      tagBg: 'bg-purple-100 text-purple-900',
      title: 'Style Your Pet (Full Body Styling & Trimming)',
      desc: 'Signature breed styling package. Includes a full body trim tailored to breed standards or custom preferences, plus meticulous face trimming.',
      duration: '75–90 min',
      pricing: { small: 1799, medium: 1799, large: 1799, original: 2249 },
      inclusions: [
        'Full Body Trimming',
        'Face Trimming',
        'Sanitary Trimmer (Free)',
        'Nail Clipping (Free)',
        'Ear Cleaning (Free)',
        'Eye Cleaning (Free)',
        'Combing & Brushing (Free)',
        'Mouth Spray (Free)',
      ],
      whatsappMsg: 'Hi Snip & Style Atelier! I would like to book Style Your Pet.',
    },
    {
      id: 'medicated-spa',
      category: 'medicated',
      tag: '👑 ULTIMATE SPA',
      tagBg: 'bg-sanctuary-forest text-white',
      title: 'Full Grooming (Ultimate Head-to-Tail Experience)',
      desc: 'Comprehensive head-to-tail pampering featuring a therapeutic medicated bath to protect skin health alongside full grooming luxury.',
      duration: '90–120 min',
      pricing: { small: 2199, medium: 2199, large: 2199, original: 3249 },
      inclusions: [
        'Bath with Shampoo & Conditioner',
        'Therapeutic Medicated Bath',
        'Hair Styling/Trimming',
        'Sanitary Trimmer',
        'Nail Clipping',
        'Ear Cleaning & Eye Cleaning',
        'Combing & Brushing',
        'Deshedding Treatment',
      ],
      whatsappMsg: 'Hi Snip & Style Atelier! I would like to book Full Grooming.',
    },
    {
      id: 'cat-lion',
      category: 'cat',
      tag: 'FELINE CERTIFIED',
      tagBg: 'bg-purple-700 text-white',
      title: 'Feline Full Grooming & Calm Spa',
      desc: 'Complete grooming for cats including Lion Cut or Comb Cut if desired, full bath, and mat prevention.',
      duration: '45–60 min',
      pricing: { small: 2199, medium: 2199, large: 2199, original: 2749 },
      inclusions: [
        'Haircut (Lion/Comb Cut)',
        'Bath with Shampoo & Conditioner',
        'Nail Clipping',
        'Ear & Eye Cleaning',
        'Mat Removal',
        'Deshedding Treatment',
      ],
      whatsappMsg: 'Hi Snip & Style Atelier! I would like to book Feline Full Grooming.',
    },
  ];

  const filtered = services.filter((s) => {
    if (filter === 'all') return true;
    return s.category === filter;
  }).slice(0, 3); // Take top 3 for clean 1-screen fit

  return (
    <section
      id="grooming"
      className="min-h-screen lg:h-screen lg:max-h-screen flex flex-col justify-center px-4 sm:px-6 lg:px-8 py-6 bg-sanctuary-pearl relative overflow-hidden border-t border-black/5 text-left"
    >
      <div className="max-w-7xl mx-auto w-full space-y-4">
        
        {/* Compact Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 pb-2 border-b border-black/5">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-sanctuary-moss/10 text-sanctuary-moss text-[10px] font-black uppercase tracking-wider mb-1">
              <span className="material-symbols-outlined text-xs">content_cut</span>
              <span>Styling Atelier & Spa • 10% OFF Code: GROOM10</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-serif font-bold text-sanctuary-dark">
              Artisan Grooming & Botanical Spa Menu
            </h2>
          </div>

          {/* Size Switcher */}
          <div className="flex items-center gap-2 bg-sanctuary-sand p-1 rounded-xl">
            <span className="text-[10px] font-black uppercase tracking-wider text-sanctuary-dark/50 pl-2">
              Size:
            </span>
            {[
              { id: 'small', label: 'Small (<10kg)' },
              { id: 'medium', label: 'Med (10-25kg)' },
              { id: 'large', label: 'Large (>25kg)' },
            ].map((s) => (
              <button
                key={s.id}
                onClick={() => setSize(s.id as any)}
                className={`px-3 py-1 rounded-lg text-xs font-black transition-all ${
                  size === s.id
                    ? 'bg-sanctuary-gold text-sanctuary-dark font-black shadow-xs'
                    : 'text-sanctuary-dark/70 hover:text-sanctuary-dark'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: 'all', label: 'All Signature' },
            { id: 'sculpt', label: 'Breed Scissor Sculpt' },
            { id: 'bath', label: 'Baths & Dental' },
            { id: 'medicated', label: 'Medicated Skin Spa' },
            { id: 'cat', label: 'Cat Grooming' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id as any)}
              className={`py-1.5 px-3.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                filter === tab.id
                  ? 'bg-sanctuary-forest text-white shadow-xs'
                  : 'bg-white border border-black/10 text-sanctuary-dark/70 hover:bg-black/5'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* 3 Prominent Treatment Cards that fit on 1 Screen */}
        <div className="grid md:grid-cols-3 gap-4">
          {filtered.map((item) => {
            const price = item.pricing[size];
            const orig = Math.round(price * 1.25);
            const savings = orig - price;

            return (
              <div
                key={item.id}
                className="bg-white rounded-3xl p-5 border border-black/10 shadow-md hover:shadow-xl transition-all flex flex-col justify-between space-y-3 group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${item.tagBg}`}>
                      {item.tag}
                    </span>
                    <span className="text-[10px] font-bold text-sanctuary-dark/60 flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs">schedule</span>
                      <span>{item.duration}</span>
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-black text-sanctuary-dark group-hover:text-sanctuary-gold transition-colors leading-tight">
                      {item.title}
                    </h3>
                    <p className="text-xs text-sanctuary-dark/70 font-medium mt-1 leading-relaxed line-clamp-2">
                      {item.desc}
                    </p>
                  </div>

                  {/* Pricing */}
                  <div className="p-2.5 bg-sanctuary-sand rounded-xl flex items-baseline justify-between">
                    <div>
                      <span className="text-xs line-through text-red-500 font-bold decoration-red-500 block">₹{orig}</span>
                      <span className="text-xl font-black text-sanctuary-dark leading-none">₹{price}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[9px] font-black text-emerald-800 bg-emerald-100/60 px-2 py-0.5 rounded-full">
                        Save ₹{savings}
                      </span>
                    </div>
                  </div>

                  {/* Inclusions */}
                  <div className="space-y-1 pt-1 border-t border-black/5">
                    {item.inclusions.slice(0, 4).map((inc, i) => (
                      <div key={i} className="flex items-start gap-1.5 text-[11px] text-sanctuary-dark/80 font-medium">
                        <span className="material-symbols-outlined text-emerald-600 text-xs shrink-0 mt-0.5">check_circle</span>
                        <span className="truncate">{inc}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Booking Button */}
                <div className="pt-2">
                  <button
                    onClick={() => {
                      window.dispatchEvent(new CustomEvent('snip_open_booking'));
                    }}
                    className="w-full py-2.5 bg-sanctuary-forest hover:bg-black text-white rounded-xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95"
                  >
                    <span>Book Treatment</span>
                    <span className="material-symbols-outlined text-sm font-bold">arrow_forward</span>
                  </button>
                  <p className="text-[9px] text-center text-sanctuary-dark/65 font-semibold pt-1">
                    📍 Book online & visit our Kanakapura Road Studio
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default AtelierSpaMenu;
