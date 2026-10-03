import dns from 'dns';
try {
  // Use ipv4first to avoid Windows ENOTFOUND bugs with IPv6 on pooler domains
  dns.setDefaultResultOrder('ipv4first');
} catch {
  // Ignore in browser or non-node contexts
}

import pg from 'pg';
const { Pool } = pg;

const poolerUrl =
  process.env.DATABASE_URL ||
  'postgresql://neondb_owner:npg_3qjRoXa7fSHP@ep-cool-union-b3c54tp8-pooler.c-4.ap-southeast-1.aws.neon.tech/neondb?sslmode=require';

const directUrl =
  process.env.DIRECT_DATABASE_URL ||
  'postgresql://neondb_owner:npg_3qjRoXa7fSHP@ep-cool-union-b3c54tp8.c-4.ap-southeast-1.aws.neon.tech/neondb?sslmode=require';

// Primary pooler connection pool
export const pool = new Pool({
  connectionString: poolerUrl,
  ssl: {
    rejectUnauthorized: false,
  },
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

// Fallback direct endpoint pool
export const directPool = new Pool({
  connectionString: directUrl,
  ssl: {
    rejectUnauthorized: false,
  },
  max: 5,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

export async function query<T = any>(text: string, params?: any[]): Promise<pg.QueryResult<T>> {
  const start = Date.now();
  try {
    const res = await pool.query<T>(text, params);
    const duration = Date.now() - start;
    if (process.env.NODE_ENV === 'development') {
      console.log('[DB Query]', { text: text.trim().substring(0, 80), duration: `${duration}ms`, rows: res.rowCount });
    }
    return res;
  } catch (error: any) {
    if (error.code === 'ENOTFOUND' || (error.message && error.message.includes('ENOTFOUND'))) {
      console.warn('[DB Query] Pooler lookup failed, executing via direct Neon endpoint...');
      const fallbackRes = await directPool.query<T>(text, params);
      return fallbackRes;
    }
    console.error('[DB Query Error]', { text, error });
    throw error;
  }
}

export default pool;
