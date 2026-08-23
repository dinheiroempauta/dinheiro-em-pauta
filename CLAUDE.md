# Dinheiro em Pauta — instruções para o Claude

Blog estático (HTML puro, sem build) sobre finanças, investimentos,
liberdade financeira e aposentadoria antecipada, hospedado no GitHub
Pages. Ver `README.md` para a visão geral do
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

A mesma disciplina vale pra qualquer alegação sobre **premissa ou
metodologia** de uma fonte — não só citação formal. "Esse paper assume
retornos independentes", "esse teste usa dado histórico real", "essa
proposição vale independente da distribuição" são afirmações técnicas tão
checáveis quanto uma citação, e errar nelas é o mesmo tipo de dano à
credibilidade. Isso vale mesmo dentro de uma sessão em que a auditoria
técnica (`conferencia-tecnica-artigo`) já rodou uma vez: escrever ou
corrigir uma nota, um caveat ou uma explicação sobre o que uma fonte
assume ou não assume exige reabrir o PDF correspondente e confirmar ali
— nunca reconstruir de memória o que "provavelmente" o paper diz, nem
reusar a lembrança da auditoria anterior sem reconferir. Já aconteceu
(artigo `dca-vs-lump-sum`) de eu atribuir a dois papers a mesma premissa
de independência de retorno quando só um deles de fato assumia isso — só
descobri reabrindo os PDFs, não checando de cabeça.

## Repositório separado para os PDFs das fontes (não commitar PDF aqui)

Este repositório (`dinheiro-em-pauta`) **precisa continuar público** — o
GitHub só serve Pages a partir de repositório privado em contas pessoais
com plano Pro, e o dono deste projeto decidiu ficar 100% no plano
gratuito. Então nunca proponha ou execute deixar este repositório
privado.

Por causa disso, PDFs de papers/artigos acadêmicos usados como fonte de
um artigo **nunca são commitados aqui** — eles têm copyright do editor
(JFQE, Journal of Portfolio Management etc.), e este repo é público. Eles
vivem num repositório irmão, privado, dedicado só a isso:
`dinheiroempauta/dinheiro-em-pauta-fontes`.

Estrutura dentro dele: uma pasta por slug de artigo (`<slug>/`), com os
PDFs originais mais um `README.md` com a referência bibliográfica
completa de cada um (autor, título, periódico, volume, número, páginas,
ano, DOI). Como esse repositório é privado, subir o PDF de verdade lá é
seguro — é um arquivo pessoal, não redistribuição pública — ao contrário
deste repositório aqui.

**Importante sobre como acessar esse segundo repositório:** não existe
uma ferramenta `add_repo` (ou equivalente) que anexe um repositório novo
a uma sessão já aberta — testado e confirmado que não funciona. Nesta
plataforma (Claude Code), o acesso a repositório é escolhido no seletor
**no momento em que a sessão é criada** e não muda depois. Então:

- Se o seletor de repositório permitir marcar mais de um ao abrir uma
  sessão nova, prefira abrir a sessão de trabalho já com
  `dinheiro-em-pauta` **e** `dinheiro-em-pauta-fontes` selecionados
  juntos sempre que a tarefa envolver lidar com PDFs-fonte (escrever
  artigo novo a partir de papers, rodar `conferencia-tecnica-artigo`,
  revisitar de quais PDFs um artigo antigo partiu) — assim dá pra
  commitar em ambos na mesma sessão.
- Se não for possível selecionar os dois de uma vez, o fluxo é em duas
  etapas: (1) nesta sessão (só `dinheiro-em-pauta`), processar os PDFs
  normalmente e, ao final, empacotar a pasta `<slug>/` (PDFs + README)
  num `.zip` e entregar ao usuário via `SendUserFile`; (2) numa sessão
  separada, aberta já com `dinheiro-em-pauta-fontes` selecionado, pedir
  o zip de volta ao usuário e commitar o conteúdo lá.
  **Esse `.zip` é obrigatório, não opcional, sempre que o artigo tiver
  sido embasado em papers com copyright de editor** — não considerar a
  publicação do artigo "concluída" tendo criado só o
  `internal/fontes/<slug>/README.md` com a bibliografia e deixado os
  PDFs perdidos no disco da sessão. Já aconteceu (artigo
  `market-timing-funciona`, 23/08/2026) de eu publicar o artigo inteiro
  — commit, PR, merge — sem nunca gerar esse zip, e só perceber a
  lacuna porque o usuário perguntou depois "o que pode ser aprimorado
  no fluxo?". Gerar e entregar o zip faz parte do checklist de
  publicação (`internal/CHECKLIST-NOVO-ARTIGO.md`, seção 5), no mesmo
  commit/sessão em que os PDFs ainda estão no disco — depois que a
  sessão termina, os arquivos originais não são mais recuperáveis.
