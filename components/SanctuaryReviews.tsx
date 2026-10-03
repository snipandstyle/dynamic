import React from 'react';

export const SanctuaryReviews: React.FC = () => {
  const reviews = [
    {
      id: 1,
      name: 'Priya Venkatesh',
      pet: 'Simba (Golden Retriever, 3 yrs)',
      service: '7 Days Boarding',
      comment:
        'I had to travel to Mumbai for a week and was terrified about leaving Simba because he gets anxiety. The team at Snip & Style sent morning and evening 4K videos on WhatsApp of Simba playing on the turf lawn and eating happily. Plus, he got a free spa bath before returning home!',
      highlight: 'Daily WhatsApp videos put my mind completely at ease!',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150',
    },
    {
      id: 2,
      name: 'Arjun Nambiar',
      pet: 'Milo (Shih Tzu, 1 yr)',
      service: 'Breed Haircut & Dental',
      comment:
        'Hands down Bengaluru’s finest pet stylists! Milo hated other salons because they were rough. At Snip & Style, the groomer took 15 minutes letting Milo sniff the tools and giving him treats before starting. The Asian Teddy Bear cut was textbook perfection.',
      highlight: 'The gentlest groomers in Bengaluru. Zero fear or rushing.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
    },
    {
      id: 3,
      name: 'Deepa Srinivas',
      pet: 'Bella & Coco (Persian Cats)',
      service: '5 Days Cat Haven',
      comment:
        'Finding a cat boarding place that is actually soundproofed from barking dogs is nearly impossible in Bangalore until I found Snip & Style. Their cat sanctuary has vertical climbing trees and pheromone diffusers. Both Bella and Coco were calm and purring!',
      highlight: 'True soundproofed cat haven. No dog barking stress!',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
    },
  ];

  return (
    <section
      id="reviews"
      className="min-h-screen lg:h-screen lg:max-h-screen flex flex-col justify-center px-4 sm:px-6 lg:px-8 py-6 bg-white relative overflow-hidden border-t border-black/5 text-left"
    >
      <div className="max-w-7xl mx-auto w-full space-y-4">
        
        {/* Compact Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 pb-2 border-b border-black/5">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-500/10 text-amber-700 text-[10px] font-black uppercase tracking-wider mb-1">
              <span className="material-symbols-outlined text-xs">stars</span>
              <span>4.9 / 5.0 Star Rating on Google</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-serif font-bold text-sanctuary-dark">
              Loved by 2,400+ Companions. Raved by Parents.
            </h2>
          </div>
          <p className="text-xs text-sanctuary-dark/70 font-medium max-w-sm">
            Read real, unfiltered Google reviews from Bangalore pet parents who trust Snip & Style.
          </p>
        </div>

        {/* 3 Review Cards that fit on 1 Screen */}
        <div className="grid md:grid-cols-3 gap-4">
          {reviews.map((r) => (
            <div
              key={r.id}
              className="bg-sanctuary-pearl rounded-3xl p-5 border border-black/10 shadow-sm flex flex-col justify-between space-y-3 hover:shadow-lg transition-all"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={r.avatar}
                      alt={r.name}
                      className="size-10 rounded-full object-cover border-2 border-white shadow-xs"
                    />
                    <div>
                      <h4 className="text-xs font-black text-sanctuary-dark flex items-center gap-1">
                        <span>{r.name}</span>
                        <span className="material-symbols-outlined text-blue-500 text-xs">verified</span>
                      </h4>
                      <p className="text-[10px] text-sanctuary-dark/60 font-semibold">{r.pet}</p>
                    </div>
                  </div>
                  <div className="flex text-amber-500 text-xs">★★★★★</div>
                </div>

                <div className="text-[11px] font-black text-sanctuary-dark italic bg-white p-2.5 rounded-xl border border-black/5">
                  "{r.highlight}"
                </div>

                <p className="text-[11px] text-sanctuary-dark/75 font-medium leading-relaxed">
                  {r.comment}
                </p>
              </div>

              <div className="pt-2 border-t border-black/5 flex items-center justify-between text-[10px] text-sanctuary-dark/50 font-bold">
                <span className="text-emerald-700 font-bold">Verified Google Review</span>
                <span className="text-sanctuary-gold font-bold">{r.service}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Link to Google Maps */}
        <div className="text-center pt-2">
          <a
            href="https://maps.google.com/?q=Snip+and+Style+Kanakapura+Road+Bengaluru"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-sanctuary-dark hover:text-sanctuary-gold transition-colors"
          >
            <span>Read all 380+ Verified Reviews on Google Maps</span>
            <span className="material-symbols-outlined text-sm">open_in_new</span>
          </a>
        </div>

      </div>
    </section>
  );
};

export default SanctuaryReviews;
