"use client";
import React, { useState, useEffect } from "react";
import {
  ADDONS,
  GROOMING,
  includedAddonIds,
  money,
  PetSize,
  PetType,
  quoteItem,
  BookingItem,
} from "../../data/catalog";
import { Icon } from "./BookingUI";

export interface AddToCartModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceId: string;
  category: "boarding" | "grooming";
  petType: PetType;
  petSize: PetSize;
  catType: "neutered" | "non-neutered";
  breed: string;
  nights: number;
  isDirectCheckout?: boolean;
  onConfirm: (item: BookingItem, checkout: boolean) => void;
}

const dogSizes = [
  {
    id: "small" as const,
    name: "Small Breed",
    weight: "Under 10 kg",
    emoji: "🐶",
    examples: "Shih Tzu, Pug, Maltese, Indie Pup, Lhasa Apso",
  },
  {
    id: "medium" as const,
    name: "Medium Breed",
    weight: "10–25 kg",
    emoji: "🐕",
    examples: "Beagle, Indie Dog, Cocker Spaniel, French Bulldog, Corgi",
  },
  {
    id: "large" as const,
    name: "Large Breed",
    weight: "Over 25 kg",
    emoji: "🦮",
    examples: "Golden Retriever, Labrador, German Shepherd, Husky, Rottweiler",
  },
];

