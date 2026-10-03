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
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  initialBooking,
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

  // 4. Timing & Transport
  const [checkInDate, setCheckInDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [preferredTimeSlot, setPreferredTimeSlot] = useState('Morning (09:30 AM – 01:00 PM)');
  const [includePetTaxi, setIncludePetTaxi] = useState<boolean>(false);

  // 5. Individual Quick-Care Add-ons
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);

  // 6. Coupons (Exclusively: FREESPA, FREESPA8, FREESPA15, GROOM10)
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discountPercent?: number;
    flatDiscount?: number;
    label: string;
    isFreePerk?: boolean;
  } | null>(null);
  const [couponError, setCouponError] = useState('');

  // 7. Payment Choice & Razorpay Simulator
  const [paymentChoice, setPaymentChoice] = useState<'razorpay' | 'studio'>('razorpay');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [showRazorpaySimModal, setShowRazorpaySimModal] = useState<boolean>(false);
  const [simulatedOrderData, setSimulatedOrderData] = useState<{
    bookingId: string;
    bookingRef: string;
    orderId: string;
    amountPaise: number;
  } | null>(null);
  const [isSimulatingPayment, setIsSimulatingPayment] = useState<boolean>(false);

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
  } | null>(null);

  // Verified Exclusive Coupons
  const availableCoupons = [
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
      if (initialBooking) {
        if (initialBooking.petType) setPetType(initialBooking.petType);
        if (initialBooking.petSize) setPetSize(initialBooking.petSize);
        if (initialBooking.catType) setCatType(initialBooking.catType);

        const nightsCount = initialBooking.nights || (initialBooking.type === 'boarding' ? 4 : 1);
        const calculatedPrice = initialBooking.type === 'boarding'
          ? initialBooking.basePrice * nightsCount
          : initialBooking.basePrice;
        const calculatedOrig = initialBooking.type === 'boarding'
          ? (initialBooking.origPrice || (initialBooking.basePrice + 125)) * nightsCount
          : (initialBooking.origPrice || initialBooking.basePrice + 150);

        const primaryItem: CheckoutServiceItem = {
          id: `srv_${Date.now()}`,
          category: initialBooking.type,
          name: initialBooking.serviceName,
          subtitle: initialBooking.type === 'boarding' ? `${nightsCount} Nights Stay` : `${(initialBooking.petSize || 'small').toUpperCase()} Tier`,
          price: calculatedPrice,
          origPrice: calculatedOrig,
          nights: initialBooking.type === 'boarding' ? nightsCount : undefined,
        };

        const initialList: CheckoutServiceItem[] = [primaryItem];
        const requestedCode = (initialBooking.appliedCouponCode || initialBooking.couponCode || '').trim().toUpperCase();

        if (requestedCode === 'FREESPA' && initialBooking.type === 'boarding' && nightsCount >= 4) {
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
        } else if (requestedCode === 'FREESPA8' && initialBooking.type === 'boarding' && nightsCount >= 8) {
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
        } else if (requestedCode === 'FREESPA15' && initialBooking.type === 'boarding' && nightsCount >= 15) {
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
        } else if (requestedCode === 'GROOM10' && initialBooking.type === 'grooming' && calculatedPrice >= 1000) {
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

  // Add a Service to Cart
  const handleAddService = (category: 'boarding' | 'grooming', name: string, price: number, origPrice: number, subtitle?: string, nightsCount?: number) => {
    const newItem: CheckoutServiceItem = {
      id: `srv_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      category,
      name,
      subtitle: subtitle || (category === 'boarding' ? `${nightsCount || 4} Nights` : 'Package'),
      price: category === 'boarding' ? price * (nightsCount || 4) : price,
      origPrice: category === 'boarding' ? origPrice * (nightsCount || 4) : origPrice,
      nights: category === 'boarding' ? (nightsCount || 4) : undefined,
    };
    setSelectedServices((prev) => [...prev, newItem]);
    setShowAddServiceDropdown(false);
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

    if (selectedServices.filter((s) => !s.isFreePerk).length <= 1) {
      alert('You must have at least one paid service in your checkout.');
      return;
    }

    const remaining = selectedServices.filter((s) => s.id !== id);
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

  // Apply Coupon (FREESPA, FREESPA8, FREESPA15, GROOM10)
  const applyCouponCode = (codeToApply: string) => {
    setCouponError('');
    const code = codeToApply.trim().toUpperCase();

    if (!code) {
      setCouponError('Please enter a coupon code.');
      return;
    }

    // 1. Boarding Free Spa Perks
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

    // 2. Grooming 10% OFF on spend above ₹999
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

      // If user had a free spa perk, remove it when switching to grooming coupon
      setSelectedServices((prev) => prev.filter((s) => !s.isFreePerk));
      setAppliedCoupon({
        code: 'GROOM10',
        discountPercent: 10,
        label: '10% OFF Grooming (Above ₹999)',
      });
      setCouponInput('');
      return;
    }

    setCouponError('Invalid coupon. Choose from FREESPA, FREESPA8, FREESPA15, or GROOM10.');
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

  // Coupon discount calculation
  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.code === 'GROOM10') {
      const groomingSubtotal = selectedServices
        .filter((s) => s.category === 'grooming' && !s.isFreePerk)
        .reduce((sum, s) => sum + s.price, 0);
      if (groomingSubtotal >= 1000) {
        discountAmount = Math.round(groomingSubtotal * 0.10);
      }
    } else if (appliedCoupon.discountPercent) {
      discountAmount = Math.round((subtotal * appliedCoupon.discountPercent) / 100);
    } else if (appliedCoupon.flatDiscount) {
      discountAmount = appliedCoupon.flatDiscount;
    }
  }

  const finalTotal = Math.max(0, subtotal - discountAmount);
  const totalSavings = Math.max(0, (grossOriginalTotal - subtotal) + discountAmount);

  // Submit Booking
  const handleConfirmOrder = async () => {
    if (!currentUser) {
      alert('Please sign in or register with your phone number to complete order.');
      return;
    }
    if (!petName.trim()) {
      alert('Please enter your companion’s name.');
      return;
    }

    setIsProcessing(true);

    try {
      const token = localStorage.getItem('snip_auth_token');
      const authHeaders: any = { 'Content-Type': 'application/json' };
      if (token) authHeaders.Authorization = `Bearer ${token}`;

      const primaryService = selectedServices[0];
      const serviceNamesSummary = selectedServices.map((s) => s.name).join(' + ');

      const bookingPayload = {
        parentName: currentUser.fullName || 'Pet Parent',
        phone: currentUser.phone || authPhone,
        email: currentUser.email || `${currentUser.phone}@snipandstyle.pet`,
        petName: petName.trim(),
        petBreed: petBreed.trim() || (petType === 'cat' ? 'Feline' : `${petSize.toUpperCase()} Dog`),
        petWeightKg: petType === 'cat' ? 4.5 : petSize === 'small' ? 7.5 : petSize === 'medium' ? 18.0 : 32.0,
        serviceType: serviceNamesSummary,
        services_json: selectedServices,
        checkInDate: checkInDate,
        checkOutDate: checkInDate,
        dropOffTime: preferredTimeSlot,
        numberOfDays: primaryService.nights || 1,
        baseAmount: servicesBaseTotal,
        addonsAmount: addonsTotal + taxiTotal,
        discountAmount: discountAmount,
        totalAmount: finalTotal,
        isHighwayEarlyDropoff: true,
        appliedOfferCode: appliedCoupon?.code || null,
        specialInstructions: `${petGender.toUpperCase()} • Special notes: ${specialInstructions || 'None'}`,
        paymentStatus: paymentChoice === 'razorpay' ? 'pending' : 'pending_studio',
        paymentMethod: paymentChoice === 'razorpay' ? 'razorpay_gateway' : 'pay_at_studio',
      };

      // 1. Create booking in Neon DB
      const createRes = await fetch('/api/bookings', {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify(bookingPayload),
      });

      const createData = await createRes.json();
      if (!createRes.ok) {
        throw new Error(createData.error || 'Failed to record booking.');
      }

      const bookingId = createData.bookingId;
      const bookingRef = createData.bookingRef;

      if (paymentChoice === 'razorpay') {
        // Step 1: Call Backend to Create Razorpay Order
        const rzpRes = await fetch('/api/create-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: finalTotal * 100, // in paise
            currency: 'INR',
            receipt: bookingRef,
            notes: {
              bookingId,
              bookingRef,
              petName: bookingPayload.petName,
            },
          }),
        });

        const rzpOrder = await rzpRes.json();
        if (!rzpRes.ok) {
          throw new Error(rzpOrder.error || 'Failed to create Razorpay payment order.');
        }

        const rzpKeyId = rzpOrder.key_id || (import.meta as any).env?.VITE_RAZORPAY_KEY_ID || 'rzp_live_TjVYMuSit6eIYP';

        // Ensure Razorpay SDK is loaded on page
        if (typeof (window as any).Razorpay === 'undefined') {
          await new Promise<void>((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.async = true;
            script.onload = () => resolve();
            script.onerror = () => reject(new Error('Failed to load Razorpay SDK. Please check your internet connection.'));
            document.head.appendChild(script);
          });
        }

        // Step 2: Open Razorpay Standard Web Checkout Modal
        const rzpOptions: any = {
          key: rzpKeyId,
          amount: rzpOrder.amount,
          currency: rzpOrder.currency || 'INR',
          name: 'Snip & Style',
          description: `${serviceNamesSummary} • Ref: ${bookingRef}`,
          image: '/images/logo.png',
          order_id: rzpOrder.order_id || rzpOrder.id,
          handler: async function (response: any) {
            try {
              setIsProcessing(true);
              // Step 3: Send order_id, payment_id, signature to Backend for HMAC verification
              const verifyRes = await fetch('/api/verify-payment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  order_id: response.razorpay_order_id,
                  payment_id: response.razorpay_payment_id,
                  signature: response.razorpay_signature,
                  bookingId: bookingId,
                }),
              });

              const verifyData = await verifyRes.json();
              if (!verifyRes.ok || !verifyData.success) {
                throw new Error(verifyData.error || 'Payment signature verification failed.');
              }

              // Display confirmed booking success screen
              setBookingSuccess({
                bookingRef,
                bookingId,
                paymentStatus: 'Paid & Confirmed (Razorpay Verified)',
                paymentMethod: `Razorpay Online Gateway (${response.razorpay_payment_id})`,
                servicesCount: selectedServices.length,
                totalAmount: finalTotal,
                totalSavings,
                date: `${checkInDate} (${preferredTimeSlot})`,
                pet: `${petName.trim()}`,
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
            contact: bookingPayload.phone,
            email: bookingPayload.email,
          },
          notes: {
            bookingId,
            bookingRef,
            petName: bookingPayload.petName,
          },
          theme: {
            color: '#0B1A14', // Sanctuary Forest green
          },
          modal: {
            ondismiss: function () {
              console.log('Razorpay checkout modal closed by user');
              setIsProcessing(false);
            },
          },
        };

        const rzp = new (window as any).Razorpay(rzpOptions);

        rzp.on('payment.failed', function (failResp: any) {
          console.error('[Razorpay Payment Failed]', failResp.error);
          alert(`Payment Failed: ${failResp.error?.description || 'Your payment was declined by the bank/gateway.'}`);
          setIsProcessing(false);
        });

        rzp.open();
      } else {
        // Pay at Studio
        setBookingSuccess({
          bookingRef,
          bookingId,
          paymentStatus: 'Confirmed (Pay at Studio Upon Drop-off)',
          paymentMethod: 'Pay at Studio (Card / Cash / UPI on Arrival)',
          servicesCount: selectedServices.length,
          totalAmount: finalTotal,
          totalSavings,
          date: `${checkInDate} (${preferredTimeSlot})`,
          pet: `${petName.trim()}`,
        });
      }
    } catch (err: any) {
      console.error(err);
      alert('Error placing order: ' + err.message);
    } finally {
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
      });
    } catch (err: any) {
      alert('Verification error: ' + err.message);
    } finally {
      setIsSimulatingPayment(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-2 sm:p-4 bg-black/70 backdrop-blur-md overflow-hidden">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 10 }}
        className="bg-white rounded-3xl max-w-lg w-full max-h-[92vh] flex flex-col shadow-2xl border border-black/10 overflow-hidden text-left relative"
      >
        {/* Top Gold Stripe */}
        <div className="h-1.5 bg-gradient-to-r from-sanctuary-gold via-amber-400 to-sanctuary-forest shrink-0" />

        {/* Compact Modal Header */}
        <div className="px-4 py-3 sm:px-5 sm:py-3.5 flex items-center justify-between border-b border-black/5 bg-[#FAF8F5] shrink-0">
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-lg bg-sanctuary-forest text-sanctuary-gold flex items-center justify-center font-black">
              <span className="material-symbols-outlined text-base">shopping_bag</span>
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-black text-sanctuary-dark leading-tight">
                Review & Checkout
              </h2>
              <p className="text-[10px] text-sanctuary-dark/60 font-semibold">
                Kanakapura Highway (NH 948) • Direct Neon DB Sync
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="size-7 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center transition-colors text-sanctuary-dark"
          >
            <span className="material-symbols-outlined text-xs">close</span>
          </button>
        </div>

        {/* ============================================================ */}
        {/* SUCCESS CONFIRMATION VIEW */}
        {/* ============================================================ */}
        {bookingSuccess ? (
          <div className="p-5 sm:p-6 text-center space-y-3.5 overflow-y-auto">
            <div className="size-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-inner">
              <span className="material-symbols-outlined text-2xl">check_circle</span>
            </div>

            <div>
              <h3 className="text-xl font-black text-sanctuary-dark">
                Booking Confirmed!
              </h3>
              <p className="text-[11px] text-sanctuary-dark/70 font-medium">
                Your reservation has been recorded in Neon PostgreSQL database.
              </p>
            </div>

            {/* Savings Highlight Badge */}
            {bookingSuccess.totalSavings > 0 && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-black">
                <span>🎉 Total Savings on this Booking:</span>
                <span className="text-emerald-950 font-black">₹{bookingSuccess.totalSavings}</span>
              </div>
            )}

            <div className="p-3 bg-sanctuary-sand/60 rounded-xl border border-black/10 text-xs space-y-1.5 text-left">
              <div className="flex justify-between items-center pb-1 border-b border-black/5">
                <span className="text-sanctuary-dark/60 font-semibold">Booking ID:</span>
                <span className="font-mono font-black text-sanctuary-forest bg-white px-2 py-0.5 rounded border border-black/10">
                  {bookingSuccess.bookingRef}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sanctuary-dark/60 font-semibold">Status:</span>
                <span className="font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                  {bookingSuccess.paymentStatus}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sanctuary-dark/60 font-semibold">Companion:</span>
                <span className="font-bold text-sanctuary-dark">{bookingSuccess.pet}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sanctuary-dark/60 font-semibold">Timing:</span>
                <span className="font-bold text-sanctuary-dark">{bookingSuccess.date}</span>
              </div>
              <div className="flex justify-between items-center pt-1 border-t border-black/5">
                <span className="text-sanctuary-dark/60 font-semibold">Total Paid/Payable:</span>
                <span className="font-black text-sanctuary-dark text-sm">₹{bookingSuccess.totalAmount}</span>
              </div>
            </div>

            <div className="flex gap-2 pt-1 justify-center">
              <button
                onClick={() => { setBookingSuccess(null); onClose(); }}
                className="py-2 px-5 bg-sanctuary-forest hover:bg-black text-white rounded-xl text-xs font-black uppercase tracking-wider transition-colors shadow-sm"
              >
                Done
              </button>
              <button
                onClick={() => {
                  setBookingSuccess(null);
                  onClose();
                  window.dispatchEvent(new CustomEvent('snip_open_auth'));
                }}
                className="py-2 px-5 bg-sanctuary-sand hover:bg-black/10 text-sanctuary-dark rounded-xl text-xs font-black uppercase tracking-wider transition-colors border border-black/10"
              >
                View Account
              </button>
            </div>
          </div>
        ) : (
          /* ============================================================ */
          /* SCROLLABLE COMPACT CHECKOUT BODY */
          /* ============================================================ */
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5 max-h-[64vh]">

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
                <div className="p-2 bg-white rounded-xl border border-sanctuary-gold shadow-md space-y-1 text-xs">
                  <div className="text-[10px] font-black text-sanctuary-dark/50 uppercase tracking-wider px-1">
                    Choose Service to Add:
                  </div>
                  <div className="grid grid-cols-2 gap-1">
                    <button
                      type="button"
                      onClick={() => handleAddService('grooming', 'Furry Fresh Hygiene Bath', 499, 649, 'Hygiene Refresh')}
                      className="p-1.5 rounded-lg border border-black/10 text-left hover:bg-sanctuary-sand"
                    >
                      <div className="font-bold text-[11px]">Furry Fresh</div>
                      <div className="text-[10px] text-sanctuary-dark/60 font-black">₹499 (was ₹649)</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAddService('grooming', 'Special Package Care', 899, 1124, 'Hygiene + Oral & Paws')}
                      className="p-1.5 rounded-lg border border-black/10 text-left hover:bg-sanctuary-sand"
                    >
                      <div className="font-bold text-[11px]">Special Package</div>
                      <div className="text-[10px] text-sanctuary-dark/60 font-black">₹899 (was ₹1124)</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAddService('grooming', 'Style Your Pet Breed Trim', 1799, 2249, 'Full Breed Styling')}
                      className="p-1.5 rounded-lg border border-black/10 text-left hover:bg-sanctuary-sand"
                    >
                      <div className="font-bold text-[11px]">Style Your Pet</div>
                      <div className="text-[10px] text-sanctuary-dark/60 font-black">₹1,799 (was ₹2249)</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAddService('grooming', 'Full Grooming Ultimate Spa', 2199, 3249, 'Therapeutic Medicated')}
                      className="p-1.5 rounded-lg border border-black/10 text-left hover:bg-sanctuary-sand"
                    >
                      <div className="font-bold text-[11px]">Full Grooming Spa</div>
                      <div className="text-[10px] text-sanctuary-dark/60 font-black">₹2,199 (was ₹3249)</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAddService('boarding', 'Cage-Free Boarding Floor', 625, 750, '4 Nights Stay', 4)}
                      className="p-1.5 rounded-lg border border-black/10 text-left hover:bg-sanctuary-sand col-span-2"
                    >
                      <div className="font-bold text-[11px]">Cage-Free Boarding Floor (4 Nights)</div>
                      <div className="text-[10px] text-sanctuary-dark/60 font-black">₹2,500 (was ₹3,000)</div>
                    </button>
                  </div>
                </div>
              )}

              {/* Service Cards List */}
              <div className="space-y-1.5">
                {selectedServices.map((item) => (
                  <div
                    key={item.id}
                    className={`p-2.5 rounded-xl border flex items-center justify-between text-xs transition-all ${
                      item.isFreePerk || item.price === 0
                        ? 'border-emerald-300 bg-emerald-50/80 shadow-xs'
                        : 'border-black/10 bg-white shadow-2xs'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-black text-sanctuary-dark">{item.name}</span>
                        {item.isFreePerk || item.price === 0 ? (
                          <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-emerald-600 text-white shadow-2xs">
                            🎁 FREE PERK (₹0)
                          </span>
                        ) : item.subtitle ? (
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-sanctuary-sand text-sanctuary-dark/70">
                            {item.subtitle}
                          </span>
                        ) : null}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] line-through text-red-500 font-bold decoration-red-400">
                          ₹{item.origPrice}
                        </span>
                        <span className={`text-xs font-black ${item.price === 0 ? 'text-emerald-700 font-black' : 'text-sanctuary-forest'}`}>
                          {item.price === 0 ? 'FREE (₹0)' : `₹${item.price}`}
                        </span>
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
                ))}
              </div>
            </div>

            {/* 4. COMPANION & TIMING DETAILS */}
            <div className="space-y-2 pt-1 border-t border-black/5">
              <span className="text-[10px] font-black uppercase tracking-wider text-sanctuary-dark/60 block">
                Companion Details & Check-In Date
              </span>

              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  required
                  placeholder="Pet Name *"
                  value={petName}
                  onChange={(e) => setPetName(e.target.value)}
                  className="p-2 rounded-xl border border-black/10 text-xs font-medium focus:outline-none focus:border-sanctuary-gold"
                />
                <input
                  type="text"
                  placeholder="Breed (e.g. Shih Tzu / Persian)"
                  value={petBreed}
                  onChange={(e) => setPetBreed(e.target.value)}
                  className="p-2 rounded-xl border border-black/10 text-xs font-medium focus:outline-none focus:border-sanctuary-gold"
                />
                <input
                  type="date"
                  required
                  value={checkInDate}
                  onChange={(e) => setCheckInDate(e.target.value)}
                  className="p-2 rounded-xl border border-black/10 text-xs font-medium focus:outline-none focus:border-sanctuary-gold"
                />
                <select
                  value={preferredTimeSlot}
                  onChange={(e) => setPreferredTimeSlot(e.target.value)}
                  className="p-2 rounded-xl border border-black/10 text-xs font-medium focus:outline-none focus:border-sanctuary-gold bg-white"
                >
                  <option>Morning (09:30 AM – 01:00 PM)</option>
                  <option>Afternoon (01:00 PM – 05:00 PM)</option>
                  <option>Evening (05:00 PM – 08:30 PM)</option>
                </select>
              </div>

              {/* Doorstep AC Pet Taxi Checkbox */}
              <div
                onClick={() => setIncludePetTaxi(!includePetTaxi)}
                className={`p-2 rounded-xl border cursor-pointer flex items-center justify-between text-xs transition-all ${
                  includePetTaxi ? 'bg-amber-50 border-amber-500 text-amber-950 font-bold' : 'bg-white border-black/10'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-amber-600 text-sm">local_taxi</span>
                  <span className="text-[11px] font-bold">Doorstep AC Pet Cab Pickup & Drop (+₹299)</span>
                </div>
                <input
                  type="checkbox"
                  checked={includePetTaxi}
                  onChange={() => {}}
                  className="size-3.5 accent-amber-600 rounded"
                />
              </div>
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

            {/* 7. PAYMENT METHOD (100% ON-SITE) */}
            <div className="space-y-1.5 pt-1 border-t border-black/5">
              <span className="text-[10px] font-black uppercase tracking-wider text-sanctuary-dark/60 block">
                Payment Method
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentChoice('razorpay')}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    paymentChoice === 'razorpay'
                      ? 'border-sanctuary-gold bg-sanctuary-gold/10 text-sanctuary-dark ring-2 ring-sanctuary-gold'
                      : 'border-black/10 bg-white'
                  }`}
                >
                  <div className="text-xs font-black">Razorpay Online</div>
                  <div className="text-[9px] text-sanctuary-dark/60">UPI, Cards, NetBanking</div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentChoice('studio')}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    paymentChoice === 'studio'
                      ? 'border-sanctuary-forest bg-sanctuary-forest/10 text-sanctuary-dark ring-2 ring-sanctuary-forest'
                      : 'border-black/10 bg-white'
                  }`}
                >
                  <div className="text-xs font-black">Pay at Studio</div>
                  <div className="text-[9px] text-sanctuary-dark/60">Pay on Check-in (Card/Cash)</div>
                </button>
              </div>
            </div>

          </div>
        )}

        {/* ============================================================ */}
        {/* COMPACT MODAL FOOTER BAR */}
        {/* ============================================================ */}
        {!bookingSuccess && (
          <div className="p-3.5 sm:p-4 bg-sanctuary-forest text-white border-t border-black/10 shrink-0 flex items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-white/70">Final Payable:</span>
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
              disabled={isProcessing || !currentUser}
              className="py-2.5 px-5 bg-sanctuary-gold hover:bg-amber-400 text-sanctuary-dark font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
            >
              <span>
                {isProcessing
                  ? 'Booking...'
                  : !currentUser
                  ? 'Sign In to Book'
                  : paymentChoice === 'razorpay'
                  ? 'Pay with Razorpay'
                  : 'Confirm Booking'}
              </span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
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

      </motion.div>
    </div>
  );
};

export default CheckoutModal;
