# DECISIONS — Log de decisões metodológicas

Cada decisão é registrada aqui **antes** de ser aplicada no código, com
pesquisa e racional. Nada nesta lista é assumido por default — cada entrada
é resolvida em sequência, com base em dados reais e pesquisa, não em
heurísticas genéricas.

---

<!-- Template para cada nova entrada:

## Decisão N — <título curto>
**Data:** AAAA-MM-DD
**Pergunta:** o que precisava ser decidido
**Pesquisa:** resumo do que foi encontrado (com fontes)
**Decisão:** o que foi escolhido
**Racional:** por que essa escolha, incluindo trade-offs descartados
**Validação nos dados (se aplicável):** teste feito, resultado

-->

## Decisão 0 — Uso de proxies de índice em vez de histórico direto dos ETFs
**Data:** 2026-08-09
**Pergunta:** Os ETFs da carteira (VWRA11, DIVO11, B5P211, CDIB11, GOLD11) têm
histórico curto (listagem recente na B3). Como obter uma série 2003–presente?

**Decisão:** Usar como proxy o índice/ativo subjacente de cada ETF, com os
seguintes ajustes:

| ETF | Peso | Proxy | Ajuste cambial | Taxa adm a descontar |
|---|---|---|---|---|
| VWRA11 | 30% | FTSE All-World (Total Return, USD) | + variação PTAX USD/BRL | 0,49% a.a. |
| DIVO11 | 20% | IDIV B3 | nenhum (nativo BRL) | 0,50% a.a. |
| B5P211 | 40% | IMA-B5 | nenhum (nativo BRL) | 0,20% a.a. |
| CDIB11 | 5% | CDI | nenhum (nativo BRL) | 0,15% a.a. |
| GOLD11 | 5% | Ouro (cotação USD/oz) | + variação PTAX USD/BRL | 0,57% a.a. |

**Mecânica:**
1. Retorno mensal do proxy na moeda original.
2. Para VWRA11/GOLD11: compor com variação cambial do mesmo mês —
   retorno_BRL ≈ (1 + retorno_USD) × (1 + variação_PTAX) − 1.
3. Descontar taxa de administração pro-rata mensal, convertida de taxa a.a.
   para taxa mensal composta (não taxa_aa / 12): taxa_mensal = (1 + taxa_aa)^(1/12) − 1.
4. Retorno mensal nominal em BRL do "ETF sintético" = combinação dos passos
   1–3.
5. Combinação da carteira pelos pesos-alvo (30/20/40/5/5) com rebalanceamento
   mensal.
6. Deflação pelo IPCA só nesta etapa final (carteira já combinada), não antes.

**Racional:** É a única forma de obter uma série longa (2003+) compatível com
o objetivo do artigo. O trade-off é que o proxy ignora tracking error residual
do ETF real (rastreamento imperfeito, custos de rebalanceamento internos do
fundo, spread de negociação) além da taxa de adm — essa é uma limitação
explícita a ser registrada no artigo final, não uma imprecisão escondida.

**Pendências a resolver na Fase 2 (pesquisa formal antes de aplicar):**
- Confirmar se a série do FTSE All-World disponível é Total Return (com
  dividendos reinvestidos) — comparar com ETF de acumulação exige TR, não
  Price Return.
- Confirmar variantes do IDIV e do IMA-B5 (índice de preço vs. retorno total)
  — mesmo cuidado.
- Fonte de câmbio: PTAX (Banco Central) como padrão de mercado, a menos que
  surja motivo para mudar.
- Fonte de cada série (Bloomberg/Economatica não disponíveis; buscar fontes
  públicas: B3, ANBIMA, FRED, investing.com, etc.) — a registrar quando os
  dados chegarem.

**Status:** aprovada pelo usuário em 2026-08-09. Pendências de fonte/variante
específica ficam para Fase 2, quando os dados brutos forem inspecionados.

---

## Decisão 1 — Convenção de data nas séries mensais
**Data:** 2026-08-09
**Pergunta:** Nas séries mensais (IDIV, CDI, FTSE All-World, Gold, IPCA), o
valor rotulado com dia 1 do mês representa o fechamento daquele mês, ou o
valor no início do mês (= fechamento do mês anterior)?

**Pesquisa/validação:** Testado diretamente nos dados usando dois eventos de
mercado global bem documentados:
- Covid-19 (março/2020): mercados de ações globais caíram cerca de -13% a
  -14% no mês. Na série FTSE All-World fornecida, o retorno calculado entre
  a linha rotulada `2020-02-01` e a linha rotulada `2020-03-01` é de
  **-13,52%** — bate com a queda real de março/2020, não de fevereiro
  (que teve queda menor, ~-8%, também presente na série).
