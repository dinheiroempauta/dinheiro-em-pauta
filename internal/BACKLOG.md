# Backlog — Melhorias do blog Dinheiro em Pauta

Arquivo de controle das oportunidades de melhoria identificadas. Cada vez que
uma melhoria for implementada, ela deve ser **removida** desta lista (ou movida
para a seção "Concluído", no fim, com a data).

---

## Configuração pendente (já mapeado, falta executar)

- [ ] **Busca do Google ainda mostra o endereço padrão do GitHub Pages
      em vez do domínio próprio** — testado em 17/08/2026: busca por
      `"Qual é a PWR da minha carteira"` retornou
      `independenciacalculada-droid.github.io/...` em vez de
      `dinheiroempauta.com.br/...`. Conferido que não é bug do
      repositório — `CNAME` aponta pro domínio certo, a página tem
      `<link rel="canonical" href="https://dinheiroempauta.com.br/...">`
      correto, `robots.txt` aponta pro sitemap do domínio certo. O
      GitHub Pages serve o mesmo conteúdo nos dois endereços
      (comportamento padrão dele com domínio customizado); a tag
      canônica é o sinal certo pro Google consolidar pro domínio
      próprio, só falta o tempo de propagação (dias a semanas).
      Reinspecionar essa mesma busca depois de um tempo; se o
      `github.io` continuar aparecendo por semanas, considerar pedir
      remoção manual daquela URL específica no Search Console.
- [ ] **Umami (domínio do site)** — atualizar o domínio cadastrado para
      este site nas configurações do painel do Umami pro domínio novo.
      O script no HTML (`data-website-id="cfa01c19-23cd-468f-8d42-db9a697cf762"`)
      não precisa mudar — é o mesmo ID de site pra sempre, só o domínio
      associado a ele no painel que precisa ser atualizado.
---

## SEO e descoberta

