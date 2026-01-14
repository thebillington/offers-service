const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");

const root = path.resolve(__dirname, "..");
const envPath = path.join(root, ".env");
const outputPath = path.join(root, "sam-env.json");

const result = dotenv.config({ path: envPath });
if (result.error) {
  console.error(`Failed to load ${envPath}. Copy .env.example to .env first.`);
  process.exit(1);
}

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error("DATABASE_URL is required in .env for SAM local runs.");
  process.exit(1);
}

const pgMaxConnections = process.env.PG_MAX_CONNECTIONS || "5";

const samEnv = {
  ApiFunction: {
    DATABASE_URL: databaseUrl,
    PG_MAX_CONNECTIONS: pgMaxConnections,
  },
};

fs.writeFileSync(outputPath, JSON.stringify(samEnv, null, 2));
console.log(`Wrote ${outputPath}`);
