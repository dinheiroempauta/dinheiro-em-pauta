# Interpretações — leituras e explicações já validadas

Análises textuais dos indicadores/gráficos desta pasta, geradas durante
exploração com o usuário. Diferente de `decisions.md` (decisões
metodológicas de *como calcular*), este arquivo guarda *o que os números
significam* — material que pode alimentar diretamente o texto do artigo
futuro.

## Ulcer Index — nominal vs. real, por tamanho de janela

**Gráfico:** `graficos/ulcer-funil-percentis.html` (funil de percentis
p5–p95/p20–p80, mediana, pior/melhor caso, toggle nominal/real).

### Formato geral: sobe, atinge um pico entre 8-10 anos, depois cede

| | Mediana 1 ano | Pico (ano) | Mediana 15 anos |
|---|---|---|---|
| Nominal | 0,59 | 1,36 (ano 8) | 1,21 |
| Real | 1,13 | 3,88 (ano 10) | 3,39 |

O Ulcer não cresce indefinidamente com o tempo — acumula "dor"
(profundidade × duração de drawdowns) até um ponto, depois a mediana
relaxa porque a janela passa a incluir mais anos recentes saudáveis
(2023–2026), diluindo a dor histórica de 2008/2020/2021-22.

### Cauda longa em janelas curtas = assinatura de crise pontual

Em janelas de 1 ano, a mediana real é 1,13 mas o p95 é 5,51 e o máximo é
11,29 — quase 10x a mediana. Distribuição bem assimétrica: a maioria dos
anos individuais foi tranquila, uma fração pequena (anos que capturam
2008 e 2020) foi extremamente dolorosa.

Conforme a janela cresce, essa assimetria desaparece: em 10 anos, mediana
real = 3,88 e p95 = 4,37 — a distância entre "típico" e "pior caso
extremo" praticamente some.

**Mensagem central do gráfico:** quanto mais tempo investido, menos a
experiência do investidor depende de "sorte de timing" e mais ela se
aproxima do comportamento típico da carteira.

### Real sistematicamente maior que nominal, gap cresce até 10 anos

| Anos | Gap mediana (real − nominal) |
|---|---|
| 1 | 0,54 |
| 5 | 0,94 |
| 10 | 2,56 (máximo) |
| 15 | 2,18 |

O gap não é constante — cresce até os 10 anos e depois encolhe um pouco,
no mesmo formato de sino que cada série tem isoladamente. Inflação
corrosiva precisa de tempo para se acumular e criar "dor real" que o
nominal não vê — mas depois de um certo ponto, o mesmo efeito de diluição
por anos bons recentes que afeta a mediana isolada também afeta o gap
entre as duas séries.

**Causa raiz do gap, identificada nos dados brutos:** o surto
inflacionário de 2021-2022 (IPCA acumulado de 16,4% nesses dois anos,
contra média histórica de ~0,5-0,6%/mês). Em janelas de 10 anos
terminando entre dez/2021 e jun/2022, o drawdown máximo **nominal** mal
se move (-6,6% → -6,6%), mas o **real** quase dobra (-6,9% → -12,3%). A
carteira em preço de mercado não caiu muito — mas como a inflação corria
muito mais rápido que o retorno nominal, o poder de compra afundou. Meses
com retorno nominal positivo (ex: +1,1% em mar/2022) tiveram retorno real
negativo (-0,5%) porque a inflação do mês (1,6%) consumiu o ganho
inteiro.

### Nominal em 9-10 anos: salto de p50 (~1,3) para p80 (~3,1)

Indica um grupo bem definido de ~20% das janelas (as que pegam a crise de
2008 inteira) com Ulcer muito mais alto que a maioria — quase bimodal
entre "peguei uma crise séria" e "não peguei". O salto é bem mais suave
nas janelas de 12-15 anos, porque nelas quase todas as janelas já incluem
alguma crise — o grupo "sortudo" desaparece.

### Síntese para o artigo

O Ulcer Index mostra dois efeitos simultâneos e complementares:
1. Tempo reduz a dependência de sorte de timing (a banda de percentis
   encolhe conforme a janela cresce).
2. A inflação tem um efeito cumulativo de dor que só aparece plenamente
   na série real, quase invisível na nominal — o gap entre as duas é a
   evidência visual mais direta de por que "olhar só para o nominal" é
   enganoso para quem vive de renda.

## Drawdown máximo e tempo de recuperação — a trajetória real completa

**Gráficos:** `graficos/drawdown-underwater.html` (underwater — distância
ao pico anterior, mês a mês, série completa 2006-2026, nominal e real
juntos) e `graficos/drawdown-profundidade-x-duracao.html` (dispersão
profundidade x meses até recuperar, um ponto por crise). Os dois usam a
mesma numeração cronológica de episódios (queda ≥ 5% do pico), permitindo
cruzar as duas visualizações pelo número do badge.

