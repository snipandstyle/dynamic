import fs from 'node:fs';import crypto from 'node:crypto';import assert from 'node:assert/strict';
const base='http://127.0.0.1:3014';const checks=[];
async function call(path,body,token,method='POST'){const r=await fetch(base+path,{method,headers:{'Content-Type':'application/json',...(token?{Authorization:'Bearer '+token}:{})},...(body?{body:JSON.stringify(body)}:{})});return {status:r.status,data:await r.json()};}
function passed(name){checks.push(name);console.log('PASS '+name);}
const phone='9'+String(crypto.randomInt(100000000,999999999));const password=crypto.randomBytes(20).toString('base64url');
const signup=await call('/api/auth/signup',{fullName:'Journey QA Customer',phone,password,role:'admin'});assert.equal(signup.status,201);assert.equal(signup.data.user.role,'customer');const token=signup.data.token;passed('New customer signup persists as customer');
const duplicate=await call('/api/auth/signup',{fullName:'Impersonator',phone,password:'Different-password-987'});assert.equal(duplicate.status,409);passed('Duplicate signup cannot replace the account');
assert.equal((await call('/api/auth/login',{phone,password:'wrong-password'})).status,401);passed('Wrong password rejected');
const login=await call('/api/auth/login',{phone:'+91'+phone,password});assert.equal(login.status,200);assert.equal(login.data.user.id,signup.data.user.id);passed('Phone normalization and existing customer login');
const me=await call('/api/auth/me',null,token,'GET');assert.equal(me.status,200);assert.equal(me.data.user.id,signup.data.user.id);passed('Authenticated session lookup');
assert.equal((await call('/api/auth/me',null,'forged','GET')).status,401);passed('Forged session rejected');
const profile=await call('/api/auth/profile',{fullName:'Journey QA Updated'},token,'PATCH');assert.equal(profile.status,200);assert.equal(profile.data.user.fullName,'Journey QA Updated');passed('Profile name saved');
const newPassword=crypto.randomBytes(20).toString('base64url');assert.equal((await call('/api/auth/profile',{currentPassword:'wrong',newPassword},token,'PATCH')).status,400);
assert.equal((await call('/api/auth/profile',{currentPassword:password,newPassword},token,'PATCH')).status,200);assert.equal((await call('/api/auth/login',{phone,password})).status,401);assert.equal((await call('/api/auth/login',{phone,password:newPassword})).status,200);passed('Password change checks current password and invalidates old password');
const mine=await call('/api/bookings',null,token,'GET');assert.equal(mine.status,200);assert.equal(mine.data.bookings.length,0);passed('New account cannot see other customers’ bookings');
for(const route of ['/api/admin/bookings','/api/admin/users','/api/admin/abandoned','/api/admin/coupons','/api/admin/passes'])assert.equal((await call(route,null,token,'GET')).status,403);passed('Customer blocked from all admin data');
const invalid=await call('/api/auth/signup',{fullName:'QA',phone:'123',password:'short'});assert.equal(invalid.status,400);passed('Invalid registration rejected');
fs.writeFileSync('.sandbox-customer.json',JSON.stringify({phone,password:newPassword,userId:signup.data.user.id}));
fs.writeFileSync('artifacts/production/account-flows.json',JSON.stringify({checkedAt:new Date().toISOString(),schema:'sns_checkout_test',checks},null,2));
