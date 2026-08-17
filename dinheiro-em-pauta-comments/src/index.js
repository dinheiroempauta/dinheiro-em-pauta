/**
 * Dinheiro em Pauta — comentários próprios (substitui o Cusdis)
 *
 * Rotas:
 *   GET  /comments?slug=X              -> { comments: [...] }  (só approved, em árvore recursiva)
 *   POST /comments                     -> { status: "pending" }
 *   GET  /admin                        -> painel HTML de moderação (login por token)
 *   GET  /admin/pending?token=...      -> { pending: [...] }
 *   POST /admin/moderate               -> { status: "ok" }
 *
 * Requer um D1 database vinculado como "DB" (ver wrangler.toml) e os
 * secrets ADMIN_TOKEN e IP_SALT (`wrangler secret put ...`). RESEND_API_KEY
 * é opcional: sem ele, aprovar/rejeitar/responder funciona normalmente,
 * só sem notificar por e-mail (ver src/email.js).
 */

import { ADMIN_PAGE_HTML } from "./adminPage.js";
import { notifyModerationResult, notifyReply } from "./email.js";

const ALLOWED_ORIGINS = [
  "https://dinheiroempauta.com.br",
  "https://dinheiroempauta.github.io",
  // TODO: remover "http://" assim que o "Enforce HTTPS" do GitHub Pages
  // estiver disponível pro domínio (certificado ainda em emissão em
  // 17/08/2026) — até lá o site é servido em HTTP puro, e o navegador
  // manda Origin: http://... nesse caso.
  "http://dinheiroempauta.com.br",
];

const SLUG_RE = /^[a-z0-9-]+$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const RATE_LIMIT_MAX = 10;
const RATE_LIMIT_WINDOW_MINUTES = 10;

// Origem desconhecida: não seta o header em vez de cair num allow-list "de
// mentira" (mesmo padrão do worker de likes) — o navegador bloqueia a
// leitura da resposta se o header não bater com a origem real.
function corsHeaders(origin) {
  const headers = {
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Cache-Control": "no-store",
  };
  if (ALLOWED_ORIGINS.includes(origin)) {
    headers["Access-Control-Allow-Origin"] = origin;
  }
  return headers;
}

async function hashIp(ip, salt) {
  const enc = new TextEncoder().encode(ip + salt);
  const digest = await crypto.subtle.digest("SHA-256", enc);
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

function lenOk(str, min, max) {
  return typeof str === "string" && str.trim().length >= min && str.trim().length <= max;
}

function json(obj, status, cors) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { ...cors, "Content-Type": "application/json" },
  });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const origin = request.headers.get("Origin") || "";
    const cors = corsHeaders(origin);

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: cors });
    }

    try {
      if (url.pathname === "/comments" && request.method === "GET") {
        return await handleGetComments(url, env, cors);
      }
      if (url.pathname === "/comments" && request.method === "POST") {
        return await handlePostComment(request, env, cors);
      }
      if (url.pathname === "/admin" && request.method === "GET") {
        return new Response(ADMIN_PAGE_HTML, {
          headers: { "Content-Type": "text/html; charset=utf-8", "X-Robots-Tag": "noindex" },
        });
      }
      if (url.pathname === "/admin/pending" && request.method === "GET") {
        return await handleAdminPending(url, env, cors);
      }
      if (url.pathname === "/admin/moderate" && request.method === "POST") {
        return await handleAdminModerate(request, env, cors);
      }
      return json({ error: "not_found" }, 404, cors);
    } catch (err) {
      return json({ error: "internal_error" }, 500, cors);
    }
  },
};

async function handleGetComments(url, env, cors) {
  const slug = (url.searchParams.get("slug") || "").trim();
  if (!slug || !SLUG_RE.test(slug)) {
    return json({ error: "invalid_slug" }, 400, cors);
  }

  const { results } = await env.DB.prepare(
    `SELECT id, parent_id, nickname, message, is_author, created_at
     FROM comments WHERE slug = ? AND status = 'approved'
     ORDER BY created_at ASC`
  ).bind(slug).all();

  const byId = new Map();
  const top = [];
  results.forEach((r) => byId.set(r.id, { ...r, is_author: !!r.is_author, replies: [] }));
  results.forEach((r) => {
    const node = byId.get(r.id);
    if (r.parent_id && byId.has(r.parent_id)) {
      byId.get(r.parent_id).replies.push(node);
    } else {
      top.push(node);
    }
  });
  return json({ comments: top }, 200, cors);
}