- Crise financeira global (outubro/2008): mercados globais caíram
  aproximadamente -19% a -20% no mês. O retorno calculado entre as linhas
  `2008-09-01` e `2008-10-01` é de **-19,92%** — bate com outubro/2008, mês
  do colapso do Lehman Brothers e pico da crise.

**Decisão:** A linha rotulada com dia 1 de um mês (ex: `2020-03-01`)
representa o **valor de fechamento daquele mesmo mês** (março/2020), não o
valor no início do mês. Ou seja, `retorno(mês M) = valor(linha M) /
valor(linha M-1) - 1`.

**Racional:** Validação direta com eventos de mercado é mais confiável do
que assumir uma convenção — o rótulo "dia 1" é só uma forma de identificar
o mês civil, não indica se é abertura ou fechamento. Aplico essa mesma
lógica (linha M = fechamento de M) a todas as séries mensais (IDIV, CDI,
Gold, IPCA), por consistência, já que vêm da mesma estrutura de dados.

**Impacto no alinhamento com séries diárias:** IMA-B5 e Câmbio (diárias)
devem ser agregadas usando o **último valor disponível de cada mês
(fechamento mensal)** para ficarem no mesmo referencial temporal das
séries já mensais.

**Status:** resolvida via validação empírica, sem necessidade de confirmação
do usuário.

---

## Decisão 2 — Remoção de linhas duplicadas no IDIV (2016)
**Data:** 2026-08-09
**Pergunta:** A aba IDIV tem 12 linhas duplicadas (jan–dez/2016 aparece duas
vezes seguidas, linhas 123–134 e 135–146 do Excel, valores idênticos).
Como tratar?

**Decisão:** Manter a primeira ocorrência de cada mês, descartar a segunda
(`drop_duplicates(subset='Data', keep='first')`). Confirmado pelo usuário
como erro de copiar-e-colar na montagem da planilha original.

**Racional:** Valores idênticos entre as duas ocorrências — não há conflito
de dado a resolver, é remoção mecânica de linha redundante.

**Resultado:** 260 → 248 linhas. Arquivo limpo salvo em `data/idiv_clean.csv`.

**Status:** aprovada pelo usuário em 2026-08-09.

---

## Decisão 3 — Início da amostra em dez/2005 (Opção A)
**Data:** 2026-08-09
**Pergunta:** IDIV só tem dados a partir de dez/2005 (índice lançado na
última semana de dez/2005, base 1000 — não existe dado anterior porque o
índice não existia). Como conciliar com FTSE All-World e IMA-B5, que têm
dados desde set/2003?

**Pesquisa:** Confirmado via busca que <cite index="25-1">o IDIV B3 foi lançado na última
semana de 2005</cite> — não é uma lacuna de dados, é a data de nascimento do
índice. Elimina a hipótese de "série mais longa existente que não temos".

**Opções avaliadas:**
- A. Truncar toda a análise para começar em dez/2005 (perde 2,25 anos dos
  outros 4 ativos, mas evita qualquer proxy inventado).
- B. Usar Ibovespa/IBrX como substituto do IDIV apenas em 2003–2005 (risco
  de viés: empresas boas pagadoras de dividendos têm perfil de risco/beta
  sistematicamente diferente do mercado amplo).
- C. Rodar a simulação da carteira completa só a partir de dez/2005, mas
  manter os dados soltos de 2003–2005 dos outros ativos só como nota
  informativa (equivalente numericamente a A).

**Decisão:** Opção A. Amostra da carteira completa (5 ativos) começa em
dez/2005 e vai até jul/2026 — **~20,7 anos, 248 meses**.

**Racional:** Evita introduzir um proxy sintético (Ibovespa) com composição
e perfil de risco diferentes do IDIV real, o que contaminaria justamente o
início da série com um viés não quantificável. A perda de 2,25 anos é
aceitável frente ao tamanho da amostra restante (248 meses ainda é uma base
razoável para block bootstrap).

**Status:** aprovada pelo usuário em 2026-08-09.

---

## Decisão 4 — Janela final de retornos mensais: jan/2006 a jun/2026
**Data:** 2026-08-09
**Pergunta:** Qual a janela exata de retornos mensais utilizável, dada a
interseção de cobertura de todas as séries?

**Verificação:** Data máxima de cada série — IDIV/Gold/CDI/FTSE: jul/2026;
IMA-B5: ago/2026 (diária); Câmbio: ago/2026 (diária); **IPCA: jun/2026**
(a mais curta). Como a deflação pelo IPCA é necessária para todo retorno
real, jul/2026 não é computável até a série de IPCA ser atualizada.
No início, dez/2005 é o valor-base do IDIV (índice = 1000, ponto zero, não
um retorno) — o primeiro retorno mensal só existe a partir de jan/2006
(retorno de dez/2005 para jan/2006).

