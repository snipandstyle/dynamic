"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  BookingItem,
  GROOMING,
  money,
  PetSize,
  PetType,
  quoteItem,
  SIZE_LABELS,
} from "../../data/catalog";
import { putBookingItem } from "../../utils/booking-cart";
import { Icon } from "./BookingUI";

export default function ServiceMenu({
  boarding = false,
}: {
  boarding?: boolean;
}) {
  const [petType, setPetType] = useState<PetType>("dog");
  const [petSize, setPetSize] = useState<PetSize>("small");
  const [catType, setCatType] = useState<"neutered" | "non-neutered">(
    "neutered",
  );
  const [nights, setNights] = useState(4);
  const [added, setAdded] = useState("");
  const [error, setError] = useState("");
  const track = useRef<HTMLDivElement>(null);
  const [activeCard, setActiveCard] = useState(0);
  const [canPrevious, setCanPrevious] = useState(false);
  const [canNext, setCanNext] = useState(true);
  const measureRail = useCallback(() => {
    const rail = track.current;
    if (!rail) return;
    const cards = Array.from(rail.children) as HTMLElement[];
    if (!cards.length) return;
    setActiveCard(
      cards.reduce(
        (best, card, index) =>
          Math.abs(card.offsetLeft - rail.scrollLeft) <
          Math.abs(cards[best].offsetLeft - rail.scrollLeft)
            ? index
            : best,
        0,
      ),
    );
    setCanPrevious(rail.scrollLeft > 3);
    setCanNext(rail.scrollLeft < rail.scrollWidth - rail.clientWidth - 3);
  }, []);
  useEffect(() => {
    const rail = track.current;
    if (!rail) return;
    const observer = new ResizeObserver(measureRail);
    observer.observe(rail);
    measureRail();
    return () => observer.disconnect();
  }, [measureRail, boarding]);
  function showCard(index: number) {
    const rail = track.current;
    const card = rail?.children[index] as HTMLElement | undefined;
    if (rail && card)
      rail.scrollTo({
        left: card.offsetLeft,
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "instant"
          : "smooth",
      });
  }
  const makeItem = (serviceId: string): BookingItem => ({
    id: crypto.randomUUID(),
    serviceId,
    category: boarding ? "boarding" : "grooming",
    petType,
    petSize,
    catType,
    nights: boarding ? nights : 1,
    quantity: 1,
    addons: [],
  });
  function add(serviceId: string) {
    try {
      putBookingItem(makeItem(serviceId));
      setAdded(serviceId);
      setError("");
    } catch {
      setError(
        "Your browser could not save the cart. Please allow site storage or call us to book.",
      );
    }
  }
  const boardingQuote = quoteItem({
    id: "preview",
    serviceId: "boarding",
    category: "boarding",
    petType,
    petSize,
    catType,
    nights,
    quantity: 1,
    addons: [],
  });
  return (
    <section className="pet-menu-section" id="services">
      <div className="pet-container">
        <div className="pet-section-heading">
          <div>
            <span className="pet-eyebrow">
              {boarding ? "A home away from home" : "THE GROOMING MENU"}
            </span>
            <h2>
              {boarding ? "Boarding rates & stay planner" : "Grooming packages"}
            </h2>
            <p>
              {boarding
                ? "Choose your pet and stay length. Your rate and free perks are right here."
                : "Choose your pet & weight. Compare packages at their offer price."}
            </p>
          </div>
          {!boarding && (
            <span className="pet-handwritten">Fresh looks, happy pets ↘</span>
          )}
        </div>
        <div className="pet-pet-selector">
          <div>
            <span className="pet-field-title">Who’s coming in?</span>
            <div className="pet-segment" role="group" aria-label="Pet species">
              <button
                aria-pressed={petType === "dog"}
                onClick={() => {
                  setPetType("dog");
                  setAdded("");
                }}
              >
                🐶 Dog
              </button>
              <button
                aria-pressed={petType === "cat"}
                onClick={() => {
                  setPetType("cat");
                  setAdded("");
                }}
              >
                🐱 Cat
              </button>
            </div>
          </div>
          <div className="pet-selector-size">
            <span className="pet-field-title">
              {petType === "dog"
                ? "Select their weight"
                : boarding
                  ? "Cat boarding type"
                  : "All cat breeds welcome"}
            </span>
            {petType === "dog" ? (
              <div
                className="pet-segment pet-size-segment"
                role="group"
                aria-label="Pet weight"
              >
                {Object.entries(SIZE_LABELS).map(([value, label]) => (
                  <button
                    key={value}
                    aria-pressed={petSize === value}
                    onClick={() => {
                      setPetSize(value as PetSize);
                      setAdded("");
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            ) : boarding ? (
              <div
                className="pet-segment"
                role="group"
                aria-label="Cat boarding type"
              >
                <button
                  aria-pressed={catType === "neutered"}
                  onClick={() => setCatType("neutered")}
                >
                  Neutered / spayed
                </button>
                <button
                  aria-pressed={catType === "non-neutered"}
                  onClick={() => setCatType("non-neutered")}
                >
                  Not neutered
                </button>
              </div>
            ) : (
              <p className="pet-muted">
                Cat prices are shown below. No size selection needed.
              </p>
            )}
          </div>
        </div>
        {error && (
          <p className="pet-error" role="alert">
            {error}
          </p>
        )}
        {boarding ? (
          <div className="pet-boarding-grid">
            <div className="pet-boarding-photo">
              <img
                src="/images/clean_dog_boarding.jpg"
                alt="A dog relaxing in a bright pet boarding space"
              />
              <div className="pet-photo-caption">
                <Icon name="heart" />
                Room to settle in. Space to be themselves.
              </div>
            </div>
            <div className="pet-boarding-book">
              <span className="pet-eyebrow">CAGE-FREE BOARDING</span>
              <h3>A comfortable stay, with care built in.</h3>
              <ul className="pet-inclusions">
                {[
                  "Comfortable bedding & a private space",
                  "Daily walks and interactive play",
                  "Photo & video updates on WhatsApp",
                  "Meals served to your pet’s routine",
                ].map((text) => (
                  <li key={text}>
                    <Icon name="check" size={17} />
                    {text}
                  </li>
                ))}
              </ul>
              <label className="pet-field-title" htmlFor="stay-nights">
                How many nights?
              </label>
              <div className="pet-night-picker">
                <button
                  aria-label="One fewer night"
                  disabled={nights <= 1}
                  onClick={() => setNights((n) => n - 1)}
                >
                  −
                </button>
                <input
                  id="stay-nights"
                  type="number"
                  min="1"
                  max="60"
                  value={nights}
                  onChange={(e) =>
                    setNights(
                      Math.max(1, Math.min(60, Number(e.target.value) || 1)),
                    )
                  }
                />
                <button
                  aria-label="One more night"
                  disabled={nights >= 60}
                  onClick={() => setNights((n) => n + 1)}
                >
                  +
                </button>
                <span>{money(boardingQuote.nightly)} / night</span>
              </div>
              <div className="pet-boarding-price">
                <div>
                  <small>Total for {nights} nights</small>
                  <strong>{money(boardingQuote.total)}</strong>
                </div>
                <span>
                  {boardingQuote.discount
                    ? "1 night free · automatically applied"
                    : nights < 6
                      ? `${6 - nights} more night${6 - nights === 1 ? "" : "s"} unlocks 1 night free`
                      : ""}
                </span>
              </div>
              {boardingQuote.perk && (
                <p className="pet-perk">
                  <Icon name="sparkle" size={17} />
                  {boardingQuote.perk}
                </p>
              )}
              <button className="pet-button" onClick={() => add("boarding")}>
                {added === "boarding"
                  ? "Stay added to cart"
                  : "Add stay to cart"}
                <Icon
                  name={added === "boarding" ? "check" : "arrow"}
                  size={18}
                />
              </button>
              <p className="pet-muted pet-small">
                Select your check-in date at checkout. Bring your pet’s
                vaccination record.
              </p>
            </div>
          </div>
        ) : (
          <div className="pet-package-browser">
            <div className="pet-package-controls">
              <span>
                <b>{GROOMING.length} packages</b>
                <span className="pet-swipe-hint">
                  {" "}
                  · Swipe right to explore →
                </span>
              </span>
              <div>
                <button
                  aria-label="Previous grooming package"
                  disabled={!canPrevious}
                  onClick={() => showCard(activeCard - 1)}
                >
                  ←
                </button>
                <span aria-live="polite">
                  {activeCard + 1} / {GROOMING.length}
                </span>
                <button
                  aria-label="Next grooming package"
                  disabled={!canNext}
                  onClick={() => showCard(activeCard + 1)}
                >
                  →
                </button>
              </div>
            </div>
            <div
              className="pet-service-grid"
              ref={track}
              tabIndex={0}
              role="region"
              aria-label="Grooming packages, scroll horizontally"
              onScroll={measureRail}
            >
              {GROOMING.map((service, index) => {
                const tier = petType === "cat" ? "cat" : petSize;
                const price = service.prices[tier];
                const discount = price > 999 ? Math.round(price * 0.1) : 0;
                return (
                  <article
                    className={`pet-service-card ${index === 1 ? "pet-featured" : ""}`}
                    key={service.id}
                  >
                    <div className="pet-card-top">
                      <span className={`pet-service-icon pet-tint-${index}`}>
                        <Icon name={service.icon} size={25} />
                      </span>
                      {index === 1 ? (
                        <span className="pet-card-tag">Everyday favourite</span>
                      ) : (
                        <span className="pet-card-category">
                          Save{" "}
                          {money(service.originals[tier] - price + discount)}
                        </span>
                      )}
                    </div>
                    <div className="pet-service-title">
                      <span>{service.label}</span>
                      <h3>{service.name}</h3>
                      <p>{service.description}</p>
                    </div>
                    <div className="pet-service-price">
                      <strong>{money(price - discount)}</strong>
                      <del>{money(service.originals[tier])}</del>
                      <span>/ pet</span>
                    </div>
                    {discount > 0 && (
                      <div className="pet-auto-offer">
                        Includes extra 10% festival savings · GROOM10
                      </div>
                    )}
                    <ul className="pet-inclusions">
                      {service.includes.map((text) => (
                        <li key={text}>
                          <Icon name="check" size={16} />
                          {text}
                        </li>
                      ))}
                    </ul>
                    <details className="pet-package-details">
                      <summary>
                        Package details <span>+</span>
                      </summary>
                      <p>{service.description}</p>
                      <p>{service.note}</p>
                    </details>
                    <button
                      className={`pet-button ${index === 1 ? "" : "pet-button-light"}`}
                      onClick={() => add(service.id)}
                    >
                      {added === service.id ? "Added to cart" : "Add to cart"}
                      <Icon
                        name={added === service.id ? "check" : "arrow"}
                        size={18}
                      />
                    </button>
                  </article>
                );
              })}
            </div>
            <div
              className="pet-package-dots"
              aria-label="Choose a grooming package"
            >
              {GROOMING.map((service, index) => (
                <button
                  key={service.id}
                  aria-label={`Show ${service.name}`}
                  aria-pressed={activeCard === index}
                  onClick={() => showCard(index)}
                />
              ))}
            </div>
          </div>
        )}
        {added && (
          <div className="pet-added-notice" role="status">
            <div>
              <Icon name="check" />
              <span>
                {boarding
                  ? "Your stay"
                  : GROOMING.find((s) => s.id === added)?.name}{" "}
                is in your cart.
              </span>
            </div>
            <Link href="/cart" className="pet-button">
              View cart & continue
              <Icon name="arrow" size={18} />
            </Link>
          </div>
        )}
        <p className="pet-menu-footnote">
          {boarding
            ? "Stay offers: 6+ nights include one free night. 4+, 8+, and 15+ nights include the corresponding departure spa perk."
            : "Prices shown include applicable festival offers. Choose optional extras in your cart. Services take place at our Kanakapura Road studio."}
        </p>
      </div>
    </section>
  );
}
