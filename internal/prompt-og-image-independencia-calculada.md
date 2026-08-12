# Prompt: gerar imagem de preview (OG image) para artigo do Independência Calculada

Cole o prompt abaixo, anexando o `index.html` do artigo em questão.

---

## PROMPT

Você vai criar a imagem de preview de compartilhamento (Open Graph / Twitter Card, 1200×630px) para um artigo do blog **Independência Calculada**. Preciso que o resultado seja **clean, coerente com o design system do blog, e desperte curiosidade sem parecer marketeiro** — nada de ícones genéricos, emojis, gradientes chamativos, "clique aqui", ou qualquer elemento que pareça banner de anúncio.

### 1. Extraia os metadados do artigo anexado

Do `index.html` fornecido, extraia:
- `<title>` e o `og:title`
- `og:description` (versão curta, para o subtítulo da imagem)
- `article:section` (categoria, ex: "Renda Fixa", "Aposentadoria", "Série SWR/PWR")
- O texto do `.eyebrow` (kicker acima do H1)
- O `.subtitle` do H1
- O tempo de leitura (`~XX min`) e outros metadados relevantes do `.meta` (nível, "inclui calculadora/simulador interativo", etc.)
- O nome de arquivo esperado, a partir de `og:image` (ex: `og-cover-nome-do-artigo.png`) — a imagem final **precisa ter exatamente esse nome**.

**Regra crítica sobre o texto do H1 da imagem: NUNCA copie o `<title>`/`og:title` literalmente.**

Quando um link é compartilhado, a maioria das plataformas (WhatsApp, LinkedIn, X, etc.) mostra a imagem de capa **e**, logo abaixo dela, o `<title>` da página como texto. Se o H1 dentro da imagem for idêntico ao `<title>`, o preview do link fica com a mesma frase repetida duas vezes (uma vez dentro do PNG, outra vez como texto do card) — visualmente redundante e de aparência amadora.

Por isso, o H1 dentro da imagem deve ser **uma reformulação temática do artigo, não a pergunta/título literal da página**. Pense nele como um "rótulo do assunto" — o que o artigo é, tecnicamente — em vez do gancho editorial usado no `<title>`. Exemplos já aplicados nesta série:

| `<title>` / `og:title` da página (mantido como está no HTML) | H1 dentro da imagem (reformulado) |
|---|---|
| "Quanto posso retirar dos meus investimentos durante a aposentadoria?" | "Taxa Segura de Retirada e Taxa Perpétua de Retirada" |
| "A confusão generalizada sobre os Títulos IPCA+" | "Rentabilidade negativa no IPCA+ em cenários de hiperinflação" |
| "Qual é a PWR da minha carteira? Um estudo com 20 anos de dados reais" | "A Taxa Perpétua de Retirada (PWR) de uma carteira de aposentadoria" |

Ao reformular, prefira nomear os **conceitos/termos técnicos centrais** do artigo (SWR, PWR, IPCA+, hiperinflação, taxa de retirada) em vez de reescrever a pergunta do título com outras palavras — isso evita duplicidade de sentido além de duplicidade literal. O `<title>`, `og:title`, `.eyebrow` e `.subtitle` do HTML do artigo **nunca são alterados** — essa reformulação vale só para o texto renderizado dentro do PNG.

### 2. Extraia os design tokens do próprio HTML

Não invente cores ou fontes — leia do `:root{}` do CSS do artigo:
- Paleta: `--paper`, `--ink`, `--muted`, `--green`, `--green-deep`, `--green-light`, `--brick`, `--gold`, `--line` etc.
- Fontes: `--font-display` (Fraunces), `--font-body` (IBM Plex Sans), `--font-mono` (IBM Plex Mono)
- Estilo do `.eyebrow` (mono, uppercase, letter-spacing ~.1em, cor verde, traço de 22-26px antes do texto)
- Estilo do `.wordmark` (mono, "Independência" em bold + cor de destaque no primeiro nome, "Calculada" em peso normal)

### 3. Monte um HTML autocontido de 1200×630 (renderizado a 2x = 2400×1260)

