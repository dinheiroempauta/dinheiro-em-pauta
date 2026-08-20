# Prompt: gerar imagem de preview (OG image) para artigo do Dinheiro em Pauta

Substitui `internal/prompt-og-image-independencia-calculada.md` (mantido
no histórico do git só como referência do processo original) — mesma
estrutura, adaptado pro rebrand pra "Dinheiro em Pauta" (Fase 5).

Cole o prompt abaixo, anexando o `index.html` do artigo em questão.

---

## PROMPT

Você vai criar a imagem de preview de compartilhamento (Open Graph / Twitter Card, 1200×630px) para um artigo do blog **Dinheiro em Pauta**. Preciso que o resultado seja **clean, coerente com o design system do blog, e desperte curiosidade sem parecer marketeiro** — nada de ícones genéricos, emojis, gradientes chamativos, "clique aqui", ou qualquer elemento que pareça banner de anúncio.

### 0. Contexto: isto é uma regeneração, não uma criação nova

Estas imagens já existem e já foram publicadas com o layout/composição
corretos — a única coisa errada nelas é o **wordmark do topo esquerdo**,
que ainda mostra "Independência Calculada" (marca antiga). O H1, eyebrow,
subtítulo, categoria, motivo gráfico e metadados do rodapé **não
precisam ser reinventados** — mantenha a mesma reformulação temática e a
mesma composição já usada na imagem publicada (ver arquivo atual em
`assets/`), só trocando o wordmark e regerando o arquivo em alta
qualidade com a marca nova. Se algum dado do artigo mudou desde a versão
publicada da imagem, atualize também — mas o objetivo aqui é o rebrand,
não redesenhar do zero.

### 1. Extraia os metadados do artigo anexado

Do `index.html` fornecido, extraia:
- `<title>` e o `og:title`
- `og:description` (versão curta, para o subtítulo da imagem)
- `article:section` (categoria, ex: "Renda Fixa", "Aposentadoria")
- O texto do `.eyebrow` (kicker acima do H1)
- O `.subtitle` do H1
- O tempo de leitura (`~XX min`) e outros metadados relevantes do `.meta` (nível, "inclui calculadora/simulador interativo", etc.)
- O nome de arquivo esperado, a partir de `og:image` (ex: `og-cover-nome-do-artigo.png`) — a imagem final **precisa ter exatamente esse nome**.
  **Regra de versionamento: nunca reuse o nome de arquivo já publicado.**
  LinkedIn e outros crawlers cacheiam a prévia pela URL da imagem e não
  recarregam mesmo com o conteúdo trocado (confirmado na prática, ver
  `internal/BACKLOG.md`). Use sufixo de versão incrementado a partir do
  nome atual:
  - `og-cover-quanto-posso-retirar.png` → `og-cover-quanto-posso-retirar-v2.png`
  - `og-cover-montar-carteira-estudo-de-caso.png` → `og-cover-montar-carteira-estudo-de-caso-v2.png`
  - `og-cover-pwr-carteira-fire-v2.png` → `og-cover-pwr-carteira-fire-v3.png`
  - `og-cover-ipca-hiperinflacao-v2.png` → `og-cover-ipca-hiperinflacao-v3.png`

  Depois de gerar, atualizar `og:image`/`twitter:image`/JSON-LD no HTML do
  artigo correspondente pro nome novo, **e atualizar o card espelho na
  home (`index.html`) se ele também referenciar a imagem**, e remover o
  arquivo antigo do repositório.

**Regra crítica sobre o texto do H1 da imagem: NUNCA copie o `<title>`/`og:title` literalmente.** (Já resolvido nas 4 imagens publicadas — mantenha a mesma reformulação usada em cada uma, listada abaixo pra referência rápida, a menos que o conteúdo do artigo tenha mudado:)

