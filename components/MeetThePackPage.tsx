import React from 'react';
import { motion } from 'framer-motion';

interface MeetThePackPageProps {
  onOpenBooking: () => void;
  onNavigate: (page: string) => void;
}

export const MeetThePackPage: React.FC<MeetThePackPageProps> = ({ onOpenBooking, onNavigate }) => {
  const teamRoles = [
    {
      role: 'Master Breed Stylists',
      title: 'Scissor & Coat Specialists',
      desc: 'Certified pet groomers with years of hands-on experience in Asian fusion styles, show cuts, gentle dematting, and puppy teddy trims.',
      icon: 'content_cut',
      badge: 'Certified Stylists',
    },
    {
      role: 'Canine Behavioral Handlers',
      title: 'Fear-Free & Low-Stress Care',
      desc: 'Trained to detect anxiety, calming nervous tails with patience, gentle handling, and positive reinforcement without restraints.',
      icon: 'psychology',
      badge: 'Fear-Free Certified',
    },
    {
      role: '24/7 Boarding Caretakers',
      title: 'Round-the-Clock Companionship',
      desc: 'Dedicated caregivers who sleep and stay on our air-conditioned boarding floor, ensuring timely feeding, hydration, and regular walkies.',
      icon: 'bedtime',
      badge: 'On-Site 24/7',
    },
    {
      role: 'Veterinary Partners',
      title: 'Licensed Vet Doctor On-Call',
      desc: 'Partnered with experienced veterinary physicians right on Kanakapura Main Road to guarantee immediate medical attention if ever needed.',
      icon: 'medical_services',
      badge: 'Vet On-Call',
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
            <span className="text-sanctuary-gold">Meet The Pack</span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-sanctuary-gold/20 text-sanctuary-dark text-[11px] font-black uppercase tracking-wider">
            <span>The Heart of Our Studio</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-sanctuary-dark tracking-tight leading-tight">
            Expert Trained <span className="text-sanctuary-gold">Hands.</span>
          </h1>

          <p className="text-sm sm:text-base text-sanctuary-dark/75 font-medium max-w-2xl leading-relaxed">
            Our team consists of certified grooming artists and compassionate animal lovers who don’t just see a pet—they see a personality. We blend precision technique with a gentle, patient touch.
          </p>
        </div>

        {/* 4 Roles Grid */}
        <div className="grid sm:grid-cols-2 gap-5">
          {teamRoles.map((role, i) => (
            <div
              key={i}
              className="bg-white rounded-3xl p-6 sm:p-7 border border-black/10 shadow-xs flex flex-col justify-between space-y-4 hover:shadow-md transition-all"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="size-12 rounded-2xl bg-sanctuary-sand text-sanctuary-forest flex items-center justify-center font-black">
                    <span className="material-symbols-outlined text-2xl">{role.icon}</span>
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 bg-sanctuary-gold/15 text-sanctuary-dark rounded-full">
                    {role.badge}
                  </span>
                </div>

                <div className="pt-2">
                  <span className="text-[11px] font-bold text-sanctuary-gold uppercase tracking-wider block">
                    {role.role}
                  </span>
                  <h3 className="text-lg font-black text-sanctuary-dark">{role.title}</h3>
                </div>

                <p className="text-xs text-sanctuary-dark/70 font-medium leading-relaxed">
                  {role.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Promise Card */}
        <div className="p-8 bg-sanctuary-forest text-white rounded-3xl shadow-xl border border-white/10 space-y-4 text-center max-w-3xl mx-auto">
          <span className="material-symbols-outlined text-5xl text-sanctuary-gold">pets</span>
          <h3 className="text-2xl font-black text-white">Our Non-Negotiable Care Promise</h3>
          <p className="text-sm text-white/80 leading-relaxed font-medium">
            “No rushed grooming, no harsh pulling, no wire cages. We work at your companion’s natural pace and comfort level. Every bath, brush, and boarding stay is conducted with genuine love and respect.”
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={onOpenBooking}
              className="py-3 px-6 bg-sanctuary-gold hover:bg-amber-400 text-sanctuary-dark rounded-xl font-black text-xs uppercase tracking-wider transition-all"
            >
              Book an Appointment
            </button>
            <button
              onClick={() => onNavigate('grooming')}
              className="py-3 px-6 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-all"
            >
              Explore Grooming Menu
            </button>
          </div>
        </div>

      </div>
    </motion.div>
  );
};

export default MeetThePackPage;
