import { jsonResponse } from "../../http/response";
import { getCompanyById, listCompanies } from "../../db/queries/companies";

export async function handleCompanies(id?: string) {
  if (id) {
    const rows = await getCompanyById(id);
    if (!rows.length) {
      return jsonResponse(404, { message: "Company not found" });
    }
    return jsonResponse(200, rows[0]);
  }

  const rows = await listCompanies();
  return jsonResponse(200, { data: rows });
}
