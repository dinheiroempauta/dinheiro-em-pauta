# Backlog — Simuladores do blog Dinheiro em Pauta

Ideias de simuladores/calculadoras novos, priorizadas pelo quanto encaixam
na proposta do blog (FIRE, taxa de retirada, renda fixa) e pelo quanto
preenchem uma lacuna real que os artigos já publicados deixam em aberto.
Cada item foi pensado pra virar uma página em `simuladores/<slug>/`,
seguindo o mesmo padrão dos três já existentes (`pu-renda-mais`,
`pu-educa-mais`, `comparador-composicao`) — ver `CLAUDE.md` pro checklist
técnico obrigatório de simulador novo (design system, `.engage`,
comentários, etc.).

Ao implementar qualquer item daqui, mover pra "Concluído" no fim (mesmo
padrão do `internal/BACKLOG.md`).

---

## Prioridade alta — lacuna direta dos artigos já publicados

- [ ] **Simulador de PWR/SWR (taxa de retirada segura)** — o artigo
      "Quanto posso retirar dos meus investimentos durante a
      aposentadoria?" e o card "Qual é a PWR da minha carteira?" explicam
      o conceito e mostram a matemática, mas o leitor não consegue plugar
      os próprios números em lugar nenhum do site. Inputs: patrimônio
      acumulado, taxa de retirada anual (%), composição da carteira
      (ou uma taxa real esperada direto). Saída: renda mensal/anual
      estimada, e idealmente uma projeção de quantos anos o patrimônio
      dura sob diferentes cenários de retorno real. É o simulador que
      mais fecha o ciclo "li o artigo → apliquei no meu caso" do blog
      inteiro.

- [ ] **Calculadora de patrimônio-alvo para aposentadoria (FIRE number)**
      — inverso do simulador de PWR: o leitor informa o gasto mensal
      desejado na aposentadoria e a taxa de retirada que pretende usar
      (25x, 33x, PWR customizada), e a calculadora devolve o patrimônio
      necessário. Complementa o de PWR (um pergunta "quanto posso
      retirar", o outro "quanto preciso acumular") — os dois deveriam
      linkar um pro outro via "Continue lendo"/simulador relacionado.

- [ ] **Simulador de acumulação até o FIRE (aporte mensal → anos até a
      meta)** — dado aporte mensal, patrimônio atual, retorno real
      esperado e o patrimônio-alvo (do item acima), estima em quantos
      anos a meta é atingida. É o gancho natural pra quem calculou o
      "quanto preciso" e quer saber "quando chego lá" — fecha o funil
      FIRE completo (quanto preciso → quando chego → quanto posso
      retirar).

## Prioridade média — expande a cobertura de renda fixa (linha editorial já forte)

- [ ] **Simulador de PU do Tesouro Selic e Tesouro Prefixado** — os dois
      simuladores de PU existentes cobrem RendA+ e Educa+ (títulos mais
      novos e menos conhecidos); Selic e Prefixado são os títulos mais
      procurados por quem está começando e não têm simulador nenhum no
      site ainda. Mesmo padrão de UI dos dois já existentes.

- [ ] **Comparador IPCA+ vs. Prefixado vs. CDI/Selic para um prazo dado**
      — o artigo "A confusão generalizada sobre os Títulos IPCA+" explica
      a diferença conceitual, mas comparar retorno esperado líquido de
      IR entre as três famílias de título pro mesmo prazo/valor exige
      conta manual hoje. Inputs: valor, prazo, taxa de cada título,
      inflação implícita/projetada; saída: retorno líquido comparado
      lado a lado, já descontando a tabela regressiva de IR.

- [ ] **Calculadora de IR regressivo em renda fixa** — tabela regressiva
      (22,5% → 15%) aplicada ao rendimento bruto informado, mostrando o
      líquido conforme o prazo de resgate. Simples, mas é a peça que
      falta pra qualquer comparação de retorno "líquido" que os artigos
      de renda fixa mencionam sem ferramenta de apoio.

- [ ] **Simulador de marcação a mercado (venda antecipada de título
      prefixado/IPCA+)** — mostra o efeito de vender um título do Tesouro
      Direto antes do vencimento quando a taxa de mercado mudou (ganho ou
      perda de marcação a mercado). Tema que gera bastante dúvida/pânico
      em quem vê o preço do título "cair" no extrato sem entender por quê
      — encaixa no tom didático do blog.

## Prioridade média — alocação e composição de carteira

- [ ] **Simulador de rebalanceamento de carteira** — dado a composição
      atual e a composição-alvo (a mesma lógica do `comparador-composicao`
      já existente), calcula quanto comprar/vender de cada classe pra
      voltar ao alvo, com opção de "rebalancear só com aporte novo" (sem
      vender nada) — a forma mais comum e fiscalmente mais simples de
      rebalancear na prática.

- [ ] **Calculadora de correção de rota de carteira ao longo do tempo
      ("glidepath" para aposentadoria)** — simula como a alocação
      renda fixa/renda variável deveria mudar conforme a pessoa se
      aproxima da aposentadoria (ex: regra "120 menos idade"), mostrando
      a composição sugerida ano a ano. Mais avançado, mas encaixa direto
      na linha "Planejamento" do blog.

## Prioridade baixa — complementares / menos ligado ao núcleo do blog

- [ ] **Simulador de reserva de emergência (meses de gasto → valor-alvo,
      considerando liquidez diária)** — tema clássico de educação
      financeira, mas menos ligado à proposta específica do blog (FIRE/
      taxa de retirada/renda fixa avançada); mais indicado se um artigo
      futuro cobrir o tema primeiro.

- [ ] **Calculadora de inflação acumulada / poder de compra ao longo do
      tempo (IPCA histórico)** — reaproveitaria dados do artigo do IPCA,
      mas é mais uma ferramenta de referência genérica do que algo
      específico da proposta de FIRE/renda fixa do blog.

---

## Notas de priorização

A ordem acima favorece simuladores que **fecham o ciclo de um artigo já
publicado** (PWR, FIRE number, acumulação) sobre simuladores novos e
desconectados de conteúdo existente — cada um desses três deveria linkar
para o(s) outro(s) e para o artigo de origem assim que existir mais de um,
formando um funil: quanto preciso → quando chego → quanto posso retirar.
Depois disso, a prioridade é fechar a cobertura de renda fixa (linha
editorial mais forte do blog hoje, com 2 dos 3 simuladores existentes já
nesse tema) antes de expandir pra alocação/rebalanceamento ou temas mais
genéricos de educação financeira.

## Concluído
