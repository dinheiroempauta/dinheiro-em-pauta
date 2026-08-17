# Independência Calculada — instruções para o Claude

Blog estático (HTML puro, sem build) sobre FIRE, taxa de retirada e renda
fixa, hospedado no GitHub Pages. Ver `README.md` para a visão geral do
projeto e o fluxo de publicação de artigos, e
`internal/CHECKLIST-NOVO-ARTIGO.md` + `internal/template-artigo.html` para
o padrão obrigatório de todo artigo novo.

## Modo de operação: autônomo, de ponta a ponta

O dono deste repositório não quer aprovar passos técnicos individualmente.
Para trabalho de rotina neste repositório — editar arquivos, revisar o
próprio diff, commitar, dar push e **mergear PRs** — proceda sem pausar
para pedir confirmação. O usuário quer interagir só com o resultado
(o site publicado / o PR mergeado), não com os passos intermediários de
git/GitHub.

Isso cobre, sem precisar perguntar antes:
- Criar/editar arquivos e commitar
- `git push` para branches de trabalho
- Abrir PR
- Revisar o próprio diff (nenhuma página publicada tocada por engano,
  nada fora do escopo pedido) e, se estiver limpo, **mergear o PR**
- Sincronizar `main` local com o remoto depois do merge

Ainda assim, pare e pergunte antes se:
- A mudança for arquiteturalmente significativa ou ambígua (ex: mudar o
  design system, trocar de provedor de comentários/curtidas, alterar a
  estrutura de URLs)
- Envolver decisão de conteúdo editorial (texto do artigo, dados,
  interpretação) que só o usuário pode validar
- For uma ação destrutiva ou difícil de reverter (force-push, deletar
  branch/arquivo que não foi criado nesta mesma tarefa, reescrever
  histórico publicado)
- Envolver custo real (compra de domínio, upgrade de plano pago, etc.)

## Git: checkout seguro de branch de trabalho existente

`git checkout -B <branch>` sozinho, sem apontar pra `origin/<branch>`, cria
(ou **reseta**) a branch local a partir do commit em que HEAD já está —
isso descarta silenciosamente qualquer commit que só exista no remoto,
sem aviso nenhum. Já causou um quase-incidente aqui (branch de trabalho
que estava presa num ponto antigo do `main` quase teve 46 commits do
remoto sobrescritos por um `checkout -B` que assumiu a base errada).

Ao retomar ou criar uma branch de trabalho que já existe no remoto,
sempre um dos dois:
- `git fetch origin <branch> && git checkout -B <branch> origin/<branch>`
  (aponta a base explicitamente pro remoto, nunca implicitamente pro HEAD
  atual), ou
- se a branch local já existe e só precisa atualizar:
  `git fetch origin <branch> && git merge --ff-only origin/<branch>` —
  isso **falha** em vez de sobrescrever quando há divergência, servindo
  de rede de segurança real.

E sempre usar `--force-with-lease` (nunca `--force` puro) em qualquer
push que reescreva histórico de branch remota — a lease bloqueia o push
se o remoto tiver avançado de um jeito que o comando não previa.

## Não limitar largura de texto com `max-width` em `ch` por hábito

Em artigo ou simulador novo, não colar um `max-width: NNch` em parágrafos
(`.lede`, `.page-subheading`, corpo do texto etc.) só porque outra página
do site tem isso — o container (`main`, `--maxw`) já limita a largura da
página. Um `max-width` em `ch` adicional por cima disso costuma ser mais
estreito que o container e força quebra de linha bem antes da borda
disponível, deixando um espaço em branco enorme à direita do texto (já
aconteceu nos dois simuladores de PU). Se não for pra uma coluna de leitura
deliberadamente estreita (ex: corpo de um artigo longo, onde isso é
intencional), deixe o texto ocupar a largura do container.

## Invariante: card da home tem que espelhar o artigo

O card de cada artigo em `index.html` (dentro de `.article-grid`) é texto
**duplicado e independente** do `index.html` do próprio artigo — não há
build, não há template dinâmico, um não lê o outro. Nada sincroniza isso
sozinho.

Sempre que qualquer um destes campos mudar no artigo, o card correspondente
na home **precisa ser atualizado no mesmo commit**, sem exceção:
- Título (`h1.title` do artigo ↔ `.card-title` do card) — tem que bater
  exatamente
- Categoria/eyebrow (`.eyebrow` do artigo ↔ `.card-eyebrow` do card) — tem
  que bater exatamente
- Data de publicação e tempo de leitura (`.meta` do artigo ↔ `.card-meta`
  do card) — têm que bater exatamente
- Resumo (`.subtitle` do artigo ↔ `.card-summary` do card) — não precisam
  ser o texto literalmente idêntico (o subtítulo é um gancho curto, o
  resumo do card é um teaser mais longo pra quem ainda não clicou), mas
  não podem se contradizer — se um for editado de um jeito que muda o que
  o outro diz, o outro precisa ser revisto também

Antes de considerar qualquer edição de artigo "pronta", confirmar
explicitamente que o card está consistente com o artigo — não assumir,
conferir.

## Nunca inventar referência

Toda citação em "Notas e referências" ou "Referências técnicas" — fonte de
dado, artigo acadêmico, seção de handbook, URL — só entra no artigo se eu
tiver **de fato verificado** o que estou citando: abri a página, confirmei
que o número de seção/URL leva pro conteúdo certo, ou é uma citação
acadêmica clássica que eu já conheço com segurança (ex: o paper original
de um método consagrado). Já aconteceu de eu citar uma seção específica de
um handbook (NIST) com número e URL que não levavam ao conteúdo alegado —
citação puramente inventada, nunca conferida antes de publicar.

