# Backlog — Simuladores do blog Dinheiro em Pauta

Ideias de simuladores/calculadoras novos, priorizadas pelo quanto encaixam
na proposta do blog (FIRE, taxa de retirada, renda fixa), pelo quanto
preenchem uma lacuna real que os artigos já publicados deixam em aberto, e
(nesta revisão) pelo quanto diferenciam o blog do que já existe em
português. Cada item foi pensado pra virar uma página em
`simuladores/<slug>/`, seguindo o mesmo padrão dos três já existentes
(`pu-renda-mais`, `pu-educa-mais`, `comparador-composicao`) — ver
`CLAUDE.md` pro checklist técnico obrigatório de simulador novo (design
system, `.engage`, comentários, etc.).

Ao implementar qualquer item daqui, mover pra "Concluído" no fim (mesmo
padrão do `internal/BACKLOG.md`).

---

## O que o benchmarking mostrou

Pesquisa rápida (ago/2026) em blogs de referência, pra calibrar prioridade —
não é uma auditoria exaustiva, é o suficiente pra apontar lacuna e
diferencial:

- **Brasil** (NetDin, Investidor10, ValorFinal, InvestNews, RecargaPay, o
  próprio simulador oficial do Tesouro Direto) — o mercado brasileiro de
  ferramentas de finanças pessoais é **saturado de comparador de CDB vs.
  Tesouro vs. poupança/LCI-LCA** (rendimento líquido de IR, qual rende
  mais). É útil, mas é *commodity* — várias ferramentas gratuitas já
  fazem isso bem. Nenhum concorrente brasileiro encontrado nessa busca
  cobre **taxa de retirada segura (SWR/PWR) com profundidade** — é a
  lacuna mais clara pro blog se diferenciar, e já é exatamente a linha
  editorial que o blog já escolheu (FIRE/SWR).
- **Exterior** (Early Retirement Now / "Big Ern", Engaging Data,
  cFIREsim) — a referência internacional em taxa de retirada não para no
  "quanto posso retirar com uma taxa fixa": eles rodam o plano contra
  **histórico real de mercado** (não só uma média), mostram **risco de
  sequência de retornos** (mesma rentabilidade média, ordem diferente dos
  retornos ano a ano muda completamente se o dinheiro dura ou acaba —
  crash logo nos primeiros anos de retirada é o cenário que mais quebra
  um plano) e taxa de retirada **dinâmica/ajustada por valuation** (regra
  CAPE do Big Ern) em vez de só uma taxa fixa no primeiro ano. Isso é o
  que falta pro blog ficar no nível dos melhores do mundo no próprio nicho
  que já escolheu, em vez de só ficar no nível dos comparadores
  genéricos de renda fixa que já existem em português.

Essas referências não substituem fonte primária num artigo (ver a regra
de "nunca inventar referência" do `CLAUDE.md` — qualquer citação
específica de metodologia precisa ser verificada antes de publicar), mas
servem pra calibrar **o que construir**, não pra citar dado numérico
deles sem checagem.

---

## Prioridade máxima — diferencial competitivo direto (o que a concorrência BR não tem)

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
      inteiro, e a base pros dois itens abaixo.

