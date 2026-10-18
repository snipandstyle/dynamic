import fs from 'node:fs';
for(const name of ['create-order','razorpay/create-order']) {
  const relative=name.includes('/')?'../../booking/order/route':'../booking/order/route';
  fs.writeFileSync(`app/api/${name}/route.ts`,`// All payment entry points use server-priced, signed booking orders.\nexport { POST } from "${relative}";\n`);
}
for(const name of ['verify-payment','razorpay/verify-payment']){
  const relative=name.includes('/')?'../../booking/confirm/route':'../booking/confirm/route';
  fs.writeFileSync(`app/api/${name}/route.ts`,`// Legacy clients must provide the same signed booking snapshot as checkout.\nexport { POST } from "${relative}";\n`);
}
