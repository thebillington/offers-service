import type { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { handleAppEvent } from "./app";

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  return handleAppEvent(event);
};
