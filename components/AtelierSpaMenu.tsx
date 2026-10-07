import React, { useState } from 'react';

export const AtelierSpaMenu: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'sculpt' | 'bath' | 'medicated' | 'cat'>('all');
  const [size, setSize] = useState<'small' | 'medium' | 'large'>('small');

  const services = [
    {
      id: 'sculpt',
      category: 'sculpt',
      tag: 'ATELIER MASTERPIECE',
      tagBg: 'bg-sanctuary-gold text-sanctuary-dark',
      title: 'Asian Fusion & Breed Sculpt',
      desc: 'Hand-scissor styling customized to your companion’s bone structure (Teddy Bear, Puppy Cut or Summer Silhouette).',
      duration: '75–90 min',
      pricing: { small: 1599, medium: 1799, large: 1999, original: 2249 },
      inclusions: [
        'Full Breed Specific Scissor Profile Styling',
        'Warm Luxury Botanical Hydrobath & Conditioning',
        'Sanitary Hygiene Clip & Pad Shave',
        'Nail Clipping & Diamond Edge Filing',
        'Deep Ear Cleansing & Hair Plucking',
        'Signature Silk Finishing Mist & Bandana',
      ],
      whatsappMsg: 'Hi Snip & Style Atelier! I would like to book the Asian Fusion & Breed Sculpt.',
    },
    {
      id: 'special-package',
      category: 'bath',
      tag: 'MOST POPULAR',
      tagBg: 'bg-sanctuary-forest text-white',
      title: 'Special Package & Dental Spa',
      desc: 'Complete head-to-paw luxury maintenance experience that leaves your companion immaculate and fresh.',
      duration: '60–75 min',
      pricing: { small: 899, medium: 1049, large: 1199, original: 1124 },
      inclusions: [
        'Deep Cleansing Warm Hydromassage Bath',
        'Ultrasonic Dental Hygiene & Fresh Breath Spray',
        'Organic Coconut & Shea Butter Paw Balm',
        'Full Sanitary & Hygiene Area Trimming',
        'Nail Clipping & Round Edge Filing',
        'Warm Air Fluff Blow Dry & Cologne Spritz',
      ],
      whatsappMsg: 'Hi Snip & Style Atelier! I would like to book the Special Package & Dental Spa.',
    },
    {
      id: 'medicated-spa',
      category: 'medicated',
      tag: 'CLINICAL GRADE',
      tagBg: 'bg-emerald-700 text-white',
      title: 'Medicated Anti-Tick & Skin Spa',
      desc: 'Clinical healing hydrotherapy for companions with ticks, fleas, fungal itching, or sensitive skin allergies.',
      duration: '90–120 min',
      pricing: { small: 1999, medium: 2199, large: 2499, original: 3249 },
      inclusions: [
        'Medical Anti-Tick/Flea or Antifungal Medicated Bath',
        '15-Minute Healing Medicinal Foam Soak & Hydrotherapy',
        'Undercoat Dead Fur Extraction & De-Shedding',
        'Hypoallergenic Ear Canal Antiseptic Flush',
        'Antiseptic Paw Soak & Moisturizing Balm',
        'Veterinary Skin & Coat Report Card',
      ],
      whatsappMsg: 'Hi Snip & Style Atelier! I would like to book the Medicated Anti-Tick & Skin Spa.',
    },
    {
      id: 'furry-fresh',
      category: 'bath',
      tag: 'ESSENTIAL CARE',
      tagBg: 'bg-sanctuary-sand text-sanctuary-dark',
      title: 'Furry Fresh Botanical Bath',
      desc: 'Quick revitalizing bath using imported natural plant extracts. Restores coat luster and removes dust.',
      duration: '45–60 min',
      pricing: { small: 499, medium: 599, large: 699, original: 649 },
      inclusions: [
        'Gentle Organic Cleansing Shampoo',
        'Rich Coat Nourishing Conditioner',
        'Warm Air High-Velocity Blow Dry',
        'Ear Wipe & Paw Pad Cleansing',
        'Full Body Brush-Out & Cologne',
      ],
      whatsappMsg: 'Hi Snip & Style Atelier! I would like to book the Furry Fresh Botanical Bath.',
    },
    {
      id: 'cat-lion',
      category: 'cat',
      tag: 'FELINE CERTIFIED',
      tagBg: 'bg-purple-700 text-white',
      title: 'Feline Calm Groom & Lion Trim',
      desc: 'Conducted in our quiet soundproofed cat lounge by certified feline whisperers using silent clippers.',
      duration: '45–60 min',
      pricing: { small: 1499, medium: 1499, large: 1799, original: 1999 },
      inclusions: [
        'Persian Full Lion Cut or Light Scissor Silhouette',
        'Low-Stress Calm Foam Bath or Warm Hydrobath',
        'Gentle Claw Clipping (Front & Back)',
        'Ear Mite Inspection & Eye Stain Cleansing',
        'Feliway Calming Pheromone Mist',
      ],
      whatsappMsg: 'Hi Snip & Style Atelier! I would like to book the Feline Calm Groom & Lion Trim.',
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
