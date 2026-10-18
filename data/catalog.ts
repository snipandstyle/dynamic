export type PetType = "dog" | "cat";
export type PetSize = "small" | "medium" | "large";
export type PriceTier = PetSize | "cat";
export const money = (amount: number) => `₹${amount.toLocaleString("en-IN")}`;
export const SIZE_LABELS = {
  small: "Small · under 10 kg",
  medium: "Medium · 10–25 kg",
  large: "Large · over 25 kg",
};

export const GROOMING = [
  {
    id: "furry-fresh",
    name: "Furry Fresh",
    label: "Basic Hygiene Care",
    description:
      "Essential regular hygiene maintenance focused on deep cleansing without full body styling. Perfect for active pets needing a refresh.",
    icon: "bath",
    prices: { small: 499, medium: 699, large: 849, cat: 749 },
    originals: { small: 649, medium: 899, large: 1099, cat: 999 },
    includes: [
      "Bath with Shampoo & Conditioner",
      "Professional Warm Blow Dry",
      "Combing & Thorough Brushing",
      "Gentle Ear Cleaning",
      "Soothing Eye Cleaning",
    ],
    note: "Excludes sanitary clipping, haircut, and full body trimming.",
  },
  {
    id: "special-package",
    name: "Special Package",
    label: "Enhanced Care & Dental Hygiene",
    description:
      "A step up from basic hygiene adding essential dental and paw care to keep breath fresh and paws neat and protected.",
    icon: "heart",
    prices: { small: 899, medium: 949, large: 999, cat: 874 },
    originals: { small: 1124, medium: 1199, large: 1249, cat: 1199 },
    includes: [
      "Bath with Shampoo & Conditioner",
      "Professional Warm Blow Dry",
      "Combing & Brushing",
      "Ear Cleaning & Eye Cleaning",
      "Freshening Mouth Spray",
      "Teeth Brushing & Plaque Cleanse",
      "Paws & Pad Trimming",
    ],
    note: "Our most popular everyday wellness package.",
  },
  {
    id: "style-your-pet",
    name: "Style Your Pet",
    label: "Full Body Styling & Trimming",
    description:
      "Signature breed styling package. Includes a full body trim tailored to breed standards or custom preferences, plus meticulous face trimming.",
    icon: "scissors",
    prices: { small: 1799, medium: 1799, large: 1799, cat: 1799 },
    originals: { small: 2249, medium: 2249, large: 2249, cat: 2249 },
    includes: [
      "Full Body Breed Trimming & Scissor Styling",
      "Meticulous Face Trimming",
      "Ear Cleaning & Eye Cleaning (Free)",
      "Sanitary Clipping (Free)",
      "Combing & Brushing (Free)",
      "Freshening Mouth Spray (Free)",
    ],
    note: "Bath is not included in this styling-only package.",
  },
  {
    id: "full-grooming",
    name: "Full Grooming",
    label: "Ultimate Head-to-Tail Experience",
    description:
      "Comprehensive head-to-tail pampering featuring a therapeutic medicated bath to protect skin health alongside full grooming luxury.",
    icon: "sparkle",
    prices: { small: 2199, medium: 2199, large: 2199, cat: 2199 },
    originals: { small: 3249, medium: 3249, large: 3249, cat: 3249 },
    includes: [
      "Bath with Shampoo & Conditioner",
      "Therapeutic Medicated Bath",
      "Full Hair Styling & Scissor Trimming",
      "Neat Sanitary Trim",
      "Nail Clipping & Filing",
      "Ear & Eye Deep Cleaning",
      "Combing & Brushing",
      "Deshedding / Mat Removal Treatment",
    ],
    note: "Includes full haircut, lion/comb cut for cats, and medicated bath.",
  },
  {
    id: "puppy-kitten-spa",
    name: "Puppy / Kitten Gentle Spa",
    label: "Small Paws, Gentle Beginnings",
    description:
      "A stress-free gentle introduction to grooming for young pets under six months.",
    icon: "paw",
    prices: { small: 449, medium: 549, large: 649, cat: 549 },
    originals: { small: 599, medium: 749, large: 849, cat: 749 },
    includes: [
      "Gentle tearless organic shampoo bath",
      "Low-noise warm fluff dry",
      "Ear & eye wipe, soothing paw balm",
    ],
    note: "Tailored specifically for puppies and kittens under 6 months.",
  },
  {
    id: "medicated-bath",
    name: "Medicated & Anti-Tick Bath",
    label: "Therapeutic Skin & Coat Care",
    description:
      "Specialized therapeutic medicated bath to treat itchy, infected, or tick/flea-prone coats with careful brushing and drying.",
    icon: "shield",
    prices: { small: 699, medium: 899, large: 1099, cat: 899 },
    originals: { small: 899, medium: 1149, large: 1399, cat: 1149 },
    includes: [
      "Medicated anti-tick & flea formulation",
      "Coat brushing & dead hair removal",
      "Gentle warm wash & blow dry",
      "Soothing skin relief spray",
    ],
    note: "Tell our certified handlers about any skin sensitivities.",
  },
] as const;

