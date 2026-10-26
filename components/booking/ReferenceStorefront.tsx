"use client";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  BookingItem,
  PetSize,
  PetType,
  money,
  quoteCart,
  quoteItem,
} from "../../data/catalog";
import { readBookingCart, writeBookingCart } from "../../utils/booking-cart";
import { Icon, useBookingCart } from "./BookingUI";
import LandingHero from "./LandingHero";
import StayStory from "./StayStory";
import CustomizeBooking from "./CustomizeBooking";
import PetPicker from "./PetPicker";
import CompletePriceMenu from "./CompletePriceMenu";
import { priceSize } from "../../data/pet-selection";
import { PRIMARY_GROOMING, packageDetails } from "../../data/package-details";
import { groomingImage } from "../../data/grooming-images";
import UnlockOffersModal from './UnlockOffersModal';
import { trackBookingEvent } from '../../utils/booking-analytics';

export default function ReferenceStorefront({
  page = "home",
}: {
  page?: "home" | "boarding" | "grooming";
}) {
  const [mode, setMode] = useState<"boarding" | "grooming">(
    page === "grooming" ? "grooming" : "boarding",
  );
  const [species, setSpecies] = useState<PetType>("dog");
  const [size, setSize] = useState<PetSize>("small");
  const [breed, setBreed] = useState("Shih Tzu");
  const [catType, setCatType] = useState<"neutered" | "non-neutered">(
    "neutered",
  );
  const [selectionMode,setSelectionMode]=useState<"breed"|"size">("breed");
  const [nights, setNights] = useState(4);
  const [draft, setDraft] = useState<BookingItem | null>(null);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const rail = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ start: true, end: false });
  const { items } = useBookingCart();
  const cart = quoteCart(items);
  const makeItem = (
    serviceId: string,
    category: "boarding" | "grooming",
    petSize?: PetSize,
  ): BookingItem => ({
    id: "preview",
    serviceId,
    category,
    petType: species,
    petSize: petSize ?? (selectionMode === "breed" ? priceSize(breed,category,size) : size),
    selectionMode,
    catType,
    nights: category === "boarding" ? nights : 1,
    quantity: 1,
    addons: [],
    breed,
  });
  const stay = quoteItem(makeItem("boarding", "boarding"));
  const groomSize=makeItem("furry-fresh","grooming").petSize;
  const selection=species === "cat" ? "Cat" : groomSize+" breed";
  function changePet(changes:Partial<BookingItem>){if(changes.petType)setSpecies(changes.petType);if(changes.petSize)setSize(changes.petSize);if(changes.breed!==undefined)setBreed(changes.breed);if(changes.catType)setCatType(changes.catType);if(changes.selectionMode)setSelectionMode(changes.selectionMode);}
  function switchMode(next: "boarding" | "grooming") {
    setMode(next);
    document
      .getElementById(next + "-packages")
      ?.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "instant"
          : "smooth",
      });
  }
  function request(serviceId: string, category: "boarding" | "grooming") {
    setDraft({ ...makeItem(serviceId, category), id: crypto.randomUUID() });
  }
  function confirm(newItems: BookingItem[]) {
    try {
      writeBookingCart([...readBookingCart(), ...newItems]);
      trackBookingEvent('add_to_cart', { services: newItems.length });
      setDraft(null);
      setNotice(
        `${newItems.length > 1 ? "Your services" : quoteItem(newItems[0]).name} added to cart`,
      );
      setError("");
    } catch {
      setError(
        "Your browser couldn’t save your cart. Please try again or call our studio.",
      );
    }
  }
  useEffect(() => {
    if (!notice) return;
    const t = setTimeout(() => setNotice(""), 4500);
    return () => clearTimeout(t);
  }, [notice]);
  useEffect(() => {
    if (page === "home") return;
    document
      .getElementById(page + "-packages")
      ?.scrollIntoView({ behavior: "instant" });
  }, [page]);
  useEffect(() => {
    const el = rail.current;
    if (!el) return;
    const update = () =>
      setEdges({
        start: el.scrollLeft < 2,
        end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 2,
      });
    const observer = new ResizeObserver(update);
    observer.observe(el);
    el.addEventListener("scroll", update, { passive: true });
    update();
    return () => {
      observer.disconnect();
      el.removeEventListener("scroll", update);
    };
  }, []);
  function browse(direction: number) {
    const el = rail.current;
    if (el)
      el.scrollBy({
        left: direction * ((el.children[0] as HTMLElement).offsetWidth + 16),
        behavior: "smooth",
      });
  }
  return (
    <div className="ref-storefront">
      <UnlockOffersModal />
      <LandingHero mode={mode} onMode={switchMode} page={page} />
      <section
        className="ref-container restore-offers"
        id="offers"
        aria-label="Offers and studio rewards"
      >
        <div>
          <Icon name="sparkle" size={20} />
          <strong>A little more love, for less.</strong>
          <span>Online savings + studio rewards</span>
          <button type="button" className="pet-button pet-button-light" onClick={() => window.dispatchEvent(new Event('snip_open_offers'))}>Unlock offers</button>
        </div>
        <div className="restore-offer-rail">
          {[
            ["UPFRONT PRICES", "No price surprises", "Grooming packages from ₹499"],
            ["STAY6FREE1", "1 night free", "Boarding stays of 6+ nights"],
            ["FREESPA", "Free departure spa", "Furry Fresh at 4+ nights"],
            [
              "STAY LONGER",
              "More pampering",
              "Special at 8+ · Full Grooming at 15+",
            ],
          ].map(([code, title, description]) => (
            <a
              href={
                code === "UPFRONT PRICES" ? "#grooming-packages" : "#boarding-packages"
              }
              key={code}
            >
              <small>{code}</small>
              <strong>{title}</strong>
              <span>{description}</span>
            </a>
          ))}
        </div>
      </section>
      {error && (
        <p className="ref-container pet-error" role="alert">
          {error}
        </p>
      )}
      <p className="ref-container restore-counter-reward"><Icon name="sparkle" size={16}/><span><strong>A little treat at the counter:</strong> grooming bills above ₹500 qualify for a free bath or nail-clip reward. Ask the team to redeem it at the studio; this reward is separate from your online total.</span></p>
      <section
        className="ref-container restore-boarding"
        id="boarding-packages"
      >
        <div className="restore-section-heading">
          <div>
            <span className="ref-step ref-step-green">
              A LITTLE HOLIDAY OF THEIR OWN
            </span>
            <h2>Cage-free stays. Care that feels like home.</h2>
            <p>
              Choose your pet, adjust the nights, and see the complete stay
              price.
            </p>
          </div>
        </div>
        <article className="restore-stay-card">
          <div className="restore-stay-photo">
            <img
              src="/images/generated/cosy-boarding.webp"
              width="1200"
              height="800"
              loading="lazy"
              alt="A relaxed beagle on a soft bed in a warm cage-free suite"
            />
            <span>
              <Icon name="home" size={16} />
              Room to stretch. Space to settle.
            </span>
            <div>
              <h3>Cosy nights. Happy mornings.</h3>
              <p>Daily lawn walks, personal care and WhatsApp updates.</p>
            </div>
          </div>
          <div className="restore-stay-config">
            <div className="restore-config-top">
              <div>
                <span className="restore-overline">YOUR PET’S STAY</span>
                <h3>
                  {species === "cat" ? "A cosy cat stay" : "A cosy dog stay"}
                </h3>
              </div>
            </div>
            <PetPicker compact pet={makeItem("boarding","boarding")} onChange={changePet}/>
            <details className="exact-booking-includes"><summary>Everything included in their stay</summary><p>{species === "cat" ? "Private quiet cabin, cozy haven, custom feeding schedules and daily photo updates." : "Private climate-controlled cabin, premium meals, treats, 2 customized walks daily, open lawn play, 24/7 supervision and daily WhatsApp photo updates."}</p></details>
            {species === "cat" && <label className="restore-field exact-cat-type">Cat type<select aria-label="Boarding cat type" value={catType} onChange={e=>setCatType(e.target.value as typeof catType)}><option value="neutered">Neutered / spayed</option><option value="non-neutered">Not neutered</option></select></label>}
            <div className="restore-stay-totals">
              <div>
                <span>Nightly offer price</span>
                <strong>
                  {money(stay.nightly)}
                  <small>/night</small>
                </strong>
                {stay.original > stay.base && <del>{money(stay.original / nights)}</del>}
              </div>
              <div>
                <label htmlFor="stay-nights">How many nights?</label>
                <div className="restore-night-control">
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
                        Math.max(
                          1,
                          Math.min(60, Math.trunc(Number(e.target.value) || 1)),
                        ),
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
                </div>
              </div>
            </div>
            <div className="restore-stay-reward">
              <Icon name="sparkle" size={17} />
              <div>
                {stay.offer && (
                  <strong>1 night free · save {money(stay.discount)}</strong>
                )}
                <span>
                  {stay.perk ||
                    `${4 - nights} more ${4 - nights === 1 ? "night" : "nights"} unlocks a free departure spa`}
                </span>
              </div>
            </div>
            <div className="restore-stay-bottom">
              <div>
                <span>Total for {nights} nights</span>
                <strong>{money(stay.total)}</strong>
              </div>
              <button
                className="ref-button"
                onClick={() => request("boarding", "boarding")}
              >
                <Icon name="bag" size={17} />
                Add stay to cart
                <Icon name="arrow" size={16} />
              </button>
            </div>
            <p className="restore-visit-note">
              Book here. Drop off at our Kanakapura Road studio. Dates chosen at
              checkout.
            </p>
          </div>
        </article>
      </section>
      <section
        className="ref-container ref-packages restore-grooming"
        id="grooming-packages"
      >
        <div className="restore-section-heading">
          <div>
            <span className="ref-step ref-step-gold">
              FRESH COATS. HAPPY TAILS.
            </span>
            <h2>Pick their perfect pamper.</h2>
            <p>
              Book online, visit the studio, and let us take care of the fluff.
            </p>
          </div>
          <div className="ref-rail-controls">
            <span>Swipe to explore</span>
            <button
              aria-label="Previous grooming packages"
              disabled={edges.start}
              onClick={() => browse(-1)}
            >
              ←
            </button>
            <button
              aria-label="Next grooming packages"
              disabled={edges.end}
              onClick={() => browse(1)}
            >
              →
            </button>
          </div>
        </div>
        <div className="restore-groom-filter"><PetPicker pet={makeItem("furry-fresh","grooming")} onChange={changePet}/></div>
        <div
          className="ref-grooming-rail"
          ref={rail}
          tabIndex={0}
          role="region"
          aria-label="Grooming packages, scroll horizontally"
        >
          {PRIMARY_GROOMING.map((baseService, index) => {
            const service=packageDetails(baseService.id,species);
            const price = quoteItem(makeItem(service.id, "grooming"));
            return (
              <article
                key={service.id}
                className={`ref-groom-card ${index === 1 ? "ref-recommended" : ""}`}
              >
                {index === 1 && (
                  <span className="ref-popular">
                    <Icon name="sparkle" size={12} />A little extra love
                  </span>
                )}
                <div className="ref-groom-image">
                  <img
                    src={groomingImage(service.id, species)}
                    loading="lazy"
                    decoding="async"
                    width="960"
                    height="640"
                    alt={`${service.name} for ${species === "cat" ? "cats" : "dogs"}`}
                  />
                  <span>
                    {index === 4
                      ? "Under 6 months"
                      : index === 5
                        ? "Coat care"
                        : "In-studio grooming"}
                  </span>
                </div>
                <h3>{service.name}</h3>
                <p className="ref-groom-subtitle">{service.label}</p>
                <div className="ref-groom-price">
                  <strong>{money(price.total)}</strong>
                  <del>{money(price.original)}</del>
                </div>
                <p className="restore-price-for">
                  {selection}
                  {" · Listed package price"}
                </p>
                <ul>
                  {service.includes.slice(0, 3).map((text) => (
                    <li key={text}>
                      <Icon name="check" size={13} />
                      {text}
                    </li>
                  ))}
                </ul>
                <details className="restore-details">
                  <summary>
                    Everything included <span>+</span>
                  </summary>
                  <ul>
                    {service.includes.slice(3).map((text) => (
                      <li key={text}>
                        <Icon name="check" size={13} />
                        {text}
                      </li>
                    ))}
                  </ul>
                  <p>{service.note}</p>
                </details>
                <button
                  className="ref-button restore-package-add"
                  onClick={() => request(service.id, "grooming")}
                >
                  <Icon name="bag" size={16} />
                  Add to cart
                  <Icon name="arrow" size={16} />
                </button>
              </article>
            );
          })}
        </div>
        <p className="ref-pricing-note">
          Confirm breed, weight and optional extras before anything is added.
          Arrival dates are selected at checkout.
        </p>
      </section>
      <CompletePriceMenu pet={makeItem("furry-fresh","grooming")} onRequest={setDraft}/>
      <StayStory />
      <section className="ref-container ref-support">
        <div className="ref-trust-grid">
          {[
            ["home", "100% cage-free", "Space to rest and room to play."],
            [
              "phone",
              "WhatsApp updates",
              "A little hello from your best friend.",
            ],
            [
              "heart",
              "Personal care",
              "Their food, preferences and familiar routine.",
            ],
            ["pin", "Visit our studio", "Kanakapura Main Road, Bengaluru."],
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
              COME SAY HELLO
            </span>
            <h2>Your neighbourhood pet happy place.</h2>
            <p>
              Site no. 61, beside Shani Mahatma Temple, Kanakapura Main Road,
              Bengaluru 560082.
            </p>
            <span className="ref-opening">
              <i />
              Every day · 9:30 AM–8:30 PM
            </span>
            <div className="ref-location-actions">
              <a
                className="ref-button"
                href="https://maps.app.goo.gl/MqFTrZiLPbttv3eD6"
                target="_blank"
                rel="noreferrer"
              >
                Get directions
                <Icon name="arrow" size={16} />
              </a>
              <a
                className="ref-button ref-button-muted"
                href="https://wa.me/919739887770"
                target="_blank"
                rel="noreferrer"
              >
                Chat with us
              </a>
            </div>
          </div>
          <a
            href="https://maps.app.goo.gl/MqFTrZiLPbttv3eD6"
            className="restore-studio-link"
            target="_blank"
            rel="noreferrer"
          >
            <Icon name="pin" size={38} />
            <strong>Snip &amp; Style</strong>
            <span>Kanakapura Main Road</span>
            <small>Open in Google Maps ↗</small>
          </a>
        </div>
      </section>
      <section className="ref-container ref-faq" id="faq">
        <div className="restore-section-heading">
          <div>
            <span className="ref-step ref-step-green">
              BEFORE THE HAPPY TAILS
            </span>
            <h2>A few things you might be wondering.</h2>
          </div>
        </div>
        {[
          [
            "How do the offers work?",
            "Package and bundle prices are exactly as listed. STAY6FREE1 makes one night free on stays of six nights or more. Departure spa rewards apply at 4, 8 and 15 nights. Your price updates automatically.",
          ],
          [
            "What should I bring for boarding?",
            "Bring your pet’s vaccination record, usual food, medication instructions and a favourite toy or blanket. Call us before booking special care.",
          ],
          [
            "Where does the grooming happen?",
            "At our Kanakapura Main Road studio. Book and pay here, select your arrival date at checkout, and bring your pet to the studio. Transport can be discussed separately with our team.",
          ],
          [
            "Do I need an account?",
            "No. You can check out as a guest. Save your booking reference after payment verification.",
          ],
          [
            "Can I change my visit?",
            "Call +91 97398 87770 with your booking reference. The team will help according to the booking terms.",
          ],
        ].map(([q, a]) => (
          <details key={q}>
            <summary>
              {q}
              <span>+</span>
            </summary>
            <p>{a}</p>
          </details>
        ))}
      </section>
      <p className="ref-image-note ref-container">
        Pet imagery is illustrative. Visit the studio and meet the team before
        your pet’s stay.
      </p>
      {notice && (
        <div className="ref-added-status" role="status">
          <Icon name="check" size={17} />
          {notice}
          <Link href="/cart">View cart →</Link>
          <button
            aria-label="Dismiss notification"
            onClick={() => setNotice("")}
          >
            ×
          </button>
        </div>
      )}
      {items.length > 0 && (
        <aside
          className="ref-floating-cart"
          aria-label="Your selected services"
        >
          <span>{cart.count}</span>
          <div>
            <strong>
              {cart.count === 1
                ? quoteItem(items[0]).name
                : `${cart.count} pet services`}
            </strong>
            <small>{money(cart.total)}</small>
          </div>
          <Link href="/cart">
            View cart
            <Icon name="arrow" size={17} />
          </Link>
        </aside>
      )}
      {draft && (
        <CustomizeBooking
          key={draft.id}
          item={draft}
          onClose={() => setDraft(null)}
          onConfirm={confirm}
        />
      )}
    </div>
  );
}
