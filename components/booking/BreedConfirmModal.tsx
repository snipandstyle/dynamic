"use client";

import React, { useState } from "react";
import { BookingItem, PetSize, money, quoteItem } from "../../data/catalog";
import { Icon } from "./BookingUI";

interface BreedConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: BookingItem[];
  onConfirm: (confirmedItems: BookingItem[]) => void;
}

const DOG_BREEDS = [
  { name: "Shih Tzu", size: "small" as PetSize },
  { name: "Pug", size: "small" as PetSize },
  { name: "Maltese", size: "small" as PetSize },
  { name: "Pomeranian", size: "small" as PetSize },
  { name: "French Bulldog", size: "small" as PetSize },
  { name: "Beagle", size: "medium" as PetSize },
  { name: "Indie / Desi Dog", size: "medium" as PetSize },
  { name: "Cocker Spaniel", size: "medium" as PetSize },
  { name: "Corgi", size: "medium" as PetSize },
  { name: "Golden Retriever", size: "large" as PetSize },
  { name: "Labrador Retriever", size: "large" as PetSize },
  { name: "German Shepherd", size: "large" as PetSize },
  { name: "Siberian Husky", size: "large" as PetSize },
  { name: "Rottweiler", size: "large" as PetSize },
  { name: "Other Breed", size: "medium" as PetSize },
];

const CAT_BREEDS = [
  "Indie Cat",
  "Persian Cat",
  "British Shorthair",
  "Siamese",
  "Maine Coon",
  "Bengal Cat",
  "Other Cat Breed",
];

export default function BreedConfirmModal({
  isOpen,
  onClose,
  items,
  onConfirm,
}: BreedConfirmModalProps) {
  const [localItems, setLocalItems] = useState<BookingItem[]>(items);

  React.useEffect(() => {
    setLocalItems(items);
  }, [items, isOpen]);

  if (!isOpen) return null;

  const updateItem = (id: string, updates: Partial<BookingItem>) => {
    setLocalItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, ...updates } : it))
    );
  };

  const handleConfirm = () => {
    onConfirm(localItems);
  };

  return (
    <div
      className="ref-modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="breed-confirm-title"
      onClick={onClose}
    >
      <div
        className="ref-breed-modal-card"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="ref-breed-modal-header">
          <div className="flex items-center gap-2.5">
            <span className="size-9 rounded-xl bg-emerald-100 text-emerald-900 flex items-center justify-center text-lg">
              🐾
            </span>
            <div>
              <h3 id="breed-confirm-title" className="text-lg font-black text-[#142b20] leading-tight">
                Please Confirm Your Pet&apos;s Breed &amp; Size
              </h3>
              <p className="text-xs text-[#555e54] font-medium mt-0.5">
                Ensure the right suite, sanitized tools, and personalized care for your companion.
              </p>
            </div>
          </div>
          <button
            type="button"
            className="ref-modal-close"
            onClick={onClose}
            aria-label="Close breed confirmation"
          >
            ×
          </button>
        </div>

        {/* Pet List */}
        <div className="ref-breed-modal-body">
          {localItems.map((item, index) => {
            const isDog = item.petType === "dog";
            const quoted = quoteItem(item);

            return (
              <div key={item.id} className="ref-breed-item-box">
                <div className="flex items-center justify-between border-b border-black/5 pb-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black text-sanctuary-forest">
                      {index + 1}. {quoted.name}
                    </span>
                    <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      {isDog ? "🐕 Dog" : "🐈 Cat"}
                    </span>
                  </div>
                  <strong className="text-sm font-black text-[#142b20]">
                    {money(quoted.total)}
                  </strong>
                </div>

                {isDog ? (
                  <div className="space-y-3">
                    {/* Dog Breed Selection */}
                    <div>
                      <label className="text-[11px] font-black uppercase tracking-wider text-[#424844] block mb-1.5">
                        Select Breed:
                      </label>
                      <select
                        value={item.breed || "Shih Tzu"}
                        onChange={(e) => {
                          const selected = DOG_BREEDS.find((b) => b.name === e.target.value);
                          updateItem(item.id, {
                            breed: e.target.value,
                            petSize: selected ? selected.size : item.petSize,
                          });
                        }}
                        className="w-full p-2.5 bg-white border border-[#dfdacd] rounded-xl text-xs font-bold text-[#142b20] focus:outline-none focus:ring-2 focus:ring-[#142b20]"
                      >
                        {DOG_BREEDS.map((b) => (
                          <option key={b.name} value={b.name}>
                            {b.name} ({b.size.toUpperCase()} BREED)
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Dog Size Selection */}
                    <div>
                      <label className="text-[11px] font-black uppercase tracking-wider text-[#424844] block mb-1.5">
                        Confirm Breed Size / Weight Category:
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { id: "small" as PetSize, name: "Small", weight: "< 10 kg" },
                          { id: "medium" as PetSize, name: "Medium", weight: "10 – 25 kg" },
                          { id: "large" as PetSize, name: "Large", weight: "> 25 kg" },
                        ].map((s) => (
                          <button
                            type="button"
                            key={s.id}
                            onClick={() => updateItem(item.id, { petSize: s.id })}
                            className={`p-2.5 rounded-xl border text-center transition-all ${
                              item.petSize === s.id
                                ? "bg-[#142b20] text-white border-[#142b20] font-black shadow-xs"
                                : "bg-white text-[#142b20] border-[#dfdacd] hover:border-[#142b20] font-bold"
                            }`}
                          >
                            <div className="text-xs">{s.name}</div>
                            <div className={`text-[10px] ${item.petSize === s.id ? "text-[#fed65b]" : "text-[#667065]"}`}>
                              {s.weight}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {/* Cat Breed & Type */}
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[11px] font-black uppercase tracking-wider text-[#424844] block mb-1.5">
                          Cat Breed:
                        </label>
                        <select
                          value={item.breed || "Indie Cat"}
                          onChange={(e) => updateItem(item.id, { breed: e.target.value })}
                          className="w-full p-2.5 bg-white border border-[#dfdacd] rounded-xl text-xs font-bold text-[#142b20] focus:outline-none focus:ring-2 focus:ring-[#142b20]"
                        >
                          {CAT_BREEDS.map((name) => (
                            <option key={name} value={name}>
                              {name}
                            </option>
                          ))}
                        </select>
                      </div>

                      {item.category === "boarding" && (
                        <div>
                          <label className="text-[11px] font-black uppercase tracking-wider text-[#424844] block mb-1.5">
                            Boarding Enclosure:
                          </label>
                          <select
                            value={item.catType || "neutered"}
                            onChange={(e) =>
                              updateItem(item.id, {
                                catType: e.target.value as "neutered" | "non-neutered",
                              })
                            }
                            className="w-full p-2.5 bg-white border border-[#dfdacd] rounded-xl text-xs font-bold text-[#142b20] focus:outline-none focus:ring-2 focus:ring-[#142b20]"
                          >
                            <option value="neutered">Neutered / Spayed (₹625)</option>
                            <option value="non-neutered">Non-Neutered (₹750)</option>
                          </select>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="ref-breed-modal-footer">
          <button
            type="button"
            onClick={onClose}
            className="py-2.5 px-4 rounded-xl text-xs font-bold text-[#555e54] hover:bg-black/5 transition-colors"
          >
            ← Back to Cart
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="py-3 px-6 bg-[#142b20] hover:bg-black text-[#fed65b] rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 shadow-md hover:shadow-lg"
          >
            <span>Looks Good — Proceed to Checkout</span>
            <Icon name="arrow" size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
