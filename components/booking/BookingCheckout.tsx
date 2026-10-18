"use client";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ARRIVAL_WINDOWS,
  BookingItem,
  addDays,
  indiaDate,
  money,
  quoteCart,
  quoteItem,
} from "../../data/catalog";
import { writeBookingCart } from "../../utils/booking-cart";
import { BookingShell, Icon, OrderSummary, useBookingCart } from "./BookingUI";

type Schedule = { date: string; slot: string };
type Details = {
  name: string;
  phone: string;
  notes: string;
  pets: Record<string, { name: string; breed: string }>;
  schedules: Record<string, Schedule>;
};
type PendingPayment = {
  token: string;
  order_id: string;
  payment_id?: string;
  signature?: string;
};
type Confirmation = {
  bookingRef: string;
  total: number;
  services: {
    name: string;
    date: string;
    slot: string;
    petName: string;
    nights: number;
    category: string;
    quantity: number;
  }[];
};
const DRAFT_KEY = "snip_booking_details_v2";
const PAYMENT_KEY = "snip_booking_payment_v2";

export default function BookingCheckout() {
  const { items, ready } = useBookingCart();
  const [step, setStep] = useState(0);
  const [details, setDetails] = useState<Details>({
    name: "",
    phone: "",
    notes: "",
    pets: {},
    schedules: {},
  });
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [pending, setPending] = useState<PendingPayment | null>(null);
  const [confirmation, setConfirmation] = useState<Confirmation | null>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    // Preload Razorpay checkout script so modal opens instantly
    if (typeof window !== "undefined" && !(window as any).Razorpay) {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      document.head.appendChild(script);
    }
    try {
      const saved = JSON.parse(sessionStorage.getItem(DRAFT_KEY) || "null");
      if (saved?.pets && saved?.schedules) setDetails(saved);
      const payment = JSON.parse(sessionStorage.getItem(PAYMENT_KEY) || "null");
      if (payment?.token && payment?.payment_id && payment?.signature)
        setPending(payment);
    } catch {
      /* A fresh checkout is available even when an old draft is invalid. */
    }
    setLoaded(true);
  }, []);
  useEffect(() => {
    if (loaded) {
      try {
        sessionStorage.setItem(DRAFT_KEY, JSON.stringify(details));
      } catch {
        /* The form still works without draft storage. */
      }
    }
  }, [details, loaded]);
  const pet = (item: BookingItem) =>
    details.pets[item.id] || {
      name: item.petName || "",
      breed: item.breed || "",
    };
  const schedule = (item: BookingItem): Schedule =>
    details.schedules[item.id] || {
      date: indiaDate(1),
      slot: ARRIVAL_WINDOWS[0],
    };
  function go(next: number) {
    setStep(next);
    setError("");
    requestAnimationFrame(() => heading.current?.focus());
  }
  function validate(current: number) {
    if (current === 0) {
      if (!details.name.trim()) return "Please enter your name.";
      if (!/^[6-9]\d{9}$/.test(details.phone))
        return "Please enter a valid 10-digit Indian mobile number.";
      if (items.some((item) => !pet(item).name.trim()))
        return "Please enter the name of each pet. For multiple pets, list their names together.";
    }
    if (
      current >= 1 &&
      items.some(
        (item) =>
          !/^\d{4}-\d{2}-\d{2}$/.test(schedule(item).date) ||
          schedule(item).date < indiaDate() ||
          !ARRIVAL_WINDOWS.includes(schedule(item).slot),
      )
    )
      return "Please choose today or a future date and an arrival window for every service.";
    return "";
  }
  const next = () => {
    const message = validate(step);
    if (message) setError(message);
    else go(step + 1);
  };
  async function confirmPayment(payment: PendingPayment) {
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/booking/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payment),
      });
      const result = await res.json();
      if (!res.ok || !result.success || !result.bookingRef)
        throw new Error(
          result.error ||
            "We could not verify your booking. Please contact the studio with your payment ID.",
        );
      setConfirmation(result);
      try {
        writeBookingCart([]);
        sessionStorage.removeItem(DRAFT_KEY);
        sessionStorage.removeItem(PAYMENT_KEY);
      } catch {
        /* Confirmation remains visible even if storage is unavailable. */
      }
      setPending(null);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "We could not verify your booking. Please contact the studio.",
      );
    } finally {
      setBusy(false);
    }
  }
  async function pay() {
    const invalid = validate(0) || validate(1);
    if (invalid) {
      setError(invalid);
      return;
    }
    setError("");
    setBusy(true);
    try {
      if (!(window as any).Razorpay)
        await new Promise<void>((resolve, reject) => {
          const script = document.createElement("script");
          script.src = "https://checkout.razorpay.com/v1/checkout.js";
          script.onload = () => resolve();
          script.onerror = () =>
            reject(
              new Error(
                "The payment window could not load. Please check your connection and try again.",
              ),
            );
          document.head.appendChild(script);
        });
      const response = await fetch("/api/booking/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((item) => ({
            ...item,
            petName: pet(item).name,
            breed: pet(item).breed,
          })),
          customer: {
            name: details.name,
            phone: details.phone,
            notes: details.notes,
          },
          schedules: Object.fromEntries(
            items.map((item) => [item.id, schedule(item)]),
          ),
        }),
      });
      const order = await response.json();
      if (!response.ok)
        throw new Error(
          order.error || "We couldn’t prepare your payment. Please try again.",
        );
      const paymentWindow = new (window as any).Razorpay({
        key: order.key_id,
        order_id: order.order_id,
        amount: order.amount,
        currency: "INR",
        name: "Snip & Style",
        description: "Pet grooming & boarding booking",
        prefill: { name: details.name, contact: details.phone },
        theme: { color: "#214f42" },
        modal: {
          ondismiss: () => {
            setBusy(false);
            setError(
              "Payment window closed. Your cart is saved and no booking has been confirmed.",
            );
          },
        },
        handler: async (result: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          const payment = {
            token: order.token,
            order_id: result.razorpay_order_id,
            payment_id: result.razorpay_payment_id,
            signature: result.razorpay_signature,
          };
          setPending(payment);
          try {
            sessionStorage.setItem(PAYMENT_KEY, JSON.stringify(payment));
          } catch {
            /* Keep the retry data in memory. */
          }
          await confirmPayment(payment);
        },
      });
      paymentWindow.on("payment.failed", () => {
        setBusy(false);
        setError(
          "Your payment was not completed. Your cart is saved; please try again or contact the studio.",
        );
      });
      paymentWindow.open();
    } catch (err) {
      setBusy(false);
      setError(
        err instanceof Error
          ? err.message
          : "Payment could not start. Please try again.",
      );
    }
  }

  if (confirmation)
    return (
      <BookingShell minimal>
        <div className="pet-container pet-confirmation">
          <span className="pet-confirmation-check">
            <Icon name="check" size={38} />
          </span>
          <span className="pet-eyebrow">ALL SET FOR A LITTLE PAMPERING</span>
          <h1>
            We’ll see you &<br />
            your best friend soon.
          </h1>
          <p>Your payment is verified and your booking has been saved.</p>
          <div className="pet-reference">
            <span>Your booking reference</span>
            <strong>{confirmation.bookingRef}</strong>
            <small>
              Save this reference or take a screenshot for your visit.
            </small>
          </div>
          <div className="pet-confirmation-services">
            {confirmation.services.map((service, index) => (
              <div key={index}>
                <strong>
                  {service.name}
                  {service.quantity > 1 ? ` × ${service.quantity}` : ""}
                </strong>
                <span>
                  {service.petName} · {service.date} · {service.slot}
                </span>
                {service.category === "boarding" && (
                  <span>
                    Check-out: {addDays(service.date, service.nights)}
                  </span>
                )}
              </div>
            ))}
          </div>
          <p>
            <strong>Paid {money(confirmation.total)}</strong> · Razorpay
          </p>
          <div className="pet-hero-buttons">
            <a
              className="pet-button"
              href="https://maps.app.goo.gl/MqFTrZiLPbttv3eD6"
              target="_blank"
              rel="noreferrer"
            >
              Get directions
              <Icon name="arrow" size={18} />
            </a>
            <Link href="/" className="pet-button pet-button-light">
              Back to home
            </Link>
          </div>
          <p className="pet-small pet-muted">
            Need to change your visit? Call +91 97398 87770 with your booking
            reference.
          </p>
        </div>
      </BookingShell>
    );
  if (pending)
    return (
      <BookingShell minimal>
        <div className="pet-container pet-confirmation">
          <span className="pet-eyebrow">LET’S CHECK YOUR PAYMENT</span>
          <h1>
            Your booking is
            <br />
            being verified.
          </h1>
          <p>
            Your payment was submitted. Verify its status before paying again.
            You can safely retry verification.
          </p>
          <div className="pet-reference">
            <span>Payment ID</span>
            <strong style={{ fontSize: 18, overflowWrap: "anywhere" }}>
              {pending.payment_id}
            </strong>
            <small>Keep this ID if you need help from the studio.</small>
          </div>
          {error && (
            <p className="pet-error" role="alert">
              {error}
            </p>
          )}
          <div className="pet-hero-buttons">
            <button
              className="pet-button"
              disabled={busy}
              onClick={() => void confirmPayment(pending)}
            >
              {busy ? "Verifying payment…" : "Verify payment & recover booking"}
              <Icon name="shield" size={18} />
            </button>
          </div>
          <a className="pet-help-link" href="tel:+919739887770">
            Need a hand? Call +91 97398 87770
          </a>
        </div>
      </BookingShell>
    );
  return (
    <BookingShell minimal>
      <div className="pet-container pet-flow-page">
        <Link href="/cart" className="pet-back-link">
          ← Back to your cart
        </Link>
        <div className="pet-flow-heading">
          <span className="pet-eyebrow">YOU’RE A FEW DETAILS AWAY</span>
          <h1>
            Let’s make it a date<span className="pet-heading-dot">.</span>
          </h1>
          <p>A happy visit starts with getting to know your pet.</p>
        </div>
        {!ready || !loaded ? (
          <p role="status">Preparing your checkout…</p>
        ) : !items.length ? (
          <div className="pet-empty">
            <Icon name="bag" size={44} />
            <h2>Choose their pampering first.</h2>
            <p>Your cart is empty. Let’s find something they’ll love.</p>
            <Link href="/grooming" className="pet-button">
              Explore grooming
              <Icon name="arrow" size={18} />
            </Link>
          </div>
        ) : (
          <div className="pet-checkout-grid">
            <div>
              <ol
                className="pet-checkout-progress"
                aria-label="Checkout progress"
              >
                {["You & your pet", "Date & arrival", "Review & pay"].map(
                  (text, index) => (
                    <li
                      key={text}
                      aria-current={step === index ? "step" : undefined}
                      className={index <= step ? "pet-step-active" : ""}
                    >
                      <button
                        disabled={index > step || busy || !!pending}
                        onClick={() => go(index)}
                      >
                        <span>
                          {index < step ? (
                            <Icon name="check" size={16} />
                          ) : (
                            index + 1
                          )}
                        </span>
                        {text}
                      </button>
                    </li>
                  ),
                )}
              </ol>
              <section className="pet-form-card">
                <h2 tabIndex={-1} ref={heading}>
                  {
                    [
                      "First, a little introduction.",
                      "When shall we see you?",
                      "One last look. Then, happy paws.",
                    ][step]
                  }
                </h2>
                <p className="pet-muted">
                  {
                    [
                      "No account needed. We just need to know who to expect.",
                      "Choose an arrival window for each service.",
                      "Check your details and the total before opening secure payment.",
                    ][step]
                  }
                </p>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (step < 2) next();
                    else void pay();
                  }}
                >
                  {step === 0 && (
                    <>
                      <div className="pet-form-grid">
                        <label>
                          Your name
                          <input
                            autoComplete="name"
                            maxLength={100}
                            required
                            value={details.name}
                            onChange={(e) =>
                              setDetails({ ...details, name: e.target.value })
                            }
                            placeholder="Pet parent’s full name"
                          />
                        </label>
                        <label>
                          Mobile number
                          <div className="pet-phone-input">
                            <span>+91</span>
                            <input
                              type="tel"
                              inputMode="numeric"
                              autoComplete="tel-national"
                              maxLength={10}
                              required
                              pattern="[6-9][0-9]{9}"
                              value={details.phone}
                              onChange={(e) =>
                                setDetails({
                                  ...details,
                                  phone: e.target.value
                                    .replace(/\D/g, "")
                                    .slice(0, 10),
                                })
                              }
                              placeholder="10-digit mobile number"
                            />
                          </div>
                        </label>
                      </div>
                      <p className="pet-small pet-muted">
                        We’ll use this number to contact you about your visit.
                      </p>
                      {items.map((item) => (
                        <fieldset className="pet-pet-fieldset" key={item.id}>
                          <legend>
                            <Icon name="paw" size={18} />
                            {quoteItem(item).name}
                            {item.quantity > 1
                              ? ` · ${item.quantity} pets`
                              : ""}
                          </legend>
                          <div className="pet-form-grid" style={{ gridTemplateColumns: "1fr" }}>
                            <label>
                              {item.quantity > 1
                                ? "Pet names (list all names)"
                                : "Pet’s name"}
                              <input
                                required
                                maxLength={80}
                                value={pet(item).name}
                                onChange={(e) =>
                                  setDetails({
                                    ...details,
                                    pets: {
                                      ...details.pets,
                                      [item.id]: {
                                        ...pet(item),
                                        name: e.target.value,
                                      },
                                    },
                                  })
                                }
                                placeholder={
                                  item.quantity > 1
                                    ? "e.g. Coco, Milo"
                                    : "e.g. Coco"
                                }
                              />
                            </label>
                            {(item.breed || pet(item).breed) && (
                              <div className="pet-confirmed-breed-tag">
                                <span>✓ Confirmed Breed:</span>
                                <strong>{item.breed || pet(item).breed}</strong>
                                <span>({item.petSize ? item.petSize.toUpperCase() : "STANDARD"})</span>
                              </div>
                            )}
                          </div>
                        </fieldset>
                      ))}
                      <label>
                        Anything that helps us care for them?{" "}
                        <span className="pet-optional">optional</span>
                        <textarea
                          rows={3}
                          maxLength={1500}
                          value={details.notes}
                          onChange={(e) =>
                            setDetails({ ...details, notes: e.target.value })
                          }
                          placeholder="Nervous around dryers? A favourite haircut? Tell us about preferences or special care needs."
                        />
                      </label>
                    </>
                  )}
                  {step === 1 && (
                    <>
                      {items.map((item) => (
                        <fieldset className="pet-pet-fieldset" key={item.id}>
                          <legend>
                            <Icon
                              name={
                                item.category === "boarding"
                                  ? "home"
                                  : "scissors"
                              }
                              size={18}
                            />
                            {quoteItem(item).name} · {pet(item).name}
                          </legend>
                          <label>
                            {item.category === "boarding"
                              ? "Check-in date"
                              : "Visit date"}
                            <input
                              type="date"
                              min={indiaDate()}
                              max={addDays(indiaDate(), 365)}
                              required
                              value={schedule(item).date}
                              onChange={(e) =>
                                setDetails({
                                  ...details,
                                  schedules: {
                                    ...details.schedules,
                                    [item.id]: {
                                      ...schedule(item),
                                      date: e.target.value,
                                    },
                                  },
                                })
                              }
                            />
                          </label>
                          {item.category === "boarding" && (
                            <p className="pet-perk">
                              {item.nights} nights · Check-out{" "}
                              {addDays(
                                schedule(item).date || indiaDate(),
                                item.nights,
                              )}
                            </p>
                          )}
                          <span className="pet-field-title">
                            Arrival window (Studio visit time)
                          </span>
                          <div className="pet-slot-grid">
                            {ARRIVAL_WINDOWS.map((slot, index) => {
                              const isSelected = schedule(item).slot === slot;
                              const label = ["Morning", "Afternoon", "Evening"][index];
                              const emoji = ["🌅", "☀️", "🌆"][index];
                              return (
                                <button
                                  type="button"
                                  key={slot}
                                  aria-pressed={isSelected}
                                  className={`pet-slot-btn ${isSelected ? "selected" : ""}`}
                                  onClick={() =>
                                    setDetails({
                                      ...details,
                                      schedules: {
                                        ...details.schedules,
                                        [item.id]: { ...schedule(item), slot },
                                      },
                                    })
                                  }
                                >
                                  <div className="pet-slot-top-row">
                                    <span className="pet-slot-emoji">{emoji}</span>
                                    <strong className="pet-slot-label">{label}</strong>
                                    {isSelected ? (
                                      <span className="pet-slot-dot">● Selected</span>
                                    ) : (
                                      <span className="pet-slot-avail">● Available</span>
                                    )}
                                  </div>
                                  <span className="pet-slot-time">{slot}</span>
                                </button>
                              );
                            })}
                          </div>
                        </fieldset>
                      ))}
                      <div className="pet-info-note">
                        <Icon name="pin" />
                        <p>
                          We’ll welcome you at our Kanakapura Main Road studio.
                          Arrival windows aren’t exact grooming start times. For
                          a specific start time or pet transport,{" "}
                          <a href="tel:+919739887770">call us before booking</a>
                          .
                        </p>
                      </div>
                    </>
                  )}
                  {step === 2 && (
                    <>
                      <div className="pet-review-section">
                        <div>
                          <h3>You & your pet</h3>
                          <button
                            type="button"
                            className="pet-edit-link"
                            onClick={() => go(0)}
                            disabled={!!pending}
                          >
                            Edit details
                          </button>
                        </div>
                        <strong>{details.name}</strong>
                        <p>+91 {details.phone}</p>
                        {details.notes && (
                          <p className="pet-review-notes">{details.notes}</p>
                        )}
                      </div>
                      {items.map((item) => (
                        <div key={item.id} className="pet-review-service">
                          <span className="pet-service-icon">
                            <Icon
                              name={
                                item.category === "boarding"
                                  ? "home"
                                  : "scissors"
                              }
                            />
                          </span>
                          <div>
                            <h3>
                              {quoteItem(item).name}
                              {item.quantity > 1 ? ` × ${item.quantity}` : ""}
                            </h3>
                            <p>
                              {pet(item).name}
                              {pet(item).breed ? ` · ${pet(item).breed}` : ""}
                            </p>
                            <p>
                              {schedule(item).date} · {schedule(item).slot}
                            </p>
                            {item.category === "boarding" && (
                              <p>
                                Check-out{" "}
                                {addDays(schedule(item).date, item.nights)} ·{" "}
                                {item.nights} nights
                              </p>
                            )}
                            <button
                              type="button"
                              className="pet-edit-link"
                              disabled={!!pending}
                              onClick={() => go(1)}
                            >
                              Change date or arrival
                            </button>
                          </div>
                        </div>
                      ))}
                      <div className="pet-info-note">
                        <Icon name="shield" />
                        <p>
                          Your total is{" "}
                          <strong>{money(quoteCart(items).total)}</strong>.
                          You’ll pay through Razorpay using UPI, cards, or
                          another available method. Your booking is confirmed
                          after payment verification and saving your booking.
                        </p>
                      </div>
                      <p className="pet-small pet-muted">
                        By continuing, you agree to our{" "}
                        <Link href="/terms" target="_blank">
                          booking terms
                        </Link>{" "}
                        and acknowledge our{" "}
                        <Link href="/privacy" target="_blank">
                          privacy policy
                        </Link>
                        .
                      </p>
                    </>
                  )}
                  {error && (
                    <div role="alert" className="pet-error">
                      {error}
                    </div>
                  )}
                  {pending ? (
                    <div className="pet-payment-recovery">
                      <h3>Let’s check your payment.</h3>
                      <p>
                        Your payment was submitted. Please verify its status
                        before paying again.
                      </p>
                      <p className="pet-small">
                        Payment ID: {pending.payment_id}
                      </p>
                      <button
                        type="button"
                        className="pet-button pet-full"
                        disabled={busy}
                        onClick={() => void confirmPayment(pending)}
                      >
                        {busy
                          ? "Checking payment…"
                          : "Verify payment & recover booking"}
                      </button>
                      <a href="tel:+919739887770" className="pet-help-link">
                        Need help? Call +91 97398 87770
                      </a>
                    </div>
                  ) : (
                    <div className="pet-form-actions">
                      {step > 0 && (
                        <button
                          className="pet-button pet-button-light"
                          type="button"
                          disabled={busy}
                          onClick={() => go(step - 1)}
                        >
                          Back
                        </button>
                      )}
                      <button
                        className="pet-button"
                        type="submit"
                        disabled={busy}
                      >
                        {busy
                          ? "Opening secure Razorpay payment…"
                          : step === 2
                            ? `Pay ${money(quoteCart(items).total)} with Razorpay`
                            : step === 0
                              ? "Choose date & arrival"
                              : "Review your booking"}
                        <Icon
                          name={step === 2 ? "shield" : "arrow"}
                          size={18}
                        />
                      </button>
                    </div>
                  )}
                </form>
              </section>
            </div>
            <OrderSummary items={items} />
          </div>
        )}
      </div>
    </BookingShell>
  );
}
