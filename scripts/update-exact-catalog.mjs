import fs from 'node:fs';
let s=fs.readFileSync('data/catalog.ts','utf8');
s=s.replace('  breed?: string;','  breed?: string;\n  coatType?: "short" | "long";\n  selectionMode?: "breed" | "size";');
s=s.replace('    price: 499,\n    originalPrice: 699,\n    description: "Neatens facial','    price: 499,\n    homePrice: 625,\n    originalPrice: 699,\n    description: "Neatens facial');
s=s.replace('    price: 749,\n    originalPrice: 999,','    price: 749,\n    homePrice: 938,\n    originalPrice: 999,');
s=s.replace('base = bundle.prices.short || 4874;','base = bundle.prices[item.coatType === "long" ? "long" : "short"]!;');
s=s.replace('original = Math.round(base * 1.3);','original = base;');
s=s.replace('      : base > 999\n        ? Math.round(base * 0.1)\n        : 0;', '      : 0;');
s=s.replace('        : "GROOM10"','        : ""');
const start=s.indexOf('  if (\n    raw.category === "addon"');
s=s.slice(0,start)+`  if (raw.category === "boarding" && raw.serviceId !== "boarding") throw new Error("Invalid boarding service.");
  if (raw.category === "bundle") {
    const bundle = SUPER_SAVER_BUNDLES.find(b => b.id === raw.serviceId);
    if (!bundle || bundle.petType !== raw.petType) throw new Error("Please select a valid bundle for your pet.");
    if (raw.petType === "cat" && !["short", "long"].includes(raw.coatType || "")) throw new Error("Select your cat’s coat type.");
  }
`+s.slice(start);
fs.writeFileSync('data/catalog.ts',s);
