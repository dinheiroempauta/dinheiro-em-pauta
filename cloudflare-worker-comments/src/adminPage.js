// Painel de moderação servido pelo próprio Worker em GET /admin — página
// HTML/CSS/JS auto-contida (sem build, sem dependência externa), pensada
// pro Bruno aprovar/rejeitar comentários sem precisar de terminal.
//
// O token nunca é embutido nesta página: fica só no localStorage do
// navegador de quem faz login aqui, e é enviado pro Worker a cada
// chamada — igual ao fluxo por curl que ele já usava.
export const ADMIN_PAGE_HTML = `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>Moderação de comentários — Independência Calculada</title>
<style>
  :root{
    --ink:#EDEFE8; --muted:#A2A99B; --paper:#14170F; --paper-raised:#1B1F16;
    --line:#33392A; --line-strong:#454C38; --green:#6FA382; --green-hover:#83B593;
    --brick:#E08268;
  }
  *{ box-sizing:border-box; }
  body{
    margin:0; padding:32px 20px 60px; background:var(--paper); color:var(--ink);
    font-family:'IBM Plex Sans', system-ui, sans-serif; font-size:15px; line-height:1.5;
  }
  h1{ font-size:1.3rem; margin:0 0 4px; }
  .sub{ color:var(--muted); font-size:13px; margin:0 0 28px; }
  .wrap{ max-width:640px; margin:0 auto; }
  .card{ border:1px solid var(--line-strong); background:var(--paper-raised); border-radius:4px; padding:20px 22px; margin-bottom:16px; }
  label{ display:block; font-family:'IBM Plex Mono', monospace; font-size:11px; letter-spacing:.05em; text-transform:uppercase; color:var(--muted); margin-bottom:6px; }
  input[type="password"], input[type="text"]{
    width:100%; font-size:14px; padding:10px 12px; border:1px solid var(--line-strong); border-radius:3px;
    background:var(--paper); color:var(--ink); font-family:inherit;
  }
  button{
    font-family:'IBM Plex Mono', monospace; font-size:12px; font-weight:600; letter-spacing:.04em; text-transform:uppercase;
    border-radius:3px; cursor:pointer; padding:10px 16px; min-height:38px; border:1px solid var(--green); background:var(--green); color:#0d0f0a;
  }
  button:hover{ background:var(--green-hover); border-color:var(--green-hover); }
  button.secondary{ background:transparent; color:var(--muted); border-color:var(--line-strong); }
  button.secondary:hover{ color:var(--ink); border-color:var(--ink); background:transparent; }
  button.reject{ background:transparent; color:var(--brick); border-color:var(--brick); }
  button.reject:hover{ background:var(--brick); color:var(--paper); }
  .row{ display:flex; gap:10px; }
  .row form{ flex:1; }
  #loginError, .item-error{ color:var(--brick); font-size:13px; margin-top:10px; display:none; }
  #panel{ display:none; }
  #panel.visible{ display:block; }
  #loginCard.hidden{ display:none; }
  .topbar{ display:flex; justify-content:space-between; align-items:center; margin-bottom:18px; }
  .item{ border-bottom:1px solid var(--line); padding:16px 0; }
  .item:last-child{ border-bottom:none; }
  .item-header{ display:flex; justify-content:space-between; gap:10px; margin-bottom:6px; flex-wrap:wrap; }
  .item-nick{ font-weight:600; }
  .item-meta{ font-family:'IBM Plex Mono', monospace; font-size:12px; color:var(--muted); }
  .item-slug{ font-family:'IBM Plex Mono', monospace; font-size:11px; color:var(--muted); background:var(--paper); border:1px solid var(--line); border-radius:3px; padding:2px 6px; display:inline-block; margin-bottom:8px; }
  .item-message{ white-space:pre-wrap; margin:0 0 12px; overflow-wrap:anywhere; }
  .item-actions{ display:flex; gap:10px; }
  .empty, .loading{ color:var(--muted); padding:16px 0; }
</style>
</head>
<body>
<div class="wrap">
  <h1>Moderação de comentários</h1>
  <p class="sub">Independência Calculada — só você tem o token de acesso.</p>

  <div class="card" id="loginCard">
    <label for="tokenInput">Token de administrador</label>
    <input type="password" id="tokenInput" autocomplete="off">
    <div style="margin-top:14px;">
      <button id="loginBtn">Entrar</button>
    </div>
    <p id="loginError">Token inválido.</p>
  </div>

  <div id="panel">
    <div class="topbar">
      <span class="item-meta" id="pendingCount"></span>
      <div class="row" style="flex:0;">
        <button class="secondary" id="refreshBtn">Atualizar lista</button>
        <button class="secondary" id="logoutBtn">Sair</button>
      </div>
    </div>
    <div class="card">
      <div id="list"><p class="loading">Carregando…</p></div>
    </div>
  </div>
</div>

<script>
(function(){
  "use strict";
  var API = location.origin;
  var STORAGE_KEY = "ic_admin_token";

  var loginCard = document.getElementById("loginCard");
  var panel = document.getElementById("panel");
  var tokenInput = document.getElementById("tokenInput");
  var loginBtn = document.getElementById("loginBtn");
  var loginError = document.getElementById("loginError");
  var refreshBtn = document.getElementById("refreshBtn");
  var logoutBtn = document.getElementById("logoutBtn");
  var listEl = document.getElementById("list");
  var pendingCountEl = document.getElementById("pendingCount");

  function getToken(){ return localStorage.getItem(STORAGE_KEY) || ""; }
  function setToken(t){ localStorage.setItem(STORAGE_KEY, t); }
  function clearToken(){ localStorage.removeItem(STORAGE_KEY); }

  function formatDate(iso){
    var d = new Date(iso.replace(" ", "T") + "Z");
    if (isNaN(d.getTime())) return iso;
    return d.toLocaleDateString("pt-BR", { day:"2-digit", month:"short" }) + ", " +
      d.toLocaleTimeString("pt-BR", { hour:"2-digit", minute:"2-digit" });
  }

  function showPanel(){
    loginCard.classList.add("hidden");
    panel.classList.add("visible");
    loadPending();
  }
  function showLogin(withError){
    panel.classList.remove("visible");
    loginCard.classList.remove("hidden");
    loginError.style.display = withError ? "block" : "none";
    tokenInput.focus();
  }

  function pluralPendentes(n){ return n === 1 ? "1 pendente" : n + " pendentes"; }

  function renderItem(c){
    var item = document.createElement("div");
    item.className = "item";

    var header = document.createElement("div");
    header.className = "item-header";
    var nick = document.createElement("span");
    nick.className = "item-nick";
    nick.textContent = c.nickname + (c.email ? " (" + c.email + ")" : "");
    var meta = document.createElement("span");
    meta.className = "item-meta";
    meta.textContent = formatDate(c.created_at);
    header.appendChild(nick);
    header.appendChild(meta);

    var slug = document.createElement("span");
    slug.className = "item-slug";
    slug.textContent = c.slug;

    var message = document.createElement("p");
    message.className = "item-message";
    message.textContent = c.message;

    var actions = document.createElement("div");
    actions.className = "item-actions";
    var approveBtn = document.createElement("button");
    approveBtn.textContent = "Aprovar";
    approveBtn.addEventListener("click", function(){ moderate(c.id, "approve", item); });
    var rejectBtn = document.createElement("button");
    rejectBtn.className = "reject";
    rejectBtn.textContent = "Rejeitar";
    rejectBtn.addEventListener("click", function(){
      // Rejeitar apaga o comentário de vez (DELETE no banco, sem
      // desfazer) — confirmação evita apagar sem querer um comentário
      // de leitor de verdade com um clique errado.
      var ok = window.confirm('Rejeitar e apagar o comentário de "' + c.nickname + '"? Essa ação não pode ser desfeita.');
      if (ok) moderate(c.id, "reject", item);
    });
    actions.appendChild(approveBtn);
    actions.appendChild(rejectBtn);

    item.appendChild(header);
    item.appendChild(document.createElement("br"));
    item.appendChild(slug);
    item.appendChild(message);
    item.appendChild(actions);
    return item;
  }

  function loadPending(){
    listEl.innerHTML = '<p class="loading">Carregando…</p>';
    fetch(API + "/admin/pending?token=" + encodeURIComponent(getToken()))
      .then(function(r){
        if (r.status === 401) { clearToken(); showLogin(true); throw new Error("unauthorized"); }
        return r.json();
      })
      .then(function(data){
        listEl.innerHTML = "";
        var count = data.pending ? data.pending.length : 0;
        pendingCountEl.textContent = pluralPendentes(count);
        if (!count) {
          listEl.innerHTML = '<p class="empty">Nenhum comentário pendente.</p>';
          return;
        }
        data.pending.forEach(function(c){ listEl.appendChild(renderItem(c)); });
      })
      .catch(function(err){
        if (err.message !== "unauthorized") {
          listEl.innerHTML = '<p class="empty">Erro ao carregar. Tenta atualizar de novo.</p>';
        }
      });
  }

  function describeEmailResult(r){
    if (!r) return null;
    if (r.skipped) return "não enviado (" + r.skipped + ")";
    if (r.ok) return "enviado com sucesso para " + r.to;
    if (r.error) return "erro de rede: " + r.error;
    return "Resend recusou (status " + r.status + "): " + r.body;
  }
  function reportEmailDebug(debug){
    var lines = [];
    var mod = describeEmailResult(debug.moderation);
    if (mod) lines.push("Aviso de aprovação/rejeição: " + mod);
    var reply = describeEmailResult(debug.reply);
    if (reply) lines.push("Aviso de resposta: " + reply);
    if (lines.length) alert(lines.join("\\n\\n"));
  }

  function moderate(id, action, itemEl){
    var buttons = itemEl.querySelectorAll("button");
    buttons.forEach(function(b){ b.disabled = true; });
    fetch(API + "/admin/moderate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: getToken(), id: id, action: action }),
    })
      .then(function(r){ return r.json().then(function(d){ return { ok: r.ok, data: d }; }); })
      .then(function(res){
        if (res.ok) {
          itemEl.remove();
          var remaining = listEl.querySelectorAll(".item").length;
          pendingCountEl.textContent = pluralPendentes(remaining);
          if (!remaining) listEl.innerHTML = '<p class="empty">Nenhum comentário pendente.</p>';
          // Diagnóstico temporário do envio de e-mail (ver
          // internal/BACKLOG.md) — mostra na tela em vez de precisar de
          // wrangler tail ou curl pra saber se o Resend aceitou ou não.
          if (res.data.email_debug) reportEmailDebug(res.data.email_debug);
        } else {
          buttons.forEach(function(b){ b.disabled = false; });
          alert("Não foi possível " + (action === "approve" ? "aprovar" : "rejeitar") + ": " + (res.data.error || "erro"));
        }
      })
      .catch(function(){
        buttons.forEach(function(b){ b.disabled = false; });
        alert("Erro de conexão. Tenta de novo.");
      });
  }

  loginBtn.addEventListener("click", function(){
    var t = tokenInput.value.trim();
    if (!t) return;
    setToken(t);
    showPanel();
  });
  tokenInput.addEventListener("keydown", function(e){ if (e.key === "Enter") loginBtn.click(); });
  refreshBtn.addEventListener("click", loadPending);
  logoutBtn.addEventListener("click", function(){ clearToken(); showLogin(false); tokenInput.value = ""; });

  if (getToken()) { showPanel(); } else { showLogin(false); }
})();
</script>
</body>
</html>
`;
