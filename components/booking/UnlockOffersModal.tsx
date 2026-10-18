"use client";
import React, { useState, useEffect } from "react";
import { Icon } from "./BookingUI";

export default function UnlockOffersModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [phone, setPhone] = useState("");
  const [petName, setPetName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    try {
      const alreadySubmitted = localStorage.getItem("snip_lead_captured");
      if (!alreadySubmitted) {
        const timer = setTimeout(() => {
          setIsOpen(true);
        }, 1600);
        return () => clearTimeout(timer);
      }
    } catch {
      // Ignore storage errors
    }
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const cleanPhone = phone.replace(/\D/g, "");
    if (cleanPhone.length < 10) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }
    setError("");
    setSubmitting(true);

    try {
      // Send lead to backend draft endpoint which persists into abandoned_checkouts
      await fetch("/api/checkout/draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: cleanPhone,
          customerName: petName ? `Lead (Pet: ${petName})` : "Landing Offer Lead",
          petName: petName || "",
          status: "draft",
          lastStep: "landing_offer_unlock",
          notes: "Captured via Landing Page Unlock Offers popup",
        }),
      });

      // Save locally
      localStorage.setItem("snip_lead_captured", "1");
      localStorage.setItem("snip_user_phone", cleanPhone);
      setUnlocked(true);

      // Copy primary coupon code
      navigator.clipboard?.writeText?.("GROOM10");

      setTimeout(() => {
        setIsOpen(false);
      }, 2200);
    } catch (err) {
      console.error("Lead submission error:", err);
      // Still show success to visitor so user experience isn't blocked
      setUnlocked(true);
      setTimeout(() => setIsOpen(false), 2200);
    } finally {
      setSubmitting(false);
    }
  }

  if (!isOpen) return null;

  return (
    <div
      className="ref-lead-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="lead-modal-title"
      onClick={() => setIsOpen(false)}
    >
      <div className="ref-lead-card" onClick={(e) => e.stopPropagation()}>
        <button
          className="ref-lead-close"
          onClick={() => setIsOpen(false)}
          aria-label="Close offer modal"
        >
          ×
        </button>

        {!unlocked ? (
          <>
            <div className="ref-lead-header">
              <span className="ref-lead-badge">
                <Icon name="sparkle" size={14} />
                EXCLUSIVE FESTIVAL PRIVILEGES
              </span>
              <h3 id="lead-modal-title">Unlock Bengaluru’s Best Pet Offers</h3>
              <p>
                Enter your WhatsApp / mobile number to instantly unlock:
              </p>
            </div>

            <ul className="ref-lead-perks">
              <li>
                <Icon name="check" size={16} />
                <span><strong>Flat 10% Off</strong> all grooming packages above ₹999 (Code: <code>GROOM10</code>)</span>
              </li>
              <li>
                <Icon name="check" size={16} />
                <span><strong>1 Night Free</strong> cage-free boarding on 6+ nights (Code: <code>STAY6FREE1</code>)</span>
              </li>
              <li>
                <Icon name="check" size={16} />
                <span><strong>Complimentary Furry Fresh Spa</strong> on 4+ nights stay (Code: <code>FREESPA</code>)</span>
              </li>
            </ul>

            <form onSubmit={handleSubmit} className="ref-lead-form">
              {error && <p className="ref-lead-error">{error}</p>}

              <div className="ref-lead-input-wrap">
                <span className="ref-lead-prefix">+91</span>
                <input
                  type="tel"
                  maxLength={10}
                  placeholder="Enter 10-digit mobile number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                  autoFocus
                  required
                />
              </div>

              <input
                type="text"
                className="ref-lead-pet-input"
                placeholder="Pet's name & breed (Optional)"
                value={petName}
                onChange={(e) => setPetName(e.target.value)}
              />

              <button
                type="submit"
                disabled={submitting}
                className="ref-lead-submit-btn"
              >
                {submitting ? "Unlocking Offers..." : "Unlock Offers & Copy Codes →"}
              </button>

              <span className="ref-lead-guarantee">
                🔒 We respect your privacy. No spam, only verified booking updates &amp; perks.
              </span>
            </form>
          </>
        ) : (
          <div className="ref-lead-success">
            <div className="ref-lead-success-icon">🎉</div>
            <h3>Offers Unlocked!</h3>
            <p>
              Coupon <strong>GROOM10</strong> copied to clipboard! Stays of 4+ &amp; 6+ nights will automatically receive free nights and spa baths at checkout.
            </p>
            <span className="ref-lead-success-badge">
              Applied for {phone} ✓
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
