import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface AdminDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminDashboardModal: React.FC<AdminDashboardModalProps> = ({ isOpen, onClose }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminIdentifier, setAdminIdentifier] = useState('9739887770');
  const [adminPassword, setAdminPassword] = useState('Admin@123');
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled'>('all');
  const [serviceFilter, setServiceFilter] = useState<'all' | 'boarding' | 'grooming'>('all');

  useEffect(() => {
    const token = localStorage.getItem('snip_auth_token');
    const userStr = localStorage.getItem('snip_user');
    if (token && userStr) {
      try {
        const u = JSON.parse(userStr);
        if (u.role === 'admin') {
          setIsAdmin(true);
          fetchAdminBookings(token);
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

  const handleLogout = () => {
    localStorage.removeItem('snip_auth_token');
    localStorage.removeItem('snip_user');
    setIsAdmin(false);
    setBookings([]);
  };

  if (!isOpen) return null;

  // Filtered list
  const filtered = bookings.filter((b) => {
    // Status filter
    if (statusFilter !== 'all') {
      const bStatus = (b.status || 'confirmed').toLowerCase();
      if (bStatus !== statusFilter) return false;
    }

    // Service category filter
    if (serviceFilter === 'boarding' && !b.service_type.toLowerCase().includes('board')) return false;
    if (serviceFilter === 'grooming' && b.service_type.toLowerCase().includes('board')) return false;

    // Search query
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchRef = b.booking_ref?.toLowerCase().includes(q);
      const matchPet = b.pet_name?.toLowerCase().includes(q);
      const matchParent = b.customer_name?.toLowerCase().includes(q);
      const matchPhone = b.customer_phone?.includes(q) || b.emergency_contact?.includes(q);
      if (!matchRef && !matchPet && !matchParent && !matchPhone) return false;
    }

    return true;
  });

  const totalRevenue = bookings
    .filter((b) => b.payment_status === 'paid')
    .reduce((acc, curr) => acc + (curr.total_amount_paise || 0), 0);

  const completedCount = bookings.filter((b) => (b.status || '').toLowerCase() === 'completed').length;
  const activeCount = bookings.filter((b) => ['confirmed', 'in_progress'].includes((b.status || '').toLowerCase())).length;

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
                  Live Admin Console
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

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-grow">
          {!isAdmin ? (
            /* Staff Authentication Screen */
            <div className="max-w-md mx-auto py-10 space-y-5">
              <div className="text-center space-y-1">
                <h3 className="text-lg font-black text-sanctuary-dark">Manager / Reception Sign In</h3>
                <p className="text-xs text-sanctuary-dark/70 font-medium">
                  Enter authorized administrator credentials to manage pet stays, updates, and payments.
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
                    placeholder="9739887770"
                    value={adminIdentifier}
                    onChange={(e) => setAdminIdentifier(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-black/15 text-xs font-medium focus:outline-none focus:border-sanctuary-gold font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-black uppercase tracking-wider text-sanctuary-dark/70 block mb-1">
                    Administrator Password
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
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

                <div className="text-center text-[11px] text-sanctuary-dark/60 font-medium pt-1">
                  Default Staff Credentials: <code className="font-bold text-sanctuary-dark">9739887770 / Admin@123</code>
                </div>
              </form>
            </div>
          ) : (
            /* Live Dashboard Console */
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
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 block">
                    Paid Revenue
                  </span>
                  <span className="text-2xl font-black text-emerald-800">
                    ₹{(totalRevenue / 100).toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="p-3 bg-blue-50 rounded-2xl border border-blue-200/50">
                  <span className="text-[10px] font-black uppercase tracking-wider text-blue-800 block">
                    Active / In Studio
                  </span>
                  <span className="text-2xl font-black text-blue-900">{activeCount}</span>
                </div>
                <div className="p-3 bg-purple-50 rounded-2xl border border-purple-200/50">
                  <span className="text-[10px] font-black uppercase tracking-wider text-purple-800 block">
                    Completed
                  </span>
                  <span className="text-2xl font-black text-purple-900">{completedCount}</span>
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
                    placeholder="Search ref, pet, parent, phone..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-black/15 text-xs font-medium focus:outline-none focus:border-sanctuary-gold"
                  />
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
              ) : filtered.length === 0 ? (
                <div className="py-16 text-center space-y-1 bg-[#FAF8F5] rounded-3xl border border-black/10">
                  <span className="material-symbols-outlined text-3xl text-gray-400">inbox</span>
                  <p className="text-sm font-black text-sanctuary-dark">No bookings found</p>
                  <p className="text-xs text-sanctuary-dark/60">
                    {searchTerm ? 'No results matched your search query.' : 'New bookings placed on the website will appear here in real-time.'}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filtered.map((b) => {
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
                            <span className="text-sm font-black text-sanctuary-dark">
                              🐾 {b.pet_name}
                            </span>
                            <span className="text-xs text-sanctuary-dark/60 font-semibold">
                              ({b.pet_breed || 'Standard'}, {b.pet_weight_kg || '15'} kg)
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5 flex-wrap">
                            {/* Payment Status Pill */}
                            <span
                              className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                                b.payment_status === 'paid'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {b.payment_status === 'paid' ? '✓ Paid' : '⏳ Pending Payment'}
                            </span>

                            {/* Booking Status Pill */}
                            <span
                              className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                                b.status === 'completed'
                                  ? 'bg-purple-100 text-purple-900'
                                  : b.status === 'in_progress'
                                  ? 'bg-blue-100 text-blue-900'
                                  : b.status === 'cancelled'
                                  ? 'bg-red-100 text-red-900'
                                  : 'bg-emerald-50 text-emerald-900'
                              }`}
                            >
                              {b.status || 'Confirmed'}
                            </span>
                          </div>
                        </div>

                        {/* Details Grid */}
                        <div className="grid sm:grid-cols-3 gap-3 text-xs">
                          {/* Col 1: Service & Dates */}
                          <div>
                            <span className="text-[10px] font-black uppercase text-sanctuary-dark/50 block mb-0.5">
                              Services & Schedule
                            </span>
                            <div className="font-bold text-sanctuary-dark">{b.service_type}</div>
                            <div className="text-[11px] text-sanctuary-dark/70 mt-1 space-y-0.5">
                              <div>📅 Check-in: <strong>{b.check_in_date ? b.check_in_date.split('T')[0] : 'N/A'}</strong></div>
                              {b.check_out_date && b.check_out_date !== b.check_in_date && (
                                <div>🏁 Check-out: <strong>{b.check_out_date.split('T')[0]}</strong> ({b.number_of_days} nights)</div>
                              )}
                              <div>⏰ Slot: {b.drop_off_time || '09:30 AM'}</div>
                            </div>

                            {/* Services Cart breakdown if available */}
                            {servicesList.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {servicesList.map((s: any, idx: number) => (
                                  <span key={idx} className="text-[10px] font-bold bg-sanctuary-sand px-2 py-0.5 rounded-md text-sanctuary-dark">
                                    {s.title} (₹{s.price})
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Col 2: Parent Contact */}
                          <div>
                            <span className="text-[10px] font-black uppercase text-sanctuary-dark/50 block mb-0.5">
                              Pet Parent Details
                            </span>
                            <div className="font-bold text-sanctuary-dark">{b.customer_name || 'Pet Parent'}</div>
                            <div className="mt-1 space-y-0.5 text-[11px]">
                              <div>
                                📞{' '}
                                <a
                                  href={`tel:${b.customer_phone || b.emergency_contact}`}
                                  className="font-mono font-bold text-sanctuary-forest underline hover:text-black"
                                >
                                  {b.customer_phone || b.emergency_contact || 'No phone'}
                                </a>
                              </div>
                              {b.customer_email && (
                                <div className="text-sanctuary-dark/60 truncate">✉️ {b.customer_email}</div>
                              )}
                              {b.is_highway_early_dropoff && (
                                <div className="text-[10px] text-emerald-700 font-bold mt-1">
                                  🚗 Kanakapura Highway Exit Drop-Off
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Col 3: Financials & Razorpay Details */}
                          <div>
                            <span className="text-[10px] font-black uppercase text-sanctuary-dark/50 block mb-0.5">
                              Payment Summary
                            </span>
                            <div className="text-base font-black text-sanctuary-dark">
                              ₹{(b.total_amount_paise / 100).toLocaleString('en-IN')}
                            </div>
                            <div className="text-[11px] text-sanctuary-dark/70 mt-1 space-y-0.5">
                              <div>Method: <strong className="capitalize">{b.payment_method?.replace('_', ' ') || 'Razorpay'}</strong></div>
                              {b.applied_offer_code && (
                                <div className="text-emerald-700 font-bold font-mono">
                                  Coupon: {b.applied_offer_code}
                                </div>
                              )}
                              {b.razorpay_payment_id && (
                                <div className="font-mono text-[10px] text-blue-700 truncate" title={b.razorpay_payment_id}>
                                  Pay ID: {b.razorpay_payment_id}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Special Instructions */}
                        {b.special_instructions && (
                          <div className="p-2 bg-amber-50 rounded-xl border border-amber-200/50 text-[11px] text-amber-900">
                            <strong>Special Notes:</strong> {b.special_instructions}
                          </div>
                        )}

                        {/* Status Change Buttons */}
                        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-black/5">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-[10px] font-black uppercase tracking-wider text-sanctuary-dark/50 mr-1">
                              Update Status:
                            </span>

                            {/* Mark In Progress */}
                            {b.status !== 'in_progress' && (
                              <button
                                disabled={isUpdating}
                                onClick={() => updateBookingStatus(b.id, 'in_progress')}
                                className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[10px] font-black uppercase tracking-wider transition-all disabled:opacity-50"
                              >
                                In Progress
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
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default AdminDashboardModal;
