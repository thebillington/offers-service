import { Pool } from "pg";
import { env } from "../config";

let pool: Pool | null = null;

export function getDatabasePool() {
  if (!pool) {
    const requiresSsl =
      env.PG_SSL || env.DATABASE_URL.includes("sslmode=require");

    pool = new Pool({
      connectionString: env.DATABASE_URL,
      max: env.PG_MAX_CONNECTIONS,
      ssl: requiresSsl
        ? {
            rejectUnauthorized: env.PG_SSL_REJECT_UNAUTHORIZED,
          }
        : undefined,
    });
  }

  return pool;
}
