import { query } from './db';
import { hashPassword, comparePassword, signToken, verifyToken } from './auth';
import { createRazorpayOrder, verifyRazorpaySignature, verifyRazorpayWebhookSignature } from './razorpay';
import crypto from 'crypto';

// SEND ORDER ALERT EMAIL VIA GOOGLE APPS SCRIPT WEBHOOK (ZERO COST)
export async function sendOrderAlertEmail(bookingData: {
  bookingRef?: string;
  petName?: string;
  petBreed?: string;
  petWeightKg?: number | string;
  customerName?: string;
  customerPhone?: string;
  phone?: string;
  serviceType?: string;
  checkInDate?: string;
  dropOffTime?: string;
  totalAmount?: number | string;
  paymentStatus?: string;
  paymentMethod?: string;
  specialInstructions?: string;
  notes?: string;
  appliedOfferCode?: string;
}) {
  const webhookUrl = process.env.GOOGLE_SCRIPT_WEBHOOK_URL;
  if (!webhookUrl) {
    console.log('[sendOrderAlertEmail] Notice: GOOGLE_SCRIPT_WEBHOOK_URL not configured. Add it to .env or deployment env to receive Google Apps Script email alerts.');
    return;
  }

  try {
    const res = await fetch(webhookUrl, {
      method: 'POST',
      redirect: 'follow',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(bookingData),
    });
    console.log('[sendOrderAlertEmail] Google Script Webhook dispatch status:', res.status);
  } catch (err: any) {
    console.warn('[sendOrderAlertEmail] Webhook dispatch error (non-fatal):', err.message || err);
  }
}


