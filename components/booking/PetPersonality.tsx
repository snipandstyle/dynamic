"use client";
import React from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Icon } from "./BookingUI";

export function PetDoodle({
  kind = "dog",
  className = "",
}: {
  kind?: "dog" | "cat" | "bone" | "arrow" | "flower";
  className?: string;
}) {
  return (
    <svg
      className={`pet-doodle ${className}`}
      viewBox="0 0 120 120"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {kind === "dog" ? (
        <>
          <path d="M34 44c-5-22-21-17-23-2-2 11 6 22 17 19m58-17c5-22 21-17 23-2 2 11-6 22-17 19" />
          <path d="M28 54c1-25 61-30 65 0l-2 27c-5 32-57 32-61-1l-2-26Z" />
          <path d="M45 67h1m29 0h1" strokeWidth="5" />
          <path d="m53 80 7 5 7-5-14 0Zm7 6v9m-12-1c3 6 10 5 12 1 3 5 11 4 13-2" />
          <path d="M54 101v5c0 10 13 10 13-1v-5" />
          <path d="m40 39 5-8m12 4 1-9m12 10 5-7" />
        </>
      ) : kind === "cat" ? (
        <>
          <path d="m23 56 1-35 29 20c8-2 14-2 21 0l25-20 1 39c22 53-100 61-77-4Z" />
          <path
            d="m31 44 1-9 10 9m42 0 7-9 1 11M42 67h1m33 0h1"
            strokeWidth="3.5"
          />
          <path d="m55 79 6 5 6-5H55Zm6 5v8m-11-1c3 5 9 5 11 1 3 4 9 4 12-1M27 77 7 72m20 13L6 88m88-11 19-5M94 86l20 4" />
        </>
      ) : kind === "bone" ? (
        <path d="m37 42 40 35c18-14 35 10 17 18 0 22-28 21-29 1L26 62C6 74-7 48 12 42c-1-24 27-23 25 0Z" />
      ) : kind === "flower" ? (
        <>
          <path d="M60 48C30 15 13 57 45 61 9 88 54 111 60 75c20 36 55 3 22-13 39-10 9-49-11-20 0-36-37-29-11 6Z" />
          <circle cx="63" cy="62" r="9" />
        </>
      ) : (
        <>
          <path d="M12 25c63-14 97 47 40 60-31 8-27-26-6-18 11 4 9 24 40 28" />
          <path d="m76 82 13 13-16 8" />
        </>
      )}
    </svg>
  );
}

export function Reveal({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={false}
      whileInView={
        reduced ? { opacity: 1, y: 0 } : { opacity: [0, 1], y: [22, 0] }
      }
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: reduced ? 0 : 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function FestivalPerks() {
  return (
    <section className="pet-festival-section">
      <div className="pet-container">
        <Reveal className="pet-festival-grid">
          <div className="pet-festival-art">
            <img
              src="/images/banner_dasara_hero.jpg"
              alt="Dasara festival offers for pet boarding and grooming"
              loading="lazy"
            />
            <span className="pet-festival-caption">
              <Icon name="sparkle" size={17} />A little festive magic for your
              furry family
            </span>
          </div>
          <div className="pet-festival-copy">
            <span className="pet-eyebrow">
              THEIR PAMPERING. YOUR LITTLE BONUS.
            </span>
            <h2>
              Big celebrations.
              <br />
              <em>Even bigger tail wags.</em>
            </h2>
            <p>
              Your favourite festival offers, applied automatically when your
              booking qualifies.
            </p>
            <div className="pet-perk-tickets">
              <Link href="/grooming#services">
                <span className="pet-ticket-icon">
                  <Icon name="scissors" />
                </span>
                <div>
                  <strong>10% extra off</strong>
                  <span>Grooming packages above ₹999</span>
                </div>
                <Icon name="arrow" size={18} />
              </Link>
              <Link href="/boarding#services">
                <span className="pet-ticket-icon">
                  <Icon name="home" />
                </span>
                <div>
                  <strong>1 night on us</strong>
                  <span>Book a stay of 6 nights or more</span>
                </div>
                <Icon name="arrow" size={18} />
              </Link>
            </div>
            <span className="pet-festival-handnote">
              A happy pet. A happier you. <PetDoodle kind="arrow" />
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
