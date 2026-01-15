import { Pool } from "pg";
import { env } from "../config";

let pool: Pool | null = null;

export function getDatabasePool() {
  if (!pool) {
    const connectionString = env.DATABASE_URL.includes("://")
      ? env.DATABASE_URL
      : `postgresql://${env.DATABASE_URL}`;
    const requiresSsl =
      env.PG_SSL || connectionString.includes("sslmode=require");

    pool = new Pool({
      connectionString,
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