// 1. SIGNUP (PHONE + PASSWORD)
export async function handleSignup(data: {
  fullName: string;
  phone: string;
  password: string;
  email?: string;
  role?: 'customer' | 'admin';
}) {
  const { fullName, phone, password, role = 'customer' } = data;

  if (!fullName || !phone || !password) {
    return { status: 400, body: { error: 'Full name, phone number, and password are required.' } };
  }

  // Normalize phone number (digits only, e.g. 10 digits)
  const cleanPhone = phone.replace(/\D/g, '').slice(-10);
  if (cleanPhone.length < 10) {
    return { status: 400, body: { error: 'Please enter a valid 10-digit mobile number.' } };
  }

  // Check if phone number already exists
  const existingPhone = await query('SELECT id FROM users WHERE phone_number = $1 OR phone_number = $2 LIMIT 1', [cleanPhone, `+91${cleanPhone}`]);
  if (existingPhone.rows.length > 0) {
    return { status: 409, body: { error: 'An account with this phone number already exists. Please log in.' } };
  }

  // Optional email
  const userEmail = data.email?.toLowerCase().trim() || `${cleanPhone}@snipandstyle.pet`;

  // Get default organization id from Neon DB
  const orgRes = await query('SELECT id FROM organizations LIMIT 1');
  const orgId = orgRes.rows[0]?.id || null;

  const passwordHash = await hashPassword(password);
  const userId = crypto.randomUUID();

  try {
    await query(
      `INSERT INTO users (id, organization_id, full_name, email, phone_number, password_hash, role, is_phone_verified, is_email_verified)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [userId, orgId, fullName.trim(), userEmail, cleanPhone, passwordHash, role, true, false]
    );
  } catch (err: any) {
    if (err.message && err.message.includes('unique constraint')) {
      return { status: 409, body: { error: 'An account with this phone number already exists. Please log in.' } };
    }
    throw err;
  }

  const token = signToken({
    userId,
    email: userEmail,
    role,
    name: fullName.trim(),
    phone: cleanPhone,
    orgId,
  });

  return {
    status: 201,
    body: {
      message: 'Account created successfully',
      token,
      user: {
        id: userId,
        fullName: fullName.trim(),
        email: userEmail,
        phone: cleanPhone,
        role,
      },
    },
  };
}

// 2. LOGIN (PHONE + PASSWORD)
export async function handleLogin(data: { phone?: string; email?: string; identifier?: string; password: string }) {
  const identifier = (data.phone || data.identifier || data.email || '').trim();
  const { password } = data;

  if (!identifier || !password) {
    return { status: 400, body: { error: 'Phone number and password are required.' } };
  }

  // Extract clean 10-digit phone if digits entered
  const cleanPhone = identifier.replace(/\D/g, '').slice(-10);

  // Query by phone_number or by email
  const res = await query(
    `SELECT id, organization_id, full_name, email, phone_number, password_hash, role 
     FROM users 
     WHERE phone_number = $1 OR phone_number = $2 OR email = $3 OR email = $4 
     LIMIT 1`,
    [cleanPhone || identifier, identifier, identifier.toLowerCase(), `${cleanPhone}@snipandstyle.pet`]
  );

  if (res.rows.length === 0) {
    // Admin fallback credentials
    if (identifier === 'admin@pawfarm.in' || identifier === 'admin@snipandstyle.pet' || identifier === '9739887770' || identifier === 'admin') {
      if (password === 'Admin@123' || password === 'admin') {
        const adminId = crypto.randomUUID();
        const token = signToken({
          userId: adminId,
          email: 'admin@snipandstyle.pet',
          role: 'admin',
          name: 'Snip & Style Administrator',
        });
        return {
          status: 200,
          body: {
            token,
            user: { id: adminId, fullName: 'Snip & Style Administrator', email: 'admin@snipandstyle.pet', phone: '9739887770', role: 'admin' },
          },
        };
      }
    }
    return { status: 401, body: { error: 'Invalid phone number or password.' } };
  }

  const user = res.rows[0];
  const isValid = await comparePassword(password, user.password_hash);
  if (!isValid) {
    // Fallback for demo admin credentials
    if (user.role === 'admin' && (password === 'admin' || password === 'Admin@123')) {
      // allow
    } else {
      return { status: 401, body: { error: 'Invalid phone number or password.' } };
    }
  }

  const token = signToken({
    userId: user.id,
    email: user.email,
    role: user.role as any,
    name: user.full_name,
    phone: user.phone_number,
    orgId: user.organization_id,
  });

  return {
    status: 200,
    body: {
      token,
      user: {
        id: user.id,
        fullName: user.full_name,
        email: user.email,
        phone: user.phone_number,
        role: user.role,
      },
    },
  };
}

// 3. GET CURRENT USER
export async function handleGetMe(authHeader?: string | null) {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { status: 401, body: { error: 'Authentication token required.' } };
  }

  const token = authHeader.replace('Bearer ', '').trim();
  const payload = verifyToken(token);
  if (!payload) {
    return { status: 401, body: { error: 'Invalid or expired token.' } };
  }

  const res = await query(
    'SELECT id, organization_id, full_name, email, phone_number, role FROM users WHERE id = $1 LIMIT 1',
    [payload.userId]
  );

  if (res.rows.length === 0) {
    return { status: 200, body: { user: payload } };
  }

  return { status: 200, body: { user: res.rows[0] } };
}

// 4. CREATE BOOKING / ORDER
export async function handleCreateBooking(data: any, authHeader?: string | null) {
  let userId: string | null = null;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const payload = verifyToken(authHeader.replace('Bearer ', '').trim());
    if (payload) userId = payload.userId;
  }

  // If unauthenticated guest, attach or create a guest user
  if (!userId) {
    const guestEmail = (data.email || `guest_${Date.now()}@snipandstyle.pet`).toLowerCase().trim();
    const cleanPhone = (data.phone || '').trim();

    // Check if user exists by email or by phone
    let existing;
    if (cleanPhone) {
      existing = await query('SELECT id FROM users WHERE email = $1 OR phone_number = $2 LIMIT 1', [guestEmail, cleanPhone]);
    } else {
      existing = await query('SELECT id FROM users WHERE email = $1 LIMIT 1', [guestEmail]);
    }

    if (existing.rows.length > 0) {
      userId = existing.rows[0].id;
    } else {
      userId = crypto.randomUUID();
      const orgRes = await query('SELECT id FROM organizations LIMIT 1');
      const tempHash = await hashPassword(crypto.randomBytes(16).toString('hex'));
      const phoneToInsert = cleanPhone || `guest_${Date.now()}`;
      try {
        await query(
          `INSERT INTO users (id, organization_id, full_name, email, phone_number, password_hash, role)
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [userId, orgRes.rows[0]?.id || null, data.parentName || 'Guest Pet Parent', guestEmail, phoneToInsert, tempHash, 'customer']
        );
      } catch (insertErr) {
        const fallbackUser = await query('SELECT id FROM users WHERE email = $1 OR phone_number = $2 LIMIT 1', [guestEmail, phoneToInsert]);
        if (fallbackUser.rows.length > 0) {
          userId = fallbackUser.rows[0].id;
        } else {
          throw insertErr;
        }
      }
    }
  }

  // Generate clean booking reference
  const randomRef = Math.floor(100000 + Math.random() * 900000);
  const bookingRef = `SNS-${randomRef}`;

  const bookingId = crypto.randomUUID();
  const orgRes = await query('SELECT id FROM organizations LIMIT 1');
  const orgId = orgRes.rows[0]?.id || null;

  const basePaise = Math.round((data.baseAmount || 0) * 100);
  const discountPaise = Math.round((data.discountAmount || 0) * 100);
  const addonsPaise = Math.round((data.addonsAmount || 0) * 100);
  const totalPaise = Math.round((data.totalAmount || 0) * 100);

  const checkIn = data.checkInDate || new Date().toISOString().split('T')[0];
  const checkOut = data.checkOutDate || checkIn;

  await query(
    `INSERT INTO bookings (
      id, booking_ref, organization_id, user_id, pet_name, pet_breed, pet_weight_kg,
      service_type, check_in_date, check_out_date, drop_off_time, pickup_time, number_of_days,
      base_amount_paise, discount_amount_paise, addons_amount_paise, total_amount_paise,
      status, payment_status, payment_method, applied_offer_code, is_highway_early_dropoff,
      departure_grooming_wash, emergency_contact, special_instructions, services_json
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7,
      $8, $9, $10, $11, $12, $13,
      $14, $15, $16, $17,
      $18, $19, $20, $21, $22,
      $23, $24, $25, $26
    )`,
    [
      bookingId,
      bookingRef,
      orgId,
      userId,
      String(data.petName || 'Companion').slice(0, 200),
      String(data.petBreed || 'Standard Breed').slice(0, 200),
      data.petWeightKg || 15.0,
      String(data.serviceType || 'Boarding').slice(0, 450),
      checkIn,
      checkOut,
      String(data.dropOffTime || '09:00 AM').slice(0, 200),
      String(data.pickupTime || '06:00 PM').slice(0, 200),
      data.numberOfDays || 1,
      basePaise,
      discountPaise,
      addonsPaise,
      totalPaise,
      'confirmed',
      String(data.paymentStatus || 'pending').slice(0, 80),
      String(data.paymentMethod || 'razorpay').slice(0, 80),
      data.appliedOfferCode ? String(data.appliedOfferCode).slice(0, 50) : null,
      data.isHighwayEarlyDropoff ?? true,
      data.departureGroomingWash ?? false,
      String(data.emergencyContact || data.phone || '').slice(0, 200),
      String(data.specialInstructions || ''),
      JSON.stringify(data.services_json || []),
    ]
  );

  // Dispatch zero-cost Google Apps Script Email Notification (asynchronous)
  sendOrderAlertEmail({
    bookingRef,
    petName: data.petName || 'Companion',
    petBreed: data.petBreed || 'Standard Breed',
    petWeightKg: data.petWeightKg || 15.0,
    customerName: data.parentName || 'Pet Parent',
    customerPhone: data.phone || data.emergencyContact || 'N/A',
    serviceType: data.serviceType || 'Boarding / Grooming',
    checkInDate: checkIn,
    dropOffTime: data.dropOffTime || '09:00 AM',
    totalAmount: data.totalAmount || (totalPaise / 100),
    paymentStatus: data.paymentStatus || 'pending',
    paymentMethod: data.paymentMethod || 'razorpay',
    specialInstructions: data.specialInstructions,
    appliedOfferCode: data.appliedOfferCode,
  }).catch((err) => console.warn('[sendOrderAlertEmail trigger warning]', err));

  return {
    status: 201,
    body: {
      message: 'Booking placed successfully',
      bookingId,
      bookingRef,
      totalAmountPaise: totalPaise,
    },
  };
}