Quando não for possível verificar uma fonte (ex: acesso à URL bloqueado
neste ambiente), as opções são, nessa ordem de preferência:
- Pedir a fonte/URL correta pro usuário, como já é feito para as séries de
  dados
- Citar algo mais genérico e verificável sem depender de link (ex: o nome
  do método e seu autor/paper original, sem afirmar número de seção ou URL
  específicos)
- Deixar claro no texto que o cálculo foi feito internamente, sem citar
  fonte externa nenhuma

Nunca preencher o vazio com um número de seção, ano, autor ou URL plausível
só para a nota parecer completa. Uma referência errada é pior para a
credibilidade do artigo do que a ausência de referência.

## Publicação de artigo novo

Siga `internal/CHECKLIST-NOVO-ARTIGO.md` à risca, partindo de
`internal/template-artigo.html`. Depois de gerar o artigo, adicionar o
card na home, atualizar `sitemap.xml`/`feed.xml` e gerar a og:image
(prompt em `internal/prompt-og-image-independencia-calculada.md`), o
fluxo é: commit → push → PR → conferir diff → merge — sem pausar pra
aprovação em cada etapa, como descrito acima.

Quando o usuário fornece o conteúdo do artigo (ex: um `.md`) pra eu montar
em HTML, **estimar o tempo de leitura faz parte do processo de construção,
sem precisar ser pedido** — o usuário fornece o conteúdo, não o tempo de
leitura. Calcular pelo método documentado no checklist (contagem de
palavras do conteúdo real ÷ 200 palavras/minuto) e já entregar o artigo
com esse campo preenchido corretamente desde a primeira versão.

Da mesma forma, **todo artigo — atual e futuro — precisa de um bloco
"Nivelamento básico"**, logo após o `.promise` e antes do corpo do
artigo (`id="nivelamento-basico"`, `class="note green"`, ver
`internal/template-artigo.html`). É um parágrafo curto (2-3 frases), no
mesmo tom direto do resto do artigo — normalmente um ponteiro para outro
artigo do blog que cobre a base teórica (quando existir um relacionado)
mais uma frase definindo o conceito central em linguagem simples, pro
leitor que chegou sem contexto não se perder. Gerar esse bloco a partir
do conteúdo do próprio artigo faz parte do processo de construção, sem
precisar ser pedido — mesmo espírito da estimativa de tempo de leitura
acima.

## Toda página nova herda o design system compartilhado — não é opcional

`assets/site.css`, `assets/site.js` e `assets/theme-init.js` existem
justamente para que nenhuma página precise reimplementar nada disso. Um
bug real já aconteceu por pular esse passo: 9 das 12 páginas do site
ficaram sem `<script src=".../assets/site.js"></script>`, e o toggle de
tema/menu simplesmente não funcionava nelas — silenciosamente, sem erro
visível, só descoberto porque o usuário reportou "às vezes funciona, às
vezes não". Antes de dar por pronta qualquer página nova (artigo,
simulador ou outra), confirmar — não assumir — que ela tem, na ordem:

1. `<script src=".../assets/theme-init.js"></script>` no `<head>`, logo
   após a viewport meta, antes de `site.css`
2. `<link rel="stylesheet" href=".../assets/site.css">`
3. `<script src=".../assets/site.js"></script>` no fim do `<body>`
4. O masthead sticky padrão (wordmark + toggle de tema + menu compacto),
   copiado de uma página existente — nunca reimplementado do zero

Para simuladores/calculadoras novas especificamente, verificar também:
- O bloco de resultado dinâmico tem `role="status" aria-live="polite"`
  (leitor de tela precisa ser avisado quando o número muda — sem isso a
  calculadora é muda para quem depende de leitor de tela)
- Todo campo numérico com valor inválido marca `aria-invalid="true"` e
  mostra o erro inline (padrão em `simuladores/pu-renda-mais/index.html`
  e `pu-educa-mais/index.html`), em vez de só deixar o resultado cair
  silenciosamente para "—"
- Inputs e botões usam as classes compartilhadas (`.field input`, `.btn`)
  em vez de CSS local — isso já garante os 44px de alvo de toque
- Nenhuma cor hardcoded (hex direto) fora dos tokens de `site.css` — é
  o que quebra o dark mode automático
- Todo simulador (não só artigo) precisa do bloco `.engage` (curtir +
  compartilhar) e `.comments-section` (Cusdis), copiados de um simulador
  existente (`simuladores/pu-renda-mais/index.html` é a referência) —
  `data-slug` do botão de curtir, `data-page-id`/`data-page-url`/
  `data-page-title` do Cusdis e os três links de compartilhar (WhatsApp/
  LinkedIn/X, repara na URL **codificada** `https%3A//...` dentro do
  `href`, não só a versão normal) tudo customizado pro slug e caminho
  completo do simulador (`simuladores/<slug>/`, não só `<slug>/`). Os
  simuladores não tinham isso até um pedido explícito corrigir os 3
  existentes — não pule isso silenciosamente como aconteceu com o
  `site.js` (item acima)
- Formatação de número usa `toLocaleString('pt-BR', {...})`, nunca
  `.toFixed().replace('.', ',')` manual
- Se o cálculo depender de dias úteis/feriados, reusar
  `assets/feriados.js` em vez de duplicar a lista

Isso vale tanto para eu gerar do zero quanto para eu revisar uma página
que já foi criada — o checklist acima é o que teria pego o bug do
toggle antes de virar um problema em produção.
