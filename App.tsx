import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import SanctuaryHeader from './components/SanctuaryHeader';
import SanctuaryHero from './components/SanctuaryHero';
import BoardingSection from './components/BoardingSection';
import GroomingSection from './components/GroomingSection';
import OffersAndPosters from './components/OffersAndPosters';
import TrustAndProof from './components/TrustAndProof';
import LocationAndContact from './components/LocationAndContact';
import SanctuaryFooter from './components/SanctuaryFooter';
import SanctuaryMobileBar from './components/SanctuaryMobileBar';
import CheckoutModal, { BookingDetails } from './components/CheckoutModal';
import PromoPosterPopup from './components/PromoPosterPopup';
import CustomerAuthModal from './components/CustomerAuthModal';
import AdminDashboardModal from './components/AdminDashboardModal';
import TermsModal from './components/TermsModal';
import PrivacyModal from './components/PrivacyModal';

// Dedicated Full Pages
import AboutPage from './components/AboutPage';
import BoardingPage from './components/BoardingPage';
import ServicesPage from './components/ServicesPage';
import ReviewsPage from './components/ReviewsPage';
import SafetyPage from './components/SafetyPage';
import GalleryPage from './components/GalleryPage';
import ContactPage from './components/ContactPage';
import MeetThePackPage from './components/MeetThePackPage';
import AccountPage from './components/AccountPage';

import { getUTMParams, isAdVisitor } from './utils/analytics';

export type PageId = 'home' | 'boarding' | 'grooming' | 'about' | 'reviews' | 'safety' | 'gallery' | 'contact' | 'pack' | 'admin' | 'account';

