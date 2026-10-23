import fs from 'node:fs';
const f='lib/razorpay.ts';const s=fs.readFileSync(f,'utf8');const cleaned=s.replace(/const secret = webhookSecret \|\| process\.env\.RAZORPAY_WEBHOOK_SECRET \|\| '[^']*';/,"const secret = webhookSecret || process.env.RAZORPAY_WEBHOOK_SECRET || '';" );if(cleaned===s)throw Error('Expected webhook fallback not found');fs.writeFileSync(f,cleaned);
const old='artifacts/snip-style-exact-prices-production-source.zip';if(fs.existsSync(old))fs.unlinkSync(old);
