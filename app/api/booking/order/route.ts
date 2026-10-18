import { NextResponse } from "next/server";
import { validateOrder, signOrder } from "../../../../lib/booking-order";
import { quoteCart } from "../../../../data/catalog";
import { createRazorpayOrder } from "../../../../lib/razorpay";
import { query } from "../../../../lib/db";
import { savePaymentSession } from "../../../../lib/booking-payment";
export async function POST(request: Request) {
  let order;
  try {
    order = validateOrder(await request.json());
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Invalid booking details.",
      },
      { status: 400 },
    );
  }
  try {
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET)
      throw new Error(
        "Online payments are temporarily unavailable. Please call +91 97398 87770 to book.",
      );
    // Do not collect payment while the booking database is unreachable.
    await query("SELECT 1");
    const quote = quoteCart(order.items);
    const payment = await createRazorpayOrder({
      amountPaise: quote.total * 100,
      currency: "INR",
      receipt: `sns_${crypto.randomUUID().slice(0, 24)}`,
      notes: { source: "booking_v2", service_count: String(quote.count) },
    });
    const token = signOrder(order, payment.order_id);
    await savePaymentSession(payment.order_id, token);
    return NextResponse.json({
      order_id: payment.order_id,
      amount: payment.amount,
      key_id: process.env.RAZORPAY_KEY_ID,
      token,
    });
  } catch {
    return NextResponse.json(
      {
        error:
          "We couldn’t prepare your payment right now. Your cart is saved. Please try again or call +91 97398 87770.",
      },
      { status: 503 },
    );
  }
}