Estrutura obrigatória, replicando a identidade visual do blog:

- **Fundo**: `var(--ink)` (nunca `--paper` — a capa é sempre no modo escuro/ink para destacar no feed social), com uma textura de grid vertical bem sutil (`rgba(255,255,255,0.035)`, linhas a cada 60px) — não mais que isso, é textura, não decoração.
- **Topo**: wordmark do blog à esquerda (ponto verde + "Independência" bold + "Calculada" regular, mono, ~15px) e uma tag da categoria (`article:section`) à direita, mono uppercase, borda fina, canto levemente arredondado.
- **Meio**:
  - Eyebrow: mesmo texto do `.eyebrow` do artigo, mono uppercase, verde claro, com o tracinho antes do texto.
  - H1: Fraunces peso 600, ~50-52px, line-height ~1.12, cor quase-branca (`#F6F7F3`), max-width ~900px. Deixe quebrar naturalmente em 2-3 linhas — não force quebra manual.
  - Subtítulo: IBM Plex Sans regular, ~19px, cor `#A9B2A4` (verde acinzentado), max-width ~700-750px. Uma frase só, reescrita a partir do `og:description`/`.subtitle` do artigo — não copie a descrição inteira se for longa, resuma no espírito do artigo.
- **Rodapé**: dividido em duas colunas.
  - Esquerda: metadados-chave em mono, separados por `·`, no padrão `<b>termo técnico</b> · outro dado · ~XX min`. Use os números/termos centrais do artigo (ex: taxas, SWR vs PWR, "simulador interativo").
  - Direita: **o motivo gráfico** (ver seção 4).

### 4. O motivo gráfico é a peça central — não pule esta etapa

Em vez de qualquer ícone, ilustração ou foto, toda capa usa **um pequeno gráfico SVG de linha** (≈340×122px) que representa **visualmente o argumento central do artigo específico** — não um gráfico genérico de "crescimento".

Antes de desenhar, pergunte-se: *qual é a comparação, tensão ou virada de dados que este artigo defende?* Exemplos já usados nesta série (não repita a mesma composição duas vezes — cada artigo precisa de um motivo com lógica própria):

- Artigo sobre SWR vs. PWR → duas curvas divergindo (retirada fixa em % que corrói vs. retirada ajustada que se sustenta), com um ponto de bifurcação marcado.
- Artigo desmontando uma fórmula errada → uma curva "errada" caindo dramaticamente (tracejada, terracota) vs. uma curva "certa" estável (sólida, verde), com uma faixa sombreada estreita destacando a "zona real de risco" que a narrativa exagera.
- Artigo de estudo quantitativo/bootstrap → um leque de trajetórias simuladas finas (cinza, baixa opacidade) convergindo de um ponto de origem, com duas linhas destacadas marcando thresholds de confiança específicos (ex: 90% vs. 95%), cada uma com um ponto (dot) na ponta.

Regras de estilo do motivo gráfico:
- Sempre 2 cores de dado: verde (`--green-light` ~`#6FA382`, sólido, ~2.75px) para a leitura "correta/resiliente/real", e terracota (`~#9C5A48`, tracejado `4 4`, ~2.25px) para a leitura "ingênua/alarmista/ruim". Isso é a assinatura visual da série — mantenha em todo artigo novo.
- Linhas de simulação/contexto adicionais (se houver): cinza-esverdeado (`#4E5A50`), finas (1.25px), opacidade baixa (0.4-0.55) — nunca competem com as duas linhas principais.
- Pontos (`circle`) de ~4px de raio nos valores-chave, na mesma cor da linha.
- Nunca inclua eixos, números ou legendas dentro do SVG — os números ficam no texto mono do rodapé, ao lado.
- O gráfico deve fazer sentido para quem já leu o artigo (recompensa) e ser abstrato o suficiente para não parecer um dashboard genérico para quem só vê no feed.

### 5. Fontes reais (obrigatório — nunca deixar cair para fonte do sistema)

O ambiente provavelmente não tem Fraunces/IBM Plex instaladas localmente. Baixe os pacotes oficiais do npm e extraia os `.woff2` necessários:

