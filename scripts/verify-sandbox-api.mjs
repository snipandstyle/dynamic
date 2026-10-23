import fs from 'node:fs';
import assert from 'node:assert/strict';
const base='http://127.0.0.1:3014';
const creds=JSON.parse(fs.readFileSync('.sandbox-qa.json','utf8'));
const login=await fetch(base+'/api/auth/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(creds)});
const auth=await login.json();assert.equal(login.status,200);assert.equal(auth.user.role,'admin');
const headers={Authorization:'Bearer '+auth.token,'Content-Type':'application/json'};
for(const path of ['/api/admin/bookings','/api/admin/users','/api/admin/abandoned','/api/admin/coupons','/api/admin/passes']){
 const response=await fetch(base+path,{headers});assert.equal(response.status,200,path+' '+await response.text());console.log(path+': authenticated database read passed');
 const denied=await fetch(base+path);assert.ok([401,403].includes(denied.status));
}
const date=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Kolkata',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
const item={id:'qa-cat-bundle',serviceId:'bundle-cat-3',category:'bundle',petType:'cat',petSize:'small',coatType:'long',selectionMode:'breed',breed:'Persian Cat',petName:'QA Mittens',quantity:1,nights:1,addons:[],price:1};
const response=await fetch(base+'/api/booking/order',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({items:[item],customer:{name:'Isolated QA',phone:'9000090000',notes:'Sandbox only'},schedules:{[item.id]:{date,slot:'09:30 AM – 01:30 PM'}}})});
const result=await response.json();assert.equal(response.status,200,JSON.stringify(result));assert.equal(result.amount,637400);assert.ok(result.key_id.startsWith('rzp_test_'));
fs.mkdirSync('artifacts/production',{recursive:true});fs.writeFileSync('artifacts/production/sandbox-api.json',JSON.stringify({checkedAt:new Date().toISOString(),adminRoutes:5,unauthenticatedBlocked:true,canonicalCatLongBundle:6374,testOrderCreated:true},null,2));
console.log('Real Razorpay test order and durable Neon session saved at exact ₹6,374; no payment charged.');
