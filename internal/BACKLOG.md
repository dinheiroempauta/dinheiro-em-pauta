# Backlog — Melhorias do blog Independência Calculada

Arquivo de controle das oportunidades de melhoria identificadas. Cada vez que
uma melhoria for implementada, ela deve ser **removida** desta lista (ou movida
para a seção "Concluído", no fim, com a data).

---

## Configuração pendente (já mapeado, falta executar)

- [ ] **Domínio próprio** — migrar do endereço temporário do GitHub Pages para
      um domínio comprado (ex: independenciacalculada.com.br). Melhora
      credibilidade e SEO. Processo já documentado, sem risco de quebrar nada.
      Confirmado em 12 ago: arquivo `CNAME` ainda não existe no repositório;
      `og:image`/`twitter:image` dos 3 artigos ainda apontam pro GitHub Pages
      enquanto o `canonical` já aponta pro domínio final (comportamento
      esperado, documentado no checklist de novo artigo).

## ⚠️ Checklist para quando migrar pro domínio próprio

Vários itens já configurados hoje apontam pro endereço temporário do GitHub
Pages e precisam ser atualizados assim que o domínio próprio estiver ativo:

- [ ] **og:image / twitter:image dos 3 artigos** — trocar de volta pra
      `https://independenciacalculada.com.br/assets/...` (hoje apontam pro
      GitHub Pages).
- [ ] **Cloudflare Worker (likes-worker.js)** — o `ALLOWED_ORIGINS` já inclui
      o domínio final, então não precisa mexer no código; só confirmar que
      segue funcionando depois da troca. Confirmado em 12 ago, direto no
      arquivo: `ALLOWED_ORIGINS` já lista os dois domínios.
- [ ] **Cusdis** — atualizar a URL do site cadastrada no painel (hoje está
      com o endereço do GitHub Pages).
- [ ] **Google Search Console** — verificar a propriedade de novo com o
      domínio final e reenviar o sitemap.xml.
- [ ] **sitemap.xml e feed.xml** — trocar todas as URLs internas do
      GitHub Pages pro domínio final.
- [ ] **CNAME** — criar o arquivo `CNAME` no repositório com o domínio
      (passo já documentado no README.md).
- [ ] **Umami (domínio do site)** — atualizar o domínio cadastrado para
      este site nas configurações do painel do Umami pro domínio final.
      O script no HTML (`data-website-id="cfa01c19-23cd-468f-8d42-db9a697cf762"`)
      não precisa mudar — é o mesmo ID de site pra sempre, só o domínio
      associado a ele no painel que precisa ser atualizado.

---

## SEO e descoberta

- [ ] **LinkedIn ainda mostra o IPCA borrado** — depois de renomear o
      arquivo (`og-cover-ipca-hiperinflacao-v2.png`, PR #21), o PWR já
      veio nítido no LinkedIn Post Inspector, mas o IPCA continuou
      aparecendo com aspecto de baixa qualidade. Conferido em 13 ago:
      os dois arquivos (`-v2.png` do PWR e do IPCA) são tecnicamente
      idênticos (mesma resolução, mesmo modo de cor, sem sinal de
      corrupção) — não há diferença no arquivo que explique isso. Tudo
      indica atraso no processamento de miniatura do próprio LinkedIn,
      não um problema no repositório. Reinspecionar só a URL do IPCA
      depois de alguns minutos; se persistir por vários dias, investigar
      de novo.

- [ ] **Home sem imagem de compartilhamento** — o `index.html` nunca teve
      tag `og:image`/`twitter:image`, e não existe nenhum arquivo de capa
      pra home em `assets/` (só as 3 dos artigos). Testado em 13 ago no
      WhatsApp e no LinkedIn Post Inspector: nenhuma imagem aparece ao
      compartilhar o link da home, só título/descrição. Decisão do
      usuário em 13 ago: **adiado por enquanto**, sem gerar imagem nova
      no momento.

## Design / UX

- [ ] **Página "Sobre"** — quem escreve, credenciais, por que confiar no
      conteúdo. Ajuda bastante com credibilidade em blog de finanças.
      Confirmado em 12 ago: não existe página dedicada, só um parágrafo
      curto na home (seção "Sobre este espaço").

## Distribuição

- [ ] **Compartilhamento automático** no LinkedIn/X ao publicar um artigo novo
      (hoje é manual). Confirmado em 12 ago: não existe `.github/workflows/`
      no repositório.

---

## Concluído

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
