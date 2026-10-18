# Customer UI review copy

This is an independent copy at `D:\Website\Snipnstyle\v3-customer-ui`.
Work here does not change the original `v3` folder.

Start with `npm run dev` and open `http://localhost:3002`.

The active storefront is `components/booking/ReferenceStorefront.tsx`, following the supplied HTML design:

- Cream and green styling, pill navigation, centred headline, and service switcher follow the reference.
- Festival offers appear in the hero and above the service packages.
- Pet size and breed selection update canonical prices throughout the page.
- Grooming packages scroll horizontally, with snap points and arrows that disable at either end.
- Mobile cards show the next card peeking in; package descriptions expand on tap.
- The cart, shared offer pricing, and guided checkout remain in this copy.

The active theme is `app/reference.css`; shared cart and checkout styling is in `app/booking.css`. Existing local pet photos replace reference images containing baked-in sample prices. The supplied HTML remains at `public/design-reference.html` for comparison.

Run `npm run lint:booking`, `npm run test:booking`, and `npm run build` for validation. No live payments are made by the regression suite.
