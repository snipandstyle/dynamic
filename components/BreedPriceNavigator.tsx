import React, { useState, useMemo } from 'react';
import { POPULAR_BREEDS, GROOMING_PACKAGES, BreedInfo, getPriceForBreedAndPackage } from '../data/breedPricing';

interface BreedPriceNavigatorProps {
  onOpenBooking: (details: {
    type: 'grooming';
    serviceName: string;
    basePrice: number;
    origPrice: number;
    petType: 'dog' | 'cat';
    petSize: 'small' | 'medium' | 'large';
    petBreed: string;
    appliedCouponCode?: string;
  }) => void;
  compact?: boolean;
}

export const BreedPriceNavigator: React.FC<BreedPriceNavigatorProps> = ({
  onOpenBooking,
  compact = false,
}) => {
  const [selectedSpecies, setSelectedSpecies] = useState<'dog' | 'cat'>('dog');
  const [selectedSizeFilter, setSelectedSizeFilter] = useState<'all' | 'small' | 'medium' | 'large'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBreedId, setSelectedBreedId] = useState<string>('shih-tzu');
  const [showFullChart, setShowFullChart] = useState(false);

  // Filter breeds based on species, size filter, and search text
  const filteredBreeds = useMemo(() => {
    return POPULAR_BREEDS.filter((b) => {
      if (b.species !== selectedSpecies) return false;
      if (selectedSizeFilter !== 'all' && b.size !== selectedSizeFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          b.name.toLowerCase().includes(q) ||
          b.coatType.toLowerCase().includes(q) ||
          b.sizeLabel.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [selectedSpecies, selectedSizeFilter, searchQuery]);

  // Active selected breed
  const activeBreed = useMemo(() => {
    const found = POPULAR_BREEDS.find((b) => b.id === selectedBreedId);
    if (found && found.species === selectedSpecies) return found;
    // Fallback to first available in filtered or popular
    return filteredBreeds[0] || POPULAR_BREEDS.find((b) => b.species === selectedSpecies) || POPULAR_BREEDS[0];
  }, [selectedBreedId, selectedSpecies, filteredBreeds]);

  // When species changes, pick a suitable default breed
  const handleSpeciesChange = (species: 'dog' | 'cat') => {
    setSelectedSpecies(species);
    setSelectedSizeFilter('all');
    setSearchQuery('');
    if (species === 'cat') {
      setSelectedBreedId('persian-cat');
    } else {
      setSelectedBreedId('shih-tzu');
    }
  };

  return (
    <div className="w-full bg-white rounded-3xl border-2 border-amber-400/80 shadow-xl overflow-hidden text-left transition-all">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-sanctuary-forest via-[#142B1E] to-sanctuary-dark text-white p-4 sm:p-5 border-b border-amber-400/40">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 bg-amber-400 text-black text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
              <span>🐾 INSTANT BREED & SIZE RATE FINDER</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white leading-tight">
              Grooming Rates For Every Breed & Size
            </h3>
            <p className="text-xs text-white/80 font-medium leading-relaxed max-w-xl">
              Select your dog or cat breed below to see transparent, guaranteed pricing for all 4 spa packages. No guesswork!
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowFullChart(!showFullChart)}
            className="py-1.5 px-3 bg-white/10 hover:bg-white/20 text-amber-300 rounded-xl text-xs font-bold transition-colors border border-amber-400/30 self-start sm:self-center flex items-center gap-1 shrink-0"
          >
            <span className="material-symbols-outlined text-sm">table_chart</span>
            <span>{showFullChart ? 'Hide Rate Chart' : 'View Full Breed Chart'}</span>
          </button>
        </div>

        {/* Species & Size Selectors + Search Row */}
        <div className="mt-4 pt-3 border-t border-white/10 flex flex-col md:flex-row items-stretch md:items-center gap-2.5">
          {/* Dog / Cat Toggle */}
          <div className="flex items-center bg-black/40 p-1 rounded-2xl border border-white/15 shrink-0">
            <button
              type="button"
              onClick={() => handleSpeciesChange('dog')}
              className={`py-1.5 px-4 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
                selectedSpecies === 'dog'
                  ? 'bg-amber-400 text-black shadow-md'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              <span>🐕</span>
              <span>Dogs</span>
            </button>
            <button
              type="button"
              onClick={() => handleSpeciesChange('cat')}
              className={`py-1.5 px-4 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
                selectedSpecies === 'cat'
                  ? 'bg-amber-400 text-black shadow-md'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              <span>🐈</span>
              <span>Cats</span>
            </button>
          </div>

          {/* Dog Size Quick Filter Buttons */}
          {selectedSpecies === 'dog' && (
            <div className="flex items-center gap-1 bg-black/30 p-1 rounded-2xl border border-white/10 overflow-x-auto no-scrollbar">
              {[
                { id: 'all', label: 'All Sizes' },
                { id: 'small', label: 'Small (<10kg)' },
                { id: 'medium', label: 'Med (10-25kg)' },
                { id: 'large', label: 'Large (>25kg)' },
              ].map((filter) => (
                <button
                  key={filter.id}
                  type="button"
                  onClick={() => setSelectedSizeFilter(filter.id as any)}
                  className={`py-1 px-2.5 rounded-xl text-[11px] font-bold whitespace-nowrap transition-all ${
                    selectedSizeFilter === filter.id
                      ? 'bg-white text-sanctuary-dark font-black shadow-xs'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          )}

          {/* Live Search Input */}
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-white/50 text-sm">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={selectedSpecies === 'dog' ? "Search breed (e.g. Beagle, Shih Tzu, Golden, Indie, Pug)..." : "Search cat breed (e.g. Persian, Indie Cat)..."}
              className="w-full pl-9 pr-3 py-2 bg-white/10 hover:bg-white/15 focus:bg-white/20 text-white placeholder-white/50 text-xs rounded-xl border border-white/20 focus:outline-none focus:border-amber-400 transition-all font-medium"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/60 hover:text-white text-xs font-bold"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Popular Breed Chips Carousel */}
      <div className="p-3 sm:p-4 bg-amber-50/50 border-b border-amber-200/80">
        <div className="flex items-center justify-between text-xs font-bold text-amber-950 mb-2">
          <span className="flex items-center gap-1 text-[11px] font-black uppercase tracking-wider text-amber-900">
            <span className="material-symbols-outlined text-sm text-amber-600">pets</span>
            <span>Tap Your Breed:</span>
          </span>
          <span className="text-[10px] text-amber-800 font-semibold">
            {filteredBreeds.length} breeds found
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {filteredBreeds.map((breed) => {
            const isSelected = activeBreed.id === breed.id;
            return (
              <button
                key={breed.id}
                type="button"
                onClick={() => setSelectedBreedId(breed.id)}
                className={`py-1.5 px-3 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 border shrink-0 ${
                  isSelected
                    ? 'bg-sanctuary-forest text-white border-sanctuary-forest ring-2 ring-amber-400 shadow-md font-black scale-102'
                    : 'bg-white hover:bg-amber-100/60 text-sanctuary-dark border-black/10 hover:border-amber-300'
                }`}
              >
                <span>{breed.species === 'cat' ? '🐈' : breed.size === 'small' ? '🐶' : breed.size === 'medium' ? '🐕' : '🦮'}</span>
                <span>{breed.name}</span>
                {breed.popular && (
                  <span className={`text-[9px] px-1 py-0.2 rounded-full font-black ${isSelected ? 'bg-amber-400 text-black' : 'bg-amber-100 text-amber-900'}`}>
                    ★
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Breed Identity Strip */}
      <div className="p-3.5 sm:p-4 bg-gradient-to-r from-amber-50 via-white to-amber-50/50 border-b border-black/5 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div className="flex items-center gap-3">
          <div className="size-11 sm:size-12 rounded-2xl bg-sanctuary-forest text-sanctuary-gold flex items-center justify-center font-black text-xl shrink-0 shadow-xs border border-amber-400/40">
            {activeBreed.species === 'cat' ? '🐈' : activeBreed.size === 'small' ? '🐶' : activeBreed.size === 'medium' ? '🐕' : '🦮'}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="text-base sm:text-lg font-black text-sanctuary-dark">
                {activeBreed.name}
              </h4>
              <span className="text-[10px] font-black bg-amber-200 text-amber-950 px-2 py-0.5 rounded-full border border-amber-300">
                {activeBreed.sizeLabel}
              </span>
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                {activeBreed.weightRange}
              </span>
            </div>
            <p className="text-[11px] text-sanctuary-dark/70 font-medium mt-0.5">
              Coat: <strong>{activeBreed.coatType}</strong> • {activeBreed.tagline}
            </p>
          </div>
        </div>

        <div className="bg-white px-3 py-1.5 rounded-xl border border-black/10 text-xs shadow-2xs self-start sm:self-auto">
          <span className="text-[9px] text-sanctuary-dark/60 font-semibold block uppercase tracking-wider">
            Festival Offer Applied
          </span>
          <span className="font-black text-emerald-700 text-[11px] flex items-center gap-1">
            <span className="material-symbols-outlined text-xs">local_offer</span>
            <span>10% OFF with Code: GROOM10</span>
          </span>
        </div>
      </div>

      {/* Dynamic Pricing Cards for Selected Breed */}
      <div className="p-4 sm:p-6 bg-[#FAF8F5]">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {GROOMING_PACKAGES.map((pkg) => {
            const pricing = getPriceForBreedAndPackage(activeBreed, pkg.id);
            const isRecommended = activeBreed.recommendedPackage === pkg.id;

            return (
              <div
                key={pkg.id}
                className={`bg-white rounded-2xl p-4 sm:p-4.5 border flex flex-col justify-between space-y-3.5 transition-all relative group shadow-sm hover:shadow-lg ${
                  pkg.popular || isRecommended
                    ? 'border-amber-400 ring-2 ring-amber-400/50 shadow-md'
                    : 'border-black/10 hover:border-amber-300'
                }`}
              >
                {/* Popular / Recommended Pill */}
                {isRecommended && (
                  <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-sanctuary-forest text-amber-300 text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm flex items-center gap-1 z-10 border border-amber-400/40">
                    <span className="material-symbols-outlined text-[10px]">recommend</span>
                    <span>Best for {activeBreed.name}</span>
                  </div>
                )}
                {!isRecommended && pkg.popular && (
                  <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-amber-400 text-black text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm flex items-center gap-1 z-10">
                    <span className="material-symbols-outlined text-[10px]">star</span>
                    <span>Most Popular</span>
                  </div>
                )}

                <div className="space-y-2.5">
                  {/* Category Tag & Savings */}
                  <div className="flex items-center justify-between">
                    <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${pkg.tagBg}`}>
                      {pkg.tag}
                    </span>
                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                      Save ₹{pricing.savings} ({pricing.discountPercent}%)
                    </span>
                  </div>

                  {/* Title & Subtitle */}
                  <div>
                    <h5 className="text-base sm:text-lg font-black text-sanctuary-dark leading-tight">
                      {pkg.title}
                    </h5>
                    <div className="text-[11px] font-bold text-amber-700 mt-0.5">
                      {pkg.subtitle}
                    </div>
                    <div className="text-[10px] text-sanctuary-dark/60 font-semibold mt-1 flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs">schedule</span>
                      <span>Approx {pkg.duration}</span>
                    </div>
                  </div>

                  {/* Transparent Breed Price Box */}
                  <div className="p-2.5 bg-sanctuary-sand/50 rounded-xl border border-black/5 flex items-baseline justify-between shadow-2xs">
                    <div>
                      <span className="text-[9px] text-sanctuary-dark/60 font-bold block uppercase tracking-wider">
                        {activeBreed.name} Rate:
                      </span>
                      <span className="text-xs line-through text-red-500 font-bold decoration-red-500">
                        ₹{pricing.orig}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-black text-sanctuary-dark">
                        ₹{pricing.price}
                      </span>
                    </div>
                  </div>

                  {/* Inclusions */}
                  <div className="space-y-1 pt-1 border-t border-black/5">
                    <span className="text-[9px] font-black uppercase tracking-wider text-sanctuary-dark/50 block mb-0.5">
                      What's Included:
                    </span>
                    {pkg.inclusions.slice(0, 4).map((inc, i) => (
                      <div key={i} className="flex items-start gap-1 text-[11px] leading-tight">
                        <span className="material-symbols-outlined text-emerald-600 text-xs shrink-0 mt-0.5">
                          check_circle
                        </span>
                        <span className="text-sanctuary-dark/80 font-medium">
                          {inc}
                        </span>
                      </div>
                    ))}
                    {pkg.inclusions.length > 4 && (
                      <div className="text-[10px] text-emerald-700 font-bold pt-0.5">
                        + {pkg.inclusions.length - 4} more amenities
                      </div>
                    )}
                  </div>
                </div>

                {/* Instant Book Button */}
                <button
                  type="button"
                  onClick={() =>
                    onOpenBooking({
                      type: 'grooming',
                      serviceName: `${pkg.title} (${activeBreed.name})`,
                      basePrice: pricing.price,
                      origPrice: pricing.orig,
                      petType: activeBreed.species,
                      petSize: activeBreed.size,
                      petBreed: activeBreed.name,
                      appliedCouponCode: 'GROOM10',
                    })
                  }
                  className={`w-full py-2.5 rounded-xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-sm transition-all active:scale-95 cursor-pointer ${
                    pkg.popular || isRecommended
                      ? 'bg-sanctuary-forest hover:bg-black text-white shadow-md'
                      : 'bg-white hover:bg-sanctuary-sand text-sanctuary-dark border border-black/20'
                  }`}
                >
                  <span>Book for {activeBreed.name}</span>
                  <span className="material-symbols-outlined text-sm font-bold">arrow_forward</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Comprehensive All-Breed & Size Pricing Table (Accordion) */}
      {showFullChart && (
        <div className="p-4 sm:p-6 bg-white border-t border-black/10 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-black/10">
            <div>
              <h4 className="text-base font-black text-sanctuary-dark">
                Complete Breed & Size Grooming Rate Matrix
              </h4>
              <p className="text-xs text-sanctuary-dark/70 font-medium">
                Transparent studio pricing across all weight categories & species
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowFullChart(false)}
              className="text-xs font-bold text-sanctuary-dark/60 hover:text-black"
            >
              Close Table ✕
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-sanctuary-forest text-white">
                  <th className="p-2.5 font-black rounded-tl-xl">Size Category & Examples</th>
                  <th className="p-2.5 font-black">Furry Fresh</th>
                  <th className="p-2.5 font-black">Special Package (Dental)</th>
                  <th className="p-2.5 font-black">Style Your Pet</th>
                  <th className="p-2.5 font-black rounded-tr-xl">Full Grooming Spa</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5 font-medium">
                <tr className="hover:bg-amber-50/50">
                  <td className="p-2.5">
                    <div className="font-black text-sanctuary-dark">🐶 Small Dogs (&lt; 10 kg)</div>
                    <div className="text-[10px] text-sanctuary-dark/60">Shih Tzu, Pug, Pomeranian, Lhasa Apso, Maltese, Frenchie</div>
                  </td>
                  <td className="p-2.5">
                    <span className="font-black text-emerald-800">₹499</span>
                    <span className="text-[10px] line-through text-red-400 block">₹649</span>
                  </td>
                  <td className="p-2.5">
                    <span className="font-black text-emerald-800">₹899</span>
                    <span className="text-[10px] line-through text-red-400 block">₹1,124</span>
                  </td>
                  <td className="p-2.5">
                    <span className="font-black text-emerald-800">₹1,799</span>
                    <span className="text-[10px] line-through text-red-400 block">₹2,249</span>
                  </td>
                  <td className="p-2.5">
                    <span className="font-black text-emerald-800">₹2,199</span>
                    <span className="text-[10px] line-through text-red-400 block">₹3,249</span>
                  </td>
                </tr>

                <tr className="hover:bg-amber-50/50">
                  <td className="p-2.5">
                    <div className="font-black text-sanctuary-dark">🐕 Medium Dogs (10 – 25 kg)</div>
                    <div className="text-[10px] text-sanctuary-dark/60">Beagle, Indie Dog, Cocker Spaniel, Corgi, Bulldog</div>
                  </td>
                  <td className="p-2.5">
                    <span className="font-black text-emerald-800">₹699</span>
                    <span className="text-[10px] line-through text-red-400 block">₹899</span>
                  </td>
                  <td className="p-2.5">
                    <span className="font-black text-emerald-800">₹949</span>
                    <span className="text-[10px] line-through text-red-400 block">₹1,199</span>
                  </td>
                  <td className="p-2.5">
                    <span className="font-black text-emerald-800">₹1,799</span>
                    <span className="text-[10px] line-through text-red-400 block">₹2,249</span>
                  </td>
                  <td className="p-2.5">
                    <span className="font-black text-emerald-800">₹2,199</span>
                    <span className="text-[10px] line-through text-red-400 block">₹3,249</span>
                  </td>
                </tr>

                <tr className="hover:bg-amber-50/50">
                  <td className="p-2.5">
                    <div className="font-black text-sanctuary-dark">🦮 Large Dogs (&gt; 25 kg)</div>
                    <div className="text-[10px] text-sanctuary-dark/60">Labrador, Golden Retriever, GSD, Husky, Rottweiler, Dane</div>
                  </td>
                  <td className="p-2.5">
                    <span className="font-black text-emerald-800">₹849</span>
                    <span className="text-[10px] line-through text-red-400 block">₹1,099</span>
                  </td>
                  <td className="p-2.5">
                    <span className="font-black text-emerald-800">₹999</span>
                    <span className="text-[10px] line-through text-red-400 block">₹1,249</span>
                  </td>
                  <td className="p-2.5">
                    <span className="font-black text-emerald-800">₹1,799</span>
                    <span className="text-[10px] line-through text-red-400 block">₹2,249</span>
                  </td>
                  <td className="p-2.5">
                    <span className="font-black text-emerald-800">₹2,199</span>
                    <span className="text-[10px] line-through text-red-400 block">₹3,249</span>
                  </td>
                </tr>

                <tr className="hover:bg-amber-50/50">
                  <td className="p-2.5">
                    <div className="font-black text-sanctuary-dark">🐈 Cats / Felines (All Breeds)</div>
                    <div className="text-[10px] text-sanctuary-dark/60">Persian Cat, Indie Cat, British Shorthair, Maine Coon</div>
                  </td>
                  <td className="p-2.5">
                    <span className="font-black text-emerald-800">₹749</span>
                    <span className="text-[10px] line-through text-red-400 block">₹999</span>
                  </td>
                  <td className="p-2.5">
                    <span className="font-black text-emerald-800">₹874</span>
                    <span className="text-[10px] line-through text-red-400 block">₹1,199</span>
                  </td>
                  <td className="p-2.5">
                    <span className="font-black text-emerald-800">₹1,799</span>
                    <span className="text-[10px] line-through text-red-400 block">₹2,249</span>
                  </td>
                  <td className="p-2.5">
                    <span className="font-black text-emerald-800">₹2,199</span>
                    <span className="text-[10px] line-through text-red-400 block">₹3,249</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default BreedPriceNavigator;
