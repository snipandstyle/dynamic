import pg from 'pg';
import dns from 'dns';

dns.setDefaultResultOrder('ipv4first');

const pool = new pg.Pool({
  connectionString: 'postgresql://neondb_owner:npg_3qjRoXa7fSHP@ep-cool-union-b3c54tp8-pooler.c-4.ap-southeast-1.aws.neon.tech/neondb?sslmode=require',
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