async function handlePostComment(request, env, cors) {
  const body = await request.json().catch(() => null);
  if (!body) return json({ error: "invalid_body" }, 400, cors);

  // Honeypot: finge sucesso, não grava nada — não dá pista pro bot de que
  // foi pego.
  if (body.botcheck) return json({ status: "pending" }, 201, cors);

  const slug = typeof body.slug === "string" ? body.slug.trim() : "";
  if (!slug || !SLUG_RE.test(slug)) return json({ error: "invalid_slug" }, 400, cors);
  if (!lenOk(body.nickname, 1, 60)) return json({ error: "invalid_nickname" }, 400, cors);
  if (!lenOk(body.message, 1, 2000)) return json({ error: "invalid_message" }, 400, cors);

  const email = typeof body.email === "string" ? body.email.trim() : "";
  if (email && !EMAIL_RE.test(email)) return json({ error: "invalid_email" }, 400, cors);

  let parentId = null;
  if (body.parent_id) {
    // Sem limite de profundidade: resposta de resposta de resposta é
    // permitida (diferente do Cusdis, que só tinha 1 nível). O front-end
    // renderiza a árvore inteira de forma recursiva.
    const parent = await env.DB.prepare(
      `SELECT id FROM comments WHERE id = ? AND slug = ? AND status = 'approved'`
    ).bind(body.parent_id, slug).first();
    if (!parent) return json({ error: "invalid_parent" }, 400, cors);
    parentId = parent.id;
  }

  const ip = request.headers.get("CF-Connecting-IP") || "unknown";
  const ipHash = await hashIp(ip, env.IP_SALT || "");

  const recent = await env.DB.prepare(
    `SELECT COUNT(*) as n FROM comments WHERE ip_hash = ? AND created_at > datetime('now', ?)`
  ).bind(ipHash, `-${RATE_LIMIT_WINDOW_MINUTES} minutes`).first();
  if (recent && recent.n >= RATE_LIMIT_MAX) return json({ error: "rate_limited" }, 429, cors);

  await env.DB.prepare(
    `INSERT INTO comments (slug, parent_id, nickname, email, message, ip_hash)
     VALUES (?, ?, ?, ?, ?, ?)`
  ).bind(slug, parentId, body.nickname.trim(), email || null, body.message.trim(), ipHash).run();

  return json({ status: "pending" }, 201, cors);
}

async function handleAdminPending(url, env, cors) {
  if (url.searchParams.get("token") !== env.ADMIN_TOKEN) return json({ error: "unauthorized" }, 401, cors);
  const { results } = await env.DB.prepare(
    `SELECT id, slug, nickname, email, message, created_at FROM comments
     WHERE status = 'pending' ORDER BY created_at DESC`
  ).all();
  return json({ pending: results }, 200, cors);
}

async function handleAdminModerate(request, env, cors) {
  const body = await request.json().catch(() => null);
  if (!body || body.token !== env.ADMIN_TOKEN) return json({ error: "unauthorized" }, 401, cors);
  if (body.action !== "approve" && body.action !== "reject") {
    return json({ error: "invalid_action" }, 400, cors);
  }

  // Busca o comentário ANTES de aprovar/apagar — precisamos de
  // slug/nickname/email/parent_id pra notificação, e no reject o registro
  // deixa de existir depois do DELETE.
  const comment = await env.DB.prepare(
    `SELECT id, slug, parent_id, nickname, email FROM comments WHERE id = ?`
  ).bind(body.id).first();
  if (!comment) return json({ error: "not_found" }, 404, cors);

  if (body.action === "approve") {
    await env.DB.prepare(`UPDATE comments SET status = 'approved' WHERE id = ?`).bind(body.id).run();
    await notifyModerationResult(env, comment, "approve");
    if (comment.parent_id) {
      const parent = await env.DB.prepare(
        `SELECT nickname, email FROM comments WHERE id = ?`
      ).bind(comment.parent_id).first();
      await notifyReply(env, parent, comment);
    }
  } else {
    await env.DB.prepare(`DELETE FROM comments WHERE id = ?`).bind(body.id).run();
    await notifyModerationResult(env, comment, "reject");
  }
  return json({ status: "ok" }, 200, cors);
}
