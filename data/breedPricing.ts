export interface BreedInfo {
  id: string;
  name: string;
  species: 'dog' | 'cat';
  size: 'small' | 'medium' | 'large';
  sizeLabel: string;
  weightRange: string;
  coatType: string;
  popular?: boolean;
  tagline?: string;
  recommendedPackage: 'furry-fresh' | 'special' | 'style' | 'full';
}

export interface GroomingPackageDef {
  id: 'furry-fresh' | 'special' | 'style' | 'full';
  title: string;
  subtitle: string;
  tag: string;
  tagBg: string;
  popular?: boolean;
  desc: string;
  duration: string;
  pricing: {
    small: number;
    medium: number;
    large: number;
    cat: number;
  };
  origPricing: {
    small: number;
    medium: number;
    large: number;
    cat: number;
  };
  inclusions: string[];
}

export const GROOMING_PACKAGES: GroomingPackageDef[] = [
  {
    id: 'furry-fresh',
    title: 'Furry Fresh',
    subtitle: 'Essential Hygiene & Bath',
    tag: 'HYGIENE CARE',
    tagBg: 'bg-emerald-100 text-emerald-800',
    popular: false,
    duration: '45 – 60 mins',
    desc: 'Regular hygiene maintenance with deep cleansing hydrobath, blow dry, ear & eye clean without full haircut.',
    pricing: { small: 499, medium: 699, large: 849, cat: 749 },
    origPricing: { small: 649, medium: 899, large: 1099, cat: 999 },
    inclusions: [
      'Warm Hydrobath with Organic Shampoo',
      'High-Velocity Professional Blow Dry',
      'Coat De-tangling & Full Body Combing',
      'Gentle Ear Cleaning & Wax Removal',
      'Soothing Eye Cleaning',
      'Coat Deodorizing Spritz',
    ],
  },
  {
    id: 'special',
    title: 'Special Package',
    subtitle: 'Enhanced Care + Dental & Paw Balm',
    tag: '⭐ MOST POPULAR',
    tagBg: 'bg-sanctuary-gold text-sanctuary-dark font-black',
    popular: true,
    duration: '60 – 75 mins',
    desc: 'Our bestselling wellness treatment adding ultrasonic teeth brushing, fresh mouth spray, and soothing paw pad balm.',
    pricing: { small: 899, medium: 949, large: 999, cat: 874 },
    origPricing: { small: 1124, medium: 1199, large: 1249, cat: 1199 },
    inclusions: [
      'Hydrobath with Shampoo & Conditioner',
      'Professional Blow Dry & Combing',
      'Teeth Brushing & Plaque Cleanse',
      'Freshening Herbal Mouth Spray',
      'Paw Pad Trimming & Soothing Balm',
      'Ear Deep Clean & Eye Flush',
      'Sanitary Area Light Trim',
    ],
  },
  {
    id: 'style',
    title: 'Style Your Pet',
    subtitle: 'Breed Scissor Cut & Face Shaping',
    tag: 'BREED STYLING',
    tagBg: 'bg-purple-100 text-purple-900',
    popular: false,
    duration: '90 – 120 mins',
    desc: 'Precision scissor haircut tailored to breed standards or custom styling, including teddy bear face shaping.',
    pricing: { small: 1799, medium: 1799, large: 1799, cat: 1799 },
    origPricing: { small: 2249, medium: 2249, large: 2249, cat: 2249 },
    inclusions: [
      'Full Body Breed Haircut & Scissor Styling',
      'Meticulous Face Trimming & Beard Shaping',
      'Sanitary Clipping Included',
      'Warm Hydrobath + Conditioning Wash',
      'Nail Trimming & Filing',
      'Ear & Eye Clean + Mouth Spray',
    ],
  },
  {
    id: 'full',
    title: 'Full Grooming Ultimate',
    subtitle: 'Therapeutic Medicated Spa & Deshedding',
    tag: '👑 ULTIMATE SPA',
    tagBg: 'bg-sanctuary-forest text-white',
    popular: false,
    duration: '120 – 150 mins',
    desc: 'The complete royal pampering: therapeutic medicated bath for skin irritation, deep deshedding, and full haircut styling.',
    pricing: { small: 2199, medium: 2199, large: 2199, cat: 2199 },
    origPricing: { small: 3249, medium: 3249, large: 3249, cat: 3249 },
    inclusions: [
      'Therapeutic Medicated Bath (Anti-itch / Anti-dandruff)',
      'Full Body Haircut & Breed Styling',
      'Deep Undercoat Deshedding Treatment',
      'Nail Clipping & Paw Pad Care',
      'Dental Teeth Cleaning & Mouth Spray',
      'Ear Wax Deep Clean & Eye Flush',
    ],
  },
];

