# Checklist — nascimento de um artigo novo

Este é o contrato do padrão do blog, extraído diretamente dos 3 artigos
publicados (`pwr-carteira-fire`, `ipca-hiperinflacao`,
`quanto-posso-retirar-aposentadoria`). Todo artigo novo precisa passar por
essa lista antes de ser considerado publicado. Se um item não se aplica ao
conteúdo específico (ex: FAQ, glossário), justifique a omissão em vez de
pular silenciosamente.

Ponto de partida recomendado: copiar `internal/template-artigo.html` para
`<slug-do-artigo>/index.html` e preencher os placeholders `{{...}}`, em vez
de escrever o HTML do zero.

---

## 1. Antes de gerar o HTML

- [ ] Definir o **slug** da URL (pasta), curto, kebab-case, sem acento
      (ex: `pwr-carteira-fire`)
- [ ] Definir `article:section` (categoria mais ampla) — reaproveitar uma
      categoria existente quando fizer sentido (`Renda Fixa`,
      `Aposentadoria`) para manter a taxonomia coerente. O eyebrow combina
      categoria + tema específico (ex: `Aposentadoria · SWR/PWR`,
      `Renda Fixa · Tesouro Direto`) — tema específico é só o nome do
      assunto, sem prefixo tipo "Série"
- [ ] Confirmar a data de publicação

## 2. `<head>` — sempre completo, nunca parcial

- [ ] `<title>` no padrão `Título do artigo — Independência Calculada`
- [ ] `<meta name="description">`
- [ ] `<link rel="canonical" href="https://independenciacalculada.com.br/<slug>">`
      (domínio final, mesmo enquanto o site roda no GitHub Pages — ver
      item do BACKLOG sobre migração de domínio)
- [ ] `<link rel="alternate" type="application/rss+xml" ... href="../feed.xml">`
- [ ] Bloco OG completo: `og:type=article`, `og:site_name`, `og:locale`,
      `og:url`, `og:title`, `og:description`, `og:image` (+ `width`/`height`/`alt`),
      `article:published_time`, `article:section`
- [ ] Bloco Twitter Card: `twitter:card=summary_large_image`, `twitter:title`,
      `twitter:description`, `twitter:image`
- [ ] `theme-color` e `<link rel="icon" href="../favicon.png">`
- [ ] Script do Umami logo após o favicon (`<script defer
      src="https://cloud.umami.is/script.js"
      data-website-id="cfa01c19-23cd-468f-8d42-db9a697cf762"></script>`
      — copiar inalterado do template; é o mesmo `data-website-id` pra
      todo artigo, o domínio rastreado fica configurado no painel do
      Umami, não no HTML)
- [ ] JSON-LD **Article** (headline, description, image, datePublished,
      dateModified, articleSection, keywords, about, author/publisher,
      mainEntityOfPage, isPartOf)
- [ ] JSON-LD **BreadcrumbList** (Home → categoria → artigo)
- [ ] JSON-LD **FAQPage** — se o conteúdo tiver perguntas respondíveis de
      forma autocontida (a maioria dos artigos técnicos tem 2-4 boas
      candidatas); se não fizer sentido para este artigo, ok pular
- [ ] Fontes: preconnect + preload + stylesheet + `<noscript>` do Google
      Fonts (Fraunces, IBM Plex Sans, IBM Plex Mono) — sempre os 3
- [ ] Design tokens `:root{}` idênticos aos outros artigos (não redefinir
      cores/fontes por artigo)

## 3. Estrutura do `<body>`

- [ ] `.progress-rail` (barra de progresso de leitura no topo)
- [ ] `.toc-rail` (navegação lateral por seção) — só se o artigo tiver
      seções longas o bastante para justificar; IDs das seções em
      `#sec-01`, `#sec-02`, etc., sincronizados com os links. Cada `<a>`
      precisa de `aria-label` igual ao texto do `.toc-label` (o span some
      da árvore de acessibilidade porque fica `visibility:hidden` até o
      hover) — sem isso, o PageSpeed acusa "links sem nome compreensível"
- [ ] `.back-to-top` (botão flutuante)
- [ ] `.masthead` (wordmark + link `← Todos os artigos` apontando pra
      `../` + link "Sobre" apontando pra `../sobre/` + tagline), idêntico
      ao de outros artigos. Não existe mais `.site-bar` (a barra preta foi
      removida do design — tudo mora dentro do masthead agora)
- [ ] `.eyebrow` (categoria acima do H1, com o tracinho `::before`)
- [ ] `h1.title` + `.subtitle` (subtítulo editorial, não repetir o H1)
- [ ] `.meta` — publicado em / tempo de leitura / nível / "inclui
      calculadora ou simulador interativo" (o que se aplicar). Tempo de
      leitura: contar palavras do conteúdo real do artigo (`.prose`, `h2`,
      tabelas, notas, formula-box etc. — **excluindo** disclaimer,
      referências, engajamento e comentários) e dividir por 200
      palavras/minuto; não estimar de cabeça
