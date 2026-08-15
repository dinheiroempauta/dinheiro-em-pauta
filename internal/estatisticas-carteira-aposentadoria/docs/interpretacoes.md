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

## Sharpe vs. Sortino — retorno ajustado ao risco, por tamanho de janela

**Gráfico:** `graficos/sharpe-sortino-comparativo.html` (mediana + faixa
p10–p90 das duas métricas sobrepostas no mesmo eixo, toggle nominal/real).

### Sortino consistentemente acima de Sharpe, em todos os tamanhos de janela

| | Mediana 1 ano | Mediana 8 anos (pico) | Mediana 18 anos |
|---|---|---|---|
| Sharpe nominal | 0,59 | 0,71 | 0,41 |
| Sortino nominal | 1,45 | 1,48 | 0,65 |

O gap é estrutural, não um artefato de amostra: Sortino só penaliza a
volatilidade dos meses *negativos* no denominador, enquanto Sharpe penaliza
o desvio-padrão completo (positivo e negativo). Como a carteira tem mais
meses positivos que negativos e os meses positivos tendem a ser mais
dispersos entre si do que os negativos, o denominador do Sortino fica menor
— o índice sobe mesmo com o numerador (retorno em excesso ao CDI)
idêntico. Isso não é "a carteira ficando melhor", é a métrica descontando
menos volatilidade "boa".

### As duas convergem quando a janela cresce

Em janelas de 1 ano o gap Sortino−Sharpe é de ~0,86; em 18 anos cai para
~0,24. Faz sentido: com mais meses na janela, a proporção de meses
positivos/negativos se estabiliza perto da média de longo prazo da
carteira, então a diferença entre "penalizar tudo" e "penalizar só a
queda" fica menos extrema — os dois desvios-padrão (completo e downside)
convergem relativamente.

### O mesmo formato de "sino" do Ulcer aparece aqui, espelhado

Sharpe e Sortino sobem de 1 para ~7-8 anos, platôs, depois caem
gradualmente até 18 anos — o inverso do formato do Ulcer (que sobe até um
pico e desce). Faz sentido: quando o Ulcer (dor acumulada) está baixo, o
retorno ajustado ao risco tende a estar alto, e vice-versa — são a mesma
característica da carteira vista por ângulos opostos.

### Nominal vs. real: gap pequeno e estável

Diferente do Ulcer (onde o gap nominal/real dispara a partir de
dez/2021), aqui a diferença entre Sharpe nominal e real é pequena e
consistente (~0,03-0,05 na mediana, em quase todos os tamanhos de
janela) — porque tanto o numerador (retorno em excesso) quanto o
denominador (volatilidade) já embutem o efeito da inflação nos dois
lados da conta (carteira e CDI), então o Fisher praticamente se cancela
no índice, ao contrário do drawdown/Ulcer, onde só o numerador (o
"buraco" de capital) é afetado pela inflação, não o denominador.

### Síntese para o artigo

Sortino não é "melhor" que Sharpe, é uma lente diferente: mede
especificamente o retorno conquistado por unidade de risco de *perda*, não
de oscilação em geral. A carteira historicamente entrega Sortino
2-3x o Sharpe em janelas curtas, convergindo para ~1,5x em janelas de 18
anos — um jeito concreto de mostrar que boa parte da "volatilidade" da
carteira é oscilação para cima, não risco de perda.

## Volatilidade anualizada — convergência rápida, quase sem gap nominal/real

**Gráfico:** `graficos/volatilidade-funil-percentis.html` (mesmo formato
de funil do CAGR/Ulcer: bandas p5–p95/p20–p80, mediana, pior/melhor caso,
toggle Nominal/Real).

### Converge muito mais rápido que CAGR e Ulcer

| | Mediana 1 ano | Mediana 6-7 anos | Mediana 18 anos |
|---|---|---|---|
| Nominal | 5,4% | 6,4% | 6,5% |
| Real | 5,5% | 6,7% | 6,6% |

Enquanto CAGR e Ulcer continuam se movendo até 8-10 anos de janela, a
volatilidade anualizada já está essencialmente estabilizada em 6-7 anos.
Faz sentido: volatilidade é uma média de desvios *mês a mês* — regride à
média assim que a janela captura um número razoável de ciclos de
mercado, sem precisar "esperar" a janela absorver um evento raro completo
(como um drawdown ou uma recuperação lenta).

