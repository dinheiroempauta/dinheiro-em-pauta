# Plano de rebrand — Independência Calculada → Dinheiro em Pauta

Documento de planejamento (SDD): nenhuma mudança é aplicada até cada fase
ser aprovada. Cada fase vira um PR separado, revisado e mergeado antes da
próxima começar — rebrand grande demais pra ir tudo num commit só.

## Contexto

Decisão tomada em conversa com o usuário em 17/08/2026: reposicionar o
blog de um público específico de FIRE ("Independência Calculada", tom
técnico/metódico) para um público mais amplo, qualquer pessoa que evita
falar sobre dinheiro ("Dinheiro em Pauta", tom conversacional e
desmistificador). Domínio a comprar: `dinheiroempauta.com.br`. Novo
e-mail de contato: `dinheiroempauta.admin@gmail.com`.

Decisões já confirmadas pelo usuário:
- Renomear também os Workers da Cloudflare (aceitando o risco de recriar
  do zero, já que Cloudflare não permite renomear um Worker existente).
- Renomear o repositório GitHub **e** o usuário da conta GitHub.
- Eu proponho um rascunho de nova tagline pro rodapé (rascunho abaixo).

## Tagline (rodapé) — aprovada

Atual: *"Independência Calculada — Planejamento financeiro para atingir
sua liberdade."*

Nova (aprovada pelo usuário em 17/08/2026): **"Dinheiro em Pauta — onde
falamos sobre finanças, investimentos, economia e FIRE."**

## Fases

### Fase 0 — Pré-requisitos ✅ concluída em 17/08/2026
- [x] Comprar `dinheiroempauta.com.br`
- [x] Criar `dinheiroempauta.admin@gmail.com`
- [x] Configurar DNS (5 registros: 4x A pro apex + CNAME `www`) + registro
      TXT de verificação de domínio na conta GitHub
- [x] `CNAME` criado no repo + custom domain ativado em Settings → Pages
      (site confirmado no ar em `http://dinheiroempauta.com.br`, HTTPS
      "Enforce" ainda pendente de emissão automática do certificado)
- [x] Username da conta GitHub renomeado: `independenciacalculada-droid`
      → `dinheiroempauta` (GitHub redirecionou sozinho; `git remote` local
      e o CNAME `www` do DNS já atualizados pro novo endereço
      `dinheiroempauta.github.io`)

### Fase 1 — Repositório GitHub ✅ concluída em 17/08/2026
- [x] Repositório renomeado: `independencia-calculada` → `dinheiro-em-pauta`
      (feito pelo usuário em Settings → Repository name). `git remote`
      local confirmado funcionando via redirecionamento automático do
      GitHub (owner + repo renomeados no mesmo período, redirect encadeado
      funciona normalmente). Nenhuma referência de código precisava
      mudar — o site já serve do domínio próprio (`dinheiroempauta.com.br`),
      não do caminho do repositório no GitHub Pages.

### Fase 2 — Workers da Cloudflare ✅ concluída em 17/08/2026
Não dá pra renomear um Worker existente — a estratégia é **criar novo em
paralelo, testar, só depois cortar**:
1. [x] Diretórios novos criados: `dinheiro-em-pauta-comments/` (nome
   `dinheiro-em-pauta-comments`) e `dinheiro-em-pauta-likes/` (nome
   `dinheiro-em-pauta-likes`). Código-fonte idêntico ao dos antigos, só
   nome/config mudam. `DEPLOY.md` próprio em cada pasta. Decisão do
   usuário em 17/08/2026: **não migrar dados**, os dois nascem vazios.
2. [x] Usuário rodou D1/KV novos, secrets e deploy dos dois Workers
   (URLs intermediárias sob o subdomínio antigo, trocadas no passo 7).
3. [x] Testado via `curl` pelo usuário: `/likes?slug=teste` e
   `/comments?slug=teste` responderam certo nos dois Workers novos.
4. [x] Front-end trocado: `LIKES_API` em `assets/site.js`,
   `data-comments-api` nas 8 páginas + template, e `connect-src` do CSP
   em todas as páginas do site (inclusive as 4 sem comentários, que só
   usam o worker de likes) apontando pros Workers novos.
5. [x] Confirmado curtir/comentar funcionando no site publicado
   (`dinheiroempauta.com.br`) com os Workers novos — inclusive achado e
   corrigido que o painel de moderação também mudou de endereço (o
   usuário estava com o `/admin` antigo salvo).
6. [x] Workers antigos apagados (`wrangler delete` nas pastas
   `cloudflare-worker/` e `cloudflare-worker-comments/`), e as duas
   pastas removidas do repositório. Referências nos docs
   (`README.md`/`CLAUDE.md`/`CHECKLIST-NOVO-ARTIGO.md`) atualizadas pros
   nomes de pasta novos.
7. [x] Subdomínio `.workers.dev` da conta trocado pelo usuário:
   `independenciacalculada` → `dinheiroempauta`. URLs finais:
   `https://dinheiro-em-pauta-likes.dinheiroempauta.workers.dev` e
   `https://dinheiro-em-pauta-comments.dinheiroempauta.workers.dev`.
   Front-end (`LIKES_API`, `data-comments-api`, `connect-src` do CSP em
   todas as páginas) e os `DEPLOY.md` dos dois Workers atualizados pra
   bater com a URL final. **Fase 2 concluída por completo.**

