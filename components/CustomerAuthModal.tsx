import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CustomerAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess?: (user: any) => void;
}

export const CustomerAuthModal: React.FC<CustomerAuthModalProps> = ({
  isOpen,
  onClose,
  onAuthSuccess,
}) => {
  const [tab, setTab] = useState<'login' | 'signup' | 'bookings'>('login');
  const [user, setUser] = useState<any>(null);
  const [userBookings, setUserBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Form states
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  // Check existing session
  useEffect(() => {
    const token = localStorage.getItem('snip_auth_token');
    const savedUser = localStorage.getItem('snip_user');
    if (token && savedUser) {
      try {
        const u = JSON.parse(savedUser);
        setUser(u);
        setTab('bookings');
        fetchUserBookings(token);
      } catch {}
    }
  }, [isOpen]);

  const fetchUserBookings = async (token: string) => {
    try {
      const res = await fetch('/api/bookings', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.bookings) {
        setUserBookings(data.bookings);
      }
    } catch (err) {
      console.error('Failed to fetch user bookings', err);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Login failed. Please verify credentials.');
      }

      localStorage.setItem('snip_auth_token', data.token);
      localStorage.setItem('snip_user', JSON.stringify(data.user));
      setUser(data.user);
      setSuccessMsg('Welcome back! Loading your profile...');
      onAuthSuccess?.(data.user);
      window.dispatchEvent(new CustomEvent('snip_auth_change'));
      fetchUserBookings(data.token);
      setTab('bookings');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, phone, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Registration failed.');
      }

      localStorage.setItem('snip_auth_token', data.token);
      localStorage.setItem('snip_user', JSON.stringify(data.user));
      setUser(data.user);
      setSuccessMsg('Account created successfully!');
      onAuthSuccess?.(data.user);
      window.dispatchEvent(new CustomEvent('snip_auth_change'));
      setTab('bookings');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('snip_auth_token');
    localStorage.removeItem('snip_user');
    setUser(null);
    setUserBookings([]);
    setTab('login');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[220] flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-black/10 overflow-hidden text-left relative my-6"
      >
        {/* Header */}
        <div className="p-5 sm:p-6 pb-4 flex items-center justify-between border-b border-black/5 bg-[#FAF8F5]">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-sanctuary-gold">
              Pet Parent Portal
            </span>
            <h2 className="text-xl font-black text-sanctuary-dark">
              {user ? `Account: ${user.fullName}` : tab === 'login' ? 'Sign In to Account' : 'Register New Account'}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="size-8 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center transition-colors"
          >
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>

        {/* Tab switchers if not logged in */}
        {!user && (
          <div className="p-4 pb-0">
            <div className="grid grid-cols-2 p-1 bg-sanctuary-sand rounded-xl text-xs font-black">
              <button
                onClick={() => { setTab('login'); setError(''); }}
                className={`py-2 rounded-lg transition-all ${
                  tab === 'login' ? 'bg-sanctuary-forest text-white shadow-xs' : 'text-sanctuary-dark/70'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => { setTab('signup'); setError(''); }}
                className={`py-2 rounded-lg transition-all ${
                  tab === 'signup' ? 'bg-sanctuary-forest text-white shadow-xs' : 'text-sanctuary-dark/70'
                }`}
              >
                Create Account
              </button>
            </div>
          </div>
        )}

        {/* Body */}
        <div className="p-5 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {error && (
            <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs font-bold border border-red-200">
              {error}
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
              {successMsg}
            </div>
          )}

          {/* LOGIN FORM */}
          {!user && tab === 'login' && (
            <form onSubmit={handleLogin} className="space-y-3.5">
              <div>
                <label className="text-[11px] font-black uppercase tracking-wider text-sanctuary-dark/70 block mb-1">
                  Mobile Number (10 digits)
                </label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 9845012345"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-black/15 text-xs font-medium focus:outline-none focus:border-sanctuary-gold font-mono font-bold"
                />
              </div>

              <div>
                <label className="text-[11px] font-black uppercase tracking-wider text-sanctuary-dark/70 block mb-1">
                  Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-black/15 text-xs font-medium focus:outline-none focus:border-sanctuary-gold"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-sanctuary-forest hover:bg-black text-white rounded-xl font-black text-xs uppercase tracking-wider transition-all disabled:opacity-50"
              >
                {loading ? 'Authenticating...' : 'Sign In'}
              </button>

              <div className="text-center pt-2">
                <span className="text-xs text-sanctuary-dark/60 font-medium">Demo Admin Login: </span>
                <span className="text-xs font-mono font-bold text-sanctuary-dark">9739887770 / Admin@123</span>
              </div>
            </form>
          )}

          {/* SIGNUP FORM */}
          {!user && tab === 'signup' && (
            <form onSubmit={handleSignup} className="space-y-3.5">
              <div>
                <label className="text-[11px] font-black uppercase tracking-wider text-sanctuary-dark/70 block mb-1">
                  Pet Parent Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Aditi Sharma"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-black/15 text-xs font-medium focus:outline-none focus:border-sanctuary-gold"
                />
              </div>

              <div>
                <label className="text-[11px] font-black uppercase tracking-wider text-sanctuary-dark/70 block mb-1">
                  Mobile Number (10 digits)
                </label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 9845012345"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-black/15 text-xs font-medium focus:outline-none focus:border-sanctuary-gold font-mono font-bold"
                />
              </div>

              <div>
                <label className="text-[11px] font-black uppercase tracking-wider text-sanctuary-dark/70 block mb-1">
                  Create Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="Minimum 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-black/15 text-xs font-medium focus:outline-none focus:border-sanctuary-gold"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-sanctuary-forest hover:bg-black text-white rounded-xl font-black text-xs uppercase tracking-wider transition-all disabled:opacity-50"
              >
                {loading ? 'Creating Account...' : 'Complete Registration'}
              </button>
            </form>
          )}

          {/* LOGGED IN / MY BOOKINGS VIEW */}
          {user && (
            <div className="space-y-4">
              <div className="p-3 bg-sanctuary-sand/60 rounded-2xl flex items-center justify-between border border-black/5">
                <div>
                  <div className="text-xs font-black text-sanctuary-dark">{user.fullName}</div>
                  <div className="text-[11px] text-sanctuary-dark/60">{user.email} • {user.phone || 'Phone verified'}</div>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-xs font-bold text-red-600 hover:underline px-2 py-1"
                >
                  Sign Out
                </button>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black text-sanctuary-dark">Your Bookings & Stays</h3>
                  <button
                    onClick={() => {
                      const t = localStorage.getItem('snip_auth_token');
                      if (t) fetchUserBookings(t);
                    }}
                    className="text-[10px] text-sanctuary-gold underline font-bold"
                  >
                    Refresh
                  </button>
                </div>

                {userBookings.length === 0 ? (
                  <div className="p-6 bg-white rounded-2xl border border-black/10 text-center space-y-1">
                    <p className="text-xs font-bold text-sanctuary-dark">No active bookings found</p>
                    <p className="text-[11px] text-sanctuary-dark/60">
                      When you book cage-free boarding or grooming, your orders will appear here.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {userBookings.map((b) => (
                      <div
                        key={b.id}
                        className="p-3.5 bg-white rounded-2xl border border-black/10 shadow-xs space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-xs font-black text-sanctuary-dark">
                            Ref: {b.booking_ref}
                          </span>
                          <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                            b.payment_status === 'paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {b.payment_status === 'paid' ? 'Payment Verified' : 'Pending Payment'}
                          </span>
                        </div>

                        <div className="text-xs text-sanctuary-dark font-medium">
                          <strong>{b.pet_name}</strong> ({b.pet_breed || 'Standard'}, {b.pet_weight_kg} kg)
                          <div className="text-sanctuary-dark/70 text-[11px] mt-0.5">
                            {b.service_type} • {b.number_of_days} Day(s) • Total: ₹{(b.total_amount_paise / 100).toFixed(0)}
                          </div>
                          {b.is_highway_early_dropoff && (
                            <div className="text-emerald-700 text-[10px] font-bold mt-0.5">
                              Kanakapura Highway Vacation Drop-off Requested
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default CustomerAuthModal;
