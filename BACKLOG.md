# Backlog — Melhorias do blog Independência Calculada

Arquivo de controle das oportunidades de melhoria identificadas. Cada vez que
uma melhoria for implementada, ela deve ser **removida** desta lista (ou movida
para a seção "Concluído", no fim, com a data).

---

## Configuração pendente (já mapeado, falta executar)

- [ ] **Domínio próprio** — migrar do endereço temporário do GitHub Pages para
      um domínio comprado (ex: independenciacalculada.com.br). Melhora
      credibilidade e SEO. Processo já documentado, sem risco de quebrar nada.
- [ ] **Favicon** — criar/subir um arquivo `favicon.png` (512×512) na raiz do
      repositório. Os arquivos já referenciam esse caminho, só falta o arquivo.
- [ ] **Conectar Claude direto ao GitHub** — via MCP connector, quando assinar
      um plano pago do Claude. Elimina o passo de copiar arquivos manualmente.

## SEO e descoberta

- [ ] **Google Search Console** — cadastrar o site (gratuito) para pedir
      indexação e monitorar como os artigos aparecem nas buscas.
- [ ] **Sitemap.xml** — gerar um arquivo listando todos os artigos, para o
      Google encontrar e indexar mais rápido.
- [ ] **Meta tags de SEO no artigo do IPCA** — description, Open Graph e
      JSON-LD ainda estão incompletas nesse artigo (os outros 2 já têm).
- [ ] **RSS feed** — para quem acompanha blogs por leitor de feeds.

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

*(nada ainda — mova itens pra cá conforme forem implementados, com a data)*
