---
name: clareza-e-fluidez
description: Revisão de storytelling e clareza de leitura para um artigo do blog Dinheiro em Pauta — deixa o texto fluido, com progressão lógica, sem densidade numérica que cansa o leitor, e traduz jargão técnico para linguagem simples, sem sacrificar nenhum número, ressalva ou citação. Use quando o usuário pedir para "melhorar o storytelling", "deixar mais fácil de ler", "revisar a clareza", "está muito denso/cansativo", "sem ficar com sono", ou pedir para conferir se um artigo "flui bem" ou "está claro o suficiente" para leitor leigo, experiente e especialista ao mesmo tempo.
---

# Clareza e fluidez de leitura

Revisão de storytelling aplicada a um artigo já escrito (rascunho pronto ou já publicado): o objetivo é que um leitor leigo, um investidor experiente e um especialista técnico saiam todos entendendo tudo e sabendo o que fazer com a informação — sem que nenhum dos três se sinta insultado pela simplicidade nem perdido pela densidade.

## Regra que não se negocia

**Nunca cortar, trocar ou suavizar um número, uma citação, uma ressalva metodológica ou uma nuance técnica para ganhar fluidez.** Esta skill só mexe em prosa, transição, estrutura de parágrafo e tradução de jargão — nunca em conteúdo. Se uma correção de clareza exigiria sacrificar precisão (por exemplo, apagar um número específico em vez de só reorganizar onde ele aparece), pare e pergunte ao usuário em vez de decidir sozinho. Isso já foi pedido explicitamente numa sessão anterior ("não quero sacrificar qualidade técnica do artigo") — é o limite superior de qualquer edição feita por esta skill.

## Duas passadas, propósitos diferentes

### Passada 1 — Arco narrativo (estrutura macro)

Pergunte, seção por seção:

- **O artigo tem um gancho de abertura?** Uma cena relatable, uma pergunta que gera tensão, ou algo que puxa o leitor para dentro do problema antes de despejar definição/dado — em vez de começar direto com "Neste artigo vamos...".
- **Cada `h2` entrega o que promete?** Releia o título da seção contra o parágrafo de fechamento dela — o título cria uma expectativa que a seção de fato cumpre, ou o argumento vai para outro lugar? (Esse é um problema de coerência que a `conferencia-tecnica-artigo` não pega, porque cada frase pode estar factualmente correta isoladamente.)
- **Existe uma ponte entre uma seção e a próxima?** Ou o texto simplesmente pula de um `h2` pro outro sem aviso? Uma frase de transição no fim de uma seção (ou no início da próxima) que retoma o fio ("Até aqui os números mostram o quê. Esta seção trata do porquê.") ajuda o leitor a não se sentir perdido.
- **A virada de "diagnóstico" para "o que fazer" é explícita?** Artigos que terminam em uma seção prática (`O que fazer com isso`, `Roteiro prático`) devem anunciar essa virada com uma frase, não só pular direto para uma lista.
- **O fechamento aterrissa, ou só para?** Uma frase de transição antes do recap/conclusão fecha o ciclo melhor do que ir direto para uma lista numerada.

### Passada 2 — Densidade e jargão (nível de frase e parágrafo)

Esta é a passada que realmente evita o "efeito sono". Percorra parágrafo por parágrafo:

- **Conte quantos números (%, valores, anos, N) aparecem no mesmo parágrafo.** Mais de 5-6 números numa sequência de frases é sinal de fadiga garantida, mesmo que cada um seja relevante. Soluções, em ordem de preferência:
  1. Se os números já aparecem numa tabela, `stat-card` ou gráfico próximo, **não repita todos na prosa** — deixe o componente visual carregar a precisão e a prosa carregar o "porquê"/a narrativa. Mover a tabela para *antes* do parágrafo explicativo (em vez de depois) costuma ajudar: o leitor vê os números primeiro, e a prosa não precisa reafirmá-los.
  2. Se não há componente visual duplicando os números, quebre o parágrafo em dois — um para o achado principal, outro para o achado secundário/nuance — em vez de um bloco só.
  3. Nunca resolva isso *apagando* um número — só reorganizando onde e quantas vezes ele aparece.
- **Todo termo técnico sem glossário precisa de tradução inline na primeira aparição.** Nome de teste estatístico, sigla de modelo financeiro, termo de finanças comportamentais — se não está no bloco `.glossary` do artigo, adicione uma explicação curta em português simples entre travessões ou parênteses, no primeiro uso, sem precisar de nota de rodapé separada. Exemplo real: "os testes de Treynor-Mazuy e Henriksson-Merton. A ideia por trás dos dois é simples de entender, mesmo que o nome não seja: eles comparam...".
- **Frases muito longas com múltiplos incisos** (vários travessões/parênteses na mesma frase, cada um carregando um dado novo) geralmente pedem para virar duas frases mais curtas. Quebre no ponto onde uma ideia termina e outra começa — não no meio de um raciocínio.

## O que NÃO fazer

- Não decida sozinho cortar um parágrafo inteiro, mudar o sentido de uma alegação, ou mexer numa referência — isso é decisão editorial, chamar o usuário (mesma regra do `CLAUDE.md`).
- Não simplifique uma seção que é densa *por natureza do argumento* (ex: a demonstração matemática central de um artigo) só para reduzir a contagem de palavras — pergunte ao usuário se a troca vale a pena em vez de aplicar por conta própria. Foi exatamente essa pergunta que levou à resposta "não quero sacrificar qualidade técnica" numa sessão anterior.
- Não rode isso como substituto do `humanizer` — são coisas diferentes. `humanizer` remove maneirismos de escrita de IA (frase feita, palavra batida, voz robótica); esta skill trabalha estrutura e densidade. Rode esta skill **antes** do `humanizer` (a reestruturação pode introduzir texto novo que ainda precisa passar pelo crivo anti-clichê) e **antes** da skill `citacao-numerada` (que depende da ordem final do texto para saber onde é a "primeira menção" de cada fonte).

## Depois de editar

- Recalcule o tempo de leitura (contagem de palavras do conteúdo real ÷ 200/min — nunca estimar de cabeça) e rode `node internal/tools/sync-cards.js --apply` para propagar a mudança pros cards da home e de `/artigos/`.
- Confira o balanceamento de tags HTML (parágrafos, divs) depois de qualquer edição estrutural.
- Reporte ao usuário, de forma honesta, **o que ainda ficou denso e por quê** — não declare o artigo "leve o suficiente" sem examinar criticamente se alguma seção continua pesada para o leitor leigo. Se a resposta for "essa parte continua densa porque é o núcleo da evidência, e simplificar mais custaria precisão", diga isso explicitamente em vez de deixar por isso mesmo.
