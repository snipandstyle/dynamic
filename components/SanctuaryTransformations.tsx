import React, { useState } from 'react';

export const SanctuaryTransformations: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'sculpt' | 'deshed' | 'cat'>('all');

  const items = [
    {
      id: 1,
      category: 'sculpt',
      pet: 'Milo (Shih Tzu)',
      title: 'Asian Fusion Teddy Bear Silhouette',
      before: 'Overgrown, matted facial hair obscuring vision and messy paws',
      after: 'Surgically sculpted round teddy bear muzzle, clean paw pads & silk mist',
      beforeImg: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&q=80&w=400',
      afterImg: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&q=80&w=400',
    },
    {
      id: 2,
      category: 'deshed',
      pet: 'Bruno (Golden Retriever)',
      title: 'Deep Undercoat De-Shedding & Mineral Hydrotherapy',
      before: 'Massive seasonal undercoat shedding, heat rash, and outdoor dust',
      after: 'Over 2kg of dead undercoat extracted, feathering trimmed, glossy shine',
      beforeImg: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=400',
      afterImg: 'https://images.unsplash.com/photo-1544568100-847a948585b9?auto=format&fit=crop&q=80&w=400',
    },
    {
      id: 3,
      category: 'cat',
      pet: 'Simba (Persian Cat)',
      title: 'Stress-Free Signature Lion Cut & Tear Cleanse',
      before: 'Tangled underbelly mats causing pain during walking, tear stains',
      after: 'Pain-free velvety lion trim with full majestic mane and clean eyes',
      beforeImg: 'https://images.unsplash.com/photo-1535930891776-0c2dfb7fda1a?auto=format&fit=crop&q=80&w=400',
      afterImg: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=400',
    },
    {
      id: 4,
      category: 'sculpt',
      pet: 'Oreo (Lhasa Apso)',
      title: 'Breed Scissor Profile & Ultrasonic Dental Spa',
      before: 'Stained beard, calculus buildup on teeth, overgrown skirt',
      after: 'Pristine white beard, ultrasonic plaque removal, fresh mint breath',
      beforeImg: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&q=80&w=400',
      afterImg: 'https://images.unsplash.com/photo-1585846416120-3a7354ed7d65?auto=format&fit=crop&q=80&w=400',
    }
  ];

  const filtered = items.filter((item) => {
    if (activeCategory === 'all') return true;
    return item.category === activeCategory;
  });

  return (
    <section id="transformations" className="py-20 px-4 sm:px-6 lg:px-8 bg-sanctuary-pearl relative overflow-hidden border-t border-black/5 text-left">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sanctuary-moss/10 border border-sanctuary-moss/20 text-sanctuary-moss text-xs font-black uppercase tracking-wider">
            <span className="material-symbols-outlined text-sm">auto_fix_high</span>
            <span>Proof of Craftsmanship</span>
          </div>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold text-sanctuary-dark leading-tight">
            Artisan Transformations <br />
            <span className="italic font-normal text-sanctuary-gold">From Messy to Majestic.</span>
          </h2>

          <p className="text-sm sm:text-base text-sanctuary-dark/70 font-medium leading-relaxed">
            See how our master stylists blend gentle handling with bespoke breed sculpting techniques to produce show-quality results without stress.
          </p>

          {/* Filter tabs */}
          <div className="flex justify-center gap-2 pt-2">
            {[
              { id: 'all', label: 'All Transformations' },
              { id: 'sculpt', label: 'Breed Scissor Sculpt' },
              { id: 'deshed', label: 'De-Shedding Therapy' },
              { id: 'cat', label: 'Feline Lion Cuts' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveCategory(tab.id as any)}
                className={`py-2 px-4 rounded-xl text-xs font-black transition-all ${
                  activeCategory === tab.id
                    ? 'bg-sanctuary-forest text-white shadow-md'
                    : 'bg-sanctuary-sand text-sanctuary-dark/70 hover:bg-black/5'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Transformations Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl overflow-hidden border border-black/10 shadow-lg p-6 sm:p-7 flex flex-col justify-between space-y-5"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider text-sanctuary-gold">
                    {item.pet}
                  </span>
                  <span className="text-[10px] font-bold text-sanctuary-dark/50 bg-sanctuary-sand px-2.5 py-0.5 rounded-full">
                    Certified Stylist
                  </span>
                </div>

                <h3 className="text-xl font-black text-sanctuary-dark">
                  {item.title}
                </h3>

                {/* Dual Image Comparison Display */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="space-y-1.5">
                    <div className="relative h-44 rounded-2xl overflow-hidden">
                      <img
                        src={item.beforeImg}
                        alt="Before"
                        className="w-full h-full object-cover filter grayscale contrast-125"
                      />
                      <span className="absolute top-2 left-2 bg-black/70 text-white text-[9px] font-black px-2 py-0.5 rounded uppercase">
                        Before
                      </span>
                    </div>
                    <p className="text-[11px] text-sanctuary-dark/60 font-medium">
                      {item.before}
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <div className="relative h-44 rounded-2xl overflow-hidden border-2 border-sanctuary-gold/40">
                      <img
                        src={item.afterImg}
                        alt="After"
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-2 left-2 bg-sanctuary-gold text-sanctuary-dark text-[9px] font-black px-2 py-0.5 rounded uppercase">
                        After
                      </span>
                    </div>
                    <p className="text-[11px] text-emerald-900 font-bold">
                      {item.after}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => window.dispatchEvent(new CustomEvent('snip_open_booking'))}
                  className="w-full py-3 bg-sanctuary-forest hover:bg-black text-white rounded-xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md active:scale-95"
                >
                  <span>Book This Look Online</span>
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default SanctuaryTransformations;
