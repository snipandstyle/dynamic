import pg from 'pg';
import dns from 'dns';

dns.setDefaultResultOrder('ipv4first');

const pool = new pg.Pool({
  connectionString: 'postgresql://neondb_owner:npg_3qjRoXa7fSHP@ep-cool-union-b3c54tp8-pooler.c-4.ap-southeast-1.aws.neon.tech/neondb?sslmode=require',
  ssl: { rejectUnauthorized: false }
});

async function main() {
  console.log('Inspecting all columns of bookings table...');
  const cols = await pool.query(`
    SELECT column_name, data_type, character_maximum_length
    FROM information_schema.columns
    WHERE table_name = 'bookings'
    ORDER BY ordinal_position;
  `);

  console.table(cols.rows);

  console.log('\nAltering restrictive columns to VARCHAR(255) / TEXT...');
  await pool.query(`
    ALTER TABLE bookings 
      ALTER COLUMN drop_off_time TYPE VARCHAR(255),
      ALTER COLUMN pickup_time TYPE VARCHAR(255),
      ALTER COLUMN status TYPE VARCHAR(100),
      ALTER COLUMN payment_status TYPE VARCHAR(100),
      ALTER COLUMN payment_method TYPE VARCHAR(100),
      ALTER COLUMN service_type TYPE VARCHAR(500),
      ALTER COLUMN emergency_contact TYPE VARCHAR(255);
  `);
  console.log('Successfully expanded bookings columns!');

  // Check pets table
  await pool.query(`
    ALTER TABLE pets
      ALTER COLUMN gender TYPE VARCHAR(50),
      ALTER COLUMN species TYPE VARCHAR(100);
  `);
  console.log('Successfully expanded pets columns!');

  // Verify
  const updatedCols = await pool.query(`
    SELECT column_name, data_type, character_maximum_length
    FROM information_schema.columns
    WHERE table_name = 'bookings'
      AND column_name IN ('drop_off_time', 'pickup_time', 'status', 'payment_status', 'payment_method', 'service_type');
  `);
  console.table(updatedCols.rows);

  await pool.end();
}

main().catch(console.error);
