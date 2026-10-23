import React from 'react';

interface SanctuaryFooterProps {
  onNavigate: (sectionId: string) => void;
  onOpenTerms?: () => void;
  onOpenPrivacy?: () => void;
}

export const SanctuaryFooter: React.FC<SanctuaryFooterProps> = ({
  onNavigate,
  onOpenTerms,
  onOpenPrivacy,
}) => {
  return (
    <footer className="bg-sanctuary-forest text-white py-14 px-4 sm:px-6 lg:px-8 border-t border-white/10 text-left">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Col 1 & 2: Brand & Location Advantage */}
          <div className="lg:col-span-2 space-y-3.5">
            <div className="flex items-center gap-2.5">
              <div className="size-10 rounded-xl bg-sanctuary-gold text-sanctuary-dark flex items-center justify-center font-black">
                <span className="material-symbols-outlined text-2xl">pets</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black tracking-tight text-white">
                  Snip & Style
                </span>
                <span className="text-[10px] font-black uppercase tracking-widest text-sanctuary-gold">
                  Pet Boarding & Grooming Studio
                </span>
              </div>
            </div>

            <p className="text-xs text-white/70 font-medium leading-relaxed max-w-sm">
              Conveniently located on Kanakapura Highway (NH 948) for effortless pet drop-off on your way out of Bangalore toward vacations and weekend getaways. Situated away from city pollution and noisy traffic so pets experience calm stress relief, open nature walks, and cage-free comfort.
            </p>

            <div className="flex items-center gap-2 pt-1">
              <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-white/10 text-white/90 border border-white/10">
                100% Cage-Free
              </span>
              <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Kanakapura Highway
              </span>
            </div>
          </div>

          {/* Col 3: Quick Navigation */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-black uppercase tracking-widest text-sanctuary-gold">
              Explore Pages
            </h4>
            <ul className="space-y-1.5 text-xs text-white/75 font-medium">
              <li>
                <button onClick={() => onNavigate('home')} className="hover:text-sanctuary-gold transition-colors">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('boarding')} className="hover:text-sanctuary-gold transition-colors">
                  Cage-Free Boarding Floor
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('grooming')} className="hover:text-sanctuary-gold transition-colors">
                  Grooming & Spa Menu
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-sanctuary-gold transition-colors">
                  Our Mission & Story
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('reviews')} className="hover:text-sanctuary-gold transition-colors">
                  Verified Client Reviews (4.9 Stars)
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Standards & Legal */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-black uppercase tracking-widest text-sanctuary-gold">
              Standards & Legal
            </h4>
            <ul className="space-y-1.5 text-xs text-white/75 font-medium">
              <li>
                <button onClick={() => onNavigate('safety')} className="hover:text-sanctuary-gold transition-colors">
                  Hygiene & Safety Protocols
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('gallery')} className="hover:text-sanctuary-gold transition-colors">
                  Haircut & Facility Gallery
                </button>
              </li>
              <li>
                <button onClick={onOpenTerms} className="hover:text-sanctuary-gold transition-colors text-left">
                  Terms of Service & Boarding Rules
                </button>
              </li>
              <li>
                <button onClick={onOpenPrivacy} className="hover:text-sanctuary-gold transition-colors text-left">
                  Privacy Policy & Data Rights
                </button>
              </li>
            </ul>
          </div>

          {/* Col 5: Location & Hours */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-black uppercase tracking-widest text-sanctuary-gold">
              Studio Location
            </h4>
            <div className="space-y-1.5 text-xs text-white/75 font-medium">
              <p className="leading-relaxed">
                Site no 61, Kanakapura Main Road, Beside Shani Mahatma Temple, Bangalore 560082
              </p>
              <p className="text-sanctuary-gold font-bold">
                Open Daily: 09:30 AM – 08:30 PM
              </p>
              <p>
                Phone: <a href="tel:+919739887770" className="text-white font-bold hover:text-sanctuary-gold">+91 9739887770</a>
              </p>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-white/50 font-medium">
          <p>© {new Date().getFullYear()} Snip & Style. All rights reserved.</p>
          <div className="flex items-center gap-3">
            <button onClick={onOpenTerms} className="hover:text-white underline">
              Terms of Service
            </button>
            <span>•</span>
            <button onClick={onOpenPrivacy} className="hover:text-white underline">
              Privacy Policy
            </button>
            <span>•</span>
            <span>Kanakapura Highway, Bengaluru</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default SanctuaryFooter;
