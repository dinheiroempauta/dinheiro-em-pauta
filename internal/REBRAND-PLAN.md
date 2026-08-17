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

### Fase 1 — Repositório GitHub (baixo risco, GitHub redireciona sozinho)
- Renomear `independencia-calculada` → `dinheiro-em-pauta` (Settings →
  Repository name). Ação do usuário (não tenho permissão de admin pra
  isso via API); eu atualizo o remote local depois.

### Fase 2 — Workers da Cloudflare (risco real, cutover cuidadoso)
Não dá pra renomear um Worker existente — a estratégia é **criar novo em
paralelo, testar, só depois cortar**:
1. Eu crio `cloudflare-worker-comments` → novo diretório com
   `wrangler.toml` apontando pro nome novo (`dinheiro-em-pauta-comments`)
   e `cloudflare-worker` → `dinheiro-em-pauta-likes`. Código-fonte
   idêntico, só nome/URL mudam.
2. Usuário roda os `wrangler d1 create` / `wrangler kv namespace create`
   NOVOS (bancos novos, não reaproveita os antigos — ver ponto de dados
   abaixo) e os deploys, com os secrets de novo
   (`ADMIN_TOKEN`/`IP_SALT`/`RESEND_API_KEY`).
3. **Dados existentes** (comentários já aprovados, contador de curtidas):
   usuário decide se migra manualmente (`wrangler d1 execute` com
   `INSERT`, `wrangler kv key put` pros likes) ou aceita começar do zero
   — pouco conteúdo hoje, então começar do zero é razoável, mas a decisão
   é dele.
4. Só depois que os Workers novos estiverem testados e no ar, eu troco
   `LIKES_API`/`data-comments-api` no front-end pras URLs novas, num PR
   único.
5. Usuário apaga os Workers antigos (`wrangler delete`) só depois de
   confirmar que os novos estão 100% funcionando — nunca antes.

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

### Fase 5 — Identidade visual (conteúdo, não código)
- **Favicon**: monograma "IC" não faz mais sentido — preciso de um
  prompt novo (mesmo processo do favicon atual) pra gerar um monograma
  "DP" ou símbolo equivalente; usuário gera a imagem e sobe o arquivo,
  eu ajusto nada no código (já referencia `/favicon.png` por nome fixo)
- **og-images dos 3 artigos**: têm o nome do blog desenhado visualmente
  dentro da imagem — precisam ser regeneradas (mesmo processo já usado:
  prompt padronizado + geração externa pelo usuário), não é troca de
  texto no HTML

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