export default function AddToCartModal({
  isOpen,
  onClose,
  serviceId,
  category,
  petType: initialPetType,
  petSize: initialPetSize,
  catType: initialCatType,
  breed: initialBreed,
  nights,
  isDirectCheckout = false,
  onConfirm,
}: AddToCartModalProps) {
  const [petType, setPetType] = useState<PetType>(initialPetType);
  const [petSize, setPetSize] = useState<PetSize>(initialPetSize);
  const [catType, setCatType] = useState<"neutered" | "non-neutered">(initialCatType);
  const [breed, setBreed] = useState<string>(initialBreed);
  const [petName, setPetName] = useState<string>("");
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [departureGrooming, setDepartureGrooming] = useState<string>("none");

  // Reset local state when modal opens with new item
  useEffect(() => {
    if (isOpen) {
      setPetType(initialPetType);
      setPetSize(initialPetSize);
      setCatType(initialCatType);
      setBreed(initialBreed);
      setSelectedAddons([]);
      setDepartureGrooming("none");
    }
  }, [isOpen, initialPetType, initialPetSize, initialCatType, initialBreed]);

  if (!isOpen) return null;

  const currentIncluded = includedAddonIds(serviceId);

  // Toggle single addon
  function toggleAddon(id: string) {
    if (currentIncluded.includes(id)) return;
    setSelectedAddons((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  }

  // Calculate pricing preview
  const primaryItem: BookingItem = {
    id: "preview_modal",
    serviceId,
    category,
    petType,
    petSize,
    catType,
    nights: category === "boarding" ? nights : 1,
    quantity: 1,
    addons: selectedAddons,
    breed,
    petName,
  };

  const primaryQuote = quoteItem(primaryItem);

  // Optional departure grooming calculation
  let departurePrice = 0;
  let departureName = "";
  if (category === "boarding" && departureGrooming !== "none") {
    const groomService = GROOMING.find((s) => s.id === departureGrooming);
    if (groomService) {
      departureName = groomService.name;
      const tier = petType === "cat" ? "cat" : petSize;
      departurePrice = groomService.prices[tier];
    }
  }

  const grandTotal = primaryQuote.total + departurePrice;

  function handleFinalConfirm(proceedToCheckout: boolean) {
    // 1. Add main item
    const finalItem: BookingItem = {
      id: crypto.randomUUID(),
      serviceId,
      category,
      petType,
      petSize,
      catType,
      nights: category === "boarding" ? nights : 1,
      quantity: 1,
      addons: selectedAddons,
      breed,
      petName,
    };
    onConfirm(finalItem, proceedToCheckout);

    // 2. If departure grooming was selected, also add it
    if (category === "boarding" && departureGrooming !== "none") {
      const extraGroomItem: BookingItem = {
        id: crypto.randomUUID(),
        serviceId: departureGrooming,
        category: "grooming",
        petType,
        petSize,
        catType,
        nights: 1,
        quantity: 1,
        addons: [],
        breed,
        petName,
      };
      onConfirm(extraGroomItem, false);
    }

    onClose();
  }

  return (
    <div
      className="ref-modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="ref-modal-title"
      onClick={onClose}
    >
      <div
        className="ref-modal-container"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="ref-modal-header">
          <div className="ref-modal-header-text">
            <span className="ref-modal-eyebrow">
              <Icon name="sparkle" size={14} />
              CONFIRM PET &amp; PAMPERING EXTRAS
            </span>
            <h3 id="ref-modal-title">
              {category === "boarding"
                ? "Luxury Cage-Free Boarding"
                : GROOMING.find((s) => s.id === serviceId)?.name || "Grooming Package"}
            </h3>
            <p>
              Please verify your pet’s breed &amp; size so our stylists can prepare the right care routine.
            </p>
          </div>
          <button
            className="ref-modal-close"
            onClick={onClose}
            aria-label="Close customization modal"
          >
            ×
          </button>
        </div>

        <div className="ref-modal-body">
          {/* Section 1: Species & Size / Breed Confirmation */}
          <div className="ref-modal-section">
            <div className="ref-modal-section-title">
              <span>STEP 1</span>
              <h4>Confirm Pet Species &amp; Breed Size</h4>
            </div>
            <p className="ref-modal-hint">
              Pricing is calibrated for weight &amp; coat volume. Tap to change if needed:
            </p>

            <div className="ref-modal-species-toggle">
              <button
                type="button"
                className={petType === "dog" ? "active" : ""}
                onClick={() => setPetType("dog")}
              >
                🐕 Dog
              </button>
              <button
                type="button"
                className={petType === "cat" ? "active" : ""}
                onClick={() => setPetType("cat")}
              >
                🐈 Cat
              </button>
            </div>

            {petType === "dog" ? (
              <div className="ref-modal-size-grid">
                {dogSizes.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    className={`ref-modal-size-card ${petSize === s.id ? "selected" : ""}`}
                    onClick={() => {
                      setPetSize(s.id);
                      setBreed(`All ${s.id} breeds`);
                    }}
                  >
                    <div className="ref-modal-size-top">
                      <span className="ref-modal-size-emoji">{s.emoji}</span>
                      <strong>{s.name}</strong>
                    </div>
                    <span className="ref-modal-size-weight">{s.weight}</span>
                    <small>{s.examples}</small>
                  </button>
                ))}
              </div>
            ) : (
              <div className="ref-modal-size-grid ref-cat-options">
                <button
                  type="button"
                  className={`ref-modal-size-card ${catType === "neutered" ? "selected" : ""}`}
                  onClick={() => setCatType("neutered")}
                >
                  <div className="ref-modal-size-top">
                    <span className="ref-modal-size-emoji">🐈</span>
                    <strong>Neutered / Spayed Cat</strong>
                  </div>
                  <span className="ref-modal-size-weight">Quiet Private Suites</span>
                  <small>Persian, Indie, British Shorthair, etc.</small>
                </button>
                <button
                  type="button"
                  className={`ref-modal-size-card ${catType === "non-neutered" ? "selected" : ""}`}
                  onClick={() => setCatType("non-neutered")}
                >
                  <div className="ref-modal-size-top">
                    <span className="ref-modal-size-emoji">🐈</span>
                    <strong>Non-Neutered Cat</strong>
                  </div>
                  <span className="ref-modal-size-weight">Separate Dedicated Area</span>
                  <small>Requires individual isolated accommodation</small>
                </button>
              </div>
            )}

            {/* Pet Breed / Name Text Input */}
            <div className="ref-modal-inputs">
              <div className="ref-input-group">
                <label htmlFor="ref-pet-breed">Your Pet’s Breed / Mix</label>
                <input
                  id="ref-pet-breed"
                  type="text"
                  placeholder="e.g. Shih Tzu, Golden Retriever, Indie, Persian"
                  value={breed}
                  onChange={(e) => setBreed(e.target.value)}
                />
              </div>
              <div className="ref-input-group">
                <label htmlFor="ref-pet-name">Pet’s Name (Optional)</label>
                <input
                  id="ref-pet-name"
                  type="text"
                  placeholder="e.g. Bruno, Bella, Simba"
                  value={petName}
                  onChange={(e) => setPetName(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Section 2: Departure Grooming Cross-sell (If Boarding) */}
          {category === "boarding" && (
            <div className="ref-modal-section ref-cross-sell-section">
              <div className="ref-modal-section-title">
                <span>RECOMMENDED</span>
                <h4>Add Departure Bath or Grooming?</h4>
              </div>
              <p className="ref-modal-hint">
                Pets run and play in our garden lawn! Add a departure spa so your pet goes home smelling fresh &amp; clean:
              </p>

              <div className="ref-groom-cross-grid">
                <label className={`ref-groom-cross-option ${departureGrooming === "none" ? "selected" : ""}`}>
                  <input
                    type="radio"
                    name="departureGrooming"
                    value="none"
                    checked={departureGrooming === "none"}
                    onChange={() => setDepartureGrooming("none")}
                  />
                  <div>
                    <strong>No Departure Grooming</strong>
                    <span>Standard clean-up upon departure</span>
                  </div>
                  <span className="ref-cross-price">₹0</span>
                </label>

                <label className={`ref-groom-cross-option ${departureGrooming === "furry-fresh" ? "selected" : ""}`}>
                  <input
                    type="radio"
                    name="departureGrooming"
                    value="furry-fresh"
                    checked={departureGrooming === "furry-fresh"}
                    onChange={() => setDepartureGrooming("furry-fresh")}
                  />
                  <div>
                    <strong>Furry Fresh Spa Bath</strong>
                    <span>Organic herbal bath, warm blow dry &amp; ear cleaning</span>
                  </div>
                  <span className="ref-cross-price">
                    +{money(GROOMING[0].prices[petType === "cat" ? "cat" : petSize])}
                  </span>
                </label>

                <label className={`ref-groom-cross-option ${departureGrooming === "special-package" ? "selected" : ""}`}>
                  <input
                    type="radio"
                    name="departureGrooming"
                    value="special-package"
                    checked={departureGrooming === "special-package"}
                    onChange={() => setDepartureGrooming("special-package")}
                  />
                  <div>
                    <strong>Special Grooming Package (Most Popular)</strong>
                    <span>Bath + teeth brushing + paw pad balm &amp; mist</span>
                  </div>
                  <span className="ref-cross-price">
                    +{money(GROOMING[1].prices[petType === "cat" ? "cat" : petSize])}
                  </span>
                </label>

                <label className={`ref-groom-cross-option ${departureGrooming === "full-grooming" ? "selected" : ""}`}>
                  <input
                    type="radio"
                    name="departureGrooming"
                    value="full-grooming"
                    checked={departureGrooming === "full-grooming"}
                    onChange={() => setDepartureGrooming("full-grooming")}
                  />
                  <div>
                    <strong>Full Head-to-Tail Grooming &amp; Haircut</strong>
                    <span>Complete haircut, styling, bath, deshedding &amp; nail trim</span>
                  </div>
                  <span className="ref-cross-price">
                    +{money(GROOMING[3].prices[petType === "cat" ? "cat" : petSize])}
                  </span>
                </label>
              </div>
            </div>
          )}

          {/* Section 3: Popular Spa Add-ons */}
          <div className="ref-modal-section">
            <div className="ref-modal-section-title">
              <span>EXTRAS</span>
              <h4>
                {category === "boarding"
                  ? "Select Additional Health &amp; Spa Extras"
                  : "Enhance Your Pet’s Grooming Session"}
              </h4>
            </div>
            <p className="ref-modal-hint">
              Personalize your pet’s visit with certified gentle treatments:
            </p>

            <div className="ref-addon-checkbox-grid">
              {ADDONS.map((addon) => {
                const isIncluded = currentIncluded.includes(addon.id);
                const isSelected = selectedAddons.includes(addon.id);

                return (
                  <label
                    key={addon.id}
                    className={`ref-addon-checkbox-card ${
                      isIncluded ? "included" : isSelected ? "selected" : ""
                    }`}
                  >
                    <input
                      type="checkbox"
                      disabled={isIncluded}
                      checked={isSelected || isIncluded}
                      onChange={() => toggleAddon(addon.id)}
                    />
                    <div className="ref-addon-info">
                      <span className="ref-addon-name">{addon.name}</span>
                      {isIncluded ? (
                        <small className="ref-addon-badge">Included in package ✓</small>
                      ) : (
                        <span className="ref-addon-price">
                          <del style={{ textDecoration: "line-through", color: "#8d988b", marginRight: "4px" }}>
                            {money(addon.originalPrice)}
                          </del>
                          <strong>+{money(addon.price)}</strong>
                          <span className="ref-addon-save-tag">
                            Save {money(addon.originalPrice - addon.price)}
                          </span>
                        </span>
                      )}
                    </div>
                  </label>
                );
              })}
            </div>
          </div>
        </div>

        {/* Modal Footer & Total */}
        <div className="ref-modal-footer">
          <div className="ref-modal-total-box">
            <span className="ref-modal-total-label">
              Total for {primaryQuote.name}
              {category === "boarding" ? ` (${nights} nights)` : ""}:
            </span>
            <div className="ref-modal-total-price">
              <strong>{money(grandTotal)}</strong>
              {departureName && (
                <span className="ref-modal-savings">
                  + {departureName} ({money(departurePrice)})
                </span>
              )}
              {primaryQuote.savings > 0 && (
                <span className="ref-modal-savings">
                  · Save {money(primaryQuote.savings)} with offers
                </span>
              )}
            </div>
          </div>

          <div className="ref-modal-actions">
            <button
              type="button"
              className="ref-button ref-button-muted"
              onClick={() => handleFinalConfirm(false)}
            >
              <Icon name="bag" size={17} />
              Add to Cart &amp; Continue
            </button>
            <button
              type="button"
              className="ref-button ref-button-gold"
              onClick={() => handleFinalConfirm(isDirectCheckout || true)}
            >
              Proceed to Checkout
              <Icon name="arrow" size={17} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
