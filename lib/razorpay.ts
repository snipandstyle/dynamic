import crypto from 'crypto';
import Razorpay from 'razorpay';
import dotenv from 'dotenv';

dotenv.config();

const KEY_ID = process.env.RAZORPAY_KEY_ID || process.env.VITE_RAZORPAY_KEY_ID || '';
const KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || '';

if (!KEY_ID || !KEY_SECRET) {
  console.warn('[Razorpay] Warning: RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET is not configured in environment variables.');
}

// Initialize official Razorpay SDK client
export const razorpayClient = new Razorpay({
  key_id: KEY_ID,
  key_secret: KEY_SECRET,
});

export interface CreateOrderParams {
  amount?: number; // in paise (e.g. 50000 = ₹500)
  amountPaise?: number; // alias
  currency?: string;
  receipt?: string;
  notes?: Record<string, string>;
}

/**
 * Creates an order on Razorpay servers
 * Minimum amount: 100 paise (₹1)
 */
export async function createRazorpayOrder(params: CreateOrderParams) {
  const amountPaise = params.amount ?? params.amountPaise;

  if (typeof amountPaise !== 'number' || isNaN(amountPaise) || amountPaise < 100) {
    const error: any = new Error('Amount must be at least 100 paise (₹1).');
    error.statusCode = 400;
    throw error;
  }

  const options = {
    amount: Math.round(amountPaise),
    currency: params.currency || 'INR',
    receipt: params.receipt || `rcpt_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    notes: params.notes || {},
  };

  try {
    const order = await razorpayClient.orders.create(options);
    return {
      order_id: order.id,
      id: order.id,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
      status: order.status,
    };
  } catch (err: any) {
    console.error('[Razorpay orders.create error]', err);
    const error: any = new Error(err.error?.description || err.message || 'Razorpay order creation failed.');
    error.statusCode = err.statusCode || 500;
    throw error;
  }
}

/**
 * Verifies Razorpay HMAC SHA256 payment signature
 * Algorithm: HMAC-SHA256(order_id + "|" + payment_id, KEY_SECRET)
 */
export function verifyRazorpaySignature({
  order_id,
  orderId,
  payment_id,
  paymentId,
  signature,
  razorpay_signature,
}: {
  order_id?: string;
  orderId?: string;
  payment_id?: string;
  paymentId?: string;
  signature?: string;
  razorpay_signature?: string;
}): boolean {
  const finalOrderId = order_id || orderId;
  const finalPaymentId = payment_id || paymentId;
  const finalSignature = signature || razorpay_signature;

  if (!finalOrderId || !finalPaymentId || !finalSignature) {
    return false;
  }

  try {
    const expectedSignature = crypto
      .createHmac('sha256', KEY_SECRET)
      .update(`${finalOrderId}|${finalPaymentId}`)
      .digest('hex');

    // Timing-safe comparison to prevent timing attacks
    const expectedBuffer = Buffer.from(expectedSignature, 'utf8');
    const signatureBuffer = Buffer.from(finalSignature, 'utf8');

    if (expectedBuffer.length !== signatureBuffer.length) {
      return false;
    }

    return crypto.timingSafeEqual(expectedBuffer, signatureBuffer);
  } catch (err) {
    console.error('[Razorpay verify signature error]', err);
    return false;
  }
}

/**
 * Verifies Razorpay Webhook Signature
 * Algorithm: HMAC-SHA256(rawBody, WEBHOOK_SECRET)
 */
export function verifyRazorpayWebhookSignature(
  rawBody: string,
  signatureHeader?: string | null,
  webhookSecret?: string
): boolean {
  const secret = webhookSecret || process.env.RAZORPAY_WEBHOOK_SECRET || 'snipnstyle_rzp_webhook_secret_2026';
  if (!rawBody || !signatureHeader || !secret) {
    return false;
  }

  try {
    const expected = crypto.createHmac('sha256', secret).update(rawBody).digest('hex');
    const expectedBuf = Buffer.from(expected, 'utf8');
    const signatureBuf = Buffer.from(signatureHeader, 'utf8');

    if (expectedBuf.length !== signatureBuf.length) {
      return false;
    }

    return crypto.timingSafeEqual(expectedBuf, signatureBuf);
  } catch (err) {
    console.error('[Razorpay Webhook Verification Error]', err);
    return false;
  }
}

