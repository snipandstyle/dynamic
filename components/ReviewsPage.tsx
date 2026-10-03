import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface ReviewsPageProps {
  onOpenBooking: () => void;
  onNavigate: (page: string) => void;
}

export const ReviewsPage: React.FC<ReviewsPageProps> = ({ onOpenBooking, onNavigate }) => {
  const [filter, setFilter] = useState<'all' | 'boarding' | 'grooming' | 'cats'>('all');

  const reviews = [
    {
      id: 1,
      name: 'Narasimha Murthy N Manjula',
      pet: 'Tuffy (Dog)',
      service: 'grooming',
      rating: 5,
      date: 'Google Verified',
      text: 'They speak very well. Nice work, good pet studio — keep it up! Today I visited for my dog Tuffy’s haircut, bathing, and nail care. Truly professional work.',
    },
    {
      id: 2,
      name: 'Priya Venkatesh',
      pet: 'Simba (Golden Retriever)',
      service: 'boarding',
      rating: 5,
      date: '7 Days Boarding Stay',
      text: 'Left Simba for 7 days during our family vacation. Received morning and evening 4K WhatsApp videos of him playing on the clean AC floor. Returned home smelling amazing with his complimentary free spa bath!',
    },
    {
      id: 3,
      name: 'Gagan Raj',
      pet: 'Persian Cat Parent',
      service: 'cats',
      rating: 5,
      date: 'Google Verified',
      text: 'Really happy with the grooming service. The team was professional, calm, and handled my cat with great care. The environment was clean and reassuring. Will definitely recommend to other cat parents.',
    },
    {
      id: 4,
      name: 'Arjun Nambiar',
      pet: 'Milo (Shih Tzu)',
      service: 'grooming',
      rating: 5,
      date: 'Breed Scissor Haircut',
      text: 'Best breed haircut in South Bangalore. Milo gets very anxious at normal commercial parlors, but here the groomers are so patient. Perfect teddy face shape and clean ears!',
    },
    {
      id: 5,
      name: 'Lakshmi Lachii',
      pet: 'Budget Friendly Groom',
      service: 'grooming',
      rating: 5,
      date: 'Google Verified',
      text: 'Experience was soooo Good and Budget Friendly. One of the best places in Bengaluru for pet grooming. Transparent rates and lovely staff.',
    },
    {
      id: 6,
      name: 'Deepa Srinivas',
      pet: 'Bella & Coco (Cats)',
      service: 'boarding',
      rating: 5,
      date: '5 Days Cat Boarding',
      text: 'Cage-free cat boarding was our biggest worry until we found Snip & Style. Dedicated quiet room for cats, timely feeding, zero stress. The WhatsApp video updates gave us complete peace of mind.',
    },
    {
      id: 7,
      name: 'Baby Ramakrishna',
      pet: 'Dog Parent',
      service: 'grooming',
      rating: 5,
      date: 'Google Verified',
      text: 'I love to have grooming sessions in Snip & Style because I got a great experience. Highly recommended for premium pet care.',
    },
    {
      id: 8,
      name: 'Sky Mobile’s',
      pet: 'Puppy Parent',
      service: 'grooming',
      rating: 5,
      date: 'Google Verified',
      text: 'Thank you for grooming my pet! Now it looks so cute. Thank you so much mam for the wonderful care.',
    },
    {
      id: 9,
      name: 'Vinod Jackson',
      pet: 'Pet Parent',
      service: 'grooming',
      rating: 5,
      date: 'Google Verified',
      text: 'It’s good grooming, I’m happy with the results. Professional and very friendly staff who genuinely care about dogs.',
    },
  ];

  const filteredReviews = filter === 'all' ? reviews : reviews.filter((r) => r.service === filter);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-[#FAF8F5] text-left"
    >
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* Breadcrumb & Header */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-sanctuary-dark/60">
            <button onClick={() => onNavigate('home')} className="hover:text-sanctuary-gold">Home</button>
            <span>/</span>
            <span className="text-sanctuary-gold">Reviews</span>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-black uppercase tracking-wider mb-2">
                <span>Verified Google Reviews • 4.9 / 5.0 Rating</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-black text-sanctuary-dark tracking-tight">
                Our Happy <span className="text-sanctuary-gold">Tails.</span>
              </h1>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-black/10 shadow-xs flex items-center gap-3">
              <div className="text-3xl font-black text-sanctuary-dark">4.9</div>
              <div>
                <div className="flex text-amber-400 text-base leading-none">★★★★★</div>
                <div className="text-[10px] text-sanctuary-dark/60 font-bold mt-1">Based on 380+ Google Reviews</div>
              </div>
            </div>
          </div>

          <p className="text-sm text-sanctuary-dark/75 font-medium max-w-2xl">
            Real feedback from pet parents across Kanakapura Road, Banashankari, JP Nagar, and Jayanagar who trust us with their dogs and cats.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: 'all', label: 'All Reviews (9)' },
            { id: 'boarding', label: 'Cage-Free Boarding' },
            { id: 'grooming', label: 'Dog Grooming & Spa' },
            { id: 'cats', label: 'Cat Care' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id as any)}
              className={`py-2 px-4 rounded-xl text-xs font-bold transition-all ${
                filter === tab.id
                  ? 'bg-sanctuary-forest text-white shadow-xs'
                  : 'bg-white text-sanctuary-dark/70 border border-black/10 hover:border-sanctuary-gold'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Reviews Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredReviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-white rounded-2xl p-5 border border-black/10 shadow-xs flex flex-col justify-between space-y-4 hover:shadow-md transition-all"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex text-amber-400 text-sm">
                    {[...Array(rev.rating)].map((_, i) => (
                      <span key={i}>★</span>
                    ))}
                  </div>
                  <span className="text-[9px] font-bold text-sanctuary-dark/50 bg-black/5 px-2 py-0.5 rounded-full">
                    {rev.date}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-sanctuary-dark/85 font-medium leading-relaxed italic">
                  “{rev.text}”
                </p>
              </div>

              <div className="pt-3 border-t border-black/5 flex items-center gap-3">
                <div className="size-9 rounded-xl bg-sanctuary-sand text-sanctuary-dark flex items-center justify-center font-black text-sm">
                  {rev.name.charAt(0)}
                </div>
                <div>
                  <h4 className="text-xs font-black text-sanctuary-dark leading-tight">{rev.name}</h4>
                  <p className="text-[10px] text-sanctuary-gold font-bold">{rev.pet}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Banner */}
        <div className="p-6 bg-sanctuary-forest text-white rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
          <div>
            <h3 className="text-lg font-black text-white">Experience the Snip & Style Care</h3>
            <p className="text-xs text-white/75 mt-0.5">
              Book online with promo code <span className="text-sanctuary-gold font-mono font-bold">GROOM10</span> or <span className="text-sanctuary-gold font-mono font-bold">FREESPA</span> for exclusive savings.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenBooking}
              className="py-3 px-8 bg-sanctuary-gold hover:bg-white text-sanctuary-dark rounded-xl font-black text-xs uppercase tracking-wider transition-all shadow-md"
            >
              Book Online Now
            </button>
          </div>
        </div>

      </div>
    </motion.div>
  );
};

export default ReviewsPage;
