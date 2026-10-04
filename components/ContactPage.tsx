import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface ContactPageProps {
  onOpenBooking: () => void;
  onNavigate: (page: string) => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onOpenBooking, onNavigate }) => {
  const [name, setName] = useState('');
  const [pet, setPet] = useState('');
  const [phone, setPhone] = useState('');
  const [query, setQuery] = useState('');

  const contactCards = [
    {
      icon: 'call',
      title: 'Call Us Directly',
      val: '+91 9739887770',
      action: 'tel:+919739887770',
      btnText: 'Call Now',
      color: 'bg-emerald-50 text-emerald-800',
    },
    {
      icon: 'event_available',
      title: 'Online Booking',
      val: 'Instant Confirmation',
      action: '#book',
      btnText: 'Book Now',
      color: 'bg-sanctuary-sand text-sanctuary-forest',
    },
    {
      icon: 'mail',
      title: 'Email Support',
      val: 'Snip&style857@gmail.com',
      action: 'mailto:Snip&style857@gmail.com',
      btnText: 'Send Email',
      color: 'bg-blue-50 text-blue-700',
    },
    {
      icon: 'schedule',
      title: 'Working Hours',
      val: '09:30 AM – 08:30 PM',
      sub: 'Open 7 Days a Week (Mon – Sun)',
      color: 'bg-amber-50 text-amber-800',
    },
  ];

  const taxiZones = [
    'Kanakapura Main Road',
    'Thalaghattapura & Uttarahalli',
    'JP Nagar (Phases 1-9)',
    'Banashankari (Stages 1-3)',
    'Jayanagar (All Blocks)',
    'Bannerghatta Road',
    'Rajarajeshwari Nagar (RR Nagar)',
  ];

  const [inquirySent, setInquirySent] = useState(false);

  const handleSendInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    setInquirySent(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-[#FAF8F5] text-left"
    >
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-sanctuary-dark/60">
            <button onClick={() => onNavigate('home')} className="hover:text-sanctuary-gold">Home</button>
            <span>/</span>
            <span className="text-sanctuary-gold">Contact & Location</span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-sanctuary-gold/20 text-sanctuary-dark text-[11px] font-black uppercase tracking-wider">
            <span>Studio Location & Booking Support</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-sanctuary-dark tracking-tight leading-tight">
            Visit Our <span className="text-sanctuary-gold">Studio.</span>
          </h1>

          <p className="text-sm sm:text-base text-sanctuary-dark/75 font-medium max-w-2xl leading-relaxed">
            Conveniently located on Kanakapura Main Road, beside the Shani Mahatma Temple with hassle-free parking. Instant response via phone and online reservations.
          </p>
        </div>

        {/* 4 Contact Cards Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {contactCards.map((c, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-5 border border-black/10 shadow-xs flex flex-col justify-between space-y-3 hover:shadow-md transition-all"
            >
              <div className="space-y-2">
                <div className={`size-11 rounded-xl ${c.color} flex items-center justify-center`}>
                  <span className="material-symbols-outlined text-2xl">{c.icon}</span>
                </div>
                <div className="text-xs font-bold text-sanctuary-dark/60 uppercase tracking-wider">{c.title}</div>
                <div className="text-sm sm:text-base font-black text-sanctuary-dark break-words">{c.val}</div>
                {c.sub && <div className="text-[11px] text-sanctuary-dark/70 font-semibold">{c.sub}</div>}
              </div>

              {c.action && (
                <a
                  href={c.action}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-1.5 px-3 bg-sanctuary-sand hover:bg-black/10 text-sanctuary-dark rounded-lg font-bold text-[11px] uppercase tracking-wider text-center transition-colors block"
                >
                  {c.btnText}
                </a>
              )}
            </div>
          ))}
        </div>

        {/* 2-Column Split: Map & Directions Left + WhatsApp Inquiry Form Right */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Studio Location & Pickup Info */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-black/10 shadow-md space-y-4">
              <div className="flex items-center gap-3">
                <div className="size-12 rounded-2xl bg-sanctuary-forest text-sanctuary-gold flex items-center justify-center font-black">
                  <span className="material-symbols-outlined text-2xl">location_on</span>
                </div>
                <div>
                  <h3 className="text-lg font-black text-sanctuary-dark">Snip & Style Studio</h3>
                  <p className="text-xs text-sanctuary-dark/70 font-semibold">
                    Site no 61, Kanakapura Main Road, Bangalore 560082
                  </p>
                </div>
              </div>

              <p className="text-xs text-sanctuary-dark/80 font-medium leading-relaxed">
                <strong className="text-sanctuary-dark">Landmark:</strong> Situated directly on Kanakapura Main Road, right beside the prominent <strong className="text-sanctuary-dark">Shani Mahatma Temple</strong>. Ample dedicated parking space is available right outside for convenient drop-offs and pickups.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <a
                  href="https://share.google/RaJSL1HJJaTvSBVef"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 px-5 bg-sanctuary-forest hover:bg-black text-white rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-sm"
                >
                  <span className="material-symbols-outlined text-sm">directions</span>
                  <span>Google Maps Directions</span>
                </a>
                <a
                  href="https://wa.me/919739887770?text=Hi%2C%20I%20would%20like%20to%20schedule%20a%20studio%20visit%20at%20Snip%20%26%20Style!"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 px-4 bg-sanctuary-sand hover:bg-black/10 text-sanctuary-dark rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-colors border border-black/10"
                >
                  <span className="material-symbols-outlined text-sm">event</span>
                  <span>Schedule Studio Visit</span>
                </a>
              </div>
            </div>

            {/* Doorstep Pet Pickup Section */}
            <div className="bg-sanctuary-forest text-white rounded-3xl p-6 sm:p-8 shadow-md space-y-3">
              <div className="flex items-center gap-2.5">
                <span className="size-8 rounded-lg bg-sanctuary-gold text-sanctuary-dark flex items-center justify-center font-black">
                  <span className="material-symbols-outlined text-lg">local_taxi</span>
                </span>
                <h3 className="text-base font-black text-white">Doorstep Pet Pickup Service</h3>
              </div>
              <p className="text-xs text-white/80 font-medium leading-relaxed">
                Can't drive down? Our sanitized pet pickup service collects and drops your companion safely with certified pet handlers.
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {taxiZones.map((zone, i) => (
                  <span
                    key={i}
                    className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-white/10 text-white/90 border border-white/10"
                  >
                    ✓ {zone}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Quick Direct Inquiry Form */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-black/10 shadow-md space-y-4">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-sanctuary-gold">
                Direct Inquiry
              </span>
              <h3 className="text-xl font-black text-sanctuary-dark mt-0.5">Send a Message</h3>
              <p className="text-xs text-sanctuary-dark/70 font-medium mt-1">
                Have questions about boarding dates, special coats, or quotes? Submit below for immediate studio team callback.
              </p>
            </div>

            {inquirySent ? (
              <div className="p-6 text-center space-y-3 bg-emerald-50 rounded-2xl border border-emerald-200">
                <span className="material-symbols-outlined text-4xl text-emerald-600">check_circle</span>
                <h4 className="text-base font-black text-sanctuary-dark">Inquiry Received!</h4>
                <p className="text-xs text-sanctuary-dark/70 font-medium">
                  Thank you, {name}. Our Kanakapura Highway studio team has received your message and will get back to you directly.
                </p>
                <button
                  onClick={onOpenBooking}
                  className="py-2.5 px-6 bg-sanctuary-forest hover:bg-black text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shadow-sm"
                >
                  Proceed to Direct Online Booking
                </button>
              </div>
            ) : (
              <form onSubmit={handleSendInquiry} className="space-y-3">
                <div>
                  <label className="text-[10px] font-black uppercase text-sanctuary-dark/70 block mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-2.5 bg-sanctuary-sand/40 rounded-xl border border-black/10 text-xs font-medium focus:outline-none focus:border-sanctuary-gold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-black uppercase text-sanctuary-dark/70 block mb-1">
                      Pet Type & Breed
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Beagle / Persian"
                      value={pet}
                      onChange={(e) => setPet(e.target.value)}
                      className="w-full p-2.5 bg-sanctuary-sand/40 rounded-xl border border-black/10 text-xs font-medium focus:outline-none focus:border-sanctuary-gold"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase text-sanctuary-dark/70 block mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 9876543210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full p-2.5 bg-sanctuary-sand/40 rounded-xl border border-black/10 text-xs font-medium focus:outline-none focus:border-sanctuary-gold"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase text-sanctuary-dark/70 block mb-1">
                    Your Query or Preferred Dates
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Tell us what service you need and your preferred dates..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full p-2.5 bg-sanctuary-sand/40 rounded-xl border border-black/10 text-xs font-medium focus:outline-none focus:border-sanctuary-gold resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-sanctuary-forest hover:bg-black text-white rounded-xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all"
                >
                  <span className="material-symbols-outlined text-base">send</span>
                  <span>Submit Inquiry</span>
                </button>
              </form>
            )}
          </div>

        </div>

      </div>
    </motion.div>
  );
};

export default ContactPage;
