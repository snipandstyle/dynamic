import React, { useState } from 'react';

interface SanctuaryHeaderProps {
  onNavigate: (sectionId: string) => void;
  activeSection: string;
  onOpenBooking?: () => void;
  onOpenAuth?: () => void;
  onOpenAdmin?: () => void;
}

export const SanctuaryHeader: React.FC<SanctuaryHeaderProps> = ({
  onNavigate,
  activeSection,
  onOpenBooking,
  onOpenAuth,
  onOpenAdmin,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  React.useEffect(() => {
    const checkUser = () => {
      try {
        const saved = localStorage.getItem('snip_user');
        if (saved) setCurrentUser(JSON.parse(saved));
        else setCurrentUser(null);
      } catch {
        setCurrentUser(null);
      }
    };
    checkUser();
    window.addEventListener('snip_auth_change', checkUser);
    window.addEventListener('storage', checkUser);
    return () => {
      window.removeEventListener('snip_auth_change', checkUser);
      window.removeEventListener('storage', checkUser);
    };
  }, []);

  const getFirstName = () => {
    if (!currentUser?.fullName) return 'Account';
    return currentUser.fullName.split(' ')[0];
  };

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'boarding', label: 'Boarding' },
    { id: 'grooming', label: 'Grooming' },
    { id: 'about', label: 'About' },
    { id: 'reviews', label: 'Reviews' },
    { id: 'safety', label: 'Safety' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'contact', label: 'Contact' },
  ];

  const handleLink = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-[100] px-4 sm:px-6 py-2.5 bg-white/95 backdrop-blur-md border-b border-black/5">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        
        {/* Official Brand Logo */}
        <div
          onClick={() => handleLink('home')}
          className="flex items-center cursor-pointer select-none py-0.5"
        >
          <img
            src="/images/logo.png"
            alt="Snip & Style Pet Grooming"
            className="h-10 sm:h-12 w-auto object-contain bg-white rounded-lg"
          />
        </div>

        {/* Desktop Nav Items */}
        <nav className="hidden md:flex items-center gap-5">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleLink(link.id)}
              className={`text-xs font-bold uppercase tracking-wider transition-colors ${
                activeSection === link.id
                  ? 'text-sanctuary-gold font-extrabold'
                  : 'text-sanctuary-dark/70 hover:text-sanctuary-gold'
              }`}
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Actions Group */}
        <div className="flex items-center gap-2">
          {onOpenAuth && (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-1.5 text-xs font-bold text-sanctuary-dark/80 hover:text-sanctuary-dark px-3 py-1.5 rounded-xl border border-black/10 hover:border-sanctuary-gold hover:bg-sanctuary-sand transition-all"
              title={currentUser ? `Logged in as ${currentUser.fullName}` : 'Customer Login / Sign Up'}
            >
              {currentUser ? (
                <>
                  <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-sanctuary-forest font-black truncate max-w-[100px]">{getFirstName()}</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-base">person</span>
                  <span>Login</span>
                </>
              )}
            </button>
          )}

          <button
            onClick={() => {
              if (onOpenBooking) onOpenBooking();
              else onNavigate('boarding');
            }}
            className="py-2 px-4 bg-sanctuary-forest hover:bg-black text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-xs flex items-center gap-1.5"
          >
            <span>Book Now</span>
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </button>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden size-8 rounded-lg bg-sanctuary-sand flex items-center justify-center text-sanctuary-dark"
            aria-label="Toggle menu"
          >
            <span className="material-symbols-outlined text-base">
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>

      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden pt-3 pb-2 border-t border-black/5 mt-2 space-y-2 text-left">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleLink(link.id)}
              className="block w-full py-1.5 text-xs font-bold text-sanctuary-dark/80 hover:text-sanctuary-gold text-left"
            >
              {link.label}
            </button>
          ))}
          <div className="pt-2 border-t border-black/5 flex items-center justify-between">
            {onOpenAuth && (
              <button
                onClick={() => { onOpenAuth(); setMobileMenuOpen(false); }}
                className="text-xs font-bold text-sanctuary-dark flex items-center gap-1.5 py-1"
              >
                {currentUser ? (
                  <>
                    <span className="size-2 rounded-full bg-emerald-500" />
                    <span>My Account ({currentUser.fullName})</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-sm">person</span>
                    <span>Customer Login / Sign Up</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default SanctuaryHeader;