- [ ] **Simulador de risco de sequência de retornos (sequence of returns
      risk)** — mostra por que duas carteiras com a **mesma rentabilidade
      média** ao longo da aposentadoria podem ter destinos completamente
      diferentes dependendo da **ordem** dos retornos: quem se aposenta
      logo antes de uma queda forte de mercado corre risco real de
      esgotar o patrimônio, mesmo que a média de longo prazo seja idêntica
      à de quem teve mais sorte no início. Inputs: patrimônio inicial,
      retirada anual, uma sequência de retornos anuais (o leitor edita
      linha a linha, ou escolhe entre "mesma sequência" vs. "sequência
      invertida" pra ver o efeito na prática). É um conceito que gera
      "aha" forte e nenhum concorrente brasileiro pesquisado cobre —
      encaixa direto como aprofundamento do artigo de PWR já publicado.

- [ ] **Backtest histórico de taxa de retirada** — em vez de assumir uma
      única taxa real de retorno constante (como o simulador de PWR
      simples acima), roda o plano de retirada contra **janelas reais de
      mercado** (ex: "se eu tivesse me aposentado em cada ano desde
      19XX, com essa taxa de retirada, em quantos desses cenários o
      dinheiro teria durado?"), no espírito do cFIREsim/cheque histórico
      do Big Ern. **Ressalva de implementação**: os EUA têm mais de 150
      anos de dados de mercado de ações; renda fixa brasileira indexada
      (IPCA+/Selic) tem histórico curto (Tesouro Direto existe desde
      2002, NTN-B desde ~2000) — vale avaliar se dá pra rodar contra
      histórico real do Brasil com significância estatística mínima antes
      de prometer isso ao leitor, ou se o simulador precisa deixar claro
      que é um exercício ilustrativo com poucos ciclos. Não publicar
      número de "taxa de sucesso histórica" sem validar a base de dados
      primeiro — mesmo cuidado da regra de "nunca inventar referência".

## Prioridade alta — fecha o funil FIRE já iniciado acima

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

- [ ] **Taxa de retirada dinâmica (guardrails / regra do CAPE)** — em vez
      de uma taxa fixa decidida no dia 1 e nunca mais revista (o que o
      simulador de PWR simples assume), simula uma regra de ajuste ano a
      ano — reduzir retirada depois de um ano ruim, permitir aumentar
      depois de anos bons, no espírito das "guardrails" (Guyton-Klinger)
      ou da regra baseada em valuation do Big Ern (CAPE). Mais avançado
      que o simulador de PWR básico; faz sentido só depois dele existir e
      já ter tração — é a continuação natural do assunto pro leitor mais
      avançado.

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
      lado a lado, já descontando a tabela regressiva de IR. **Atenção**:
      esse tipo de comparador é o que mais satura o mercado brasileiro
      (ver benchmarking acima) — só vale priorizar se conseguir um
      diferencial real de profundidade/didática sobre o que já existe
      (ex: explicar inflação implícita/breakeven, não só comparar número
      final), não como cópia de ferramenta genérica.

- [ ] **Calculadora de IR regressivo em renda fixa** — tabela regressiva
      (22,5% → 15%) aplicada ao rendimento bruto informado, mostrando o
      líquido conforme o prazo de resgate. Simples, mas é a peça que
      falta pra qualquer comparação de retorno "líquido" que os artigos
      de renda fixa mencionam sem ferramenta de apoio.

- [ ] **Comparador de "come-cotas" (fundos DI/RF) vs. Tesouro Direto
      direto** — come-cotas é IR semestral automático em fundos de
      renda fixa/DI que reduz o efeito dos juros compostos ao longo do
      tempo (menos capital rendendo depois de cada cobrança), enquanto
      título do Tesouro comprado direto só paga IR no resgate. É uma
      decisão real e recorrente (fundo DI do banco vs. Tesouro Selic
      direto) que a maioria dos comparadores genéricos de "CDB vs.
      Tesouro" não isola — diferencial de profundidade sobre o que já
      existe em português.

- [ ] **Verificador de limite do FGC (Fundo Garantidor de Créditos)** —
      pra quem usa CDB/LCI/LCA: soma quanto já está aplicado por
      instituição financeira e avisa quando passar do limite de garantia
      do FGC (por CPF, por conglomerado financeiro), que é o risco que
      mais pega gente desprevenida ao "pulverizar" dinheiro em CDBs de
      bancos menores atrás de taxa mais alta. Tema de consciência de
      risco mais do que de otimização de retorno — encaixa no tom
      didático/crítico do blog.

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

- [ ] **Calculadora de "bond tent" / glidepath pra transição de
      aposentadoria** — simula como a alocação renda fixa/renda variável
      deveria mudar **ao redor da data de aposentadoria** (não só reduzir
      risco linearmente com a idade, regra "120 menos idade" — a ideia do
      "bond tent" é aumentar renda fixa nos anos imediatamente antes/
      depois de parar de trabalhar, quando o risco de sequência de
      retornos é maior, e depois voltar a aumentar renda variável), com
      composição sugerida ano a ano. Conecta direto com o simulador de
      risco de sequência de retornos (prioridade máxima acima) — é a
      "solução prática" pro problema que aquele simulador expõe. Mais
      avançado, mas encaixa direto na linha "Planejamento" do blog.

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

Duas forças decidem a ordem acima, nessa prioridade:

1. **Diferencial competitivo** — o mercado brasileiro de ferramentas de
   finanças pessoais já está saturado de comparador simples de renda
   fixa (CDB vs. Tesouro vs. poupança); quase nenhum concorrente
   brasileiro pesquisado cobre SWR/PWR com profundidade, e é exatamente
   aí que os blogs internacionais de referência (Early Retirement Now,
   Engaging Data, cFIREsim) investem mais — histórico real de mercado,
   risco de sequência de retornos, taxa de retirada dinâmica em vez de
   fixa. Por isso o risco de sequência de retornos e o backtest histórico
   entraram na prioridade máxima nesta revisão, ao lado do simulador de
   PWR básico.
2. **Funil já existente** — os simuladores que **fecham o ciclo de um
   artigo já publicado** (PWR, FIRE number, acumulação) continuam à
   frente de simuladores novos e desconectados de conteúdo existente;
   cada um desses deveria linkar para o(s) outro(s) e para o artigo de
   origem assim que existir mais de um, formando o funil: quanto preciso
   → quando chego → quanto posso retirar → (avançado) como ajustar a
   retirada e a alocação ao longo do tempo.

Depois disso, a prioridade é fechar a cobertura de renda fixa (linha
editorial mais forte do blog hoje, com 2 dos 3 simuladores existentes já
nesse tema) — mas com o cuidado de mirar os pontos que os comparadores
genéricos já saturados **não** cobrem (come-cotas, limite do FGC,
inflação implícita) em vez de duplicar o que já existe em português —
antes de expandir pra alocação/rebalanceamento ou temas mais genéricos de
educação financeira.

## Concluído
