import dns from "dns";
try {
  // Use ipv4first to avoid Windows ENOTFOUND bugs with IPv6 on pooler domains
  dns.setDefaultResultOrder("ipv4first");
} catch {
  // Ignore in browser or non-node contexts
}

import pg from "pg";
const { Pool } = pg;

const poolerUrl = process.env.DATABASE_URL || "";

const directUrl = process.env.DIRECT_DATABASE_URL || poolerUrl;

function connection(url: string) {
  if (!url) return { connectionString: undefined };
  const parsed = new URL(url);
  const local = ["localhost", "127.0.0.1", "::1"].includes(parsed.hostname);
  // URL sslmode=require can override pg's TLS settings. Use verified TLS for remote databases.
  for (const key of ["sslmode", "sslcert", "sslkey", "sslrootcert"])
    parsed.searchParams.delete(key);
  return {
    connectionString: parsed.toString(),
    ssl: local ? false : { rejectUnauthorized: true },
  };
}
const databaseSchema = process.env.BOOKING_SANDBOX === '1' ? 'sns_checkout_test' : 'public';

// Primary pooler connection pool
export const pool = new Pool({
  ...(process.env.BOOKING_SANDBOX === '1' ? { options: `-c search_path=${databaseSchema}` } : {}),
  ...connection(poolerUrl),
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

// Fallback direct endpoint pool
export const directPool = new Pool({
  ...(process.env.BOOKING_SANDBOX === '1' ? { options: `-c search_path=${databaseSchema}` } : {}),
  ...connection(directUrl),
  max: 5,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

export async function query<T = any>(
  text: string,
  params?: any[],
): Promise<pg.QueryResult<T>> {
  if (!poolerUrl) throw new Error("DATABASE_URL is not configured.");
  const start = Date.now();
  try {
    const res = await pool.query<T>(text, params);
    const duration = Date.now() - start;
    if (process.env.NODE_ENV === "development") {
      console.log("[DB Query]", {
        text: text.trim().substring(0, 80),
        duration: `${duration}ms`,
        rows: res.rowCount,
      });
    }
    return res;
  } catch (error: any) {
    if (
      error.code === "ENOTFOUND" ||
      (error.message && error.message.includes("ENOTFOUND"))
    ) {
      console.warn(
        "[DB Query] Pooler lookup failed, executing via direct Neon endpoint...",
      );
      const fallbackRes = await directPool.query<T>(text, params);
      return fallbackRes;
    }
    console.error("[DB Query Error]", { text, error });
    throw error;
  }
}

export default pool;