export const POPULAR_BREEDS: BreedInfo[] = [
  // Small Breeds (< 10 kg)
  {
    id: 'shih-tzu',
    name: 'Shih Tzu',
    species: 'dog',
    size: 'small',
    sizeLabel: 'Small Breed (< 10 kg)',
    weightRange: '4 – 8 kg',
    coatType: 'Long Coat',
    popular: true,
    tagline: 'Loves breed styling & teddy bear haircut',
    recommendedPackage: 'style',
  },
  {
    id: 'pug',
    name: 'Pug',
    species: 'dog',
    size: 'small',
    sizeLabel: 'Small Breed (< 10 kg)',
    weightRange: '6 – 9 kg',
    coatType: 'Short Coat / Wrinkle Care',
    popular: true,
    tagline: 'Needs deep facial wrinkle & ear care',
    recommendedPackage: 'special',
  },
  {
    id: 'pomeranian',
    name: 'Pomeranian / Indian Spitz',
    species: 'dog',
    size: 'small',
    sizeLabel: 'Small Breed (< 10 kg)',
    weightRange: '3 – 7 kg',
    coatType: 'Fluffy Double Coat',
    popular: true,
    tagline: 'Benefits from deshedding & paw balm',
    recommendedPackage: 'special',
  },
  {
    id: 'lhasa-apso',
    name: 'Lhasa Apso',
    species: 'dog',
    size: 'small',
    sizeLabel: 'Small Breed (< 10 kg)',
    weightRange: '5 – 8 kg',
    coatType: 'Dense Long Coat',
    popular: false,
    tagline: 'Great candidate for hygiene & style cuts',
    recommendedPackage: 'style',
  },
  {
    id: 'maltese',
    name: 'Maltese',
    species: 'dog',
    size: 'small',
    sizeLabel: 'Small Breed (< 10 kg)',
    weightRange: '3 – 5 kg',
    coatType: 'Silky White Coat',
    popular: false,
    tagline: 'Tear stain cleansing & scissor trim',
    recommendedPackage: 'style',
  },
  {
    id: 'french-bulldog',
    name: 'French Bulldog',
    species: 'dog',
    size: 'small',
    sizeLabel: 'Small Breed (< 10 kg)',
    weightRange: '8 – 12 kg',
    coatType: 'Short Smooth Coat',
    popular: true,
    tagline: 'Gentle wrinkle cleansing & paw soothing',
    recommendedPackage: 'special',
  },
  {
    id: 'toy-poodle',
    name: 'Toy Poodle',
    species: 'dog',
    size: 'small',
    sizeLabel: 'Small Breed (< 10 kg)',
    weightRange: '3 – 6 kg',
    coatType: 'Curly Hypoallergenic Coat',
    popular: false,
    tagline: 'Precision poodle scissor cut & fluff dry',
    recommendedPackage: 'style',
  },
  {
    id: 'dachshund',
    name: 'Dachshund',
    species: 'dog',
    size: 'small',
    sizeLabel: 'Small Breed (< 10 kg)',
    weightRange: '6 – 10 kg',
    coatType: 'Short / Wire Coat',
    popular: false,
    tagline: 'Hygiene bath & nail maintenance',
    recommendedPackage: 'furry-fresh',
  },
  {
    id: 'chihuahua',
    name: 'Chihuahua',
    species: 'dog',
    size: 'small',
    sizeLabel: 'Small Breed (< 10 kg)',
    weightRange: '1.5 – 3 kg',
    coatType: 'Short / Long Coat',
    popular: false,
    tagline: 'Gentle fear-free hygiene spa',
    recommendedPackage: 'furry-fresh',
  },

  // Medium Breeds (10 – 25 kg)
  {
    id: 'beagle',
    name: 'Beagle',
    species: 'dog',
    size: 'medium',
    sizeLabel: 'Medium Breed (10 – 25 kg)',
    weightRange: '10 – 15 kg',
    coatType: 'Short Dense Coat',
    popular: true,
    tagline: 'Essential ear cleaning & bath refresh',
    recommendedPackage: 'special',
  },
  {
    id: 'indie-dog',
    name: 'Indie / Indian Pariah Dog',
    species: 'dog',
    size: 'medium',
    sizeLabel: 'Medium Breed (10 – 25 kg)',
    weightRange: '14 – 22 kg',
    coatType: 'Short Hardy Coat',
    popular: true,
    tagline: 'Deep refreshing bath & paw hygiene',
    recommendedPackage: 'special',
  },
  {
    id: 'cocker-spaniel',
    name: 'Cocker Spaniel',
    species: 'dog',
    size: 'medium',
    sizeLabel: 'Medium Breed (10 – 25 kg)',
    weightRange: '12 – 16 kg',
    coatType: 'Silky Feathered Coat',
    popular: true,
    tagline: 'Ear infection care & coat trimming',
    recommendedPackage: 'style',
  },
  {
    id: 'corgi',
    name: 'Pembroke Welsh Corgi',
    species: 'dog',
    size: 'medium',
    sizeLabel: 'Medium Breed (10 – 25 kg)',
    weightRange: '10 – 14 kg',
    coatType: 'Thick Double Coat',
    popular: false,
    tagline: 'Deshedding treatment & sanitary trim',
    recommendedPackage: 'special',
  },
  {
    id: 'border-collie',
    name: 'Border Collie',
    species: 'dog',
    size: 'medium',
    sizeLabel: 'Medium Breed (10 – 25 kg)',
    weightRange: '14 – 20 kg',
    coatType: 'Medium Double Coat',
    popular: false,
    tagline: 'Deep brush-out & hydrobath',
    recommendedPackage: 'special',
  },
  {
    id: 'english-bulldog',
    name: 'English Bulldog',
    species: 'dog',
    size: 'medium',
    sizeLabel: 'Medium Breed (10 – 25 kg)',
    weightRange: '18 – 24 kg',
    coatType: 'Short Smooth Coat',
    popular: false,
    tagline: 'Wrinkle sanitization & paw balm',
    recommendedPackage: 'special',
  },

  // Large Breeds (> 25 kg)
  {
    id: 'golden-retriever',
    name: 'Golden Retriever',
    species: 'dog',
    size: 'large',
    sizeLabel: 'Large Breed (> 25 kg)',
    weightRange: '26 – 35 kg',
    coatType: 'Luxurious Golden Double Coat',
    popular: true,
    tagline: 'Deep deshedding, feathering trim & paw care',
    recommendedPackage: 'special',
  },
  {
    id: 'labrador',
    name: 'Labrador Retriever',
    species: 'dog',
    size: 'large',
    sizeLabel: 'Large Breed (> 25 kg)',
    weightRange: '28 – 36 kg',
    coatType: 'Dense Water-Resistant Coat',
    popular: true,
    tagline: 'Heavy deshedding wash & ear cleansing',
    recommendedPackage: 'special',
  },
  {
    id: 'german-shepherd',
    name: 'German Shepherd (GSD)',
    species: 'dog',
    size: 'large',
    sizeLabel: 'Large Breed (> 25 kg)',
    weightRange: '30 – 40 kg',
    coatType: 'Thick Double Coat',
    popular: true,
    tagline: 'High-velocity blow-out & undercoat removal',
    recommendedPackage: 'full',
  },
  {
    id: 'siberian-husky',
    name: 'Siberian Husky',
    species: 'dog',
    size: 'large',
    sizeLabel: 'Large Breed (> 25 kg)',
    weightRange: '20 – 28 kg',
    coatType: 'Arctic Dense Double Coat',
    popular: true,
    tagline: 'Bangalore heat cooling deshedding treatment',
    recommendedPackage: 'full',
  },
  {
    id: 'rottweiler',
    name: 'Rottweiler',
    species: 'dog',
    size: 'large',
    sizeLabel: 'Large Breed (> 25 kg)',
    weightRange: '38 – 52 kg',
    coatType: 'Short Coarse Coat',
    popular: false,
    tagline: 'Deep bath, nail clipping & dental spray',
    recommendedPackage: 'special',
  },
  {
    id: 'great-dane',
    name: 'Great Dane',
    species: 'dog',
    size: 'large',
    sizeLabel: 'Giant Breed (> 45 kg)',
    weightRange: '45 – 70 kg',
    coatType: 'Short Smooth Coat',
    popular: false,
    tagline: 'Hydrobath, giant nail trim & coat shine',
    recommendedPackage: 'special',
  },
  {
    id: 'doberman',
    name: 'Doberman Pinscher',
    species: 'dog',
    size: 'large',
    sizeLabel: 'Large Breed (> 25 kg)',
    weightRange: '30 – 42 kg',
    coatType: 'Short Sleek Coat',
    popular: false,
    tagline: 'Gloss coat wash, nail clip & paw balm',
    recommendedPackage: 'furry-fresh',
  },

  // Cats
  {
    id: 'persian-cat',
    name: 'Persian Cat',
    species: 'cat',
    size: 'small',
    sizeLabel: 'Feline (All Sizes)',
    weightRange: '3 – 6 kg',
    coatType: 'Long Dense Feline Coat',
    popular: true,
    tagline: 'Gentle waterless/foam bath & dematting',
    recommendedPackage: 'style',
  },
  {
    id: 'indie-cat',
    name: 'Indie Cat (Domestic Shorthair)',
    species: 'cat',
    size: 'small',
    sizeLabel: 'Feline (All Sizes)',
    weightRange: '3 – 5 kg',
    coatType: 'Short Sleek Coat',
    popular: true,
    tagline: 'Fear-free ear hygiene & stress-free bath',
    recommendedPackage: 'furry-fresh',
  },
  {
    id: 'british-shorthair',
    name: 'British Shorthair',
    species: 'cat',
    size: 'small',
    sizeLabel: 'Feline (All Sizes)',
    weightRange: '4 – 7 kg',
    coatType: 'Plush Feline Coat',
    popular: false,
    tagline: 'Plush deshedding & nail clipping',
    recommendedPackage: 'special',
  },
  {
    id: 'maine-coon',
    name: 'Maine Coon',
    species: 'cat',
    size: 'medium',
    sizeLabel: 'Feline (All Sizes)',
    weightRange: '5 – 9 kg',
    coatType: 'Giant Fluffy Coat',
    popular: false,
    tagline: 'Lion cut or sanitary trim with feline spa',
    recommendedPackage: 'style',
  },
];

// Helper to look up price for a breed & package
export function getPriceForBreedAndPackage(
  breed: BreedInfo,
  pkgId: 'furry-fresh' | 'special' | 'style' | 'full'
) {
  const pkg = GROOMING_PACKAGES.find((p) => p.id === pkgId) || GROOMING_PACKAGES[0];
  const sizeKey = breed.species === 'cat' ? 'cat' : breed.size;
  const price = pkg.pricing[sizeKey];
  const orig = pkg.origPricing[sizeKey];
  return {
    price,
    orig,
    savings: orig - price,
    discountPercent: Math.round(((orig - price) / orig) * 100),
  };
}
