"use client";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BookingItem,
  GROOMING,
  money,
  PetSize,
  PetType,
  quoteCart,
  quoteItem,
} from "../../data/catalog";
import LandingHero from "./LandingHero";
import StayStory from "./StayStory";
import AddToCartModal from "./AddToCartModal";
import UnlockOffersModal from "./UnlockOffersModal";
import PackageDetailsModal from "./PackageDetailsModal";
import OffersAndPosters from "../OffersAndPosters";
import { putBookingItem } from "../../utils/booking-cart";
import { Icon, useBookingCart } from "./BookingUI";

const sizes = [
  {
    id: "small" as const,
    name: "Small Breed",
    weight: "Under 10 kg",
    emoji: "🐶",
    breeds: "Shih Tzu, Pug, Maltese, Pomeranian, Lhasa Apso & Indie pups.",
  },
  {
    id: "medium" as const,
    name: "Medium Breed",
    weight: "10–25 kg",
    emoji: "🐕",
    breeds: "Beagle, Indie dogs, Cocker Spaniel, French Bulldog & Corgi.",
  },
  {
    id: "large" as const,
    name: "Large Breed",
    weight: "Over 25 kg",
    emoji: "🦮",
    breeds: "Golden Retriever, Labrador, German Shepherd, Husky & Rottweiler.",
  },
];

const breeds = [
  { name: "All small breeds", size: "small" as const },
  { name: "Shih Tzu", size: "small" as const },
  { name: "Pug", size: "small" as const },
  { name: "Beagle", size: "medium" as const },
  { name: "Indie / Desi Dog", size: "medium" as const },
  { name: "Golden Retriever", size: "large" as const },
  { name: "Labrador", size: "large" as const },
  { name: "German Shepherd", size: "large" as const },
  { name: "Cocker Spaniel", size: "medium" as const },
];

const cardImages = [
  "/images/generated/gentle-bath.webp",
  "/images/generated/fresh-style.webp",
  "/images/stylish_pet_haircut.jpg",
  "/images/luxury_dog_grooming.jpg",
  "/images/clean_dog_boarding.jpg",
  "/images/before_after_grooming.jpg",
];

