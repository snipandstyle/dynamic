import { NextResponse } from "next/server";
import { readSignedOrder } from "../../../../lib/booking-order";
import { verifyRazorpaySignature } from "../../../../lib/razorpay";
import {
  finalizeBookingPayment,
  PaymentBookingError,
} from "../../../../lib/booking-payment";

export async function POST(request: Request) {
  let body;
  let order;
  try {
    body = await request.json();
    if (
      typeof body.order_id !== "string" ||
      typeof body.payment_id !== "string" ||
      typeof body.signature !== "string"
    )
      throw new Error("Missing payment details.");
    order = readSignedOrder(body.token, body.order_id);
    if (!verifyRazorpaySignature(body))
      throw new Error(
        "Payment verification failed. Please call the studio with your payment ID.",
      );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Invalid payment details.",
      },
      { status: 400 },
    );
  }
  try {
    return NextResponse.json(
      await finalizeBookingPayment(
        order,
        body.order_id,
        body.payment_id,
        body.signature,
      ),
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof PaymentBookingError
            ? error.message
            : "Your payment could not be matched to a saved booking yet. Use “Verify payment” to retry; do not pay again. If this continues, call +91 97398 87770 with your payment ID.",
      },
      { status: error instanceof PaymentBookingError ? error.status : 503 },
    );
  }
}