| Artigo (slug) | H1 dentro da imagem (já aprovado, manter) |
|---|---|
| `quanto-posso-retirar-aposentadoria` | "Taxa Segura de Retirada e Taxa Perpétua de Retirada" |
| `ipca-hiperinflacao` | "Rentabilidade negativa no IPCA+ em cenários de hiperinflação" |
| `pwr-carteira-fire` | "A Taxa Perpétua de Retirada (PWR) de uma carteira de aposentadoria" |
| `montar-carteira-estudo-de-caso` | "As 13 perguntas que definem uma carteira de investimentos" |

Se estiver gerando a imagem de um artigo novo (sem versão publicada
anterior), a regra geral continua valendo: prefira nomear os **conceitos/
termos técnicos centrais** do artigo em vez de reescrever a pergunta do
título com outras palavras. O `<title>`, `og:title`, `.eyebrow` e
`.subtitle` do HTML do artigo **nunca são alterados** — a reformulação
vale só para o texto renderizado dentro do PNG.

### 2. Extraia os design tokens do próprio HTML

Não invente cores ou fontes — leia do `:root{}` do CSS do artigo:
- Paleta: `--paper`, `--ink`, `--muted`, `--green`, `--green-deep`, `--green-light`, `--brick`, `--gold`, `--line` etc.
- Fontes: `--font-display` (Fraunces), `--font-body` (IBM Plex Sans), `--font-mono` (IBM Plex Mono)
- Estilo do `.eyebrow` (mono, uppercase, letter-spacing ~.1em, cor verde, traço de 22-26px antes do texto)
- Estilo do `.wordmark` (mono, ver seção 3 abaixo pro texto/composição atualizados)

### 3. Wordmark — a única peça que muda de fato nesta rodada

O wordmark do blog no HTML (masthead do site, `.wordmark`) hoje é:
`<span>Dinheiro em</span> Pauta` — ou seja, "Dinheiro em" no tom de
destaque (cor verde, `--green`/`--green-light` conforme o tema) e "Pauta"
em peso normal/cor de texto padrão. **Isso é diferente da divisão
IC anterior** ("Independência" bold+verde / "Calculada" normal) — não
apenas troque as palavras mantendo a mesma divisão de peso, replique a
divisão nova: "Dinheiro em" ganha o destaque, "Pauta" fica no peso normal.

No topo esquerdo da imagem: ponto verde (•) + "Dinheiro em" (mono, bold,
cor `--green-light`) + " Pauta" (mono, peso normal, cor quase-branca), ~15px, mesmo padrão de espaçamento/tamanho já usado nas imagens atuais — só o texto/divisão de peso muda.

### 4. Monte um HTML autocontido de 1200×630 (renderizado a 2x = 2400×1260)

Estrutura obrigatória, replicando a identidade visual do blog:

- **Fundo**: `var(--ink)` (nunca `--paper` — a capa é sempre no modo escuro/ink para destacar no feed social), com uma textura de grid vertical bem sutil (`rgba(255,255,255,0.035)`, linhas a cada 60px) — não mais que isso, é textura, não decoração.
- **Topo**: wordmark à esquerda (ver seção 3) e uma tag da categoria (`article:section`) à direita, mono uppercase, borda fina, canto levemente arredondado.
- **Meio**:
  - Eyebrow: mesmo texto do `.eyebrow` do artigo, mono uppercase, verde claro, com o tracinho antes do texto.
  - H1: Fraunces peso 600, ~50-52px, line-height ~1.12, cor quase-branca (`#F6F7F3`), max-width ~900px. Deixe quebrar naturalmente em 2-3 linhas — não force quebra manual.
  - Subtítulo: IBM Plex Sans regular, ~19px, cor `#A9B2A4` (verde acinzentado), max-width ~700-750px. Uma frase só, no espírito do `og:description`/`.subtitle` do artigo.
- **Rodapé**: dividido em duas colunas.
  - Esquerda: metadados-chave em mono, separados por `·`, no padrão `<b>termo técnico</b> · outro dado · ~XX min`.
  - Direita: **o motivo gráfico** (ver seção 5) — mantenha o mesmo motivo já usado em cada imagem publicada (SWR vs. PWR divergindo, fórmula errada vs. certa, leque de trajetórias, etc.), a menos que o conteúdo do artigo tenha mudado desde a publicação.

