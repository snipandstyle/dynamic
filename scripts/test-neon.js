import dns from 'dns';
dns.setDefaultResultOrder('verbatim');

import pg from 'pg';
const { Client } = pg;

const connectionString = 'postgresql://neondb_owner:npg_3qjRoXa7fSHP@ep-cool-union-b3c54tp8-pooler.c-4.ap-southeast-1.aws.neon.tech/neondb?sslmode=require';

async function inspectSchema() {
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });
  await client.connect();

  const tables = ['organizations', 'users', 'pets', 'pricing_tiers', 'offers', 'bookings', 'audit_logs'];
  for (const t of tables) {
    const cols = await client.query(`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = $1 
      ORDER BY ordinal_position
    `, [t]);
    console.log(`\n=== Table: ${t} ===`);
    console.log(cols.rows.map(c => `  ${c.column_name}: ${c.data_type} (${c.is_nullable === 'YES' ? 'nullable' : 'required'})`).join('\n'));

    const count = await client.query(`SELECT count(*) FROM ${t}`);
    console.log(`Row count: ${count.rows[0].count}`);

    if (parseInt(count.rows[0].count) > 0) {
      const sample = await client.query(`SELECT * FROM ${t} LIMIT 3`);
      console.log('Sample rows:', JSON.stringify(sample.rows, null, 2));
    }
  }

  await client.end();
}

inspectSchema().catch(console.error);