// 5. GET USER'S BOOKINGS
export async function handleGetUserBookings(authHeader?: string | null) {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { status: 401, body: { error: 'Authentication required.' } };
  }

  const payload = verifyToken(authHeader.replace('Bearer ', '').trim());
  if (!payload) {
    return { status: 401, body: { error: 'Invalid token.' } };
  }

  const res = await query(
    `SELECT b.*, u.full_name as customer_name, u.email as customer_email, u.phone_number as customer_phone
     FROM bookings b
     JOIN users u ON b.user_id = u.id
     WHERE b.user_id = $1
     ORDER BY b.created_at DESC`,
    [payload.userId]
  );

  return { status: 200, body: { bookings: res.rows } };
}

// 6. ADMIN: GET ALL BOOKINGS
export async function handleGetAdminBookings(authHeader?: string | null) {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { status: 401, body: { error: 'Admin authentication required.' } };
  }

  const payload = verifyToken(authHeader.replace('Bearer ', '').trim());
  if (!payload || payload.role !== 'admin') {
    return { status: 403, body: { error: 'Unauthorized: Admin role required.' } };
  }

  const res = await query(
    `SELECT b.*, u.full_name as customer_name, u.email as customer_email, u.phone_number as customer_phone
     FROM bookings b
     LEFT JOIN users u ON b.user_id = u.id
     ORDER BY b.created_at DESC`
  );

  return { status: 200, body: { bookings: res.rows } };
}

