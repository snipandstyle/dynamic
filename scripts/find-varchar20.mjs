import pg from 'pg';
import dns from 'dns';

try {
  dns.setDefaultResultOrder('ipv4first');
} catch (e) {}

const pool = new pg.Pool({
  connectionString: 'postgresql://neondb_owner:npg_3qjRoXa7fSHP@ep-cool-union-b3c54tp8.c-4.ap-southeast-1.aws.neon.tech/neondb?sslmode=require',
  ssl: { rejectUnauthorized: false }
});

async function main() {
  const query = `
    SELECT table_name, column_name, data_type, character_maximum_length
    FROM information_schema.columns
    WHERE table_schema = 'public' 
      AND data_type = 'character varying'
      AND character_maximum_length <= 50
    ORDER BY table_name, column_name;
  `;

  const res = await pool.query(query);
  console.log('TABLES WITH VARCHAR <= 50:');
  console.table(res.rows);

  await pool.end();
}

main().catch(console.error);