### O funil fecha por regressão à média mecânica, não por a carteira "ficar mais segura"

O pior caso observado (linha tracejada de baixo) começa em ~12% no ano 1
(um ano isolado que capturou um período turbulento inteiro) e cai
continuamente até convergir com a mediana perto de 6,5% em 18 anos. Isso
não significa que a carteira "amadureceu" ou ficou menos arriscada — é
o mesmo efeito estatístico documentado no CAGR e no Ulcer: quanto maior a
janela, menos espaço há para um único ano ruim dominar a média da janela
inteira. O nível de risco *estrutural* da carteira (a mediana) já estava
definido desde cedo; o que muda é só a variabilidade *entre* janelas.

### Nominal e real praticamente coincidem — ao contrário do Ulcer/drawdown

Diferente do Ulcer (gap grande entre nominal e real, especialmente após
2021-2022), aqui as duas curvas ficam quase sobrepostas (diferença
mediana de 0,1-0,3pp em todos os tamanhos de janela). A explicação é
metodológica: volatilidade mede dispersão de retornos mês a mês, e a
inflação mensal no Brasil, mesmo em picos, é muito menos volátil do que
os retornos de renda variável da carteira — subtrair/dividir por ela via
Fisher desloca o *nível* de cada retorno mensal, mas quase não muda o
quanto os retornos se dispersam entre si. Já o drawdown e o Ulcer são
sensíveis ao *nível acumulado* de capital, onde a inflação combinada mês
após mês tem efeito cumulativo grande.

### Síntese para o artigo

Volatilidade é o indicador mais "bem comportado" do conjunto até agora:
converge rápido, é praticamente insensível a nominal vs. real, e não tem
os saltos de composição de amostra vistos no Ulcer/Sortino em janelas
longas. Bom contraponto didático a esses outros gráficos — mostra que nem
todo indicador de risco "sofre" da mesma forma com o efeito inflacionário
de 2021-2022; a inflação distorce o *acumulado* de capital, não a
*dispersão* dos retornos mensais.

## Pior mês / Melhor mês — extremos individuais, não médias

**Gráfico:** `graficos/pior-melhor-mes-comparativo.html` (mediana + faixa
p10–p90 das duas métricas sobrepostas, toggle nominal/real).

### Formato de "escada", não de curva suave

Diferente de todos os indicadores anteriores, as linhas de mediana aqui
sobem/descem em degraus, não em curva contínua. Faz sentido: "pior mês"
é o valor de um único mês específico dentro da janela — quando a janela
cresce o suficiente para *sempre* incluir o mesmo mês recorde (ex:
out/2008), a mediana trava naquele valor até a janela crescer o
suficiente para incluir um evento ainda pior (ou até nenhuma janela ficar
de fora dele). Isso é o oposto de CAGR/volatilidade, que são médias e
por isso suavizam.

### Da janela de 15 anos em diante, toda janela contém o mesmo pior mês

Em janelas de 15 a 18 anos, pior mês nominal = -7,32% (real: -7,73%) em
**todas** as janelas daquele tamanho (min = max = mediana) — ou seja, a
partir de 15 anos de horizonte, qualquer período de 15+ anos na história
da carteira necessariamente atravessou o mês mais catastrófico já
registrado (out/2008). Isso é uma forma concreta de mostrar que
horizontes longos não "escapam" do pior evento histórico, só diluem seu
peso relativo no retorno total.

### Assimetria: o melhor mês converge mais cedo que o pior

O melhor mês nominal já trava em 7,06% (o teto histórico) a partir de
~11 anos de janela, enquanto o pior mês só trava definitivamente em 15
anos. Isso acontece porque o evento de pior mês (out/2008) é anterior ao
evento de melhor mês na série — janelas precisam ser maiores para
"alcançar" 2008 a partir do início dos dados (jan/2006) do que para
alcançar o melhor mês, que ocorreu depois.

### Síntese para o artigo

Bom gráfico para desmistificar a ideia de que "ficar mais tempo investido
elimina o risco de eventos extremos" — não elimina, só garante que você
vai *ver* o extremo passar pela sua carteira em algum momento se o
horizonte for longo o bastante. O que muda com o tempo não é a
possibilidade do extremo acontecer, é o quanto ele pesa no resultado
final (assunto já coberto por CAGR/drawdown/Ulcer).

