import { getDatabasePool } from "../connection";

export interface CategoryRow {
  id: string;
  title: string;
}

const pool = getDatabasePool();

export async function getCategoryById(id: string) {
  const { rows } = await pool.query<CategoryRow>(
    `
      SELECT id, title
      FROM categories
      WHERE id = $1
    `,
    [id]
  );
  return rows;
}

export async function listCategories() {
  const { rows } = await pool.query<CategoryRow>(
    `
      SELECT id, title
      FROM categories
    `
  );
  return rows;
}
