import fs from 'node:fs';
// Keep credentials only in ignored environment files, never source or examples.
for (const name of ['lib/db.ts', ...fs.readdirSync('scripts').filter(n=>/\.(mjs|cjs|js)$/.test(n)).map(n=>'scripts/'+n)]) {
  if(name.endsWith('harden-production.mjs')) continue;
  let s=fs.readFileSync(name,'utf8');
  s=s.replace(/'postgresql:\/\/[^']+'/g,"''").replace(/"postgresql:\/\/[^\"]+"/g,'""');
  fs.writeFileSync(name,s);
}
let handlers=fs.readFileSync('lib/api-handlers.ts','utf8');
handlers=handlers.replace("const { fullName, phone, password, role = 'customer' } = data;", "const { fullName, phone, password } = data;\n  const role = 'customer' as const;\n  if (typeof fullName !== 'string' || typeof phone !== 'string' || typeof password !== 'string' || password.length < 8) return { status: 400, body: { error: 'Enter your name, phone number, and a password of at least 8 characters.' } }; ");
const a=handlers.indexOf('    const existingUser = existingPhone.rows[0];');
const b=handlers.indexOf("    return { status: 409, body: { error: 'An account with this phone number already exists. Please log in.' } };",a);
if(a<0||b<0) throw new Error('Signup anchors missing');
handlers=handlers.slice(0,a)+handlers.slice(b);
const c=handlers.indexOf('  if (res.rows.length === 0) {',handlers.indexOf('export async function handleLogin'));
const d=handlers.indexOf('  const token = signToken({',handlers.indexOf('  const user = res.rows[0];',c));
if(c<0||d<0)throw new Error('Login anchors missing');
handlers=handlers.slice(0,c)+`  if (res.rows.length === 0) return { status: 401, body: { error: 'Invalid phone number or password.' } };
  const user = res.rows[0];
  if (!user.password_hash || !(await comparePassword(password, user.password_hash))) return { status: 401, body: { error: 'Invalid phone number or password.' } };
\n`+handlers.slice(d);
handlers=handlers.replace(/'rzp_live_[^']+'/g,"''");
fs.writeFileSync('lib/api-handlers.ts',handlers);
fs.writeFileSync('.env.example',`# Set these in the hosting provider. Never commit actual credentials.
DATABASE_URL=
DIRECT_DATABASE_URL=
JWT_SECRET=
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
RAZORPAY_WEBHOOK_SECRET=
GOOGLE_SCRIPT_WEBHOOK_URL=
NEXT_PUBLIC_SITE_URL=https://snipandstyle.pet
PORT=3002
`);