## % de meses positivos vs. negativos — a assimetria estrutural da carteira

**Gráfico:** `graficos/pct-positivos-negativos.html` (mediana + faixa
p10–p90, sem toggle nominal/real — o sinal do retorno mensal quase nunca
muda entre nominal e real).

### Converge rápido para ~71% positivos / 29% negativos

Em janelas de 1 ano a mediana já está em 75%/25%, e por volta de 6-7 anos
estabiliza perto de 72%/28%, terminando em 71,3%/28,7% aos 18 anos. Ou
seja: historicamente, a carteira teve um mês negativo a cada ~3,5 meses
positivos — quase 3 em cada 4 meses fecharam no azul.

### A faixa de incerteza é enorme em janelas curtas

Em janelas de 1 ano, o pior caso observado teve 0% de meses positivos e o
melhor teve 100% — ou seja, já existiu um ano inteiro só de meses
negativos e um ano inteiro só de meses positivos na história da carteira.
A faixa central (p10–p90) também é larga: de 50% a 92% de meses positivos
num único ano. Essa variabilidade desaparece quase toda até 5-6 anos de
janela.

### Síntese para o artigo

Esse é o indicador mais simples e mais visceral do conjunto: praticamente
3 em cada 4 meses da carteira historicamente "deram certo". É um contraponto
útil ao lado do Ulcer/drawdown (que enfatizam os eventos raros e
dolorosos) — lembra que a experiência mês a mês de quem segura a carteira
é predominantemente positiva, mesmo em uma carteira que passou por 2008,
2015-16, 2020 e 2021-22.

## VaR / CVaR (5%) — quantificando a cauda de perda

**Gráfico:** `graficos/var-cvar-comparativo.html` (mediana + faixa
p10–p90 das duas métricas sobrepostas, toggle nominal/real).

### CVaR sempre mais negativo que VaR, por definição — e o gap entre eles é o "tamanho do desastre"

VaR nominal converge para -1,7% (18 anos) e CVaR para -2,9% no mesmo
horizonte — um gap de 1,2pp. Isso não é coincidência: VaR marca o limiar
("1 em cada 20 meses foi pior que isso"), CVaR é a média de tudo que
ficou *além* desse limiar. Quando o gap é pequeno, a cauda é "bem
comportada" (perdas na cauda são parecidas com o próprio limiar). Quando o
gap é grande — como em janelas de 1-5 anos, onde CVaR real chega a -6% —
a cauda é "pesada": os piores 5% dos meses incluem eventos muito piores
que o limiar de 5%, não só levemente piores.

### O gap encolhe conforme a janela cresce, mas não desaparece

Em janelas de 1 ano, VaR nominal mediano é -1,1% e CVaR é -1,7% (gap de
0,6pp) — mas isso é enganoso, porque com poucos meses na janela a
"cauda de 5%" às vezes é literalmente um único mês, então VaR e CVaR
colapsam no mesmo valor por construção. À medida que a janela cresce e
há mais meses para formar a cauda, o gap se estabiliza em torno de 1,2pp
(nominal) / 1,2pp (real) a partir de ~10 anos — esse é o gap "estrutural"
de longo prazo, não um artefato de amostra pequena.

### Nominal vs. real: gap parecido ao do CAGR/pior-mês, não ao do Ulcer

VaR real (-2,3% aos 18 anos) é mais negativo que o nominal (-1,7%) por
~0,6pp, e o mesmo vale para CVaR (-3,5% real vs -2,9% nominal) — um gap
consistente de magnitude parecida com o observado no CAGR e no pior/melhor
mês (a inflação desloca o *nível* de cada retorno mensal individual, que é
exatamente o que VaR/CVaR medem), diferente do Ulcer/drawdown, onde o gap
nominal/real dispara por causa do efeito acumulado no capital.

### Síntese para o artigo

VaR responde "qual é o pior cenário típico" (o limiar dos 5% piores
meses); CVaR responde "se eu cair nesse pior cenário, quão ruim
costuma ser, em média". Juntos contam uma história mais completa que
qualquer um sozinho: a carteira historicamente teve um piso de cauda em
torno de -1,7%/mês (VaR nominal), mas quando esse piso é rompido, a perda
média nesses episódios foi de -2,9%/mês (CVaR nominal) — quase o dobro.
É a métrica mais direta do conjunto para responder "o que devo esperar no
mês ruim de verdade, não só num mês qualquer abaixo da média".

