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

export interface AppProps {
  initialPage?: PageId;
}

const App: React.FC<AppProps> = ({ initialPage = 'home' }) => {
  const [activePage, setActivePage] = useState<PageId>(initialPage);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [selectedBooking, setSelectedBooking] = useState<BookingDetails | undefined>(undefined);
  const [isPosterOpen, setIsPosterOpen] = useState<boolean>(false);
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);
  const [isTermsOpen, setIsTermsOpen] = useState<boolean>(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState<boolean>(false);

  // Navigate directly to /checkout route with encoded booking parameters
  const openBookingWithDetails = (details?: BookingDetails) => {
    const params = new URLSearchParams();
    if (details) {
      if (details.type) params.set('service', details.type);
      if (details.nights) params.set('nights', details.nights.toString());
      if (details.serviceName) params.set('package', details.serviceName);
      if (details.basePrice) params.set('price', details.basePrice.toString());
      if (details.appliedCouponCode || details.couponCode) {
        params.set('coupon', details.appliedCouponCode || details.couponCode || '');
      }
      if (details.petType) params.set('petType', details.petType);
      if (details.petSize) params.set('petSize', details.petSize);
      if (details.catType) params.set('catType', details.catType);
      try {
        sessionStorage.setItem('snip_pending_booking', JSON.stringify(details));
      } catch {}
    }
    const q = params.toString();
    window.location.href = q ? `/checkout?${q}` : '/checkout';
  };

  // Global event listener for custom booking triggers and auth navigation
  useEffect(() => {
    const handleCustomBooking = (e: any) => {
      openBookingWithDetails(e.detail);
    };
    const handleOpenAuth = () => {
      window.location.href = '/account';
    };
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

  // Clean path-based routing & attribution tracking
  useEffect(() => {
    getUTMParams();

    const searchParams = new URLSearchParams(window.location.search);
    const pathname = window.location.pathname.toLowerCase().replace(/^\/+/, '');
    const isAd = isAdVisitor();

    if (window.location.pathname.startsWith('/admin')) {
      window.location.href = '/admin';
      return;
    }

    if (window.location.pathname.startsWith('/account')) {
      window.location.href = '/account';
      return;
    }

    if (window.location.pathname.startsWith('/checkout')) {
      window.location.href = '/checkout' + (window.location.search || '');
      return;
    }

    const validPages: PageId[] = ['home', 'boarding', 'grooming', 'about', 'reviews', 'safety', 'gallery', 'contact', 'pack'];

    const target = (pathname || searchParams.get('page') || searchParams.get('landing') || (searchParams.has('ad') ? 'boarding' : '')) as PageId;

    if (target && validPages.includes(target)) {
      setActivePage(target);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (isAd) {
      setActivePage('boarding');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  // Handle browser back/forward buttons cleanly
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.replace(/^\/+/, '').toLowerCase() as PageId;
      const validPages: PageId[] = ['home', 'boarding', 'grooming', 'about', 'reviews', 'safety', 'gallery', 'contact', 'pack'];
      if (!path || path === 'home') {
        setActivePage('home');
      } else if (validPages.includes(path)) {
        setActivePage(path);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Clean Next.js path-based navigation (no hashes)
  const navigateTo = (page: string) => {
    if (page === 'admin') {
      window.location.href = '/admin';
      return;
    }
    if (page === 'account') {
      window.location.href = '/account';
      return;
    }
    if (page === 'checkout') {
      window.location.href = '/checkout';
      return;
    }
    const p = page as PageId;
    setActivePage(p);
    const path = p === 'home' ? '/' : `/${p}`;
    window.history.pushState(null, '', path + (window.location.search || ''));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="relative min-h-screen bg-[#FAF8F5] text-sanctuary-dark flex flex-col overflow-x-hidden pb-14 lg:pb-0">
      {/* 1. CLEAN MINIMAL HEADER */}
      <SanctuaryHeader 
        onNavigate={navigateTo} 
        activeSection={activePage} 
        onOpenBooking={() => openBookingWithDetails()}
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
                onOpenBooking={openBookingWithDetails}
              />

              {/* SCREEN 2: 100% CAGE-FREE BOARDING FLOOR */}
              <BoardingSection onOpenBooking={openBookingWithDetails} />

              {/* SCREEN 3: PET GROOMING & SPA PACKAGES */}
              <GroomingSection onOpenBooking={openBookingWithDetails} />

              {/* LIMITED-TIME FLASH OFFERS & VOUCHERS */}
              <OffersAndPosters onOpenBooking={openBookingWithDetails} />

              {/* SCREEN 4: TRUST, STANDARDS & 4.9-STAR GOOGLE REVIEWS */}
              <TrustAndProof />

              {/* SCREEN 5: KANAKAPURA ROAD LOCATION, PET PICKUP & FAQ */}
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
          openBookingWithDetails({
            type: 'boarding',
            serviceName: 'Cage-Free Boarding Floor',
            basePrice: 625,
            origPrice: 750,
            petType: 'dog',
            petSize: 'small',
            nights: 6,
            appliedCouponCode: 'STAY6FREE1',
          });
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