- [ ] **Reinspecionar prévia de compartilhamento no LinkedIn Post
      Inspector para as 9 og-images regeneradas na Fase 5 do rebrand**
      (17/08/2026) — todas trocaram de nome (`-v2`/`-v3`), então o cache
      antigo do LinkedIn não se aplica mais, mas ainda não foram testadas
      na prática após a regeneração. O item anterior aqui ("LinkedIn
      ainda mostra o IPCA borrado") ficou obsoleto porque referenciava
      `og-cover-ipca-hiperinflacao-v2.png`, que nem existe mais — foi
      renomeado pra `-v3.png` nesta mesma rodada.

## Distribuição

- [ ] **Compartilhamento automático** no LinkedIn/X ao publicar um artigo novo
      (hoje é manual). Confirmado em 12 ago: não existe `.github/workflows/`
      no repositório.

---

## Concluído

- [x] **Google Search Console verificado e `sitemap.xml` reenviado** —
      propriedade `dinheiroempauta.com.br` verificada por registro TXT
      no DNS da Hostinger (mesmo provedor usado pra verificação do
      Resend). `sitemap.xml` enviado e processado no mesmo dia — 11
      páginas encontradas, status "Processado". *(17 ago. 2026)*

- [x] **`http://` removido do `ALLOWED_ORIGINS` dos dois Workers e
      deploy confirmado** — "Enforce HTTPS" já estava disponível e
      marcado em Settings → Pages (confirmado por print do usuário), a
      exceção temporária de HTTP foi removida do código
      (`dinheiro-em-pauta-likes/likes-worker.js` e `dinheiro-em-pauta-
      comments/src/index.js`) e o usuário rodou `wrangler deploy` nos
      dois — confirmado pelo output do terminal (`Deployed dinheiro-em-
      pauta-comments triggers` / `Deployed dinheiro-em-pauta-likes
      triggers`). *(17 ago. 2026)*

- [x] **Home sem imagem de compartilhamento** — resolvido como efeito
      colateral da Fase 5 do rebrand: ao regenerar as og-images de todo
      o site (favicon "DP" + troca de wordmark), a home passou a ter
      `og-cover-home-v2.png` com `og:image`/`twitter:image` completos.
      Ainda falta testar a prévia de compartilhamento na prática (ver
      item em "SEO e descoberta" acima, que cobre as 9 imagens
      regeneradas de uma vez). *(17 ago. 2026)*

- [x] **Domínio `dinheiroempauta.com.br` verificado no Resend** — 4
      registros DNS (DKIM, MX, SPF, DMARC) adicionados na Hostinger,
      verificação confirmada pelo Resend. `FROM_EMAIL` trocado de
      `onboarding@resend.dev` pra `comentarios@dinheiroempauta.com.br` —
      agora manda notificação pra qualquer destinatário, não só pro
      e-mail da conta Resend. Diagnóstico temporário removido do código
      (`reportEmailDebug`/`describeEmailResult` em `adminPage.js`, campo
      `email_debug` em `index.js`) — não precisa mais dele.
      *(17 ago. 2026)*

- [x] **Notificação por e-mail nos comentários (via Resend)** — avisa por
      e-mail (se a pessoa preencheu o campo opcional) quando: o próprio
      comentário dela é aprovado, quando é rejeitado, e quando alguém
      responde o comentário dela (só se a resposta for aprovada). Sem
      `RESEND_API_KEY` configurado, tudo funciona igual, só sem notificar
      — nunca bloqueia a moderação se o envio de e-mail falhar. Mapa
      manual slug→caminho em `email.js` porque simuladores vivem em
      `simuladores/<slug>/` mas o slug salvo no banco é só o nome curto.
      *(17 ago. 2026)*

- [x] **Revisão de UX do sistema de comentários (rodada 2)** — depois de
      testar o painel/comentários publicados de verdade, usuário reportou
      6 pontos: confirmação corrigida (`window.confirm` antes de
      "Rejeitar" no painel — a ação apaga o comentário sem desfazer);
      campo de token com foco automático; contador "N pendentes" no
      painel; espaçamento entre a caixa de texto e o botão "Comentar"
      aumentado; lista pública de comentários ganhou um card com
      borda/padding (antes era só texto solto); **bug real corrigido** —
      o aviso "Comentário enviado" nunca tinha a classe `success`
      aplicada (só `error` era removida), por isso sempre aparecia no
      estilo cinza padrão em vez do banner verde; e resposta deixou de
      ter limite de 1 nível (Worker e front-end agora aceitam
      resposta-de-resposta-de-resposta, com indentação reduzida nos
      níveis mais fundos pra não estourar em mobile). *(17 ago. 2026)*

- [x] **Painel de moderação HTML pros comentários** — `GET /admin` no
      Worker `independencia-comments`, servindo uma página HTML/JS
      auto-contida (login por token salvo em localStorage, lista de
      pendentes, botões Aprovar/Rejeitar). Sem essa página, moderar exigia
      dois comandos `curl` por comentário — pedido do usuário depois de
      testar o fluxo por terminal na prática. `nickname`/`message`
      renderizados via `textContent` (nunca `innerHTML`), pra um comentário
      malicioso não conseguir roubar o token do admin. *(17 ago. 2026)*

- [x] **Comentários próprios via Cloudflare Worker (substituiu o Cusdis)** —
      o Cusdis hospedado renderiza tudo em iframe de outra origem, sem CSS
      customizável no plano gratuito; depois de dois rounds de ajuste fino
      (PRs #78/#79) o desalinhamento visual continuou porque a limitação é
      estrutural. Trocado por comentários renderizados direto no HTML do
      site (`.comment-widget`), consumindo a API do novo Worker
      `independencia-comments` (D1 + fetch handler, mesmo padrão do worker
      de likes). Deploy feito pelo usuário via `wrangler` (D1 criado,
      schema aplicado, secrets `ADMIN_TOKEN`/`IP_SALT` configurados, Worker
      publicado em `independencia-comments.independenciacalculada.workers.dev`
      — bateu exatamente com a URL já configurada no código). Ciclo
      completo testado via curl: comentar → fica pendente → aprovar →
      aparece público → confirmado. *(17 ago. 2026)*

- [x] **Página "Sobre" criada** — `/sobre/`, inspirada em blogs FIRE
      anônimos de referência (AA40, Mad Fientist): mantém anonimato,
      mas revela atuação no mercado financeiro, certificações Anbima, e
      que o autor está em jornada própria (ainda não concluída) rumo à
      independência financeira. Explica o motivo do anonimato (separar
      opinião pessoal de recomendação profissional) em vez de só citar
      privacidade genérica. Seção "o que este espaço não é" reforça que
      não vende curso/consultoria/parceria. Linkada a partir da home e
      adicionada ao `sitemap.xml`. *(13 ago. 2026)*

- [x] **Otimizar imagens/gráficos — investigado, não há gargalo real.**
      Os 3 artigos não usam nenhuma tag `<img>`: os gráficos do conteúdo
      (linha da taxa real líquida, barras do IPCA etc.) são SVGs inline
      gerados a partir dos dados, não imagens — abordagem já correta
      (vetorial, sem requisição HTTP extra, comprime bem). Os únicos
      arquivos raster do repositório são as 3 og-cover PNGs (117–139K,
      1200×630) e o favicon (16K, 512×512); as og-covers só são buscadas
      por crawlers de redes sociais ao gerar prévia de compartilhamento —
      nunca carregam pra quem visita a página — e o favicon já é pequeno.
      Bate com o resultado do PageSpeed (Performance 99–100 nos 3
      artigos): não existe otimização de imagem pendente. *(12 ago. 2026)*

- [x] **Prévia de compartilhamento dos 3 artigos testada e corrigida** —
      testado em 13 ago no WhatsApp Web e no LinkedIn Post Inspector.
      WhatsApp mostrou as imagens certas nos 3 artigos, sem precisar de
      nenhuma correção. LinkedIn mostrou versões antigas nos 3 (o site
      já teve 2-3 revisões de design da mesma imagem, sempre com o
      mesmo nome de arquivo, e o LinkedIn cacheia a prévia pela URL).
      Primeira tentativa de correção (adicionar `?v=2` na URL) resolveu
      o conteúdo, mas PWR e IPCA continuaram aparecendo com uma
      miniatura de baixa qualidade — o LinkedIn parece ignorar a query
      string ao decidir se já tem cache daquela imagem. Corrigido de
      forma definitiva **renomeando os arquivos de verdade**
      (`og-cover-pwr-carteira-fire-v2.png`,
      `og-cover-ipca-hiperinflacao-v2.png` — arquivos antigos removidos
      do repositório, nada mais referenciava eles), o que gera uma URL
      genuinamente nova sem chance de reaproveitar cache. Lição pro
      futuro: ao regenerar uma og-image já publicada, sempre trocar o
      nome do arquivo, nunca só o conteúdo no mesmo nome. Depois da
      renomeação: PWR já veio nítido no LinkedIn; IPCA continuou
      borrado (acompanhamento em item separado abaixo). *(13 ago. 2026)*

- [x] **Analytics sem rastreamento pessoal (Umami)** — trocado do
      Plausible pro Umami Cloud depois de descobrir que o Plausible
      Cloud não é mais gratuito (só 30 dias de trial, depois cobra por
      volume); o plano Hobby do Umami é grátis pra sempre até 100 mil
      eventos/mês, bem acima do que um blog deste porte deve gerar.
      Script oficial do painel
      (`data-website-id="cfa01c19-23cd-468f-8d42-db9a697cf762"`)
      adicionado na home + 3 artigos + template. O domínio associado ao
      site fica só no painel do Umami, não no código — precisa ser
      atualizado lá na migração de domínio (item já adicionado ao
      checklist correspondente). Sem cookies, sem coleta de dado
      pessoal, não precisa de banner de consentimento. *(12 ago. 2026)*

- [x] **Sitemap.xml no Search Console com "não foi possível buscar" —
      investigado, não é um problema real.** Persistiu por mais de um dia
      e sobreviveu a uma remoção + reenvio manual do sitemap, então
      investiguei a fundo em 12 ago: `curl` no arquivo publicado confirma
      200, `content-type: application/xml` correto e XML válido; o
      **Teste em tempo real** da própria Inspeção de URL do Search Console
      (que usa o rastreador real do Google, não uma suposição) confirmou
      "O URL está disponível para o Google", com o conteúdo do sitemap
      renderizado certinho. Conclusão: o status "não foi possível buscar"
      na aba Sitemaps reflete só a última tentativa periódica (que falhou
      por algum motivo pontual do lado do Google), e essa aba atualiza no
      cronograma deles, não em tempo real — não é algo que a gente force
      nem um problema no nosso arquivo. Sem ação pendente; só aguardar o
      próximo rastreamento periódico atualizar o status sozinho. *(12 ago. 2026)*

- [x] **Botão "Sugira um tema" conectado (Web3Forms)** — abre um textarea
      (limite de 500 caracteres, contador ao vivo) que envia direto pro
      e-mail `independenciacalculada@gmail.com`, sem sair da página.
      Diferente do Buttondown, a API do Web3Forms aceita `fetch` com CORS
      liberado, então o site lê a resposta de verdade e mostra sucesso ou
      erro reais (não é otimista como a newsletter). Campo honeypot
      (`botcheck`) contra spam, sem captcha. `access_key` é pública (o
      próprio Web3Forms confirma isso na tela de criação), sem risco de
      exposição no HTML. Aplicado nos 3 artigos + template. Testado
      localmente nos 3 (Chromium headless): toggle abre/fecha, contador de
      caracteres funciona, `maxlength` é respeito de verdade, e o caminho
      de erro de rede foi validado (sandbox sem acesso a api.web3forms.com)
      sem quebrar a página. *(12 ago. 2026)*

- [x] **Newsletter conectada (Buttondown)** — usuário escolheu Buttondown
      (grátis até 100 assinantes, sem venda de dados, analytics desligado
      por padrão). Botão "Assinar a newsletter" nos 3 artigos agora abre
      um formulário no design do site (sem sair do domínio), que envia
      pro endpoint público do Buttondown
      (`buttondown.com/api/emails/embed-subscribe/independenciacalculada`).
      Adicionado também ao `internal/template-artigo.html` e ao checklist,
      como bloco `.cta` obrigatório em todo artigo novo daqui pra frente.
      Testado localmente (Chromium headless): toggle abre/fecha o
      formulário, foco vai pro campo de e-mail, sem erros de JS, action
      aponta pro endpoint correto. Fluxo de envio de e-mail pra cada
      artigo novo continua manual, pelo painel do Buttondown.
      *(12 ago. 2026)*

- [x] **Links de "Continue lendo" quebrados nos 3 artigos** —
      `pwr-carteira-fire` e `quanto-posso-retirar-aposentadoria` tinham
      placeholder do template ao vivo (`/artigo-x.html`, `/artigo-y.html`,
      "Título do artigo relacionado 1/2"); `ipca-hiperinflacao` tinha um
      link já preenchido mas com caminho absoluto quebrado (404 confirmado
      com curl). Os 3 artigos agora se referenciam entre si com caminho
      relativo (`../slug/`), testado e retornando 200. *(12 ago. 2026)*

- [x] **Conectar Claude direto ao GitHub** — via GitHub MCP connector, já
      em uso: commit, push, PR e merge acontecem direto por aqui, sem copiar
      arquivos manualmente. *(12 ago. 2026)*

- [x] **Testar velocidade de carregamento com PageSpeed Insights e corrigir
      gargalos** — testados os 3 artigos publicados. Acessibilidade foi de
      85/93 (desktop/mobile) para **100/100** nos três (corrigido: contraste
      de texto no gráfico de alocação, `title` no iframe de comentários,
      nome acessível nos links do TOC lateral, área de toque dos pontos do
      TOC). Performance: `quanto-posso-retirar-aposentadoria` foi de 83 para
      **100** no desktop depois de eliminar um forced reflow no auto-resize
      do iframe de comentários (Total Blocking Time de 370ms para 0ms); os
      outros dois já estavam em 99-100. Validado direto pela API oficial do
      PageSpeed Insights contra a URL publicada. *(12 ago. 2026)*

- [x] **Botão "voltar ao topo"** — confirmado presente e funcional nos 3
      artigos (`.back-to-top`). *(12 ago. 2026)*

- [x] **Índice clicável (TOC lateral)** — confirmado no código: são links
      `<a href="#sec-XX">` reais com `scroll-behavior: smooth`, já
      funcionavam. *(12 ago. 2026)*

- [x] **Imagens de compartilhamento (og:image) — design aprovado e
      publicado** — depois de 2 tentativas minhas rejeitadas, o usuário
      gerou as 3 imagens em outra IA e já subiu em `assets/`. Falta só o
      teste final de prévia (ver item em aberto). *(11 ago. 2026)*

- [x] **Bug encontrado e corrigido: botões de compartilhar apontavam pro
      domínio final** — WhatsApp/LinkedIn/X estavam compartilhando
      `independenciacalculada.com.br` (que ainda não existe) em vez do
      endereço atual do GitHub Pages. Corrigido nos 3 artigos; o link
      compartilhado agora abre a página real. *(11 ago. 2026)*

- [x] **Google Search Console** — propriedade cadastrada e verificada (tag
      HTML), indexação solicitada manualmente para a home e os 3 artigos.
      Envio automático via sitemap ainda pendente de confirmação (ver item
      em aberto acima). **Atenção:** ao migrar pro domínio próprio, será
      preciso verificar de novo e reenviar o sitemap pro domínio final.
      *(11 ago. 2026)*

- [x] **Sitemap.xml** — criado e publicado na raiz, listando home + 3
      artigos. *(11 ago. 2026)*
- [x] **RSS feed** — `feed.xml` criado e publicado, com tag de descoberta
      (`<link rel="alternate">`) na home e nos 3 artigos. *(11 ago. 2026)*
- [x] **Meta tags de SEO no artigo do IPCA** — confirmado que a versão mais
      recente do conteúdo (enviada pelo usuário) já veio com description,
      Open Graph, Twitter Card e JSON-LD completos. *(11 ago. 2026)*
- [x] **Favicon** — monograma "IC" (verde escuro + creme/dourado, mesma
      paleta do site) criado, publicado na raiz do repositório e testado.
      *(11 ago. 2026)*
- [x] **`wrangler.toml` com placeholders não commitados** — os dois Workers
      (`dinheiro-em-pauta-comments` e `dinheiro-em-pauta-likes`) tinham
      `database_id`/`id` do KV reais só no `wrangler.toml` local (na
      máquina do usuário), nunca commitados — o repositório ainda tinha
      `COLE_AQUI_O_DATABASE_ID`/`COLE_AQUI_O_ID_DO_KV_NAMESPACE`. Um clone
      limpo do repo quebraria o deploy. Corrigido nos PRs #100 e #101 com
      os valores reais já em produção. *(17 ago. 2026)*
