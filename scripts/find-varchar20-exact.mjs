import pg from 'pg';
import dns from 'dns';

dns.setDefaultResultOrder('ipv4first');

const pool = new pg.Pool({
  connectionString: '',
  ssl: { rejectUnauthorized: false }
});

async function main() {
  const res = await pool.query(`
    SELECT table_name, column_name, data_type, character_maximum_length
    FROM information_schema.columns
    WHERE table_schema = 'public' 
      AND character_maximum_length = 20
    ORDER BY table_name, column_name;
  `);

  console.log('ALL COLUMNS WITH VARCHAR(20):');
  console.table(res.rows);

  await pool.end();
}

main().catch(console.error);
