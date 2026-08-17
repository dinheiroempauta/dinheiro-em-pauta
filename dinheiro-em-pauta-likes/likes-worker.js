/**
 * Dinheiro em Pauta — contador de curtidas
 *
 * Rotas:
 *   GET  /likes?slug=nome-do-artigo   -> { slug, count }
 *   POST /likes?slug=nome-do-artigo   -> incrementa e retorna { slug, count }
 *
 * Requer um KV namespace vinculado como "LIKES" (ver wrangler.toml).
 */

const ALLOWED_ORIGINS = [
  "https://dinheiroempauta.com.br",
  "https://dinheiroempauta.github.io",
  // TODO: remover "http://" assim que o "Enforce HTTPS" do GitHub Pages
  // estiver disponível pro domínio (certificado ainda em emissão em
  // 17/08/2026) — até lá o site é servido em HTTP puro, e o navegador
  // manda Origin: http://... nesse caso.
  "http://dinheiroempauta.com.br",
];

// Limite de requisições por IP+slug numa janela de tempo, para dificultar
// abuso automatizado (inflar/zerar curtidas via script). Não é proteção
// perfeita (IPs podem ser trocados), mas eleva o custo do abuso o
// suficiente para um contador de "achei útil" de um blog pessoal.
const RATE_LIMIT_MAX = 8;
const RATE_LIMIT_WINDOW_SECONDS = 60;

function corsHeaders(origin) {
  const headers = {
    "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Cache-Control": "no-store",
  };
  // Origem desconhecida: não seta o header em vez de cair num allow-list
  // "de mentira" — o navegador então bloqueia a leitura da resposta.
  if (ALLOWED_ORIGINS.includes(origin)) {
    headers["Access-Control-Allow-Origin"] = origin;
  }
  return headers;
}

async function isRateLimited(env, ip, slug) {
  const key = `rl:${ip}:${slug}`;
  const raw = await env.LIKES.get(key);
  const count = raw ? parseInt(raw, 10) : 0;
  if (count >= RATE_LIMIT_MAX) return true;
  await env.LIKES.put(key, String(count + 1), { expirationTtl: RATE_LIMIT_WINDOW_SECONDS });
  return false;
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

    if (request.method !== "GET") {
      const ip = request.headers.get("CF-Connecting-IP") || "unknown";
      if (await isRateLimited(env, ip, slug)) {
        return new Response(JSON.stringify({ error: "too many requests" }), { status: 429, headers });
      }
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
