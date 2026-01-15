import { getDatabasePool } from "../connection";

export interface CompanyRow {
  id: string;
  name: string;
  contact_email: string;
  image_url: string | null;
}

const pool = getDatabasePool();

export async function getCompanyById(id: string) {
  const { rows } = await pool.query<CompanyRow>(
    `
      SELECT id, name, contact_email, image_url
      FROM companies
      WHERE id = $1
    `,
    [id]
  );
  return rows;
}

export async function listCompanies() {
  const { rows } = await pool.query<CompanyRow>(
    `
      SELECT id, name, contact_email, image_url
      FROM companies
    `
  );
  return rows;
}