// 7. ADMIN: UPDATE BOOKING STATUS
export async function handleUpdateAdminBooking(
  bookingId: string,
  data: { status?: string; paymentStatus?: string },
  authHeader?: string | null
) {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { status: 401, body: { error: 'Admin authentication required.' } };
  }

  const payload = verifyToken(authHeader.replace('Bearer ', '').trim());
  if (!payload || payload.role !== 'admin') {
    return { status: 403, body: { error: 'Unauthorized: Admin role required.' } };
  }

  const updates: string[] = [];
  const values: any[] = [];
  let idx = 1;

  if (data.status) {
    updates.push(`status = $${idx++}`);
    values.push(data.status);
  }
  if (data.paymentStatus) {
    updates.push(`payment_status = $${idx++}`);
    values.push(data.paymentStatus);
  }

  if (updates.length === 0) {
    return { status: 400, body: { error: 'No fields to update.' } };
  }

  values.push(bookingId);
  await query(`UPDATE bookings SET ${updates.join(', ')}, updated_at = NOW() WHERE id = $${idx}`, values);

  return { status: 200, body: { message: 'Booking updated successfully' } };
}

// 8. RAZORPAY: CREATE ORDER
export async function handleCreateRazorpayOrderRoute(data: {
  amount?: number;
  amountPaise?: number;
  currency?: string;
  receipt?: string;
  bookingRef?: string;
  notes?: any;
}) {
  try {
    const rawAmount = data.amount ?? data.amountPaise;
    if (typeof rawAmount !== 'number' || isNaN(rawAmount) || rawAmount < 100) {
      return { status: 400, body: { error: 'Amount must be at least 100 paise (₹1).' } };
    }

    const order = await createRazorpayOrder({
      amountPaise: Math.round(rawAmount),
      currency: data.currency || 'INR',
      receipt: data.receipt || data.bookingRef || `rec_${Date.now()}`,
      notes: data.notes || {},
    });

    return {
      status: 200,
      body: {
        order_id: order.id,
        id: order.id,
        amount: order.amount,
        currency: order.currency,
        receipt: order.receipt,
        status: order.status,
        key_id:
          process.env.RAZORPAY_KEY_ID ||
          process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ||
          process.env.VITE_RAZORPAY_KEY_ID ||
          'rzp_live_TjVYMuSit6eIYP',
      },
    };
  } catch (err: any) {
    console.error('[handleCreateRazorpayOrderRoute Error]', err);
    const status = err.statusCode === 401 ? 401 : err.statusCode === 400 ? 400 : 500;
    return { status, body: { error: err.message || 'Failed to create Razorpay order.' } };
  }
}

// 9. RAZORPAY: VERIFY PAYMENT
export async function handleVerifyRazorpayPaymentRoute(data: {
  order_id?: string;
  orderId?: string;
  razorpay_order_id?: string;
  payment_id?: string;
  paymentId?: string;
  razorpay_payment_id?: string;
  signature?: string;
  razorpay_signature?: string;
  bookingId?: string;
}) {
  const orderId = data.order_id || data.orderId || data.razorpay_order_id;
  const paymentId = data.payment_id || data.paymentId || data.razorpay_payment_id;
  const signature = data.signature || data.razorpay_signature;

  if (!orderId || !paymentId || !signature) {
    return {
      status: 400,
      body: {
        success: false,
        error: 'Missing required payment verification fields (order_id, payment_id, signature).',
      },
    };
  }

  const isValid = verifyRazorpaySignature({
    order_id: orderId,
    payment_id: paymentId,
    signature: signature,
  });

  if (!isValid) {
    return {
      status: 400,
      body: {
        success: false,
        error: 'Invalid payment signature. Verification failed.',
      },
    };
  }

  // If a bookingId is provided, update Neon DB booking record and dispatch paid alert
  if (data.bookingId) {
    try {
      const updateRes = await query(
        `UPDATE bookings 
         SET payment_status = 'paid', 
             razorpay_order_id = $1, 
             razorpay_payment_id = $2, 
             razorpay_signature = $3,
             updated_at = NOW()
         WHERE id = $4
         RETURNING *`,
        [orderId, paymentId, signature, data.bookingId]
      );

      if (updateRes.rows.length > 0) {
        const b = updateRes.rows[0];
        const uRes = await query('SELECT full_name, phone_number FROM users WHERE id = $1 LIMIT 1', [b.user_id]);
        const user = uRes.rows[0] || {};
        sendOrderAlertEmail({
          bookingRef: b.booking_ref,
          petName: b.pet_name,
          petBreed: b.pet_breed,
          petWeightKg: b.pet_weight_kg,
          customerName: user.full_name || 'Pet Parent',
          customerPhone: user.phone_number || b.emergency_contact,
          serviceType: b.service_type,
          checkInDate: b.check_in_date,
          dropOffTime: b.drop_off_time,
          totalAmount: b.total_amount_paise ? b.total_amount_paise / 100 : 0,
          paymentStatus: 'paid',
          paymentMethod: 'razorpay_online',
          specialInstructions: b.special_instructions,
          appliedOfferCode: b.applied_offer_code,
        }).catch((err) => console.warn('[sendOrderAlertEmail verification warning]', err));
      }
    } catch (dbErr) {
      console.warn('[handleVerifyRazorpayPaymentRoute DB Update Warning]', dbErr);
    }
  }

  return {
    status: 200,
    body: {
      success: true,
      message: 'Payment verified and confirmed successfully!',
      order_id: orderId,
      payment_id: paymentId,
      bookingId: data.bookingId,
      status: 'paid',
    },
  };
}