### O piso da carteira inteira é sempre o mesmo evento: 2008

Drawdown mediano por tamanho de janela para de piorar a partir de ~8
anos e estaciona em **-15% nominal / -17% real** — não porque não haja
dados de janelas maiores, mas porque **nenhuma outra crise da história
da carteira chega perto da profundidade de 2008**. Qualquer janela de 8+
anos já tem chance de capturar a crise inteira, então o "pior caso"
satura nesse valor.

### Tempo de recuperação real dispara em relação ao nominal

| | Mediana (1 ano) | Mediana (janela longa) |
|---|---|---|
| Nominal | 1 mês | 2 meses (estável) |
| Real | 2 meses | 17-20 meses |

A recuperação nominal é rápida e quase não muda com o tamanho da janela.
A real dispara pra 17-20 meses assim que a janela é grande o bastante
pra capturar uma crise "de verdade" — o mesmo fenômeno do Ulcer Index
(seção anterior), só que medido em unidade mais concreta (meses, não um
índice abstrato).

### Os 7 episódios identificados (queda ≥ 5% do pico), com contexto histórico

Numeração cronológica usada nos dois gráficos:

| Nº | Data (fundo) | Série | Queda | Recuperação | Contexto histórico |
|---|---|---|---|---|---|
| 1 | out/2008 | Nominal | -14,8% | 10 meses | Crise financeira global (colapso do Lehman Brothers) |
| 2 | out/2008 | Real | -17,1% | 17 meses | Crise financeira global (colapso do Lehman Brothers) |
| 3 | jan/2015 | Real | -5,7% | 2 meses | Recessão + Lava Jato + "tarifaço" (reajuste de tarifas públicas) |
| 4 | jan/2016 | Real | -6,2% | 7 meses | Crise política (processo de impeachment) + recessão + rating rebaixado |
| 5 | mar/2020 | Nominal | -6,6% | 2 meses | Crash da Covid-19 |
| 6 | mar/2020 | Real | -6,9% | 2 meses | Crash da Covid-19 |
| 7 | jun/2022 | Real | -12,3% | 20 meses | Alta de juros global + guerra na Ucrânia + inflação recorde no Brasil |

**Como o contexto foi identificado:** cruzando a data do fundo de cada
episódio com o desempenho dos 5 ativos individuais em
`base_consolidada.csv` naquele mês específico. Confirmações encontradas:
- **Out/2008:** `ret_vwra11` (ações globais) -11,6% e `ret_divo11`
  (dividendos BR) -20,2% no mês — colapso generalizado, assinatura
  clássica de crise financeira sistêmica.
- **Jan/2015:** `ret_divo11` -11,2% e IPCA do mês em 1,24% (bem acima da
  média histórica de ~0,5-0,6%) — queda de mercado E inflação alta ao
  mesmo tempo, coerente com o "tarifaço" (reajuste de tarifas públicas
  no início do 2º mandato Dilma) somado à deterioração fiscal/Lava Jato.
- **Jan/2016:** `ret_divo11` -9,6% — mercado brasileiro no fundo do
  pessimismo do processo de impeachment e da recessão.
- **Mar/2020:** `ret_divo11` -25,6% no mês — o pior mês individual de
  qualquer ativo em toda a série, assinatura do crash da Covid-19.
- **Jun/2022 (fundo da crise que começou em mai/2021):** `ret_vwra11`
  negativo em 5 dos 6 meses de jan-jun/2022 (guerra na Ucrânia começou
  fev/2022) e IPCA elevado ao longo de todo o período — combinação de
  aperto monetário global (alta de juros) e inflação doméstica recorde.

### Profundidade não prediz duração (insight do gráfico de dispersão)

A crise de 2022 real (nº 7) não é a mais profunda (-12,3%, contra -17,1%
de 2008), mas é disparada a mais demorada de recuperar (20 meses, contra
17 de 2008). Reforça, com outro indicador, a mesma conclusão do Ulcer:
inflação alta prolonga sofrimento de um jeito que profundidade de queda
de mercado sozinha não captura.

### Síntese para o artigo

Drawdown e tempo de recuperação contam a mesma história do Ulcer Index de
um jeito mais concreto e "contável": a crise de 2008 é o evento que
define o pior cenário de mercado da carteira em qualquer horizonte, e a
inflação de 2021-2022 é o que torna a recuperação ainda mais lenta
quando medida em termos reais — mesmo sem ser, isoladamente, a queda
mais profunda.