export const ADDONS = [
  {
    id: "teeth-brushing",
    name: "Teeth Brushing",
    price: 186,
    originalPrice: 299,
    description: "Plaque removal, oral cleaning, and freshening mouth spray.",
  },
  {
    id: "ear-eye-clean",
    name: "Ear & Eye Cleaning",
    price: 124,
    originalPrice: 199,
    description: "Wax removal, tear stain cleaning, and gentle hygiene for sensitive areas.",
  },
  {
    id: "paw-relaxation",
    name: "Paw Relaxation",
    price: 124,
    originalPrice: 199,
    description: "Deep paw pad cleaning, pad hair trim, massage, and moisturizing balm.",
  },
  {
    id: "medicated-bath-addon",
    name: "Medicated Bath",
    price: 299,
    originalPrice: 499,
    description: "Therapeutic medicated shampoo bath for itchy, infected, or sensitive skin.",
  },
  {
    id: "body-massage",
    name: "Body Massage",
    price: 499,
    originalPrice: 699,
    description: "Relaxing full body muscle massage and tension relief.",
  },
  {
    id: "deshedding",
    name: "Deshedding Treatment",
    price: 624,
    originalPrice: 849,
    description: "Specialized deep undercoat removal to drastically cut down shedding.",
  },
  {
    id: "dematting",
    name: "Dematting",
    price: 499,
    originalPrice: 699,
    description: "Gentle, pain-free knot and mat removal.",
  },
  {
    id: "waterless-bath",
    name: "Waterless Bath (Dry Bath)",
    price: 499,
    originalPrice: 699,
    description: "Gentle waterless foam cleanse and coat deodorizing without water stress.",
  },
  {
    id: "sanitary-waterless",
    name: "Sanitary & Waterless Bath",
    price: 499,
    originalPrice: 699,
    description: "Combined hygiene trim, nail clipping, ear cleaning, paw pad trim, and waterless bath.",
  },
  {
    id: "face-trim",
    name: "Face Trim (Quick Service)",
    price: 499,
    originalPrice: 699,
    description: "Neatens facial hair around eyes, muzzle, and beard shaping.",
  },
  {
    id: "waterless-bath-express",
    name: "Waterless Bath Express",
    price: 749,
    originalPrice: 999,
    description: "Waterless bath, deep brush-out, and coat deodorizing spray.",
  },
  {
    id: "active-toy-bundle",
    name: "Active Toy Bundle (Boarding)",
    price: 186,
    originalPrice: 299,
    description: "Interactive toys, plushies, and chew toys during boarding stay.",
  },
  {
    id: "medication-care",
    name: "Medication Care (Boarding)",
    price: 374,
    originalPrice: 499,
    description: "Timed medical routines & health tracking during boarding stay.",
  },
] as const;