## Skewness / Curtose — o formato da distribuição de retornos mensais

**Gráfico:** `graficos/skewness-curtose-comparativo.html` (mediana +
faixa p10–p90 das duas métricas sobrepostas, toggle nominal/real; note a
escala: são números adimensionais, não percentuais).

### Skewness fica levemente negativa e estável (~-0,4 em 18 anos)

A mediana de skewness nominal cai de -0,15 (1 ano) para -0,43 (18 anos),
oscilando perto de zero em janelas intermediárias. Um valor negativo
confirma numericamente algo já visto em outros gráficos: a cauda de
perdas é um pouco mais longa/extrema que a cauda de ganhos (o pior mês,
-7,3%, é mais extremo em módulo que o melhor mês, +7,1%, e há mais
espaço para eventos catastróficos isolados do que para "milagres"
isolados). Ainda assim, -0,4 é uma assimetria moderada, não extrema — a
carteira não tem uma distribuição fortemente enviesada.

### Curtose sobe de perto de zero para +1,7: caudas mais "gordas" que o normal, mas só nas janelas longas

Curtose nominal começa em -0,50 (1 ano — mais achatada que a normal,
pouco espaço pra eventos extremos dentro de um único ano) e sobe para
+1,70 em 18 anos (mais "pontuda" e com caudas mais pesadas que a normal).
O salto mais visível acontece entre 14 e 15 anos, subindo de ~0,80 para
~1,59 — mesmo tipo de artefato de composição de amostra já documentado no
Ulcer/Sortino (a partir de 15 anos, toda janela passa a conter o mesmo
evento extremo de 2008, o que empurra a curtose para cima de forma
degrau, não gradual).

### Skewness e curtose contam a mesma história por ângulos diferentes

Ambos captam o mesmo fenômeno de fundo — a carteira tem eventos raros e
extremos concentrados no lado das perdas (2008, 2020, 2021-22) — mas
skewness mede a *direção* dessa assimetria (perdas mais extremas que
ganhos) e curtose mede a *intensidade* geral de eventos extremos
(independente da direção). A curtose sobe de forma mais acentuada que a
skewness desce, sugerindo que o principal efeito, ao alongar a janela, é
"a carteira passa a mostrar mais eventos extremos no total", mais do que
"os extremos ficam mais desbalanceados para o lado negativo".

### Síntese para o artigo

Esses dois indicadores são os mais técnicos do conjunto e o resultado
prático deles é simples: a distribuição de retornos mensais da carteira
não é uma "curva de sino" bem comportada — tem cauda de perdas um pouco
mais pesada que a de ganhos (skewness negativa) e, em horizontes longos o
bastante para capturar 2008, apresenta mais eventos extremos que uma
distribuição normal preveria (curtose positiva). Isso reforça, de forma
matemática, por que métricas como VaR/CVaR (que olham direto pra cauda)
são mais informativas que só olhar média e desvio-padrão.

## Correlação entre os 5 ativos — o "porquê" estatístico da diversificação

**Gráfico:** `graficos/correlacao-ativos-heatmap.html` (heatmap 5×5,
escala divergente vermelho–branco–azul, período completo, sem toggle
nominal/real e sem variação por tamanho de janela — é uma matriz única).

### Nenhum par de ativos tem correlação forte na mesma direção

A correlação mais alta da matriz é DIVO11 × B5P211 (+0,40) — moderada,
não forte. Todos os outros pares ficam abaixo de 0,26 em módulo. Não há
nenhum par redundante (correlação muito próxima de 1) nem nenhum par que
sempre se move junto.

### GOLD11 é o ativo mais "contrário" da carteira

Ouro tem correlação negativa com 3 dos outros 4 ativos: DIVO11 (-0,40,
a correlação mais negativa da matriz), B5P211 (-0,18) e correlação
essencialmente nula com CDIB11 (0,00). Só com VWRA11 tem correlação
positiva (+0,26), e mesmo assim moderada. Isso confirma numericamente o
papel clássico do ouro como ativo de descorrelação/proteção numa
carteira multi-classe.

### CDIB11 (renda fixa pós-fixada) funciona como o ativo mais "neutro"

