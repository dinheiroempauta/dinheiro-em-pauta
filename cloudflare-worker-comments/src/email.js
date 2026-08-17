/**
 * Notificação por e-mail (via Resend, https://resend.com — gratuito até
 * 3 mil e-mails/mês) pros comentaristas que preencheram e-mail (opcional):
 * aviso quando o próprio comentário é aprovado/rejeitado, e quando uma
 * resposta ao comentário deles é aprovada.
 *
 * Sem RESEND_API_KEY configurado (`wrangler secret put RESEND_API_KEY`),
 * as funções abaixo viram no-op — moderação continua funcionando
 * normalmente, só sem notificação.
 *
 * FROM_EMAIL usa o domínio de teste do Resend (onboarding@resend.dev)
 * até o domínio próprio do site estar ativo e verificado no painel do
 * Resend — nesse ponto, trocar por algo como
 * "Independência Calculada <comentarios@independenciacalculada.com.br>".
 */

const FROM_EMAIL = "Independência Calculada <onboarding@resend.dev>";

// Mapa manual slug -> caminho real da página, porque simuladores vivem em
// simuladores/<slug>/ mas o slug salvo no banco é só o nome curto (mesmo
// valor do data-slug do botão de curtir). Atualizar ao publicar artigo ou
// simulador novo.
const SLUG_PATHS = {
  "comparador-composicao": "simuladores/comparador-composicao",
  "pu-renda-mais": "simuladores/pu-renda-mais",
  "pu-educa-mais": "simuladores/pu-educa-mais",
};

// TODO: trocar para o domínio próprio quando estiver ativo (ver
// internal/BACKLOG.md — mesmo TODO já existente nas páginas do site).
const SITE_ORIGIN = "https://independenciacalculada-droid.github.io/independencia-calculada";

function articleUrl(slug) {
  const path = SLUG_PATHS[slug] || slug;
  return `${SITE_ORIGIN}/${path}/#comentarios`;
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, (c) => (
    { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]
  ));
}

async function sendEmail(env, { to, subject, html }) {
  if (!env.RESEND_API_KEY || !to) return;
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from: FROM_EMAIL, to: [to], subject, html }),
    });
    if (!res.ok) {
      // Só aparece em `wrangler tail` (log ao vivo) — nunca é exposto pro
      // navegador de quem comentou nem pro painel de moderação. Sem isso,
      // um erro do Resend (chave inválida, domínio não verificado, modo
      // de teste restringindo o destinatário) falhava 100% em silêncio.
      const body = await res.text().catch(() => "");
      console.error("Resend falhou:", res.status, body);
    }
  } catch (err) {
    console.error("Resend: erro de rede", err);
    // Falha no envio de e-mail nunca deve derrubar a moderação — só perde
    // a notificação, o comentário já foi aprovado/rejeitado normalmente.
  }
}

export async function notifyModerationResult(env, comment, action) {
  if (!comment.email) return;
  const url = articleUrl(comment.slug);
  const nick = escapeHtml(comment.nickname);
  if (action === "approve") {
    await sendEmail(env, {
      to: comment.email,
      subject: "Seu comentário foi aprovado — Independência Calculada",
      html: `<p>Olá, ${nick}!</p><p>Seu comentário no Independência Calculada foi aprovado e já está visível para outros leitores.</p><p><a href="${url}">Ver o comentário</a></p>`,
    });
  } else {
    await sendEmail(env, {
      to: comment.email,
      subject: "Seu comentário não foi aprovado — Independência Calculada",
      html: `<p>Olá, ${nick}!</p><p>Seu comentário no Independência Calculada passou por moderação manual e não foi aprovado para publicação.</p>`,
    });
  }
}

export async function notifyReply(env, parentComment, replyComment) {
  if (!parentComment || !parentComment.email) return;
  // Não notifica quando a pessoa responde o próprio comentário.
  if (parentComment.email === replyComment.email) return;
  const url = articleUrl(replyComment.slug);
  const nick = escapeHtml(parentComment.nickname);
  await sendEmail(env, {
    to: parentComment.email,
    subject: "Alguém respondeu seu comentário — Independência Calculada",
    html: `<p>Olá, ${nick}!</p><p><strong>${escapeHtml(replyComment.nickname)}</strong> respondeu ao seu comentário no Independência Calculada.</p><p><a href="${url}">Ver a resposta</a></p>`,
  });
}