export interface BundleItem {
  id: string;
  name: string;
  category: "bundle";
  petType: "dog" | "cat";
  coatType?: "short" | "long";
  sessions: number;
  validity: string;
  prices: { small?: number; medium?: number; large?: number; short?: number; long?: number };
  description: string;
}

export const SUPER_SAVER_BUNDLES: BundleItem[] = [
  // Dog Packages (Short Coat)
  {
    id: "bundle-dog-short-3",
    name: "3 Sessions Full Grooming (Short Coat)",
    category: "bundle",
    petType: "dog",
    coatType: "short",
    sessions: 3,
    validity: "6 Months",
    prices: { small: 4874, medium: 6374, large: 7999 },
    description: "3 complete full grooming sessions including haircut, bath, nail clip, ear/eye clean & brush.",
  },
  {
    id: "bundle-dog-short-6",
    name: "6 Sessions Full Grooming (Short Coat)",
    category: "bundle",
    petType: "dog",
    coatType: "short",
    sessions: 6,
    validity: "12 Months",
    prices: { small: 8999, medium: 11999, large: 14999 },
    description: "6 full grooming sessions with priority booking across 12 months.",
  },
  {
    id: "bundle-dog-short-12",
    name: "12 Sessions Full Grooming (Short Coat)",
    category: "bundle",
    petType: "dog",
    coatType: "short",
    sessions: 12,
    validity: "16 Months",
    prices: { small: 13999, medium: 18749, large: 23374 },
    description: "Annual VIP grooming pass: 12 full grooming sessions.",
  },
  {
    id: "bundle-dog-short-tick-3",
    name: "3 Sessions Tick & Flea Combo (Short Coat)",
    category: "bundle",
    petType: "dog",
    coatType: "short",
    sessions: 3,
    validity: "6 Months",
    prices: { small: 6874, medium: 9124, large: 11249 },
    description: "3 specialized medicated anti-tick & flea treatment sessions.",
  },
  {
    id: "bundle-dog-short-med-3",
    name: "3 Sessions Medicated Combo (Short Coat)",
    category: "bundle",
    petType: "dog",
    coatType: "short",
    sessions: 3,
    validity: "6 Months",
    prices: { small: 7499, medium: 9874, large: 12124 },
    description: "3 therapeutic medicated skin relief treatment sessions.",
  },
  // Dog Packages (Long Coat)
  {
    id: "bundle-dog-long-3",
    name: "3 Sessions Full Grooming (Long Coat)",
    category: "bundle",
    petType: "dog",
    coatType: "long",
    sessions: 3,
    validity: "6 Months",
    prices: { small: 6374, medium: 7999, large: 8749 },
    description: "3 full grooming sessions tailored for long-coated breeds.",
  },
  {
    id: "bundle-dog-long-6",
    name: "6 Sessions Full Grooming (Long Coat)",
    category: "bundle",
    petType: "dog",
    coatType: "long",
    sessions: 6,
    validity: "12 Months",
    prices: { small: 11999, medium: 14999, large: 16499 },
    description: "6 full grooming sessions for long-coat dogs with mat prevention.",
  },
  {
    id: "bundle-dog-long-12",
    name: "12 Sessions Full Grooming (Long Coat)",
    category: "bundle",
    petType: "dog",
    coatType: "long",
    sessions: 12,
    validity: "16 Months",
    prices: { small: 18749, medium: 23374, large: 25749 },
    description: "12 full grooming sessions for long-coat dogs across 16 months.",
  },
  {
    id: "bundle-dog-long-tick-3",
    name: "3 Sessions Tick & Flea Combo (Long Coat)",
    category: "bundle",
    petType: "dog",
    coatType: "long",
    sessions: 3,
    validity: "6 Months",
    prices: { small: 9124, medium: 11249, large: 12499 },
    description: "3 specialized tick & flea treatments for long coat dogs.",
  },
  {
    id: "bundle-dog-long-med-3",
    name: "3 Sessions Medicated Combo (Long Coat)",
    category: "bundle",
    petType: "dog",
    coatType: "long",
    sessions: 3,
    validity: "6 Months",
    prices: { small: 9874, medium: 12124, large: 13499 },
    description: "3 therapeutic skin therapy sessions for long coat dogs.",
  },
  // Cat Packages
  {
    id: "bundle-cat-3",
    name: "3 Sessions Full Grooming (Cat)",
    category: "bundle",
    petType: "cat",
    sessions: 3,
    validity: "6 Months",
    prices: { short: 4874, long: 6374 },
    description: "3 calm feline grooming sessions with gentle low-noise handling.",
  },
  {
    id: "bundle-cat-6",
    name: "6 Sessions Full Grooming (Cat)",
    category: "bundle",
    petType: "cat",
    sessions: 6,
    validity: "12 Months",
    prices: { short: 8999, long: 11999 },
    description: "6 calm feline grooming sessions across 12 months.",
  },
  {
    id: "bundle-cat-12",
    name: "12 Sessions Full Grooming (Cat)",
    category: "bundle",
    petType: "cat",
    sessions: 12,
    validity: "16 Months",
    prices: { short: 13999, long: 20999 },
    description: "12-session annual feline VIP pampering pass.",
  },
  {
    id: "bundle-cat-tick-3",
    name: "3 Sessions Tick & Flea Combo (Cat)",
    category: "bundle",
    petType: "cat",
    sessions: 3,
    validity: "6 Months",
    prices: { short: 6874, long: 9124 },
    description: "3 feline anti-tick & flea baths with gentle brush-out.",
  },
];

