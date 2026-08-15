# Log de decisões — Estatísticas de Comportamento da Carteira

Cada decisão registrada com data, pergunta, resposta e racional. Nada do
que está aqui é aplicado ao código antes de ser registrado.

## 2026-08-15 — Escopo de indicadores da primeira rodada

**Pergunta:** os indicadores "propostos" (Calmar, VaR/CVaR histórico,
skewness/curtose), que não estavam na lista original do usuário, entram
já na primeira rodada ou ficam para depois?

**Decisão:** entram todos já. Lista completa de indicadores da carteira
combinada (nominal e/ou real, ver spec seção 4):
CAGR, volatilidade anualizada, drawdown máximo, tempo de recuperação,
Ulcer Index, Sharpe, Sortino, Calmar, pior mês, melhor mês, % meses
positivos, % meses negativos, VaR histórico, CVaR histórico, skewness,
curtose. Mais matriz de correlação entre os 5 ativos individuais (fora do
loop de janelas).

**Racional:** mesmo esforço de implementação dado que retorno/drawdown/vol
já vão ser calculados; enriquece a análise sem custo extra relevante.

## 2026-08-15 — Taxa livre de risco para Sharpe/Sortino

**Status:** RESOLVIDA.

**Pergunta:** usar `ret_cdib11` (ETF de CDI já presente na base) como proxy
da taxa livre de risco, ou buscar série oficial de CDI/Selic do Bacen?

**Decisão:** usar o CDI oficial fornecido pelo usuário
(`cdi_mensal.csv`, cópia independente do arquivo original), não o ETF.

**Dados recebidos:** `Data` em `MM/AAAA`, `CDI` mensal já em formato de
retorno percentual (string com vírgula decimal, ex: `"1,22%"`). Cobertura
01/2006 a 07/2026 (247 meses), sem lacunas nem duplicatas — superset da
janela da carteira (01/2006 a 06/2026, 246 meses); o mês extra (07/2026)
não é usado.

**Validação feita:** comparado mês a mês contra `ret_cdib11` (o ETF de CDI
que já estava em `retornos_mensais_carteira.csv`). Diferença constante de
+0,012 p.p./mês (CDI oficial sempre um pouco acima do ETF), consistente
com o spread de taxa de administração do ETF — confirma que é a mesma
fonte de fundo, sem inconsistência.

**Racional:** taxa livre de risco "oficial" é mais ortodoxa e defensável
num artigo do que um proxy via ETF com taxa de administração embutida.

**Parsing necessário no código:** trocar vírgula por ponto, remover `%`,
dividir por 100 → retorno mensal decimal, mesma unidade das colunas
`ret_*` da base de retornos.

**Conversão nominal → real:** confirmado por reprodução numérica que
`ret_carteira_real` da base original usa a fórmula de Fisher exata,
`(1+nominal)/(1+ipca) - 1`, não subtração simples (`nominal - ipca`).
A mesma fórmula será usada para deflacionar o CDI (gerar `cdi_real`) e
qualquer outra série nominal→real neste projeto, por consistência.

## 2026-08-15 — Base real vs. nominal para indicadores de risco

**Pergunta:** Sharpe, Sortino, drawdown e Ulcer Index — calcular só sobre
a série real, só sobre a nominal, ou as duas?

**Decisão:** as duas. Sharpe e Sortino nominais usam CDI nominal como
taxa livre de risco; as versões reais usam CDI real (via Fisher, decisão
acima) e a série de retorno real da carteira. Drawdown e Ulcer Index
calculados nas duas séries (real e nominal) sem depender de taxa livre
de risco.

## 2026-08-15 — Tempo de recuperação de drawdown que não recupera dentro da janela

**Decisão:** estender a busca do fim da recuperação além do recorte da
janela, usando a série completa disponível. Se o drawdown daquela janela
não recuperou nem até o fim da série completa (jun/2026), marcar
explicitamente como "não recuperado" (não usar `NaN` silencioso nem
truncar artificialmente no fim da janela).

## 2026-08-15 — Corte de cauda para VaR e CVaR históricos

**Decisão:** 5%. VaR histórico = retorno no percentil 5 dos meses da
janela; CVaR histórico = média dos retornos abaixo desse percentil.
Calculado nominal e real.

## 2026-08-15 — Base para % meses positivos/negativos

**Contexto:** a spec (seção 4) já registrava que este indicador é
"conceito único" (não se calcula nominal e real separadamente), mas não
tinha fixado qual das duas séries usar como base — pendência descoberta
só na hora de implementar (`03_rolling_windows.py`).

**Decisão:** usar a série **nominal**. Racional: "mês positivo/negativo"
é uma leitura simples e comparável de recorrência de perdas/ganhos
mês a mês — atrelar isso à inflação do mesmo mês (que teria efeito na
série real) mistura dois fenômenos diferentes (retorno de mercado vs.
poder de compra), o que os outros indicadores (CAGR, Sharpe etc.) já
cobrem separadamente em suas versões real e nominal.

## 2026-08-15 — Tamanho máximo de janela: estendido de 15 para 18 anos

**Contexto:** ao investigar uma queda abrupta no Sortino mediano em
janelas de 15 anos, descobri que era um artefato de amostra: ao crescer
de 14 para 15 anos, as 12 janelas de início mais recente (as de melhor
desempenho, cobrindo majoritariamente o período pós-2012) somem da
amostra — não porque piorem, mas porque não existe ainda histórico
suficiente (até jun/2026) para estendê-las a 15 anos completos. Efeito
médio de estender uma mesma janela em 1 ano: praticamente zero (-0,01 no
Sortino). O efeito observado na mediana é 100% efeito de composição de
amostra (censura à direita), não comportamento real da carteira.

**Pergunta:** até quando estender o tamanho de janela, dado que
`n_janelas = 246 - (anos×12) + 1` cai 12 unidades a cada ano adicional?

| Anos | Janelas possíveis |
|---|---|
| 15 | 67 |
| 16 | 55 |
| 17 | 43 |
| 18 | 31 |
| 19 | 19 (amostra já fina demais) |
| 20 | 7 (deixa de ser distribuição) |
| 20,5 (máximo absoluto) | 1 (a série inteira) |

**Decisão:** estender o cálculo de todos os indicadores e gráficos de
janela móvel até **18 anos** (`n_janelas` mínimo de 31) — generoso o
bastante para mostrar a tendência de longo prazo, mas ainda com amostra
minimamente defensável para percentis (p5/p95). Não estender além disso:
a partir de 19 anos a amostra fica pequena demais e o mesmo efeito de
censura à direita que distorceu os 15 anos ficaria ainda mais forte.

**Racional prático:** o efeito de composição de amostra nos anos mais
longos (16-18) deve ser mencionado como ressalva ao lado de qualquer
gráfico que mostre esses tamanhos de janela — não é um sinal de que
"janelas muito longas pioram o retorno", é uma limitação do tamanho da
base de dados disponível (jan/2006–jun/2026).
