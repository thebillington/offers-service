import { getDatabasePool } from "../connection";

export interface CompanyRow {
  id: string;
  name: string;
  contact_email: string;
}

const pool = getDatabasePool();

export async function getCompanyById(id: string) {
  const { rows } = await pool.query<CompanyRow>(
    `
      SELECT id, name, contact_email
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
      SELECT id, name, contact_email
      FROM companies
    `
  );
  return rows;
}