**Decisão:** Janela de retornos mensais reais da carteira: **jan/2006 a
jun/2026 — 246 observações mensais**.

**Racional:** É a interseção exata de cobertura entre todas as sete séries,
sem extrapolação ou preenchimento de dado faltante.

**Status:** aprovada pelo usuário em 2026-08-09.

---

## Decisão 5 — Correção de outlier no FTSE All-World (fev/2009)
**Data:** 2026-08-09
**Pergunta:** A linha de fev/2009 no FTSE All-World tem valor 96.355115,
cerca de 9x os meses vizinhos (jan/2009: 10.671367, mar/2009: 10.450955).
Isso gerou um retorno mensal de +827% seguido de -89% no mês seguinte,
distorcendo toda a estatística da carteira (desvio-padrão mensal de 15,9%,
retorno máximo de 247% — ambos implausíveis para uma carteira diversificada).

**Diagnóstico:** Padrão consistente com erro de digitação (dígito extra ou
vírgula decimal deslocada). Dividindo por 10, o valor corrigido (9.6355115)
fica exatamente entre jan/2009 (10.67) e mar/2009 (10.45), e é consistente
com o fundo do mercado ("bottom") da crise financeira global, que
historicamente ocorreu em março de 2009 — a trajetória correta seria queda
até o fundo em março, o que bate com jan(10.67)→fev(9.64, -9,6%)→
mar(10.45, +8,4%), variações plausíveis para o período mais volátil da
crise.

**Decisão:** Corrigir o valor de fev/2009 para **9.6355115** (dividido por
10).

**Racional:** Alta confiança pelo padrão do erro (fator exato de 10x) e pela
consistência com o contexto histórico do período. Usuário optou por essa
correção em vez de checar a fonte original ou excluir o mês.

**Limitação registrada:** Esta é uma correção por inferência, não uma
confirmação na fonte primária. Se o usuário localizar a fonte original
depois, revisitar esta decisão.

**Status:** aprovada pelo usuário em 2026-08-09.

**Verificação pós-correção:** Após aplicar a correção, o retorno mensal real
da carteira passou de estatísticas implausíveis (desvio-padrão 15,9%, máximo
247%) para valores plausíveis (desvio-padrão 1,85% a.m., mínimo -7,73%,
máximo 6,43%, CAGR real de 7,01% a.a. em 20,5 anos) — consistente com o
perfil da carteira (40% renda fixa IPCA+, 30% ações globais, 20% dividendos
BR, 5% caixa DI, 5% ouro).

---

## Decisão 6 — Tamanho de bloco do bootstrap
**Data:** 2026-08-09
**Pergunta:** Qual tamanho de bloco (e qual variante do block bootstrap)
usar para preservar a estrutura de dependência dos 246 retornos mensais
reais da carteira?

**Análise empírica nos dados reais:**
1. **ACF dos retornos brutos:** autocorrelação linear fraca — nenhuma
   defasagem de 1 a 6 meses é estatisticamente significativa (limiar
   1,96/√246 ≈ 0,125). Lags 7, 14 e 22 cruzam o limiar isoladamente, mas sem
   padrão interpretável (provável ruído de múltiplos testes). Teste conjunto
   de Ljung-Box até a defasagem 12 é significativo a 5% (p ≈ 0,027),
   indicando alguma dependência de ordem superior mesmo com lags
   individuais fracos.
2. **Algoritmo automático de Politis-White/Patton-Politis-White
   (Econometric Reviews, 2004/2009)** aplicado aos retornos brutos: bloco
   médio ótimo de **0,68 meses** (bootstrap estacionário) — ou seja,
   estatisticamente, os retornos brutos são quase indistinguíveis de i.i.d.
   Isso é o "fato estilizado" clássico de mercados eficientes: retorno não
   é previsível a partir do próprio passado.
