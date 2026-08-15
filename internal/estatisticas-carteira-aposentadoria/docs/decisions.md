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
janela da carteira (01/2006 a 06/2026, 241 meses); o mês extra (07/2026)
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