```bash
mkdir -p /home/claude/og/fonts && cd /home/claude/og
npm pack @fontsource/fraunces @fontsource/ibm-plex-sans @fontsource/ibm-plex-mono
mkdir -p pkgs && for f in *.tgz; do tar -xzf "$f" -C pkgs; mv pkgs/package "pkgs/$(basename $f .tgz)"; done

cp pkgs/fontsource-fraunces-5.3.0/files/fraunces-latin-{500,600,700,900}-normal.woff2 fonts/
cp pkgs/fontsource-ibm-plex-sans-5.3.0/files/ibm-plex-sans-latin-{400,500,600}-normal.woff2 fonts/
cp pkgs/fontsource-ibm-plex-mono-5.3.0/files/ibm-plex-mono-latin-{400,500,600}-normal.woff2 fonts/
```

Declare via `@font-face` no `<style>` do HTML da capa, apontando para esses arquivos locais (não usar Google Fonts CDN — o ambiente de screenshot é offline/sandboxed).

**Cuidado com CSS flexbox + `gap` em torno de nós de texto misturados com `<b>`**: isso já causou espaçamento indevido no wordmark. Sempre envolva o texto do wordmark em um único `<span>` (`<span><b>Independência</b> Calculada</span>`) para evitar que o `gap` do flex container se aplique entre nós de texto anônimos.

### 6. Renderize via Chromium headless (Puppeteer), nunca ImageMagick/rsvg direto

ImageMagick não renderiza bem `@font-face`/texto customizado em HTML. Use o Chrome já disponível no ambiente:

```javascript
// shot.js
const puppeteer = require('/home/claude/.npm-global/lib/node_modules/@mermaid-js/mermaid-cli/node_modules/puppeteer-core');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: '/home/claude/.cache/puppeteer/chrome/linux-131.0.6778.204/chrome-linux64/chrome',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--force-color-profile=srgb', '--font-render-hinting=none']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 2 }); // renderiza a 2x
  await page.goto('file://' + path.resolve(process.argv[2]), { waitUntil: 'networkidle0' });
  await page.evaluateHandle('document.fonts.ready');
  await new Promise(r => setTimeout(r, 200));
  await page.screenshot({ path: process.argv[3], clip: { x:0, y:0, width:1200, height:630 } });
  await browser.close();
})();
```

Rode: `node shot.js artigo.html og-cover-bruto.png` (sai em 2400×1260) e então reduza com filtro Lanczos para o tamanho final:

```bash
convert og-cover-bruto.png -filter Lanczos -resize 1200x630 -quality 95 og-cover-nome-do-artigo.png
```

Confirme as dimensões finais com `identify` (precisa ser exatamente **1200x630**) antes de entregar.

### 7. Verificação final antes de entregar

- [ ] Nome do arquivo bate exatamente com o valor de `og:image` do artigo
- [ ] Dimensões exatas: 1200×630
- [ ] Nenhum ícone/emoji/foto de banco de imagem — só tipografia + o motivo gráfico SVG
- [ ] O motivo gráfico é específico ao argumento do artigo, não reciclado de outro artigo sem adaptação
- [ ] Eyebrow, categoria e subtítulo batem com o conteúdo real do HTML anexado (não inventados)
- [ ] O H1 dentro da imagem **não é uma cópia literal do `<title>`/`og:title`** — é uma reformulação temática/técnica do assunto (ver regra na seção 1)
- [ ] Fontes corretas (Fraunces no título, IBM Plex Mono nos labels/wordmark, IBM Plex Sans no subtítulo) — sem fallback visível para Arial/DejaVu
- [ ] Salvar em `/mnt/user-data/outputs/` e usar `present_files` para entregar

---

*Este prompt foi extraído do processo real usado para gerar as capas dos três primeiros artigos do blog (SWR/PWR, IPCA+, PWR carteira FIRE) e deve ser reaplicado integralmente a cada novo artigo, adaptando apenas o conteúdo textual e o motivo gráfico — nunca a estrutura, paleta ou tipografia.*
