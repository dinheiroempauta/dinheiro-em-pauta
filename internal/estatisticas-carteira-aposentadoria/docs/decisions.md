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
