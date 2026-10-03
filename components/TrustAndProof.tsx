import React from 'react';

export const TrustAndProof: React.FC = () => {
  const reviews = [
    {
      id: 1,
      name: 'Priya Venkatesh',
      pet: 'Simba (Golden Retriever)',
      service: '7 Days Boarding',
      text: 'Rahul sent morning and evening videos on WhatsApp of Simba playing and eating happily. Plus he got a free spa bath before coming home smelling like vanilla! 100% recommended.',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=120',
    },
    {
      id: 2,
      name: 'Arjun Nambiar',
      pet: 'Milo (Shih Tzu)',
      service: 'Breed Haircut & Dental',
      text: 'Hands down Bengaluru’s finest stylists! Milo hated other salons because they rushed. Here the groomer spent 15 minutes letting him sniff tools and giving treats. Asian Teddy cut was perfection.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120',
    },
    {
      id: 3,
      name: 'Deepa Srinivas',
      pet: 'Bella & Coco (Persian Cats)',
      service: '5 Days Cat Boarding',
      text: 'Finding cat boarding that is actually separated from barking dogs is rare in Bangalore. Snip & Style has a quiet dedicated cat space with climbing perches. Reassuring daily photo updates!',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120',
    },
  ];

  return (
    <section
      id="why-us"
      className="min-h-screen lg:h-screen lg:max-h-screen flex flex-col justify-center px-4 sm:px-6 lg:px-8 py-4 lg:py-6 bg-sanctuary-sand/30 relative text-left border-t border-black/5"
    >
      <div className="max-w-6xl mx-auto w-full space-y-4">
        
        {/* Compact Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 pb-2 border-b border-black/5">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-sanctuary-moss/10 text-sanctuary-moss text-[10px] font-black uppercase tracking-wider mb-1">
              <span>Why 2,400+ Bangalore Pet Parents Trust Us</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-sanctuary-dark">
              Honest Care. Real Peace of Mind.
            </h2>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-sanctuary-dark">
            <span className="text-amber-500">★★★★★</span>
            <span>4.9 Rating based on 380+ Google Reviews</span>
          </div>
        </div>

        {/* 2-Column Split: Guarantees on Left, Reviews on Right */}
        <div className="grid lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Left: 4 Honest Standards */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-5 border border-black/10 shadow-sm flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <h3 className="text-base font-black text-sanctuary-dark">Our Standards</h3>
              
              <div className="space-y-2.5">
                <div className="flex items-start gap-2.5">
                  <div className="size-7 rounded-lg bg-sanctuary-forest text-sanctuary-gold flex items-center justify-center shrink-0 text-xs font-bold">
                    ✓
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-sanctuary-dark">100% Cage-Free AC Floor</h4>
                    <p className="text-[11px] text-sanctuary-dark/70">No metal crates or wire cages. Clean, climate-controlled boarding space.</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="size-7 rounded-lg bg-sanctuary-forest text-sanctuary-gold flex items-center justify-center shrink-0 text-xs font-bold">
                    ✓
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-sanctuary-dark">Daily 4K WhatsApp Videos</h4>
                    <p className="text-[11px] text-sanctuary-dark/70">Morning and evening video updates sent directly to your phone.</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="size-7 rounded-lg bg-sanctuary-forest text-sanctuary-gold flex items-center justify-center shrink-0 text-xs font-bold">
                    ✓
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-sanctuary-dark">Strict Vaccine Protocol</h4>
                    <p className="text-[11px] text-sanctuary-dark/70">Anti-Rabies & DHPPi verified before entry for 100% pet safety.</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="size-7 rounded-lg bg-sanctuary-forest text-sanctuary-gold flex items-center justify-center shrink-0 text-xs font-bold">
                    ✓
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-sanctuary-dark">24/7 Caretaker & Vet On-Call</h4>
                    <p className="text-[11px] text-sanctuary-dark/70">Dedicated staff continuously present on site plus nearby veterinary partner.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Trial Visit Callout */}
            <div className="p-3 bg-sanctuary-sand rounded-xl flex items-center justify-between gap-3">
              <div className="text-[11px] text-sanctuary-dark font-bold leading-tight">
                Want to check the facility before travel?
              </div>
              <button
                onClick={() => {
                  const el = document.getElementById('contact-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                  else window.location.hash = 'contact';
                }}
                className="py-1.5 px-3 bg-sanctuary-forest hover:bg-black text-white rounded-lg font-bold text-[10px] uppercase tracking-wider shrink-0 transition-colors"
              >
                Schedule Visit
              </button>
            </div>
          </div>

          {/* Right: 3 Real Verified Google Reviews */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-2.5">
            {reviews.map((r) => (
              <div
                key={r.id}
                className="bg-white rounded-2xl p-4 border border-black/10 shadow-xs space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img src={r.avatar} alt={r.name} className="size-8 rounded-full object-cover" />
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

                <p className="text-[11px] text-sanctuary-dark/80 font-medium leading-relaxed">
                  "{r.text}"
                </p>

                <div className="flex items-center justify-between text-[9px] text-sanctuary-dark/50 font-bold pt-0.5">
                  <span className="text-emerald-700">Verified Google Review</span>
                  <span className="text-sanctuary-gold">{r.service}</span>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
};

export default TrustAndProof;
