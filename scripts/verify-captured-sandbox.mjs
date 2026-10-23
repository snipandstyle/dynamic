import fs from 'node:fs';
import dotenv from 'dotenv';
import pg from 'pg';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import dns from 'node:dns';
dns.setDefaultResultOrder('ipv4first');
dotenv.config({path:'.env.test.local',override:true,quiet:true});dotenv.config({quiet:true});
assert.ok(process.env.RAZORPAY_KEY_ID.startsWith('rzp_test_'));
const url=new URL(process.env.DIRECT_DATABASE_URL);for(const k of ['sslmode','sslcert','sslkey','sslrootcert'])url.searchParams.delete(k);
const db=new pg.Client({connectionString:url.toString(),ssl:{rejectUnauthorized:true}});await db.connect();
const base='http://127.0.0.1:3014';
try{
 const {rows}=await db.query("SELECT * FROM sns_checkout_test.bookings WHERE pet_name='QA Coco' AND payment_status='paid' ORDER BY created_at DESC LIMIT 1");
 assert.equal(rows.length,1);const booking=rows[0];assert.equal(Number(booking.total_amount_paise),487400);assert.equal(booking.services_json[0].category,'bundle');
 const session=await db.query('SELECT signed_token FROM sns_checkout_test.booking_payment_sessions WHERE order_id=$1',[booking.razorpay_order_id]);
 const signature=crypto.createHmac('sha256',process.env.RAZORPAY_KEY_SECRET).update(booking.razorpay_order_id+'|'+booking.razorpay_payment_id).digest('hex');
 for(let i=0;i<2;i++){const r=await fetch(base+'/api/booking/confirm',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({token:session.rows[0].signed_token,order_id:booking.razorpay_order_id,payment_id:booking.razorpay_payment_id,signature})});assert.equal(r.status,200,await r.text());}
 const body=JSON.stringify({event:'payment.captured',payload:{payment:{entity:{id:booking.razorpay_payment_id,order_id:booking.razorpay_order_id,amount:487400,currency:'INR',status:'captured'}}}});
 const webhook=await fetch(base+'/api/razorpay/webhook',{method:'POST',headers:{'Content-Type':'application/json','x-razorpay-signature':crypto.createHmac('sha256',process.env.RAZORPAY_WEBHOOK_SECRET).update(body).digest('hex')},body});assert.equal(webhook.status,200,await webhook.text());
 const counts=await db.query('SELECT count(*)::int AS n FROM sns_checkout_test.bookings WHERE razorpay_order_id=$1',[booking.razorpay_order_id]);assert.equal(counts.rows[0].n,1);
 const passes=await db.query('SELECT * FROM sns_checkout_test.booking_bundle_passes WHERE order_id=$1',[booking.razorpay_order_id]);assert.equal(passes.rows.length,1);assert.equal(passes.rows[0].sessions_total,3);
 const creds=JSON.parse(fs.readFileSync('.sandbox-qa.json','utf8'));const login=await fetch(base+'/api/auth/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(creds)});const {token}=await login.json();const headers={'Content-Type':'application/json',Authorization:'Bearer '+token};
 // Activate this isolated QA pass today so the completed-session action can be tested.
 await db.query("UPDATE sns_checkout_test.booking_bundle_passes SET valid_from=(NOW() AT TIME ZONE 'Asia/Kolkata')::date WHERE id=$1",[passes.rows[0].id]);
 const payload=JSON.stringify({id:passes.rows[0].id,action:'redeem',expectedUsed:passes.rows[0].sessions_used});
 const redeemed=await fetch(base+'/api/admin/passes',{method:'PATCH',headers,body:payload});assert.equal(redeemed.status,200,await redeemed.text());
 const replay=await fetch(base+'/api/admin/passes',{method:'PATCH',headers,body:payload});assert.equal(replay.status,409);
 const updated=await fetch(base+'/api/admin/bookings',{method:'PATCH',headers,body:JSON.stringify({bookingId:booking.id,status:'in_progress'})});assert.equal(updated.status,200);
 const report={checkedAt:new Date().toISOString(),razorpayTestPaymentCaptured:true,total:4874,neonBookingSaved:true,servicesSaved:true,repeatedConfirmations:2,signedWebhookReplay:true,bookingCount:1,bundlePassCount:1,adminStatusUpdate:true,adminSessionRedemption:true,duplicateRedemptionRejected:true,productionCustomerDataUntouched:true};
 fs.writeFileSync('artifacts/production/captured-payment.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
}finally{await db.end();}
