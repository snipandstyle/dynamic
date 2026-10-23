"use client";
import React from "react";
import { Icon } from "./BookingUI";

export default function LandingHero({
  mode,
  onMode,
  page,
}: {
  mode: "boarding" | "grooming";
  onMode: (mode: "boarding" | "grooming") => void;
  page: "home" | "boarding" | "grooming";
}) {
  function scrollToGrooming() {
    onMode("grooming");
    const el = document.getElementById("grooming-packages");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  }

  function scrollToBoarding() {
    onMode("boarding");
    const el = document.getElementById("boarding-packages");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  }

  return (
    <section className="landing-hero ref-container">
      <div className="landing-copy">
        <h1>
          {page === "grooming" ? (
            <>
              Fresh fluff.
              <br />
              Big <em>happy energy.</em>
            </>
          ) : page === "boarding" ? (
            <>
              Their little holiday.
              <br />
              Your <em>peace of mind.</em>
            </>
          ) : (
            <>
              Their happy place.
              <br />
              Your <em>peace of mind.</em>
            </>
          )}
        </h1>
        <p className="exact-hero-subtitle">Bangalore’s #1 cage-free boarding &amp; pet grooming studio</p>
        <p>
          Good hair days. Cosy sleepovers. A whole lot of love. Book online,
          visit our Kanakapura Main Road studio, and let the happy tails begin.
        </p>

        {/* Studio Visit 3-Step Pill */}
        <div className="landing-workflow-pill">
          <span>Book online</span>
          <em>→</em>
          <span>Visit the studio</span>
          <em>→</em>
          <span>Happy, pampered pet</span>
        </div>

        <div className="landing-actions">
          <button className="ref-button" onClick={scrollToGrooming}>
            <Icon name="scissors" size={18} />
            Book a grooming
            <Icon name="arrow" size={17} />
          </button>
          <button
            className="ref-button ref-button-muted"
            onClick={scrollToBoarding}
          >
            <Icon name="home" size={18} />
            Plan a stay
          </button>
        </div>

        <div className="landing-promises">
          <span>
            <Icon name="check" size={15} />
            100% Zero Wire Cages
          </span>
          <span>
            <Icon name="check" size={15} />
            Daily WhatsApp Videos
          </span>
          <span>
            <Icon name="check" size={15} />
            Upfront offer prices
          </span>
          <span>
            <Icon name="check" size={15} />
            Open 7 Days
          </span>
        </div>

        <a
          href="#offers"
          onClick={(e) => {
            e.preventDefault();
            document
              .getElementById("offers")
              ?.scrollIntoView({ behavior: "smooth" });
          }}
          className="landing-offer"
        >
          <span>
            <Icon name="sparkle" size={18} />
          </span>
          <div>
            <strong>A little extra pampering, on us.</strong>
            <p>
              Exact upfront grooming prices · 1 night free on 6+ nights
              (STAY6FREE1) · Free Spa Bath (FREESPA)
            </p>
          </div>
          <Icon name="arrow" size={18} />
        </a>
      </div>

      <div className="landing-visual">
        <div className="landing-photo">
          <img
            src="/images/generated/pet-happy-place.webp"
            width="1536"
            height="1024"
            fetchPriority="high"
            alt="A fluffy Shih Tzu, golden retriever and Persian cat relaxing together in a warm lounge"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = "/images/clean_dog_boarding.jpg";
            }}
          />
          <span className="landing-photo-caption">
            Little paws. Lots of love.
          </span>
        </div>
        <span className="landing-sticker">
          <Icon name="paw" size={26} />
          <strong>
            Stay. Spa.
            <br />
            Wag. Repeat.
          </strong>
        </span>
        <svg
          className="landing-spark"
          viewBox="0 0 80 80"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M40 4v21m0 30v21M4 40h21m30 0h21M14 14l15 15m22 22 15 15M14 66l15-15m22-22 15-15"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
        <div className="landing-rate">
          <span onClick={scrollToGrooming} style={{ cursor: "pointer" }}>
            <Icon name="scissors" size={18} />
            <small>FURRY FRESH GROOM FROM</small>
            <strong>
              ₹499<em>/ groom</em>
            </strong>
          </span>
          <span onClick={scrollToBoarding} style={{ cursor: "pointer" }}>
            <Icon name="home" size={18} />
            <small>CAGE-FREE STAYS FROM</small>
            <strong>
              ₹625<em>/ night</em>
            </strong>
          </span>
        </div>
      </div>

      <div className="landing-service-bar">
        <span>
          <Icon name="pin" size={16} />
          Beside Shani Mahatma Temple, Kanakapura Main Road
        </span>
        <div role="group" aria-label="Choose boarding or grooming">
          <button aria-pressed={mode === "boarding"} onClick={scrollToBoarding}>
            <Icon name="home" size={16} />
            Boarding
          </button>
          <button aria-pressed={mode === "grooming"} onClick={scrollToGrooming}>
            <Icon name="scissors" size={16} />
            Grooming
          </button>
        </div>
        <span>
          <Icon name="clock" size={16} />
          Open Every Day · 9:30 AM–8:30 PM
        </span>
      </div>
    </section>
  );
}
