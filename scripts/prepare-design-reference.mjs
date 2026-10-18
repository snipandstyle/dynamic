import fs from 'node:fs';
const source = fs.readFileSync('public/design-reference.html','utf8');
const images = [...source.matchAll(/<img\b[^>]*\bsrc="([^"]+)"/g)].map(match => match[1]);
const map = source.match(/background-image: url\('([^']+)'\)/)?.[1];
fs.writeFileSync('data/reference-assets.ts',`// Image URLs supplied in the user's design reference.\nexport const referenceImages = ${JSON.stringify({boarding:images[0],grooming:images.slice(1),map},null,2)} as const;\n`);