### Fase 3 — Domínio + infraestrutura que já tinha checklist mapeada
Reaproveita o checklist que já existe em `internal/BACKLOG.md`
("Checklist para quando migrar pro domínio próprio"), com URLs trocadas
pro domínio novo em vez do antigo apontado ali:
- `CNAME` novo no repo
- `og:image`/`twitter:image`, `canonical`, JSON-LD `url` — todas as 8
  páginas + template
- `sitemap.xml`, `feed.xml`
- CSP `connect-src` com as URLs dos Workers novos (fase 2)
- `ALLOWED_ORIGINS` nos dois Workers com o domínio novo
- Google Search Console — ação do usuário (verificar propriedade nova)
- Umami — ação do usuário (trocar domínio associado ao site no painel)
- Resend — ação do usuário (verificar `dinheiroempauta.com.br` no painel,
  depois eu troco `FROM_EMAIL` em `email.js`)
- Buttondown — o link de assinatura hoje é
  `buttondown.com/api/emails/embed-subscribe/independencia_calculada`
  (usa o *username* da conta Buttondown, não é config nossa) — usuário
  precisa renomear a conta lá (ou criar nova) antes de eu trocar a URL no
  código

### Fase 4 — Marca/texto (o que eu consigo fazer sozinho, sem depender de nada externo)
Find-and-replace estrutural, não é só trocar a palavra — cada ocorrência
segue um padrão já identificado:
- Wordmark do masthead: `<span>Independência</span>Calculada` (8 páginas
  + template) → equivalente pra "Dinheiro em Pauta"
- `<title>`, meta description, Open Graph, Twitter Card — todas as 8
  páginas + template
- JSON-LD (`Organization`/`WebSite`/`BreadcrumbList` — `"name":
  "Independência Calculada"` aparece 4x por página)
- Rodapé (`<footer>`) — tagline nova (ver rascunho acima)
- `README.md`, `CLAUDE.md`, `internal/BACKLOG.md`,
  `internal/CHECKLIST-NOVO-ARTIGO.md` — nome do projeto na documentação
- `cloudflare-worker-comments/src/email.js` — nome da marca nos assuntos/
  corpo dos e-mails, `FROM_EMAIL` (depende da Fase 3/Resend)
- `cloudflare-worker-comments/src/adminPage.js` — título do painel
- E-mail de contato (`independenciacalculada@gmail.com` →
  `dinheiroempauta.admin@gmail.com`) onde aparecer no código/docs

### Fase 5 — Identidade visual ✅ concluída em 17/08/2026
- [x] **Favicon**: monograma "DP" (mesma paleta/estilo do "IC" anterior —
      fundo `--green-deep`, letras `--gold-soft`, traço `--gold`) gerado
      via Chromium headless + Fraunces, substituindo `favicon.png` na
      raiz (nome do arquivo não mudou, nenhuma mudança de código
      necessária).
- [x] **og-images dos artigos**: eram 4, não 3 como este documento e o
      `BACKLOG.md` registravam originalmente — `og-cover-montar-carteira-
      estudo-de-caso.png` também tinha o wordmark antigo e só foi
      encontrada ao conferir os arquivos publicados. As 4 regeneradas
      (mesma composição/H1/motivo gráfico já aprovados, só o wordmark
      trocado pra "Dinheiro em Pauta"), renomeadas com sufixo de versão
      novo (cache de crawlers, ver `BACKLOG.md`), e `og:image`/
      `twitter:image`/JSON-LD atualizados nos 4 artigos: `og-cover-pwr-
      carteira-fire-v3.png`, `og-cover-ipca-hiperinflacao-v3.png`,
      `og-cover-quanto-posso-retirar-v2.png`, `og-cover-montar-carteira-
      estudo-de-caso-v2.png`.

**Rebrand "Independência Calculada" → "Dinheiro em Pauta" concluído por
completo — todas as 5 fases feitas.**

## O que eu NÃO vou tocar
- Conteúdo/tom dos 3 artigos técnicos já publicados — decisão do usuário
  em 17/08/2026: **ficam como estão**, só a marca/nome muda neles (não
  reescrever introdução nem tom)
- Qualquer exclusão de Worker antigo (só depois de confirmação explícita
  de que o novo está validado em produção)

## Ordem de execução — status

Decisão do usuário em 17/08/2026: **esperar a Fase 0 terminar antes de
qualquer mudança de código.** Meu próximo passo só começa quando ele
confirmar aqui que Fase 0 está pronta:
- [ ] Domínio `dinheiroempauta.com.br` comprado
- [ ] `dinheiroempauta.admin@gmail.com` criado
- [ ] DNS do domínio configurado (README, Passo 2)
- [ ] Username da conta GitHub renomeado

Depois da Fase 0 confirmada, ordem: Fase 1 (usuário, repo) → Fase 4 (eu,
texto — não depende de Workers novos nem de domínio ativo) → Fase 2 (eu
+ usuário, Workers) → Fase 3 (eu + usuário, domínio) → Fase 5 (usuário
gera as imagens, eu não mexo em código nessa parte).
