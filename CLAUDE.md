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
