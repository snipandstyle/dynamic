import { BookingOrder, readSignedOrder } from "./booking-order";
import { addDays, quoteCart } from "../data/catalog";
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
  const quote = quoteCart(order.items);
  const payment = await razorpayClient.payments.fetch(paymentId);
  if (
    payment.order_id !== orderId ||
    Number(payment.amount) !== quote.total * 100 ||
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
          [...new Set(quote.lines.map((l) => l.offer).filter(Boolean))].join(
            "+",
          ) || null,
        departureGroomingWash: quote.lines.some((l) => !!l.perk),
        emergencyContact: order.customer.phone,
        specialInstructions: JSON.stringify({
          customerNotes: order.customer.notes,
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
    await client.query("COMMIT");
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
