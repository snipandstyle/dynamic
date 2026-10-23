import fs from 'node:fs';
fs.writeFileSync('START-HERE.md',`# Snip & Style — restored booking website

Independent project: D:\\Website\\Snipnstyle\\snip-style-restored. The original v3 and v3-customer-ui folders were not edited.

Run npm run dev and open http://localhost:3010. Production: npm run build, then npm start.

## Customer experience

- Cream/green illustrated design, lowercase header wordmark, sticky Call Now and local generated WebP imagery.
- Compact boarding card; choose breed OR weight. Grooming uses the supplied breed categories separately from boarding weight bands.
- Horizontal grooming cards on mobile. Confirmation popup shows inclusions, optional extras and the complete payable price.
- Four dog/cat packages, quick care and fourteen bundles share data/catalog.ts. ₹1,799 and ₹2,199 are final prices, with no automatic extra 10% discount. Cat bundles respect short/long coat prices.
- Six-night stays receive one free night; 4/8/15 nights receive the supplied grooming reward.
- Guest cart/checkout, arrival windows, signed payment order, captured-payment verification and durable Neon booking.
- Admin booking status updates and session-pass tracking. Repeated stale redemption requests are rejected.

## Backend and verification

Existing Neon, JWT, live Razorpay and alert settings are configured server-side in ignored .env. Test credentials are separate in ignored .env.test.local. Never publish environment files or .sandbox-qa.json.

npm run test:payment-sandbox starts port 3014 using isolated sns_checkout_test Neon tables. Test records do not enter production tables and staff alerts are disabled. Sandbox admin credentials are local in ignored .sandbox-qa.json.

Verified: production build, TypeScript, scoped lint, 27 pricing/security/booking regressions, five authenticated admin routes, actual Razorpay test payment → captured verification → Neon booking, duplicate callbacks and signed webhook replay, one bundle entitlement, admin status change and duplicate-safe session redemption. Evidence: artifacts/production/.

Before public launch: deploy this folder with server environment variables; configure/verify Razorpay payment.captured delivery to https://snipandstyle.pet/api/razorpay/webhook using the matching secret; verify a real staff alert arrives. Local signed webhook replay does not verify external dashboard delivery. Public deployment and staff alert receipt have not been verified. Rotate credentials by replacing local and hosting values.

## Editing

Homepage: components/booking/ReferenceStorefront.tsx. Hero: LandingHero.tsx. Final styles: app/exact-booking.css. Active checkout: BookingCheckout.tsx. Keep legacy checkout components disconnected.

Checks: npm run lint:booking; npm run test:booking; npm run build; npm run check:production.

Source backup excludes dependencies, builds, artifacts, environment files and sandbox credentials.
`);
const f='scripts/production-check.mjs';let s=fs.readFileSync(f,'utf8');s=s.replace('Complete Razorpay test-mode payment, duplicate verification, and browser-closed webhook recovery before launch.','Actual test payment, repeated confirmation and signed webhook replay passed; verify external provider delivery after deployment.');fs.writeFileSync(f,s);
