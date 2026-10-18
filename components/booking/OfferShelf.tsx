"use client";
import Link from "next/link";
import { Icon } from "./BookingUI";

export default function OfferShelf() {
  return (
    <section className="pet-offer-shelf" aria-label="Festival offers">
      <div className="pet-container">
        <div className="pet-offer-shelf-heading">
          <div>
            <span className="pet-offer-live" />
            DASARA SPECIALS <span>Boarding & grooming offers</span>
          </div>
          <small>Applied automatically at checkout</small>
        </div>
        <div
          className="pet-offer-track"
          tabIndex={0}
          aria-label="Swipe to browse three festival offers"
        >
          <Link
            href="/grooming#services"
            className="pet-offer-ticket pet-ticket-groom"
          >
            <span className="pet-ticket-symbol">
              <Icon name="scissors" size={26} />
            </span>
            <div>
              <strong>10% OFF GROOMING</strong>
              <span>On packages above ₹999</span>
              <small>
                GROOM10 <b>Explore packages ↗</b>
              </small>
            </div>
          </Link>
          <Link
            href="/boarding#services"
            className="pet-offer-ticket pet-ticket-stay"
          >
            <span className="pet-ticket-symbol">
              <Icon name="home" size={26} />
            </span>
            <div>
              <strong>1 NIGHT FREE</strong>
              <span>Stay 6+ nights. Pay for one less.</span>
              <small>
                STAY6FREE1 <b>Plan a stay ↗</b>
              </small>
            </div>
          </Link>
          <Link
            href="/boarding#services"
            className="pet-offer-ticket pet-ticket-spa"
          >
            <span className="pet-ticket-symbol">
              <Icon name="bath" size={26} />
            </span>
            <div>
              <strong>FREE SPA BATH</strong>
              <span>With boarding stays of 4+ nights</span>
              <small>
                FREESPA <b>See boarding rates ↗</b>
              </small>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
