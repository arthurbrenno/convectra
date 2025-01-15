// server.ts
import { serve } from "bun";
import { renderLatexHandler } from "./routes/latex_html";
import type { HTTPMethod, Route } from "./types/router"; // Importação de tipos com 'import type'

const API_PREFIX = "/api/v1";

// const PORT = Number(Bun.env["PORT"]) || 3000;
const PORT = 3000;

const routes: Route[] = [
  {
    method: "POST",
    path: "/latex-html",
    handler: renderLatexHandler,
  },
];

const findRoute = (method: string, pathname: string): Route | undefined => {
  if (!pathname.startsWith(API_PREFIX)) {
    return undefined;
  }

  const relativePath = pathname.slice(API_PREFIX.length) || "/";

  return routes.find(
    (route) => route.method === method && route.path === relativePath
  );
};

serve({
  port: PORT,
  async fetch(req: Request): Promise<Response> {
    const url = new URL(req.url);
    const route = findRoute(req.method as HTTPMethod, url.pathname);

    if (route) {
      try {
        return await route.handler(req);
      } catch (error) {
        console.error("Erro no manipulador da rota:", error);
        return new Response(
          JSON.stringify({ error: "Erro interno do servidor" }),
          {
            status: 500,
            headers: { "Content-Type": "application/json" },
          }
        );
      }
    }

    // Responde com 404 para rotas não encontradas ou que não começam com o prefixo
    return new Response(
      JSON.stringify({ error: "Rota não encontrada" }),
      {
        status: 404,
        headers: { "Content-Type": "application/json" },
      }
    );
  },
});

console.log(`Server running or http://0.0.0.0:${PORT}`);
