import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface AccountPageProps {
  onNavigateHome: () => void;
  onOpenBooking: () => void;
}

export const AccountPage: React.FC<AccountPageProps> = ({ onNavigateHome, onOpenBooking }) => {
  const [user, setUser] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [authTab, setAuthTab] = useState<'login' | 'signup'>('login');

  // Form states for login/signup
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [copiedRef, setCopiedRef] = useState<string | null>(null);

  // Profile & Password Update State
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [editFullName, setEditFullName] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState('');
  const [editSuccess, setEditSuccess] = useState('');

  useEffect(() => {
    checkSession();
    window.addEventListener('snip_auth_change', checkSession);
    return () => window.removeEventListener('snip_auth_change', checkSession);
  }, []);

  const checkSession = () => {
    const token = localStorage.getItem('snip_auth_token');
    const savedUser = localStorage.getItem('snip_user');
    if (token && savedUser) {
      try {
        const u = JSON.parse(savedUser);
        setUser(u);
        fetchMyBookings(token);
      } catch {}
    } else {
      setUser(null);
      setBookings([]);
    }
  };

  const fetchMyBookings = async (token: string) => {
    setLoading(true);
    try {
      const res = await fetch('/api/bookings', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.bookings) {
        setBookings(data.bookings);
      }
    } catch (err) {
      console.error('Failed to load user bookings', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed. Please check your credentials.');

      localStorage.setItem('snip_auth_token', data.token);
      localStorage.setItem('snip_user', JSON.stringify(data.user));
      setUser(data.user);
      window.dispatchEvent(new CustomEvent('snip_auth_change'));
      fetchMyBookings(data.token);
    } catch (err: any) {
      setAuthError(err.message);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, phone, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Signup failed.');

      localStorage.setItem('snip_auth_token', data.token);
      localStorage.setItem('snip_user', JSON.stringify(data.user));
      setUser(data.user);
      window.dispatchEvent(new CustomEvent('snip_auth_change'));
      fetchMyBookings(data.token);
    } catch (err: any) {
      setAuthError(err.message);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('snip_auth_token');
    localStorage.removeItem('snip_user');
    setUser(null);
    setBookings([]);
    window.dispatchEvent(new CustomEvent('snip_auth_change'));
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setEditError('');
    setEditSuccess('');
    setEditLoading(true);

    try {
      const token = localStorage.getItem('snip_auth_token');
      if (!token) throw new Error('Authentication required.');

      const payload: any = {};
      if (editFullName.trim() && editFullName.trim() !== user?.fullName) {
        payload.fullName = editFullName.trim();
      }
      if (newPassword) {
        if (!currentPassword) {
          throw new Error('Please enter your current password to set a new password.');
        }
        if (newPassword.length < 6) {
          throw new Error('New password must be at least 6 characters.');
        }
        payload.currentPassword = currentPassword;
        payload.newPassword = newPassword;
      }

      if (Object.keys(payload).length === 0) {
        throw new Error('No changes provided to save.');
      }

      const res = await fetch('/api/auth/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update profile.');

      if (data.user) {
        localStorage.setItem('snip_user', JSON.stringify(data.user));
        setUser(data.user);
        window.dispatchEvent(new CustomEvent('snip_auth_change'));
      }

      setEditSuccess('Profile and password updated successfully in database!');
      setCurrentPassword('');
      setNewPassword('');
      setTimeout(() => {
        setShowEditProfileModal(false);
        setEditSuccess('');
      }, 1800);
    } catch (err: any) {
      setEditError(err.message);
    } finally {
      setEditLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedRef(text);
    setTimeout(() => setCopiedRef(null), 2500);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-sanctuary-dark py-8 sm:py-12 px-4 sm:px-6 lg:px-8 text-left">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <button
            onClick={onNavigateHome}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-sanctuary-dark/70 hover:text-black py-1.5 px-3 rounded-xl bg-white border border-black/10 transition-colors shadow-xs"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            <span>Back to Home</span>
          </button>

          {user && (
            <button
              onClick={handleLogout}
              className="text-xs font-bold text-red-600 hover:text-red-700 px-3 py-1.5 rounded-xl border border-red-200 hover:bg-red-50 transition-colors"
            >
              Sign Out
            </button>
          )}
        </div>

        {!user ? (
          /* Sign In / Sign Up Form Card */
          <div className="max-w-md mx-auto bg-white rounded-3xl p-6 sm:p-8 border border-black/10 shadow-xl space-y-5">
            <div className="text-center space-y-1">
              <div className="size-12 rounded-2xl bg-sanctuary-gold/20 text-sanctuary-dark mx-auto flex items-center justify-center font-black mb-2">
                <span className="material-symbols-outlined text-2xl text-sanctuary-forest">pets</span>
              </div>
              <h2 className="text-2xl font-black text-sanctuary-dark">Pet Parent Portal</h2>
              <p className="text-xs text-sanctuary-dark/65 font-medium">
                Log in with your mobile number to view active bookings, receipts, and pet stay updates.
              </p>
            </div>

            {/* Tabs */}
            <div className="flex bg-sanctuary-sand p-1 rounded-2xl">
              <button
                type="button"
                onClick={() => { setAuthTab('login'); setAuthError(''); }}
                className={`flex-1 py-2 text-xs font-black rounded-xl transition-all ${
                  authTab === 'login' ? 'bg-sanctuary-forest text-white shadow-xs' : 'text-sanctuary-dark/70'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => { setAuthTab('signup'); setAuthError(''); }}
                className={`flex-1 py-2 text-xs font-black rounded-xl transition-all ${
                  authTab === 'signup' ? 'bg-sanctuary-forest text-white shadow-xs' : 'text-sanctuary-dark/70'
                }`}
              >
                New Account
              </button>
            </div>

            {authError && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs font-bold text-red-700">
                {authError}
              </div>
            )}

            {authTab === 'login' ? (
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
                    className="w-full p-3 rounded-xl border border-black/15 text-xs font-medium focus:outline-none focus:border-sanctuary-gold font-mono font-bold"
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
                    className="w-full p-3 rounded-xl border border-black/15 text-xs font-medium focus:outline-none focus:border-sanctuary-gold"
                  />
                </div>

                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full py-3 bg-sanctuary-forest hover:bg-black text-white rounded-xl font-black text-xs uppercase tracking-wider transition-all disabled:opacity-50 shadow-md"
                >
                  {authLoading ? 'Signing In...' : 'Sign In to Account'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleSignup} className="space-y-3.5">
                <div>
                  <label className="text-[11px] font-black uppercase tracking-wider text-sanctuary-dark/70 block mb-1">
                    Your Full Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full p-3 rounded-xl border border-black/15 text-xs font-medium focus:outline-none focus:border-sanctuary-gold"
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
                    className="w-full p-3 rounded-xl border border-black/15 text-xs font-medium focus:outline-none focus:border-sanctuary-gold font-mono font-bold"
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
                    className="w-full p-3 rounded-xl border border-black/15 text-xs font-medium focus:outline-none focus:border-sanctuary-gold"
                  />
                </div>

                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full py-3 bg-sanctuary-forest hover:bg-black text-white rounded-xl font-black text-xs uppercase tracking-wider transition-all disabled:opacity-50 shadow-md"
                >
                  {authLoading ? 'Creating Account...' : 'Register Account'}
                </button>
              </form>
            )}
          </div>
        ) : (
          /* Logged In Account Dashboard */
          <div className="space-y-6">
            {/* User Profile Card */}
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-black/10 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="size-14 rounded-2xl bg-sanctuary-forest text-sanctuary-gold flex items-center justify-center font-black text-xl shadow-xs">
                  {user.fullName ? user.fullName[0].toUpperCase() : 'P'}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-black text-sanctuary-dark">{user.fullName}</h2>
                    <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      Verified Member
                    </span>
                  </div>
                  <div className="text-xs text-sanctuary-dark/65 font-medium mt-0.5 flex items-center gap-2">
                    <span>📱 {user.phone || 'Phone verified'}</span>
                    <span>•</span>
                    <span>Bengaluru, India</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto flex-wrap">
                <button
                  type="button"
                  onClick={() => {
                    setEditFullName(user.fullName || '');
                    setCurrentPassword('');
                    setNewPassword('');
                    setEditError('');
                    setEditSuccess('');
                    setShowEditProfileModal(true);
                  }}
                  className="py-2.5 px-4 bg-white hover:bg-sanctuary-sand border border-black/15 text-sanctuary-dark rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-2xs flex items-center justify-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-sm">lock_reset</span>
                  <span>Update Password</span>
                </button>

                <button
                  onClick={onOpenBooking}
                  className="py-2.5 px-5 bg-sanctuary-forest hover:bg-black text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-sm flex items-center justify-center gap-1.5"
                >
                  <span>Book New Service</span>
                  <span className="material-symbols-outlined text-sm">add</span>
                </button>
              </div>
            </div>

            {/* Bookings & Stays History */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-black text-sanctuary-dark">Your Bookings & Stay Records</h3>
                  <p className="text-xs text-sanctuary-dark/60 font-medium">
                    All past and upcoming pet boarding and grooming orders
                  </p>
                </div>

                <button
                  onClick={() => {
                    const token = localStorage.getItem('snip_auth_token');
                    if (token) fetchMyBookings(token);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-white border border-black/10 hover:border-sanctuary-gold text-xs font-bold text-sanctuary-dark flex items-center gap-1 shadow-xs transition-colors"
                >
                  <span className="material-symbols-outlined text-sm">refresh</span>
                  <span>Refresh</span>
                </button>
              </div>

              {loading ? (
                <div className="py-16 text-center space-y-2 bg-white rounded-3xl border border-black/10">
                  <div className="size-6 border-2 border-sanctuary-forest border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-xs font-bold text-sanctuary-dark/60">Loading your pet stay history...</p>
                </div>
              ) : bookings.length === 0 ? (
                <div className="py-14 text-center space-y-3 bg-white rounded-3xl border border-black/10 p-6">
                  <div className="size-12 rounded-2xl bg-sanctuary-sand mx-auto flex items-center justify-center text-sanctuary-dark/50">
                    <span className="material-symbols-outlined text-2xl">event_busy</span>
                  </div>
                  <div>
                    <h4 className="text-base font-black text-sanctuary-dark">No Bookings Yet</h4>
                    <p className="text-xs text-sanctuary-dark/60 max-w-sm mx-auto mt-0.5">
                      You haven't placed any bookings yet. Reserve cage-free boarding or a spa grooming session to see your records here.
                    </p>
                  </div>
                  <button
                    onClick={onOpenBooking}
                    className="py-2.5 px-6 bg-sanctuary-gold hover:bg-amber-400 text-sanctuary-dark rounded-xl font-black text-xs uppercase tracking-wider transition-all shadow-sm"
                  >
                    Explore Packages & Book Now
                  </button>
                </div>
              ) : (
                <div className="space-y-3.5">
                  {bookings.map((b) => {
                    const servicesList = Array.isArray(b.services_json) ? b.services_json : [];

                    return (
                      <div
                        key={b.id}
                        className="bg-white rounded-2xl p-5 border border-black/10 shadow-xs hover:border-black/20 transition-all space-y-3"
                      >
                        {/* Reference & Status */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-black/5 pb-2.5">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-black px-2.5 py-1 rounded-lg bg-sanctuary-forest text-white">
                              {b.booking_ref}
                            </span>
                            <button
                              onClick={() => copyToClipboard(b.booking_ref)}
                              className="text-[10px] text-sanctuary-dark/50 hover:text-black font-bold uppercase underline"
                            >
                              {copiedRef === b.booking_ref ? 'Copied!' : 'Copy Ref'}
                            </button>
                          </div>

                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span
                              className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                                b.payment_status === 'paid'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {b.payment_status === 'paid' ? '✓ Payment Verified' : '⏳ Pay at Studio'}
                            </span>

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

                        {/* Content Grid */}
                        <div className="grid sm:grid-cols-3 gap-3 text-xs">
                          <div>
                            <span className="text-[10px] font-black uppercase text-sanctuary-dark/50 block mb-0.5">
                              Companion
                            </span>
                            <div className="font-black text-sm text-sanctuary-dark">
                              🐾 {b.pet_name}
                            </div>
                            <div className="text-[11px] text-sanctuary-dark/65 font-medium mt-0.5">
                              {b.pet_breed || 'Standard Breed'} • {b.pet_weight_kg || '15'} kg
                            </div>
                          </div>

                          <div>
                            <span className="text-[10px] font-black uppercase text-sanctuary-dark/50 block mb-0.5">
                              Service & Dates
                            </span>
                            <div className="font-bold text-sanctuary-dark leading-tight">{b.service_type}</div>
                            <div className="text-[11px] text-sanctuary-dark/65 font-medium mt-1 space-y-0.5">
                              <div>📅 Date: <strong>{b.check_in_date ? b.check_in_date.split('T')[0] : 'N/A'}</strong></div>
                              <div>⏰ Time Slot: <strong>{b.drop_off_time || '09:30 AM'}</strong></div>
                              {b.number_of_days > 1 && (
                                <div>⏳ Duration: <strong>{b.number_of_days} nights</strong></div>
                              )}
                            </div>
                          </div>

                          <div>
                            <span className="text-[10px] font-black uppercase text-sanctuary-dark/50 block mb-0.5">
                              Total Amount
                            </span>
                            <div className="text-lg font-black text-sanctuary-dark">
                              ₹{(b.total_amount_paise / 100).toLocaleString('en-IN')}
                            </div>
                            <div className="text-[11px] text-sanctuary-dark/65 font-medium mt-0.5">
                              Method: <strong className="capitalize">{b.payment_method?.replace('_', ' ') || 'Online'}</strong>
                            </div>
                            {b.applied_offer_code && (
                              <div className="text-emerald-700 text-[10px] font-bold font-mono mt-0.5">
                                Coupon Applied: {b.applied_offer_code}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Multi-service tags if present */}
                        {servicesList.length > 1 && (
                          <div className="p-2.5 bg-sanctuary-sand/40 rounded-xl space-y-1">
                            <span className="text-[9px] font-black uppercase tracking-wider text-sanctuary-dark/50 block">
                              Items In Cart:
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                              {servicesList.map((item: any, idx: number) => (
                                <span key={idx} className="text-[10px] font-bold bg-white px-2 py-0.5 rounded-md border border-black/10 text-sanctuary-dark">
                                  {item.title} (₹{item.price})
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Studio Visit Location & Directions Card */}
                        <div className="p-3 bg-gradient-to-r from-amber-50 via-white to-amber-50/80 rounded-xl border border-amber-300/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
                          <div className="flex items-start gap-2">
                            <span className="material-symbols-outlined text-amber-700 text-base shrink-0 mt-0.5">location_on</span>
                            <div>
                              <div className="font-black text-amber-950 text-xs">
                                Studio Location: Site no 61, Kanakapura Main Road, Bangalore 560082
                              </div>
                              <div className="text-[10px] text-amber-900/80 font-medium">
                                Beside Shani Mahatma Temple • Please arrive 5–10 mins prior to your slot: <strong>{b.drop_off_time || '09:30 AM'}</strong>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <a
                              href="https://maps.google.com/?q=Snip+and+Style+Kanakapura+Road+Bengaluru"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="py-1.5 px-3 bg-sanctuary-forest hover:bg-black text-white rounded-lg text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-xs transition-colors"
                            >
                              <span className="material-symbols-outlined text-xs text-sanctuary-gold">navigation</span>
                              <span>Open in Maps</span>
                            </a>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Studio Assistance Footer Card */}
            <div className="p-4 bg-sanctuary-forest text-white rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div>
                <div className="font-bold text-sm">Need help or changes with your booking?</div>
                <div className="text-white/70 text-[11px]">
                  Kanakapura Highway (NH 948), Bengaluru • Direct phone assistance: 9739887770
                </div>
              </div>
              <a
                href="tel:9739887770"
                className="py-1.5 px-3.5 bg-sanctuary-gold text-sanctuary-dark rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-white transition-all text-center shrink-0"
              >
                Call Studio
              </a>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* EDIT PROFILE & UPDATE PASSWORD MODAL */}
        {/* ============================================================ */}
        {showEditProfileModal && (
          <div className="fixed inset-0 z-[250] flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm text-left">
            <div className="bg-white rounded-3xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-black/10 space-y-4 my-auto">
              <div className="flex items-center justify-between border-b border-black/10 pb-3">
                <div className="flex items-center gap-2">
                  <div className="size-8 rounded-xl bg-sanctuary-gold/20 text-sanctuary-dark flex items-center justify-center">
                    <span className="material-symbols-outlined text-base">manage_accounts</span>
                  </div>
                  <div>
                    <h3 className="text-base font-black text-sanctuary-dark">Account Security & Profile</h3>
                    <p className="text-[10px] text-sanctuary-dark/60 font-medium">Update profile name or change account password</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowEditProfileModal(false)}
                  className="size-8 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center"
                >
                  <span className="material-symbols-outlined text-base">close</span>
                </button>
              </div>

              {editError && (
                <div className="p-2.5 rounded-xl bg-red-50 text-red-700 text-xs font-bold border border-red-200">
                  {editError}
                </div>
              )}

              {editSuccess && (
                <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm text-emerald-600">check_circle</span>
                  <span>{editSuccess}</span>
                </div>
              )}

              <form onSubmit={handleUpdateProfile} className="space-y-3">
                <div>
                  <label className="text-[11px] font-black uppercase tracking-wider text-sanctuary-dark/70 block mb-1">
                    Your Full Name
                  </label>
                  <input
                    type="text"
                    value={editFullName}
                    onChange={(e) => setEditFullName(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-black/15 text-xs font-medium focus:outline-none focus:border-sanctuary-gold"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-black uppercase tracking-wider text-sanctuary-dark/70 block mb-1">
                    Current Password (Required to change password)
                  </label>
                  <input
                    type="password"
                    placeholder="Enter current password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-black/15 text-xs font-medium focus:outline-none focus:border-sanctuary-gold"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-black uppercase tracking-wider text-sanctuary-dark/70 block mb-1">
                    New Password (Min 6 characters)
                  </label>
                  <input
                    type="password"
                    placeholder="Enter new secure password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-black/15 text-xs font-medium focus:outline-none focus:border-sanctuary-gold"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowEditProfileModal(false)}
                    className="flex-1 py-2.5 rounded-xl border border-black/10 text-xs font-bold text-sanctuary-dark hover:bg-black/5 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={editLoading}
                    className="flex-1 py-2.5 bg-sanctuary-forest hover:bg-black text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all disabled:opacity-50 flex items-center justify-center gap-1 shadow-sm"
                  >
                    {editLoading ? 'Updating in DB...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default AccountPage;
