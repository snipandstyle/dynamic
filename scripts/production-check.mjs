import fs from 'node:fs';
import dotenv from 'dotenv';
import pg from 'pg';
import Razorpay from 'razorpay';
import dns from 'node:dns';
dns.setDefaultResultOrder('ipv4first');
dotenv.config({ quiet: true });
const results=[];
const record=(name,ok,detail)=>{results.push({name,status:ok?'pass':'blocked',detail});};
const required=['DATABASE_URL','JWT_SECRET','RAZORPAY_KEY_ID','RAZORPAY_KEY_SECRET','RAZORPAY_WEBHOOK_SECRET','GOOGLE_SCRIPT_WEBHOOK_URL'];
for(const name of required)record(name,!!process.env[name],process.env[name]?'configured':'missing');
record('Payment mode',process.env.RAZORPAY_KEY_ID?.startsWith('rzp_live_'),'Only read-only provider checks are performed; no orders, payments, or bookings are created.');
if(process.env.DATABASE_URL){
  let client;
  try{
    const url=new URL(process.env.DATABASE_URL);for(const key of ['sslmode','sslcert','sslkey','sslrootcert'])url.searchParams.delete(key);
    client=new pg.Client({connectionString:url.toString(),ssl:{rejectUnauthorized:true},connectionTimeoutMillis:12000});
    try {await client.connect();} catch(error){
      if(!['ENOTFOUND','EAI_AGAIN'].includes(error.code)||!process.env.DIRECT_DATABASE_URL)throw error;
      await client.end().catch(()=>{});const direct=new URL(process.env.DIRECT_DATABASE_URL);for(const key of ['sslmode','sslcert','sslkey','sslrootcert'])direct.searchParams.delete(key);
      client=new pg.Client({connectionString:direct.toString(),ssl:{rejectUnauthorized:true},connectionTimeoutMillis:12000});await client.connect();
    }
    const res=await client.query("SELECT table_name,column_name,data_type,character_maximum_length FROM information_schema.columns WHERE table_schema='public' AND table_name IN ('bookings','users','organizations','booking_payment_sessions')");
    for(const table of ['bookings','users','organizations'])record('Database '+table,res.rows.some(r=>r.table_name===table),'Read-only schema inspection');
    const needed=['services_json','razorpay_order_id','razorpay_payment_id','razorpay_signature','booking_ref','total_amount_paise','payment_status'];
    for(const column of needed)record('Bookings '+column,res.rows.some(r=>r.table_name==='bookings'&&r.column_name===column),'Required for saving paid bookings');
    const permissions=await client.query("SELECT has_schema_privilege(current_user,'public','CREATE') AS can_create");
    record('Durable payment session table',res.rows.some(r=>r.table_name==='booking_payment_sessions')||permissions.rows[0].can_create,'Table exists or role can initialize it before checkout');
    record('Database verified TLS',true,'Connected with certificate verification enabled');
  }catch(error){record('Database connection',false,'Connection or schema check failed ('+String(error.code||error.name)+'); no customer data was read.');}
  finally{await client?.end().catch(()=>{});}
}
if(process.env.RAZORPAY_KEY_ID&&process.env.RAZORPAY_KEY_SECRET){
  try {const rzp=new Razorpay({key_id:process.env.RAZORPAY_KEY_ID,key_secret:process.env.RAZORPAY_KEY_SECRET});await rzp.orders.all({count:1});record('Razorpay API credentials',true,'Authenticated read-only request; response data discarded');}
  catch{record('Razorpay API credentials',false,'Read-only authentication check failed');}
}
for(const asset of ['pet-happy-place','gentle-bath','fresh-style','cosy-boarding','cat-care'])record('Image '+asset,fs.existsSync('public/images/generated/'+asset+'.webp'),'Local optimized asset');
const report={checkedAt:new Date().toISOString(),domain:'https://snipandstyle.pet',checks:results,remainingManualChecks:['Rotate credentials previously embedded in the old source and replace hosting values.','Configure payment.captured webhook at https://snipandstyle.pet/api/razorpay/webhook with the matching secret.','Actual test payment, repeated confirmation and signed webhook replay passed; verify external provider delivery after deployment.','Verify staff receive the real booking alert and the saved booking appears in the admin dashboard.','Deploy this separate folder and verify the public domain serves this build.']};
fs.mkdirSync('artifacts/production',{recursive:true});fs.writeFileSync('artifacts/production/readiness.json',JSON.stringify(report,null,2));
console.log(JSON.stringify(report,null,2));
if(results.some(r=>r.status==='blocked'))process.exitCode=1;
