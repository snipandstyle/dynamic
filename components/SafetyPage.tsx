import React from 'react';
import { motion } from 'framer-motion';

interface SafetyPageProps {
  onOpenBooking: () => void;
  onNavigate: (page: string) => void;
}

export const SafetyPage: React.FC<SafetyPageProps> = ({ onOpenBooking, onNavigate }) => {
  const protocols = [
    {
      icon: 'eco',
      title: '100% pH-Balanced Organic Shampoos',
      desc: 'We strictly avoid harsh detergents, parabens, sulfates, and chemical colorants. Only tearless, hypoallergenic botanical formulations tailored to your pet’s specific skin and coat condition.',
      badge: 'Gentle Botanicals',
    },
    {
      icon: 'pets',
      title: '100% Cage-Free Setup',
      desc: 'Our boarding facility is physically a clean, spacious floor at our Kanakapura Road studio. Zero wire cages or cramped crates. Clean sanitized orthopaedic bedding for every guest.',
      badge: 'Zero Wire Cages',
    },
    {
      icon: 'favorite',
      title: 'Fear-Free Low-Stress Handling',
      desc: 'No forceful restraints, muzzles, or rough handling. Our groomers take time to read body language, take calming breaks, and use gentle praise. Nervous pets are given all the time they need.',
      badge: 'Trained Handlers',
    },
    {
      icon: 'nature_people',
      title: 'Daily Meadow Play & Lawn Walks',
      desc: 'Active outdoor play sessions and nature walks to keep energy balanced, joints healthy, and tails wagging happily during every boarding stay.',
      badge: 'Daily Romps',
    },
    {
      icon: 'water_drop',
      title: 'Fresh Filtered Water & Custom Diets',
      desc: 'Continuous access to clean filtered water and feeding strictly according to each pet parent’s schedule and home dietary instructions.',
      badge: 'Healthy Nutrition',
    },
    {
      icon: 'clean_hands',
      title: 'Sanitized Tools & Fresh Towels',
      desc: 'Warm hydrobaths with freshly washed microfibre towels and sanitized grooming tools between pets to ensure clean, fresh, and soothing sessions.',
      badge: 'Clean & Fresh',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-[#FAF8F5] text-left"
    >
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-sanctuary-dark/60">
            <button onClick={() => onNavigate('home')} className="hover:text-sanctuary-gold">Home</button>
            <span>/</span>
            <span className="text-sanctuary-gold">Safety & Hygiene</span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-black uppercase tracking-wider">
            <span>Sanitization & Comfort Standards</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-sanctuary-dark tracking-tight leading-tight">
            Safety & <span className="text-emerald-700">Hygiene First.</span>
          </h1>

          <p className="text-sm sm:text-base text-sanctuary-dark/75 font-medium max-w-2xl leading-relaxed">
            Your pet’s health, hygiene, and emotional comfort are non-negotiable. Learn how our daily sanitization, cage-free setup, and caring protocols keep your best friend safe.
          </p>
        </div>

        {/* 2 Visual Photo Spotlights */}
        <div className="grid sm:grid-cols-2 gap-6">
          <div className="rounded-3xl overflow-hidden border border-black/10 shadow-md relative group h-64 sm:h-72">
            <img
              src="/images/clean_dog_boarding.jpg"
              alt="Clean Boarding Floor"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-5 text-white">
              <span className="bg-emerald-600 text-white text-[9px] font-black px-2 py-0.5 rounded uppercase w-fit mb-1">
                Boarding Hygiene
              </span>
              <h3 className="text-base font-black text-white">100% Sanitized Bedding & Floor</h3>
              <p className="text-xs text-white/80">Cleaned twice daily with non-toxic pet-safe disinfectants.</p>
            </div>
          </div>

          <div className="rounded-3xl overflow-hidden border border-black/10 shadow-md relative group h-64 sm:h-72">
            <img
              src="/images/luxury_dog_grooming.jpg"
              alt="Organic Hydrobath Grooming"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-5 text-white">
              <span className="bg-sanctuary-gold text-sanctuary-dark text-[9px] font-black px-2 py-0.5 rounded uppercase w-fit mb-1">
                Grooming Sanitization
              </span>
              <h3 className="text-base font-black text-white">Sanitized Tools & Hydrobath</h3>
              <p className="text-xs text-white/80">Every tool is sanitized after every session for optimal skin health.</p>
            </div>
          </div>
        </div>

        {/* 6 Standards Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {protocols.map((p, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-5 border border-black/10 shadow-xs flex flex-col justify-between space-y-3 hover:shadow-md transition-all"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="size-11 rounded-xl bg-sanctuary-sand text-sanctuary-forest flex items-center justify-center font-black">
                    <span className="material-symbols-outlined text-2xl">{p.icon}</span>
                  </div>
                  <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 bg-sanctuary-gold/15 text-sanctuary-dark rounded-full">
                    {p.badge}
                  </span>
                </div>

                <h3 className="text-base font-black text-sanctuary-dark">{p.title}</h3>
                <p className="text-xs text-sanctuary-dark/70 font-medium leading-relaxed">{p.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Free Inspection Visit Callout */}
        <div className="p-6 sm:p-8 bg-white rounded-3xl border border-black/10 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 max-w-xl">
            <div className="inline-block px-2.5 py-0.5 rounded-full bg-sanctuary-moss/10 text-sanctuary-moss text-[10px] font-black uppercase">
              Free Studio Visit
            </div>
            <h3 className="text-xl font-black text-sanctuary-dark">
              Want to inspect our boarding floor before traveling?
            </h3>
            <p className="text-xs text-sanctuary-dark/70 font-medium leading-relaxed">
              We welcome pet parents for a complimentary 30-minute studio walkthrough. Meet our caretakers, see the spacious suites, and see firsthand how clean our facility is.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <a
              href="https://wa.me/919739887770?text=Hi%2C%20I%20would%20like%20to%20schedule%20a%20studio%20visit%20at%20Snip%20%26%20Style!"
              target="_blank"
              rel="noopener noreferrer"
              className="py-3 px-6 bg-sanctuary-forest hover:bg-black text-white rounded-xl font-bold text-xs uppercase tracking-wider shadow-sm transition-all text-center flex items-center justify-center gap-1.5"
            >
              <span>Schedule Studio Visit</span>
              <span className="material-symbols-outlined text-sm">chat</span>
            </a>
            <button
              onClick={onOpenBooking}
              className="py-3 px-6 bg-sanctuary-gold hover:bg-amber-400 text-sanctuary-dark rounded-xl font-black text-xs uppercase tracking-wider transition-all text-center"
            >
              Book Now
            </button>
          </div>
        </div>

      </div>
    </motion.div>
  );
};

export default SafetyPage;