// 10. RAZORPAY WEBHOOK HANDLER
export async function handleRazorpayWebhookRoute(
  body: any,
  rawBody: string,
  signatureHeader?: string | null
) {
  // 1. Verify webhook signature
  const isValid = verifyRazorpayWebhookSignature(rawBody, signatureHeader);
  if (!isValid) {
    console.warn('[handleRazorpayWebhookRoute] Webhook HMAC SHA256 signature verification failed.');
    return { status: 400, body: { error: 'Invalid webhook signature.' } };
  }

  const event = body?.event;
  console.log(`[handleRazorpayWebhookRoute] Verified webhook event received: ${event}`);

  // 2. Handle payment/order success events
  if (event === 'payment.captured' || event === 'order.paid') {
    const payment = body?.payload?.payment?.entity;
    const order = body?.payload?.order?.entity;
    const orderId = payment?.order_id || order?.id;
    const paymentId = payment?.id;

    if (orderId) {
      try {
        const updateRes = await query(
          `UPDATE bookings 
           SET payment_status = 'paid', 
               razorpay_payment_id = COALESCE($1, razorpay_payment_id), 
               updated_at = NOW() 
           WHERE razorpay_order_id = $2
           RETURNING *`,
          [paymentId, orderId]
        );

        if (updateRes.rows.length > 0) {
          const b = updateRes.rows[0];
          const uRes = await query('SELECT full_name, phone_number FROM users WHERE id = $1 LIMIT 1', [b.user_id]);
          const user = uRes.rows[0] || {};

          sendOrderAlertEmail({
            bookingRef: b.booking_ref,
            petName: b.pet_name,
            petBreed: b.pet_breed,
            petWeightKg: b.pet_weight_kg,
            customerName: user.full_name || 'Pet Parent',
            customerPhone: user.phone_number || b.emergency_contact,
            serviceType: b.service_type,
            checkInDate: b.check_in_date,
            dropOffTime: b.drop_off_time,
            totalAmount: b.total_amount_paise ? b.total_amount_paise / 100 : 0,
            paymentStatus: 'paid',
            paymentMethod: 'razorpay_webhook',
            specialInstructions: b.special_instructions,
            appliedOfferCode: b.applied_offer_code,
          }).catch((err) => console.warn('[sendOrderAlertEmail webhook warning]', err));
        }
      } catch (err) {
        console.error('[handleRazorpayWebhookRoute DB error]', err);
      }
    }
  } else if (event === 'payment.failed') {
    const payment = body?.payload?.payment?.entity;
    const orderId = payment?.order_id;
    if (orderId) {
      try {
        await query(
          `UPDATE bookings SET payment_status = 'failed', updated_at = NOW() WHERE razorpay_order_id = $1`,
          [orderId]
        );
      } catch (err) {
        console.error('[handleRazorpayWebhookRoute payment.failed DB error]', err);
      }
    }
  }

  return { status: 200, body: { status: 'ok', received: true, event } };
}

// 10. OFFERS
export async function handleGetOffersRoute() {
  const res = await query('SELECT * FROM offers WHERE is_active = true ORDER BY discount_percent DESC');
  return { status: 200, body: { offers: res.rows } };
}

// 11. HEALTH CHECK
export async function handleHealthCheckRoute() {
  const dbRes = await query('SELECT 1 as live');
  return {
    status: 200,
    body: {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: dbRes.rows[0]?.live === 1 ? 'connected' : 'error',
    },
  };
}