### 5. O motivo gráfico é a peça central — mantenha o já aprovado, não reinvente

Cada imagem já publicada tem um pequeno gráfico SVG de linha (≈340×122px) desenhado especificamente pro argumento daquele artigo. Regras de estilo (inalteradas):
- Sempre 2 cores de dado: verde (`--green-light` ~`#6FA382`, sólido, ~2.75px) para a leitura "correta/resiliente/real", e terracota (`~#9C5A48`, tracejado `4 4`, ~2.25px) para a leitura "ingênua/alarmista/ruim".
- Linhas de contexto adicionais (se houver): cinza-esverdeado (`#4E5A50`), finas (1.25px), opacidade baixa (0.4-0.55).
- Pontos (`circle`) de ~4px de raio nos valores-chave, na mesma cor da linha.
- Nunca inclua eixos, números ou legendas dentro do SVG.

Só desenhe um motivo gráfico novo do zero se estiver gerando a og-image de um artigo que ainda não tem imagem publicada.

### 6. Fontes reais (obrigatório — nunca deixar cair para fonte do sistema)

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

**Cuidado com CSS flexbox + `gap` em torno de nós de texto misturados com `<b>`**: isso já causou espaçamento indevido no wordmark. Sempre envolva o texto do wordmark em um único `<span>` (`<span><b>Dinheiro em</b> Pauta</span>`) para evitar que o `gap` do flex container se aplique entre nós de texto anônimos.

### 7. Renderize via Chromium headless, nunca ImageMagick/rsvg direto

ImageMagick não renderiza bem `@font-face`/texto customizado em HTML — a
renderização **tem** que passar por um browser real.

**Regra crítica, motivada por um erro real (19/08/2026 → corrigido
20/08/2026): "este ambiente não tem geração de imagem" quase nunca é
verdade — é falta de checar antes de desistir.** Um artigo publicado
sem og-image por essa razão (`alocacao-explica-desempenho`) ficou sem
prévia de compartilhamento por horas até o usuário perguntar por quê.
Antes de concluir que a geração é impossível, **sempre** rode este
checklist de descoberta primeiro:

```bash
# 1. Existe algum Chromium/Chrome já instalado no ambiente?
command -v google-chrome chromium chromium-browser 2>/dev/null
echo "$PLAYWRIGHT_BROWSERS_PATH"
find /opt /usr /home -maxdepth 5 \( -iname "chrome" -o -iname "chromium*" \) -type f 2>/dev/null | grep -i linux
# Nas sessões de Claude Code neste ambiente remoto, o caminho típico é:
#   /opt/pw-browsers/chromium-*/chrome-linux/chrome   (via PLAYWRIGHT_BROWSERS_PATH)
```

Se qualquer um desses achar um binário, **ele é suficiente** — nem
precisa de Puppeteer/Playwright como pacote npm. O próprio binário do
Chrome tem uma flag de screenshot embutida, então o caminho mais simples
e com menos dependências é:

```bash
CHROME=/opt/pw-browsers/chromium-*/chrome-linux/chrome   # ajuste pro caminho encontrado acima
$CHROME --headless --disable-gpu --no-sandbox --hide-scrollbars \
  --force-color-profile=srgb --font-render-hinting=none \
  --window-size=1200,630 \
  --screenshot=og-cover-nome-do-artigo.png \
  file:///caminho/absoluto/para/cover.html
```

(Os avisos de `dbus`/`org.freedesktop.DBus` no stderr são inofensivos —
não indicam falha; confira o arquivo de saída e o exit code do
screenshot, não o stderr.) Isso já sai em 1200×630 exatos, sem precisar
de downscale — confirme com um leitor de dimensões de PNG (`identify`,
se disponível, ou lendo o cabeçalho IHDR manualmente com Python) que o
resultado é **exatamente 1200×630** antes de aceitar.

