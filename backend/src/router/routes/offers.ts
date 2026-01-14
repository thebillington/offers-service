import { jsonResponse } from "../../http/response";
import { getOfferById, listOffers } from "../../db/queries/offers";

export async function handleOffers(id?: string) {
  if (id) {
    const rows = await getOfferById(id);
    if (!rows.length) {
      return jsonResponse(404, { message: "Offer not found" });
    }
    return jsonResponse(200, rows[0]);
  }

  const rows = await listOffers();
  return jsonResponse(200, { data: rows });
}
