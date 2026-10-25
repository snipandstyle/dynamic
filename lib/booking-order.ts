import crypto from "crypto";
import {
  ARRIVAL_WINDOWS,
  BookingItem,
  addDays,
  indiaDate,
  quoteCart,
  validateItem,
} from "../data/catalog";

export interface BookingOrder {
  couponCode?: string;
  coupon?: { code: string; discount: number; benefit?: string };
  items: BookingItem[];
  customer: { name: string; phone: string; notes: string };
  schedules: Record<string, { date: string; slot: string }>;
}
export function validateOrder(raw: BookingOrder): BookingOrder {
  if (
    !raw ||
    !Array.isArray(raw.items) ||
    !raw.items.length ||
    raw.items.length > 20
  )
    throw new Error("Your cart must contain between 1 and 20 services.");
  const items = raw.items.map(validateItem);
  if (
    new Set(items.map((item) => item.id)).size !== items.length ||
    items.some((item) => !item.id || item.id.length > 100)
  )
    throw new Error("Please refresh your cart and try again.");
  const customer = {
    name: String(raw.customer?.name || "")
      .trim()
      .slice(0, 100),
    phone: String(raw.customer?.phone || "").trim(),
    notes: String(raw.customer?.notes || "")
      .trim()
      .slice(0, 1500),
  };
  if (!customer.name || !/^[6-9]\d{9}$/.test(customer.phone))
    throw new Error(
      "Please provide your name and a valid 10-digit Indian mobile number.",
    );
  const schedules: BookingOrder["schedules"] = {};
  for (const item of items) {
    if (!item.petName)
      throw new Error("Please enter the pet name for each service.");
    const schedule = raw.schedules?.[item.id];
    if (
      !schedule ||
      !/^\d{4}-\d{2}-\d{2}$/.test(schedule.date) ||
      !Number.isFinite(Date.parse(`${schedule.date}T12:00:00Z`)) ||
      addDays(schedule.date, 0) !== schedule.date ||
      schedule.date < indiaDate() ||
      schedule.date > addDays(indiaDate(), 365) ||
      !ARRIVAL_WINDOWS.includes(schedule.slot)
    )
      throw new Error(
        "Please choose a valid future date and arrival window for every service.",
      );
    schedules[item.id] = { date: schedule.date, slot: schedule.slot };
  }
  quoteCart(items);
  const couponCode = String(raw.couponCode || '').trim().toUpperCase().slice(0, 50);
  return { items, customer, schedules, ...(couponCode ? { couponCode } : {}) };
}
export function quoteBookingOrder(order: BookingOrder) {
  const quote = quoteCart(order.items);
  const discount = order.coupon?.discount || 0;
  return { ...quote, discount: quote.discount + discount, total: Math.round((quote.total - discount) * 100) / 100 };
}
function secret() {
  const key = process.env.RAZORPAY_KEY_SECRET;
  if (!key)
    throw new Error(
      "Online payments are temporarily unavailable. Please call the studio to book.",
    );
  return key;
}
export function signOrder(order: BookingOrder, orderId: string) {
  const payload = Buffer.from(
    JSON.stringify({ order, orderId, expires: Date.now() + 7 * 86400000 }),
  ).toString("base64url");
  return `${payload}.${crypto.createHmac("sha256", secret()).update(payload).digest("base64url")}`;
}
export function readSignedOrder(token: string, orderId: string): BookingOrder {
  if (typeof token !== "string" || token.length > 100000)
    throw new Error(
      "Invalid payment session. Please contact the studio with your payment ID.",
    );
  const [payload, signature] = token.split(".");
  if (!payload || !signature) throw new Error("Invalid payment session.");
  const expected = crypto
    .createHmac("sha256", secret())
    .update(payload)
    .digest();
  const supplied = Buffer.from(signature, "base64url");
  if (
    expected.length !== supplied.length ||
    !crypto.timingSafeEqual(expected, supplied)
  )
    throw new Error("Payment session could not be verified.");
  const parsed = JSON.parse(Buffer.from(payload, "base64url").toString());
  if (
    parsed.orderId !== orderId ||
    !parsed.expires ||
    parsed.expires < Date.now()
  )
    throw new Error(
      "Payment session has expired. Please call the studio with your payment ID.",
    );
  // The authenticated snapshot is intentionally not revalidated against today's date:
  // a delayed payment confirmation must remain recoverable after the appointment date.
  return parsed.order;
}
