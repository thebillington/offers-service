import "dotenv/config";
import { Client } from "pg";
import { v4 as uuidv4 } from "uuid";

const connectionString =
  process.env.DATABASE_URL ??
  "postgresql://blc_user:blc_pass@localhost:5432/blc_db";

const client = new Client({ connectionString });

const categories = [
  { id: uuidv4(), title: "tech", colour: "#b7e3ff" },
  { id: uuidv4(), title: "food", colour: "#ffe2b7" },
  { id: uuidv4(), title: "fashion", colour: "#e7c1ff" },
];

const companies = [
  {
    id: uuidv4(),
    name: "ASOS",
    contact_email: "support@asos.com",
    image_url: "https://www.asos.com/favicon.ico",
  },
  {
    id: uuidv4(),
    name: "McDonalds",
    contact_email: "contact@mcdonalds.com",
    image_url: "https://cdn.simpleicons.org/mcdonalds",
  },
  {
    id: uuidv4(),
    name: "Apple",
    contact_email: "support@apple.com",
    image_url: "https://cdn.simpleicons.org/apple",
  },
];

const offers = [
  {
    title: "25% off designer sneakers",
    company: "ASOS",
    category: "fashion",
    discount: 25,
    website: "https://www.asos.com/asos-design/asos-design-chunky-trainers-in-white/prd/204736604",
    image_url:
      "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Buy one get one free fries",
    company: "McDonalds",
    category: "food",
    discount: 50,
    website: "https://www.mcdonalds.com/gb/en-gb/product/fries.html",
    image_url:
      "https://images.unsplash.com/photo-1571091718767-18b5b1457add?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "15% off AirPods",
    company: "Apple",
    category: "tech",
    discount: 15,
    website: "https://www.apple.com/uk/shop/product/MTJV3ZM/A/airpods-pro",
    image_url:
      "https://images.unsplash.com/photo-1518441902117-fb6b6a8c5c2c?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "20% off summer dresses",
    company: "ASOS",
    category: "fashion",
    discount: 20,
    website: "https://www.asos.com/asos-design/asos-design-summer-dress-with-tie/prd/204505028",
    image_url:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Free McFlurry with any burger",
    company: "McDonalds",
    category: "food",
    discount: 100,
    website: "https://www.mcdonalds.com/gb/en-gb/product/mcflurry-oreo.html",
    image_url:
      "https://images.unsplash.com/photo-1481391032119-d89fee407e44?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "10% off MacBook accessories",
    company: "Apple",
    category: "tech",
    discount: 10,
    website: "https://www.apple.com/uk/shop/product/MJ1M2ZM/A/usb-c-digital-av-multiport-adapter",
    image_url:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "35% off jackets",
    company: "ASOS",
    category: "fashion",
    discount: 35,
    website: "https://www.asos.com/topman/topman-overshirt-in-khaki/prd/204429187",
    image_url:
      "https://images.unsplash.com/photo-1521577352947-9bb58764b69a?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Combo meal meal deal",
    company: "McDonalds",
    category: "food",
    discount: 30,
    website: "https://www.mcdonalds.com/gb/en-gb/product/big-mac.html",
    image_url:
      "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "20% off iPhone screen protectors",
    company: "Apple",
    category: "tech",
    discount: 20,
    website:
      "https://www.apple.com/uk/shop/product/HLKY2ZM/A/belkin-ultraglass-screen-protector-for-iphone-14",
    image_url:
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Flash sale on headphones",
    company: "ASOS",
    category: "tech",
    discount: 40,
    website: "https://www.asos.com/asos-design/asos-design-over-ear-headphones/prd/203829233",
    image_url:
      "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=800&q=80",
  },
];

async function run() {
  try {
    await client.connect();

    await client.query("TRUNCATE offers, companies, categories RESTART IDENTITY CASCADE;");

    const categoryMap = new Map<string, string>();
    for (const category of categories) {
      await client.query("INSERT INTO categories(id, title, colour) VALUES ($1, $2, $3)", [
        category.id,
        category.title,
        category.colour,
      ]);
      categoryMap.set(category.title, category.id);
    }

    const companyMap = new Map<string, string>();
    for (const company of companies) {
      await client.query(
        "INSERT INTO companies(id, name, contact_email, image_url) VALUES ($1, $2, $3, $4)",
        [company.id, company.name, company.contact_email, company.image_url]
      );
      companyMap.set(company.name, company.id);
    }

    for (const offer of offers) {
      const companyId = companyMap.get(offer.company);
      const categoryId = categoryMap.get(offer.category);

      if (!companyId || !categoryId) {
        throw new Error(`Missing IDs for ${offer.company} / ${offer.category}`);
      }

      await client.query(
        "INSERT INTO offers(id, title, company_id, discount_percent, category_id, website, image_url) VALUES ($1, $2, $3, $4, $5, $6, $7)",
        [
          uuidv4(),
          offer.title,
          companyId,
          offer.discount,
          categoryId,
          offer.website,
          offer.image_url,
        ]
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
