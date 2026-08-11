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

## SEO e descoberta

- [ ] **Google Search Console** — em andamento: propriedade sendo cadastrada
      (endereço temporário do GitHub Pages). Falta enviar a tag de verificação
      e confirmar o envio do sitemap.xml. **Atenção:** ao migrar pro domínio
      próprio, será preciso verificar de novo e reenviar o sitemap.
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
