import React from 'react';

export const SanctuaryVsTraditional: React.FC = () => {
  const comparison = [
    {
      feature: 'Living Accommodation',
      sanctuary: '100% Cage-Free Private AC Suites with memory foam beds',
      traditional: 'Narrow wire cages, metal crates, or concrete pens',
    },
    {
      feature: 'Exercise & Outdoor Play',
      sanctuary: '3 to 4 scheduled outdoor runs on green turf meadow',
      traditional: 'Short 10-minute walk on hot concrete',
    },
    {
      feature: 'Parent Communication',
      sanctuary: 'Daily 4K WhatsApp video reels & playtime photos',
      traditional: 'Rare or no updates unless chased',
    },
    {
      feature: 'Handling Philosophy',
      sanctuary: 'Certified Fear-Free gentle handling with patience',
      traditional: 'Forced restraints and rush-grooming',
    },
    {
      feature: 'Veterinary Oversight',
      sanctuary: 'Mandatory vaccination check + 24/7 on-call doctor',
      traditional: 'Unverified records, no doctor on call',
    },
  ];

  const safetyGuarantees = [
    {
      icon: 'verified_user',
      title: 'Mandatory Vaccines',
      desc: 'Anti-Rabies & DHPPi verified before entry. No exceptions.',
    },
    {
      icon: 'sanitizer',
      title: 'Hospital Sterilization',
      desc: 'Ozonated disinfection twice daily with pet-safe antiseptics.',
    },
    {
      icon: 'shield_with_heart',
      title: 'Fear-Free Certified',
      desc: 'Handlers trained to understand pet stress body language.',
    },
    {
      icon: 'medical_services',
      title: '24/7 Vet Partner',
      desc: 'Emergency clinic on Kanakapura Road on standby.',
    },
  ];

  return (
    <section
      id="difference"
      className="min-h-screen lg:h-screen lg:max-h-screen flex flex-col justify-center px-4 sm:px-6 lg:px-8 py-6 bg-sanctuary-sand/40 relative overflow-hidden border-t border-black/5 text-left"
    >
      <div className="max-w-7xl mx-auto w-full space-y-4">
        
        {/* Compact Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 pb-2 border-b border-black/5">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-sanctuary-moss/10 text-sanctuary-moss text-[10px] font-black uppercase tracking-wider mb-1">
              <span className="material-symbols-outlined text-xs">balance</span>
              <span>The Sanctuary Standard</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-serif font-bold text-sanctuary-dark">
              The Country Club Difference
            </h2>
          </div>
          <p className="text-xs text-sanctuary-dark/70 font-medium max-w-sm">
            We built Snip & Style because we could never leave our own pets in wire cages.
          </p>
        </div>

        {/* 2-Column Split that fits on 1 Screen */}
        <div className="grid lg:grid-cols-12 gap-6 items-center">
          
          {/* Left: Comparison Table */}
          <div className="lg:col-span-7 bg-white rounded-3xl overflow-hidden border border-black/10 shadow-lg">
            <div className="grid grid-cols-12 bg-sanctuary-forest text-white p-3 px-4 font-black text-[11px] uppercase tracking-wider">
              <div className="col-span-4 text-left">Standard</div>
              <div className="col-span-5 text-center text-sanctuary-gold">Snip & Style Sanctuary</div>
              <div className="col-span-3 text-center text-white/40">Old Kennels</div>
            </div>

            <div className="divide-y divide-black/5 text-xs">
              {comparison.map((item, idx) => (
                <div
                  key={idx}
                  className={`grid grid-cols-12 p-3 px-4 items-center ${
                    idx % 2 === 0 ? 'bg-white' : 'bg-sanctuary-pearl'
                  }`}
                >
                  <div className="col-span-4 font-black text-sanctuary-dark pr-1 text-[11px]">
                    {item.feature}
                  </div>
                  <div className="col-span-5 text-left text-emerald-900 font-bold px-1 flex items-center gap-1.5 text-[11px]">
                    <span className="material-symbols-outlined text-emerald-600 text-sm shrink-0">check_circle</span>
                    <span>{item.sanctuary}</span>
                  </div>
                  <div className="col-span-3 text-left text-sanctuary-dark/50 font-medium px-1 flex items-center gap-1 text-[10px]">
                    <span className="material-symbols-outlined text-red-400 text-xs shrink-0">cancel</span>
                    <span>{item.traditional}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: 4 Safety Pillars & Photo */}
          <div className="lg:col-span-5 space-y-3">
            <div className="grid grid-cols-2 gap-2.5">
              {safetyGuarantees.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-2xl p-3 border border-black/10 shadow-xs space-y-1"
                >
                  <div className="size-8 rounded-xl bg-sanctuary-moss/10 text-sanctuary-moss flex items-center justify-center">
                    <span className="material-symbols-outlined text-lg">{item.icon}</span>
                  </div>
                  <h4 className="text-xs font-black text-sanctuary-dark">{item.title}</h4>
                  <p className="text-[10px] text-sanctuary-dark/65 font-medium leading-tight">{item.desc}</p>
                </div>
              ))}
            </div>

            {/* Trial Visit Card */}
            <div className="p-3.5 rounded-2xl bg-sanctuary-forest text-white flex items-center justify-between gap-3 shadow-md">
              <div className="space-y-0.5">
                <div className="text-xs font-black text-sanctuary-gold">Free 30-Min Trial Visit</div>
                <div className="text-[10px] text-white/70">Bring your companion to tour our suites & sniff our lawn for free!</div>
              </div>
              <button
                type="button"
                onClick={() => window.dispatchEvent(new CustomEvent('snip_open_booking'))}
                className="py-2 px-3.5 bg-sanctuary-gold hover:bg-amber-400 text-sanctuary-dark rounded-xl font-black text-[10px] uppercase tracking-wider shrink-0 shadow-sm transition-all"
              >
                Schedule Visit
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default SanctuaryVsTraditional;
