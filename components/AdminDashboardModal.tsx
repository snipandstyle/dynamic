import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface AdminDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminDashboardModal: React.FC<AdminDashboardModalProps> = ({ isOpen, onClose }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<'all' | 'boarding' | 'grooming'>('all');

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
        body: JSON.stringify({ email: adminEmail, password: adminPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Admin verification failed');
      if (data.user.role !== 'admin') throw new Error('Access denied: Admin credentials required.');

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

    try {
      await fetch('/api/admin/bookings', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ bookingId, status, paymentStatus }),
      });
      fetchAdminBookings(token);
    } catch (err) {
      console.error('Failed to update booking', err);
    }
  };

  if (!isOpen) return null;

  const filtered = bookings.filter((b) => {
    if (filter === 'boarding') return b.service_type.toLowerCase().includes('board');
    if (filter === 'grooming') return !b.service_type.toLowerCase().includes('board');
    return true;
  });

  return (
    <div className="fixed inset-0 z-[220] flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl border border-black/10 overflow-hidden text-left relative my-6"
      >
        {/* Header */}
        <div className="p-5 sm:p-6 pb-4 flex items-center justify-between border-b border-black/5 bg-[#FAF8F5]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-sanctuary-gold text-2xl">admin_panel_settings</span>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-sanctuary-gold">
                Live Studio Database
              </span>
              <h2 className="text-xl font-black text-sanctuary-dark">
                Admin Management Console
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="size-8 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center transition-colors"
          >
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-4 max-h-[78vh] overflow-y-auto">
          {!isAdmin ? (
            <div className="max-w-md mx-auto py-8 space-y-4">
              <div className="text-center space-y-1">
                <h3 className="text-lg font-black text-sanctuary-dark">Staff / Manager Authentication</h3>
                <p className="text-xs text-sanctuary-dark/60 font-medium">
                  Enter authorized administrator credentials to manage live bookings and customer stays.
                </p>
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs font-bold border border-red-200">
                  {error}
                </div>
              )}

              <form onSubmit={handleAdminLogin} className="space-y-3">
                <input
                  type="email"
                  required
                  placeholder="admin@pawfarm.in"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-black/15 text-xs font-medium focus:outline-none focus:border-sanctuary-gold"
                />
                <input
                  type="password"
                  required
                  placeholder="Password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-black/15 text-xs font-medium focus:outline-none focus:border-sanctuary-gold"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-sanctuary-forest hover:bg-black text-white rounded-xl font-black text-xs uppercase tracking-wider transition-all"
                >
                  {loading ? 'Verifying...' : 'Access Console'}
                </button>
                <div className="text-center text-[11px] text-sanctuary-dark/50">
                  Default credentials: <code>admin@pawfarm.in</code> / <code>Admin@123</code>
                </div>
              </form>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Metrics & Filter Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-black/5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-sanctuary-dark">
                    Total Live Records in Neon DB:
                  </span>
                  <span className="px-2 py-0.5 bg-sanctuary-forest text-white text-xs font-black rounded-lg">
                    {bookings.length}
                  </span>
                </div>

                <div className="flex bg-sanctuary-sand p-1 rounded-xl text-xs font-bold gap-1">
                  <button
                    onClick={() => setFilter('all')}
                    className={`px-3 py-1 rounded-lg transition-all ${
                      filter === 'all' ? 'bg-sanctuary-forest text-white' : 'text-sanctuary-dark/70'
                    }`}
                  >
                    All Bookings
                  </button>
                  <button
                    onClick={() => setFilter('boarding')}
                    className={`px-3 py-1 rounded-lg transition-all ${
                      filter === 'boarding' ? 'bg-sanctuary-forest text-white' : 'text-sanctuary-dark/70'
                    }`}
                  >
                    Boarding
                  </button>
                  <button
                    onClick={() => setFilter('grooming')}
                    className={`px-3 py-1 rounded-lg transition-all ${
                      filter === 'grooming' ? 'bg-sanctuary-forest text-white' : 'text-sanctuary-dark/70'
                    }`}
                  >
                    Grooming
                  </button>
                </div>
              </div>

              {/* Bookings Table / Cards */}
              <div className="space-y-3">
                {filtered.map((b) => (
                  <div
                    key={b.id}
                    className="p-4 bg-white rounded-2xl border border-black/10 shadow-xs space-y-2.5 hover:border-black/20 transition-all"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-black px-2 py-0.5 rounded bg-sanctuary-sand text-sanctuary-dark">
                          {b.booking_ref}
                        </span>
                        <span className="text-xs font-black text-sanctuary-dark">
                          {b.pet_name} ({b.pet_breed || 'Standard'}, {b.pet_weight_kg} kg)
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                          b.payment_status === 'paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {b.payment_status}
                        </span>
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                          {b.status}
                        </span>
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-3 gap-2 text-xs text-sanctuary-dark/75">
                      <div>
                        <span className="text-sanctuary-dark/50 block text-[10px] font-black uppercase">Service & Stay</span>
                        <span className="font-bold">{b.service_type}</span>
                        <span className="block text-[11px] text-sanctuary-dark/60">
                          {b.number_of_days} Day(s) • Check-in: {b.check_in_date ? b.check_in_date.split('T')[0] : 'N/A'}
                        </span>
                      </div>

                      <div>
                        <span className="text-sanctuary-dark/50 block text-[10px] font-black uppercase">Pet Parent Contact</span>
                        <span className="font-bold">{b.customer_name || 'Guest'}</span>
                        <span className="block text-[11px] text-sanctuary-dark/60">
                          {b.customer_phone || b.emergency_contact || 'No phone'}
                        </span>
                      </div>

                      <div>
                        <span className="text-sanctuary-dark/50 block text-[10px] font-black uppercase">Total Bill</span>
                        <span className="font-black text-sm text-sanctuary-dark">₹{(b.total_amount_paise / 100).toFixed(0)}</span>
                        {b.applied_offer_code && (
                          <span className="block text-[10px] font-mono text-emerald-700 font-bold">
                            Code: {b.applied_offer_code}
                          </span>
                        )}
                      </div>
                    </div>

                    {b.is_highway_early_dropoff && (
                      <div className="text-[11px] font-bold text-emerald-800 bg-emerald-50 p-2 rounded-xl flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-sm">directions_car</span>
                        <span>Kanakapura Highway Vacation Drop-off Requested (Drop time: {b.drop_off_time})</span>
                      </div>
                    )}

                    {/* Quick Admin Actions */}
                    <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-black/5">
                      <span className="text-[10px] font-black uppercase tracking-wider text-sanctuary-dark/50">Actions:</span>
                      {b.payment_status !== 'paid' && (
                        <button
                          onClick={() => updateBookingStatus(b.id, undefined, 'paid')}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-black uppercase tracking-wider transition-colors"
                        >
                          Mark Paid
                        </button>
                      )}
                      {b.status !== 'confirmed' && (
                        <button
                          onClick={() => updateBookingStatus(b.id, 'confirmed')}
                          className="px-2.5 py-1 bg-sanctuary-forest hover:bg-black text-white rounded-lg text-[10px] font-black uppercase tracking-wider transition-colors"
                        >
                          Confirm
                        </button>
                      )}
                      {b.status !== 'completed' && (
                        <button
                          onClick={() => updateBookingStatus(b.id, 'completed')}
                          className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[10px] font-black uppercase tracking-wider transition-colors"
                        >
                          Complete
                        </button>
                      )}
                      {b.status !== 'cancelled' && (
                        <button
                          onClick={() => updateBookingStatus(b.id, 'cancelled')}
                          className="px-2.5 py-1 bg-red-100 hover:bg-red-200 text-red-800 rounded-lg text-[10px] font-black uppercase tracking-wider transition-colors"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default AdminDashboardModal;