CDIB11 tem correlação próxima de zero com quase todos os outros ativos
(-0,16 com VWRA11, -0,00 com DIVO11, 0,00 com GOLD11), com exceção de uma
correlação moderada positiva com B5P211 (+0,21, esperado — os dois são
instrumentos de renda fixa/CDI, ainda que com mecânicas diferentes). Isso
é consistente com o papel de "âncora" de baixa volatilidade e baixo
comovimento que a renda fixa pós-fixada deveria exercer numa carteira.

### VWRA11 e DIVO11 (as duas pernas de renda variável) quase não se correlacionam

Correlação de apenas -0,04 entre VWRA11 (ações globais) e DIVO11
(dividendos Brasil) — praticamente independentes uma da outra, apesar de
ambas serem renda variável. Faz sentido geograficamente: um é
exposição global diversificada, o outro é concentrado em ações
brasileiras pagadoras de dividendos, dois mercados com dinâmicas bem
diferentes.

### Síntese para o artigo

A matriz de correlação é o "porquê" estatístico por trás de todos os
gráficos anteriores: os 5 ativos raramente sobem ou caem juntos, o que é
exatamente o que permite à carteira ter os Ulcer Index/drawdowns
moderados e o Sharpe/Sortino consistentemente positivos vistos nos
gráficos anteriores. Nenhum ativo é redundante do ponto de vista de
diversificação — cada um contribui um perfil de comovimento distinto, com
destaque para o ouro como o mais "contrário" e o CDI como o mais
"neutro".

## Correlação rolante (24 vs. 36 meses) — a diversificação varia no tempo

**Gráfico:** `graficos/correlacao-rolante-24-36.html` (correlação de
Pearson em janela deslizante mês a mês, seletor de par de ativos, 24 e
36 meses sobrepostos, faixas de crise marcadas). Complementa a matriz
estática da seção anterior — aqui o eixo é *tempo civil*, não tempo de
investimento.

### A correlação está longe de ser constante — varia de -0,5 a +0,8 ao longo do tempo

Olhando VWRA11×GOLD11: a correlação (24 meses) passa de +0,60 em 2008,
despenca para -0,45 entre 2009-2011, sobe gradualmente até +0,80 em
2018-2019, cai de novo para perto de 0 em 2024. A matriz estática da
seção anterior (+0,26 no período completo) é uma média que esconde essa
variação enorme — dois investidores que olharam a correlação em anos
diferentes teriam tirado conclusões opostas sobre o papel do ouro na
carteira.

### A correlação não sobe de forma consistente durante crises — depende do par e do tipo de crise

Em 2008 (crise financeira), VWRA11×GOLD11 estava em ~0,55-0,60 — ouro não
funcionou como proteção nesse episódio específico, contrariando a
expectativa comum. Já em DIVO11×B5P211, a correlação cai bruscamente
durante 2015-2017 (chegando a ficar negativa), justamente o período de
recessão + Lava Jato + impeachment — os dois ativos brasileiros se
descolaram um do outro nesse episódio doméstico, apesar de normalmente
andarem juntos (+0,4 na média do período completo). Não há um padrão
único de "toda correlação sobe em crise"; cada par reage de um jeito
dependendo da natureza do evento.

### 24 meses reage mais cedo às mudanças de regime, 36 meses é mais suave — trade-off visível, sem vencedor único

Comparando as duas linhas: em 2010, a janela de 24 meses já mostra
VWRA11×GOLD11 subindo de volta enquanto a de 36 meses ainda está caindo
(porque ainda carrega meses de 2008 na janela). O mesmo padrão se repete
em 2020 e 2022. Por outro lado, a linha de 24 meses tem mais serrilhado
entre os picos — mais difícil separar ruído de sinal num único mês
isolado. Adotamos 24 meses como padrão de discussão (decisão registrada
em `decisions.md`), mas o gráfico mantém as duas linhas visíveis
justamente para deixar claro que a leitura depende dessa escolha
metodológica.

### Síntese para o artigo

A correlação entre ativos não é uma propriedade fixa da carteira — é
dinâmica, e olhar só a média do período completo (matriz estática) pode
esconder tanto momentos de diversificação muito mais forte quanto
momentos em que ativos considerados "descorrelacionados" se moveram
juntos por um tempo. Bom contraponto ao heatmap estático: mostra que a
diversificação é uma aposta estatística de longo prazo, não uma garantia
mês a mês.