- Nunca tentar `git clone`/API do GitHub para o repo de fontes a partir
  de uma sessão que só tem `dinheiro-em-pauta` — falha por falta de
  credencial/escopo, não é um problema temporário.

## Manter um índice de fontes desde a primeira leitura, não só na conferência final

Quando a pesquisa de um artigo envolve avaliar vários PDFs ao longo de
várias rodadas da conversa (comum quando o usuário vai enviando papers aos
poucos, ou pede pesquisa adicional depois de uma primeira leitura), não
confiar só na memória da conversa pra lembrar qual arquivo é qual paper.
Manter, desde a primeira leitura de cada PDF, um arquivo de trabalho no
diretório de scratchpad da sessão — algo como `fontes-<slug-provisorio>.md`
— com uma linha por PDF: nome do arquivo enviado, autor/título/ano/veículo
confirmados no próprio cabeçalho do PDF (nunca de memória), e um resumo de
3-5 linhas dos achados. Atualizar esse arquivo a cada novo PDF avaliado, em
vez de reconstruir a lista de cabeça em cada resposta.

Isso é o mesmo índice que o passo 1 da skill `conferencia-tecnica-artigo`
já recomenda montar — a mudança é fazer isso **desde a fase de pesquisa**,
não só quando a conferência técnica final for rodada. Motivo concreto:
nomes de arquivo genéricos (`ssrn219228.pdf`, `ssrn262076.pdf`) não
carregam a identidade do paper, e ler vários PDFs em lote no mesmo turno
(ex: 5 PDFs de uma vez) é um cenário propenso a trocar o conteúdo de um
arquivo pelo de outro nas anotações mentais/resumos dados ao usuário. Já
aconteceu (pesquisa do artigo `market-timing-funciona`, ago/2026) de eu
identificar errado, em turnos diferentes da mesma conversa, qual arquivo
era Graham & Harvey (1997), qual era Barber & Odean (2000) e qual era, na
verdade, Shiller (1980) — só descoberto na conferência técnica final,
por sorte sem ter contaminado o artigo publicado. Um índice mantido desde
o início teria pego a inconsistência na hora, não semanas de trabalho
depois.

## Publicação de artigo novo

Siga `internal/CHECKLIST-NOVO-ARTIGO.md` à risca, partindo de
`internal/template-artigo.html`. Para artigo embasado em papers/fontes
técnicas, a ordem entre as etapas de acabamento importa e **não é livre**:

rascunho → **`conferencia-tecnica-artigo`** (se o artigo cita papers) →
ajustes decorrentes do relatório → **`clareza-e-fluidez`** → `humanizer` →
**`citacao-numerada`** (se o artigo cita papers) → card na
home/`artigos/`, `sitemap.xml`/`feed.xml`, og:image (prompt em
`internal/prompt-og-image-dinheiro-em-pauta.md`) → zip de fontes (ver
seção acima).

Cada uma dessas quatro skills faz parte do processo de construção de
todo artigo novo, sem precisar ser pedida — mesmo espírito da estimativa
de tempo de leitura e do bloco "Nivelamento básico" descritos abaixo.
Rodar a conferência técnica **antes** do humanizer e dos passos de
publicação, nunca depois — é a própria skill `conferencia-tecnica-artigo`
que recomenda essa ordem, mas o motivo prático é o que importa: se a
auditoria encontrar algo que exija reescrever um trecho, fazer isso antes
do humanizer e antes de já ter espelhado o card/sitemap/feed evita ter
que desfazer/refazer trabalho de publicação já feito. Já aconteceu
(artigo `market-timing-funciona`, 23/08/2026) de eu inverter essa ordem —
humanizer e todos os passos de publicação antes da conferência técnica —,
que só por sorte encontrou achados pequenos o bastante pra corrigir em
uma frase sem precisar desfazer nada já publicado.