- [ ] `.promise` — bloco "Neste artigo, você vai entender" com 3-5 bullets
- [ ] Corpo do artigo (`.prose`, `h2`/`h3` com `.num`, e os componentes
      reutilizáveis do design system conforme o conteúdo pedir: `.note`,
      `.stat-card`, `.chart-card`, `.formula-box`, `.glossary`,
      `.steps-list`, `table.data`/`table.summary`, `blockquote.pull`,
      `.mitigation-grid`, `.recap`)
- [ ] `.cta` — **obrigatório em todo artigo** (não é mais opcional):
      - Botão "Assinar a newsletter" (form do Buttondown, `action` apontando
        pra `https://buttondown.com/api/emails/embed-subscribe/independencia_calculada`
        — reparar no `_`, é o username real —, envia pra um `<iframe>`
        invisível via `target="newsletterHiddenFrame"`, toggle via
        `#newsletterToggle`/`#newsletterForm` — copiar inalterado do template)
      - Botão "Sugira um tema" (form do Web3Forms, `access_key` fixa no
        template, `subject` com o título **deste** artigo, textarea com
        `maxlength="500"` e contador ao vivo, toggle via
        `#suggestToggle`/`#suggestForm`, envio via `fetch` — copiar
        inalterado do template, só trocar o `subject`)
      - `.cta-related` com links para os **outros artigos já publicados**,
        caminho relativo (`../slug/`), nunca placeholder tipo `/artigo-x.html`
- [ ] `.disclaimer` — texto de isenção de responsabilidade **idêntico**
      ao dos outros artigos (não parafrasear)
- [ ] `.engage` — botão "Achei útil" (curtir) + grupo de compartilhar
      (WhatsApp, LinkedIn, X, copiar link) com URLs e texto do slug atual
- [ ] `.comments-section` com Cusdis: `data-app-id` (mesmo de todo o
      blog), `data-page-id="<slug>"`, `data-page-url` e `data-page-title`
      corretos para este artigo + o script de estilização do iframe
      (copiar inalterado, já inclui `node.setAttribute('title', ...)`
      no `styleFrame` — sem isso o PageSpeed acusa "iframe sem título")
- [ ] Qualquer cor de texto customizada sobre fundo colorido (ex: gráficos
      inline com `style="background:#..."`) precisa de contraste ≥ 4.5:1
      — conferir com a calculadora de contraste do PageSpeed/DevTools
      antes de usar texto branco sobre tons claros/médios da paleta
- [ ] `<footer>` padrão

## 4. Scripts no fim do arquivo

- [ ] Script de progress bar / back-to-top / TOC ativo / reveal-on-scroll
      (copiar inalterado — é genérico)
- [ ] Script de curtidas: `var API = 'https://independencia-likes.independenciacalculada.workers.dev';`
      e `var slug = '<slug-do-artigo>';` corretos
- [ ] Qualquer calculadora/simulador interativo específico do artigo

## 5. Fora do `index.html` do artigo

- [ ] Gerar a **og:image** (1200×630) seguindo
      `internal/prompt-og-image-independencia-calculada.md` à risca —
      nome do arquivo tem que bater exatamente com o `og:image` do HTML
- [ ] Adicionar o **card** do artigo na home (`index.html`), dentro de
      `.article-grid`, na ordem cronológica correta (mais recente primeiro).
      A home é só a grade de cards — sem hero, sem rótulo de seção, sem
      bloco de "sobre este espaço" (isso vive só em `/sobre/`). **O card é
      texto duplicado, não lê o artigo** — título, categoria, resumo, data
      e tempo de leitura têm que ser copiados manualmente e batendo 100%
      com o artigo (ver invariante no `CLAUDE.md`). Toda vez que um desses
      campos for editado no artigo depois de publicado, o card tem que ser
      atualizado junto, no mesmo commit.
- [ ] Adicionar entrada em **`sitemap.xml`** (`<loc>`, `<lastmod>`,
      `changefreq`, `priority`)
- [ ] Adicionar `<item>` em **`feed.xml`** (title, link, guid, description,
      pubDate)
- [ ] Conferir que o link "→ artigos relacionados" (`.cta-related`) de
      outros artigos, se fizer sentido, também aponte para o novo artigo

## 6. Verificação final antes de considerar publicado

- [ ] Abrir o HTML localmente e checar: fontes carregando (sem fallback
      pro sistema), curtir funcionando, compartilhar com URL/slug certos,
      comentários carregando o thread certo (`data-page-id`), TOC
      sincronizado com as seções reais
- [ ] Rodar contra `internal/prompt-og-image-independencia-calculada.md`
      → seção 7 (checklist específico da imagem OG)
- [ ] Se o domínio próprio ainda não estiver ativo, confirmar que os itens
      gerados aqui entram também no checklist de migração do
      `internal/BACKLOG.md` (não criam um segundo lugar de verdade)
