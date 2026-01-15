import { getDatabasePool } from "../connection";

export interface OfferWithRelations {
  id: string;
  title: string;
  website: string | null;
  image_url: string | null;
  discount_percent: number;
  company_id: string;
  company_name: string;
  company_contact_email: string;
  company_image_url: string | null;
  category_id: string | null;
  category_title: string | null;
  category_colour: string | null;
}

const baseSelect = `
  SELECT
    offers.id,
    offers.title,
    offers.website,
    offers.image_url,
    offers.discount_percent,
    companies.id AS company_id,
    companies.name AS company_name,
    companies.contact_email AS company_contact_email,
    companies.image_url AS company_image_url,
    categories.id AS category_id,
    categories.title AS category_title,
    categories.colour AS category_colour
  FROM offers
  JOIN companies ON companies.id = offers.company_id
  LEFT JOIN categories ON categories.id = offers.category_id
`;

const pool = getDatabasePool();

export async function getOfferById(id: string) {
  const { rows } = await pool.query<OfferWithRelations>(`${baseSelect} WHERE offers.id = $1`, [id]);
  return rows;
}

export async function listOffers() {
  const { rows } = await pool.query<OfferWithRelations>(baseSelect);
  return rows;
}