`clareza-e-fluidez` vem depois dos ajustes da conferência técnica e antes
do `humanizer`, porque ela pode reestruturar parágrafos e criar prosa
nova (transições, traduções de jargão) que ainda precisa passar pelo
crivo anti-clichê do humanizer. `citacao-numerada` vem por último, depois
do humanizer, porque ela depende da ordem final do texto para saber onde
fica a "primeira menção" de cada fonte — rodar antes obrigaria a refazer
os marcadores se o humanizer ou a revisão de clareza reordenarem
qualquer parágrafo.

Só não decidir sozinho um corte de parágrafo, mudança de sentido de uma
alegação ou algo que toque numa referência — isso é decisão editorial,
chamar o usuário (a `clareza-e-fluidez` reforça essa mesma regra: ela
nunca sacrifica precisão técnica por fluidez, só reorganiza prosa). O
fluxo é: commit → push → PR → conferir diff → merge — sem pausar pra
aprovação em cada etapa, como descrito acima.

**A og:image não é opcional e "não tenho ferramenta de geração de
imagem" não é uma saída válida sem checar primeiro.** Já aconteceu de eu
mergear um artigo (`alocacao-explica-desempenho`, 20/08/2026) sem a
og:image, listando isso como "pendência fora do escopo desta sessão" —
mas o ambiente tinha, o tempo todo, um Chromium headless disponível
(`/opt/pw-browsers/chromium-*/chrome-linux/chrome` nas sessões remotas
deste projeto) capaz de renderizar o HTML da capa e tirar um screenshot
via `chrome --headless --screenshot=...`, sem precisar de nenhuma
ferramenta especial de geração de imagem — só não foi verificado antes
de desistir. Antes de publicar um artigo (ou de dizer ao usuário que a
og:image ficou pendente), seguir o passo de descoberta no início da
seção 7 de `internal/prompt-og-image-dinheiro-em-pauta.md`: procurar por
um binário de Chromium/Chrome já instalado no ambiente antes de concluir
que a geração é impossível. Só relatar como bloqueio real se essa busca
não encontrar nada.

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
  compartilhar) e `.comments-section` (comentários próprios via Cloudflare
  Worker — ver `dinheiro-em-pauta-comments/`, substituiu o Cusdis em
  17/08/2026), copiados de um simulador existente
  (`simuladores/pu-renda-mais/index.html` é a referência) — `data-slug` do
  botão de curtir, `data-slug`/`data-comments-api` do `.comment-widget` de
  comentários (os `id`/`for` dos campos do formulário também precisam ser
  únicos por página, seguindo o padrão `c-nickname-<slug>` etc.) e os três
  links de compartilhar (WhatsApp/LinkedIn/X, repara na URL **codificada**
  `https%3A//...` dentro do `href`, não só a versão normal) tudo
  customizado pro slug e caminho completo do simulador
  (`simuladores/<slug>/`, não só `<slug>/`) — inclusive adicionar o slug
  nesse mapa em `dinheiro-em-pauta-comments/src/email.js`
  (`SLUG_PATHS`), senão o link de "ver comentário" nos e-mails de
  notificação fica quebrado (aponta pra `<slug>/` em vez de
  `simuladores/<slug>/`). Os simuladores não tinham
  isso até um pedido explícito corrigir os 3 existentes — não pule isso
  silenciosamente como aconteceu com o
  `site.js` (item acima)
- Formatação de número usa `toLocaleString('pt-BR', {...})`, nunca
  `.toFixed().replace('.', ',')` manual
- Se o cálculo depender de dias úteis/feriados, reusar
  `assets/feriados.js` em vez de duplicar a lista

Isso vale tanto para eu gerar do zero quanto para eu revisar uma página
que já foi criada — o checklist acima é o que teria pego o bug do
toggle antes de virar um problema em produção.
