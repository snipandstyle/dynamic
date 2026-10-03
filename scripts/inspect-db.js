const { Pool } = require('pg');
const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_3qjRoXa7fSHP@ep-cool-union-b3c54tp8-pooler.c-4.ap-southeast-1.aws.neon.tech/neondb?sslmode=require',
  ssl: { rejectUnauthorized: false }
});

async function inspect() {
  const users = await pool.query("SELECT column_name, data_type, is_nullable FROM information_schema.columns WHERE table_name = 'users'");
  console.log('USERS COLUMNS:', users.rows.map(r => `${r.column_name} (${r.data_type}, nullable: ${r.is_nullable})`));

  const offers = await pool.query("SELECT column_name, data_type, is_nullable FROM information_schema.columns WHERE table_name = 'offers'");
  console.log('OFFERS COLUMNS:', offers.rows.map(r => `${r.column_name} (${r.data_type})`));

  const allOffers = await pool.query('SELECT code, discount_percent, flat_discount_paise, title, is_active FROM offers');
  console.log('CURRENT OFFERS:', allOffers.rows);

  const bookings = await pool.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'bookings'");
  console.log('BOOKINGS COLUMNS:', bookings.rows.map(r => `${r.column_name} (${r.data_type})`));

  await pool.end();
}

inspect().catch(console.error);
