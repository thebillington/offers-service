import { getDatabasePool } from "../connection";

export interface OfferWithRelations {
  id: string;
  title: string;
  discount_percent: number;
  company_id: string;
  company_name: string;
  company_contact_email: string;
  category_id: string | null;
  category_title: string | null;
}

const baseSelect = `
  SELECT
    offers.id,
    offers.title,
    offers.discount_percent,
    companies.id AS company_id,
    companies.name AS company_name,
    companies.contact_email AS company_contact_email,
    categories.id AS category_id,
    categories.title AS category_title
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