Se por algum motivo real (não hipotético) nenhum Chromium existir e não
houver como instalar um, **isso é uma exceção rara que precisa ser
relatada explicitamente ao usuário como bloqueio**, nunca silenciada
como "pendência fora do escopo" ou publicada sem mais explicação — e
mesmo nesse caso, tentar `npx playwright install chromium` ou variantes
de puppeteer-core antes de desistir.

Alternativa via Puppeteer (útil se for preciso supersampling 2x e
downscale com filtro, ou se o ambiente específico só expõe o Chrome via
um pacote node, como em alguns setups do app desktop):

```javascript
// shot.js
const puppeteer = require('puppeteer-core'); // ou o caminho do puppeteer-core já instalado localmente
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: process.env.CHROME_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
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

Rode: `node shot.js artigo.html og-cover-bruto.png` (sai em 2400×1260) e então reduza com filtro Lanczos para o tamanho final, **se** `convert`/`magick` (ImageMagick) estiver disponível:

```bash
convert og-cover-bruto.png -filter Lanczos -resize 1200x630 -quality 95 og-cover-nome-do-artigo-vN.png
```

Se ImageMagick não estiver disponível, use a abordagem direta da seção
acima (viewport 1x, sem downscale) em vez de travar no passo de resize —
o resultado sem supersampling já é nítido o suficiente para OG image.

Confirme as dimensões finais (precisa ser exatamente **1200x630**) antes de entregar.

### 8. Verificação final antes de entregar

- [ ] Nome do arquivo é uma versão **nova** (nunca reaproveita o nome já publicado — ver tabela de versionamento na seção 1)
- [ ] Dimensões exatas: 1200×630
- [ ] Wordmark mostra "Dinheiro em Pauta" com a divisão de peso certa ("Dinheiro em" destacado, "Pauta" normal) — **não** "Independência Calculada"
- [ ] Nenhum ícone/emoji/foto de banco de imagem — só tipografia + o motivo gráfico SVG
- [ ] O motivo gráfico e o H1 batem com a versão já aprovada e publicada (a menos que o conteúdo do artigo tenha mudado)
- [ ] Eyebrow, categoria e subtítulo batem com o conteúdo real do HTML anexado
- [ ] Fontes corretas (Fraunces no título, IBM Plex Mono nos labels/wordmark, IBM Plex Sans no subtítulo) — sem fallback visível para Arial/DejaVu
- [ ] Salvar em `/mnt/user-data/outputs/` e usar `present_files` para entregar

---

## As 4 imagens que precisam ser regeneradas nesta rodada

**Nota:** `internal/REBRAND-PLAN.md` e `internal/BACKLOG.md` mencionam "3
artigos" com o nome antigo desenhado na imagem, mas ao conferir os
arquivos publicados em `assets/` foi encontrada uma **quarta** imagem na
mesma situação (`og-cover-montar-carteira-estudo-de-caso.png` — artigo
publicado depois da decisão de rebrand, mas a imagem nunca foi
atualizada). As 4 estão listadas abaixo; confirmar com o usuário se
alguma deve ficar de fora antes de gerar.

| Artigo | Arquivo atual | Arquivo novo |
|---|---|---|
| `quanto-posso-retirar-aposentadoria` | `og-cover-quanto-posso-retirar.png` | `og-cover-quanto-posso-retirar-v2.png` |
| `ipca-hiperinflacao` | `og-cover-ipca-hiperinflacao-v2.png` | `og-cover-ipca-hiperinflacao-v3.png` |
| `pwr-carteira-fire` | `og-cover-pwr-carteira-fire-v2.png` | `og-cover-pwr-carteira-fire-v3.png` |
| `montar-carteira-estudo-de-caso` | `og-cover-montar-carteira-estudo-de-caso.png` | `og-cover-montar-carteira-estudo-de-caso-v2.png` |

Rode o prompt uma vez por artigo, anexando o `index.html` correspondente.

---

*Adaptado de `internal/prompt-og-image-independencia-calculada.md` na
Fase 5 do rebrand (17/08/2026). Reaplicar integralmente a cada artigo
novo dali pra frente, adaptando apenas o conteúdo textual e o motivo
gráfico — nunca a estrutura, paleta ou tipografia.*
