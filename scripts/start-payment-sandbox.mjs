import dotenv from 'dotenv';
import pg from 'pg';
import {spawn} from 'node:child_process';
import dns from 'node:dns';
import fs from 'node:fs';
import crypto from 'node:crypto';
import bcrypt from 'bcryptjs';
dns.setDefaultResultOrder('ipv4first');
dotenv.config({path:'.env.test.local',override:true,quiet:true});dotenv.config({quiet:true});
if(!process.env.RAZORPAY_KEY_ID?.startsWith('rzp_test_'))throw new Error('Sandbox requires test-mode payment credentials.');
const url=new URL(process.env.DIRECT_DATABASE_URL || process.env.DATABASE_URL);for(const key of ['sslmode','sslcert','sslkey','sslrootcert'])url.searchParams.delete(key);
const client=new pg.Client({connectionString:url.toString(),ssl:{rejectUnauthorized:true}});
await client.connect();
try {
  await client.query('CREATE SCHEMA IF NOT EXISTS sns_checkout_test');
  for (const table of ['organizations','users','bookings']) await client.query(`CREATE TABLE IF NOT EXISTS sns_checkout_test.${table} (LIKE public.${table} INCLUDING ALL)`);
  for (const table of ['offers','abandoned_checkouts']) {
    const found=await client.query('SELECT to_regclass($1) AS name',['public.'+table]);
    if(found.rows[0].name)await client.query(`CREATE TABLE IF NOT EXISTS sns_checkout_test.${table} (LIKE public.${table} INCLUDING ALL)`);
  }
  const org=await client.query("INSERT INTO sns_checkout_test.organizations (name,slug,location_address,phone_number) VALUES ('QA Studio','sns-isolated-qa','Test studio','9000090000') ON CONFLICT (slug) DO UPDATE SET name=EXCLUDED.name RETURNING id");
  const creds=fs.existsSync('.sandbox-qa.json')?JSON.parse(fs.readFileSync('.sandbox-qa.json','utf8')):{phone:'9000090000',password:crypto.randomBytes(24).toString('base64url')};
  const hash=await bcrypt.hash(creds.password,12);
  await client.query("INSERT INTO sns_checkout_test.users (organization_id,full_name,phone_number,password_hash,role,is_phone_verified) VALUES ($1,'Isolated QA Admin',$2,$3,'admin',true) ON CONFLICT (phone_number) DO UPDATE SET password_hash=EXCLUDED.password_hash,role='admin'",[org.rows[0].id,creds.phone,hash]);
  fs.writeFileSync('.sandbox-qa.json',JSON.stringify(creds));
  console.log('Isolated test schema ready. Real bookings and staff alerts are not used.');
} finally {await client.end();}
if (!process.env.DIRECT_DATABASE_URL) throw new Error('Sandbox schema isolation requires the unpooled DIRECT_DATABASE_URL.');
const child=spawn(process.execPath,['node_modules/next/dist/bin/next','dev','--hostname','127.0.0.1','--port','3014'],{stdio:'inherit',env:{...process.env,DATABASE_URL:process.env.DIRECT_DATABASE_URL,BOOKING_SANDBOX:'1',GOOGLE_SCRIPT_WEBHOOK_URL:''}});
child.on('exit',code=>process.exitCode=code??0);
for(const signal of ['SIGINT','SIGTERM'])process.on(signal,()=>child.kill(signal));
