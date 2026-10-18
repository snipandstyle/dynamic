# Booking experience

The storefront uses `data/catalog.ts` for advertised prices, package inclusions, and automatic offers. Update this catalogue when rates change. Both the server and the browser calculate totals from it; the payment server ignores client-supplied prices.

## Customer flow

- `/` and `/grooming`: dog/cat menu with visible package comparisons and exact size prices.
- `/boarding`: nightly rates, stay-length selection, and automatic departure perks.
- `/cart`: persistent multi-service cart, pet types/weights, quantities, extras, removal, and the complete total.
- `/checkout`: guest details per service, individual visit dates/arrival windows, final review, Razorpay payment, and a saved booking reference.

GROOM10 applies an extra 10% to grooming packages whose advertised base price is above ₹999. Extras do not increase eligibility. STAY6FREE1 deducts one night from a boarding stay of at least six nights. Departure spa perks apply at four, eight, and fifteen nights, using the highest applicable tier. Prices and thresholds preserve the offers shown in the previous storefront.

## Payment reliability

`POST /api/booking/order` validates all details, checks database connectivity, recalculates the cart, creates a Razorpay order, and persists a signed order snapshot before returning an order that the customer can pay.

An additive `booking_payment_sessions` table is initialized with `CREATE TABLE IF NOT EXISTS` on first order creation. The database role needs CREATE permission in the public schema. Failure to initialize or save a session prevents the payment window from opening. Existing tables and historical bookings are preserved.

`POST /api/booking/confirm` checks the signed snapshot, payment signature, provider order ID, amount, currency, and captured payment status. Booking creation is serialized by payment order with a PostgreSQL advisory lock. Duplicate callbacks return the original booking. Failed verification or persistence never displays success.

The existing `/api/razorpay/webhook` handler also recovers persisted orders on verified `payment.captured` events. Ensure the production Razorpay webhook points to this endpoint and has `payment.captured` enabled, with the matching `RAZORPAY_WEBHOOK_SECRET`. The alternate existing webhook route uses the same handler. Recovery failures return 503 so Razorpay can retry. Browser recovery remains available through the saved payment session.

Required existing configuration: `DATABASE_URL`, `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, and `RAZORPAY_WEBHOOK_SECRET`. Existing booking email notifications use `GOOGLE_SCRIPT_WEBHOOK_URL`. Keep all secrets server-side.

Arrival windows are customer drop-off windows, not an inventory-based appointment capacity system. Specific start times and transport are handled by the studio. Each service’s chosen date, window, pet details, extras and total are saved in `services_json` and in booking notes; the primary service supplies the legacy booking date columns.

## Checks

```sh
npm run dev
npm run test:booking
npm run lint:booking
npm run build
```

The regression suite runs actual pricing, signing, order and confirmation logic with database/payment IO mocked. It makes no financial transactions and creates no real bookings. The pre-existing repository-wide `npm run lint` has no ESLint 9 configuration; `lint:booking` provides a scoped configuration for this implementation.

Before production rollout, perform one Razorpay test-mode payment, verify the resulting booking and all service lines in the dashboard, test a duplicate callback, and confirm recovery after closing the browser during payment. No live payment was made as part of local verification.
