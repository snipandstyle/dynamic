import {query} from "./db";
export async function ensureBundlePasses(){
  await query(`CREATE TABLE IF NOT EXISTS booking_bundle_passes (
    id TEXT PRIMARY KEY, order_id TEXT NOT NULL, service_line_id TEXT NOT NULL,
    booking_ref TEXT NOT NULL, bundle_id TEXT NOT NULL, bundle_name TEXT NOT NULL,
    pet_name TEXT NOT NULL, pet_type TEXT NOT NULL, coat_type TEXT,
    sessions_total INTEGER NOT NULL CHECK(sessions_total>0), sessions_used INTEGER NOT NULL DEFAULT 0 CHECK(sessions_used>=0 AND sessions_used<=sessions_total),
    valid_from DATE NOT NULL, valid_until DATE NOT NULL, updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(order_id,service_line_id)
  )`);
}
export function bundleExpiry(date:string,months:number){const start=new Date(date+"T12:00:00Z");const day=start.getUTCDate();start.setUTCDate(1);start.setUTCMonth(start.getUTCMonth()+months);const last=new Date(Date.UTC(start.getUTCFullYear(),start.getUTCMonth()+1,0)).getUTCDate();start.setUTCDate(Math.min(day,last));return start.toISOString().slice(0,10);}
