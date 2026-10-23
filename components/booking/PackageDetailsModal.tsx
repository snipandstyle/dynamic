"use client";
import React from "react";
import { Icon } from "./BookingUI";
import { GROOMING, money, PetSize, PetType } from "../../data/catalog";
import { putBookingItem } from "../../utils/booking-cart";
import { groomingImage } from "../../data/grooming-images";

interface PackageDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceId: string;
  petType?: PetType;
  petSize?: PetSize;
  onAddedToCart?: (message: string) => void;
  onRequestAddToCart?: (serviceId: string, type: PetType, size: PetSize) => void;
}

export default function PackageDetailsModal({
  isOpen,
  onClose,
  serviceId,
  petType = "dog",
  petSize = "small",
  onAddedToCart,
  onRequestAddToCart,
}: PackageDetailsModalProps) {
  const [selectedType, setSelectedType] = React.useState<PetType>(petType);
  const [selectedSize, setSelectedSize] = React.useState<PetSize>(petSize);

  React.useEffect(() => {
    setSelectedType(petType);
    setSelectedSize(petSize);
  }, [petType, petSize]);

  if (!isOpen) return null;

  const service = GROOMING.find((s) => s.id === serviceId) || GROOMING[0];
  const tier = selectedType === "cat" ? "cat" : selectedSize;
  const price = service.prices[tier];
  const original = service.originals[tier];
  const savings = original - price;

  const handleAddToCart = () => {
    if (onRequestAddToCart) {
      onRequestAddToCart(service.id, selectedType, selectedSize);
      onClose();
      return;
    }
    const item = {
      id: `grooming-${service.id}-${Date.now()}`,
      serviceId: service.id,
      category: "grooming" as const,
      petType: selectedType,
      petSize: selectedSize,
      nights: 1,
      quantity: 1,
      addons: [],
      petName: `${selectedType === "dog" ? selectedSize.toUpperCase() + " Dog" : "Cat"}`,
      breed: selectedType === "dog" ? `${selectedSize} breed` : "Cat",
    };
    putBookingItem(item);
    if (onAddedToCart) {
      onAddedToCart(`✓ Added ${service.name} (${money(price)}) to cart!`);
    }
    onClose();
  };

  const imageSrc = groomingImage(service.id, selectedType);

  return (
    <div
      className="ref-modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="package-details-title"
      onClick={onClose}
    >
      <div
        className="ref-details-card"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="ref-details-header">
          <div className="ref-details-image-box">
            <img
              src={imageSrc}
              alt={service.name}
              width="960"
              height="640"
              decoding="async"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = "/images/generated/gentle-bath.webp";
              }}
            />
            <span className="ref-details-tag">{service.label}</span>
          </div>

          <button
            type="button"
            className="ref-modal-close"
            onClick={onClose}
            aria-label="Close details"
          >
            ×
          </button>
        </div>

        {/* Modal Body */}
        <div className="ref-details-body">
          <div className="ref-details-title-row">
            <div>
              <h3 id="package-details-title">{service.name}</h3>
              <p className="ref-details-sub">{service.label}</p>
            </div>
            <div className="ref-details-price-badge">
              <del>{money(original)}</del>
              <strong>{money(price)}</strong>
              <small>Save {money(savings)}</small>
            </div>
          </div>

          <p className="ref-details-desc">{service.description}</p>

          {/* Species & Size Selectors */}
          <div className="ref-details-config">
            <div className="ref-details-species-toggle">
              <button
                type="button"
                className={selectedType === "dog" ? "active" : ""}
                onClick={() => setSelectedType("dog")}
              >
                🐕 Dog
              </button>
              <button
                type="button"
                className={selectedType === "cat" ? "active" : ""}
                onClick={() => setSelectedType("cat")}
              >
                🐈 Cat
              </button>
            </div>

            {selectedType === "dog" && (
              <div className="ref-details-size-selector">
                <span className="ref-details-label">Select Breed Size:</span>
                <div className="ref-details-size-buttons">
                  {(["small", "medium", "large"] as const).map((s) => (
                    <button
                      key={s}
                      type="button"
                      className={selectedSize === s ? "selected" : ""}
                      onClick={() => setSelectedSize(s)}
                    >
                      <span className="capitalize">{s}</span>
                      <small>{money(service.prices[s])}</small>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Inclusions List */}
          <div className="ref-details-inclusions-box">
            <h4>What&apos;s Included:</h4>
            <ul className="ref-details-check-list">
              {service.includes.map((inc) => (
                <li key={inc}>
                  <Icon name="check" size={16} />
                  <span>{inc}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Exclusions or Special Notes */}
          {service.note && (
            <div className="ref-details-note-box">
              <Icon name="sparkle" size={14} />
              <span>{service.note}</span>
            </div>
          )}

          {/* Certified Guarantee */}
          <div className="ref-details-guarantee">
            <span>🛡️ 100% Tearless Organic Shampoos</span>
            <span>✂️ Sanitized Stainless Steel Tools</span>
            <span>📍 Kanakapura Main Rd Studio</span>
          </div>
        </div>

        {/* Modal Footer with Primary CTA */}
        <div className="ref-details-footer">
          <div className="ref-details-total-box">
            <span className="ref-details-total-label">Total for 1 Pet</span>
            <span className="ref-details-total-val">{money(price)}</span>
          </div>
          <button
            type="button"
            className="ref-details-add-btn"
            onClick={handleAddToCart}
          >
            <Icon name="bag" size={17} />
            Add to Cart &amp; Continue
          </button>
        </div>
      </div>
    </div>
  );
}
