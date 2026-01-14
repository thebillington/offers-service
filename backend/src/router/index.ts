import type { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";
import { jsonResponse } from "../http/response";
import { handleOffers } from "./routes/offers";
import { handleCategories } from "./routes/categories";
import { handleCompanies } from "./routes/companies";

const routeHandlers: Record<string, (id?: string) => Promise<APIGatewayProxyResultV2>> = {
  offers: handleOffers,
  categories: handleCategories,
  companies: handleCompanies,
};

const parsePath = (rawPath?: string) => {
  const path = rawPath ?? "";
  const stripped = path.startsWith("/api") ? path.slice("/api".length) : path;
  const segments = stripped.split("/").filter(Boolean);
  return {
    resource: segments[0],
    id: segments[1],
  };
};

export async function routeRequest(
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> {
  const method = event.requestContext.http.method;
  if (method !== "GET") {
    return jsonResponse(405, { message: "Method not allowed" });
  }

  const { resource, id } = parsePath(event.rawPath ?? event.requestContext.http.path);
  const handler = resource ? routeHandlers[resource] : undefined;

  if (!handler) {
    return jsonResponse(404, { message: "Not found" });
  }

  return handler(id);
}
