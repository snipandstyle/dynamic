import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface GalleryPageProps {
  onOpenBooking: () => void;
  onNavigate: (page: string) => void;
}

export const GalleryPage: React.FC<GalleryPageProps> = ({ onOpenBooking, onNavigate }) => {
  const [filter, setFilter] = useState<'all' | 'grooming' | 'boarding' | 'spa'>('all');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const galleryItems = [
    {
      id: 1,
      title: 'Breed Scissor Makeover (Before & After)',
      category: 'grooming',
      tag: 'Haircut Transformation',
      src: '/images/before_after_grooming.jpg',
      desc: 'Dramatic full-body scissor styling, face shaping, and sanitary trim on a fluffy puppy.',
    },
    {
      id: 2,
      title: '100% Cage-Free Air-Conditioned Boarding Floor',
      category: 'boarding',
      tag: 'Sanctuary Boarding',
      src: '/images/clean_dog_boarding.jpg',
      desc: 'Climate-controlled suite with orthopaedic bedding, clean flooring, and zero wire cages.',
    },
    {
      id: 3,
      title: 'Warm Bubble Hydrotherapy Spa Bath',
      category: 'spa',
      tag: 'Hydrobath Therapy',
      src: '/images/luxury_dog_grooming.jpg',
      desc: 'Gentle organic hydrobath massage with tearless botanical shampoo and soothing lather.',
    },
    {
      id: 4,
      title: 'Teddy Bear Face Trim & Bowtie Styling',
      category: 'grooming',
      tag: 'Puppy Scissor Styling',
      src: '/images/stylish_pet_haircut.jpg',
      desc: 'Hand-scissored round teddy face, ear cleaning, and bow styling for our guest.',
    },
    {
      id: 5,
      title: 'Transparent Studio Care & Cat Boarding',
      category: 'boarding',
      tag: 'Studio Setup',
      src: '/images/brand_flyer_boarding.jpg',
      desc: 'Dedicated quiet cat boarding quarters and fully transparent viewing windows for parents.',
    },
    {
      id: 6,
      title: 'The Snip & Style Family Pets',
      category: 'grooming',
      tag: 'Studio Mascot',
      src: '/images/hero_banner_pets.jpg',
      desc: 'Happy dogs and cats sporting our signature bandanas at our Kanakapura Road studio.',
    },
  ];

  const filteredItems = filter === 'all' ? galleryItems : galleryItems.filter((item) => item.category === filter);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-[#FAF8F5] text-left"
    >
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* Header */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-sanctuary-dark/60">
            <button onClick={() => onNavigate('home')} className="hover:text-sanctuary-gold">Home</button>
            <span>/</span>
            <span className="text-sanctuary-gold">Gallery</span>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-sanctuary-gold/20 text-sanctuary-dark text-[11px] font-black uppercase tracking-wider mb-2">
                <span>Real Studio Transformations & Stays</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-black text-sanctuary-dark tracking-tight">
                Our Work & <span className="text-sanctuary-gold">Happy Paws.</span>
              </h1>
            </div>

            <a
              href="https://www.instagram.com/snipandstyle_grooming"
              target="_blank"
              rel="noopener noreferrer"
              className="py-2.5 px-5 bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] text-white rounded-xl font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-md hover:opacity-90 transition-opacity"
            >
              <span>Follow @snipandstyle_grooming</span>
              <span className="material-symbols-outlined text-sm">open_in_new</span>
            </a>
          </div>

          <p className="text-sm text-sanctuary-dark/75 font-medium max-w-2xl leading-relaxed">
            Real photos from our studio on Kanakapura Main Road. Explore our scissor haircut transformations, clean boarding spaces, and happy bath sessions.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: 'all', label: 'All Photos (6)' },
            { id: 'grooming', label: 'Breed Haircuts & Styling' },
            { id: 'boarding', label: 'Cage-Free Boarding Floor' },
            { id: 'spa', label: 'Hydrobath & Spa' },
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

        {/* Gallery Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedImage(item.src)}
              className="bg-white rounded-3xl overflow-hidden border border-black/10 shadow-xs hover:shadow-xl transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div className="relative h-60 w-full overflow-hidden bg-black/5">
                <img
                  src={item.src}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="py-1.5 px-3 bg-white/90 backdrop-blur text-sanctuary-dark rounded-full text-xs font-bold shadow">
                    Click to Enlarge
                  </span>
                </div>
                <div className="absolute top-3 left-3">
                  <span className="bg-sanctuary-gold text-sanctuary-dark text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow">
                    {item.tag}
                  </span>
                </div>
              </div>

              <div className="p-4 space-y-1 text-left">
                <h3 className="text-sm font-black text-sanctuary-dark group-hover:text-sanctuary-gold transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-sanctuary-dark/70 font-medium leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox Modal */}
        {selectedImage && (
          <div
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 z-[200] bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 cursor-pointer"
          >
            <div className="relative max-w-3xl max-h-[90vh] bg-white rounded-3xl overflow-hidden shadow-2xl">
              <img
                src={selectedImage}
                alt="Enlarged gallery item"
                className="w-full h-auto max-h-[80vh] object-contain"
              />
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-3 right-3 size-9 rounded-full bg-black/60 text-white flex items-center justify-center font-black hover:bg-black"
                aria-label="Close image"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>
          </div>
        )}

        {/* Booking CTA Bar */}
        <div className="p-6 bg-sanctuary-sand rounded-3xl border border-black/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="text-base font-black text-sanctuary-dark">
              Want a similar transformation for your pet?
            </h4>
            <p className="text-xs text-sanctuary-dark/70 font-medium">
              Book a breed haircut or cage-free boarding stay with 15% discount using code <span className="font-bold font-mono">SNIP15</span>.
            </p>
          </div>
          <div className="shrink-0">
            <button
              onClick={onOpenBooking}
              className="py-3 px-8 bg-sanctuary-forest hover:bg-black text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center gap-1.5"
            >
              <span>Book Now</span>
              <span className="material-symbols-outlined text-sm font-bold">arrow_forward</span>
            </button>
          </div>
        </div>

      </div>
    </motion.div>
  );
};

export default GalleryPage;
