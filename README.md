# Snip & Style

Mobile-first pet grooming and cage-free boarding booking website for snipandstyle.pet, built with Next.js, PostgreSQL/Neon and Razorpay.

## Run locally

Install with npm ci. Copy .env.example to .env and supply server credentials locally. Run npm run dev, then open http://localhost:3010.

Production: npm run build followed by npm start. The repository root is the Next.js application; Vercel is configured in vercel.json.

## Booking and administration

Customers can book without an account, or create an account to view bookings. They choose boarding or grooming, confirm breed OR size, optionally select extras, review a persistent cart, choose dates and pay through Razorpay.

One catalogue in data/catalog.ts calculates homepage, popup, cart and server-side checkout totals. It contains the supplied dog/cat grooming, boarding, add-on and short/long-coat bundle prices. Listed grooming and bundle prices receive no additional automatic 10% reduction. Six-night stays include one free night; stays of 4/8/15 nights receive the appropriate departure grooming reward.

The server verifies the captured provider payment, amount, currency and signature before saving all service lines in Neon. Duplicate confirmations and signed webhook replays do not create duplicate bookings or bundle passes. Admins sign in at /admin with an existing authorized database account and can manage bookings, leads, customers and bundle session passes.

## Environment and deployment

Configure DATABASE_URL, DIRECT_DATABASE_URL, JWT_SECRET, RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET, RAZORPAY_WEBHOOK_SECRET, GOOGLE_SCRIPT_WEBHOOK_URL and NEXT_PUBLIC_SITE_URL on the host. Keep all secrets server-side. Live Razorpay values are configured locally for the final release; Git excludes real environment files and sandbox credentials.

Connect the deployed snipandstyle.pet domain and configure Razorpay payment.captured delivery to https://snipandstyle.pet/api/razorpay/webhook using the matching secret. Verify provider webhook delivery and receipt of a staff alert on the deployed domain before opening public orders. Local verification does not establish those external dashboard settings.

## Verification

npm run test:booking runs the pricing, account-safety and payment regressions. npm run lint:booking checks the active booking code. npm run build creates the production build. npm run check:production performs read-only live credential and schema checks.

npm run test:payment-sandbox starts an isolated test server on 3014. It uses test Razorpay keys from ignored .env.test.local and private sns_checkout_test Neon tables. Staff alerts are disabled and production customer tables are not used. Account-flow and real captured-payment evidence is saved locally under ignored artifacts/production/.

## Source layout

Main storefront: components/booking/ReferenceStorefront.tsx. Hero: LandingHero.tsx. Checkout: BookingCheckout.tsx. Final responsive styles: app/exact-booking.css. Avoid reconnecting the legacy checkout implementations.

This project is the separate snip-style-restored folder. Its Git origin is https://github.com/snipandstyle/dynamic.git; v3 and v3-customer-ui remain separate source folders.