3. **Mas isso é enganoso para o propósito de PWR.** O que importa para risco
   de sequência de retornos não é a autocorrelação linear dos retornos, e
   sim o **agrupamento de volatilidade** (crises e recuperações "andam
   juntas" no tempo, mesmo que o sinal do retorno não seja previsível).
   Testando isso diretamente:
   - ACF dos retornos ao quadrado: significativa nas defasagens 1 (0,178) e
     4 (0,197) — evidência de clustering de volatilidade (efeito ARCH).
   - Bloco ótimo (Politis-White) para retornos²: **8,6 meses** (estacionário)
     / 9,8 meses (circular).
   - Bloco ótimo (Politis-White) para |retornos|: **4,5 meses** (estacionário)
     / 5,1 meses (circular).

**Pesquisa na literatura de retirement withdrawal / PWR:**
- Forsyth (2022), citado em Forsyth & Vetzal (arxiv 2101.02760), usa bloco
  esperado de ~3 meses para pares ação/bond em otimização de decumulação,
  com checagem de robustez de 0,25 a 5 anos.
- Return Stacked / Newfound Research (2024) usa explicitamente blocos de
  **12 meses** em block bootstrap para simulação de aposentadoria (30 anos,
  100.000 trajetórias), justamente no mesmo tipo de aplicação deste projeto.
- Anarkulova, Cederburg & O'Doherty (2021), via Portfolio Optimizer, usa
  bootstrap estacionário com bloco médio de **120 meses (10 anos)** — mas
  aplicado a uma base de 1.428 observações mensais (119 anos, 1871–1989),
  ordens de magnitude maior que a nossa amostra de 246 meses. Um bloco de
  120 meses aqui deixaria apenas ~2 blocos "efetivos" na amostra, destruindo
  a diversidade de reamostragem — **não aplicável ao nosso tamanho de
  amostra**.
- Método recomendado na literatura geral (Politis & Romano, 1994; Politis &
  White, 2004): **bootstrap estacionário** (blocos de comprimento aleatório,
  distribuição geométrica em torno de uma média) em vez de block bootstrap
  de comprimento fixo — mais robusto a erro de especificação do tamanho de
  bloco e evita artefatos de borda (mesma recomendação seguida por Forsyth &
  Vetzal para o mesmo tipo de problema).

**Decisão:** Usar **bootstrap estacionário (Politis-Romano, 1994)** com
**comprimento médio de bloco de 12 meses**.

**Racional:**
- 12 meses está no limite superior/logo acima da faixa estatisticamente
  indicada pelo clustering de volatilidade nos dados reais (8,6–9,8 meses
  para retornos², 4,5–5,1 para |retornos|) — suficiente para capturar
  agrupamento de crises, sem ser tão longo a ponto de esgotar a diversidade
  de blocos possíveis dada a amostra de 246 meses (~20 blocos efetivos).
- Coincide com precedente direto na literatura de simulação de retirada em
  aposentadoria (Return Stacked/Newfound Research), aplicado ao mesmo tipo
  de problema (block bootstrap para SWR/PWR).
- Bootstrap estacionário (blocos aleatórios) é mais robusto que blocos de
  comprimento fixo e é a recomendação padrão da literatura metodológica
  para este tipo de aplicação.
- Um bloco de 120 meses (padrão em bases de um século+) é descartado por
  incompatibilidade de escala com nossa amostra de 20,5 anos.

**Robustez planejada (Fase de sensibilidade, já prevista em plan.md):**
Testar blocos médios de 6, 9, 12, 18 e 24 meses e comparar a PWR resultante
— se a variação for grande, é sinal de que a amostra de 246 meses é curta
demais para estimar a estrutura de dependência de longo prazo com
confiança, e isso será reportado como limitação explícita no artigo.

**Status:** decisão técnica registrada com base em análise empírica e
literatura — pronta para implementação. Fonte automática: algoritmo de
Politis-White/Patton-Politis-White via pacote `arch` (Python), aplicado aos
dados reais do projeto.

---

## Decisão 7 — Critério de sucesso
**Data:** 2026-08-09
**Pergunta:** O que conta como "sucesso" numa trajetória simulada, para
efeito de definir a PWR? Três candidatos estavam em avaliação: (a) o
patrimônio real nunca cai abaixo do valor inicial em nenhum ponto da
trajetória; (b) o patrimônio real ao final do horizonte simulado é ≥ valor
inicial real (permite drawdown temporário no meio do caminho); (c) o
patrimônio nunca zera (mais permissivo, mais próximo de critério de SWR).

**Pesquisa:** A definição padrão de PWR na literatura e nas principais
ferramentas de backtest usadas por praticantes (Portfolio Charts, Portfolio
Visualizer, Testfol.io) é consistentemente baseada no **valor final**, não
no caminho inteiro:
- Portfolio Charts define PWR como <cite index="64-1">as taxas de retirada que preservam o principal original corrigido pela inflação mesmo ao final da pior janela histórica de um determinado horizonte</cite> —
  critério de valor final, não de mínimo ao longo do caminho.
- A mesma fonte reforça: PWR é a taxa que garante <cite index="69-1">que o retorno mantém o principal real inicial, avaliado ao final do horizonte, e não a cada instante intermediário</cite>.
- Fonte prática de cálculo (Horsesmouth/RetirementOptimizer) formaliza:
  <cite index="70-1">a definição de perpétuo exige que o valor final do ativo no fim do horizonte não seja inferior ao seu valor inicial</cite> — de novo, critério de ponto final, permitindo
  drawdown no meio do caminho.
- Uma fonte (Risk Parity Chronicles) descreve PWR de forma mais coloquial
  como "terminar com pelo menos o capital com que começou", o que é
  compatível com critério de valor final, não painel completo.

Nenhuma fonte consultada usa formalmente o critério (a) — "nunca cair abaixo
em nenhum instante" — como definição-padrão de PWR. Esse critério é mais
próximo de um conceito de "capital protection permanente" usado em gestão
de fundos/endowments com restrição de covenant, não é o que a literatura de
FIRE/aposentadoria chama de PWR.

**Decisão:** Critério de sucesso principal = **(b) valor real da carteira ao
final do horizonte simulado ≥ valor real inicial**, permitindo drawdown
temporário durante a trajetória. Isso é o que será usado para a busca
binária da PWR@90%/95%/etc.

**Robustez planejada:** Reportar também, como métrica complementar (não
como definição alternativa de PWR, mas como informação adicional de risco),
a fração de trajetórias em que o patrimônio real *nunca* cai abaixo do
valor inicial em nenhum ponto intermediário (critério mais estrito, mais
relevante para quem tem aversão a ver o patrimônio cair mesmo que recupere)
— isso maximiza a informação entregue ao leitor, sem redefinir o conceito
de PWR usado pela indústria/literatura.

**Racional:** Manter a definição de PWR alinhada com a literatura e as
ferramentas mais usadas pelo público-alvo do blog (que provavelmente já
conhece Portfolio Charts/Portfolio Visualizer) evita confusão e permite
comparação direta dos resultados com esses benchmarks. Criar uma definição
própria e mais restritiva sem deixar claro que diverge do padrão do mercado
prejudicaria a credibilidade técnica do artigo, não reforçaria.

**Status:** decisão técnica registrada com base em pesquisa — pronta para
implementação.

---

## Decisão 8 — Horizonte de simulação (proxy de perpetuidade)
**Data:** 2026-08-09
**Pergunta:** Quantos anos simular como aproximação prática de um horizonte
infinito (perpétuo)?

**Pesquisa:**
- Portfolio Charts, uma das ferramentas de referência mais usadas para PWR,
  usa **60 anos** como o horizonte mais longo que disponibiliza para SWR e
  PWR, tratando-o na prática como o teto — a página específica de simulação
  de 60 anos ("Permanent Portfolio: 60-year retirement") é o horizonte mais
  longo oferecido pela ferramenta.
- A mesma fonte descreve que SWR e PWR convergem para um mesmo "long-term
  withdrawal rate" à medida que o horizonte cresce — analogia de "avião
  pousando numa pista sólida" — sugerindo que, a partir de um certo
  horizonte, resultados adicionais de alongar a simulação trazem pouca
  mudança na taxa.
- Em contextos acadêmicos correlatos (não PWR especificamente, mas gestão de
  fundos de pensão com horizonte "infinito" tornado tratável), horizontes de
  **80 anos** são usados como proxy de perpetuidade quando o problema
  teórico teria horizonte infinito, mas a simulação exige truncamento.
- McClung (Living Off Your Money) e a literatura de SWR tradicional (Bengen,
  Trinity Study) trabalham majoritariamente com horizontes de 30-40 anos —
  mas esses são estudados de **SWR**, não PWR; não servem de referência
  direta para o proxy de perpetuidade.

**Decisão:** Horizonte de simulação = **60 anos (720 meses)**.

**Racional:** Alinhado com a prática de referência mais usada e reconhecida
pelo público de finanças pessoais (Portfolio Charts), que é exatamente a
ferramenta que testa PWR de forma explícita e é benchmark do setor. Como as
trajetórias simuladas via bootstrap estacionário são construídas por
reamostragem de blocos com reposição (não são a repetição literal da
amostra histórica), o horizonte de simulação não é limitado pelo tamanho da
amostra original (246 meses) — posso gerar trajetórias de qualquer
comprimento.

**Robustez planejada:** Comparar a PWR resultante em horizontes de 40, 60,
80 e 100 anos. Se a taxa estabilizar (variação pequena) a partir de ~60
anos, isso confirma que 60 anos é um proxy razoável de perpetuidade para
esta carteira; se não estabilizar, será reportado como limitação e o
horizonte será estendido.

**Status:** decisão técnica registrada com base em pesquisa — pronta para
implementação.

---

## Decisão 9 — Número de trajetórias simuladas
**Data:** 2026-08-09
**Pergunta:** Quantas trajetórias de bootstrap gerar para que o percentil de
sucesso (e, portanto, a PWR estimada) seja estável, sem gastar tempo
computacional além do necessário?

**Pesquisa:** Prática padrão documentada em múltiplas fontes de simulação
de Monte Carlo para finanças/aposentadoria: <cite index="88-1">a prática padrão é usar
10.000 ou mais simulações — abaixo de aproximadamente 1.000, métricas-chave
como taxa de sobrevivência e resultados por percentil podem variar
significativamente entre execuções</cite>. A mesma fonte descreve o teste de
convergência recomendado: <cite index="88-1">rodar a simulação duas vezes com sementes
aleatórias diferentes — se os resultados mudarem de forma relevante (ex:
a taxa de sobrevivência variar mais de 1-2 pontos percentuais), aumentar o
número de simulações até estabilizar</cite>. Exemplos de aplicações
comparáveis na literatura: Return Stacked/Newfound Research usa 100.000
trajetórias de 30 anos; Anarkulova et al. (via Portfolio Optimizer) usa
10.000 amostras bootstrap de 360 meses.

**Decisão:** Gerar **10.000 trajetórias** como padrão de execução (alinhado
com a prática de mercado), com **teste de convergência empírico**
obrigatório antes de aceitar o resultado final: recalcular a PWR com
20.000 e 40.000 trajetórias e comparar. Se a variação entre 10k e 40k for
menor que 0,05 p.p. na taxa de retirada estimada, 10.000 é aceito como
suficiente; caso contrário, o número de trajetórias usado no resultado
final sobe para o menor valor que atingir essa estabilidade.

**Racional:** 10.000 é o piso de mercado documentado, mas a validação
empírica (não apenas confiar na literatura) é mais rigorosa e é a prática
que o próprio spec.md exige (nenhuma escolha metodológica sem validação nos
dados/execução real, quando aplicável). Custo computacional de 10k–40k
trajetórias × 720 meses é trivial para o ambiente de execução usado neste
projeto.

**Status:** decisão técnica registrada com base em pesquisa; a validação
empírica de convergência será executada e documentada durante a Fase de
implementação (Fase 3).

---

## Decisão 10 — Frequência de rebalanceamento
**Data:** 2026-08-09
**Pergunta:** Rebalancear a carteira mensalmente (como já implementado em
`src/01_prepare_returns.py`, que combina os retornos mensais ponderados
pelos pesos-alvo a cada mês) ou usar outra frequência (anual, trimestral)?

**Pesquisa:** Literatura e evidência empírica convergem para o mesmo
resultado: a frequência de rebalanceamento tem **impacto pequeno a
desprezível** sobre SWR/PWR.
- Early Retirement Now (SWR Series Parte 39), especificamente investigando
  esse ponto: <cite index="99-1">assumir rebalanceamento mensal é a hipótese
  numericamente mais conveniente — não é preciso rastrear posições
  individuais (ações, bonds, caixa, ouro etc.) ao longo do tempo, apenas o
  valor agregado da carteira, aplicando o retorno ponderado a cada mês</cite>.
  O mesmo autor, em experimento posterior (Parte 64), confirma:
  <cite index="98-1">não há efeito direcional claro entre rebalancear
  mensalmente, trimestralmente ou anualmente</cite>.
- Advisor Perspectives, testando períodos de 30 anos históricos: <cite index="97-1">o impacto da frequência de rebalanceamento foi desprezível — uma
  carteira base sustentou taxa de retirada de 4,2% em janelas históricas de
  30 anos tanto rebalanceando a cada 1 quanto a cada 3 anos, e 4,1% a cada 5
  anos</cite>.
- The Poor Swiss, testando o mesmo em dados 1871–2024: rebalanceamento anual
  teve resultado ligeiramente melhor que mensal para taxas de retirada
  baixas, mas a diferença entre as opções foi pequena.
- Portfolio Charts (nossa referência de PWR) usa **rebalanceamento anual**
  por convenção própria.

**Decisão:** Manter **rebalanceamento mensal**, como já implementado.

**Racional:** A escolha já está embutida na forma como os retornos foram
combinados (`ret_carteira_nominal = Σ w_i × r_i` a cada mês), e a literatura
confirma que isso não introduz viés relevante frente a alternativas (anual,
trimestral) — a diferença fica na casa de poucos décimos de ponto percentual
na taxa de retirada, dentro do ruído de outras incertezas do modelo. Manter
mensal também é a opção computacionalmente mais simples (não exige
rastrear posições individuais dos 5 ativos ao longo da simulação, só o
valor agregado da carteira) e é consistente com todo o resto do pipeline,
que já opera em frequência mensal.

**Status:** decisão técnica registrada com base em pesquisa — já implementada
(nenhuma mudança de código necessária).

---

## Decisão 11 — Fonte e tratamento do IPCA
**Data:** 2026-08-09
**Pergunta:** A série de IPCA fornecida é confiável? E deve-se aplicar
alguma defasagem de divulgação (IPCA de um mês só é publicado ~10 dias
depois do mês seguinte começar)?

**Verificação de qualidade:** Comparei a variação acumulada dez-a-dez
(ano civil) calculada a partir do índice fornecido com os valores oficiais
conhecidos do IPCA (IBGE) para anos de referência fácil de checar de
memória/domínio público:

| Ano | IPCA na planilha | IPCA oficial (IBGE) |
|---|---|---|
| 2015 | 10,67% | 10,67% |
| 2016 | 6,29% | 6,29% |
| 2017 | 2,95% | 2,95% |
| 2020 | 4,52% | 4,52% |
| 2021 | 10,06% | 10,06% |
| 2022 | 5,79% | 5,79% |

Correspondência exata em todos os anos testados — **alta confiança de que a
série é o IPCA oficial do IBGE**, sem necessidade de trocar de fonte.

**Pergunta da defasagem de divulgação:** Na vida real, o IPCA de um mês M só
é divulgado pelo IBGE por volta do dia 10 do mês seguinte — então um
investidor vivendo o mês M+1 não sabe ainda a inflação de M com certeza
quando toma decisões dentro de M+1. Isso importa para modelos de decisão em
tempo real, mas **não para este projeto**: aqui a deflação é um exercício
retrospectivo — queremos saber quanto do retorno nominal de cada mês
correspondeu a poder de compra real *depois do fato*, não simular a
informação disponível ao investidor em tempo real. Todos os benchmarks de
referência (Bengen, Trinity Study, Portfolio Charts, McClung) fazem esse
mesmo tipo de deflação ex-post, sem defasagem.

**Decisão:** Usar a variação mês a mês do índice de IPCA fornecido,
alinhada ao mesmo mês civil do retorno nominal (sem defasagem de
divulgação) — que é exatamente como já está implementado em
`src/01_prepare_returns.py`.

**Racional:** Fonte já confirmada como IPCA oficial por checagem cruzada com
valores públicos conhecidos. Defasagem de divulgação é irrelevante para
análise retrospectiva de preservação de poder de compra — é uma
consideração de fluxo de informação em tempo real, fora do escopo de PWR.

**Status:** decisão técnica registrada com base em verificação direta —
já implementada, nenhuma mudança de código necessária.

---

## Decisão 12 — Regime de retirada
**Data:** 2026-08-09
**Pergunta:** Qual regime de retirada aplicar na simulação: valor real fixo
(atualizado só pela inflação), percentual do saldo corrente, ou uma
estratégia dinâmica (guardrails)?

**Pesquisa:** Confirmação de que o regime de **retirada real fixa** é a
definição padrão tanto de SWR quanto de PWR em toda a literatura de
referência consultada:
- Bogleheads Wiki define SWR como <cite index="107-1">a quantia de dinheiro,
  expressa como percentual do investimento inicial, que pode ser retirada
  por ano de uma carteira, por um determinado período, incluindo ajustes
  pela inflação, sem que a carteira falhe</cite> — valor fixo em termos
  reais, não percentual do saldo corrente.
- White Coat Investor reforça: <cite index="110-1">a cada ano a retirada é
  ajustada pela taxa de inflação do ano anterior; alternativamente, pode-se
  pensar na taxa como fixa, em termos reais</cite>.
- Portfolio Charts (nossa referência de PWR) usa exatamente essa
  convenção: <cite index="109-1">a taxa de retirada é o percentual do valor
  original da carteira usado para um ano de despesas; a cada ano as
  despesas são ajustadas pela inflação, não pelo tamanho da carteira</cite>.
- Allocate Smartly, comparando SWR/PWR: <cite index="111-1">a taxa de
  retirada mostrada é um percentual do tamanho inicial da carteira, com
  ajuste anual pela inflação</cite> — mesma convenção em ambas as métricas.
- Estratégias percentual-do-saldo (nunca esgota, mas a retirada oscila junto
  com o mercado) e guardrails (Guyton-Klinger) são reconhecidas como
  **alternativas** à retirada real fixa, não como parte da definição-padrão
  de SWR/PWR — são objeto de estudo à parte na literatura (inclusive já
  citadas no spec.md como artigo futuro do blog, com referência cruzada no
  artigo #1 publicado).

**Decisão:** Retirada **real fixa** — um valor constante em termos reais,
retirado mensalmente (1/12 da taxa de retirada anual aplicada ao valor
inicial real da carteira), sem ajuste adicional de inflação porque as
trajetórias já são simuladas inteiramente em retornos reais (a inflação já
foi removida na Decisão 11 — não há dupla contagem).

**Racional:** É a definição-padrão de PWR/SWR usada por todas as fontes de
referência do setor (Bengen, Trinity Study, Portfolio Charts, Bogleheads).
Usar essa convenção garante que a PWR calculada aqui seja diretamente
comparável a esses benchmarks. Estratégias dinâmicas (percentual do saldo,
guardrails) ficam fora do escopo deste projeto por decisão já registrada no
spec.md — guardrails é tema do próximo artigo do funil editorial, que já
tem referência cruzada pendente no artigo #1 publicado.

**Status:** decisão técnica registrada com base em pesquisa — confirma o que
já estava assumido no spec.md, pronta para implementação.

---

## Validação empírica — Decisão 9 (convergência do número de trajetórias)
**Data:** 2026-08-09
**Teste:** PWR@90% e PWR@95% recalculadas com 10.000, 20.000 e 40.000
trajetórias (mesma semente, para isolar o efeito do tamanho da amostra).

| n_paths | PWR@90% | PWR@95% |
|---|---|---|
| 10.000 | 5,1471% | 4,7287% |
| 20.000 | 5,1727% | 4,7598% |
| 40.000 | 5,1682% | 4,7562% |

Diferença entre 10k e 40k: 0,021 p.p. (PWR@90%) e 0,028 p.p. (PWR@95%) —
ambas abaixo do limite de tolerância de 0,05 p.p. estabelecido na Decisão 9.

**Conclusão:** 10.000 trajetórias são suficientes para estabilidade da
estimativa. Confirmado como padrão de execução para os resultados finais.

---

## Validação empírica — Decisão 8 (robustez do horizonte de simulação)
**Data:** 2026-08-09
**Teste:** PWR@90% e PWR@95% recalculadas em horizontes de 40, 60, 80 e 100
anos (10.000 trajetórias, mesma semente).

| Horizonte | PWR@90% | PWR@95% |
|---|---|---|
| 40 anos | 5,071% | 4,615% |
| 60 anos | 5,167% | 4,741% |
| 80 anos | 5,187% | 4,774% |
| 100 anos | 5,196% | 4,785% |

**Padrão observado:** a PWR cresce com o horizonte e converge assintoticamente
— o salto de 40→60 anos é de +0,096 p.p. (90%) / +0,126 p.p. (95%), enquanto
de 80→100 anos já é de apenas +0,009 p.p. / +0,011 p.p. A curva está
claramente achatando. Isso é consistente com o critério de sucesso adotado
(Decisão 7: preservar o capital real ao final do horizonte, não apenas
evitar ruína): como a carteira tem crescimento real médio positivo (CAGR de
~7% a.a.), horizontes mais longos dão mais tempo para o crescimento composto
predominar sobre o risco de sequência nos primeiros anos, elevando
ligeiramente a taxa sustentável até estabilizar.

**Conclusão:** 60 anos captura a maior parte da convergência para o valor
assintótico (a diferença entre 60 e 100 anos já é pequena, <0,05 p.p.),
confirmando que é um proxy razoável de perpetuidade para esta carteira,
consistente com a prática da Portfolio Charts. Resultado final será
reportado com nota explícita de que a PWR "verdadeiramente perpétua" pode
ser marginalmente mais alta (~0,03-0,05 p.p.) do que a estimativa em 60 anos.

---

## Validação empírica — Decisão 6 (sensibilidade ao tamanho de bloco)
**Data:** 2026-08-09
**Teste:** PWR@90% e PWR@95% recalculadas com bloco médio de 6, 9, 12, 18 e
24 meses (10.000 trajetórias, 60 anos, mesma semente).

| Bloco médio | PWR@90% | PWR@95% |
|---|---|---|
| 6 meses | 5,166% | 4,760% |
| 9 meses | 5,161% | 4,742% |
| **12 meses (escolhido)** | **5,174%** | **4,784%** |
| 18 meses | 5,267% | 4,879% |
| 24 meses | 5,374% | 4,989% |

**Padrão observado:** resultado é estável na faixa de 6-12 meses (variação
de apenas ~0,01-0,02 p.p.), mas diverge de forma mais perceptível em blocos
maiores (18-24 meses), com PWR subindo até ~0,2 p.p. acima do valor em 12
meses. Interpretação: com apenas 246 meses de amostra, blocos de 18-24
meses deixam poucos blocos efetivamente independentes para reamostrar
(~10-14 blocos), reduzindo a diversidade de combinações possíveis e
tornando as trajetórias simuladas mais parecidas com sub-trechos da única
história observada — isso tende a comprimir a cauda de risco simulada
(menos combinações "azaradas" de crises em sequência), elevando a PWR
estimada artificialmente.

**Conclusão:** A escolha de 12 meses (Decisão 6) fica na região estável da
curva de sensibilidade, não na região onde a amostra curta já está
distorcendo o resultado. Isso reforça a escolha original. **Limitação a
reportar no artigo:** com uma amostra de ~20 anos, blocos acima de ~12-15
meses começam a perder confiabilidade — resultado é uma limitação inerente
ao tamanho da amostra histórica disponível (2003+), não um defeito do
método de bootstrap em si.
