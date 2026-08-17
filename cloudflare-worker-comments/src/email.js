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
 */

const FROM_EMAIL = "Dinheiro em Pauta <comentarios@dinheiroempauta.com.br>";

// Mapa manual slug -> caminho real da página, porque simuladores vivem em
// simuladores/<slug>/ mas o slug salvo no banco é só o nome curto (mesmo
// valor do data-slug do botão de curtir). Atualizar ao publicar artigo ou
// simulador novo.
const SLUG_PATHS = {
  "comparador-composicao": "simuladores/comparador-composicao",
  "pu-renda-mais": "simuladores/pu-renda-mais",
  "pu-educa-mais": "simuladores/pu-educa-mais",
};

const SITE_ORIGIN = "https://dinheiroempauta.com.br";

function articleUrl(slug) {
  const path = SLUG_PATHS[slug] || slug;
  return `${SITE_ORIGIN}/${path}/#comentarios`;
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, (c) => (
    { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]
  ));
}

// Cada função de notificação devolve um diagnóstico (nunca lança) — usado
// pelo /admin/moderate pra devolver no campo "email_debug" da resposta.
// Sem isso, um erro do Resend (chave inválida, domínio não verificado,
// modo de teste restringindo o destinatário) falhava 100% em silêncio, e
// wrangler tail (log ao vivo) não é uma opção confiável — já deu erro de
// rede na máquina do usuário. O token de admin já protege essa rota, então
// devolver o diagnóstico ali não expõe nada pra quem não deveria ver.
async function sendEmail(env, { to, subject, html }) {
  if (!env.RESEND_API_KEY) return { skipped: "sem RESEND_API_KEY configurado" };
  if (!to) return { skipped: "comentário sem e-mail preenchido" };
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from: FROM_EMAIL, to: [to], subject, html }),
    });
    const body = await res.text().catch(() => "");
    if (!res.ok) return { ok: false, to, status: res.status, body };
    return { ok: true, to };
  } catch (err) {
    return { ok: false, to, error: String(err) };
  }
}

export async function notifyModerationResult(env, comment, action) {
  if (!comment.email) return { skipped: "comentário sem e-mail preenchido" };
  const url = articleUrl(comment.slug);
  const nick = escapeHtml(comment.nickname);
  if (action === "approve") {
    return sendEmail(env, {
      to: comment.email,
      subject: "Seu comentário foi aprovado — Dinheiro em Pauta",
      html: `<p>Olá, ${nick}!</p><p>Seu comentário no Dinheiro em Pauta foi aprovado e já está visível para outros leitores.</p><p><a href="${url}">Ver o comentário</a></p>`,
    });
  }
  return sendEmail(env, {
    to: comment.email,
    subject: "Seu comentário não foi aprovado — Dinheiro em Pauta",
    html: `<p>Olá, ${nick}!</p><p>Seu comentário no Dinheiro em Pauta passou por moderação manual e não foi aprovado para publicação.</p>`,
  });
}

export async function notifyReply(env, parentComment, replyComment) {
  if (!parentComment || !parentComment.email) return { skipped: "comentário pai sem e-mail preenchido (ou não existe)" };
  // Não notifica quando a pessoa responde o próprio comentário.
  if (parentComment.email === replyComment.email) return { skipped: "resposta é da mesma pessoa (mesmo e-mail)" };
  const url = articleUrl(replyComment.slug);
  const nick = escapeHtml(parentComment.nickname);
  return sendEmail(env, {
    to: parentComment.email,
    subject: "Alguém respondeu seu comentário — Dinheiro em Pauta",
    html: `<p>Olá, ${nick}!</p><p><strong>${escapeHtml(replyComment.nickname)}</strong> respondeu ao seu comentário no Dinheiro em Pauta.</p><p><a href="${url}">Ver a resposta</a></p>`,
  });
}