export interface BookingItem {
  id: string;
  serviceId: string;
  category: "grooming" | "boarding" | "bundle" | "addon";
  petType: PetType;
  petSize: PetSize;
  catType?: "neutered" | "non-neutered";
  nights: number;
  quantity: number;
  addons: string[];
  petName?: string;
  breed?: string;
}

export function includedAddonIds(serviceId: string): readonly string[] {
  const included: Record<string, string[]> = {
    "furry-fresh": ["ear-eye-clean"],
    "special-package": ["ear-eye-clean", "teeth-brushing", "paw-relaxation"],
    "style-your-pet": ["ear-eye-clean"],
    "full-grooming": ["ear-eye-clean", "medicated-bath-addon", "deshedding"],
    "puppy-kitten-spa": ["ear-eye-clean"],
    "medicated-bath": ["medicated-bath-addon"],
  };
  return included[serviceId] || [];
}

export function validateItem(raw: BookingItem): BookingItem {
  if (
    !raw ||
    !["grooming", "boarding", "bundle", "addon"].includes(raw.category) ||
    !["dog", "cat"].includes(raw.petType) ||
    !["small", "medium", "large"].includes(raw.petSize)
  )
    throw new Error("Please choose a valid service and pet size.");
  if (!Number.isInteger(raw.quantity) || raw.quantity < 1 || raw.quantity > 5)
    throw new Error("Choose between 1 and 5 appointments per service.");
  if (
    raw.category === "grooming" &&
    !GROOMING.some((s) => s.id === raw.serviceId)
  )
    throw new Error(
      "This grooming package is unavailable. Please choose a package again.",
    );
  if (
    raw.category === "addon" &&
    !ADDONS.some((a) => a.id === raw.serviceId)
  )
    throw new Error(
      "This add-on service is unavailable. Please choose an add-on again.",
    );
  if (
    raw.category === "boarding" &&
    (!Number.isInteger(raw.nights) || raw.nights < 1 || raw.nights > 60)
  )
    throw new Error("Boarding stays must be between 1 and 60 nights.");
  if (
    raw.category === "boarding" &&
    raw.petType === "cat" &&
    !["neutered", "non-neutered"].includes(raw.catType || "")
  )
    throw new Error("Please select whether your cat is neutered.");
  if (
    !Array.isArray(raw.addons) ||
    raw.addons.some((id) => !ADDONS.some((a) => a.id === id)) ||
    new Set(raw.addons).size !== raw.addons.length
  )
    throw new Error("Please select valid extras.");
  if (raw.addons.some((id) => includedAddonIds(raw.serviceId).includes(id)))
    throw new Error(
      "An extra is already included in this package. Please update your cart.",
    );
  return {
    ...raw,
    petName: String(raw.petName || "")
      .trim()
      .slice(0, 80),
    breed: String(raw.breed || "")
      .trim()
      .slice(0, 80),
  };
}

