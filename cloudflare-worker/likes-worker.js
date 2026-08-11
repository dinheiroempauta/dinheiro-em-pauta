/**
 * Independência Calculada — contador de curtidas
 *
 * Rotas:
 *   GET  /likes?slug=nome-do-artigo   -> { slug, count }
 *   POST /likes?slug=nome-do-artigo   -> incrementa e retorna { slug, count }
 *
 * Requer um KV namespace vinculado como "LIKES" (ver wrangler.toml).
 */

const ALLOWED_ORIGINS = [
  "https://independenciacalculada.com.br",
  "https://independenciacalculada-droid.github.io",
];

function corsHeaders(origin) {
  const allow = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    "Access-Control-Allow-Origin": allow,
    "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Cache-Control": "no-store",
  };
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const origin = request.headers.get("Origin") || "";
    const headers = { ...corsHeaders(origin), "Content-Type": "application/json" };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders(origin) });
    }

    if (url.pathname !== "/likes") {
      return new Response(JSON.stringify({ error: "not found" }), { status: 404, headers });
    }

    const slug = (url.searchParams.get("slug") || "").trim();
    if (!slug || slug.length > 200 || !/^[a-z0-9-]+$/.test(slug)) {
      return new Response(JSON.stringify({ error: "invalid slug" }), { status: 400, headers });
    }

    if (request.method === "GET") {
      const raw = await env.LIKES.get(slug);
      const count = raw ? parseInt(raw, 10) : 0;
      return new Response(JSON.stringify({ slug, count }), { headers });
    }

    if (request.method === "POST") {
      const raw = await env.LIKES.get(slug);
      const count = (raw ? parseInt(raw, 10) : 0) + 1;
      await env.LIKES.put(slug, String(count));
      return new Response(JSON.stringify({ slug, count }), { headers });
    }

    if (request.method === "DELETE") {
      const raw = await env.LIKES.get(slug);
      const count = Math.max((raw ? parseInt(raw, 10) : 0) - 1, 0);
      await env.LIKES.put(slug, String(count));
      return new Response(JSON.stringify({ slug, count }), { headers });
    }

    return new Response(JSON.stringify({ error: "method not allowed" }), { status: 405, headers });
  },
};
