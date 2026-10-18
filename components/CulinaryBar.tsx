import React from 'react';

export const CulinaryBar: React.FC = () => {
  const dishes = [
    {
      title: 'Farmhouse Chicken & Pumpkin Stew',
      badge: 'Most Popular',
      desc: 'Tender shredded antibiotic-free chicken breast, slow-steamed pumpkin puree, organic carrots, and brown rice with virgin coconut oil.',
      benefits: 'Gentle on digestion • High lean protein • High palatability',
      icon: 'soup_kitchen',
    },
    {
      title: 'Hypoallergenic Salmon & Sweet Potato',
      badge: 'Sensitive Skin',
      desc: 'Pure Atlantic salmon fillet, mashed orange sweet potatoes, finely chopped baby spinach, and cold-pressed Omega-3 salmon oil glaze.',
      benefits: 'Anti-inflammatory • Glossy coat • Zero corn/wheat/soy',
      icon: 'set_meal',
    },
    {
      title: '24-Hour Golden Bone Broth Elixir',
      badge: 'Joint & Gut Wellness',
      desc: 'Simmered slow for 24 hours with free-range beef marrow bones, organic fresh turmeric, and gut-healing apple cider vinegar.',
      benefits: 'Collagen rich • Joint lubrication • Deep hydration',
      icon: 'local_drink',
    },
    {
      title: 'Parent-Supplied Custom Diet Plan',
      badge: '100% Home Exact',
      desc: 'We store your supplied home food or veterinary kibble (Royal Canin, Farmina, Hill’s) in individual airtight bins and weigh exact portions.',
      benefits: 'Zero stomach change • Prescribed timings • Labeled storage',
      icon: 'scale',
    },
  ];

  return (
    <section id="dining" className="py-20 px-4 sm:px-6 lg:px-8 bg-sanctuary-pearl relative overflow-hidden border-t border-black/5 text-left">
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sanctuary-moss/10 border border-sanctuary-moss/20 text-sanctuary-moss text-xs font-black uppercase tracking-wider">
            <span className="material-symbols-outlined text-sm">restaurant</span>
            <span>Room Service & Nutrition</span>
          </div>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold text-sanctuary-dark leading-tight">
            Farm-to-Bowl Dining <br />
            <span className="italic font-normal text-sanctuary-gold">Prepared With Culinary Love.</span>
          </h2>

          <p className="text-sm sm:text-base text-sanctuary-dark/70 font-medium leading-relaxed">
            We know dietary changes can cause stomach upset. That is why we either cook fresh wholesome home-style meals or strictly follow your custom dietary instructions to the exact gram.
          </p>
        </div>

        {/* 4 Dining Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {dishes.map((dish, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl p-6 border border-black/10 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="size-11 rounded-2xl bg-sanctuary-gold/15 text-sanctuary-dark flex items-center justify-center group-hover:scale-105 transition-transform">
                    <span className="material-symbols-outlined text-2xl">{dish.icon}</span>
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-sanctuary-sand text-sanctuary-dark">
                    {dish.badge}
                  </span>
                </div>

                <h3 className="text-base font-black text-sanctuary-dark">
                  {dish.title}
                </h3>

                <p className="text-xs text-sanctuary-dark/70 font-medium leading-relaxed">
                  {dish.desc}
                </p>
              </div>

              <div className="pt-3 border-t border-black/5 text-[11px] font-bold text-emerald-800 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm shrink-0">check</span>
                <span>{dish.benefits}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Dietary Reassurance Banner */}
        <div className="p-6 sm:p-8 rounded-3xl bg-sanctuary-sand border border-black/10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1">
            <h4 className="text-base font-black text-sanctuary-dark">Have a picky eater or a companion on strict medication?</h4>
            <p className="text-xs text-sanctuary-dark/70 font-medium">
              Our caretakers hand-feed hesitant guests, warm broths to body temperature, and administer medications at prescribed hours with zero added cost.
            </p>
          </div>

          <button
            onClick={() => {
              window.dispatchEvent(new CustomEvent('snip_open_booking'));
            }}
            className="py-3 px-6 bg-sanctuary-forest hover:bg-black text-white rounded-xl font-black text-xs uppercase tracking-wider transition-all shadow-md shrink-0 flex items-center gap-2"
          >
            <span>Book Stay & Add Diet Notes</span>
            <span className="material-symbols-outlined text-sm font-bold">arrow_forward</span>
          </button>
        </div>

      </div>
    </section>
  );
};

export default CulinaryBar;
