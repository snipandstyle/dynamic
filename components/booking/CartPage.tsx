"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ADDONS,
  BookingItem,
  money,
  quoteCart,
  SIZE_LABELS,
  includedAddonIds,
} from "../../data/catalog";
import { writeBookingCart } from "../../utils/booking-cart";
import { BookingShell, Icon, OrderSummary, useBookingCart } from "./BookingUI";
import BreedConfirmModal from "./BreedConfirmModal";

export default function CartPage() {
  const router = useRouter();
  const { items, ready } = useBookingCart();
  const [error, setError] = useState("");
  const [showBreedModal, setShowBreedModal] = useState(false);
  function update(id: string, changes: Partial<BookingItem>) {
    try {
      writeBookingCart(
        items.map((item) => (item.id === id ? { ...item, ...changes } : item)),
      );
      setError("");
    } catch {
      setError(
        "We couldn’t save this change. Please allow site storage and try again.",
      );
    }
  }
  return (
    <BookingShell minimal>
      <div className="pet-container pet-flow-page">
        <Link className="pet-back-link" href="/grooming">
          ← Keep exploring
        </Link>
        <div className="pet-flow-heading">
          <span className="pet-eyebrow">
            A LITTLE SOMETHING FOR YOUR BEST FRIEND
          </span>
          <h1>
            Your cart<span className="pet-heading-dot">.</span>
          </h1>
          <p>Looking good. Let’s make their visit a little more special.</p>
        </div>
        {!ready ? (
          <p role="status">Getting your cart ready…</p>
        ) : !items.length ? (
          <div className="pet-empty">
            <span className="pet-empty-icon">
              <Icon name="bag" size={45} />
            </span>
            <h2>A little empty. Full of possibilities.</h2>
            <p>
              Find the perfect groom or plan a cosy stay for your best friend.
            </p>
            <div className="pet-hero-buttons">
              <Link href="/grooming" className="pet-button">
                Explore grooming
                <Icon name="arrow" size={18} />
              </Link>
              <Link href="/boarding" className="pet-button pet-button-light">
                Plan a stay
              </Link>
            </div>
          </div>
        ) : (
          <div className="pet-checkout-grid">
            <div className="pet-cart-items">
              {error && (
                <p className="pet-error" role="alert">
                  {error}
                </p>
              )}
              {quoteCart(items).lines.map((line) => (
                <article className="pet-cart-card" key={line.item.id}>
                  <div className="pet-cart-card-head">
                    <span className="pet-service-icon">
                      <Icon
                        name={
                          line.item.category === "boarding"
                            ? "home"
                            : "scissors"
                        }
                        size={25}
                      />
                    </span>
                    <div>
                      <small>
                        {line.item.category === "boarding"
                          ? "A cosy stay"
                          : "Studio grooming"}
                      </small>
                      <h2>{line.name}</h2>
                    </div>
                    <div className="pet-cart-line-price">
                      <strong>{money(line.total)}</strong>
                      <del>
                        {money(
                          line.original * line.item.quantity +
                            line.extras * line.item.quantity,
                        )}
                      </del>
                    </div>
                  </div>
                  <div className="pet-cart-edit-grid">
                    <label>
                      Pet
                      <select
                        value={line.item.petType}
                        onChange={(e) =>
                          update(line.item.id, {
                            petType: e.target.value as BookingItem["petType"],
                          })
                        }
                      >
                        <option value="dog">Dog</option>
                        <option value="cat">Cat</option>
                      </select>
                    </label>
                    {line.item.petType === "dog" ? (
                      <label>
                        Weight
                        <select
                          value={line.item.petSize}
                          onChange={(e) =>
                            update(line.item.id, {
                              petSize: e.target.value as BookingItem["petSize"],
                            })
                          }
                        >
                          {Object.entries(SIZE_LABELS).map(([key, label]) => (
                            <option key={key} value={key}>
                              {label}
                            </option>
                          ))}
                        </select>
                      </label>
                    ) : line.item.category === "boarding" ? (
                      <label>
                        Cat boarding type
                        <select
                          value={line.item.catType || "neutered"}
                          onChange={(e) =>
                            update(line.item.id, {
                              catType: e.target.value as BookingItem["catType"],
                            })
                          }
                        >
                          <option value="neutered">Neutered / spayed</option>
                          <option value="non-neutered">Not neutered</option>
                        </select>
                      </label>
                    ) : (
                      <div />
                    )}
                    {line.item.category === "boarding" && (
                      <label>
                        Nights
                        <input
                          type="number"
                          min="1"
                          max="60"
                          value={line.item.nights}
                          onChange={(e) =>
                            update(line.item.id, {
                              nights: Math.max(
                                1,
                                Math.min(60, Number(e.target.value) || 1),
                              ),
                            })
                          }
                        />
                      </label>
                    )}
                  </div>
                  {line.discount > 0 && (
                    <p className="pet-perk">
                      <Icon name="sparkle" size={16} />
                      {line.offer === "GROOM10"
                        ? "10% festival offer"
                        : "1 night free"}{" "}
                      · saving {money(line.discount * line.item.quantity)}
                    </p>
                  )}
                  {line.perk && (
                    <p className="pet-perk">
                      <Icon name="check" size={16} />
                      {line.perk}
                    </p>
                  )}
                  {line.item.category === "grooming" && (
                    <details className="pet-cart-extras">
                      <summary>
                        Make it their own <span>Optional extras +</span>
                      </summary>
                      <p className="pet-small pet-muted">
                        Choose only extras not already included in your package.
                        Prices are per pet.
                      </p>
                      <div>
                        {ADDONS.map((addon) => (
                          <label key={addon.id} className="pet-extra-check">
                            <input
                              type="checkbox"
                              disabled={includedAddonIds(
                                line.item.serviceId,
                              ).includes(addon.id)}
                              checked={line.item.addons.includes(addon.id)}
                              onChange={(e) =>
                                update(line.item.id, {
                                  addons: e.target.checked
                                    ? [...line.item.addons, addon.id]
                                    : line.item.addons.filter(
                                        (id) => id !== addon.id,
                                      ),
                                })
                              }
                            />
                            <span>{addon.name}</span>
                            <b>
                              {includedAddonIds(line.item.serviceId).includes(
                                addon.id,
                              )
                                ? "Included"
                                : `+${money(addon.price)}`}
                            </b>
                          </label>
                        ))}
                      </div>
                    </details>
                  )}
                  <div className="pet-cart-card-bottom">
                    <div className="pet-quantity">
                      <span>Pets</span>
                      <button
                        aria-label={`Fewer pets for ${line.name}`}
                        disabled={line.item.quantity <= 1}
                        onClick={() =>
                          update(line.item.id, {
                            quantity: line.item.quantity - 1,
                          })
                        }
                      >
                        −
                      </button>
                      <span aria-live="polite">{line.item.quantity}</span>
                      <button
                        aria-label={`More pets for ${line.name}`}
                        disabled={line.item.quantity >= 5}
                        onClick={() =>
                          update(line.item.id, {
                            quantity: line.item.quantity + 1,
                          })
                        }
                      >
                        +
                      </button>
                    </div>
                    <button
                      className="pet-remove"
                      onClick={() => {
                        try {
                          writeBookingCart(
                            items.filter((i) => i.id !== line.item.id),
                          );
                        } catch {
                          setError(
                            "Could not remove this service. Please try again.",
                          );
                        }
                      }}
                      aria-label={`Remove ${line.name}`}
                    >
                      Remove
                    </button>
                  </div>
                </article>
              ))}
              <div className="pet-cart-reassurance">
                <Icon name="heart" />
                <p>
                  Anything we should know?
                  <br />
                  <span>
                    You can tell us about your pet’s needs at checkout.
                  </span>
                </p>
              </div>
              <Link className="pet-text-link" href="/grooming">
                + Add another grooming service
              </Link>
              <Link className="pet-text-link pet-more-stay" href="/boarding">
                + Add a boarding stay
              </Link>
            </div>
            <OrderSummary items={items}>
              <button
                type="button"
                onClick={() => setShowBreedModal(true)}
                className="pet-button pet-full"
              >
                Continue to checkout
                <Icon name="arrow" size={18} />
              </button>
              <p className="pet-small pet-muted pet-centered">
                No account needed. Just a few details.
              </p>
            </OrderSummary>
          </div>
        )}
        {ready && items.length > 0 && (
          <div className="pet-mobile-checkout">
            <div>
              <small>{quoteCart(items).count} pet services</small>
              <strong>{money(quoteCart(items).total)}</strong>
            </div>
            <button
              type="button"
              onClick={() => setShowBreedModal(true)}
              className="pet-button"
            >
              Checkout
              <Icon name="arrow" size={18} />
            </button>
          </div>
        )}
      </div>

      {/* Breed & Size Confirmation Modal before proceeding to checkout */}
      {showBreedModal && (
        <BreedConfirmModal
          isOpen={showBreedModal}
          onClose={() => setShowBreedModal(false)}
          items={items}
          onConfirm={(confirmedItems) => {
            writeBookingCart(confirmedItems);
            setShowBreedModal(false);
            router.push("/checkout");
          }}
        />
      )}
    </BookingShell>
  );
}
