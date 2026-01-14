import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().min(1),
  PG_MAX_CONNECTIONS: z.coerce.number().int().positive().default(5),
});

export const env = envSchema.parse(process.env);