export default function ReferenceStorefront({
  page = "home",
}: {
  page?: "home" | "boarding" | "grooming";
}) {
  const router = useRouter();
  const [mode, setMode] = useState<"boarding" | "grooming">(
    page === "grooming" ? "grooming" : "boarding",
  );
  const [species, setSpecies] = useState<PetType>("dog");
  const [size, setSize] = useState<PetSize>("small");
  const [catType, setCatType] = useState<"neutered" | "non-neutered">(
    "neutered",
  );
  const [breed, setBreed] = useState("All small breeds");
  const [nights, setNights] = useState(4);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [railEdges, setRailEdges] = useState({ start: true, end: false });
  const rail = useRef<HTMLDivElement>(null);

  // Add-to-cart confirmation & upsell modal state
  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    serviceId: string;
    category: "boarding" | "grooming";
    isDirectCheckout: boolean;
  } | null>(null);

  // Full Package Details Modal State
  const [detailsModalServiceId, setDetailsModalServiceId] = useState<string | null>(null);

  // Interactive Boarding Photo Switcher with Real Photos (Pet-Aware)
  const dogBoardingPhotos = [
    {
      src: "/images/generated/luxury-cage-free-suite.jpg",
      title: "Luxury Cage-Free Suite",
      sub: "Sanitized orthopedic bedding, garden views & 100% cage-free freedom.",
    },
    {
      src: "/images/generated/cosy-boarding.webp",
      title: "Cozy Private Haven",
      sub: "Individual climate-controlled suite with quiet comfort & soft bedding.",
    },
    {
      src: "/images/generated/pet-happy-place.webp",
      title: "Spacious Green Play Lawns",
      sub: "2 daily outdoor nature walks, open lawn play & social time.",
    },
  ];

  const catBoardingPhotos = [
    {
      src: "/images/generated/cat-care.webp",
      title: "Private Quiet Feline Haven",
      sub: "Quiet, sound-isolated haven away from dogs with multi-level climbing nooks.",
    },
    {
      src: "/images/generated/cosy-boarding.webp",
      title: "Sanitized Cozy Suites",
      sub: "Sanitized individual cabins with soft bedding & custom feeding schedules.",
    },
    {
      src: "/images/generated/pet-happy-place.webp",
      title: "Loving 24/7 Supervision",
      sub: "Gentle stress-free care with daily WhatsApp photo & video updates.",
    },
  ];

  const boardingPhotos = species === "cat" ? catBoardingPhotos : dogBoardingPhotos;
  const [activeBoardingPhoto, setActiveBoardingPhoto] = useState(0);

  // Listen to custom booking events from vouchers & campaign flyers
  useEffect(() => {
    const handleOpenBooking = (e: any) => {
      const detail = e.detail;
      if (!detail) return;
      if (detail.type === "boarding") {
        setMode("boarding");
        if (detail.nights) setNights(detail.nights);
        document
          .getElementById("boarding-packages")
          ?.scrollIntoView({ behavior: "smooth" });
      } else {
        setMode("grooming");
        document
          .getElementById("grooming-packages")
          ?.scrollIntoView({ behavior: "smooth" });
      }
      if (detail.appliedCouponCode) {
        setNotice(
          `Offer selected: ${detail.appliedCouponCode}. Configure your package below!`,
        );
      }
    };
    window.addEventListener("snip_open_booking", handleOpenBooking);
    return () =>
      window.removeEventListener("snip_open_booking", handleOpenBooking);
  }, []);

  // Handle direct route entry (e.g. /grooming or /boarding)
  useEffect(() => {
    if (page === "grooming") {
      setMode("grooming");
      const timeout = setTimeout(() => {
        document
          .getElementById("grooming-packages")
          ?.scrollIntoView({ behavior: "smooth" });
      }, 150);
      return () => clearTimeout(timeout);
    } else if (page === "boarding") {
      setMode("boarding");
      const timeout = setTimeout(() => {
        document
          .getElementById("boarding-packages")
          ?.scrollIntoView({ behavior: "smooth" });
      }, 150);
      return () => clearTimeout(timeout);
    }
  }, [page]);

  useEffect(() => {
    const element = rail.current;
    if (!element) return;
    const update = () =>
      setRailEdges({
        start: element.scrollLeft <= 2,
        end:
          element.scrollLeft + element.clientWidth >= element.scrollWidth - 2,
      });
    const observer = new ResizeObserver(update);
    observer.observe(element);
    element.addEventListener("scroll", update, { passive: true });
    update();
    return () => {
      observer.disconnect();
      element.removeEventListener("scroll", update);
    };
  }, []);

  const { items } = useBookingCart();
  const cart = quoteCart(items);
  const selectedSize = sizes.find((s) => s.id === size)!;
  const selection =
    species === "cat"
      ? `Cat${catType === "neutered" ? " · neutered / spayed" : " · not neutered"}`
      : `${selectedSize.name} (${selectedSize.weight})`;

  const preview = (
    petSize: PetSize = size,
    petSpecies: PetType = species,
    cat: "neutered" | "non-neutered" = catType,
  ) =>
    quoteItem({
      id: "preview",
      serviceId: "boarding",
      category: "boarding",
      petType: petSpecies,
      petSize,
      catType: cat,
      nights,
      quantity: 1,
      addons: [],
    });

  const stay = preview();

  // Dynamic 1-more-night nudge for boarding perks & free treatments
  const getNudge = (currentNights: number) => {
    if (currentNights < 4) {
      const diff = 4 - currentNights;
      return {
        targetNights: 4,
        diff,
        message:
          diff === 1
            ? "Add 1 more night to get FREE Furry Fresh Grooming Refresh (₹749 value)!"
            : `Add ${diff} more nights to get FREE Furry Fresh Grooming Refresh (₹749 value)!`,
        actionText: diff === 1 ? "+ Add 1 Night" : `+ Add ${diff} Nights`,
        badge: "🎁 FREE GROOMING UNLOCK",
        color: "gold" as const,
      };
    } else if (currentNights === 5) {
      return {
        targetNights: 6,
        diff: 1,
        message: "Add 1 more night to get 1 Full Night FREE with code STAY6FREE1!",
        actionText: "+ Add 1 Night",
        badge: "🎉 1 NIGHT FREE",
        color: "green" as const,
      };
    } else if (currentNights >= 4 && currentNights < 8) {
      const diff = 8 - currentNights;
      return {
        targetNights: 8,
        diff,
        message:
          diff === 1
            ? "Add 1 more night to get FREE Special Package Grooming Treatment (₹999 value)!"
            : `Add ${diff} more nights to get FREE Special Package Grooming Treatment (₹999 value)!`,
        actionText: diff === 1 ? "+ Add 1 Night" : `+ Add ${diff} Nights`,
        badge: "💎 UPGRADE REWARD",
        color: "gold" as const,
      };
    } else if (currentNights >= 8 && currentNights < 15) {
      const diff = 15 - currentNights;
      return {
        targetNights: 15,
        diff,
        message:
          diff === 1
            ? "Add 1 more night to unlock FREE Full Package Grooming Treatment (₹2,199 value)!"
            : `Add ${diff} more nights to unlock FREE Full Package Grooming Treatment (₹2,199 value)!`,
        actionText: diff === 1 ? "+ Add 1 Night" : `+ Add ${diff} Nights`,
        badge: "👑 VIP FULL GROOMING FREE",
        color: "gold" as const,
      };
    } else {
      return {
        targetNights: currentNights,
        diff: 0,
        message:
          "🎉 Maximum VIP Rewards Unlocked: FREE Full Package Grooming Treatment (₹2,199 value) Included!",
        actionText: "",
        badge: "👑 ALL REWARDS UNLOCKED",
        color: "green" as const,
      };
    }
  };

  const nudge = getNudge(nights);

  useEffect(() => {
    if (!notice) return;
    const timeout = setTimeout(() => setNotice(""), 4500);
    return () => clearTimeout(timeout);
  }, [notice]);

  function chooseSpecies(next: PetType) {
    setSpecies(next);
    setActiveBoardingPhoto(0);
    setBreed(next === "cat" ? "All cats" : "All small breeds");
    if (next === "dog") setSize("small");
  }

  function selectSize(value: PetSize) {
    setSize(value);
    setBreed(`All ${value} breeds`);
  }

  // Open customization modal before adding to cart
  function requestAddToCart(
    serviceId: string,
    category: "boarding" | "grooming",
    checkout = false,
  ) {
    setModalConfig({
      isOpen: true,
      serviceId,
      category,
      isDirectCheckout: checkout,
    });
  }

  // Confirmed callback from AddToCartModal
  function handleModalConfirm(item: BookingItem, checkout: boolean) {
    try {
      putBookingItem(item);
      const quoted = quoteItem(item);
      setNotice(`${quoted.name} added to your cart`);
      setError("");
      if (checkout) router.push("/checkout");
    } catch {
      setError(
        "Your browser could not save this booking. Please allow site storage or call +91 97398 87770.",
      );
    }
  }

  function browse(direction: number) {
    const element = rail.current;
    if (!element) return;
    const card = element.children[0] as HTMLElement;
    element.scrollTo({
      left: element.scrollLeft + direction * (card.offsetWidth + 16),
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    });
  }

  return (
    <div className="ref-storefront">
      {/* Redesigned Hero Section */}
      <LandingHero mode={mode} onMode={setMode} page={page} />

      {/* Unified Luxury Boarding & Breed Pricing Card (NO Step 1 / Step 2!) */}
      <section
        className="ref-container"
        id="boarding-packages"
        style={{ scrollMarginTop: "90px" }}
      >
        <div className="ref-section-title" style={{ marginBottom: "14px" }}>
          <div>
            <span className="ref-step ref-step-gold">
              100% CAGE-FREE BOARDING RESORT
            </span>
            <h2 style={{ fontSize: "28px", margin: "4px 0" }}>Luxury Cage-Free Overnight Boarding</h2>
            <p style={{ margin: "2px 0", fontSize: "13px" }}>
              Select pet size or breed, adjust stay nights, and enjoy unlocked perks.
            </p>
          </div>
          <div className="ref-species" role="group" aria-label="Pet species">
            <button
              aria-pressed={species === "dog"}
              onClick={() => chooseSpecies("dog")}
            >
              🐕 Dogs
            </button>
            <button
              aria-pressed={species === "cat"}
              onClick={() => chooseSpecies("cat")}
            >
              🐈 Cats
            </button>
          </div>
        </div>

        {error && (
          <p className="pet-error" role="alert">
            {error}
          </p>
        )}

        <article className="ref-unified-boarding-card">
          <div className="ref-unified-boarding-grid">
            {/* Left Visual Panel with Interactive Photo Switcher */}
            <div className="ref-unified-photo-panel">
              <img
                src={boardingPhotos[activeBoardingPhoto]?.src || "/images/generated/luxury-cage-free-suite.jpg"}
                alt={boardingPhotos[activeBoardingPhoto]?.title || "Cage-Free Boarding"}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = "/images/generated/luxury-cage-free-suite.jpg";
                }}
              />
              <div className="ref-unified-photo-overlay">
                <div>
                  <span className="badge">
                    <Icon name="sparkle" size={14} />
                    100% Zero Wire Cages
                  </span>
                  <div className="ref-amenity-tags">
                    <span className="ref-amenity-tag">✓ 24/7 Caretaker</span>
                    <span className="ref-amenity-tag">✓ Daily Lawn Walks</span>
                    <span className="ref-amenity-tag">✓ WhatsApp Video Updates</span>
                  </div>
                </div>

                <div className="ref-unified-photo-bottom">
                  <h4>{boardingPhotos[activeBoardingPhoto]?.title}</h4>
                  <p>{boardingPhotos[activeBoardingPhoto]?.sub}</p>
                </div>

                {/* Thumbnails to switch photo */}
                <div className="ref-gallery-thumbs">
                  {boardingPhotos.map((p, idx) => (
                    <button
                      key={p.src}
                      type="button"
                      className={`ref-gallery-thumb-btn ${activeBoardingPhoto === idx ? "active" : ""}`}
                      onClick={() => setActiveBoardingPhoto(idx)}
                      aria-label={`View photo ${idx + 1}`}
                    >
                      <img src={p.src} alt="" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Configuration & Pricing Panel */}
            <div className="ref-unified-config-panel">
              <div className="ref-unified-header">
                <div>
                  <span className="ref-pill-small">100% CAGE-FREE SUITE</span>
                  <h3>
                    {species === "dog"
                      ? `${selectedSize.name} Sanctuary Suite`
                      : catType === "neutered"
                        ? "Neutered Cat Sanctuary Suite"
                        : "Non-Neutered Cat Sanctuary Suite"}
                  </h3>
                  <p>
                    {species === "dog"
                      ? selectedSize.breeds
                      : "Private, sound-isolated feline cabin with multi-tier climbing perches."}
                  </p>
                </div>
              </div>

              {/* Pet Size / Weight Options (Live Rates) */}
              <div className="ref-size-section-compact">
                <span className="ref-field-label">Select Breed Size (Rates adjust live):</span>
                {species === "dog" ? (
                  <div className="ref-compact-size-grid">
                    {sizes.map((option) => (
                      <button
                        key={option.id}
                        type="button"
                        className="ref-compact-size-card"
                        aria-pressed={size === option.id}
                        onClick={() => selectSize(option.id)}
                      >
                        <div className="ref-compact-size-left">
                          <span className="ref-compact-size-emoji">{option.emoji}</span>
                          <div>
                            <h4>{option.name}</h4>
                            <span>{option.weight}</span>
                          </div>
                        </div>
                        <div className="ref-compact-size-right">
                          <strong>{money(preview(option.id).nightly)}<small>/nt</small></strong>
                          {size === option.id && (
                            <span className="ref-compact-check"><Icon name="check" size={11} /></span>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="ref-compact-size-grid ref-cat-compact-grid">
                    {(["neutered", "non-neutered"] as const).map((type) => (
                      <button
                        key={type}
                        type="button"
                        className="ref-compact-size-card"
                        aria-pressed={catType === type}
                        onClick={() => setCatType(type)}
                      >
                        <div className="ref-compact-size-left">
                          <span className="ref-compact-size-emoji">🐈</span>
                          <div>
                            <h4>{type === "neutered" ? "Neutered / Spayed" : "Not Neutered"}</h4>
                            <span>Quiet Cabin</span>
                          </div>
                        </div>
                        <div className="ref-compact-size-right">
                          <strong>{money(preview(size, "cat", type).nightly)}<small>/nt</small></strong>
                          {catType === type && (
                            <span className="ref-compact-check"><Icon name="check" size={11} /></span>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {/* Quick Breed Selector Chips */}
                <div className="ref-breed-selector-compact">
                  <span className="ref-field-label-inline">Quick Breed:</span>
                  <div className="ref-breed-chips" role="group">
                    {(species === "dog"
                      ? breeds
                      : [
                          "All cats",
                          "Persian Cat",
                          "Indie Cat",
                          "British Shorthair",
                          "Maine Coon",
                        ].map((name) => ({ name, size }))
                    ).map((option) => (
                      <button
                        key={option.name}
                        type="button"
                        aria-pressed={breed === option.name}
                        onClick={() => {
                          setBreed(option.name);
                          if (species === "dog") setSize(option.size);
                        }}
                      >
                        {option.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Live Rate & Length of Stay Stepper */}
              <div className="ref-unified-rate-stepper-box">
                <div className="ref-boarding-rate">
                  <strong>{money(stay.nightly)}</strong>
                  <span>/ night</span>
                  <del>{money(stay.original / nights)}</del>
                  <b>Save {money(stay.original / nights - stay.nightly)}/night</b>
                </div>

                <div className="ref-stay-picker">
                  <label htmlFor="ref-stay-nights">Stay:</label>
                  <div className="ref-stepper-control">
                    <button
                      type="button"
                      aria-label="One fewer boarding night"
                      disabled={nights <= 1}
                      onClick={() => setNights((n) => Math.max(1, n - 1))}
                    >
                      −
                    </button>
                    <input
                      id="ref-stay-nights"
                      type="number"
                      min="1"
                      max="60"
                      value={nights}
                      onChange={(e) =>
                        setNights(
                          Math.max(
                            1,
                            Math.min(60, Number(e.target.value) || 1),
                          ),
                        )
                      }
                    />
                    <button
                      type="button"
                      aria-label="One more boarding night"
                      disabled={nights >= 60}
                      onClick={() => setNights((n) => Math.min(60, n + 1))}
                    >
                      +
                    </button>
                    <span>nights</span>
                  </div>
                  <div className="ref-stay-total">
                    <strong>{money(stay.total)}</strong>
                    <small>total ({nights} {nights === 1 ? 'night' : 'nights'})</small>
                  </div>
                </div>
              </div>

              {/* Dynamic Milestone Nudge */}
              <div
                className={`ref-nudge-compact ${nudge.color === "green" ? "nudge-green" : "nudge-gold"}`}
              >
                <div className="ref-nudge-left">
                  <span className="ref-nudge-badge">
                    <Icon name="sparkle" size={13} />
                    {nudge.badge}
                  </span>
                  <span className="ref-nudge-text">{nudge.message}</span>
                </div>
                {nudge.actionText && (
                  <button
                    type="button"
                    className="ref-nudge-action-btn"
                    onClick={() => setNights(nudge.targetNights)}
                  >
                    {nudge.actionText}
                  </button>
                )}
              </div>

              {/* Automatic Milestone Perks */}
              {(stay.offer || stay.perk) && (
                <div className="ref-stay-perks" style={{ margin: 0, gap: '6px 12px' }}>
                  {stay.offer && (
                    <span>
                      <Icon name="sparkle" size={13} />1 night free with
                      STAY6FREE1 · saving {money(stay.discount)}
                    </span>
                  )}
                  {stay.perk && (
                    <span>
                      <Icon name="check" size={13} />
                      {stay.perk}
                    </span>
                  )}
                </div>
              )}

              {/* Bottom Inclusions & Primary Add to Cart Button */}
              <div className="ref-unified-action-row">
                <div className="ref-mini-inclusions">
                  <span><Icon name="check" size={13} /> 100% Zero Wire Cages</span>
                  <span><Icon name="check" size={13} /> 2 Daily Lawn Walks</span>
                  <span><Icon name="check" size={13} /> Daily WhatsApp Videos</span>
                  <span><Icon name="check" size={13} /> 24/7 Loving Caretaker</span>
                </div>

                <button
                  type="button"
                  className="ref-unified-primary-btn"
                  onClick={() =>
                    requestAddToCart("boarding", "boarding", false)
                  }
                >
                  <Icon name="bag" size={18} />
                  <span>
                    Add Boarding to Cart • {money(stay.total)}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </article>
      </section>

      {/* Artisan Grooming Packages Section */}
      <section
        className="ref-container ref-packages"
        id="grooming-packages"
        style={{ scrollMarginTop: "90px" }}
      >
        <div className="ref-grooming-heading">
          <div>
            <span className="ref-step ref-step-green">
              ARTISAN GROOMING &amp; SPA
            </span>
            <h3>Grooming &amp; Spa Packages</h3>
            <p>
              Handcrafted coat care, priced upfront for{" "}
              <strong>{selection}</strong>.
            </p>
          </div>
          <div className="ref-rail-controls">
            <span>Swipe for all 6 packages</span>
            <button
              type="button"
              aria-label="Previous grooming packages"
              disabled={railEdges.start}
              onClick={() => browse(-1)}
            >
              ←
            </button>
            <button
              type="button"
              aria-label="Next grooming packages"
              disabled={railEdges.end}
              onClick={() => browse(1)}
            >
              →
            </button>
          </div>
        </div>

        <div
          className="ref-grooming-rail"
          ref={rail}
          role="region"
          aria-label="Grooming packages, scroll horizontally"
          tabIndex={0}
        >
          {GROOMING.map((service, index) => {
            const item: BookingItem = {
              id: "preview",
              serviceId: service.id,
              category: "grooming",
              petType: species,
              petSize: size,
              catType,
              nights: 1,
              quantity: 1,
              addons: [],
            };
            const price = quoteItem(item);
            return (
              <article
                className={`ref-groom-card ${index === 1 ? "ref-recommended" : ""}`}
                key={service.id}
                onClick={() => setDetailsModalServiceId(service.id)}
                style={{ cursor: "pointer" }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setDetailsModalServiceId(service.id);
                  }
                }}
              >
                {index === 1 && (
                  <span className="ref-popular">
                    <Icon name="sparkle" size={12} />
                    Popular package
                  </span>
                )}
                <div className="ref-groom-image">
                  <img
                    src={
                      species === "cat"
                        ? "/images/generated/cat-care.webp"
                        : cardImages[index]
                    }
                    alt={`${service.name} grooming experience`}
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src =
                        "/images/generated/gentle-bath.webp";
                    }}
                  />
                  <span>
                    {index === 4
                      ? "Under 6 months"
                      : index === 5
                        ? "Coat care"
                        : service.label}
                  </span>
                </div>
                <h4>{service.name}</h4>
                <p className="ref-groom-subtitle">{service.label}</p>
                <div className="ref-groom-price">
                  <strong>{money(price.total)}</strong>
                  <del>{money(price.original)}</del>
                  <span>
                    (
                    {species === "cat"
                      ? "Cat"
                      : size[0].toUpperCase() + size.slice(1)}
                    )
                  </span>
                </div>
                {price.offer && (
                  <p className="ref-groom-offer">
                    Extra 10% off included · {price.offer}
                  </p>
                )}
                <ul>
                  {service.includes.slice(0, 3).map((text) => (
                    <li key={text}>
                      <Icon name="check" size={13} />
                      {text}
                    </li>
                  ))}
                </ul>

                <button
                  type="button"
                  className="ref-view-details-action"
                  onClick={(e) => {
                    e.stopPropagation();
                    setDetailsModalServiceId(service.id);
                  }}
                >
                  View Details &amp; Inclusions →
                </button>

                <div className="ref-groom-actions">
                  <button
                    type="button"
                    className="ref-button ref-button-gold"
                    style={{ width: "100%", justifyContent: "center" }}
                    onClick={(e) => {
                      e.stopPropagation();
                      requestAddToCart(service.id, "grooming", false);
                    }}
                  >
                    <Icon name="bag" size={16} />
                    Add to Cart • {money(price.total)}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
        <p className="ref-pricing-note">
          Festival discounts and stay perks are applied automatically. Optional
          pampering extras can be customized when adding to cart. Arrival windows
          are confirmed at checkout.
        </p>
      </section>

      {/* Verified Festival Offers & Campaign Posters (from old website) */}
      <section id="offers" style={{ scrollMarginTop: "90px" }}>
        <OffersAndPosters
          onOpenBooking={() => {
            document
              .getElementById("grooming-packages")
              ?.scrollIntoView({ behavior: "smooth" });
          }}
        />
      </section>

      <StayStory />

      {/* Trust & Location Support */}
      <section className="ref-container ref-support">
        <div className="ref-trust-grid">
          {[
            [
              "home",
              "100% Cage-Free",
              "Comfortable private spaces for rest, play, and lawn walks.",
            ],
            [
              "phone",
              "WhatsApp Updates",
              "Live photo & video updates while your pet stays with us.",
            ],
            [
              "heart",
              "Personal Care",
              "Tell us about their diet, routine, and sensitive care needs.",
            ],
            [
              "pin",
              "Studio Visits",
              "Drop by our studio on Kanakapura Main Road anytime.",
            ],
          ].map(([icon, title, text]) => (
            <div key={title}>
              <span>
                <Icon name={icon} size={20} />
              </span>
              <div>
                <h4>{title}</h4>
                <p>{text}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="ref-location" id="studio-location">
          <div>
            <span className="ref-location-eyebrow">
              <Icon name="pin" size={16} />
              KANAKAPURA MAIN ROAD STUDIO
            </span>
            <h2>Visit Us in Person</h2>
            <p>
              Site no 61, Kanakapura Main Road, Bangalore 560082.
            </p>
            <p style={{ fontSize: "0.85rem", color: "var(--ref-text-muted)", marginTop: "4px", lineHeight: "1.45" }}>
              <strong>Landmark:</strong> Situated directly on Kanakapura Main Road, right beside the prominent Shani Mahatma Temple. Ample dedicated parking space is available right outside for convenient drop-offs and pickups.
            </p>
            <span className="ref-opening">
              <i />
              Working Hours: <strong>09:30 AM – 08:30 PM</strong> · Open 7 Days a Week (Mon – Sun)
            </span>
            <div className="ref-location-actions" style={{ flexWrap: "wrap", gap: "8px", marginTop: "14px" }}>
              <a
                className="ref-button"
                href="https://maps.app.goo.gl/MqFTrZiLPbttv3eD6"
                target="_blank"
                rel="noreferrer"
              >
                <Icon name="pin" size={16} />
                Google Maps Directions
              </a>
              <a
                className="ref-button ref-button-muted"
                href="https://wa.me/919739887770?text=Hi%2C%20I%20would%20like%20to%20schedule%20a%20studio%20visit%20at%20Snip%20%26%20Style!"
                target="_blank"
                rel="noreferrer"
              >
                <Icon name="phone" size={16} />
                Schedule Studio Visit
              </a>
              <a
                className="ref-button ref-button-muted"
                href="tel:+919739887770"
              >
                <Icon name="phone" size={16} />
                Call +91 9739887770
              </a>
              <a
                className="ref-button ref-button-muted"
                href="mailto:Snip&style857@gmail.com"
              >
                Snip&amp;style857@gmail.com
              </a>
            </div>
          </div>
          <a
            className="ref-location-map"
            href="https://maps.app.goo.gl/MqFTrZiLPbttv3eD6"
            target="_blank"
            rel="noreferrer"
            aria-label="Open directions to Snip and Style in Google Maps"
          >
            <div className="studio-map-art" aria-hidden="true">
              <Icon name="pin" size={38} />
              <strong>Snip &amp; Style</strong>
              <small>Beside Shani Mahatma Temple</small>
            </div>
            <span>
              <Icon name="pin" size={16} />
              Kanakapura Road Studio · Get directions ↗
            </span>
          </a>
        </div>
      </section>

      {/* Sanctuary FAQ */}
      <section className="ref-container ref-faq" id="faq">
        <div className="ref-section-title">
          <div>
            <span className="ref-step ref-step-green">BEFORE YOUR VISIT</span>
            <h2>Frequently Asked Questions</h2>
          </div>
          <a href="tel:+919739887770">Talk to our team ↗</a>
        </div>
        {[
          [
            "How do I book online and visit your studio?",
            "Pick your cage-free boarding dates or grooming package right here on our website. You can customize add-ons and verify breed size before checkout. After booking, bring your pet to our studio beside Shani Mahatma Temple, Kanakapura Main Road, Bengaluru at your reserved time!",
          ],
          [
            "How are the festival offers applied?",
            "Grooming packages above ₹999 receive an extra 10% off automatically (Code: GROOM10). Boarding stays of 6+ nights include one free night (Code: STAY6FREE1). Stays of 4+ nights include a free Furry Fresh Spa bath (Code: FREESPA). Your total reflects these savings automatically.",
          ],
          [
            "What should I bring for boarding?",
            "Bring an up-to-date vaccination record, your pet’s usual food, any prescribed medication with instructions, and a familiar toy or blanket. Call us before booking if your pet has special care requirements.",
          ],
          [
            "Can I book without creating an account?",
            "Yes! Choose your services, confirm pet details and extras, select arrival dates, and pay securely. You will immediately receive a verified booking reference code and WhatsApp confirmation.",
          ],
          [
            "How do I change or cancel my booking?",
            "Call or WhatsApp +91 97398 87770 with your booking reference. Our team will assist with changes or cancellations according to our booking policy.",
          ],
        ].map(([question, answer]) => (
          <details key={question}>
            <summary>
              {question}
              <span>+</span>
            </summary>
            <p>{answer}</p>
          </details>
        ))}
      </section>

      <p className="ref-image-note ref-container">
        Pet imagery is illustrative. We’d love to show you around the studio in
        person on Kanakapura Main Road!
      </p>

      {/* Floating Notification */}
      {notice && (
        <div className="ref-added-status" role="status">
          <Icon name="check" size={16} />
          {notice}
          <button
            type="button"
            aria-label="Dismiss cart notification"
            onClick={() => setNotice("")}
          >
            ×
          </button>
        </div>
      )}

      {/* Floating Cart Pill */}
      {items.length > 0 && (
        <aside
          className="ref-floating-cart"
          aria-label="Your selected services"
        >
          <span className="ref-floating-bag">
            <Icon name="bag" size={22} />
            <b>{cart.count}</b>
          </span>
          <div className="ref-floating-summary">
            <strong>
              {cart.lines[0].name}
              {cart.count > 1 ? ` + ${cart.count - 1} more` : ""}
            </strong>
            <span>
              {money(cart.total)}
              {cart.discount > 0 && <small>Offers applied</small>}
            </span>
          </div>
          <Link href="/cart" className="ref-button ref-button-gold">
            View cart
            <Icon name="arrow" size={16} />
          </Link>
        </aside>
      )}

      {/* Add To Cart Confirmation & Upsell Modal */}
      {modalConfig && (
        <AddToCartModal
          isOpen={modalConfig.isOpen}
          onClose={() => setModalConfig(null)}
          serviceId={modalConfig.serviceId}
          category={modalConfig.category}
          petType={species}
          petSize={size}
          catType={catType}
          breed={breed}
          nights={nights}
          isDirectCheckout={modalConfig.isDirectCheckout}
          onConfirm={handleModalConfirm}
        />
      )}

      {/* Full Package Details Modal */}
      {detailsModalServiceId && (
        <PackageDetailsModal
          isOpen={!!detailsModalServiceId}
          onClose={() => setDetailsModalServiceId(null)}
          serviceId={detailsModalServiceId}
          petType={species}
          petSize={size}
          onAddedToCart={(msg) => setNotice(msg)}
          onRequestAddToCart={(serviceId, petT, petS) => {
            setSpecies(petT);
            setSize(petS);
            requestAddToCart(serviceId, "grooming", false);
          }}
        />
      )}

      {/* Lead Capture Phone Collection Modal */}
      <UnlockOffersModal />
    </div>
  );
}
