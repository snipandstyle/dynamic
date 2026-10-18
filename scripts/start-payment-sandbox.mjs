import dotenv from 'dotenv';
import pg from 'pg';
import {spawn} from 'node:child_process';
dotenv.config({path:'.env.test.local',override:true,quiet:true});dotenv.config({quiet:true});
if(!process.env.RAZORPAY_KEY_ID?.startsWith('rzp_test_'))throw new Error('Sandbox requires test-mode payment credentials.');
const url=new URL(process.env.DATABASE_URL);for(const key of ['sslmode','sslcert','sslkey','sslrootcert'])url.searchParams.delete(key);
const client=new pg.Client({connectionString:url.toString(),ssl:{rejectUnauthorized:true}});
await client.connect();
try {
  await client.query('CREATE SCHEMA IF NOT EXISTS sns_checkout_test');
  for (const table of ['organizations','users','bookings']) await client.query(`CREATE TABLE IF NOT EXISTS sns_checkout_test.${table} (LIKE public.${table} INCLUDING ALL)`);
  console.log('Isolated test schema ready. Real bookings and staff alerts are not used.');
} finally {await client.end();}
if (!process.env.DIRECT_DATABASE_URL) throw new Error('Sandbox schema isolation requires the unpooled DIRECT_DATABASE_URL.');
const child=spawn(process.execPath,['node_modules/next/dist/bin/next','dev','--hostname','0.0.0.0','--port','3004'],{stdio:'inherit',env:{...process.env,DATABASE_URL:process.env.DIRECT_DATABASE_URL,BOOKING_SANDBOX:'1',GOOGLE_SCRIPT_WEBHOOK_URL:''}});
child.on('exit',code=>process.exitCode=code??0);
for(const signal of ['SIGINT','SIGTERM'])process.on(signal,()=>child.kill(signal));
