import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_3qjRoXa7fSHP@ep-cool-union-b3c54tp8-pooler.c-4.ap-southeast-1.aws.neon.tech/neondb?sslmode=require',
  ssl: { rejectUnauthorized: false }
});

async function inspect() {
  const users = await pool.query("SELECT column_name, data_type, is_nullable FROM information_schema.columns WHERE table_name = 'users'");
  console.log('USERS COLUMNS:\n', users.rows.map(r => `  ${r.column_name}: ${r.data_type} (nullable: ${r.is_nullable})`).join('\n'));

  const offers = await pool.query("SELECT column_name, data_type, is_nullable FROM information_schema.columns WHERE table_name = 'offers'");
  console.log('OFFERS COLUMNS:\n', offers.rows.map(r => `  ${r.column_name}: ${r.data_type}`).join('\n'));

  const allOffers = await pool.query('SELECT code, discount_percent, flat_discount_paise, title, is_active FROM offers');
  console.log('CURRENT OFFERS IN DB:\n', JSON.stringify(allOffers.rows, null, 2));

  const bookings = await pool.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'bookings'");
  console.log('BOOKINGS COLUMNS:\n', bookings.rows.map(r => `  ${r.column_name}: ${r.data_type}`).join('\n'));

  await pool.end();
}

inspect().catch(console.error);