const App: React.FC = () => {
  const [activePage, setActivePage] = useState<PageId>('home');
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [selectedBooking, setSelectedBooking] = useState<BookingDetails | undefined>(undefined);
  const [isPosterOpen, setIsPosterOpen] = useState<boolean>(false);
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);
  const [isTermsOpen, setIsTermsOpen] = useState<boolean>(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState<boolean>(false);

  const openBookingWithDetails = (details?: BookingDetails) => {
    if (details) setSelectedBooking(details);
    setIsCheckoutOpen(true);
  };

  // Global event listener for custom booking trigger and auth modal
  useEffect(() => {
    const handleCustomBooking = (e: any) => {
      if (e.detail) setSelectedBooking(e.detail);
      setIsCheckoutOpen(true);
    };
    const handleOpenAuth = () => setIsAuthOpen(true);
    window.addEventListener('snip_open_booking', handleCustomBooking as EventListener);
    window.addEventListener('snip_open_auth', handleOpenAuth);
    return () => {
      window.removeEventListener('snip_open_booking', handleCustomBooking as EventListener);
      window.removeEventListener('snip_open_auth', handleOpenAuth);
    };
  }, []);

  // Show flash promo poster popup after 3.5 seconds on first visit
  useEffect(() => {
    const hasSeen = sessionStorage.getItem('snip_poster_seen');
    if (!hasSeen) {
      const timer = setTimeout(() => {
        setIsPosterOpen(true);
        sessionStorage.setItem('snip_poster_seen', 'true');
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, []);

  // Attribution tracking & URL deep linking for /admin, ads, or hash navigation
  useEffect(() => {
    getUTMParams();

    const searchParams = new URLSearchParams(window.location.search);
    const hash = window.location.hash.replace('#', '').toLowerCase();
    const pathname = window.location.pathname.toLowerCase();
    const isAd = isAdVisitor();

    if (pathname.includes('/admin') || hash === 'admin' || searchParams.get('page') === 'admin') {
      setActivePage('admin');
      setIsAdminOpen(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (pathname.includes('/account') || hash === 'account' || searchParams.get('page') === 'account') {
      setActivePage('account');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const validPages: PageId[] = ['home' , 'boarding', 'grooming', 'about', 'reviews', 'safety', 'gallery', 'contact', 'pack', 'admin', 'account'];

    const target = (searchParams.get('page') || searchParams.get('landing') || (searchParams.has('ad') ? 'boarding' : '') || hash) as PageId;

    if (target && validPages.includes(target)) {
      setActivePage(target);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (isAd) {
      setActivePage('boarding');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  // Sync hash with active page for shareable URLs
  const navigateTo = (page: string) => {
    if (page === 'admin') {
      setActivePage('admin');
      setIsAdminOpen(true);
      window.history.pushState(null, '', '/admin');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const p = page as PageId;
    setActivePage(p);
    if (p === 'home') {
      window.history.replaceState(null, '', '/' + window.location.search);
    } else {
      window.history.replaceState(null, '', `/${window.location.search}#${p}`);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="relative min-h-screen bg-[#FAF8F5] text-sanctuary-dark flex flex-col overflow-x-hidden pb-14 lg:pb-0">
      {/* 1. CLEAN MINIMAL HEADER */}
      <SanctuaryHeader 
        onNavigate={navigateTo} 
        activeSection={activePage} 
        onOpenBooking={() => setIsCheckoutOpen(true)}
        onOpenAuth={() => navigateTo('account')}
        onOpenAdmin={() => navigateTo('admin')}
      />

      {/* 2. DYNAMIC PAGE ROUTER */}
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          {activePage === 'home' && (
            <div key="home">
              {/* SCREEN 1: HERO & INSTANT PRICE CALCULATOR */}
              <SanctuaryHero 
                onExploreBoarding={() => navigateTo('boarding')} 
                onExploreGrooming={() => navigateTo('grooming')} 
                onOpenBooking={() => setIsCheckoutOpen(true)}
              />

              {/* SCREEN 2: 100% CAGE-FREE AC BOARDING FLOOR */}
              <BoardingSection onOpenBooking={openBookingWithDetails} />

              {/* SCREEN 3: PET GROOMING & SPA PACKAGES */}
              <GroomingSection onOpenBooking={openBookingWithDetails} />

              {/* LIMITED-TIME FLASH OFFERS & VOUCHERS */}
              <OffersAndPosters onOpenBooking={openBookingWithDetails} />

              {/* SCREEN 4: TRUST, STANDARDS & 4.9-STAR GOOGLE REVIEWS */}
              <TrustAndProof />

              {/* SCREEN 5: KANAKAPURA ROAD LOCATION, PET TAXI & FAQ */}
              <LocationAndContact />
            </div>
          )}

          {activePage === 'boarding' && (
            <BoardingPage 
              key="boarding"
              onOpenBooking={openBookingWithDetails} 
              onNavigate={navigateTo} 
            />
          )}

          {activePage === 'grooming' && (
            <ServicesPage 
              key="grooming"
              onOpenBooking={openBookingWithDetails} 
              onNavigate={navigateTo} 
            />
          )}

          {activePage === 'about' && (
            <AboutPage 
              key="about"
              onOpenBooking={openBookingWithDetails} 
              onNavigate={navigateTo} 
            />
          )}

          {activePage === 'reviews' && (
            <ReviewsPage 
              key="reviews"
              onOpenBooking={openBookingWithDetails} 
              onNavigate={navigateTo} 
            />
          )}

          {activePage === 'safety' && (
            <SafetyPage 
              key="safety"
              onOpenBooking={openBookingWithDetails} 
              onNavigate={navigateTo} 
            />
          )}

          {activePage === 'gallery' && (
            <GalleryPage 
              key="gallery"
              onOpenBooking={openBookingWithDetails} 
              onNavigate={navigateTo} 
            />
          )}

          {activePage === 'contact' && (
            <ContactPage 
              key="contact"
              onOpenBooking={openBookingWithDetails} 
              onNavigate={navigateTo} 
            />
          )}

          {activePage === 'pack' && (
            <MeetThePackPage 
              key="pack"
              onOpenBooking={openBookingWithDetails} 
              onNavigate={navigateTo} 
            />
          )}

          {activePage === 'account' && (
            <AccountPage 
              key="account"
              onNavigateHome={() => navigateTo('home')}
              onOpenBooking={() => openBookingWithDetails()}
            />
          )}

          {activePage === 'admin' && (
            <div key="admin" className="min-h-screen py-10 px-4 flex items-center justify-center bg-[#FAF8F5]">
              <AdminDashboardModal isOpen={true} onClose={() => navigateTo('home')} />
            </div>
          )}
        </AnimatePresence>
      </main>

      {/* 3. UNIVERSAL FOOTER ON ALL PAGES */}
      <SanctuaryFooter 
        onNavigate={navigateTo} 
        onOpenTerms={() => setIsTermsOpen(true)}
        onOpenPrivacy={() => setIsPrivacyOpen(true)}
      />

      {/* 4. MOBILE BOTTOM CONVERSION BAR */}
      <SanctuaryMobileBar onOpenBooking={() => openBookingWithDetails()} />

      {/* 5. INTERACTIVE CHECKOUT & COUPON APPLICATION MODAL */}
      <CheckoutModal 
        isOpen={isCheckoutOpen} 
        onClose={() => {
          setIsCheckoutOpen(false);
          setSelectedBooking(undefined);
        }}
        initialBooking={selectedBooking}
      />

      {/* 6. FLASH PROMO POSTER POPUP */}
      <PromoPosterPopup
        isOpen={isPosterOpen}
        onClose={() => setIsPosterOpen(false)}
        onApplyAndBook={() => {
          setIsPosterOpen(false);
          setSelectedBooking({
            type: 'boarding',
            serviceName: 'Cage-Free Boarding Floor',
            basePrice: 625,
            origPrice: 750,
            petType: 'dog',
            petSize: 'small',
            nights: 4,
            appliedCouponCode: 'FREESPA',
          });
          setIsCheckoutOpen(true);
        }}
      />

      {/* 7. CUSTOMER AUTHENTICATION & STAYS MODAL */}
      <CustomerAuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />

      {/* 8. ADMIN MANAGEMENT DASHBOARD MODAL */}
      <AdminDashboardModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
      />

      {/* 9. TERMS OF SERVICE MODAL */}
      <TermsModal
        isOpen={isTermsOpen}
        onClose={() => setIsTermsOpen(false)}
      />

      {/* 10. PRIVACY POLICY MODAL */}
      <PrivacyModal
        isOpen={isPrivacyOpen}
        onClose={() => setIsPrivacyOpen(false)}
      />
    </div>
  );
};

export default App;
