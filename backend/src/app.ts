import type { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";
import { jsonResponse } from "./http/response";
import { routeRequest } from "./router";

export async function handleAppEvent(
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> {
  try {
    return await routeRequest(event);
  } catch (error) {
    console.error("Unhandled API error", error);
    return jsonResponse(500, { message: "Internal server error" });
  }
}
