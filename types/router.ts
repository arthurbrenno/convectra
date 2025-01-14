export type HTTPMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

export interface RouteHandler {
  (req: Request, params?: Record<string, string>): Promise<Response>;
}

export interface Route {
  method: HTTPMethod;
  path: string;
  handler: RouteHandler;
}
