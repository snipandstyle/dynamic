import React from 'react';
import { motion } from 'framer-motion';

interface AboutPageProps {
  onOpenBooking: () => void;
  onNavigate: (page: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onOpenBooking, onNavigate }) => {
  const values = [
    {
      icon: 'brush',
      title: 'Artistic Breed Styling',
      desc: 'We don’t just shave fur. We craft breed-standard styles and customized puppy trims based on your companion’s coat texture, face structure, and personality.',
      color: 'bg-sanctuary-gold/15 text-sanctuary-dark',
    },
    {
      icon: 'psychology',
      title: 'Fear-Free Pet Psychology',
      desc: 'Our stylists and handlers are trained in low-stress behavioral handling. No harsh restraints, no rushing. We build trust with gentle touch, praise, and treats.',
      color: 'bg-emerald-100 text-emerald-800',
    },
    {
      icon: 'favorite',
      title: 'Family-First Care',
      desc: 'When your companion walks through our doors on Kanakapura Road, they become family. Fresh filtered RO water, sanitized orthopaedic beds, and 24/7 caretaker attention.',
      color: 'bg-rose-100 text-rose-800',
    },
  ];

  const highlights = [
    { num: '380+', label: 'Verified 5-Star Google Reviews' },
    { num: '100%', label: 'Cage-Free & Fully Air-Conditioned' },
    { num: '4K', label: 'Daily WhatsApp Video Updates' },
    { num: '7 Days', label: 'Open 09:30 AM – 08:30 PM' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-[#FAF8F5] text-left"
    >
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Top Breadcrumb & Header */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-sanctuary-dark/60">
            <button onClick={() => onNavigate('home')} className="hover:text-sanctuary-gold">Home</button>
            <span>/</span>
            <span className="text-sanctuary-gold">About Us</span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-sanctuary-gold/20 text-sanctuary-dark text-[11px] font-black uppercase tracking-wider">
            <span>Our Story & Mission • Kanakapura Road, Bangalore</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-sanctuary-dark tracking-tight leading-tight">
            Heart of the <span className="text-sanctuary-gold">Studio.</span>
          </h1>

          <p className="text-sm sm:text-base text-sanctuary-dark/75 font-medium max-w-2xl leading-relaxed">
            We started Snip & Style with a simple, uncompromising belief: every pet deserves to feel safe, clean, and genuinely cherished. Not in a crowded cage or noisy warehouse, but in a hygienic, climate-controlled sanctuary.
          </p>
        </div>

        {/* 2-Column Story Section */}
        <div className="grid lg:grid-cols-12 gap-8 items-center">
          {/* Left: Real Studio Photo */}
          <div className="lg:col-span-6 rounded-3xl overflow-hidden shadow-xl border border-black/10 relative group">
            <img
              src="/images/hero_banner_pets.jpg"
              alt="Snip & Style Pet Studio"
              className="w-full h-80 sm:h-96 object-cover object-top group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent flex flex-col justify-end p-6 text-white">
              <span className="bg-sanctuary-gold text-sanctuary-dark text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider w-fit mb-2">
                Beside Shani Mahatma Temple
              </span>
              <h3 className="text-xl font-black text-white">Kanakapura Main Road Studio</h3>
              <p className="text-xs text-white/80 font-medium">
                South Bangalore’s trusted destination for luxury grooming and 100% cage-free boarding.
              </p>
            </div>
          </div>

          {/* Right: The 3 Core Values */}
          <div className="lg:col-span-6 space-y-4">
            {values.map((v, i) => (
              <div
                key={i}
                className="p-5 bg-white rounded-2xl border border-black/5 shadow-xs hover:shadow-md transition-all flex gap-4 items-start"
              >
                <div className={`size-12 rounded-xl ${v.color} flex items-center justify-center shrink-0`}>
                  <span className="material-symbols-outlined text-2xl">{v.icon}</span>
                </div>
                <div className="space-y-1">
                  <h4 className="text-base font-black text-sanctuary-dark">{v.title}</h4>
                  <p className="text-xs text-sanctuary-dark/70 font-medium leading-relaxed">{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Studio Highlights Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {highlights.map((h, i) => (
            <div key={i} className="p-4 bg-white rounded-2xl border border-black/5 text-center shadow-xs">
              <div className="text-2xl sm:text-3xl font-black text-sanctuary-gold">{h.num}</div>
              <div className="text-[11px] font-bold text-sanctuary-dark/70 mt-0.5">{h.label}</div>
            </div>
          ))}
        </div>

        {/* Founder Quote Card */}
        <div className="p-6 sm:p-8 bg-sanctuary-forest text-white rounded-3xl relative overflow-hidden shadow-lg border border-white/10">
          <div className="relative z-10 space-y-4 max-w-3xl">
            <span className="material-symbols-outlined text-4xl text-sanctuary-gold">format_quote</span>
            <p className="text-base sm:text-xl font-bold italic leading-relaxed text-white/95">
              “Our mission is simple: when you entrust your pet to us—whether for a morning bubble bath or a 2-week boarding stay while you travel—you should feel zero anxiety. We treat them with the exact warmth and patience we give our own furry children.”
            </p>
            <div className="flex items-center gap-3 pt-2">
              <div className="size-10 rounded-full bg-sanctuary-gold text-sanctuary-dark flex items-center justify-center font-black">
                <span className="material-symbols-outlined text-xl">pets</span>
              </div>
              <div>
                <div className="text-sm font-black text-white">The Snip & Style Care Team</div>
                <div className="text-[11px] text-sanctuary-gold font-bold">Kanakapura Road, Bangalore</div>
              </div>
            </div>
          </div>
        </div>

        {/* Action CTAs */}
        <div className="flex flex-wrap items-center gap-4 pt-2">
          <button
            onClick={onOpenBooking}
            className="py-3 px-6 bg-sanctuary-forest hover:bg-black text-white rounded-xl font-black text-xs uppercase tracking-wider transition-all shadow-md"
          >
            Book Appointment / Boarding
          </button>
          <button
            onClick={() => onNavigate('contact')}
            className="py-3 px-6 bg-white hover:bg-sanctuary-sand text-sanctuary-dark border border-black/10 rounded-xl font-bold text-xs uppercase tracking-wider transition-all"
          >
            Visit Studio Location
          </button>
        </div>

      </div>
    </motion.div>
  );
};

export default AboutPage;
