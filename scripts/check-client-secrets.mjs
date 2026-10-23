import fs from 'node:fs';import path from 'node:path';import dotenv from 'dotenv';dotenv.config({quiet:true});
const secretNames=['DATABASE_URL','DIRECT_DATABASE_URL','JWT_SECRET','RAZORPAY_KEY_SECRET','RAZORPAY_WEBHOOK_SECRET'];const hits=[];
function scan(folder){for(const entry of fs.readdirSync(folder,{withFileTypes:true})){const f=path.join(folder,entry.name);if(entry.isDirectory())scan(f);else if(/\.(tsx?|jsx?|mjs|json)$/.test(f)){const content=fs.readFileSync(f,'utf8');if(secretNames.some(n=>process.env[n]&&content.includes(process.env[n])))hits.push(f);}}}
for(const folder of ['app','components','lib','utils','data'])scan(folder);
if(hits.length){console.log('Embedded server secrets found in: '+hits.join(', '));process.exitCode=1;}else console.log('No configured server secrets embedded in application source.');
