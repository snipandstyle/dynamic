"use client";
import React from "react";
import Link from "next/link";
import ServiceMenu from "./ServiceMenu";
import { Icon } from "./BookingUI";
import { PetDoodle, Reveal } from "./PetPersonality";
import OfferShelf from "./OfferShelf";

export default function BookingHome({
  page = "home",
}: {
  page?: "home" | "grooming" | "boarding";
}) {
  const boarding = page === "boarding";
  return (
    <>
      <OfferShelf />
      <section className="pet-hero">
        <div className="pet-hero-doodles" aria-hidden="true">
          <PetDoodle kind="bone" className="pet-doodle-bone" />
          <PetDoodle kind="flower" className="pet-doodle-flower" />
          <span className="pet-doodle-spark pet-spark-one">✧</span>
          <span className="pet-doodle-spark pet-spark-two">✦</span>
        </div>
        <div className="pet-container pet-hero-grid">
          <div className="pet-hero-copy">
            <div className="pet-location-chip">
              <span />
              KANAKAPURA MAIN ROAD · BENGALURU
            </div>
            <h1>
              {boarding ? (
                <>
                  Cage-free stays.
                  <br />
                  <em>Care around the clock.</em>
                </>
              ) : (
                <>
                  Pet grooming.
                  <br />
                  <em>Baths. Trims. Spa.</em>
                </>
              )}
            </h1>
            <p>
              {boarding
                ? "Dogs & cats from ₹625/night. Daily walks, WhatsApp updates, and free spa perks on longer stays."
                : "Dogs & cats. Puppy spa ₹449. Bath packages from ₹499."}
            </p>
            <div className="pet-hero-buttons">
              <a className="pet-button" href="#services">
                {boarding ? "Boarding rates" : "Grooming prices"}
                <Icon name="arrow" size={19} />
              </a>
              <Link
                href={boarding ? "/grooming" : "/boarding"}
                className="pet-text-link"
              >
                {boarding ? "Grooming" : "Boarding"}
                <Icon name="arrow" size={18} />
              </Link>
            </div>
            <div className="pet-hero-proof">
              <span className="pet-proof-icon">
                <Icon name="heart" size={20} />
              </span>
              <div>
                <strong>Open daily · 9:30 AM–8:30 PM</strong>
                <span>Beside Shani Mahatma Temple · Kanakapura Road</span>
              </div>
            </div>
          </div>
          <div className="pet-hero-visual">
            <span className="pet-hero-photo-outline" aria-hidden="true" />
            <div className="pet-hero-image">
              <img
                src={
                  boarding
                    ? "/images/clean_dog_boarding.jpg"
                    : "/images/luxury_dog_grooming.jpg"
                }
                alt={
                  boarding
                    ? "A dog resting comfortably in a bright boarding space"
                    : "A golden retriever enjoying a gentle bath"
                }
                fetchPriority="high"
              />
            </div>
            <PetDoodle kind="dog" className="pet-hero-dog" />
            <PetDoodle kind="cat" className="pet-hero-cat" />
            <div className="pet-bath-bubbles" aria-hidden="true">
              <i />
              <i />
              <i />
              <i />
            </div>
            <span className="pet-hero-stamp">
              <Icon name="paw" size={27} />
              <span>
                A little pampering.
                <br />A lot of love.
              </span>
            </span>
            <div className="pet-floating-note">
              <span className="pet-floating-icon">
                <Icon name={boarding ? "home" : "scissors"} size={24} />
              </span>
              <div>
                <strong>
                  {boarding
                    ? "A cosy stay, from ₹625 / night"
                    : "Fresh & fluffy, from ₹449"}
                </strong>
                <span>
                  {boarding
                    ? "Cage-free care for dogs & cats"
                    : "Gentle spa for our littlest guests"}
                </span>
              </div>
              <Icon name="sparkle" size={19} />
              <span className="pet-visual-scribble">
                their favourite kind of self-care ↗
              </span>
            </div>
          </div>
        </div>
      </section>
      <div className="pet-trust-strip">
        <div className="pet-container">
          {[
            ["heart", "Gentle, patient care"],
            ["paw", "Dogs & cats welcome"],
            ["pin", "Kanakapura Road studio"],
            ["shield", "Clear prices. No surprises."],
          ].map(([icon, text]) => (
            <div key={text}>
              <Icon name={icon} size={20} />
              <span>{text}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="pet-happy-ribbon" aria-hidden="true">
        <div>
          {Array.from({ length: 4 }, (_, i) => (
            <span key={i}>
              GOOD GROOMS <Icon name="paw" size={18} /> HAPPY PETS{" "}
              <Icon name="sparkle" size={18} /> ALL THE LOVE{" "}
              <Icon name="heart" size={18} />
            </span>
          ))}
        </div>
      </div>
      <ServiceMenu boarding={boarding} />
      <section className="pet-how">
        <div className="pet-container">
          <div className="pet-section-heading">
            <div>
              <span className="pet-eyebrow">
                LESS PLANNING. MORE PAMPERING.
              </span>
              <h2>A happy pet is three little steps away.</h2>
            </div>
            <p>Everything you need, without the back-and-forth.</p>
          </div>
          <Reveal className="pet-steps-grid">
            {[
              [
                "01",
                "Pick their pampering",
                "Choose a package for your pet. See exactly what’s included and what it costs.",
                "scissors",
              ],
              [
                "02",
                "Make it their own",
                "Add extras, tell us about your pet, and choose an arrival date and window.",
                "heart",
              ],
              [
                "03",
                "We’ll take it from here",
                "Pay securely, save your booking reference, and bring your best friend to the studio.",
                "paw",
              ],
            ].map(([number, title, text, icon]) => (
              <div className="pet-how-card" key={number}>
                <span className="pet-step-number">{number}</span>
                <Icon name={icon} size={29} />
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>
      <section className="pet-care">
        <Reveal className="pet-container pet-care-grid">
          <div className="pet-care-image">
            <img
              src="/images/stylish_pet_haircut.jpg"
              alt="A freshly groomed dog"
              loading="lazy"
            />
            <span>Made to feel good. Inside & out.</span>
          </div>
          <div className="pet-care-copy">
            <span className="pet-eyebrow">A LITTLE MORE THAN A GROOM</span>
            <h2>
              Good care starts
              <br />
              with <em>getting to know them.</em>
            </h2>
            <p>
              The nervous first-timer. The muddy explorer. The cat who likes
              things just so. Tell us their quirks, preferences, and care
              needs—we’ll help you choose the right visit.
            </p>
            <div className="pet-care-points">
              <div>
                <Icon name="heart" />
                <span>
                  <strong>Care at their pace</strong>A gentle approach, with
                  time to settle in.
                </span>
              </div>
              <div>
                <Icon name="home" />
                <span>
                  <strong>A real studio, a friendly team</strong>Come meet us on
                  Kanakapura Main Road.
                </span>
              </div>
              <div>
                <Icon name="phone" />
                <span>
                  <strong>A human when you need one</strong>Questions before
                  booking? We’re a call away.
                </span>
              </div>
            </div>
            <Link href="/about" className="pet-text-link">
              Get to know Snip & Style
              <Icon name="arrow" size={18} />
            </Link>
          </div>
        </Reveal>
      </section>
      <section className="pet-faq-section">
        <div className="pet-container pet-faq-grid">
          <div>
            <span className="pet-eyebrow">GOOD QUESTIONS, SIMPLE ANSWERS</span>
            <h2>
              A few things
              <br />
              you might be wondering.
            </h2>
            <p>
              Still have a question?
              <br />
              <a
                href="https://wa.me/919739887770"
                target="_blank"
                rel="noreferrer"
                className="pet-text-link"
              >
                Let’s chat on WhatsApp ↗
              </a>
            </p>
          </div>
          <div className="pet-faq-list">
            {[
              [
                "Where does grooming take place?",
                "All packages on this site are for our studio at Site no. 61, Kanakapura Main Road, beside Shani Mahatma Temple, Bengaluru 560082. Contact us to discuss transport; it is not included in these prices.",
              ],
              [
                "How do the festival offers work?",
                "Grooming packages priced above ₹999 receive an extra 10% off automatically. Boarding stays of 6 or more nights include one free night. Your cart shows every discount before you pay.",
              ],
              [
                "What does my arrival window mean?",
                "Choose a convenient window to arrive at the studio. This is an arrival window, rather than an exact grooming start time. Please call us if you need a specific start or collection time.",
              ],
              [
                "What should I bring for boarding?",
                "Bring an up-to-date vaccination record, your pet’s usual food, any prescribed medication with instructions, and a familiar toy or blanket. Call us before booking if your pet has special care needs.",
              ],
              [
                "Can I book without an account?",
                "Yes. Book as a guest with your name and mobile number. Your confirmation includes a booking reference; please keep it for your visit.",
              ],
              [
                "How do I change or cancel a booking?",
                "Call +91 97398 87770 with your booking reference. Our team will help with changes, cancellation, and any refund questions according to the booking terms.",
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
          </div>
        </div>
      </section>
      <section className="pet-visit">
        <div className="pet-container pet-visit-inner">
          <span className="pet-visit-icon">
            <Icon name="pin" size={34} />
          </span>
          <div>
            <span className="pet-eyebrow">
              COME OVER. WE’D LOVE TO MEET YOU.
            </span>
            <h2>Your pet’s next happy place.</h2>
            <p>Kanakapura Main Road, Bengaluru · Every day, 9:30 AM–8:30 PM</p>
          </div>
          <a
            href="https://maps.app.goo.gl/MqFTrZiLPbttv3eD6"
            target="_blank"
            rel="noreferrer"
            className="pet-button"
          >
            Find our studio
            <Icon name="arrow" size={18} />
          </a>
        </div>
      </section>
    </>
  );
}
