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

**Status:** PENDENTE — bloqueia a implementação de Sharpe, Sortino e Calmar
(Calmar não depende de taxa livre de risco, pode seguir).

**Pergunta:** usar `ret_cdib11` (ETF de CDI já presente na base) como proxy
da taxa livre de risco, ou buscar série oficial de CDI/Selic do Bacen?

**Resposta do usuário:** vai enviar uma base de dados do CDI própria para
usarmos essa fonte "bem certinha" em vez do proxy via ETF.

**Próximo passo:** aguardar o arquivo. Quando chegar, registrar aqui：
fonte, período de cobertura, frequência (diária/mensal), forma de conversão
para retorno mensal se necessário, e forma de anualização/desanualização
usada no cálculo de Sharpe/Sortino.
