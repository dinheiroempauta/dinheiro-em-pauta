# Backlog — Melhorias do blog Independência Calculada

Arquivo de controle das oportunidades de melhoria identificadas. Cada vez que
uma melhoria for implementada, ela deve ser **removida** desta lista (ou movida
para a seção "Concluído", no fim, com a data).

---

## Configuração pendente (já mapeado, falta executar)

- [ ] **Domínio próprio** — migrar do endereço temporário do GitHub Pages para
      um domínio comprado (ex: independenciacalculada.com.br). Melhora
      credibilidade e SEO. Processo já documentado, sem risco de quebrar nada.
- [ ] **Conectar Claude direto ao GitHub** — via MCP connector, quando assinar
      um plano pago do Claude. Elimina o passo de copiar arquivos manualmente.

## ⚠️ Checklist para quando migrar pro domínio próprio

Vários itens já configurados hoje apontam pro endereço temporário do GitHub
Pages e precisam ser atualizados assim que o domínio próprio estiver ativo:

- [ ] **og:image / twitter:image dos 3 artigos** — trocar de volta pra
      `https://independenciacalculada.com.br/assets/...` (hoje apontam pro
      GitHub Pages).
- [ ] **Cloudflare Worker (likes-worker.js)** — o `ALLOWED_ORIGINS` já inclui
      o domínio final, então não precisa mexer no código; só confirmar que
      segue funcionando depois da troca.
- [ ] **Cusdis** — atualizar a URL do site cadastrada no painel (hoje está
      com o endereço do GitHub Pages).
- [ ] **Google Search Console** — verificar a propriedade de novo com o
      domínio final e reenviar o sitemap.xml.
- [ ] **sitemap.xml e feed.xml** — trocar todas as URLs internas do
      GitHub Pages pro domínio final.
- [ ] **CNAME** — criar o arquivo `CNAME` no repositório com o domínio
      (passo já documentado no README.md).

---

## SEO e descoberta

- [ ] **Sitemap.xml no Search Console ainda com "não foi possível buscar"**
      — Google confirmou "dados em processamento, volte em ~1 dia". Conferir
      de novo amanhã; se persistir depois disso, investigar.
- [ ] **Imagem de compartilhamento (og:image) — design ainda não aprovado**
      — 2 versões geradas e rejeitadas pelo usuário (v1: fundo verde escuro
      com gráfico decorativo; v2: fundo claro estilo página do blog, sem
      gráfico, favicon no canto). Ambas descartadas. Precisa de uma nova
      direção de design antes de gerar de novo. As tags `og:image` já
      apontam pro caminho certo (`assets/og-cover-*.png`, endereço atual do
      GitHub Pages) — só falta a imagem em si.
- [ ] **Imagens de compartilhamento (og:image) não existem** — os 3 artigos
      apontam pra `assets/og-cover-*.png`, mas esse arquivo não existe no
      repositório. Hoje, ao compartilhar um link no WhatsApp/LinkedIn/X, não
      aparece nenhuma imagem de prévia. Precisa criar as 3 imagens (1200×630)
      e subir na pasta `assets/`.

## Analytics

- [ ] **Ferramenta de analytics sem rastreamento pessoal** — Plausible ou
      Umami (gratuitos até certo volume), para saber quantas pessoas visitam,
      de onde vêm e quais artigos performam melhor, sem comprometer a
      privacidade dos leitores.

## Performance

- [ ] **Otimizar imagens/gráficos** dos artigos para carregamento mais rápido
      (se aplicável).
- [ ] **Testar velocidade de carregamento** com o PageSpeed Insights
      (gratuito) e ajustar o que aparecer como gargalo.

## Design / UX

- [ ] **Página "Sobre"** — quem escreve, credenciais, por que confiar no
      conteúdo. Ajuda bastante com credibilidade em blog de finanças.
- [ ] **Newsletter** — avisar leitores quando sai artigo novo (ex: Buttondown
      ou Substack, gratuitos até certo volume).
- [ ] **Botão "voltar ao topo"** em artigos longos.
- [ ] **Índice clicável (TOC lateral)** — confirmar se os pontinhos de
      navegação lateral dos artigos já são clicáveis/scrollam até a seção;
      se não forem, implementar.

## Distribuição

- [ ] **Compartilhamento automático** no LinkedIn/X ao publicar um artigo novo
      (hoje é manual).

---

## Concluído

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
