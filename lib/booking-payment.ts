import { BookingOrder, readSignedOrder, quoteBookingOrder } from "./booking-order";
import { addDays, SUPER_SAVER_BUNDLES } from "../data/catalog";
import {ensureBundlePasses,bundleExpiry} from "./bundle-passes";
import { razorpayClient } from "./razorpay";
import { pool, query } from "./db";
import { handleCreateBooking } from "./api-handlers";

export class PaymentBookingError extends Error {
  constructor(
    message: string,
    public status = 503,
  ) {
    super(message);
  }
}

export async function savePaymentSession(orderId: string, token: string) {
  await ensureBundlePasses();
  // This project has no migration runner. The additive table is initialized before
  // returning any payable order; a schema failure therefore cannot collect money.
  await query(`CREATE TABLE IF NOT EXISTS booking_payment_sessions (
    order_id TEXT PRIMARY KEY,
    signed_token TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`);
  await query(
    "INSERT INTO booking_payment_sessions (order_id, signed_token) VALUES ($1, $2)",
    [orderId, token],
  );
}

export async function recoverCapturedPayment(
  orderId: string,
  paymentId: string,
) {
  const table = await query(
    "SELECT to_regclass('booking_payment_sessions') AS name",
  );
  if (!table.rows[0]?.name) return null;
  const session = await query(
    "SELECT signed_token FROM booking_payment_sessions WHERE order_id = $1",
    [orderId],
  );
  if (!session.rows.length) return null;
  const order = readSignedOrder(session.rows[0].signed_token, orderId);
  return finalizeBookingPayment(order, orderId, paymentId);
}

export async function finalizeBookingPayment(
  order: BookingOrder,
  orderId: string,
  paymentId: string,
  signature?: string,
) {
  const quote = quoteBookingOrder(order);
  const payment = await razorpayClient.payments.fetch(paymentId);
  if (
    payment.order_id !== orderId ||
    Number(payment.amount) !== Math.round(quote.total * 100) ||
    payment.currency !== "INR"
  )
    throw new PaymentBookingError(
      "Payment details do not match this booking. Please contact the studio.",
      400,
    );
  if (payment.status !== "captured")
    throw new PaymentBookingError(
      "Your payment has not been captured yet. Please wait a moment and use “Verify payment” again. Do not pay again.",
      409,
    );
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await client.query("SELECT pg_advisory_xact_lock(hashtext($1))", [orderId]);
    const existing = await client.query(
      "SELECT id, booking_ref FROM bookings WHERE razorpay_order_id = $1 AND payment_status = $2 LIMIT 1",
      [orderId, "paid"],
    );
    let bookingRef: string = existing.rows[0]?.booking_ref;
    const primary = order.items[0];
    const schedule = order.schedules[primary.id];
    const services = quote.lines.map((line) => ({
      ...line.item,
      name: line.name,
      total: line.total,
      offer: line.offer,
      perk: line.perk,
      bundle: line.item.category === "bundle" ? SUPER_SAVER_BUNDLES.find(b=>b.id===line.item.serviceId) : undefined,
      ...order.schedules[line.item.id],
      checkOutDate:
        line.item.category === "boarding"
          ? addDays(order.schedules[line.item.id].date, line.item.nights)
          : order.schedules[line.item.id].date,
    }));
    if (!bookingRef) {
      const result = await handleCreateBooking({
        parentName: order.customer.name,
        phone: order.customer.phone,
        petName: order.items.map((item) => item.petName).join(", "),
        petBreed: primary.breed || primary.petType,
        petWeightKg:
          primary.petType === "cat"
            ? 4.5
            : { small: 7.5, medium: 18, large: 32 }[primary.petSize],
        serviceType: services
          .map((s) => `${s.name}${s.quantity > 1 ? ` x${s.quantity}` : ""}`)
          .join(" + "),
        checkInDate: schedule.date,
        checkOutDate:
          primary.category === "boarding"
            ? addDays(schedule.date, primary.nights)
            : schedule.date,
        dropOffTime: schedule.slot,
        numberOfDays: primary.category === "boarding" ? primary.nights : 1,
        baseAmount: quote.base,
        discountAmount: quote.discount,
        addonsAmount: quote.extras,
        totalAmount: quote.total,
        paymentStatus: "paid",
        paymentMethod: "razorpay_gateway",
        appliedOfferCode:
          [...new Set([...quote.lines.map((l) => l.offer), order.coupon?.code].filter(Boolean))].join(
            "+",
          ) || null,
        departureGroomingWash: quote.lines.some((l) => !!l.perk),
        emergencyContact: order.customer.phone,
        specialInstructions: JSON.stringify({
          customerNotes: [order.customer.notes, order.coupon?.benefit ? `Coupon ${order.coupon.code}: ${order.coupon.benefit}` : ''].filter(Boolean).join('\n'),
          couponBenefit: order.coupon?.benefit,
          services,
        }),
        services_json: services,
        razorpay_order_id: orderId,
        razorpay_payment_id: paymentId,
        razorpay_signature: signature || null,
      });
      if (result.status !== 201 || !result.body.bookingRef)
        throw new Error("Booking could not be saved.");
      bookingRef = result.body.bookingRef;
    }
    for (const service of services) {
      if (!service.bundle) continue;
      const months=parseInt(service.bundle.validity,10);
      await client.query(`INSERT INTO booking_bundle_passes (id,order_id,service_line_id,booking_ref,bundle_id,bundle_name,pet_name,pet_type,coat_type,sessions_total,valid_from,valid_until) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) ON CONFLICT (order_id,service_line_id) DO NOTHING`,[crypto.randomUUID(),orderId,service.id,bookingRef,service.bundle.id,service.bundle.name,service.petName||"Pet",service.petType,service.coatType||service.bundle.coatType||null,service.bundle.sessions*service.quantity,service.date,bundleExpiry(service.date,months)]);
    }
    await client.query("COMMIT");
    // A paid booking is the authority for converting an enquiry, including webhook recovery.
    await query("UPDATE abandoned_checkouts SET status = 'converted', updated_at = NOW() WHERE (phone = $1 OR phone = $2) AND status != 'converted'", [order.customer.phone, '+91' + order.customer.phone]).catch(() => {
      console.warn('[booking] Lead status update pending; paid booking remains saved.');
    });
    return {
      success: true,
      bookingRef,
      total: quote.total,
      services: services.map((s) => ({
        name: s.name,
        date: s.date,
        slot: s.slot,
        petName: s.petName,
        nights: s.nights,
        quantity: s.quantity,
        category: s.category,
      })),
    };
  } catch (error) {
    await client.query("ROLLBACK").catch(() => {});
    throw error;
  } finally {
    client.release();
  }
}
