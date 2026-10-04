import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AdminDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminDashboardModal: React.FC<AdminDashboardModalProps> = ({ isOpen, onClose }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminIdentifier, setAdminIdentifier] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [activeAdminTab, setActiveAdminTab] = useState<'bookings' | 'coupons'>('bookings');

  // Bookings State
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled'>('all');
  const [paymentFilter, setPaymentFilter] = useState<'all' | 'paid' | 'pending'>('all');
  const [serviceFilter, setServiceFilter] = useState<'all' | 'boarding' | 'grooming'>('all');
  const [copiedPaymentId, setCopiedPaymentId] = useState<string | null>(null);

  const handleCopyPaymentId = (text: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
    }
    setCopiedPaymentId(text);
    setTimeout(() => setCopiedPaymentId(null), 2000);
  };

  // Coupons State
  const [coupons, setCoupons] = useState<any[]>([]);
  const [couponsLoading, setCouponsLoading] = useState(false);
  const [couponSearch, setCouponSearch] = useState('');
  const [couponTypeFilter, setCouponTypeFilter] = useState<'all' | 'percentage' | 'flat' | 'free_package'>('all');
  const [couponActionLoadingId, setCouponActionLoadingId] = useState<string | null>(null);

  // Create / Edit Coupon Modal State
  const [showCouponFormModal, setShowCouponFormModal] = useState(false);
  const [formCouponId, setFormCouponId] = useState<string | null>(null);
  const [formCode, setFormCode] = useState('');
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formDiscountType, setFormDiscountType] = useState<'percentage' | 'flat' | 'free_package'>('percentage');
  const [formDiscountPercent, setFormDiscountPercent] = useState<number | string>(15);
  const [formDiscountAmount, setFormDiscountAmount] = useState<number | string>(200);
  const [formMaxDiscountAmount, setFormMaxDiscountAmount] = useState<string>('');
  const [formMinOrderAmount, setFormMinOrderAmount] = useState<number | string>(0);
  const [formMinNights, setFormMinNights] = useState<number | string>(0);
  const [formApplicableCategory, setFormApplicableCategory] = useState<'all' | 'boarding' | 'grooming'>('all');
  const [formFreePackagePreset, setFormFreePackagePreset] = useState<string>('furry_fresh');
  const [formFreePackageName, setFormFreePackageName] = useState('Furry Fresh Hygiene Bath');
  const [formFreePackageValue, setFormFreePackageValue] = useState<number | string>(749);
  const [formIsActive, setFormIsActive] = useState(true);
  const [formValidUntil, setFormValidUntil] = useState('');
  const [formSaving, setFormSaving] = useState(false);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('snip_auth_token');
    const userStr = localStorage.getItem('snip_user');
    if (token && userStr) {
      try {
        const u = JSON.parse(userStr);
        if (u.role === 'admin') {
          setIsAdmin(true);
          fetchAdminBookings(token);
          fetchAdminCoupons(token);
        }
      } catch {}
    }
  }, [isOpen]);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: adminIdentifier, password: adminPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Admin login failed.');
      if (data.user?.role !== 'admin') throw new Error('Access denied: Administrator role required.');

      localStorage.setItem('snip_auth_token', data.token);
      localStorage.setItem('snip_user', JSON.stringify(data.user));
      setIsAdmin(true);
      fetchAdminBookings(data.token);
      fetchAdminCoupons(data.token);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchAdminBookings = async (token: string) => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/bookings', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.bookings) {
        setBookings(data.bookings);
      }
    } catch (err) {
      console.error('Error fetching admin bookings', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAdminCoupons = async (token?: string) => {
    const t = token || localStorage.getItem('snip_auth_token');
    if (!t) return;
    setCouponsLoading(true);
    try {
      const res = await fetch('/api/admin/coupons', {
        headers: { Authorization: `Bearer ${t}` },
      });
      const data = await res.json();
      if (data.coupons) {
        setCoupons(data.coupons);
      }
    } catch (err) {
      console.error('Error fetching admin coupons', err);
    } finally {
      setCouponsLoading(false);
    }
  };

  const updateBookingStatus = async (bookingId: string, status?: string, paymentStatus?: string) => {
    const token = localStorage.getItem('snip_auth_token');
    if (!token) return;

    setActionLoadingId(bookingId);
    try {
      const res = await fetch('/api/admin/bookings', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ bookingId, status, paymentStatus }),
      });
      if (res.ok) {
        await fetchAdminBookings(token);
      } else {
        const d = await res.json();
        alert('Update failed: ' + (d.error || 'Unknown error'));
      }
    } catch (err: any) {
      alert('Error updating booking: ' + err.message);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleToggleCoupon = async (coupon: any) => {
    const token = localStorage.getItem('snip_auth_token');
    if (!token) return;
    setCouponActionLoadingId(coupon.id);
    try {
      const res = await fetch('/api/admin/coupons', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id: coupon.id,
          is_active: !coupon.is_active,
        }),
      });
      if (res.ok) {
        await fetchAdminCoupons(token);
      } else {
        const d = await res.json();
        alert('Toggle failed: ' + (d.error || 'Unknown error'));
      }
    } catch (err: any) {
      alert('Error updating coupon: ' + err.message);
    } finally {
      setCouponActionLoadingId(null);
    }
  };

  const handleDeleteCoupon = async (coupon: any) => {
    if (!confirm(`Are you sure you want to permanently delete coupon "${coupon.code}"?`)) {
      return;
    }
    const token = localStorage.getItem('snip_auth_token');
    if (!token) return;
    setCouponActionLoadingId(coupon.id);
    try {
      const res = await fetch(`/api/admin/coupons?id=${coupon.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        await fetchAdminCoupons(token);
      } else {
        const d = await res.json();
        alert('Delete failed: ' + (d.error || 'Unknown error'));
      }
    } catch (err: any) {
      alert('Error deleting coupon: ' + err.message);
    } finally {
      setCouponActionLoadingId(null);
    }
  };

  const openCreateCouponModal = () => {
    setFormCouponId(null);
    setFormCode('');
    setFormTitle('');
    setFormDescription('');
    setFormDiscountType('percentage');
    setFormDiscountPercent(15);
    setFormDiscountAmount(200);
    setFormMaxDiscountAmount('');
    setFormMinOrderAmount(0);
    setFormMinNights(0);
    setFormApplicableCategory('all');
    setFormFreePackagePreset('furry_fresh');
    setFormFreePackageName('Furry Fresh Hygiene Bath');
    setFormFreePackageValue(749);
    setFormIsActive(true);
    setFormValidUntil('');
    setFormError('');
    setShowCouponFormModal(true);
  };

  const openEditCouponModal = (coupon: any) => {
    setFormCouponId(coupon.id);
    setFormCode(coupon.code || '');
    setFormTitle(coupon.title || '');
    setFormDescription(coupon.description || '');
    setFormDiscountType(coupon.discount_type || 'percentage');
    setFormDiscountPercent(coupon.discount_percent || 0);
    setFormDiscountAmount(coupon.discount_amount || 0);
    setFormMaxDiscountAmount(coupon.max_discount_amount ? String(coupon.max_discount_amount) : '');
    setFormMinOrderAmount(coupon.min_order_amount || 0);
    setFormMinNights(coupon.min_nights || 0);
    setFormApplicableCategory(coupon.applicable_category || 'all');
    setFormFreePackageName(coupon.free_package_name || 'Furry Fresh Hygiene Bath');
    setFormFreePackageValue(coupon.free_package_value || 749);
    setFormFreePackagePreset('custom');
    setFormIsActive(coupon.is_active !== undefined ? coupon.is_active : true);
    setFormValidUntil(coupon.valid_until ? coupon.valid_until.split('T')[0] : '');
    setFormError('');
    setShowCouponFormModal(true);
  };

  const handleSaveCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    const token = localStorage.getItem('snip_auth_token');
    if (!token) {
      setFormError('Authentication required.');
      return;
    }

    const cleanCode = formCode.trim().toUpperCase().replace(/\s+/g, '');
    if (!cleanCode) {
      setFormError('Coupon code is required.');
      return;
    }

    setFormSaving(true);
    try {
      const payload: any = {
        code: cleanCode,
        title: formTitle.trim() || cleanCode,
        description: formDescription.trim(),
        discount_type: formDiscountType,
        discount_percent: formDiscountType === 'percentage' ? Number(formDiscountPercent) : 0,
        discount_amount: formDiscountType === 'flat' ? Number(formDiscountAmount) : 0,
        max_discount_amount: (formDiscountType === 'percentage' && formMaxDiscountAmount) ? Number(formMaxDiscountAmount) : null,
        min_order_amount: Number(formMinOrderAmount || 0),
        min_nights: Number(formMinNights || 0),
        applicable_category: formApplicableCategory,
        free_package_name: formDiscountType === 'free_package' ? formFreePackageName.trim() : null,
        free_package_value: formDiscountType === 'free_package' ? Number(formFreePackageValue || 0) : 0,
        is_active: formIsActive,
        valid_until: formValidUntil || null,
      };

      let res;
      if (formCouponId) {
        payload.id = formCouponId;
        res = await fetch('/api/admin/coupons', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch('/api/admin/coupons', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
      }

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to save coupon.');
      }

      await fetchAdminCoupons(token);
      setShowCouponFormModal(false);
    } catch (err: any) {
      setFormError(err.message);
    } finally {
      setFormSaving(false);
    }
  };

  const handleSelectFreePreset = (preset: string) => {
    setFormFreePackagePreset(preset);
    if (preset === 'furry_fresh') {
      setFormFreePackageName('Furry Fresh Hygiene Bath');
      setFormFreePackageValue(749);
    } else if (preset === 'special_spa') {
      setFormFreePackageName('Special Package Care & Conditioning');
      setFormFreePackageValue(999);
    } else if (preset === 'full_groom') {
      setFormFreePackageName('Full Grooming Ultimate Spa & Breed Trim');
      setFormFreePackageValue(2199);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('snip_auth_token');
    localStorage.removeItem('snip_user');
    setIsAdmin(false);
    setBookings([]);
    setCoupons([]);
  };

  if (!isOpen) return null;

  // Filtered Bookings
  const filteredBookings = bookings.filter((b) => {
    if (statusFilter !== 'all') {
      const bStatus = (b.status || 'confirmed').toLowerCase();
      if (bStatus !== statusFilter) return false;
    }
    if (paymentFilter !== 'all') {
      if (paymentFilter === 'paid' && b.payment_status !== 'paid') return false;
      if (paymentFilter === 'pending' && b.payment_status === 'paid') return false;
    }
    if (serviceFilter === 'boarding' && !b.service_type.toLowerCase().includes('board')) return false;
    if (serviceFilter === 'grooming' && b.service_type.toLowerCase().includes('board')) return false;

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchRef = b.booking_ref?.toLowerCase().includes(q);
      const matchPet = b.pet_name?.toLowerCase().includes(q);
      const matchParent = b.customer_name?.toLowerCase().includes(q);
      const matchPhone = b.customer_phone?.includes(q) || b.emergency_contact?.includes(q);
      const matchPaymentId = b.razorpay_payment_id?.toLowerCase().includes(q);
      const matchOrderId = b.razorpay_order_id?.toLowerCase().includes(q);
      if (!matchRef && !matchPet && !matchParent && !matchPhone && !matchPaymentId && !matchOrderId) return false;
    }
    return true;
  });

  // Filtered Coupons
  const filteredCoupons = coupons.filter((c) => {
    if (couponTypeFilter !== 'all' && c.discount_type !== couponTypeFilter) return false;
    if (couponSearch.trim()) {
      const q = couponSearch.toLowerCase();
      const matchCode = c.code?.toLowerCase().includes(q);
      const matchTitle = c.title?.toLowerCase().includes(q);
      const matchDesc = c.description?.toLowerCase().includes(q);
      if (!matchCode && !matchTitle && !matchDesc) return false;
    }
    return true;
  });

  const totalRevenue = bookings
    .filter((b) => b.payment_status === 'paid')
    .reduce((acc, curr) => acc + (curr.total_amount_paise || 0), 0);

  const verifiedPaidCount = bookings.filter((b) => b.payment_status === 'paid').length;
  const pendingPaymentCount = bookings.filter((b) => b.payment_status !== 'paid').length;
  const completedCount = bookings.filter((b) => (b.status || '').toLowerCase() === 'completed').length;
  const activeCount = bookings.filter((b) => ['confirmed', 'in_progress'].includes((b.status || '').toLowerCase())).length;

  const activeCouponsCount = coupons.filter((c) => c.is_active).length;
  const percentCouponsCount = coupons.filter((c) => c.discount_type === 'percentage').length;
  const flatOrFreeCount = coupons.filter((c) => c.discount_type !== 'percentage').length;

  return (
    <div className="fixed inset-0 z-[220] flex items-center justify-center p-2 sm:p-4 bg-black/75 backdrop-blur-md overflow-y-auto text-left">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 15 }}
        className="bg-white rounded-3xl max-w-5xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-black/10 overflow-hidden relative my-auto"
      >
        {/* Header Bar */}
        <div className="p-4 sm:p-5 pb-3 flex items-center justify-between border-b border-black/10 bg-[#FAF8F5] shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="size-10 rounded-xl bg-sanctuary-forest text-white flex items-center justify-center font-black">
              <span className="material-symbols-outlined text-2xl text-sanctuary-gold">admin_panel_settings</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-sanctuary-gold">
                  Live Operations & Control
                </span>
                <span className="inline-flex items-center gap-1 text-[9px] font-black text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                  <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Neon PostgreSQL Live</span>
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-sanctuary-dark">
                Snip & Style Operations Hub
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAdmin && (
              <button
                onClick={handleLogout}
                className="text-xs font-bold text-red-600 hover:text-red-700 px-3 py-1.5 rounded-xl border border-red-200 hover:bg-red-50 transition-colors"
              >
                Sign Out
              </button>
            )}
            <button
              onClick={onClose}
              className="size-8 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center transition-colors"
            >
              <span className="material-symbols-outlined text-base">close</span>
            </button>
          </div>
        </div>

        {/* Admin Navigation Tabs */}
        {isAdmin && (
          <div className="flex items-center gap-1 border-b border-black/10 px-4 sm:px-6 bg-[#FAF8F5] shrink-0">
            <button
              onClick={() => setActiveAdminTab('bookings')}
              className={`py-3 px-4 text-xs font-black uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all ${
                activeAdminTab === 'bookings'
                  ? 'border-sanctuary-forest text-sanctuary-forest bg-white shadow-xs rounded-t-xl'
                  : 'border-transparent text-sanctuary-dark/60 hover:text-sanctuary-dark'
              }`}
            >
              <span className="material-symbols-outlined text-base">receipt_long</span>
              <span>Stays & Bookings ({bookings.length})</span>
            </button>

            <button
              onClick={() => {
                setActiveAdminTab('coupons');
                const t = localStorage.getItem('snip_auth_token');
                if (t) fetchAdminCoupons(t);
              }}
              className={`py-3 px-4 text-xs font-black uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all ${
                activeAdminTab === 'coupons'
                  ? 'border-sanctuary-gold text-amber-900 bg-white shadow-xs rounded-t-xl'
                  : 'border-transparent text-sanctuary-dark/60 hover:text-sanctuary-dark'
              }`}
            >
              <span className="material-symbols-outlined text-base text-sanctuary-gold">loyalty</span>
              <span>Coupon Engine & Discounts ({coupons.length})</span>
            </button>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-grow">
          {!isAdmin ? (
            /* Staff Authentication Screen */
            <div className="max-w-md mx-auto py-10 space-y-5">
              <div className="text-center space-y-1">
                <h3 className="text-lg font-black text-sanctuary-dark">Manager / Reception Sign In</h3>
                <p className="text-xs text-sanctuary-dark/70 font-medium">
                  Enter authorized administrator credentials to manage pet stays, updates, coupons, and payments.
                </p>
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs font-bold border border-red-200">
                  {error}
                </div>
              )}

              <form onSubmit={handleAdminLogin} className="space-y-3.5">
                <div>
                  <label className="text-[11px] font-black uppercase tracking-wider text-sanctuary-dark/70 block mb-1">
                    Mobile Number or Email
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Admin mobile number or email"
                    value={adminIdentifier}
                    onChange={(e) => setAdminIdentifier(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-black/15 text-xs font-medium focus:outline-none focus:border-sanctuary-gold"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-black uppercase tracking-wider text-sanctuary-dark/70 block mb-1">
                    Administrator Password
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Enter password"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-black/15 text-xs font-medium focus:outline-none focus:border-sanctuary-gold"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-sanctuary-forest hover:bg-black text-white rounded-xl font-black text-xs uppercase tracking-wider transition-all disabled:opacity-50"
                >
                  {loading ? 'Authenticating with Neon DB...' : 'Access Management Console'}
                </button>
              </form>
            </div>
          ) : activeAdminTab === 'bookings' ? (
            /* TAB 1: Live Bookings Console */
            <div className="space-y-4">
              {/* Top Metrics Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 bg-sanctuary-sand/40 rounded-2xl border border-black/5">
                  <span className="text-[10px] font-black uppercase tracking-wider text-sanctuary-dark/60 block">
                    Total Bookings
                  </span>
                  <span className="text-2xl font-black text-sanctuary-dark">{bookings.length}</span>
                </div>
                <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200/50">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 block">
                      Paid & Verified
                    </span>
                    <span className="text-[9px] font-black bg-emerald-200/80 text-emerald-900 px-1.5 py-0.2 rounded-full">
                      {verifiedPaidCount} Orders
                    </span>
                  </div>
                  <span className="text-2xl font-black text-emerald-800">
                    ₹{(totalRevenue / 100).toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200/50">
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 block">
                    Pending Payment
                  </span>
                  <span className="text-2xl font-black text-amber-900">{pendingPaymentCount}</span>
                </div>
                <div className="p-3 bg-blue-50 rounded-2xl border border-blue-200/50">
                  <span className="text-[10px] font-black uppercase tracking-wider text-blue-800 block">
                    Active / In Studio
                  </span>
                  <span className="text-2xl font-black text-blue-900">{activeCount}</span>
                </div>
              </div>

              {/* Filters & Search Toolbar */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 pt-1">
                {/* Search */}
                <div className="relative flex-1 max-w-sm">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                    search
                  </span>
                  <input
                    type="text"
                    placeholder="Search ref, pet, parent, phone, payment ID (pay_)..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-black/15 text-xs font-medium focus:outline-none focus:border-sanctuary-gold"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {/* Payment Filter */}
                  <div className="flex items-center gap-1 bg-sanctuary-sand p-1 rounded-xl text-xs font-bold">
                    {(['all', 'paid', 'pending'] as const).map((pf) => (
                      <button
                        key={pf}
                        onClick={() => setPaymentFilter(pf)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-black transition-all ${
                          paymentFilter === pf
                            ? 'bg-sanctuary-forest text-white shadow-xs'
                            : 'text-sanctuary-dark/70 hover:text-black'
                        }`}
                      >
                        {pf === 'all' ? 'All' : pf === 'paid' ? '✓ Verified Paid' : '⏳ Pending'}
                      </button>
                    ))}
                  </div>

                  {/* Status Tabs */}
                  <div className="flex flex-wrap items-center gap-1 bg-sanctuary-sand p-1 rounded-xl text-xs font-bold">
                    {(['all', 'confirmed', 'in_progress', 'completed', 'cancelled'] as const).map((st) => (
                      <button
                        key={st}
                        onClick={() => setStatusFilter(st)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-black capitalize transition-all ${
                          statusFilter === st ? 'bg-sanctuary-forest text-white shadow-xs' : 'text-sanctuary-dark/70 hover:text-black'
                        }`}
                      >
                        {st.replace('_', ' ')}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Refresh */}
                <button
                  onClick={() => {
                    const t = localStorage.getItem('snip_auth_token');
                    if (t) fetchAdminBookings(t);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-white border border-black/10 hover:border-sanctuary-gold text-xs font-bold text-sanctuary-dark flex items-center justify-center gap-1 shadow-xs"
                >
                  <span className="material-symbols-outlined text-sm">refresh</span>
                  <span>Refresh</span>
                </button>
              </div>

              {/* Bookings List */}
              {loading ? (
                <div className="py-16 text-center space-y-2">
                  <div className="size-6 border-2 border-sanctuary-forest border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-xs font-bold text-sanctuary-dark/60">Fetching live bookings from Neon PostgreSQL...</p>
                </div>
              ) : filteredBookings.length === 0 ? (
                <div className="py-16 text-center space-y-1 bg-[#FAF8F5] rounded-3xl border border-black/10">
                  <span className="material-symbols-outlined text-3xl text-gray-400">inbox</span>
                  <p className="text-sm font-black text-sanctuary-dark">No bookings found</p>
                  <p className="text-xs text-sanctuary-dark/60">
                    {searchTerm ? 'No results matched your search query.' : 'New bookings placed on the website will appear here in real-time.'}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredBookings.map((b) => {
                    const servicesList = Array.isArray(b.services_json) ? b.services_json : [];
                    const isUpdating = actionLoadingId === b.id;

                    return (
                      <div
                        key={b.id}
                        className="p-4 bg-white rounded-2xl border border-black/10 shadow-xs hover:border-black/25 transition-all space-y-3"
                      >
                        {/* Top Reference & Badges */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-black/5 pb-2.5">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-black px-2.5 py-1 rounded-lg bg-sanctuary-forest text-white">
                              {b.booking_ref}
                            </span>
                            <span className="text-xs font-bold text-sanctuary-dark">
                              {new Date(b.created_at).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5 flex-wrap">
                            {/* Status badge */}
                            <span
                              className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                                b.status === 'completed'
                                  ? 'bg-purple-100 text-purple-800'
                                  : b.status === 'in_progress'
                                  ? 'bg-blue-100 text-blue-800'
                                  : b.status === 'cancelled'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-emerald-100 text-emerald-800'
                              }`}
                            >
                              {b.status || 'confirmed'}
                            </span>

                            {/* Payment badge */}
                            <span
                              className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                                b.payment_status === 'paid'
                                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                  : 'bg-amber-100 text-amber-900 border border-amber-300'
                              }`}
                            >
                              <span className="material-symbols-outlined text-[12px]">
                                {b.payment_status === 'paid' ? 'verified' : 'hourglass_empty'}
                              </span>
                              <span>
                                {b.payment_status === 'paid'
                                  ? (b.razorpay_payment_id ? 'Razorpay Verified' : 'Paid')
                                  : 'Payment Pending'}
                              </span>
                            </span>

                            {b.applied_offer_code && (
                              <span className="text-[10px] font-mono font-bold bg-amber-50 text-amber-800 px-2 py-0.5 rounded-md border border-amber-200">
                                {b.applied_offer_code}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Customer & Pet Details Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                          {/* Pet Info */}
                          <div className="space-y-0.5">
                            <span className="text-[10px] font-bold text-sanctuary-dark/50 uppercase tracking-wider block">
                              Pet Companion
                            </span>
                            <div className="font-black text-sanctuary-dark text-sm flex items-center gap-1">
                              <span className="material-symbols-outlined text-sm text-sanctuary-gold">pets</span>
                              <span>{b.pet_name}</span>
                            </div>
                            <div className="text-[11px] text-sanctuary-dark/70 font-semibold">
                              {b.pet_breed || 'Breed'} • {b.pet_weight_kg ? `${b.pet_weight_kg} kg` : 'Size'}
                            </div>
                          </div>

                          {/* Pet Parent */}
                          <div className="space-y-0.5">
                            <span className="text-[10px] font-bold text-sanctuary-dark/50 uppercase tracking-wider block">
                              Pet Parent / Contact
                            </span>
                            <div className="font-black text-sanctuary-dark">
                              {b.customer_name || 'Pet Parent'}
                            </div>
                            <div className="text-[11px] font-mono font-bold text-sanctuary-dark/80">
                              {b.customer_phone || b.emergency_contact || 'No phone'}
                            </div>
                          </div>

                          {/* Dates & Times */}
                          <div className="space-y-0.5">
                            <span className="text-[10px] font-bold text-sanctuary-dark/50 uppercase tracking-wider block">
                              Schedule & Stays
                            </span>
                            <div className="font-bold text-sanctuary-dark">
                              {new Date(b.check_in_date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                              {b.number_of_days > 1 && ` – ${new Date(b.check_out_date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}`}
                            </div>
                            <div className="text-[11px] text-sanctuary-dark/70">
                              Drop: {b.drop_off_time} • Pickup: {b.pickup_time}
                            </div>
                          </div>
                        </div>

                        {/* Services & Financials Summary */}
                        <div className="p-2.5 bg-sanctuary-sand/30 rounded-xl space-y-1.5 border border-black/5">
                          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                            <span className="font-bold text-sanctuary-dark">
                              {b.service_type}
                              {servicesList.length > 0 && ` (${servicesList.length} items)`}
                            </span>
                            <span className="font-black text-sanctuary-dark text-sm">
                              ₹{(b.total_amount_paise / 100).toLocaleString('en-IN')}
                            </span>
                          </div>

                          {/* Extra Services Pills */}
                          {servicesList.length > 0 && (
                            <div className="flex flex-wrap gap-1 pt-1">
                              {servicesList.map((srv: any, idx: number) => (
                                <span
                                  key={idx}
                                  className={`text-[10px] font-medium px-2 py-0.5 rounded-md ${
                                    srv.isFreePerk
                                      ? 'bg-emerald-100 text-emerald-800 font-bold border border-emerald-300'
                                      : 'bg-white text-sanctuary-dark/80 border border-black/10'
                                  }`}
                                >
                                  {srv.isFreePerk && '🎁 '}
                                  {srv.name} (₹{srv.price})
                                </span>
                              ))}
                            </div>
                          )}

                          {b.special_instructions && (
                            <div className="text-[11px] text-amber-900 bg-amber-50 p-2 rounded-lg border border-amber-200/60 font-medium">
                              <strong>Note:</strong> {b.special_instructions}
                            </div>
                          )}
                        </div>

                        {/* Dedicated Razorpay Payment & Verification Panel */}
                        <div
                          className={`p-3 rounded-2xl border text-xs space-y-2.5 transition-all ${
                            b.payment_status === 'paid'
                              ? 'bg-emerald-50/70 border-emerald-200/80 shadow-xs'
                              : 'bg-amber-50/70 border-amber-200/80'
                          }`}
                        >
                          {/* Panel Header */}
                          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-black/5 pb-2">
                            <div className="flex items-center gap-1.5">
                              <span
                                className={`material-symbols-outlined text-base ${
                                  b.payment_status === 'paid' ? 'text-emerald-700' : 'text-amber-700'
                                }`}
                              >
                                {b.payment_status === 'paid' ? 'verified_user' : 'warning'}
                              </span>
                              <div>
                                <h5 className="font-black text-xs text-sanctuary-dark leading-tight flex items-center gap-1.5">
                                  <span>
                                    {b.payment_status === 'paid'
                                      ? 'Payment Verified & Settled'
                                      : 'Payment Status: Pending / Unverified'}
                                  </span>
                                  {b.razorpay_signature && (
                                    <span className="text-[9px] font-black bg-emerald-200/80 text-emerald-900 px-1.5 py-0.2 rounded-full">
                                      HMAC Verified
                                    </span>
                                  )}
                                </h5>
                                <p className="text-[10px] text-sanctuary-dark/60 font-medium">
                                  {b.payment_status === 'paid'
                                    ? (b.razorpay_signature
                                        ? 'Cryptographically authenticated with Razorpay Live HMAC-SHA256 signature'
                                        : 'Confirmed in Neon PostgreSQL')
                                    : 'Customer has not yet completed online payment via Razorpay'}
                                </p>
                              </div>
                            </div>

                            <span
                              className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                                b.payment_status === 'paid'
                                  ? 'bg-emerald-200/90 text-emerald-950 border border-emerald-300'
                                  : 'bg-amber-200/90 text-amber-950 border border-amber-300'
                              }`}
                            >
                              {b.payment_status === 'paid' ? '✓ VERIFIED PAID' : '⏳ UNPAID'}
                            </span>
                          </div>

                          {/* Transaction Identifiers Grid */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-[11px]">
                            {/* Razorpay Payment ID */}
                            <div className="bg-white/80 p-2.5 rounded-xl border border-black/5 space-y-1">
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] font-bold text-sanctuary-dark/60 uppercase tracking-wider flex items-center gap-1">
                                  <span className="material-symbols-outlined text-xs text-sanctuary-forest">fingerprint</span>
                                  <span>Razorpay Payment ID</span>
                                </span>
                                {b.razorpay_payment_id && (
                                  <button
                                    type="button"
                                    onClick={() => handleCopyPaymentId(b.razorpay_payment_id)}
                                    className="text-[9px] font-black text-emerald-800 hover:text-emerald-950 bg-emerald-100 hover:bg-emerald-200 px-2 py-0.5 rounded-md transition-all flex items-center gap-0.5"
                                  >
                                    <span className="material-symbols-outlined text-[10px]">
                                      {copiedPaymentId === b.razorpay_payment_id ? 'check' : 'content_copy'}
                                    </span>
                                    <span>{copiedPaymentId === b.razorpay_payment_id ? 'Copied' : 'Copy ID'}</span>
                                  </button>
                                )}
                              </div>
                              {b.razorpay_payment_id ? (
                                <code className="font-mono text-xs font-black text-sanctuary-dark bg-emerald-50/50 px-2 py-0.5 rounded border border-emerald-200/60 block break-all select-all">
                                  {b.razorpay_payment_id}
                                </code>
                              ) : (
                                <span className="text-[11px] text-sanctuary-dark/40 italic font-medium block">
                                  No Payment ID recorded (Pending checkout)
                                </span>
                              )}
                            </div>

                            {/* Razorpay Order ID */}
                            <div className="bg-white/80 p-2.5 rounded-xl border border-black/5 space-y-1">
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] font-bold text-sanctuary-dark/60 uppercase tracking-wider flex items-center gap-1">
                                  <span className="material-symbols-outlined text-xs text-sanctuary-forest">receipt_long</span>
                                  <span>Razorpay Order ID</span>
                                </span>
                                {b.razorpay_order_id && (
                                  <button
                                    type="button"
                                    onClick={() => handleCopyPaymentId(b.razorpay_order_id)}
                                    className="text-[9px] font-black text-sanctuary-dark hover:text-black bg-black/5 hover:bg-black/10 px-2 py-0.5 rounded-md transition-all flex items-center gap-0.5"
                                  >
                                    <span className="material-symbols-outlined text-[10px]">
                                      {copiedPaymentId === b.razorpay_order_id ? 'check' : 'content_copy'}
                                    </span>
                                    <span>{copiedPaymentId === b.razorpay_order_id ? 'Copied' : 'Copy Order'}</span>
                                  </button>
                                )}
                              </div>
                              {b.razorpay_order_id ? (
                                <code className="font-mono text-xs font-black text-sanctuary-dark bg-sanctuary-sand/40 px-2 py-0.5 rounded border border-black/10 block break-all select-all">
                                  {b.razorpay_order_id}
                                </code>
                              ) : (
                                <span className="text-[11px] text-sanctuary-dark/40 italic font-medium block">
                                  None
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Gateway Method & Amount Breakdown Footer */}
                          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-black/5 text-[10px]">
                            <div className="flex items-center gap-2 text-sanctuary-dark/75 flex-wrap">
                              <div className="flex items-center gap-1">
                                <span className="material-symbols-outlined text-xs text-sanctuary-forest">
                                  {b.payment_status === 'paid' ? 'shield_with_heart' : 'info'}
                                </span>
                                <span>
                                  Method: <strong>{b.payment_method || 'Razorpay Gateway'}</strong>
                                </span>
                              </div>
                              {b.razorpay_signature && (
                                <span className="text-[9px] font-bold bg-white px-2 py-0.5 rounded border border-black/10 text-emerald-800">
                                  ✓ Live HMAC Verified
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 font-medium text-sanctuary-dark">
                              {b.discount_amount_paise > 0 && (
                                <span className="text-emerald-700 font-bold">
                                  Discount: -₹{(b.discount_amount_paise / 100).toLocaleString('en-IN')}
                                </span>
                              )}
                              <span className="font-mono font-black text-xs">
                                Settled: ₹{(b.total_amount_paise / 100).toLocaleString('en-IN')}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Management Action Buttons */}
                        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-black/5">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {/* In Progress */}
                            {b.status !== 'in_progress' && b.status !== 'completed' && (
                              <button
                                disabled={isUpdating}
                                onClick={() => updateBookingStatus(b.id, 'in_progress')}
                                className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all disabled:opacity-50"
                              >
                                In Studio
                              </button>
                            )}

                            {/* Mark Completed */}
                            {b.status !== 'completed' && (
                              <button
                                disabled={isUpdating}
                                onClick={() => updateBookingStatus(b.id, 'completed')}
                                className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-black uppercase tracking-wider transition-all disabled:opacity-50 flex items-center gap-1 shadow-xs"
                              >
                                <span className="material-symbols-outlined text-xs">check_circle</span>
                                <span>Mark Completed</span>
                              </button>
                            )}

                            {/* Mark Confirmed */}
                            {b.status !== 'confirmed' && (
                              <button
                                disabled={isUpdating}
                                onClick={() => updateBookingStatus(b.id, 'confirmed')}
                                className="px-2.5 py-1 bg-sanctuary-forest hover:bg-black text-white rounded-lg text-[10px] font-black uppercase tracking-wider transition-all disabled:opacity-50"
                              >
                                Confirmed
                              </button>
                            )}

                            {/* Cancel */}
                            {b.status !== 'cancelled' && (
                              <button
                                disabled={isUpdating}
                                onClick={() => updateBookingStatus(b.id, 'cancelled')}
                                className="px-2 py-1 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all disabled:opacity-50"
                              >
                                Cancel
                              </button>
                            )}
                          </div>

                          {/* Payment Status Action */}
                          {b.payment_status !== 'paid' && (
                            <button
                              disabled={isUpdating}
                              onClick={() => updateBookingStatus(b.id, undefined, 'paid')}
                              className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-black uppercase tracking-wider transition-all shadow-xs flex items-center gap-1"
                            >
                              <span className="material-symbols-outlined text-xs">paid</span>
                              <span>Mark Payment Paid</span>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            /* TAB 2: Dynamic Coupon & Discount Engine */
            <div className="space-y-4">
              {/* Top Metrics Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 bg-sanctuary-sand/40 rounded-2xl border border-black/5">
                  <span className="text-[10px] font-black uppercase tracking-wider text-sanctuary-dark/60 block">
                    Total Coupons
                  </span>
                  <span className="text-2xl font-black text-sanctuary-dark">{coupons.length}</span>
                </div>
                <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200/50">
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 block">
                    Active & Redeemable
                  </span>
                  <span className="text-2xl font-black text-emerald-800">{activeCouponsCount}</span>
                </div>
                <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200/50">
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 block">
                    Percentage (% OFF)
                  </span>
                  <span className="text-2xl font-black text-amber-900">{percentCouponsCount}</span>
                </div>
                <div className="p-3 bg-purple-50 rounded-2xl border border-purple-200/50">
                  <span className="text-[10px] font-black uppercase tracking-wider text-purple-800 block">
                    Flat ₹ & Free Gifts
                  </span>
                  <span className="text-2xl font-black text-purple-900">{flatOrFreeCount}</span>
                </div>
              </div>

              {/* Toolbar */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 pt-1">
                {/* Search */}
                <div className="relative flex-1 max-w-sm">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                    search
                  </span>
                  <input
                    type="text"
                    placeholder="Search by code, title, perk..."
                    value={couponSearch}
                    onChange={(e) => setCouponSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-black/15 text-xs font-medium focus:outline-none focus:border-sanctuary-gold"
                  />
                </div>

                {/* Type Filter */}
                <div className="flex flex-wrap items-center gap-1 bg-sanctuary-sand p-1 rounded-xl text-xs font-bold">
                  {(['all', 'percentage', 'flat', 'free_package'] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setCouponTypeFilter(t)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-black transition-all ${
                        couponTypeFilter === t
                          ? 'bg-sanctuary-forest text-white shadow-xs'
                          : 'text-sanctuary-dark/70 hover:text-black'
                      }`}
                    >
                      {t === 'all'
                        ? 'All'
                        : t === 'percentage'
                        ? '% OFF'
                        : t === 'flat'
                        ? 'Flat ₹'
                        : 'Free Gift 🎁'}
                    </button>
                  ))}
                </div>

                {/* Create Coupon Button */}
                <button
                  onClick={openCreateCouponModal}
                  className="py-2 px-4 bg-sanctuary-forest hover:bg-black text-white rounded-xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all"
                >
                  <span className="material-symbols-outlined text-base text-sanctuary-gold">add_circle</span>
                  <span>Create Coupon</span>
                </button>
              </div>

              {/* Coupons List */}
              {couponsLoading ? (
                <div className="py-16 text-center space-y-2">
                  <div className="size-6 border-2 border-sanctuary-gold border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-xs font-bold text-sanctuary-dark/60">Fetching promotion codes from Neon DB...</p>
                </div>
              ) : filteredCoupons.length === 0 ? (
                <div className="py-16 text-center space-y-3 bg-[#FAF8F5] rounded-3xl border border-black/10 p-6">
                  <div className="size-12 rounded-2xl bg-sanctuary-sand mx-auto flex items-center justify-center">
                    <span className="material-symbols-outlined text-2xl text-sanctuary-dark/60">loyalty</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-sanctuary-dark">No coupons found</h4>
                    <p className="text-xs text-sanctuary-dark/60 mt-0.5">
                      {couponSearch ? 'No coupons matched your search query.' : 'Create your first promotional discount coupon to boost checkout conversions.'}
                    </p>
                  </div>
                  <button
                    onClick={openCreateCouponModal}
                    className="py-2 px-4 bg-sanctuary-forest text-white rounded-xl text-xs font-black uppercase tracking-wider inline-flex items-center gap-1.5 shadow-sm"
                  >
                    <span className="material-symbols-outlined text-sm">add</span>
                    <span>Create First Coupon</span>
                  </button>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 gap-3.5">
                  {filteredCoupons.map((coupon) => {
                    const isUpdating = couponActionLoadingId === coupon.id;

                    return (
                      <div
                        key={coupon.id}
                        className={`p-4 rounded-2xl border transition-all flex flex-col justify-between space-y-3 ${
                          coupon.is_active
                            ? 'bg-white border-black/10 shadow-xs hover:border-sanctuary-gold'
                            : 'bg-black/[0.02] border-black/5 opacity-70'
                        }`}
                      >
                        {/* Top: Code & Type Benefit */}
                        <div className="flex items-start justify-between gap-2 border-b border-black/5 pb-2.5">
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-mono text-sm font-black px-2.5 py-0.5 rounded-lg bg-sanctuary-dark text-sanctuary-gold tracking-wider">
                                {coupon.code}
                              </span>
                              <span
                                className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                                  coupon.is_active
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : 'bg-gray-100 text-gray-600'
                                }`}
                              >
                                {coupon.is_active ? 'Active' : 'Disabled'}
                              </span>
                            </div>
                            <h4 className="text-xs font-black text-sanctuary-dark mt-1">
                              {coupon.title || coupon.code}
                            </h4>
                          </div>

                          {/* Benefit Badge */}
                          <div className="text-right shrink-0">
                            {coupon.discount_type === 'free_package' ? (
                              <span className="inline-block bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-xl text-[11px] font-black">
                                🎁 Free Gift
                              </span>
                            ) : coupon.discount_type === 'flat' ? (
                              <span className="inline-block bg-blue-50 text-blue-800 border border-blue-200 px-2.5 py-1 rounded-xl text-[11px] font-black">
                                ₹{coupon.discount_amount} OFF
                              </span>
                            ) : (
                              <span className="inline-block bg-amber-50 text-amber-900 border border-amber-200 px-2.5 py-1 rounded-xl text-[11px] font-black">
                                {coupon.discount_percent}% OFF
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Description & Detailed Conditions */}
                        <div className="space-y-1.5 text-xs">
                          {coupon.description && (
                            <p className="text-[11px] text-sanctuary-dark/75 font-medium leading-relaxed">
                              {coupon.description}
                            </p>
                          )}

                          {/* Key Specs Pills */}
                          <div className="flex flex-wrap gap-1 pt-1">
                            {coupon.discount_type === 'percentage' && coupon.max_discount_amount && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-50 text-amber-900 border border-amber-200">
                                Max Cap: ₹{coupon.max_discount_amount}
                              </span>
                            )}

                            {coupon.discount_type === 'free_package' && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200">
                                Perk: {coupon.free_package_name || 'Free Service'} (₹{coupon.free_package_value})
                              </span>
                            )}

                            {coupon.min_order_amount > 0 && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-sanctuary-sand text-sanctuary-dark border border-black/5">
                                Min Order: ₹{coupon.min_order_amount}
                              </span>
                            )}

                            {coupon.min_nights > 0 && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-sanctuary-sand text-sanctuary-dark border border-black/5">
                                Min Nights: {coupon.min_nights}+
                              </span>
                            )}

                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-sanctuary-sand/60 text-sanctuary-dark/70 capitalize">
                              Category: {coupon.applicable_category || 'all'}
                            </span>
                          </div>
                        </div>

                        {/* Actions Footer */}
                        <div className="flex items-center justify-between pt-2 border-t border-black/5 text-xs">
                          <button
                            disabled={isUpdating}
                            onClick={() => handleToggleCoupon(coupon)}
                            className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-1 ${
                              coupon.is_active
                                ? 'bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200'
                                : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200'
                            }`}
                          >
                            <span className="material-symbols-outlined text-xs">
                              {coupon.is_active ? 'pause' : 'play_arrow'}
                            </span>
                            <span>{coupon.is_active ? 'Disable' : 'Enable'}</span>
                          </button>

                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => openEditCouponModal(coupon)}
                              className="size-7 rounded-lg bg-black/5 hover:bg-black/10 flex items-center justify-center text-sanctuary-dark transition-colors"
                              title="Edit Coupon"
                            >
                              <span className="material-symbols-outlined text-sm">edit</span>
                            </button>

                            <button
                              disabled={isUpdating}
                              onClick={() => handleDeleteCoupon(coupon)}
                              className="size-7 rounded-lg bg-red-50 hover:bg-red-100 flex items-center justify-center text-red-600 transition-colors"
                              title="Delete Coupon"
                            >
                              <span className="material-symbols-outlined text-sm">delete</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* ============================================================ */}
        {/* CREATE / EDIT COUPON MODAL DIALOG */}
        {/* ============================================================ */}
        <AnimatePresence>
          {showCouponFormModal && (
            <div className="fixed inset-0 z-[250] flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-3xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-black/10 space-y-4 my-auto text-left"
              >
                {/* Form Header */}
                <div className="flex items-center justify-between border-b border-black/10 pb-3">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-sanctuary-gold block">
                      Promotion Management
                    </span>
                    <h3 className="text-base sm:text-lg font-black text-sanctuary-dark">
                      {formCouponId ? `Edit Coupon: ${formCode}` : 'Create New Promotion Coupon'}
                    </h3>
                  </div>
                  <button
                    onClick={() => setShowCouponFormModal(false)}
                    className="size-8 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center"
                  >
                    <span className="material-symbols-outlined text-base">close</span>
                  </button>
                </div>

                {formError && (
                  <div className="p-2.5 rounded-xl bg-red-50 text-red-700 text-xs font-bold border border-red-200">
                    {formError}
                  </div>
                )}

                <form onSubmit={handleSaveCoupon} className="space-y-3.5">
                  {/* Coupon Code & Title */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="text-[11px] font-black uppercase tracking-wider text-sanctuary-dark/70 block mb-1">
                        Coupon Code *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. SAVE20"
                        value={formCode}
                        onChange={(e) => setFormCode(e.target.value.toUpperCase().replace(/\s+/g, ''))}
                        className="w-full p-2.5 rounded-xl border border-black/15 text-xs font-mono font-bold tracking-wider focus:outline-none focus:border-sanctuary-gold"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-black uppercase tracking-wider text-sanctuary-dark/70 block mb-1">
                        Display Title
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 20% Weekend Special"
                        value={formTitle}
                        onChange={(e) => setFormTitle(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-black/15 text-xs font-semibold focus:outline-none focus:border-sanctuary-gold"
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="text-[11px] font-black uppercase tracking-wider text-sanctuary-dark/70 block mb-1">
                      Customer Description
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Get 20% off on all services up to max ₹500 discount"
                      value={formDescription}
                      onChange={(e) => setFormDescription(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-black/15 text-xs font-medium focus:outline-none focus:border-sanctuary-gold"
                    />
                  </div>

                  {/* Discount Type Radio Selector */}
                  <div>
                    <label className="text-[11px] font-black uppercase tracking-wider text-sanctuary-dark/70 block mb-1.5">
                      Select Discount Type *
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => setFormDiscountType('percentage')}
                        className={`p-2.5 rounded-xl border text-left transition-all ${
                          formDiscountType === 'percentage'
                            ? 'bg-amber-50 border-amber-500 text-amber-950 font-black shadow-xs'
                            : 'bg-white border-black/10 text-sanctuary-dark/70'
                        }`}
                      >
                        <div className="text-xs font-black">% Percentage</div>
                        <div className="text-[10px] font-medium text-sanctuary-dark/60">e.g. 15% OFF</div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setFormDiscountType('flat')}
                        className={`p-2.5 rounded-xl border text-left transition-all ${
                          formDiscountType === 'flat'
                            ? 'bg-blue-50 border-blue-500 text-blue-950 font-black shadow-xs'
                            : 'bg-white border-black/10 text-sanctuary-dark/70'
                        }`}
                      >
                        <div className="text-xs font-black">₹ Flat Off</div>
                        <div className="text-[10px] font-medium text-sanctuary-dark/60">e.g. ₹200 OFF</div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setFormDiscountType('free_package')}
                        className={`p-2.5 rounded-xl border text-left transition-all ${
                          formDiscountType === 'free_package'
                            ? 'bg-emerald-50 border-emerald-500 text-emerald-950 font-black shadow-xs'
                            : 'bg-white border-black/10 text-sanctuary-dark/70'
                        }`}
                      >
                        <div className="text-xs font-black">🎁 Free Perk</div>
                        <div className="text-[10px] font-medium text-sanctuary-dark/60">e.g. Free Spa Bath</div>
                      </button>
                    </div>
                  </div>

                  {/* Dynamic Inputs Based on Discount Type */}
                  {formDiscountType === 'percentage' && (
                    <div className="p-3 bg-amber-50/60 rounded-2xl border border-amber-200/60 grid grid-cols-2 gap-2.5">
                      <div>
                        <label className="text-[10px] font-black uppercase tracking-wider text-amber-950 block mb-1">
                          Discount Percentage (%) *
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="100"
                          required
                          placeholder="15"
                          value={formDiscountPercent}
                          onChange={(e) => setFormDiscountPercent(e.target.value)}
                          className="w-full p-2 rounded-xl border border-amber-300 text-xs font-bold focus:outline-none bg-white"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-black uppercase tracking-wider text-amber-950 block mb-1">
                          Max Discount Cap (₹) (Optional)
                        </label>
                        <input
                          type="number"
                          min="0"
                          placeholder="e.g. 500 (blank = no limit)"
                          value={formMaxDiscountAmount}
                          onChange={(e) => setFormMaxDiscountAmount(e.target.value)}
                          className="w-full p-2 rounded-xl border border-amber-300 text-xs font-bold focus:outline-none bg-white"
                        />
                      </div>
                    </div>
                  )}

                  {formDiscountType === 'flat' && (
                    <div className="p-3 bg-blue-50/60 rounded-2xl border border-blue-200/60">
                      <label className="text-[10px] font-black uppercase tracking-wider text-blue-950 block mb-1">
                        Flat Discount Amount in Rupees (₹) *
                      </label>
                      <input
                        type="number"
                        min="1"
                        required
                        placeholder="e.g. 200"
                        value={formDiscountAmount}
                        onChange={(e) => setFormDiscountAmount(e.target.value)}
                        className="w-full p-2 rounded-xl border border-blue-300 text-xs font-bold focus:outline-none bg-white"
                      />
                    </div>
                  )}

                  {formDiscountType === 'free_package' && (
                    <div className="p-3 bg-emerald-50/60 rounded-2xl border border-emerald-200/60 space-y-2.5">
                      <div>
                        <label className="text-[10px] font-black uppercase tracking-wider text-emerald-950 block mb-1">
                          Select Free Package Preset
                        </label>
                        <select
                          value={formFreePackagePreset}
                          onChange={(e) => handleSelectFreePreset(e.target.value)}
                          className="w-full p-2 rounded-xl border border-emerald-300 text-xs font-bold focus:outline-none bg-white"
                        >
                          <option value="furry_fresh">Furry Fresh Hygiene Bath (₹749 Value)</option>
                          <option value="special_spa">Special Package Care & Conditioning (₹999 Value)</option>
                          <option value="full_groom">Full Grooming Ultimate Spa & Breed Trim (₹2,199 Value)</option>
                          <option value="custom">Custom Package Name & Value</option>
                        </select>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] font-black uppercase tracking-wider text-emerald-950 block mb-1">
                            Perk Title Added to Cart
                          </label>
                          <input
                            type="text"
                            required
                            value={formFreePackageName}
                            onChange={(e) => setFormFreePackageName(e.target.value)}
                            className="w-full p-2 rounded-xl border border-emerald-300 text-xs font-bold focus:outline-none bg-white"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-black uppercase tracking-wider text-emerald-950 block mb-1">
                            Original Value (₹)
                          </label>
                          <input
                            type="number"
                            required
                            value={formFreePackageValue}
                            onChange={(e) => setFormFreePackageValue(e.target.value)}
                            className="w-full p-2 rounded-xl border border-emerald-300 text-xs font-bold focus:outline-none bg-white"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Rules: Min Spend & Min Nights */}
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-wider text-sanctuary-dark/70 block mb-1">
                        Min Order (₹)
                      </label>
                      <input
                        type="number"
                        min="0"
                        placeholder="0"
                        value={formMinOrderAmount}
                        onChange={(e) => setFormMinOrderAmount(e.target.value)}
                        className="w-full p-2 rounded-xl border border-black/15 text-xs font-bold focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-black uppercase tracking-wider text-sanctuary-dark/70 block mb-1">
                        Min Nights
                      </label>
                      <input
                        type="number"
                        min="0"
                        placeholder="0"
                        value={formMinNights}
                        onChange={(e) => setFormMinNights(e.target.value)}
                        className="w-full p-2 rounded-xl border border-black/15 text-xs font-bold focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-black uppercase tracking-wider text-sanctuary-dark/70 block mb-1">
                        Applies To
                      </label>
                      <select
                        value={formApplicableCategory}
                        onChange={(e) => setFormApplicableCategory(e.target.value as any)}
                        className="w-full p-2 rounded-xl border border-black/15 text-xs font-bold focus:outline-none bg-white"
                      >
                        <option value="all">All Services</option>
                        <option value="boarding">Boarding Only</option>
                        <option value="grooming">Grooming Only</option>
                      </select>
                    </div>
                  </div>

                  {/* Active Toggle & Optional Expiry */}
                  <div className="flex items-center justify-between p-2.5 bg-sanctuary-sand/40 rounded-xl border border-black/5">
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-sanctuary-dark">
                      <input
                        type="checkbox"
                        checked={formIsActive}
                        onChange={(e) => setFormIsActive(e.target.checked)}
                        className="size-4 accent-sanctuary-forest rounded"
                      />
                      <span>Active & Available for Checkout</span>
                    </label>

                    <div className="flex items-center gap-1.5 text-xs">
                      <span className="text-[10px] font-bold text-sanctuary-dark/60">Expiry:</span>
                      <input
                        type="date"
                        value={formValidUntil}
                        onChange={(e) => setFormValidUntil(e.target.value)}
                        className="p-1 rounded-lg border border-black/10 text-xs font-mono"
                      />
                    </div>
                  </div>

                  {/* Submit CTAs */}
                  <div className="flex items-center gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowCouponFormModal(false)}
                      className="flex-1 py-2.5 rounded-xl border border-black/10 text-xs font-bold text-sanctuary-dark hover:bg-black/5 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={formSaving}
                      className="flex-1 py-2.5 bg-sanctuary-forest hover:bg-black text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all disabled:opacity-50 flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      {formSaving ? (
                        <>
                          <div className="size-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Saving to Neon DB...</span>
                        </>
                      ) : (
                        <span>{formCouponId ? 'Update Coupon' : 'Publish Coupon'}</span>
                      )}
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default AdminDashboardModal;
