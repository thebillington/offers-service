import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().min(1),
  PG_MAX_CONNECTIONS: z.coerce.number().int().positive().default(5),
  PG_SSL: z
    .enum(["true", "false"])
    .default("false")
    .transform((value) => value === "true"),
  PG_SSL_REJECT_UNAUTHORIZED: z
    .enum(["true", "false"])
    .default("true")
    .transform((value) => value === "true"),
});

export const env = envSchema.parse(process.env);
