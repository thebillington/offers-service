import { Pool } from "pg";
import { env } from "../config";

let pool: Pool | null = null;

export function getDatabasePool() {
  if (!pool) {
    pool = new Pool({
      connectionString: env.DATABASE_URL,
      max: env.PG_MAX_CONNECTIONS,
    });
  }

  return pool;
}
