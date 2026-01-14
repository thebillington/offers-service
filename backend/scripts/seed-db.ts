import "dotenv/config";
import { Client } from "pg";
import { v4 as uuidv4 } from "uuid";

const connectionString =
  process.env.DATABASE_URL ??
  "postgresql://blc_user:blc_pass@localhost:5432/blc_db";

const client = new Client({ connectionString });

const categories = [
  { id: uuidv4(), title: "tech" },
  { id: uuidv4(), title: "food" },
  { id: uuidv4(), title: "fashion" },
];

const companies = [
  { id: uuidv4(), name: "ASOS", contact_email: "support@asos.com" },
  { id: uuidv4(), name: "McDonalds", contact_email: "contact@mcdonalds.com" },
  { id: uuidv4(), name: "Apple", contact_email: "support@apple.com" },
];

const offers = [
  {
    title: "25% off designer sneakers",
    company: "ASOS",
    category: "fashion",
    discount: 25,
  },
  {
    title: "Buy one get one free fries",
    company: "McDonalds",
    category: "food",
    discount: 50,
  },
  {
    title: "15% off AirPods",
    company: "Apple",
    category: "tech",
    discount: 15,
  },
  {
    title: "20% off summer dresses",
    company: "ASOS",
    category: "fashion",
    discount: 20,
  },
  {
    title: "Free McFlurry with any burger",
    company: "McDonalds",
    category: "food",
    discount: 100,
  },
  {
    title: "10% off MacBook accessories",
    company: "Apple",
    category: "tech",
    discount: 10,
  },
  {
    title: "35% off jackets",
    company: "ASOS",
    category: "fashion",
    discount: 35,
  },
  {
    title: "Combo meal meal deal",
    company: "McDonalds",
    category: "food",
    discount: 30,
  },
  {
    title: "20% off iPhone screen protectors",
    company: "Apple",
    category: "tech",
    discount: 20,
  },
  {
    title: "Flash sale on headphones",
    company: "ASOS",
    category: "tech",
    discount: 40,
  },
];

async function run() {
  try {
    await client.connect();

    await client.query("TRUNCATE offers, companies, categories RESTART IDENTITY CASCADE;");

    const categoryMap = new Map<string, string>();
    for (const category of categories) {
      await client.query("INSERT INTO categories(id, title) VALUES ($1, $2)", [
        category.id,
        category.title,
      ]);
      categoryMap.set(category.title, category.id);
    }

    const companyMap = new Map<string, string>();
    for (const company of companies) {
      await client.query("INSERT INTO companies(id, name, contact_email) VALUES ($1, $2, $3)", [
        company.id,
        company.name,
        company.contact_email,
      ]);
      companyMap.set(company.name, company.id);
    }

    for (const offer of offers) {
      const companyId = companyMap.get(offer.company);
      const categoryId = categoryMap.get(offer.category);

      if (!companyId || !categoryId) {
        throw new Error(`Missing IDs for ${offer.company} / ${offer.category}`);
      }

      await client.query(
        "INSERT INTO offers(id, title, company_id, discount_percent, category_id) VALUES ($1, $2, $3, $4, $5)",
        [uuidv4(), offer.title, companyId, offer.discount, categoryId]
      );
    }

    console.log("Seed data inserted successfully.");
  } catch (error) {
    console.error("Failed to seed database:", error);
    process.exitCode = 1;
  } finally {
    await client.end();
  }
}

run();
