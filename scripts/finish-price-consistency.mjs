import fs from 'node:fs';
function change(f,from,to){let s=fs.readFileSync(f,'utf8');if(!s.includes(from))throw Error('Missing target in '+f);fs.writeFileSync(f,s.replace(from,to));}
change('components/booking/BookingUI.tsx',': SIZE_LABELS[line.item.petSize]',': line.item.category === "boarding" ? SIZE_LABELS[line.item.petSize] : `${line.item.petSize} breed`');
change('components/booking/ReferenceStorefront.tsx','{price.offer ? " · Extra 10% off included" : " · Offer price"}','{" · Listed package price"}');
change('scripts/booking.test.cjs','serviceId: "puppy-kitten-spa",','serviceId: overrides.category === "boarding" ? "boarding" : "puppy-kitten-spa",');
change('scripts/booking.test.cjs','q.base - (q.base > 999 ? Math.round(q.base * 0.1) : 0)','q.base');
change('scripts/booking.test.cjs','offer eligibility excludes ₹999 and includes ₹1,099','listed grooming prices are final with no automatic extra discount');
change('scripts/booking.test.cjs','    110,','    0,');
change('scripts/booking.test.cjs','(449 + 186) * 2 + 1979','(449 + 186) * 2 + 2199');
change('scripts/booking.test.cjs','assert.equal(charged, 242800)','assert.equal(charged, 264800)');
// Keep dormant legacy components consistent, too.
change('components/booking/CartPage.tsx','line.offer === "GROOM10"','line.offer === "LISTED_PRICE"');
change('components/booking/CartPage.tsx','"10% festival offer"','"Listed package price"');