export function quoteItem(raw: BookingItem) {
  const item = validateItem(raw);
  const tier: PriceTier = item.petType === "cat" ? "cat" : item.petSize;
  const service = GROOMING.find((s) => s.id === item.serviceId);
  const bundle = SUPER_SAVER_BUNDLES.find((b) => b.id === item.serviceId);
  const addon = ADDONS.find((a) => a.id === item.serviceId);

  const nightly =
    item.petType === "cat"
      ? item.catType === "non-neutered"
        ? 750
        : 625
      : { small: 625, medium: 750, large: 875 }[item.petSize];

  const oldNightly =
    item.petType === "cat"
      ? item.catType === "non-neutered"
        ? 899
        : 750
      : { small: 750, medium: 899, large: 1050 }[item.petSize];

  let base = 0;
  let original = 0;
  let name = "";

  if (item.category === "boarding") {
    base = nightly * item.nights;
    original = oldNightly * item.nights;
    name = "Cage-Free Boarding";
  } else if (item.category === "bundle" && bundle) {
    if (bundle.petType === "cat") {
      base = bundle.prices.short || 4874;
      original = Math.round(base * 1.3);
    } else {
      base = bundle.prices[item.petSize] || 4874;
      original = Math.round(base * 1.3);
    }
    name = bundle.name;
  } else if (item.category === "addon" && addon) {
    base = addon.price;
    original = addon.originalPrice || Math.round(base * 1.3);
    name = addon.name;
  } else {
    base = service!.prices[tier];
    original = service!.originals[tier];
    name = service!.name;
  }

  const discount =
    item.category === "boarding"
      ? item.nights >= 6
        ? nightly
        : 0
      : base > 999
        ? Math.round(base * 0.1)
        : 0;

  const extras = item.addons.reduce(
    (sum, id) => sum + (ADDONS.find((a) => a.id === id)?.price || 0),
    0,
  );

  const perk =
    item.category !== "boarding"
      ? ""
      : item.nights >= 15
        ? "Free Full Grooming before departure"
        : item.nights >= 8
          ? "Free Special Package before departure"
          : item.nights >= 4
            ? "Free Furry Fresh Spa before departure"
            : "";

  return {
    name,
    base,
    original,
    discount,
    extras,
    total: (base + extras - discount) * item.quantity,
    savings: (original - base + discount) * item.quantity,
    offer: discount
      ? item.category === "boarding"
        ? "STAY6FREE1"
        : "GROOM10"
      : "",
    perk,
    nightly,
  };
}

export function quoteCart(items: BookingItem[]) {
  const lines = items.map((item) => ({ item, ...quoteItem(item) }));
  return {
    lines,
    total: lines.reduce((s, l) => s + l.total, 0),
    base: lines.reduce((s, l) => s + l.base * l.item.quantity, 0),
    extras: lines.reduce((s, l) => s + l.extras * l.item.quantity, 0),
    discount: lines.reduce((s, l) => s + l.discount * l.item.quantity, 0),
    savings: lines.reduce((s, l) => s + l.savings, 0),
    count: items.reduce((s, l) => s + l.quantity, 0),
  };
}

export function indiaDate(offset = 0) {
  const date = new Date(Date.now() + offset * 86400000);
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

export function addDays(date: string, days: number) {
  return new Date(new Date(`${date}T12:00:00Z`).getTime() + days * 86400000)
    .toISOString()
    .slice(0, 10);
}

export const ARRIVAL_WINDOWS = [
  "09:30 AM – 01:30 PM",
  "01:30 PM – 05:30 PM",
  "05:30 PM – 08:30 PM",
];
