import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface BookingDetails {
  type: 'boarding' | 'grooming';
  serviceName: string;
  basePrice: number;
  origPrice?: number;
  petType?: 'dog' | 'cat';
  petSize?: 'small' | 'medium' | 'large';
  catType?: 'neutered' | 'non-neutered';
  nights?: number;
  appliedCouponCode?: string;
  couponCode?: string;
}

export interface CheckoutServiceItem {
  id: string;
  category: 'boarding' | 'grooming';
  name: string;
  subtitle?: string;
  price: number;
  origPrice: number;
  nights?: number;
  isFreePerk?: boolean;
}

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialBooking?: BookingDetails;
  isFullPage?: boolean;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  initialBooking,
  isFullPage = false,
}) => {
  // 1. Authenticated User State (Phone + Password Only)
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [authTab, setAuthTab] = useState<'login' | 'signup'>('login');
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  // Phone + Password inputs
  const [authPhone, setAuthPhone] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');

  // 2. Companion Specifications
  const [petName, setPetName] = useState('');
  const [petType, setPetType] = useState<'dog' | 'cat'>(initialBooking?.petType || 'dog');
  const [petSize, setPetSize] = useState<'small' | 'medium' | 'large'>(initialBooking?.petSize || 'small');
  const [catType, setCatType] = useState<'neutered' | 'non-neutered'>(initialBooking?.catType || 'neutered');
  const [petBreed, setPetBreed] = useState('');
  const [petGender, setPetGender] = useState<'male' | 'female'>('male');
  const [specialInstructions, setSpecialInstructions] = useState('');

  // 3. Multi-Service Cart
  const [selectedServices, setSelectedServices] = useState<CheckoutServiceItem[]>([]);
  const [showAddServiceDropdown, setShowAddServiceDropdown] = useState(false);

  // 4. Studio Visit Timing & Transport
  const [checkInDate, setCheckInDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [preferredTimeSlot, setPreferredTimeSlot] = useState('09:30 AM – 11:30 AM');
  const [includePetTaxi, setIncludePetTaxi] = useState<boolean>(false);

  // Studio Location Constants
  const STUDIO_MAPS_URL = 'https://maps.app.goo.gl/MqFTrZiLPbttv3eD6';
  const STUDIO_ADDRESS = 'Site no 61, Kanakapura Main Road, Beside Shani Mahatma Temple, Bangalore 560082';

  // 6 structured visit time slots
  const TIME_SLOTS = [
    { id: '09:30 AM – 11:30 AM', label: '09:30 AM – 11:30 AM', period: 'Morning Slot 1' },
    { id: '11:30 AM – 01:30 PM', label: '11:30 AM – 01:30 PM', period: 'Morning Slot 2' },
    { id: '01:30 PM – 03:30 PM', label: '01:30 PM – 03:30 PM', period: 'Afternoon Slot 1' },
    { id: '03:30 PM – 05:30 PM', label: '03:30 PM – 05:30 PM', period: 'Afternoon Slot 2' },
    { id: '05:30 PM – 07:00 PM', label: '05:30 PM – 07:00 PM', period: 'Evening Slot 1' },
    { id: '07:00 PM – 08:30 PM', label: '07:00 PM – 08:30 PM', period: 'Evening Slot 2' },
  ];

  // Payment Method: Exclusively Secure Online Checkout via Razorpay
  const [copiedMapsLink, setCopiedMapsLink] = useState(false);

  // Confirm Companion & Size Modal State
  const [confirmModalData, setConfirmModalData] = useState<{
    category: 'boarding' | 'grooming';
    serviceKey: 'boarding' | 'furry-fresh' | 'special' | 'style' | 'full-groom';
    serviceTitle: string;
    existingItemId?: string;
  } | null>(null);
  const [confirmPetType, setConfirmPetType] = useState<'dog' | 'cat'>(petType);
  const [confirmDogSize, setConfirmDogSize] = useState<'small' | 'medium' | 'large'>(petSize);
  const [confirmCatType, setConfirmCatType] = useState<'neutered' | 'non-neutered'>(catType);
  const [confirmNights, setConfirmNights] = useState<number>(4);

  // 5. Individual Quick-Care Add-ons
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);

  // 6. Dynamic Coupons Engine
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discountPercent?: number;
    flatDiscount?: number;
    maxDiscount?: number;
    label: string;
    isFreePerk?: boolean;
  } | null>(null);
  const [couponError, setCouponError] = useState('');
  const [serverOffers, setServerOffers] = useState<any[]>([]);

  // Fetch dynamic active offers from Neon DB
  useEffect(() => {
    if (isOpen) {
      fetch('/api/offers')
        .then((r) => r.json())
        .then((data) => {
          if (data.offers && Array.isArray(data.offers)) {
            setServerOffers(data.offers);
          }
        })
        .catch((err) => console.warn('Could not load dynamic offers', err));
    }
  }, [isOpen]);

  // 7. Payment State
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [paymentNotice, setPaymentNotice] = useState<string>('');
  const [showRazorpaySimModal, setShowRazorpaySimModal] = useState<boolean>(false);
  const [simulatedOrderData, setSimulatedOrderData] = useState<{
    bookingId: string;
    bookingRef: string;
    orderId: string;
    amountPaise: number;
  } | null>(null);
  const [isSimulatingPayment, setIsSimulatingPayment] = useState<boolean>(false);

  // 7b. In-App Browser Detection (WhatsApp / Instagram / WebViews)
  const [isInAppBrowser, setIsInAppBrowser] = useState(false);
  const [copiedSiteLink, setCopiedSiteLink] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const ua = navigator.userAgent || navigator.vendor || (window as any).opera || '';
      const isIAB =
        /FBAN|FBAV|Instagram|WhatsApp|Line|Twitter|MicroMessenger|Snapchat|LinkedIn|Pinterest|GSA/i.test(ua) ||
        /wv|WebView/i.test(ua);
      setIsInAppBrowser(isIAB);
    }
  }, []);

  // 8. Confirmation State
  const [bookingSuccess, setBookingSuccess] = useState<{
    bookingRef: string;
    bookingId: string;
    paymentStatus: string;
    paymentMethod: string;
    servicesCount: number;
    totalAmount: number;
    totalSavings: number;
    date: string;
    pet: string;
    claimedPerk?: string;
  } | null>(null);

  // Free In-Store Grooming Perk choice for orders > ₹500
  const [selectedFreeGroomingPerk, setSelectedFreeGroomingPerk] = useState<'free_bath' | 'free_nail_clip'>('free_bath');

  // Built-in presets for offline / instant availability
  const presetCoupons = [
    {
      code: 'STAY6FREE1',
      label: '6 Days = 1 Day FREE',
      badge: '1 Night FREE • 6+ Nts',
      desc: 'Book 6 days cage-free boarding & get 1 full day complimentary stay',
      category: 'boarding',
      minNights: 6,
    },
    {
      code: 'GROOM500',
      label: 'Free Bath / Nail Clip',
      badge: 'Free Perk • ₹500+ Groom',
      desc: 'Complimentary bath or nail clipping on grooming bills over ₹500',
      category: 'grooming',
      minSpend: 500,
    },
    {
      code: 'FREESPA',
      label: 'Free Spa (4+ Nts)',
      badge: '₹749 Value • 4+ Nts',
      desc: 'Free Furry Fresh Spa Bath (₹749 Value) on 4+ nights boarding',
      category: 'boarding',
      minNights: 4,
    },
    {
      code: 'FREESPA8',
      label: 'Free Spa+ (8+ Nts)',
      badge: '₹999 Value • 8+ Nts',
      desc: 'Free Special Care Spa Package (₹999 Value) on 8+ nights boarding',
      category: 'boarding',
      minNights: 8,
    },
    {
      code: 'FREESPA15',
      label: 'Full Groom (15+ Nts)',
      badge: '₹2,199 Value • 15+ Nts',
      desc: 'Free Full Luxury Grooming (₹2,199 Value) on 15+ nights boarding',
      category: 'boarding',
      minNights: 15,
    },
    {
      code: 'GROOM10',
      label: '10% OFF Grooming',
      badge: 'Orders > ₹999',
      desc: '10% OFF all grooming services when spend exceeds ₹999',
      category: 'grooming',
      minSpend: 1000,
    },
  ];

  // Merge preset coupons with any custom coupons created in admin console
  const availableCoupons = [
    ...presetCoupons,
    ...serverOffers
      .filter((o) => !presetCoupons.some((p) => p.code.toUpperCase() === o.code.toUpperCase()))
      .map((o) => ({
        code: o.code.toUpperCase(),
        label: o.title || o.code,
        badge:
          o.discount_type === 'free_package'
            ? `🎁 Free ${o.free_package_name ? o.free_package_name.split(' ')[0] : 'Gift'}`
            : o.discount_type === 'flat'
            ? `₹${o.discount_amount} OFF`
            : `${o.discount_percent}% OFF${o.max_discount_amount ? ` (Max ₹${o.max_discount_amount})` : ''}`,
        desc: o.description || o.title || `Special discount on ${o.applicable_category} services`,
        category: o.applicable_category || 'all',
        minNights: o.min_nights || 0,
        minSpend: o.min_order_amount || 0,
      })),
  ];

  // Individual Add-ons List
  const addonsList = [
    { id: 'dental', name: 'Teeth Brushing (+₹186)', price: 186, icon: 'dentistry' },
    { id: 'ear-eye', name: 'Ear & Eye Clean (+₹124)', price: 124, icon: 'visibility' },
    { id: 'paw-relax', name: 'Paw Relaxation Balm (+₹124)', price: 124, icon: 'pets' },
    { id: 'med-bath', name: 'Medicated Bath (+₹299)', price: 299, icon: 'medical_services' },
    { id: 'body-massage', name: 'Muscle Massage (+₹499)', price: 499, icon: 'spa' },
    { id: 'dematting', name: 'Pain-Free Dematting (+₹499)', price: 499, icon: 'brush' },
    { id: 'deshedding', name: 'Deep Deshedding (+₹624)', price: 624, icon: 'content_cut' },
  ];

  // Sync user session
  const checkUserSession = () => {
    try {
      const savedUser = localStorage.getItem('snip_user');
      const token = localStorage.getItem('snip_auth_token');
      if (savedUser && token) {
        const u = JSON.parse(savedUser);
        setCurrentUser(u);
        setAuthPhone(u.phone || '');
        setAuthName(u.fullName || '');
      } else {
        setCurrentUser(null);
      }
    } catch {
      setCurrentUser(null);
    }
  };

  useEffect(() => {
    if (isOpen) {
      checkUserSession();
    }
  }, [isOpen]);

  // Initialize service cart when modal opens
  useEffect(() => {
    if (isOpen) {
      let bookingToLoad = initialBooking;

      if (!bookingToLoad && typeof window !== 'undefined') {
        try {
          const stored = sessionStorage.getItem('snip_pending_booking');
          if (stored) {
            bookingToLoad = JSON.parse(stored);
            sessionStorage.removeItem('snip_pending_booking');
          }
        } catch {}

        if (!bookingToLoad && window.location.search) {
          const sp = new URLSearchParams(window.location.search);
          const serviceType = (sp.get('service') as 'boarding' | 'grooming') || (sp.get('type') as 'boarding' | 'grooming') || null;
          const couponParam = (sp.get('coupon') || sp.get('appliedCouponCode') || '').trim();
          const nightsParam = parseInt(sp.get('nights') || (serviceType === 'boarding' ? '4' : '1'), 10);
          const petTypeParam = (sp.get('petType') as 'dog' | 'cat') || 'dog';
          const petSizeParam = (sp.get('petSize') as 'small' | 'medium' | 'large') || 'small';
          const catTypeParam = (sp.get('catType') as 'neutered' | 'non-neutered') || 'neutered';
          const packageParam = sp.get('package') || sp.get('serviceName');
          const priceParam = sp.get('price') ? parseInt(sp.get('price')!, 10) : undefined;

          if (serviceType) {
            bookingToLoad = {
              type: serviceType,
              serviceName: packageParam || (serviceType === 'boarding' ? 'Cage-Free Boarding Floor' : 'Full Grooming Spa Experience'),
              basePrice: priceParam || (serviceType === 'boarding' ? 625 : 750),
              origPrice: (priceParam || (serviceType === 'boarding' ? 625 : 750)) + 125,
              petType: petTypeParam,
              petSize: petSizeParam,
              catType: catTypeParam,
              nights: nightsParam,
              appliedCouponCode: couponParam,
            };
          } else if (couponParam.toUpperCase() === 'STAY6FREE1') {
            bookingToLoad = {
              type: 'boarding',
              serviceName: 'Cage-Free Boarding Floor (6+ Days)',
              basePrice: 625,
              origPrice: 750,
              petType: petTypeParam,
              petSize: petSizeParam,
              nights: 6,
              appliedCouponCode: 'STAY6FREE1',
            };
          } else if (couponParam.toUpperCase() === 'GROOM500') {
            bookingToLoad = {
              type: 'grooming',
              serviceName: 'Full Grooming Spa Experience',
              basePrice: 750,
              origPrice: 900,
              petType: petTypeParam,
              petSize: petSizeParam,
              appliedCouponCode: 'GROOM500',
            };
          }
        }
      }

      if (bookingToLoad) {
        if (bookingToLoad.petType) setPetType(bookingToLoad.petType);
        if (bookingToLoad.petSize) setPetSize(bookingToLoad.petSize);
        if (bookingToLoad.catType) setCatType(bookingToLoad.catType);

        const nightsCount = bookingToLoad.nights || (bookingToLoad.type === 'boarding' ? 4 : 1);
        const calculatedPrice = bookingToLoad.type === 'boarding'
          ? bookingToLoad.basePrice * nightsCount
          : bookingToLoad.basePrice;
        const calculatedOrig = bookingToLoad.type === 'boarding'
          ? (bookingToLoad.origPrice || (bookingToLoad.basePrice + 125)) * nightsCount
          : (bookingToLoad.origPrice || bookingToLoad.basePrice + 150);

        const primaryItem: CheckoutServiceItem = {
          id: `srv_${Date.now()}`,
          category: bookingToLoad.type,
          name: bookingToLoad.serviceName,
          subtitle: bookingToLoad.type === 'boarding' ? `${nightsCount} Nights Stay` : `${(bookingToLoad.petSize || 'small').toUpperCase()} Tier`,
          price: calculatedPrice,
          origPrice: calculatedOrig,
          nights: bookingToLoad.type === 'boarding' ? nightsCount : undefined,
        };

        const initialList: CheckoutServiceItem[] = [primaryItem];
        const requestedCode = (bookingToLoad.appliedCouponCode || bookingToLoad.couponCode || '').trim().toUpperCase();

        if (requestedCode === 'FREESPA' && bookingToLoad.type === 'boarding' && nightsCount >= 4) {
          initialList.push({
            id: 'free_perk_spa_4',
            category: 'grooming',
            name: 'Furry Fresh Hygiene Bath',
            subtitle: '🎁 Complimentary Spa (4+ Nights)',
            price: 0,
            origPrice: 749,
            isFreePerk: true,
          });
          setAppliedCoupon({
            code: 'FREESPA',
            label: 'Free Furry Fresh Spa Bath (₹749 Value)',
            isFreePerk: true,
          });
        } else if (requestedCode === 'FREESPA8' && bookingToLoad.type === 'boarding' && nightsCount >= 8) {
          initialList.push({
            id: 'free_perk_spa_8',
            category: 'grooming',
            name: 'Special Package Care & Conditioning',
            subtitle: '🎁 Complimentary Spa (8+ Nights)',
            price: 0,
            origPrice: 999,
            isFreePerk: true,
          });
          setAppliedCoupon({
            code: 'FREESPA8',
            label: 'Free Special Care Spa (₹999 Value)',
            isFreePerk: true,
          });
        } else if (requestedCode === 'FREESPA15' && bookingToLoad.type === 'boarding' && nightsCount >= 15) {
          initialList.push({
            id: 'free_perk_spa_15',
            category: 'grooming',
            name: 'Full Grooming Ultimate Spa & Breed Trim',
            subtitle: '🎁 Complimentary Luxury Groom (15+ Nights)',
            price: 0,
            origPrice: 2199,
            isFreePerk: true,
          });
          setAppliedCoupon({
            code: 'FREESPA15',
            label: 'Free Luxury Grooming Spa (₹2,199 Value)',
            isFreePerk: true,
          });
        } else if (requestedCode === 'STAY6FREE1' && bookingToLoad.type === 'boarding' && nightsCount >= 6) {
          const oneDayRate = Math.round(calculatedPrice / nightsCount) || 625;
          setAppliedCoupon({
            code: 'STAY6FREE1',
            flatDiscount: oneDayRate,
            label: `1 Day FREE Boarding (-₹${oneDayRate})`,
          });
        } else if (requestedCode === 'GROOM500' && bookingToLoad.type === 'grooming' && calculatedPrice >= 500) {
          setAppliedCoupon({
            code: 'GROOM500',
            label: 'Free In-Store Perk (Bath or Nail Clip)',
            isFreePerk: true,
          });
        } else if (requestedCode === 'GROOM10' && bookingToLoad.type === 'grooming' && calculatedPrice >= 1000) {
          setAppliedCoupon({
            code: 'GROOM10',
            discountPercent: 10,
            label: '10% OFF Grooming (Above ₹999)',
          });
        }

        setSelectedServices(initialList);
      } else if (selectedServices.length === 0) {
        // Default initial package: 4 nights cage-free boarding
        setSelectedServices([
          {
            id: `srv_${Date.now()}`,
            category: 'boarding',
            name: 'Cage-Free Boarding Floor',
            subtitle: '4 Nights Stay',
            price: 2500,
            origPrice: 3000,
            nights: 4,
          },
        ]);
      }
    }
  }, [isOpen, initialBooking]);

  // Auth: Phone + Password Login
  const handlePhoneLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);

    try {
      const cleanPhone = authPhone.replace(/\D/g, '').slice(-10);
      if (cleanPhone.length < 10) {
        throw new Error('Please enter a valid 10-digit mobile number.');
      }

      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: cleanPhone, password: authPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Login failed. Please check phone & password.');
      }

      localStorage.setItem('snip_auth_token', data.token);
      localStorage.setItem('snip_user', JSON.stringify(data.user));
      setCurrentUser(data.user);
      setAuthName(data.user.fullName || '');
      setAuthPhone(data.user.phone || '');
      window.dispatchEvent(new CustomEvent('snip_auth_change'));
    } catch (err: any) {
      setAuthError(err.message);
    } finally {
      setAuthLoading(false);
    }
  };

  // Auth: Phone + Password Signup
  const handlePhoneSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);

    try {
      const cleanPhone = authPhone.replace(/\D/g, '').slice(-10);
      if (cleanPhone.length < 10) {
        throw new Error('Please enter a valid 10-digit mobile number.');
      }
      if (!authName.trim()) {
        throw new Error('Please enter your full name.');
      }

      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: authName.trim(),
          phone: cleanPhone,
          password: authPassword,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Registration failed.');
      }

      localStorage.setItem('snip_auth_token', data.token);
      localStorage.setItem('snip_user', JSON.stringify(data.user));
      setCurrentUser(data.user);
      setAuthName(data.user.fullName || '');
      setAuthPhone(data.user.phone || '');
      window.dispatchEvent(new CustomEvent('snip_auth_change'));
    } catch (err: any) {
      setAuthError(err.message);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('snip_auth_token');
    localStorage.removeItem('snip_user');
    setCurrentUser(null);
    window.dispatchEvent(new CustomEvent('snip_auth_change'));
  };

  // Pricing lookup matrix based on companion species, weight tier, and nights
  const getServicePriceForPet = (
    serviceKey: 'boarding' | 'furry-fresh' | 'special' | 'style' | 'full-groom' | string,
    category: 'boarding' | 'grooming',
    pType: 'dog' | 'cat',
    dSize: 'small' | 'medium' | 'large',
    cType: 'neutered' | 'non-neutered',
    nightsCount: number = 1
  ) => {
    if (category === 'boarding' || serviceKey === 'boarding') {
      if (pType === 'cat') {
        const perNight = cType === 'neutered' ? 625 : 750;
        const origPerNight = cType === 'neutered' ? 750 : 899;
        return {
          name: 'Cage-Free Boarding Floor',
          subtitle: `${nightsCount} Night${nightsCount > 1 ? 's' : ''} Stay (${cType === 'neutered' ? 'Neutered' : 'Non-Neutered'} Cat)`,
          price: perNight * nightsCount,
          origPrice: origPerNight * nightsCount,
          perNight,
          origPerNight,
        };
      } else {
        const perNight = dSize === 'small' ? 625 : dSize === 'medium' ? 750 : 875;
        const origPerNight = dSize === 'small' ? 750 : dSize === 'medium' ? 899 : 1050;
        return {
          name: 'Cage-Free Boarding Floor',
          subtitle: `${nightsCount} Night${nightsCount > 1 ? 's' : ''} Stay (${dSize.toUpperCase()} Dog)`,
          price: perNight * nightsCount,
          origPrice: origPerNight * nightsCount,
          perNight,
          origPerNight,
        };
      }
    }

    if (serviceKey === 'furry-fresh') {
      if (pType === 'cat') {
        return {
          name: 'Furry Fresh Hygiene Bath',
          subtitle: 'Cat Hygiene Refresh',
          price: 749,
          origPrice: 999,
          perNight: 749,
          origPerNight: 999,
        };
      }
      const prices = { small: 499, medium: 699, large: 849 };
      const origs = { small: 649, medium: 899, large: 1099 };
      return {
        name: 'Furry Fresh Hygiene Bath',
        subtitle: `${dSize.toUpperCase()} Dog Hygiene Refresh`,
        price: prices[dSize],
        origPrice: origs[dSize],
        perNight: prices[dSize],
        origPerNight: origs[dSize],
      };
    }

    if (serviceKey === 'special') {
      if (pType === 'cat') {
        return {
          name: 'Special Care & Spa Package',
          subtitle: 'Cat Oral & Paws Refresh',
          price: 874,
          origPrice: 1199,
          perNight: 874,
          origPerNight: 1199,
        };
      }
      const prices = { small: 899, medium: 949, large: 999 };
      const origs = { small: 1124, medium: 1199, large: 1249 };
      return {
        name: 'Special Care & Spa Package',
        subtitle: `${dSize.toUpperCase()} Dog Special Package`,
        price: prices[dSize],
        origPrice: origs[dSize],
        perNight: prices[dSize],
        origPerNight: origs[dSize],
      };
    }

    if (serviceKey === 'style') {
      const price = pType === 'cat' ? 1799 : dSize === 'small' ? 1799 : dSize === 'medium' ? 2199 : 2599;
      const origPrice = pType === 'cat' ? 2249 : dSize === 'small' ? 2249 : dSize === 'medium' ? 2749 : 3249;
      return {
        name: 'Style Your Pet Breed Trim',
        subtitle: `${pType === 'cat' ? 'Cat' : `${dSize.toUpperCase()} Dog`} Full Breed Styling`,
        price,
        origPrice,
        perNight: price,
        origPerNight: origPrice,
      };
    }

    // Default: full-grooming
    const price = pType === 'cat' ? 2199 : dSize === 'small' ? 2199 : dSize === 'medium' ? 2599 : 2999;
    const origPrice = pType === 'cat' ? 3249 : dSize === 'small' ? 3249 : dSize === 'medium' ? 3749 : 4249;
    return {
      name: 'Full Grooming Ultimate Spa',
      subtitle: `${pType === 'cat' ? 'Cat' : `${dSize.toUpperCase()} Dog`} Full Grooming Spa`,
      price,
      origPrice,
      perNight: price,
      origPerNight: origPrice,
    };
  };

  // Open confirmation modal whenever user adds or configures a service
  const openAddServiceConfirmation = (
    category: 'boarding' | 'grooming',
    serviceKey: 'boarding' | 'furry-fresh' | 'special' | 'style' | 'full-groom',
    serviceTitle: string,
    defaultNights: number = 4,
    existingItemId?: string
  ) => {
    setConfirmModalData({ category, serviceKey, serviceTitle, existingItemId });
    setConfirmPetType(petType);
    setConfirmDogSize(petSize);
    setConfirmCatType(catType);
    setConfirmNights(defaultNights);
    setShowAddServiceDropdown(false);
  };

  // Confirm size and add/update service in cart
  const handleConfirmAndAddService = () => {
    if (!confirmModalData) return;

    // Update global pet specifications
    setPetType(confirmPetType);
    setPetSize(confirmDogSize);
    setCatType(confirmCatType);

    const serviceInfo = getServicePriceForPet(
      confirmModalData.serviceKey,
      confirmModalData.category,
      confirmPetType,
      confirmDogSize,
      confirmCatType,
      confirmNights
    );

    if (confirmModalData.existingItemId) {
      // Update existing item
      setSelectedServices((prev) =>
        prev.map((item) => {
          if (item.id === confirmModalData.existingItemId) {
            return {
              ...item,
              name: serviceInfo.name,
              subtitle: serviceInfo.subtitle,
              price: serviceInfo.price,
              origPrice: serviceInfo.origPrice,
              nights: confirmModalData.category === 'boarding' ? confirmNights : undefined,
            };
          }
          return item;
        })
      );
    } else {
      // Add new item
      const newItem: CheckoutServiceItem = {
        id: `srv_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        category: confirmModalData.category,
        name: serviceInfo.name,
        subtitle: serviceInfo.subtitle,
        price: serviceInfo.price,
        origPrice: serviceInfo.origPrice,
        nights: confirmModalData.category === 'boarding' ? confirmNights : undefined,
      };
      setSelectedServices((prev) => [...prev, newItem]);
    }

    setConfirmModalData(null);

    // Auto-update STAY6FREE1 coupon if active
    if (confirmModalData.category === 'boarding' && confirmNights >= 6 && appliedCoupon?.code === 'STAY6FREE1') {
      const unitRate = Math.round(serviceInfo.price / confirmNights);
      setAppliedCoupon({
        code: 'STAY6FREE1',
        flatDiscount: unitRate,
        label: `1 Day FREE Boarding (-₹${unitRate})`,
      });
    }
  };

  // Allow editing number of nights directly on boarding services in the cart
  const handleUpdateNights = (itemId: string, newNights: number) => {
    if (newNights < 1 || newNights > 60) return;

    setSelectedServices((prev) => {
      const updated = prev.map((item) => {
        if (item.id === itemId && item.category === 'boarding') {
          const currentNights = item.nights || 1;
          const unitPrice = Math.round(item.price / currentNights);
          const unitOrig = Math.round(item.origPrice / currentNights);
          return {
            ...item,
            nights: newNights,
            price: unitPrice * newNights,
            origPrice: unitOrig * newNights,
            subtitle: `${newNights} Nights Stay (${petType === 'cat' ? `${catType === 'neutered' ? 'Neutered' : 'Non-Neutered'} Cat` : `${petSize.toUpperCase()} Dog`})`,
          };
        }
        return item;
      });

      // Recalculate STAY6FREE1 coupon
      const totalBoardingNights = updated
        .filter((s) => s.category === 'boarding')
        .reduce((sum, s) => sum + (s.nights || 1), 0);

      if (appliedCoupon?.code === 'STAY6FREE1') {
        if (totalBoardingNights >= 6) {
          const boardingItem = updated.find((s) => s.category === 'boarding');
          const unitRate = boardingItem ? Math.round(boardingItem.price / (boardingItem.nights || 1)) : 625;
          setAppliedCoupon({
            code: 'STAY6FREE1',
            flatDiscount: unitRate,
            label: `1 Day FREE Boarding (-₹${unitRate})`,
          });
          setCouponError('');
        } else {
          setAppliedCoupon(null);
          setCouponError(`Code STAY6FREE1 requires 6 or more boarding nights (Current: ${totalBoardingNights}).`);
        }
      }

      return updated;
    });
  };

  // Sync existing cart items if user changes companion size in companion details
  const handleChangeDogSize = (newSize: 'small' | 'medium' | 'large') => {
    setPetSize(newSize);
    setSelectedServices((prev) =>
      prev.map((item) => {
        if (item.isFreePerk) return item;
        if (item.category === 'boarding') {
          const nightsCount = item.nights || 4;
          const perNight = newSize === 'small' ? 625 : newSize === 'medium' ? 750 : 875;
          const origPerNight = newSize === 'small' ? 750 : newSize === 'medium' ? 899 : 1050;
          return {
            ...item,
            price: perNight * nightsCount,
            origPrice: origPerNight * nightsCount,
            subtitle: `${nightsCount} Nights Stay (${newSize.toUpperCase()} Dog)`,
          };
        }
        if (item.category === 'grooming') {
          let key = 'furry-fresh';
          if (item.name.toLowerCase().includes('special')) key = 'special';
          else if (item.name.toLowerCase().includes('style')) key = 'style';
          else if (item.name.toLowerCase().includes('ultimate') || item.name.toLowerCase().includes('full')) key = 'full-groom';
          const info = getServicePriceForPet(key, 'grooming', 'dog', newSize, catType, 1);
          return {
            ...item,
            price: info.price,
            origPrice: info.origPrice,
            subtitle: info.subtitle,
          };
        }
        return item;
      })
    );
  };

  const handleChangeCatType = (newCatType: 'neutered' | 'non-neutered') => {
    setCatType(newCatType);
    setSelectedServices((prev) =>
      prev.map((item) => {
        if (item.isFreePerk) return item;
        if (item.category === 'boarding') {
          const nightsCount = item.nights || 4;
          const perNight = newCatType === 'neutered' ? 625 : 750;
          const origPerNight = newCatType === 'neutered' ? 750 : 899;
          return {
            ...item,
            price: perNight * nightsCount,
            origPrice: origPerNight * nightsCount,
            subtitle: `${nightsCount} Nights Stay (${newCatType === 'neutered' ? 'Neutered' : 'Non-Neutered'} Cat)`,
          };
        }
        return item;
      })
    );
  };

  const handleChangePetType = (newPetType: 'dog' | 'cat') => {
    setPetType(newPetType);
    setSelectedServices((prev) =>
      prev.map((item) => {
        if (item.isFreePerk) return item;
        let key = 'furry-fresh';
        if (item.category === 'boarding') key = 'boarding';
        else if (item.name.toLowerCase().includes('special')) key = 'special';
        else if (item.name.toLowerCase().includes('style')) key = 'style';
        else if (item.name.toLowerCase().includes('ultimate') || item.name.toLowerCase().includes('full')) key = 'full-groom';
        const info = getServicePriceForPet(key, item.category, newPetType, petSize, catType, item.nights || 4);
        return {
          ...item,
          price: info.price,
          origPrice: info.origPrice,
          subtitle: info.subtitle,
        };
      })
    );
  };

  const calculateCheckoutDate = (dateStr: string, nightsCount: number) => {
    try {
      const d = new Date(dateStr);
      d.setDate(d.getDate() + nightsCount);
      return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    } catch {
      return '';
    }
  };

  // Fallback add service directly (now routes to confirmation)
  const handleAddService = (category: 'boarding' | 'grooming', name: string, price: number, origPrice: number, subtitle?: string, nightsCount?: number) => {
    let key: any = 'furry-fresh';
    if (category === 'boarding') key = 'boarding';
    else if (name.toLowerCase().includes('special')) key = 'special';
    else if (name.toLowerCase().includes('style')) key = 'style';
    else if (name.toLowerCase().includes('ultimate') || name.toLowerCase().includes('full')) key = 'full-groom';
    openAddServiceConfirmation(category, key, name, nightsCount || 4);
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setSelectedServices((prev) => prev.filter((s) => !s.isFreePerk));
    setCouponError('');
  };

  const handleRemoveService = (id: string) => {
    const itemToRemove = selectedServices.find((s) => s.id === id);
    if (!itemToRemove) return;

    if (itemToRemove.isFreePerk) {
      setSelectedServices((prev) => prev.filter((s) => s.id !== id));
      setAppliedCoupon(null);
      return;
    }

    const remaining = selectedServices.filter((s) => s.id !== id);
    const remainingPaid = remaining.filter((s) => !s.isFreePerk);

    // If no paid services remain, reset cart and coupons completely
    if (remainingPaid.length === 0) {
      setSelectedServices([]);
      setAppliedCoupon(null);
      setCouponError('');
      return;
    }

    setSelectedServices(remaining);

    // Validate if remaining services still fulfill active coupon
    if (appliedCoupon) {
      if (['FREESPA', 'FREESPA8', 'FREESPA15'].includes(appliedCoupon.code)) {
        const remainingBoarding = remaining.filter((s) => s.category === 'boarding');
        const totalNights = remainingBoarding.reduce((sum, s) => sum + (s.nights || 1), 0);
        const reqNights = appliedCoupon.code === 'FREESPA15' ? 15 : appliedCoupon.code === 'FREESPA8' ? 8 : 4;
        if (remainingBoarding.length === 0 || totalNights < reqNights) {
          setSelectedServices(remaining.filter((s) => !s.isFreePerk));
          setAppliedCoupon(null);
        }
      } else if (appliedCoupon.code === 'STAY6FREE1') {
        const remainingBoarding = remaining.filter((s) => s.category === 'boarding');
        const totalNights = remainingBoarding.reduce((sum, s) => sum + (s.nights || 1), 0);
        if (remainingBoarding.length === 0 || totalNights < 6) {
          setAppliedCoupon(null);
        } else {
          const primary = remainingBoarding[0];
          const oneDayRate = Math.round(primary.price / (primary.nights || 1)) || 625;
          setAppliedCoupon({
            code: 'STAY6FREE1',
            flatDiscount: oneDayRate,
            label: `1 Day FREE Boarding (-₹${oneDayRate})`,
          });
        }
      } else if (appliedCoupon.code === 'GROOM500') {
        const groomingSubtotal = remaining
          .filter((s) => s.category === 'grooming' && !s.isFreePerk)
          .reduce((sum, s) => sum + s.price, 0);
        if (groomingSubtotal < 500) {
          setAppliedCoupon(null);
        }
      } else if (appliedCoupon.code === 'GROOM10') {
        const groomingSubtotal = remaining
          .filter((s) => s.category === 'grooming' && !s.isFreePerk)
          .reduce((sum, s) => sum + s.price, 0);
        if (groomingSubtotal < 1000) {
          setAppliedCoupon(null);
        }
      }
    }
  };

  // Addon toggle
  const toggleAddon = (id: string) => {
    setSelectedAddons((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Apply Coupon (Dynamic + Presets)
  const applyCouponCode = (codeToApply: string) => {
    setCouponError('');
    const code = codeToApply.trim().toUpperCase();

    if (!code) {
      setCouponError('Please enter a coupon code.');
      return;
    }

    // 1. Check server offers first
    const dynamicOffer = serverOffers.find((o) => (o.code || '').toUpperCase() === code);
    if (dynamicOffer) {
      // Check category requirements
      const category = dynamicOffer.applicable_category || 'all';
      const boardingServices = selectedServices.filter((s) => s.category === 'boarding');
      const groomingServices = selectedServices.filter((s) => s.category === 'grooming' && !s.isFreePerk);

      if (category === 'boarding' && boardingServices.length === 0) {
        setCouponError(`Code ${code} requires cage-free boarding in your cart.`);
        return;
      }
      if (category === 'grooming' && groomingServices.length === 0) {
        setCouponError(`Code ${code} requires at least one grooming package in your cart.`);
        return;
      }

      // Check min nights
      const minNights = dynamicOffer.min_nights || 0;
      const totalNights = boardingServices.reduce((sum, s) => sum + (s.nights || 1), 0);
      if (minNights > 0 && totalNights < minNights) {
        setCouponError(`Code ${code} requires ${minNights} or more boarding nights (Current: ${totalNights} night${totalNights === 1 ? '' : 's'}).`);
        return;
      }

      // Check min spend
      const minOrder = Number(dynamicOffer.min_order_amount || 0);
      if (minOrder > 0) {
        const qualifyingAmount = category === 'grooming'
          ? groomingServices.reduce((sum, s) => sum + s.price, 0)
          : selectedServices.filter((s) => !s.isFreePerk).reduce((sum, s) => sum + s.price, 0);

        if (qualifyingAmount < minOrder) {
          setCouponError(`Code ${code} requires minimum spend of ₹${minOrder} on ${category === 'grooming' ? 'grooming' : 'services'} (Current: ₹${qualifyingAmount}).`);
          return;
        }
      }

      // Apply based on discount_type
      const dType = dynamicOffer.discount_type || 'percentage';
      if (dType === 'free_package') {
        const filtered = selectedServices.filter((s) => !s.isFreePerk);
        const freePkgItem: CheckoutServiceItem = {
          id: `free_perk_${dynamicOffer.id || Date.now()}`,
          category: 'grooming',
          name: dynamicOffer.free_package_name || 'Complimentary Special Gift',
          subtitle: `🎁 Free Package (${code})`,
          price: 0,
          origPrice: Number(dynamicOffer.free_package_value || 749),
          isFreePerk: true,
        };
        setSelectedServices([...filtered, freePkgItem]);
        setAppliedCoupon({
          code: code,
          label: dynamicOffer.title || `Free ${dynamicOffer.free_package_name || 'Gift Package'}`,
          isFreePerk: true,
        });
        setCouponInput('');
        return;
      }

      if (dType === 'flat') {
        setSelectedServices((prev) => prev.filter((s) => !s.isFreePerk));
        setAppliedCoupon({
          code: code,
          flatDiscount: Number(dynamicOffer.discount_amount || 0),
          label: dynamicOffer.title || `₹${dynamicOffer.discount_amount} Flat OFF`,
        });
        setCouponInput('');
        return;
      }

      if (dType === 'percentage') {
        setSelectedServices((prev) => prev.filter((s) => !s.isFreePerk));
        setAppliedCoupon({
          code: code,
          discountPercent: Number(dynamicOffer.discount_percent || 0),
          maxDiscount: dynamicOffer.max_discount_amount ? Number(dynamicOffer.max_discount_amount) : undefined,
          label: dynamicOffer.title || `${dynamicOffer.discount_percent}% OFF${dynamicOffer.max_discount_amount ? ` (Max ₹${dynamicOffer.max_discount_amount})` : ''}`,
        });
        setCouponInput('');
        return;
      }
    }

    // 2. Presets Fallback (FREESPA, FREESPA8, FREESPA15, GROOM10)
    if (code === 'FREESPA' || code === 'FREESPA8' || code === 'FREESPA15') {
      const boardingServices = selectedServices.filter((s) => s.category === 'boarding');
      if (boardingServices.length === 0) {
        setCouponError(`Code ${code} requires a cage-free boarding booking in your cart.`);
        return;
      }

      const totalNights = boardingServices.reduce((sum, s) => sum + (s.nights || 1), 0);

      if (code === 'FREESPA') {
        if (totalNights < 4) {
          setCouponError(`Code FREESPA requires 4 or more boarding nights (Current: ${totalNights} night${totalNights === 1 ? '' : 's'}).`);
          return;
        }
        const filtered = selectedServices.filter((s) => !s.isFreePerk);
        const freeSpaItem: CheckoutServiceItem = {
          id: 'free_perk_spa_4',
          category: 'grooming',
          name: 'Furry Fresh Hygiene Bath',
          subtitle: '🎁 Complimentary Spa (4+ Nights)',
          price: 0,
          origPrice: 749,
          isFreePerk: true,
        };
        setSelectedServices([...filtered, freeSpaItem]);
        setAppliedCoupon({
          code: 'FREESPA',
          label: 'Free Furry Fresh Spa Bath (₹749 Value)',
          isFreePerk: true,
        });
        setCouponInput('');
        return;
      }

      if (code === 'FREESPA8') {
        if (totalNights < 8) {
          setCouponError(`Code FREESPA8 requires 8 or more boarding nights (Current: ${totalNights} night${totalNights === 1 ? '' : 's'}).`);
          return;
        }
        const filtered = selectedServices.filter((s) => !s.isFreePerk);
        const freeSpaItem: CheckoutServiceItem = {
          id: 'free_perk_spa_8',
          category: 'grooming',
          name: 'Special Package Care & Conditioning',
          subtitle: '🎁 Complimentary Spa (8+ Nights)',
          price: 0,
          origPrice: 999,
          isFreePerk: true,
        };
        setSelectedServices([...filtered, freeSpaItem]);
        setAppliedCoupon({
          code: 'FREESPA8',
          label: 'Free Special Care Spa (₹999 Value)',
          isFreePerk: true,
        });
        setCouponInput('');
        return;
      }

      if (code === 'FREESPA15') {
        if (totalNights < 15) {
          setCouponError(`Code FREESPA15 requires 15 or more boarding nights (Current: ${totalNights} night${totalNights === 1 ? '' : 's'}).`);
          return;
        }
        const filtered = selectedServices.filter((s) => !s.isFreePerk);
        const freeSpaItem: CheckoutServiceItem = {
          id: 'free_perk_spa_15',
          category: 'grooming',
          name: 'Full Grooming Ultimate Spa & Breed Trim',
          subtitle: '🎁 Complimentary Luxury Groom (15+ Nights)',
          price: 0,
          origPrice: 2199,
          isFreePerk: true,
        };
        setSelectedServices([...filtered, freeSpaItem]);
        setAppliedCoupon({
          code: 'FREESPA15',
          label: 'Free Luxury Grooming Spa (₹2,199 Value)',
          isFreePerk: true,
        });
        setCouponInput('');
        return;
      }
    }

    if (code === 'STAY6FREE1') {
      const boardingServices = selectedServices.filter((s) => s.category === 'boarding');
      if (boardingServices.length === 0) {
        setCouponError('Code STAY6FREE1 requires cage-free boarding in your cart.');
        return;
      }

      const totalNights = boardingServices.reduce((sum, s) => sum + (s.nights || 1), 0);
      if (totalNights < 6) {
        setCouponError(`Code STAY6FREE1 requires 6 or more boarding nights (Current: ${totalNights} night${totalNights === 1 ? '' : 's'}).`);
        return;
      }

      const primary = boardingServices[0];
      const oneDayRate = Math.round(primary.price / (primary.nights || 1)) || 625;
      setSelectedServices((prev) => prev.filter((s) => !s.isFreePerk));
      setAppliedCoupon({
        code: 'STAY6FREE1',
        flatDiscount: oneDayRate,
        label: `1 Day FREE Boarding (-₹${oneDayRate})`,
      });
      setCouponInput('');
      return;
    }

    if (code === 'GROOM500') {
      const groomingServices = selectedServices.filter((s) => s.category === 'grooming' && !s.isFreePerk);
      const groomingSubtotal = groomingServices.reduce((sum, s) => sum + s.price, 0);

      if (groomingServices.length === 0) {
        setCouponError('Code GROOM500 requires at least one grooming package in your cart.');
        return;
      }

      if (groomingSubtotal < 500) {
        setCouponError(`Code GROOM500 requires grooming services total above ₹500 (Current: ₹${groomingSubtotal}). Add another grooming service to qualify!`);
        return;
      }

      setSelectedServices((prev) => prev.filter((s) => !s.isFreePerk));
      setAppliedCoupon({
        code: 'GROOM500',
        label: 'Free In-Store Perk (Bath or Nail Clip)',
        isFreePerk: true,
      });
      setCouponInput('');
      return;
    }

    if (code === 'GROOM10') {
      const groomingServices = selectedServices.filter((s) => s.category === 'grooming' && !s.isFreePerk);
      const groomingSubtotal = groomingServices.reduce((sum, s) => sum + s.price, 0);

      if (groomingServices.length === 0) {
        setCouponError('Code GROOM10 requires at least one grooming package in your cart.');
        return;
      }

      if (groomingSubtotal < 1000) {
        setCouponError(`Code GROOM10 requires grooming services total above ₹999 (Current: ₹${groomingSubtotal}). Add another grooming service to qualify!`);
        return;
      }

      setSelectedServices((prev) => prev.filter((s) => !s.isFreePerk));
      setAppliedCoupon({
        code: 'GROOM10',
        discountPercent: 10,
        label: '10% OFF Grooming (Above ₹999)',
      });
      setCouponInput('');
      return;
    }

    setCouponError('Invalid coupon code. Please verify the code and try again.');
  };

  // Financial Calculations
  const servicesBaseTotal = selectedServices.reduce((sum, s) => sum + s.price, 0);
  const servicesOrigTotal = selectedServices.reduce((sum, s) => sum + s.origPrice, 0);
  const addonsTotal = selectedAddons.reduce((sum, id) => {
    const item = addonsList.find((a) => a.id === id);
    return sum + (item ? item.price : 0);
  }, 0);
  const taxiTotal = includePetTaxi ? 299 : 0;
  const subtotal = servicesBaseTotal + addonsTotal + taxiTotal;
  const grossOriginalTotal = servicesOrigTotal + addonsTotal + taxiTotal;

  // Grooming subtotal & qualified perk (spend > ₹500 on grooming)
  const groomingServices = selectedServices.filter((s) => s.category === 'grooming' && !s.isFreePerk);
  const groomingSubtotal = groomingServices.reduce((sum, s) => sum + s.price, 0);
  const qualifiesForGroomingReward = groomingSubtotal >= 500 || appliedCoupon?.code === 'GROOM500';
  const claimedPerkTitle = qualifiesForGroomingReward
    ? selectedFreeGroomingPerk === 'free_bath'
      ? 'Free Furry Fresh Bath (₹499 Value)'
      : 'Free Precision Nail Clipping & Filing (₹249 Value)'
    : undefined;

  // Coupon discount calculation
  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.code === 'GROOM10') {
      if (groomingSubtotal >= 1000) {
        discountAmount = Math.round(groomingSubtotal * 0.10);
      }
    } else if (appliedCoupon.discountPercent) {
      let raw = Math.round((subtotal * appliedCoupon.discountPercent) / 100);
      if (appliedCoupon.maxDiscount && appliedCoupon.maxDiscount > 0) {
        raw = Math.min(raw, appliedCoupon.maxDiscount);
      }
      discountAmount = raw;
    } else if (appliedCoupon.flatDiscount) {
      discountAmount = Math.min(subtotal, appliedCoupon.flatDiscount);
    }
  }

  const finalTotal = Math.max(0, subtotal - discountAmount);
  const totalSavings = Math.max(0, (grossOriginalTotal - subtotal) + discountAmount);

  // Submit Booking
  // Submit Booking via Razorpay Standard Online Checkout
  const handleConfirmOrder = async () => {
    if (!currentUser) {
      alert('Please sign in or register with your phone number to complete order.');
      return;
    }
    if (!petName.trim()) {
      alert('Please enter your companion’s name.');
      return;
    }

    const paidServices = selectedServices.filter((s) => !s.isFreePerk);
    if (paidServices.length === 0) {
      alert('Please add at least one service to your checkout before proceeding to payment.');
      return;
    }

    if (finalTotal < 1) {
      alert('The total amount must be at least ₹1 to initiate payment.');
      return;
    }

    setPaymentNotice('');
    setIsProcessing(true);

    try {
      const primaryService = paidServices[0] || selectedServices[0];
      const serviceNamesSummary = selectedServices.map((s) => s.name).join(' + ');

      // Prepare comprehensive booking payload (ONLY committed to database upon verified payment!)
      const bookingPayload = {
        parentName: currentUser?.fullName || authName || 'Pet Parent',
        phone: currentUser?.phone || authPhone || '',
        email: currentUser?.email || (currentUser?.phone || authPhone ? `${(currentUser?.phone || authPhone).replace(/\D/g, '')}@snipandstyle.pet` : ''),
        petName: petName.trim(),
        petBreed: petBreed.trim() || (petType === 'cat' ? 'Feline' : `${petSize.toUpperCase()} Dog`),
        petWeightKg: petType === 'cat' ? 4.5 : petSize === 'small' ? 7.5 : petSize === 'medium' ? 18.0 : 32.0,
        serviceType: serviceNamesSummary + (claimedPerkTitle ? ` + 🎁 [CLAIM IN-STORE: ${claimedPerkTitle}]` : ''),
        services_json: [
          ...selectedServices,
          ...(claimedPerkTitle
            ? [{
                id: 'instore_perk_claimed',
                category: 'grooming',
                name: claimedPerkTitle,
                subtitle: '🎁 Free In-Store Perk (Bill > ₹500)',
                price: 0,
                origPrice: selectedFreeGroomingPerk === 'free_bath' ? 499 : 249,
                isFreePerk: true,
                claimInStore: true,
              }]
            : []),
        ],
        checkInDate: checkInDate,
        checkOutDate: checkInDate,
        dropOffTime: preferredTimeSlot,
        numberOfDays: primaryService.nights || 1,
        baseAmount: servicesBaseTotal,
        addonsAmount: addonsTotal + taxiTotal,
        discountAmount: discountAmount,
        totalAmount: finalTotal,
        isHighwayEarlyDropoff: true,
        appliedOfferCode: appliedCoupon?.code || (qualifiesForGroomingReward ? 'GROOM500' : null),
        specialInstructions: `${petGender.toUpperCase()} • Special notes: ${specialInstructions || 'None'}${claimedPerkTitle ? ` • 🎁 In-Store Free Perk: ${claimedPerkTitle} (Show booking at studio to claim)` : ''}`,
      };

      // Online Razorpay Payment Flow (100% Secure & Verified)
      // Step 1: Call Backend to Create Razorpay Order (NO booking is recorded in DB yet!)
      const rzpRes = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: finalTotal * 100, // in paise
          currency: 'INR',
          receipt: `rcpt_${Date.now()}`,
          notes: {
            petName: bookingPayload.petName,
            customerPhone: bookingPayload.phone,
            services: serviceNamesSummary.slice(0, 80),
          },
        }),
      });

      const rzpOrder = await rzpRes.json();
      if (!rzpRes.ok) {
        throw new Error(rzpOrder.error || 'Failed to initialize payment gateway.');
      }

      const rzpKeyId = rzpOrder.key_id || (import.meta as any).env?.VITE_RAZORPAY_KEY_ID || 'rzp_live_TjVYMuSit6eIYP';

      // Ensure Razorpay SDK is loaded on page with retry and clean script handling
      if (typeof (window as any).Razorpay === 'undefined') {
        const loaded = await new Promise<boolean>((resolve) => {
          let attempts = 0;
          const interval = setInterval(() => {
            attempts++;
            if (typeof (window as any).Razorpay !== 'undefined') {
              clearInterval(interval);
              resolve(true);
            } else if (attempts >= 25) {
              clearInterval(interval);
              resolve(false);
            }
          }, 100);
        });

        if (!loaded && typeof (window as any).Razorpay === 'undefined') {
          await new Promise<void>((resolve, reject) => {
            const existingScript = document.querySelector('script[src*="checkout.razorpay.com"]');
            if (existingScript) existingScript.remove();
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.async = true;
            script.onload = () => resolve();
            script.onerror = () =>
              reject(new Error('Failed to load Razorpay payment gateway. Please check your internet connection or ad-blocker.'));
            document.head.appendChild(script);
          });
        }
      }

      // Close previous instance if open
      if ((window as any)._activeRzpCheckout) {
        try {
          (window as any)._activeRzpCheckout.close();
        } catch {}
      }

      // Step 2: Open Razorpay Standard Web Checkout Modal
      const cleanContact = (bookingPayload.phone || '').replace(/\D/g, '').slice(-10);
      const rzpOptions: any = {
        key: rzpKeyId,
        amount: rzpOrder.amount,
        currency: rzpOrder.currency || 'INR',
        name: 'Snip & Style',
        description: `${serviceNamesSummary}`,
        image: '/images/logo.png',
        order_id: rzpOrder.order_id || rzpOrder.id,
        handler: async function (response: any) {
          try {
            setIsProcessing(true);
            setPaymentNotice('Verifying payment signature with Razorpay...');

            const token = localStorage.getItem('snip_auth_token');
            const authHeaders: any = { 'Content-Type': 'application/json' };
            if (token) authHeaders.Authorization = `Bearer ${token}`;

            // Step 3: Send order_id, payment_id, signature AND bookingPayload to backend
            // The booking is ONLY created in the database upon successful HMAC verification!
            const verifyRes = await fetch('/api/verify-payment', {
              method: 'POST',
              headers: authHeaders,
              body: JSON.stringify({
                order_id: response.razorpay_order_id,
                payment_id: response.razorpay_payment_id,
                signature: response.razorpay_signature,
                bookingPayload,
              }),
            });

            const verifyData = await verifyRes.json();
            if (!verifyRes.ok || !verifyData.success) {
              throw new Error(verifyData.error || 'Payment signature verification failed.');
            }

            // Display confirmed booking success screen
            setBookingSuccess({
              bookingRef: verifyData.bookingRef || 'SNS-CONFIRMED',
              bookingId: verifyData.bookingId || '',
              paymentStatus: 'Paid & Confirmed (Razorpay Verified)',
              paymentMethod: `Razorpay Online Gateway (${response.razorpay_payment_id})`,
              servicesCount: selectedServices.length,
              totalAmount: finalTotal,
              totalSavings,
              date: `${checkInDate} (${preferredTimeSlot})`,
              pet: `${petName.trim()}`,
              claimedPerk: claimedPerkTitle,
            });
          } catch (verErr: any) {
            console.error('[Razorpay Verify Error]', verErr);
            alert('Payment Verification Error: ' + verErr.message);
          } finally {
            setIsProcessing(false);
          }
        },
        prefill: {
          name: bookingPayload.parentName,
          contact: cleanContact || undefined,
          email: bookingPayload.email || undefined,
        },
        notes: {
          petName: bookingPayload.petName,
        },
        theme: {
          color: '#0B1A14',
        },
        retry: {
          enabled: true,
          max_count: 3,
        },
        modal: {
          ondismiss: function () {
            console.log('Razorpay checkout modal cancelled by user');
            setIsProcessing(false);
            setPaymentNotice('Payment was cancelled. No order was booked and your cart is preserved.');
          },
        },
      };

      const rzp = new (window as any).Razorpay(rzpOptions);
      (window as any)._activeRzpCheckout = rzp;

      rzp.on('payment.failed', function (failResp: any) {
        console.error('[Razorpay Payment Failed]', failResp.error);
        setIsProcessing(false);
        setPaymentNotice(`Payment was declined: ${failResp.error?.description || 'Transaction unsuccessful.'}. No booking was placed.`);
      });

      rzp.open();
    } catch (err: any) {
      console.error(err);
      alert('Error initiating payment: ' + err.message);
      setIsProcessing(false);
    }
  };

  // Complete Razorpay Simulation
  const handleCompleteRazorpaySim = async (success: boolean) => {
    if (!simulatedOrderData) return;
    setIsSimulatingPayment(true);

    try {
      if (!success) {
        alert('Payment simulation was cancelled.');
        setShowRazorpaySimModal(false);
        return;
      }

      await new Promise((r) => setTimeout(r, 1200));

      const verifyRes = await fetch('/api/razorpay/verify-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId: simulatedOrderData.bookingId,
          orderId: simulatedOrderData.orderId,
          paymentId: `pay_sim_${Date.now()}`,
          signature: 'mock_sig_valid',
        }),
      });

      const verifyData = await verifyRes.json();
      if (!verifyRes.ok) {
        throw new Error(verifyData.error || 'Payment verification failed.');
      }

      setShowRazorpaySimModal(false);
      setBookingSuccess({
        bookingRef: simulatedOrderData.bookingRef,
        bookingId: simulatedOrderData.bookingId,
        paymentStatus: 'Paid & Confirmed (Razorpay Verified)',
        paymentMethod: 'Razorpay Online Gateway (Simulated UPI/Card)',
        servicesCount: selectedServices.length,
        totalAmount: finalTotal,
        totalSavings,
        date: `${checkInDate} (${preferredTimeSlot})`,
        pet: `${petName.trim()}`,
        claimedPerk: claimedPerkTitle,
      });
    } catch (err: any) {
      alert('Verification error: ' + err.message);
    } finally {
      setIsSimulatingPayment(false);
    }
  };

  if (!isOpen) return null;

  const cardInnerContent = (
    <div
      className={`bg-white rounded-3xl ${
        isFullPage
          ? 'w-full shadow-xl border border-black/10 overflow-hidden text-left relative flex flex-col'
          : 'max-w-lg w-full max-h-[92vh] flex flex-col shadow-2xl border border-black/10 overflow-hidden text-left relative'
      }`}
    >
      {/* Top Gold Stripe */}
      <div className="h-1.5 bg-gradient-to-r from-sanctuary-gold via-amber-400 to-sanctuary-forest shrink-0" />

      {/* Compact Modal Header */}
      <div className="px-4 py-3 sm:px-5 sm:py-3.5 flex items-center justify-between border-b border-black/5 bg-[#FAF8F5] shrink-0">
        <div className="flex items-center gap-2">
          <div className="size-8 rounded-lg bg-sanctuary-forest text-sanctuary-gold flex items-center justify-center font-black">
            <span className="material-symbols-outlined text-base">storefront</span>
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-black text-sanctuary-dark leading-tight">
              Review & Book Studio Visit
            </h2>
            <p className="text-[10px] text-amber-900 font-bold flex items-center gap-1">
              <span>📍 In-Store Visit • Kanakapura Main Road Studio</span>
            </p>
          </div>
        </div>

        {isFullPage ? (
          <a
            href="/"
            className="py-1 px-3 rounded-lg bg-black/5 hover:bg-black/10 text-xs font-bold text-sanctuary-dark transition-colors flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-xs">arrow_back</span>
            <span>Back</span>
          </a>
        ) : (
          <button
            onClick={onClose}
            className="size-7 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center transition-colors text-sanctuary-dark"
          >
            <span className="material-symbols-outlined text-xs">close</span>
          </button>
        )}
      </div>

        {/* ============================================================ */}
        {/* SUCCESS CONFIRMATION VIEW */}
        {/* ============================================================ */}
        {bookingSuccess ? (
          <div className="p-4 sm:p-5 text-center space-y-3 overflow-y-auto max-h-[85vh]">
            <div className="size-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-inner">
              <span className="material-symbols-outlined text-2xl">check_circle</span>
            </div>

            <div>
              <h3 className="text-xl font-black text-sanctuary-dark">
                Studio Visit Confirmed!
              </h3>
              <p className="text-[11px] text-sanctuary-dark/70 font-medium">
                Your appointment slot is locked. Show your Booking ID upon arrival at the studio.
              </p>
            </div>

            {/* Savings Highlight Badge */}
            {bookingSuccess.totalSavings > 0 && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-black">
                <span>🎉 Total Savings on this Booking:</span>
                <span className="text-emerald-950 font-black">₹{bookingSuccess.totalSavings}</span>
              </div>
            )}

            {/* Booking Details Summary */}
            <div className="p-3 bg-sanctuary-sand/60 rounded-xl border border-black/10 text-xs space-y-1.5 text-left">
              <div className="flex justify-between items-center pb-1 border-b border-black/5">
                <span className="text-sanctuary-dark/60 font-semibold">Booking ID:</span>
                <span className="font-mono font-black text-sanctuary-forest bg-white px-2 py-0.5 rounded border border-black/10">
                  {bookingSuccess.bookingRef}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sanctuary-dark/60 font-semibold">Payment / Status:</span>
                <span className="font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                  {bookingSuccess.paymentStatus}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sanctuary-dark/60 font-semibold">Companion:</span>
                <span className="font-bold text-sanctuary-dark">{bookingSuccess.pet}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sanctuary-dark/60 font-semibold">Visit Schedule:</span>
                <span className="font-bold text-sanctuary-dark">{bookingSuccess.date}</span>
              </div>
              <div className="flex justify-between items-center pt-1 border-t border-black/5">
                <span className="text-sanctuary-dark/60 font-semibold">Total Amount:</span>
                <span className="font-black text-sanctuary-dark text-sm">₹{bookingSuccess.totalAmount}</span>
              </div>
            </div>

            {/* Claim In-Store Free Perk Banner */}
            {bookingSuccess.claimedPerk && (
              <div className="p-3 bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border-2 border-emerald-400 rounded-2xl text-left space-y-1.5 shadow-xs">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-emerald-700 text-base">redeem</span>
                  <span className="text-xs font-black text-emerald-950 uppercase tracking-wider">
                    Complimentary In-Store Perk Claimed!
                  </span>
                  <span className="text-[9px] font-black px-1.5 py-0.2 rounded-full bg-emerald-600 text-white ml-auto">
                    FREE
                  </span>
                </div>
                <div className="text-xs font-black text-emerald-900 flex items-center gap-1.5 bg-white/80 p-2 rounded-xl border border-emerald-200">
                  <span className="text-base">🎁</span>
                  <span>{bookingSuccess.claimedPerk}</span>
                </div>
                <p className="text-[10.5px] text-emerald-900 font-bold leading-relaxed">
                  👉 <strong>How to claim:</strong> Please show this booking screen or confirmation message to our reception desk / stylist upon arrival at the studio counter to receive your free reward!
                </p>
              </div>
            )}

            {/* PROMINENT GOOGLE MAPS LOCATION & SAVE INSTRUCTIONS */}
            <div className="p-4 bg-gradient-to-br from-amber-50 via-white to-emerald-50 rounded-2xl border-2 border-amber-400 text-left space-y-2.5 shadow-sm">
              <div className="flex items-start gap-2.5">
                <div className="size-9 rounded-xl bg-sanctuary-forest text-sanctuary-gold flex items-center justify-center shrink-0 shadow-xs">
                  <span className="material-symbols-outlined text-lg">location_on</span>
                </div>
                <div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <h4 className="text-xs font-black text-sanctuary-dark uppercase tracking-wider">
                      Studio Address & Directions
                    </h4>
                    <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      Save Location
                    </span>
                  </div>
                  <p className="text-xs font-bold text-sanctuary-dark mt-0.5">
                    Snip & Style Pet Studio & Boarding
                  </p>
                  <p className="text-[11px] text-sanctuary-dark/75 font-medium leading-relaxed">
                    {STUDIO_ADDRESS}
                  </p>
                </div>
              </div>

              {/* Bold Save Alert */}
              <div className="p-2.5 bg-amber-100/90 border border-amber-300 rounded-xl text-amber-950 text-[11px] font-bold flex items-start gap-2 shadow-xs">
                <span className="material-symbols-outlined text-amber-700 text-sm shrink-0 mt-0.5">bookmark</span>
                <div>
                  <strong>PLEASE SAVE THIS GOOGLE MAPS LINK:</strong> Bookmark or open the link below on your phone now so you have turn-by-turn driving directions when visiting on <strong>{bookingSuccess.date}</strong>.
                </div>
              </div>

              {/* Action Buttons: Open Maps & Copy Link */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-0.5">
                <a
                  href={STUDIO_MAPS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 px-3 bg-sanctuary-forest hover:bg-black text-white rounded-xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-sm text-center transition-all"
                >
                  <span className="material-symbols-outlined text-sm text-sanctuary-gold">navigation</span>
                  <span>Open in Google Maps</span>
                </a>

                <button
                  type="button"
                  onClick={() => {
                    if (typeof navigator !== 'undefined') {
                      navigator.clipboard.writeText(STUDIO_MAPS_URL);
                      setCopiedMapsLink(true);
                      setTimeout(() => setCopiedMapsLink(false), 2500);
                    }
                  }}
                  className="py-2.5 px-3 bg-white hover:bg-black/5 text-sanctuary-dark rounded-xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 border border-black/15 shadow-xs transition-all"
                >
                  <span className="material-symbols-outlined text-sm">
                    {copiedMapsLink ? 'check_circle' : 'content_copy'}
                  </span>
                  <span>{copiedMapsLink ? 'Maps Link Copied!' : 'Copy Maps Link'}</span>
                </button>
              </div>

              {/* WhatsApp Share / Save Button */}
              <a
                href={`https://wa.me/?text=${encodeURIComponent(
                  `🐾 Snip & Style Studio Visit Confirmation\n\n` +
                  `Booking ID: ${bookingSuccess.bookingRef}\n` +
                  `Companion: ${bookingSuccess.pet}\n` +
                  `Visit Timing: ${bookingSuccess.date}\n` +
                  (bookingSuccess.claimedPerk ? `🎁 Free In-Store Perk: ${bookingSuccess.claimedPerk}\n(Show booking at counter to claim!)\n` : '') +
                  `Payment: ${bookingSuccess.paymentStatus}\n\n` +
                  `📍 Studio Google Maps Link (Save this!):\n` +
                  `${STUDIO_MAPS_URL}\n\n` +
                  `Address: ${STUDIO_ADDRESS}\n` +
                  `(Arrive 5-10 mins prior to slot)`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2 px-3 bg-[#25D366] hover:bg-[#1EBE5D] text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors"
              >
                <span className="material-symbols-outlined text-sm">chat</span>
                <span>Send Booking & Maps to WhatsApp (Save on Phone)</span>
              </a>

              <div className="text-[10px] text-center text-sanctuary-dark/60 font-semibold pt-0.5">
                Customer parking available in front. Show Booking ID <strong>{bookingSuccess.bookingRef}</strong> at the desk.
              </div>
            </div>

            <div className="flex gap-2 pt-1 justify-center">
              <button
                onClick={() => {
                  setBookingSuccess(null);
                  if (isFullPage) {
                    window.location.href = '/';
                  } else {
                    onClose();
                  }
                }}
                className="py-2.5 px-6 bg-sanctuary-forest hover:bg-black text-white rounded-xl text-xs font-black uppercase tracking-wider transition-colors shadow-sm"
              >
                {isFullPage ? 'Return to Home' : 'Done'}
              </button>
              <button
                onClick={() => {
                  setBookingSuccess(null);
                  if (isFullPage) {
                    window.location.href = '/account';
                  } else {
                    onClose();
                    window.dispatchEvent(new CustomEvent('snip_open_auth'));
                  }
                }}
                className="py-2.5 px-6 bg-sanctuary-sand hover:bg-black/10 text-sanctuary-dark rounded-xl text-xs font-black uppercase tracking-wider transition-colors border border-black/10"
              >
                View in My Account
              </button>
            </div>
          </div>
        ) : (
          /* ============================================================ */
          /* SCROLLABLE COMPACT CHECKOUT BODY */
          /* ============================================================ */
          <div className={`flex-1 ${isFullPage ? 'p-4 sm:p-6 space-y-4' : 'overflow-y-auto p-4 sm:p-5 space-y-3 max-h-[64vh]'}`}>

            {/* IN-STORE STUDIO VISIT EXPLANATION BANNER (PROMINENT UPFRONT NOTICE) */}
            <div className="p-3.5 bg-gradient-to-br from-amber-100/90 via-orange-50/70 to-emerald-50/60 rounded-2xl border-2 border-amber-400 text-xs space-y-2 shadow-sm">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="size-8 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-2xs font-black">
                    <span className="material-symbols-outlined text-lg">storefront</span>
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-amber-950 uppercase tracking-wide">
                      In-Studio Appointment / Boarding Visit
                    </h4>
                    <span className="text-[10px] text-emerald-900 font-black">
                      📍 Book Online Here → Visit Our Physical Studio in Person
                    </span>
                  </div>
                </div>
                <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-emerald-600 text-white shrink-0 uppercase tracking-wider">
                  Confirmed Slot
                </span>
              </div>

              <div className="p-2.5 bg-white/95 rounded-xl border border-amber-300/80 space-y-2 text-[11px] text-sanctuary-dark font-medium leading-relaxed shadow-2xs">
                <p className="text-amber-950 font-bold">
                  👉 <strong>IMPORTANT — HOW YOUR BOOKING WORKS:</strong>
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                  <div className="p-2 rounded-lg bg-amber-50/80 border border-amber-200">
                    <div className="font-black text-amber-950 flex items-center gap-1">
                      <span>1️⃣</span>
                      <span>Book Online Here</span>
                    </div>
                    <p className="text-[10px] text-amber-900/80 mt-0.5 font-medium">
                      Select your date & arrival slot, confirm pet size, and complete secure payment to lock in your appointment.
                    </p>
                  </div>
                  <div className="p-2 rounded-lg bg-emerald-50/80 border border-emerald-200">
                    <div className="font-black text-emerald-950 flex items-center gap-1">
                      <span>2️⃣</span>
                      <span>Bring Pet to Our Studio</span>
                    </div>
                    <p className="text-[10px] text-emerald-900/80 mt-0.5 font-medium">
                      Visit our <strong>Kanakapura Main Road Studio, Bangalore</strong> at your chosen time. Our stylists & caretakers will be sanitized and waiting!
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-black/5 text-[10px]">
                  <span className="text-sanctuary-dark/75 font-bold flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs text-sanctuary-forest">near_me</span>
                    <span>Studio: Kanakapura Main Road (Near Shani Mahatma Temple)</span>
                  </span>
                  <a
                    href={STUDIO_MAPS_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sanctuary-forest hover:underline font-black uppercase tracking-wider flex items-center gap-0.5"
                  >
                    <span>View on Maps</span>
                    <span className="material-symbols-outlined text-xs">open_in_new</span>
                  </a>
                </div>
              </div>
            </div>

            {/* 1. SAVINGS HIGHLIGHT BANNER */}
            {totalSavings > 0 && (
              <div className="p-2.5 bg-gradient-to-r from-emerald-50 via-amber-50 to-emerald-50 rounded-xl border border-emerald-300 flex items-center justify-between text-xs shadow-xs">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-emerald-600 text-base">savings</span>
                  <span className="font-black text-emerald-950">You're Saving Total:</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-sanctuary-dark/60 font-bold line-through decoration-red-400">
                    ₹{grossOriginalTotal}
                  </span>
                  <span className="px-2 py-0.5 bg-emerald-600 text-white rounded-lg text-xs font-black shadow-xs">
                    Save ₹{totalSavings}
                  </span>
                </div>
              </div>
            )}

            {/* 2. AUTHENTICATION GATE (PHONE + PASSWORD ONLY) */}
            <div className="p-3 bg-[#FAF8F5] rounded-2xl border border-black/10 space-y-2">
              {currentUser ? (
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="size-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                    <div>
                      <div className="font-black text-sanctuary-dark">
                        {currentUser.fullName}
                      </div>
                      <div className="text-[10px] font-mono text-sanctuary-dark/60">
                        📱 +91 {currentUser.phone}
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="text-[10px] text-red-600 hover:text-red-800 underline font-bold"
                  >
                    Switch Account
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center justify-between pb-1 border-b border-black/5 text-xs">
                    <span className="font-black text-sanctuary-dark flex items-center gap-1">
                      <span className="material-symbols-outlined text-sanctuary-gold text-sm">lock</span>
                      <span>Sign In with Phone Number</span>
                    </span>

                    <div className="flex items-center bg-black/5 p-0.5 rounded-lg text-[10px] font-bold">
                      <button
                        type="button"
                        onClick={() => { setAuthTab('login'); setAuthError(''); }}
                        className={`px-2 py-0.5 rounded-md transition-all ${
                          authTab === 'login' ? 'bg-white shadow-xs text-sanctuary-dark font-black' : 'text-sanctuary-dark/60'
                        }`}
                      >
                        Sign In
                      </button>
                      <button
                        type="button"
                        onClick={() => { setAuthTab('signup'); setAuthError(''); }}
                        className={`px-2 py-0.5 rounded-md transition-all ${
                          authTab === 'signup' ? 'bg-white shadow-xs text-sanctuary-dark font-black' : 'text-sanctuary-dark/60'
                        }`}
                      >
                        Register
                      </button>
                    </div>
                  </div>

                  {authError && (
                    <div className="p-1.5 text-[10px] font-bold text-red-700 bg-red-50 border border-red-200 rounded-lg">
                      {authError}
                    </div>
                  )}

                  {authTab === 'login' ? (
                    <form onSubmit={handlePhoneLogin} className="grid grid-cols-2 gap-2">
                      <input
                        type="tel"
                        required
                        placeholder="Mobile (10 digits)"
                        value={authPhone}
                        onChange={(e) => setAuthPhone(e.target.value)}
                        className="p-2 bg-white rounded-xl border border-black/10 text-xs font-mono font-bold focus:outline-none focus:border-sanctuary-gold"
                      />
                      <input
                        type="password"
                        required
                        placeholder="Password"
                        value={authPassword}
                        onChange={(e) => setAuthPassword(e.target.value)}
                        className="p-2 bg-white rounded-xl border border-black/10 text-xs font-medium focus:outline-none focus:border-sanctuary-gold"
                      />
                      <button
                        type="submit"
                        disabled={authLoading}
                        className="col-span-2 py-2 bg-sanctuary-forest hover:bg-black text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-all disabled:opacity-50"
                      >
                        {authLoading ? 'Verifying...' : 'Sign In with Phone'}
                      </button>
                    </form>
                  ) : (
                    <form onSubmit={handlePhoneSignup} className="space-y-1.5">
                      <div className="grid grid-cols-2 gap-1.5">
                        <input
                          type="text"
                          required
                          placeholder="Your Full Name"
                          value={authName}
                          onChange={(e) => setAuthName(e.target.value)}
                          className="p-2 bg-white rounded-xl border border-black/10 text-xs font-medium focus:outline-none focus:border-sanctuary-gold"
                        />
                        <input
                          type="tel"
                          required
                          placeholder="Mobile (10 digits)"
                          value={authPhone}
                          onChange={(e) => setAuthPhone(e.target.value)}
                          className="p-2 bg-white rounded-xl border border-black/10 text-xs font-mono font-bold focus:outline-none focus:border-sanctuary-gold"
                        />
                      </div>
                      <input
                        type="password"
                        required
                        placeholder="Create Password"
                        value={authPassword}
                        onChange={(e) => setAuthPassword(e.target.value)}
                        className="w-full p-2 bg-white rounded-xl border border-black/10 text-xs font-medium focus:outline-none focus:border-sanctuary-gold"
                      />
                      <button
                        type="submit"
                        disabled={authLoading}
                        className="w-full py-2 bg-sanctuary-gold hover:bg-amber-400 text-sanctuary-dark rounded-xl font-black text-xs uppercase tracking-wider transition-all disabled:opacity-50"
                      >
                        {authLoading ? 'Registering...' : 'Create Account with Phone'}
                      </button>
                    </form>
                  )}
                </div>
              )}
            </div>

            {/* 3. MULTI-SERVICE CART */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-black text-sanctuary-dark uppercase tracking-wider text-[10px]">
                  Selected Services ({selectedServices.length})
                </span>
                <button
                  type="button"
                  onClick={() => setShowAddServiceDropdown(!showAddServiceDropdown)}
                  className="text-[10px] font-black text-sanctuary-forest hover:text-black flex items-center gap-1 bg-sanctuary-sand px-2 py-0.5 rounded-lg border border-black/5"
                >
                  <span className="material-symbols-outlined text-xs">add</span>
                  <span>Add Another Service</span>
                </button>
              </div>

              {/* Add Service Quick Dropdown */}
              {showAddServiceDropdown && (
                <div className="p-2.5 bg-white rounded-2xl border-2 border-sanctuary-gold shadow-lg space-y-1.5 text-xs">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-[10px] font-black text-sanctuary-dark/60 uppercase tracking-wider">
                      Select Service (Confirm Pet Size):
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowAddServiceDropdown(false)}
                      className="text-[10px] text-sanctuary-dark/40 hover:text-black font-bold"
                    >
                      Close ✕
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      type="button"
                      onClick={() => openAddServiceConfirmation('grooming', 'furry-fresh', 'Furry Fresh Hygiene Bath')}
                      className="p-2 rounded-xl border border-black/10 text-left hover:bg-sanctuary-sand transition-all"
                    >
                      <div className="font-bold text-[11px] text-sanctuary-dark">🛁 Furry Fresh Bath</div>
                      <div className="text-[10px] text-emerald-800 font-black">From ₹499 (was ₹649)</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => openAddServiceConfirmation('grooming', 'special', 'Special Package Care')}
                      className="p-2 rounded-xl border border-black/10 text-left hover:bg-sanctuary-sand transition-all"
                    >
                      <div className="font-bold text-[11px] text-sanctuary-dark">✨ Special Package</div>
                      <div className="text-[10px] text-emerald-800 font-black">From ₹899 (was ₹1,124)</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => openAddServiceConfirmation('grooming', 'style', 'Style Your Pet Breed Trim')}
                      className="p-2 rounded-xl border border-black/10 text-left hover:bg-sanctuary-sand transition-all"
                    >
                      <div className="font-bold text-[11px] text-sanctuary-dark">✂️ Style Your Pet</div>
                      <div className="text-[10px] text-emerald-800 font-black">From ₹1,799 (was ₹2,249)</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => openAddServiceConfirmation('grooming', 'full-groom', 'Full Grooming Ultimate Spa')}
                      className="p-2 rounded-xl border border-black/10 text-left hover:bg-sanctuary-sand transition-all"
                    >
                      <div className="font-bold text-[11px] text-sanctuary-dark">👑 Full Grooming Spa</div>
                      <div className="text-[10px] text-emerald-800 font-black">From ₹2,199 (was ₹3,249)</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => openAddServiceConfirmation('boarding', 'boarding', 'Cage-Free Boarding Floor', 4)}
                      className="p-2 rounded-xl border border-sanctuary-gold bg-amber-50/50 text-left hover:bg-amber-100/60 col-span-2 transition-all"
                    >
                      <div className="font-bold text-[11px] text-sanctuary-dark">🐕 Cage-Free Boarding Floor (Select Nights)</div>
                      <div className="text-[10px] text-emerald-800 font-black">From ₹625/nt (was ₹750/nt) • 6+ Nts: 1 Day FREE!</div>
                    </button>
                  </div>
                </div>
              )}

              {/* Empty Cart State */}
              {selectedServices.length === 0 && (
                <div className="p-3.5 rounded-xl border border-dashed border-sanctuary-gold/60 bg-amber-50/40 text-center space-y-2">
                  <div className="flex items-center justify-center gap-1.5 text-xs font-black text-amber-950">
                    <span className="material-symbols-outlined text-sm text-amber-700">shopping_bag</span>
                    <span>Your checkout cart is empty</span>
                  </div>
                  <p className="text-[11px] text-amber-900/80">
                    Select a boarding stay or grooming service below to proceed:
                  </p>
                  <div className="grid grid-cols-2 gap-1.5 pt-1">
                    <button
                      type="button"
                      onClick={() => openAddServiceConfirmation('boarding', 'boarding', 'Cage-Free Boarding Floor', 4)}
                      className="p-2 rounded-xl border border-sanctuary-gold bg-white hover:bg-sanctuary-sand text-left shadow-2xs transition-all"
                    >
                      <div className="text-[11px] font-black text-sanctuary-dark">🐕 Boarding (Custom Nights)</div>
                      <div className="text-[10px] text-emerald-700 font-bold">From ₹625/night</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => openAddServiceConfirmation('grooming', 'special', 'Special Grooming Package')}
                      className="p-2 rounded-xl border border-sanctuary-gold bg-white hover:bg-sanctuary-sand text-left shadow-2xs transition-all"
                    >
                      <div className="text-[11px] font-black text-sanctuary-dark">✨ Special Grooming</div>
                      <div className="text-[10px] text-emerald-700 font-bold">From ₹899 (Save ₹225)</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => openAddServiceConfirmation('grooming', 'furry-fresh', 'Furry Fresh Hygiene Bath')}
                      className="p-2 rounded-xl border border-black/10 bg-white hover:bg-sanctuary-sand text-left shadow-2xs transition-all"
                    >
                      <div className="text-[11px] font-black text-sanctuary-dark">🛁 Furry Fresh Bath</div>
                      <div className="text-[10px] text-sanctuary-dark/70 font-bold">From ₹499 (was ₹649)</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => openAddServiceConfirmation('grooming', 'style', 'Style Your Pet Breed Trim')}
                      className="p-2 rounded-xl border border-black/10 bg-white hover:bg-sanctuary-sand text-left shadow-2xs transition-all"
                    >
                      <div className="text-[11px] font-black text-sanctuary-dark">✂️ Breed Styling</div>
                      <div className="text-[10px] text-sanctuary-dark/70 font-bold">From ₹1,799 (was ₹2,249)</div>
                    </button>
                  </div>
                </div>
              )}

              {/* Service Cards List */}
              <div className="space-y-2">
                {selectedServices.map((item) => (
                  <div
                    key={item.id}
                    className={`p-3 rounded-2xl border transition-all ${
                      item.isFreePerk || item.price === 0
                        ? 'border-emerald-300 bg-emerald-50/80 shadow-xs'
                        : 'border-black/10 bg-white shadow-2xs'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-black text-sanctuary-dark text-xs">{item.name}</span>
                          {item.isFreePerk || item.price === 0 ? (
                            <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-emerald-600 text-white shadow-2xs">
                              🎁 FREE PERK (₹0)
                            </span>
                          ) : item.subtitle ? (
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-sanctuary-sand text-sanctuary-dark/70">
                              {item.subtitle}
                            </span>
                          ) : null}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] line-through text-red-500 font-bold decoration-red-400">
                            ₹{item.origPrice}
                          </span>
                          <span className={`text-xs font-black ${item.price === 0 ? 'text-emerald-700 font-black' : 'text-sanctuary-forest'}`}>
                            {item.price === 0 ? 'FREE (₹0)' : `₹${item.price}`}
                          </span>
                          {item.category === 'boarding' && item.nights && (
                            <span className="text-[10px] text-sanctuary-dark/50 font-medium">
                              (₹{Math.round(item.price / item.nights)}/night)
                            </span>
                          )}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveService(item.id)}
                        className="size-6 rounded-full hover:bg-red-50 text-sanctuary-dark/40 hover:text-red-600 flex items-center justify-center transition-colors shrink-0"
                        title={item.isFreePerk ? 'Remove free perk' : 'Remove service'}
                      >
                        <span className="material-symbols-outlined text-xs">close</span>
                      </button>
                    </div>

                    {/* Interactive controls: Nights Stepper & Size Confirmation */}
                    {!item.isFreePerk && (
                      <div className="mt-2 pt-2 border-t border-black/5 flex items-center justify-between flex-wrap gap-2 text-xs">
                        {item.category === 'boarding' ? (
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-bold text-sanctuary-dark/70">Nights:</span>
                            <div className="inline-flex items-center rounded-lg border border-black/15 bg-sanctuary-sand/60 overflow-hidden">
                              <button
                                type="button"
                                onClick={() => handleUpdateNights(item.id, Math.max(1, (item.nights || 1) - 1))}
                                disabled={(item.nights || 1) <= 1}
                                className="px-2 py-0.5 text-xs font-bold hover:bg-black/10 disabled:opacity-30 disabled:cursor-not-allowed"
                                title="Decrease nights"
                              >
                                -
                              </button>
                              <span className="px-2 py-0.5 text-xs font-black font-mono">
                                {item.nights || 1} nt{(item.nights || 1) > 1 ? 's' : ''}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleUpdateNights(item.id, Math.min(60, (item.nights || 1) + 1))}
                                className="px-2 py-0.5 text-xs font-bold hover:bg-black/10"
                                title="Increase nights"
                              >
                                +
                              </button>
                            </div>
                            {(item.nights || 1) >= 6 && (
                              <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                                🎁 1 Day Free Eligible
                              </span>
                            )}
                          </div>
                        ) : (
                          <div className="text-[10px] text-sanctuary-dark/60 font-medium">
                            Category: Grooming Salon
                          </div>
                        )}

                        <button
                          type="button"
                          onClick={() => {
                            if (item.category === 'boarding') {
                              openAddServiceConfirmation('boarding', 'boarding', item.name, item.nights || 4, item.id);
                            } else {
                              let key: any = 'furry-fresh';
                              if (item.name.toLowerCase().includes('special')) key = 'special';
                              else if (item.name.toLowerCase().includes('style')) key = 'style';
                              else if (item.name.toLowerCase().includes('ultimate') || item.name.toLowerCase().includes('full')) key = 'full-groom';
                              openAddServiceConfirmation('grooming', key, item.name, 1, item.id);
                            }
                          }}
                          className="text-[10px] font-black text-sanctuary-forest hover:text-black flex items-center gap-1 bg-amber-50 hover:bg-amber-100 px-2.5 py-1 rounded-lg border border-amber-300 transition-colors ml-auto"
                        >
                          <span className="material-symbols-outlined text-xs text-amber-700">tune</span>
                          <span>Confirm / Change Pet Size</span>
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Free Grooming Perk Selector (For bills >= 500) */}
              {groomingSubtotal >= 500 && (
                <div className="p-3.5 bg-gradient-to-br from-amber-50 via-orange-50/50 to-emerald-50/40 rounded-2xl border-2 border-amber-400 space-y-2.5 shadow-xs">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="size-8 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                        <span className="material-symbols-outlined text-base">redeem</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h4 className="text-xs font-black text-amber-950 uppercase tracking-wider">
                            Grooming Bill Over ₹500 Unlocked!
                          </h4>
                          <span className="text-[9px] font-black px-2 py-0.2 rounded-full bg-emerald-600 text-white uppercase tracking-wider">
                            100% Free Reward
                          </span>
                        </div>
                        <p className="text-[11px] text-amber-900 font-bold mt-0.5">
                          Choose your complimentary perk below to claim at the studio:
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Radio Choice Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div
                      onClick={() => setSelectedFreeGroomingPerk('free_bath')}
                      className={`p-2.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                        selectedFreeGroomingPerk === 'free_bath'
                          ? 'bg-white border-amber-500 ring-2 ring-amber-400 shadow-xs text-sanctuary-dark font-black'
                          : 'bg-white/80 border-black/10 hover:border-amber-300 text-sanctuary-dark'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-xl">🛁</span>
                        <div>
                          <div className="text-xs font-black leading-tight">Free Furry Fresh Bath</div>
                          <div className="text-[10px] text-emerald-800 font-bold">₹499 Value • 100% FREE</div>
                        </div>
                      </div>
                      <input
                        type="radio"
                        name="grooming_perk"
                        checked={selectedFreeGroomingPerk === 'free_bath'}
                        onChange={() => setSelectedFreeGroomingPerk('free_bath')}
                        className="size-4 accent-amber-600 shrink-0"
                      />
                    </div>

                    <div
                      onClick={() => setSelectedFreeGroomingPerk('free_nail_clip')}
                      className={`p-2.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                        selectedFreeGroomingPerk === 'free_nail_clip'
                          ? 'bg-white border-amber-500 ring-2 ring-amber-400 shadow-xs text-sanctuary-dark font-black'
                          : 'bg-white/80 border-black/10 hover:border-amber-300 text-sanctuary-dark'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-xl">✂️</span>
                        <div>
                          <div className="text-xs font-black leading-tight">Free Nail Clipping & Filing</div>
                          <div className="text-[10px] text-emerald-800 font-bold">₹249 Value • 100% FREE</div>
                        </div>
                      </div>
                      <input
                        type="radio"
                        name="grooming_perk"
                        checked={selectedFreeGroomingPerk === 'free_nail_clip'}
                        onChange={() => setSelectedFreeGroomingPerk('free_nail_clip')}
                        className="size-4 accent-amber-600 shrink-0"
                      />
                    </div>
                  </div>

                  {/* Explicit Claim in Store Instruction */}
                  <div className="p-2.5 bg-white/95 rounded-xl border border-amber-300/80 text-[11px] text-amber-950 font-bold flex items-start gap-2 shadow-xs">
                    <span className="material-symbols-outlined text-amber-700 text-sm shrink-0 mt-0.5">storefront</span>
                    <div>
                      <strong>HOW TO CLAIM:</strong> Show your booking confirmation ID at our studio counter upon arrival, and our certified stylists will provide your chosen free perk!
                    </div>
                  </div>
                </div>
              )}

              {/* Upsell nudge if grooming in cart is below 500 */}
              {groomingSubtotal > 0 && groomingSubtotal < 500 && (
                <div className="p-2.5 bg-amber-50/90 rounded-xl border border-dashed border-amber-400 text-[11px] font-bold text-amber-950 flex items-center justify-between shadow-2xs">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-amber-700 text-sm">redeem</span>
                    <span>Add ₹{500 - groomingSubtotal} more in grooming for a <strong>Free Bath or Nail Clip</strong>!</span>
                  </div>
                </div>
              )}
            </div>

            {/* 4. COMPANION & VISIT DETAILS */}
            <div className="space-y-3 pt-2 border-t border-black/5">
              
              {/* 4a. Companion Details */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-wider text-sanctuary-dark/70 block">
                    Companion Profile & Size
                  </span>
                  <span className="text-[9px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    Live Rates Synced to Cart
                  </span>
                </div>

                {/* Species Toggle: Dog vs Cat */}
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleChangePetType('dog')}
                    className={`p-2 rounded-xl border flex items-center justify-center gap-2 transition-all ${
                      petType === 'dog'
                        ? 'bg-sanctuary-forest text-white border-sanctuary-forest shadow-xs font-black'
                        : 'bg-white border-black/10 text-sanctuary-dark font-bold hover:border-sanctuary-gold'
                    }`}
                  >
                    <span className="text-sm">🐕</span>
                    <span className="text-xs">Dog / Canine</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleChangePetType('cat')}
                    className={`p-2 rounded-xl border flex items-center justify-center gap-2 transition-all ${
                      petType === 'cat'
                        ? 'bg-sanctuary-forest text-white border-sanctuary-forest shadow-xs font-black'
                        : 'bg-white border-black/10 text-sanctuary-dark font-bold hover:border-sanctuary-gold'
                    }`}
                  >
                    <span className="text-sm">🐈</span>
                    <span className="text-xs">Cat / Feline</span>
                  </button>
                </div>

                {/* Weight / Profile Tier */}
                {petType === 'dog' ? (
                  <div className="space-y-1">
                    <span className="text-[9px] font-bold text-sanctuary-dark/60 block">Dog Size Tier (Changes Cart Pricing):</span>
                    <div className="grid grid-cols-3 gap-1">
                      {[
                        { id: 'small', label: 'Small', desc: '< 10 kg', sub: 'Shih Tzu, Pug' },
                        { id: 'medium', label: 'Medium', desc: '10–25 kg', sub: 'Beagle, Indie' },
                        { id: 'large', label: 'Large', desc: '> 25 kg', sub: 'Lab, Golden' },
                      ].map((tier) => (
                        <button
                          key={tier.id}
                          type="button"
                          onClick={() => handleChangeDogSize(tier.id as any)}
                          className={`p-1.5 rounded-xl border text-center transition-all ${
                            petSize === tier.id
                              ? 'bg-amber-100 border-amber-600 text-amber-950 font-black ring-1 ring-amber-500 shadow-2xs'
                              : 'bg-white border-black/10 text-sanctuary-dark hover:border-amber-300'
                          }`}
                        >
                          <div className="text-[11px] font-bold">{tier.label}</div>
                          <div className="text-[9px] text-sanctuary-dark/60 font-medium">{tier.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <span className="text-[9px] font-bold text-sanctuary-dark/60 block">Cat Profile Tier:</span>
                    <div className="grid grid-cols-2 gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleChangeCatType('neutered')}
                        className={`p-1.5 rounded-xl border text-left transition-all ${
                          catType === 'neutered'
                            ? 'bg-amber-100 border-amber-600 text-amber-950 font-black ring-1 ring-amber-500 shadow-2xs'
                            : 'bg-white border-black/10 text-sanctuary-dark hover:border-amber-300'
                        }`}
                      >
                        <div className="text-[11px] font-bold">Neutered Cat</div>
                        <div className="text-[9px] text-emerald-800 font-bold">₹625 / night</div>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleChangeCatType('non-neutered')}
                        className={`p-1.5 rounded-xl border text-left transition-all ${
                          catType === 'non-neutered'
                            ? 'bg-amber-100 border-amber-600 text-amber-950 font-black ring-1 ring-amber-500 shadow-2xs'
                            : 'bg-white border-black/10 text-sanctuary-dark hover:border-amber-300'
                        }`}
                      >
                        <div className="text-[11px] font-bold">Non-Neutered Cat</div>
                        <div className="text-[9px] text-emerald-800 font-bold">₹750 / night</div>
                      </button>
                    </div>
                  </div>
                )}

                {/* Pet Name & Breed Inputs */}
                <div className="grid grid-cols-2 gap-2 pt-0.5">
                  <input
                    type="text"
                    required
                    placeholder="Pet Name *"
                    value={petName}
                    onChange={(e) => setPetName(e.target.value)}
                    className="p-2 rounded-xl border border-black/10 text-xs font-medium focus:outline-none focus:border-sanctuary-gold bg-white"
                  />
                  <input
                    type="text"
                    placeholder="Breed (e.g. Shih Tzu / Persian)"
                    value={petBreed}
                    onChange={(e) => setPetBreed(e.target.value)}
                    className="p-2 rounded-xl border border-black/10 text-xs font-medium focus:outline-none focus:border-sanctuary-gold bg-white"
                  />
                </div>
              </div>

              {/* 4b. Date & Time of Store Visit / Boarding Duration */}
              {(() => {
                const boardingItems = selectedServices.filter((s) => s.category === 'boarding');
                const totalBoardingNights = boardingItems.reduce((sum, s) => sum + (s.nights || 1), 0);
                const primaryBoarding = boardingItems[0];

                return (
                  <div className="p-3 bg-sanctuary-sand/50 rounded-2xl border border-black/10 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-sanctuary-forest text-sm">calendar_month</span>
                        <span className="text-xs font-black text-sanctuary-dark">
                          {totalBoardingNights > 0 ? 'Boarding Stay Schedule' : 'Studio Visit Date & Arrival Time'}
                        </span>
                      </div>
                      <span className="text-[9px] font-bold text-sanctuary-forest bg-white px-2 py-0.5 rounded-full border border-black/10">
                        Kanakapura Studio
                      </span>
                    </div>

                    {/* Confirmed Stay Duration Display (No redundant stepper in schedule) */}
                    {totalBoardingNights > 0 && (
                      <div className="p-2.5 bg-white rounded-xl border border-amber-300/80 space-y-2 shadow-2xs">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="size-7 rounded-lg bg-amber-500/15 text-amber-900 flex items-center justify-center">
                              <span className="material-symbols-outlined text-base">hotel</span>
                            </div>
                            <div>
                              <div className="text-[10px] font-black text-sanctuary-dark/70 uppercase tracking-wider">
                                Confirmed Boarding Duration
                              </div>
                              <div className="text-xs font-black text-sanctuary-forest">
                                {totalBoardingNights} Night{totalBoardingNights > 1 ? 's' : ''} Stay
                              </div>
                            </div>
                          </div>
                          <span className="text-[9px] font-bold text-sanctuary-dark/60 bg-sanctuary-sand px-2 py-0.5 rounded-full">
                            Selected ({totalBoardingNights} {totalBoardingNights === 1 ? 'Night' : 'Nights'})
                          </span>
                        </div>

                        {/* Calculated Dates summary */}
                        <div className="grid grid-cols-2 gap-1.5 pt-1 text-[11px] border-t border-black/5">
                          <div className="p-1.5 bg-amber-50/60 rounded-lg">
                            <span className="text-[9px] text-sanctuary-dark/60 font-bold block">Check-In (Drop-Off):</span>
                            <span className="font-black text-sanctuary-dark">{checkInDate || 'Select below'}</span>
                          </div>
                          <div className="p-1.5 bg-emerald-50/60 rounded-lg">
                            <span className="text-[9px] text-emerald-800 font-bold block">Estimated Check-Out:</span>
                            <span className="font-black text-emerald-950">
                              {calculateCheckoutDate(checkInDate || new Date().toISOString().split('T')[0], totalBoardingNights)}
                            </span>
                          </div>
                        </div>

                        {/* STAY6FREE1 Offer Indicator */}
                        {totalBoardingNights >= 6 ? (
                          <div className="p-2 bg-emerald-100/70 rounded-lg border border-emerald-300 text-[10px] text-emerald-950 font-bold flex items-center justify-between">
                            <span>🎉 6+ Nights: 1 Day FREE with code <strong>STAY6FREE1</strong>!</span>
                            {appliedCoupon?.code !== 'STAY6FREE1' && (
                              <button
                                type="button"
                                onClick={() => applyCouponCode('STAY6FREE1')}
                                className="px-2 py-0.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded text-[9px] font-black uppercase tracking-wider"
                              >
                                Apply Free Day
                              </button>
                            )}
                          </div>
                        ) : (
                          <div className="text-[10px] text-amber-900 bg-amber-50 p-1.5 rounded-lg border border-amber-200 font-bold">
                            💡 Tip: 6+ night stays get <strong>1 Day 100% FREE</strong> with code STAY6FREE1!
                          </div>
                        )}
                      </div>
                    )}

                    {/* Visit / Check-In Date */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[10px] font-bold text-sanctuary-dark/70">
                        <span>{totalBoardingNights > 0 ? 'Check-In Date:' : 'Select Visit Date:'}</span>
                        {/* Quick date presets */}
                        <div className="flex items-center gap-1">
                          {[
                            { label: 'Today', days: 0 },
                            { label: 'Tomorrow', days: 1 },
                            { label: '+2 Days', days: 2 },
                          ].map((preset) => {
                            const targetDate = new Date();
                            targetDate.setDate(targetDate.getDate() + preset.days);
                            const dateStr = targetDate.toISOString().split('T')[0];
                            const isSelected = checkInDate === dateStr;
                            return (
                              <button
                                key={preset.label}
                                type="button"
                                onClick={() => setCheckInDate(dateStr)}
                                className={`px-2 py-0.5 rounded-md text-[9px] font-bold transition-all ${
                                  isSelected
                                    ? 'bg-sanctuary-forest text-white'
                                    : 'bg-white border border-black/10 text-sanctuary-dark/70 hover:border-black/30'
                                }`}
                              >
                                {preset.label}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                      <input
                        type="date"
                        required
                        min={new Date().toISOString().split('T')[0]}
                        value={checkInDate}
                        onChange={(e) => setCheckInDate(e.target.value)}
                        className="w-full p-2 rounded-xl border border-black/10 text-xs font-bold focus:outline-none focus:border-sanctuary-gold bg-white"
                      />
                    </div>

                    {/* Visit Time Slot Grid */}
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-sanctuary-dark/70 block">
                        Arrival Time Slot (09:30 AM – 08:30 PM):
                      </span>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                        {TIME_SLOTS.map((slot) => {
                          const isSelected = preferredTimeSlot === slot.id;
                          return (
                            <button
                              key={slot.id}
                              type="button"
                              onClick={() => setPreferredTimeSlot(slot.id)}
                              className={`p-2 rounded-xl text-left border transition-all ${
                                isSelected
                                  ? 'bg-sanctuary-forest text-white border-sanctuary-forest shadow-xs font-black'
                                  : 'bg-white border-black/10 hover:border-sanctuary-gold text-sanctuary-dark'
                              }`}
                            >
                              <div className={`text-[9px] uppercase tracking-wider ${isSelected ? 'text-sanctuary-gold' : 'text-sanctuary-dark/50'} font-bold`}>
                                {slot.period}
                              </div>
                              <div className="text-[11px] font-bold leading-tight mt-0.5">
                                {slot.label}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <p className="text-[10px] text-sanctuary-dark/65 font-medium leading-relaxed bg-white/70 p-2 rounded-xl border border-black/5">
                      📍 <strong>Arrival at your chosen slot:</strong> Please arrive 5–10 minutes before your slot. Our certified stylists and boarding attendants will have everything sanitized and ready!
                    </p>

                    {/* Doorstep Pet Pickup Checkbox */}
                    <div
                      onClick={() => setIncludePetTaxi(!includePetTaxi)}
                      className={`p-2 rounded-xl border cursor-pointer flex items-center justify-between text-xs transition-all ${
                        includePetTaxi ? 'bg-amber-50 border-amber-500 text-amber-950 font-bold' : 'bg-white border-black/10'
                      }`}
                    >
                      <div className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-amber-600 text-sm">local_taxi</span>
                        <div>
                          <div className="text-[11px] font-bold">Doorstep Pet Cab (+₹299)</div>
                          <div className="text-[9px] text-sanctuary-dark/60 font-medium">Can't visit? We'll pick up & return your pet</div>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={includePetTaxi}
                        onChange={() => {}}
                        className="size-3.5 accent-amber-600 rounded"
                      />
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* 5. INDIVIDUAL ADD-ONS (COMPACT) */}
            <div className="space-y-1.5 pt-1 border-t border-black/5">
              <span className="text-[10px] font-black uppercase tracking-wider text-sanctuary-dark/60 block">
                Quick-Care Add-Ons (Optional)
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                {addonsList.map((addon) => {
                  const isChecked = selectedAddons.includes(addon.id);
                  return (
                    <div
                      key={addon.id}
                      onClick={() => toggleAddon(addon.id)}
                      className={`p-2 rounded-lg border cursor-pointer flex items-center justify-between text-xs transition-all ${
                        isChecked ? 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold' : 'bg-white border-black/10'
                      }`}
                    >
                      <span className="text-[11px] truncate">{addon.name}</span>
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}}
                        className="size-3.5 accent-emerald-600 rounded shrink-0"
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 6. PROPER COUPONS SECTION (CLICKABLE PILLS) */}
            <div className="p-3 bg-sanctuary-sand/50 rounded-2xl border border-black/5 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-black text-sanctuary-dark flex items-center gap-1 text-[11px]">
                  <span className="material-symbols-outlined text-sm text-sanctuary-gold">local_activity</span>
                  <span>Apply Coupon Code</span>
                </span>
                {appliedCoupon && (
                  <button
                    type="button"
                    onClick={handleRemoveCoupon}
                    className="text-[10px] font-bold text-red-600 hover:underline"
                  >
                    Remove
                  </button>
                )}
              </div>

              {/* Clickable Quick Coupon Pills */}
              <div className="grid grid-cols-2 gap-1.5">
                {availableCoupons.map((c) => {
                  const isSelected = appliedCoupon?.code === c.code;
                  return (
                    <button
                      key={c.code}
                      type="button"
                      onClick={() => applyCouponCode(c.code)}
                      className={`p-2 rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'bg-sanctuary-forest text-white border-sanctuary-forest shadow-xs'
                          : 'bg-white text-sanctuary-dark border-black/10 hover:border-sanctuary-gold'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-[11px] font-black tracking-wider font-mono">{c.code}</span>
                        <span className={`text-[8px] font-black px-1.5 py-0.2 rounded shrink-0 ${
                          isSelected ? 'bg-amber-400 text-sanctuary-dark' : 'bg-sanctuary-sand text-sanctuary-dark/70'
                        }`}>
                          {c.badge}
                        </span>
                      </div>
                      <div className={`text-[9px] mt-0.5 font-medium truncate ${isSelected ? 'text-amber-200' : 'text-sanctuary-dark/60'}`}>
                        {c.desc}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Manual Input */}
              <div className="flex gap-1.5 pt-0.5">
                <input
                  type="text"
                  placeholder="Or Enter Custom Promo Code"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  className="flex-1 p-2 bg-white rounded-xl border border-black/10 text-xs font-mono font-bold uppercase tracking-wider focus:outline-none focus:border-sanctuary-gold"
                />
                <button
                  type="button"
                  onClick={() => applyCouponCode(couponInput)}
                  className="py-2 px-3 bg-sanctuary-forest hover:bg-black text-white rounded-xl font-bold text-xs uppercase transition-colors shrink-0"
                >
                  Apply
                </button>
              </div>

              {couponError && (
                <p className="text-[10px] font-bold text-red-600">{couponError}</p>
              )}

              {appliedCoupon && (
                <div className="p-2 bg-emerald-100/80 border border-emerald-300 rounded-xl text-xs font-bold text-emerald-950 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-emerald-700 text-sm">verified</span>
                    <span>✓ <strong>{appliedCoupon.code}</strong>: {appliedCoupon.label}</span>
                  </div>
                  <span className="font-black text-emerald-800 text-[11px] shrink-0">
                    {appliedCoupon.isFreePerk || discountAmount === 0 ? '🎁 Free Spa Perk Added' : `-₹${discountAmount}`}
                  </span>
                </div>
              )}
            </div>

            {/* 7. SECURE PAYMENT (ONLINE VIA RAZORPAY) */}
            <div className="space-y-2 pt-1 border-t border-black/5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider text-sanctuary-dark/70 block">
                  Payment Method
                </span>
                <span className="text-[9px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[11px] text-emerald-700">lock</span>
                  <span>256-Bit Bank Encrypted</span>
                </span>
              </div>

              {/* Single High-Trust Razorpay Card */}
              <div className="p-3.5 rounded-2xl border-2 border-amber-400 bg-gradient-to-br from-white via-amber-50/30 to-emerald-50/20 shadow-xs space-y-2.5">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="size-8 rounded-xl bg-[#0C2340] text-sanctuary-gold flex items-center justify-center font-black text-sm shadow-2xs">
                      ₹
                    </div>
                    <div>
                      <div className="font-black text-xs text-sanctuary-dark flex items-center gap-1.5">
                        <span>Razorpay Secure Online Checkout</span>
                        <span className="text-[9px] font-black px-1.5 py-0.2 rounded bg-emerald-600 text-white uppercase tracking-wider">
                          Verified
                        </span>
                      </div>
                      <div className="text-[10px] text-emerald-800 font-bold mt-0.5">
                        Instant Slot & Suite Confirmation
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-1.5 pt-1 text-center">
                  <div className="p-1.5 bg-white rounded-xl border border-black/5 text-[10px] font-bold text-sanctuary-dark">
                    ⚡ UPI (GPay/PhonePe)
                  </div>
                  <div className="p-1.5 bg-white rounded-xl border border-black/5 text-[10px] font-bold text-sanctuary-dark">
                    💳 Cards (Debit/Credit)
                  </div>
                  <div className="p-1.5 bg-white rounded-xl border border-black/5 text-[10px] font-bold text-sanctuary-dark">
                    🏦 NetBanking & Wallets
                  </div>
                </div>

                <p className="text-[10px] text-sanctuary-dark/65 font-medium leading-relaxed">
                  Your reservation is verified instantly upon payment. You will receive an immediate booking confirmation ID, receipt, and Google Maps directions link.
                </p>
              </div>

              {paymentNotice && (
                <div className="p-2.5 bg-amber-50 border border-amber-300 rounded-xl text-[11px] font-bold text-amber-900 flex items-center gap-2 shadow-xs">
                  <span className="material-symbols-outlined text-amber-600 text-sm shrink-0">info</span>
                  <span>{paymentNotice}</span>
                </div>
              )}

              {/* In-App Browser Warning (WhatsApp / Instagram) */}
              {isInAppBrowser && (
                <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-300 text-xs space-y-2">
                  <div className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-amber-700 text-base shrink-0 mt-0.5">
                      open_in_browser
                    </span>
                    <div>
                      <h5 className="font-black text-amber-950 text-xs">
                        In-App Browser Detected (WhatsApp / Instagram)
                      </h5>
                      <p className="text-[11px] text-amber-900/80 mt-0.5 font-medium leading-relaxed">
                        UPI apps (GPay, PhonePe, Paytm) require opening in Chrome for seamless app auto-redirect.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2 pt-0.5">
                    <button
                      type="button"
                      onClick={() => {
                        if (typeof navigator !== 'undefined') {
                          navigator.clipboard.writeText(window.location.href);
                          setCopiedSiteLink(true);
                          setTimeout(() => setCopiedSiteLink(false), 2000);
                        }
                      }}
                      className="flex-1 py-2 px-3 bg-amber-200/90 hover:bg-amber-300 text-amber-950 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1 shadow-xs"
                    >
                      <span className="material-symbols-outlined text-xs">
                        {copiedSiteLink ? 'check' : 'content_copy'}
                      </span>
                      <span>{copiedSiteLink ? 'Link Copied!' : 'Copy Site Link'}</span>
                    </button>
                    {typeof window !== 'undefined' && /android/i.test(navigator.userAgent) && (
                      <a
                        href={`intent://${window.location.host}${window.location.pathname}#Intent;scheme=https;package=com.android.chrome;end`}
                        className="flex-1 py-2 px-3 bg-sanctuary-forest hover:bg-black text-white rounded-xl text-[10px] font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1 shadow-xs"
                      >
                        <span className="material-symbols-outlined text-xs text-sanctuary-gold">open_in_new</span>
                        <span>Open in Chrome</span>
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>

          </div>
        )}

        {/* ============================================================ */}
        {/* COMPACT MODAL FOOTER BAR */}
        {/* ============================================================ */}
        {!bookingSuccess && (
          <div className="bg-sanctuary-forest text-white border-t border-black/10 shrink-0">
            {/* In-Studio Visit Pre-Payment Banner */}
            <div className="px-3.5 py-1.5 bg-[#071727] text-white/90 text-[10px] font-bold flex items-center justify-between gap-2 border-b border-white/10">
              <div className="flex items-center gap-1.5 truncate">
                <span className="material-symbols-outlined text-sanctuary-gold text-xs shrink-0">storefront</span>
                <span className="truncate">
                  <strong>In-Studio Service:</strong> Book online here & bring your pet to our <strong>Kanakapura Road Studio</strong> on appointment day!
                </span>
              </div>
              <a
                href={STUDIO_MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[9px] text-sanctuary-gold hover:underline shrink-0 uppercase tracking-wider font-black flex items-center gap-0.5"
              >
                <span>Maps</span>
                <span className="material-symbols-outlined text-[10px]">open_in_new</span>
              </a>
            </div>

            <div className="p-3.5 sm:p-4 flex items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-white/70">
                    Final Payable:
                  </span>
                  {totalSavings > 0 && (
                    <span className="text-[10px] line-through text-red-400 font-bold decoration-red-400">
                      ₹{grossOriginalTotal}
                    </span>
                  )}
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-xl sm:text-2xl font-black text-sanctuary-gold">₹{finalTotal}</span>
                  {totalSavings > 0 && (
                    <span className="text-[10px] font-black text-emerald-300">
                      (Saved ₹{totalSavings}!)
                    </span>
                  )}
                </div>
              </div>

              <button
                onClick={handleConfirmOrder}
                disabled={isProcessing || !currentUser || selectedServices.filter((s) => !s.isFreePerk).length === 0}
                className="py-2.5 px-5 bg-sanctuary-gold hover:bg-amber-400 text-sanctuary-dark font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
              >
                <span>
                  {isProcessing
                    ? 'Connecting Razorpay...'
                    : !currentUser
                    ? 'Sign In to Book'
                    : selectedServices.filter((s) => !s.isFreePerk).length === 0
                    ? 'Add a Service'
                    : `Pay ₹${finalTotal} & Reserve Visit`}
                </span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* RAZORPAY GATEWAY SIMULATION MODAL */}
        {/* ============================================================ */}
        <AnimatePresence>
          {showRazorpaySimModal && simulatedOrderData && (
            <div className="fixed inset-0 z-[250] flex items-center justify-center p-3 bg-black/75 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white rounded-2xl max-w-sm w-full overflow-hidden shadow-2xl border border-black/10 text-left"
              >
                <div className="bg-[#0C2340] text-white p-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="size-7 rounded-lg bg-white/10 flex items-center justify-center font-black text-sanctuary-gold text-xs">
                      ₹
                    </div>
                    <div>
                      <div className="text-xs font-black text-white/90">Razorpay Gateway</div>
                      <div className="text-[9px] text-white/60">Snip & Style Pet Sanctuary</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[9px] text-white/60">Payable Amount</div>
                    <div className="text-sm font-black text-white">₹{Math.round(simulatedOrderData.amountPaise / 100)}</div>
                  </div>
                </div>

                <div className="p-4 space-y-3">
                  <div className="p-2.5 bg-blue-50 rounded-xl border border-blue-200 text-xs text-blue-900 space-y-0.5">
                    <div className="font-black text-[11px] flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs text-blue-600">verified</span>
                      <span>Ready for Instant Payment</span>
                    </div>
                    <p className="text-[10px] text-blue-800">
                      Order: <code className="font-mono font-bold">{simulatedOrderData.orderId}</code>
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <div className="p-2 rounded-xl border border-black/10 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-emerald-600 text-sm">account_balance_wallet</span>
                        <span className="text-[11px] font-bold">UPI (GPay / PhonePe / Paytm)</span>
                      </div>
                      <span className="text-[10px] font-black text-emerald-600 uppercase">Fast</span>
                    </div>

                    <div className="p-2 rounded-xl border border-black/10 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-blue-600 text-sm">credit_card</span>
                        <span className="text-[11px] font-bold">Credit & Debit Cards</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-1 space-y-1.5">
                    <button
                      type="button"
                      disabled={isSimulatingPayment}
                      onClick={() => handleCompleteRazorpaySim(true)}
                      className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-sm transition-all disabled:opacity-50"
                    >
                      {isSimulatingPayment ? (
                        <>
                          <div className="size-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Processing with Bank...</span>
                        </>
                      ) : (
                        <span>Simulate Pay ₹{Math.round(simulatedOrderData.amountPaise / 100)}</span>
                      )}
                    </button>

                    <button
                      type="button"
                      disabled={isSimulatingPayment}
                      onClick={() => handleCompleteRazorpaySim(false)}
                      className="w-full py-1 text-sanctuary-dark/60 text-[10px] font-bold uppercase tracking-wider hover:text-black"
                    >
                      Cancel Simulation
                    </button>
                  </div>
                </div>

                <div className="p-2 bg-sanctuary-sand/40 border-t border-black/5 text-center text-[9px] text-sanctuary-dark/50 flex items-center justify-center gap-1">
                  <span className="material-symbols-outlined text-[10px]">lock</span>
                  <span>256-bit SSL Bank Encrypted</span>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* ============================================================ */}
        {/* CONFIRM COMPANION & PET SIZE MODAL */}
        {/* ============================================================ */}
        <AnimatePresence>
          {confirmModalData && (
            <div className="fixed inset-0 z-[260] flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md">
              <motion.div
                initial={{ opacity: 0, scale: 0.92, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.92, y: 15 }}
                className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-black/10 text-left flex flex-col max-h-[90vh]"
              >
                {/* Header */}
                <div className="bg-sanctuary-forest text-white p-4 flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-2.5">
                    <div className="size-9 rounded-xl bg-sanctuary-gold text-sanctuary-dark flex items-center justify-center font-black">
                      <span className="material-symbols-outlined text-lg">pets</span>
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-white">Confirm Pet Size & Tier</h3>
                      <p className="text-[10px] text-white/70 truncate max-w-[210px]">
                        {confirmModalData.serviceTitle}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setConfirmModalData(null)}
                    className="size-7 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
                  >
                    <span className="material-symbols-outlined text-sm">close</span>
                  </button>
                </div>

                {/* Body */}
                <div className="p-4 overflow-y-auto space-y-3.5 text-xs">
                  <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200/80 text-[11px] text-amber-950 font-bold leading-relaxed flex items-start gap-2">
                    <span className="material-symbols-outlined text-amber-700 text-sm shrink-0 mt-0.5">verified</span>
                    <div>
                      <strong>Accurate Pricing Guarantee:</strong> Please confirm your companion's species and weight tier so our suite caretakers & stylists prepare the exact amenities.
                    </div>
                  </div>

                  {/* Step 1: Species Selection */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-black uppercase tracking-wider text-sanctuary-dark/70 block">
                      1. Select Companion Species
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setConfirmPetType('dog')}
                        className={`p-2.5 rounded-xl border text-center transition-all flex items-center justify-center gap-2 ${
                          confirmPetType === 'dog'
                            ? 'bg-sanctuary-forest text-white border-sanctuary-forest shadow-xs font-black'
                            : 'bg-white border-black/10 text-sanctuary-dark font-bold hover:border-black/30'
                        }`}
                      >
                        <span className="text-base">🐕</span>
                        <span>Dog / Canine</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmPetType('cat')}
                        className={`p-2.5 rounded-xl border text-center transition-all flex items-center justify-center gap-2 ${
                          confirmPetType === 'cat'
                            ? 'bg-sanctuary-forest text-white border-sanctuary-forest shadow-xs font-black'
                            : 'bg-white border-black/10 text-sanctuary-dark font-bold hover:border-black/30'
                        }`}
                      >
                        <span className="text-base">🐈</span>
                        <span>Cat / Feline</span>
                      </button>
                    </div>
                  </div>

                  {/* Step 2: Weight Tier if Dog */}
                  {confirmPetType === 'dog' ? (
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-black uppercase tracking-wider text-sanctuary-dark/70 block">
                        2. Select Dog Weight Tier
                      </span>
                      <div className="grid grid-cols-1 gap-2">
                        {[
                          {
                            id: 'small',
                            title: 'Small Dog (< 10 kg)',
                            desc: 'Shih Tzu, Lhasa, Pomeranian, Pug, Maltese, Chihuahua, Dachshund',
                          },
                          {
                            id: 'medium',
                            title: 'Medium Dog (10 – 25 kg)',
                            desc: 'Beagle, Cocker Spaniel, French Bulldog, Indie / Desi, Corgi, Spitz',
                          },
                          {
                            id: 'large',
                            title: 'Large Dog (> 25 kg)',
                            desc: 'Golden Retriever, Labrador, German Shepherd, Husky, Boxer, Rottweiler',
                          },
                        ].map((tier) => (
                          <div
                            key={tier.id}
                            onClick={() => setConfirmDogSize(tier.id as any)}
                            className={`p-2.5 rounded-xl border cursor-pointer transition-all flex items-start justify-between ${
                              confirmDogSize === tier.id
                                ? 'bg-amber-50 border-amber-500 ring-2 ring-amber-400 font-black shadow-xs'
                                : 'bg-white border-black/10 hover:border-black/30'
                            }`}
                          >
                            <div>
                              <div className="text-xs font-black text-sanctuary-dark">{tier.title}</div>
                              <div className="text-[10px] text-sanctuary-dark/65 font-medium mt-0.5">{tier.desc}</div>
                            </div>
                            <input
                              type="radio"
                              name="confirm_dog_size"
                              checked={confirmDogSize === tier.id}
                              onChange={() => setConfirmDogSize(tier.id as any)}
                              className="size-4 accent-amber-600 shrink-0 mt-0.5"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    /* Step 2: Cat Profile Tier */
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-black uppercase tracking-wider text-sanctuary-dark/70 block">
                        2. Select Cat Profile Tier
                      </span>
                      <div className="grid grid-cols-1 gap-2">
                        <div
                          onClick={() => setConfirmCatType('neutered')}
                          className={`p-2.5 rounded-xl border cursor-pointer transition-all flex items-start justify-between ${
                            confirmCatType === 'neutered'
                              ? 'bg-amber-50 border-amber-500 ring-2 ring-amber-400 font-black shadow-xs'
                              : 'bg-white border-black/10 hover:border-black/30'
                          }`}
                        >
                          <div>
                            <div className="text-xs font-black text-sanctuary-dark">Neutered / Spayed Cat</div>
                            <div className="text-[10px] text-sanctuary-dark/65 font-medium mt-0.5">
                              Calm socialization & stress-free communal suite (₹625 / nt)
                            </div>
                          </div>
                          <input
                            type="radio"
                            name="confirm_cat_type"
                            checked={confirmCatType === 'neutered'}
                            onChange={() => setConfirmCatType('neutered')}
                            className="size-4 accent-amber-600 shrink-0 mt-0.5"
                          />
                        </div>

                        <div
                          onClick={() => setConfirmCatType('non-neutered')}
                          className={`p-2.5 rounded-xl border cursor-pointer transition-all flex items-start justify-between ${
                            confirmCatType === 'non-neutered'
                              ? 'bg-amber-50 border-amber-500 ring-2 ring-amber-400 font-black shadow-xs'
                              : 'bg-white border-black/10 hover:border-black/30'
                          }`}
                        >
                          <div>
                            <div className="text-xs font-black text-sanctuary-dark">Non-Neutered Cat</div>
                            <div className="text-[10px] text-sanctuary-dark/65 font-medium mt-0.5">
                              Dedicated private individual partitioned suite & attention (₹750 / nt)
                            </div>
                          </div>
                          <input
                            type="radio"
                            name="confirm_cat_type"
                            checked={confirmCatType === 'non-neutered'}
                            onChange={() => setConfirmCatType('non-neutered')}
                            className="size-4 accent-amber-600 shrink-0 mt-0.5"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 3: Nights Stepper if Boarding */}
                  {confirmModalData.category === 'boarding' && (
                    <div className="space-y-2 p-3 bg-sanctuary-sand/50 rounded-2xl border border-black/10">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-wider text-sanctuary-dark">
                          Stay Duration (Nights)
                        </span>
                        {confirmNights >= 6 && (
                          <span className="text-[9px] font-black text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300">
                            🎁 1 Day FREE with STAY6FREE1
                          </span>
                        )}
                      </div>

                      {confirmModalData.existingItemId ? (
                        <div className="p-2 bg-white rounded-xl border border-black/10 flex items-center justify-between">
                          <span className="text-xs font-black text-sanctuary-dark">
                            {confirmNights} Night{confirmNights > 1 ? 's' : ''} Stay (Selected)
                          </span>
                          <span className="text-[9px] text-sanctuary-dark/60 font-semibold bg-sanctuary-sand px-2 py-0.5 rounded-full">
                            Editable in cart
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => setConfirmNights((prev) => Math.max(1, prev - 1))}
                              disabled={confirmNights <= 1}
                              className="size-8 rounded-xl bg-white border border-black/15 hover:bg-black/5 disabled:opacity-30 disabled:cursor-not-allowed font-black text-base flex items-center justify-center transition-all shadow-2xs"
                            >
                              -
                            </button>
                            <span className="text-sm font-black font-mono w-14 text-center">
                              {confirmNights} nt{confirmNights > 1 ? 's' : ''}
                            </span>
                            <button
                              type="button"
                              onClick={() => setConfirmNights((prev) => Math.min(60, prev + 1))}
                              className="size-8 rounded-xl bg-white border border-black/15 hover:bg-black/5 font-black text-base flex items-center justify-center transition-all shadow-2xs"
                            >
                              +
                            </button>
                          </div>

                          {/* Quick preset chips */}
                          <div className="flex items-center gap-1">
                            {[2, 4, 6, 10].map((n) => (
                              <button
                                key={n}
                                type="button"
                                onClick={() => setConfirmNights(n)}
                                className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all ${
                                  confirmNights === n
                                    ? 'bg-sanctuary-forest text-white'
                                    : 'bg-white border border-black/10 hover:border-black/30 text-sanctuary-dark'
                                }`}
                              >
                                {n}d{n === 6 ? ' ⭐' : ''}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      <p className="text-[10px] text-sanctuary-dark/65 font-medium">
                        Check-in at {checkInDate || 'selected date'} → Estimated check-out on {calculateCheckoutDate(checkInDate || new Date().toISOString().split('T')[0], confirmNights)}.
                      </p>
                    </div>
                  )}

                  {/* Calculated Price Breakdown */}
                  {(() => {
                    const calculated = getServicePriceForPet(
                      confirmModalData.serviceKey,
                      confirmModalData.category,
                      confirmPetType,
                      confirmDogSize,
                      confirmCatType,
                      confirmNights
                    );
                    const savings = calculated.origPrice - calculated.price;
                    return (
                      <div className="p-3 bg-gradient-to-br from-amber-50 to-orange-50/40 rounded-2xl border border-amber-300 flex items-center justify-between">
                        <div>
                          <span className="text-[9px] font-black uppercase tracking-wider text-amber-900 block">
                            Calculated Rate Preview
                          </span>
                          <div className="flex items-baseline gap-2 mt-0.5">
                            <span className="text-base font-black text-sanctuary-dark">
                              ₹{calculated.price}
                            </span>
                            <span className="text-xs line-through text-red-500 font-bold">
                              ₹{calculated.origPrice}
                            </span>
                            {savings > 0 && (
                              <span className="text-[10px] font-black text-emerald-700">
                                Save ₹{savings}
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-sanctuary-dark/60 font-medium">
                            {calculated.subtitle}
                          </span>
                        </div>

                        <span className="text-2xl">✨</span>
                      </div>
                    );
                  })()}
                </div>

                {/* Footer Buttons */}
                <div className="p-3.5 bg-sanctuary-sand/40 border-t border-black/10 flex items-center justify-end gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => setConfirmModalData(null)}
                    className="py-2 px-3.5 rounded-xl border border-black/10 hover:bg-black/5 text-xs font-bold text-sanctuary-dark"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmAndAddService}
                    className="py-2 px-4 rounded-xl bg-sanctuary-gold hover:bg-amber-400 text-sanctuary-dark font-black text-xs uppercase tracking-wider shadow-xs flex items-center gap-1.5"
                  >
                    <span>{confirmModalData.existingItemId ? 'Update Service' : 'Confirm & Add to Cart'}</span>
                    <span className="material-symbols-outlined text-sm">check</span>
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
    </div>
  );

  if (isFullPage) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] text-sanctuary-dark flex flex-col">
        {/* Full Page Header */}
        <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-black/5 px-4 sm:px-6 py-2.5">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <a href="/" className="flex items-center select-none py-0.5">
              <img
                src="/images/logo.png"
                alt="Snip & Style Pet Grooming"
                className="h-10 sm:h-12 w-auto object-contain rounded-lg"
              />
            </a>

            <div className="flex items-center gap-2 sm:gap-3">
              <div className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
                <span className="material-symbols-outlined text-sm text-emerald-700">lock</span>
                <span>256-Bit SSL Secured</span>
              </div>

              <a
                href="/"
                className="inline-flex items-center gap-1 text-xs font-bold text-sanctuary-dark/70 hover:text-sanctuary-dark px-3 py-1.5 rounded-xl border border-black/10 hover:border-black/20 hover:bg-black/5 transition-all"
              >
                <span className="material-symbols-outlined text-sm">arrow_back</span>
                <span>Back to Home</span>
              </a>
            </div>
          </div>
        </header>

        {/* Full Page Main */}
        <main className="flex-1 py-6 sm:py-10 px-3 sm:px-6 flex flex-col items-center">
          <div className="w-full max-w-xl">
            {/* Top breadcrumb & studio location banner */}
            <div className="mb-4 bg-white/80 rounded-2xl p-3 border border-black/5 flex items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-2.5">
                <div className="size-8 rounded-lg bg-sanctuary-forest text-sanctuary-gold flex items-center justify-center font-black">
                  <span className="material-symbols-outlined text-base">storefront</span>
                </div>
                <div>
                  <p className="text-xs font-black text-sanctuary-dark">Snip & Style Studio Reservation</p>
                  <p className="text-[10px] text-amber-900 font-bold">📍 Kanakapura Main Road, Bangalore (Near Shani Mahatma Temple)</p>
                </div>
              </div>
              <a
                href={STUDIO_MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] font-black uppercase tracking-wider text-sanctuary-forest hover:underline shrink-0 flex items-center gap-0.5"
              >
                <span>Maps</span>
                <span className="material-symbols-outlined text-xs">open_in_new</span>
              </a>
            </div>

            {cardInnerContent}
          </div>
        </main>

        {/* Full Page Footer */}
        <footer className="py-6 px-4 bg-white border-t border-black/5 text-center text-xs text-sanctuary-dark/60 font-medium">
          <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
            <p>© {new Date().getFullYear()} Snip & Style. All rights reserved.</p>
            <div className="flex items-center gap-4 text-xs font-semibold">
              <a href="/terms" className="hover:underline">Terms of Service</a>
              <span>•</span>
              <a href="/privacy" className="hover:underline">Privacy Policy</a>
              <span>•</span>
              <a href="tel:+919739887770" className="hover:underline">+91 9739887770</a>
            </div>
          </div>
        </footer>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-2 sm:p-4 bg-black/70 backdrop-blur-md overflow-hidden">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 10 }}
        className="w-full max-w-lg"
      >
        {cardInnerContent}
      </motion.div>
    </div>
  );
};

export default CheckoutModal;
