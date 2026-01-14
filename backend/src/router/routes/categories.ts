import { jsonResponse } from "../../http/response";
import { getCategoryById, listCategories } from "../../db/queries/categories";

export async function handleCategories(id?: string) {
  if (id) {
    const rows = await getCategoryById(id);
    if (!rows.length) {
      return jsonResponse(404, { message: "Category not found" });
    }
    return jsonResponse(200, rows[0]);
  }

  const rows = await listCategories();
  return jsonResponse(200, { data: rows });
}
