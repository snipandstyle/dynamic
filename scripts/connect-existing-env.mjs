import fs from 'node:fs';
import dotenv from 'dotenv';
const merged={};
for(const root of ['D:/Website/Snipnstyle/v3','D:/Website/Snipnstyle/v3-customer-ui'])for(const file of ['.env','.env.local']){const path=root+'/'+file;if(fs.existsSync(path))Object.assign(merged,dotenv.parse(fs.readFileSync(path)));}
const names=['DATABASE_URL','DIRECT_DATABASE_URL','JWT_SECRET','RAZORPAY_KEY_ID','RAZORPAY_KEY_SECRET','RAZORPAY_WEBHOOK_SECRET','GOOGLE_SCRIPT_WEBHOOK_URL'];
const values=Object.fromEntries(names.filter(k=>merged[k]).map(k=>[k,merged[k]]));
values.NEXT_PUBLIC_SITE_URL='https://snipandstyle.pet';
fs.writeFileSync('.env',Object.entries(values).map(([k,v])=>k+'='+JSON.stringify(v)).join('\n')+'\n',{mode:0o600});
const testSource='D:/Website/Snipnstyle/v3-customer-ui/.env.test.local';if(fs.existsSync(testSource))fs.copyFileSync(testSource,'.env.test.local');
console.log(JSON.stringify(Object.fromEntries(names.map(k=>[k,values[k]?'configured':'missing'])),null,2));
console.log('Payment mode: '+(values.RAZORPAY_KEY_ID?.startsWith('rzp_live_')?'live':'test or unconfigured'));
