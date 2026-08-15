# PLAN — Estatísticas de Comportamento da Carteira em Janelas Móveis

**Status:** rascunho inicial
**Última atualização:** 2026-08-15

## 1. Dados e preparação

Entrada:
- `retornos_mensais_carteira.csv` — 246 meses (01/2006–06/2026), colunas
  `Data`, `ret_vwra11`, `ret_divo11`, `ret_b5p211`, `ret_cdib11`,
  `ret_gold11`, `ret_carteira_nominal`, `ret_ipca`, `ret_carteira_real`.
- `cdi_mensal.csv` — 247 meses (01/2006–07/2026), colunas `Data` (MM/AAAA),
  `CDI` (string percentual, vírgula decimal).

Passos de preparação (`src/01_prepare_data.py`):
1. Ler `retornos_mensais_carteira.csv`, parsear `Data` como data.
2. Ler `cdi_mensal.csv`, converter `Data` de `MM/AAAA` para o mesmo formato,
   converter `CDI` de string (`"1,22%"`) para float decimal (`0.0122`).
3. Merge por data (inner join) — resultado deve ter exatamente 246 linhas,
   uma por mês da carteira. Validar isso com um assert explícito (falhar
   ruidosamente se não bater, não seguir silenciosamente).
4. Calcular `cdi_real` via Fisher: `(1 + CDI) / (1 + ret_ipca) - 1`.
5. Output intermediário: `output/base_consolidada.csv` (carteira + CDI
   nominal/real, uma linha por mês) — serve de auditoria antes de rodar
   as janelas.

## 2. Fórmulas dos indicadores

Todas operam sobre uma série de retornos mensais `r` (nominal ou real,
conforme o indicador pede as duas) referente a uma janela de N meses.
`n` = número de meses na janela.

- **CAGR:** `(prod(1+r) ** (12/n)) - 1`
- **Volatilidade anualizada:** `std(r, ddof=1) * sqrt(12)`
- **Curva de capital acumulado** (base para drawdown/Ulcer):
  `capital[t] = prod(1+r[0..t])`, capital[−1] = 1.
- **Drawdown máximo:** `min((capital[t] - running_max[t]) / running_max[t])`
  para t na janela, onde `running_max[t] = max(capital[0..t])`.
- **Tempo de recuperação:** a partir do mês do drawdown máximo (`t_min`),
  contar meses até `capital` voltar a igualar/superar o `running_max` no
  momento de `t_min`. Se isso não ocorre dentro da janela, estender a busca
  usando a série completa (fora do recorte da janela) até junho/2026. Se
  ainda assim não recupera, marcar `"não recuperado"` (string explícita,
  não `NaN`).
- **Ulcer Index:** `sqrt(mean(drawdown_pct[t] ** 2))` para todo t na janela,
  onde `drawdown_pct[t] = (capital[t] - running_max[t]) / running_max[t] * 100`.
- **Sharpe:** `(CAGR_carteira - CAGR_cdi_correspondente) / vol_anualizada`,
  usando CDI nominal para Sharpe nominal e `cdi_real` para Sharpe real, CDI
  agregado pela mesma janela/período que a carteira.
- **Sortino:** igual ao Sharpe, mas o denominador é o desvio-padrão anualizado
  só dos retornos mensais abaixo de 0 (downside deviation), `sqrt(12)`.
- **Calmar:** `CAGR / abs(drawdown_máximo)`.
- **Pior mês / melhor mês:** `min(r)` / `max(r)` na janela.
- **% meses positivos / negativos:** `mean(r > 0)` / `mean(r < 0)`.
- **VaR histórico (5%):** percentil 5 de `r` na janela (`numpy.percentile`,
  interpolação linear).
- **CVaR histórico (5%):** média de `r` para os valores `<= VaR`.
- **Skewness / curtose:** `scipy.stats.skew` / `scipy.stats.kurtosis`
  (curtose em excesso, i.e. normal = 0) dos retornos mensais da janela.
- **Correlação entre os 5 ativos:** matriz de correlação de Pearson dos
  retornos mensais dos 5 ativos, período completo (246 meses), fora do
  loop de janelas.

## 3. Geração das janelas móveis

Para cada tamanho de janela `w` em `{12, 24, 36, ..., 216}` (meses):
- Gerar todas as janelas contíguas de tamanho `w` dentro da série de 246
  meses: `n_janelas = 246 - w + 1`.
- Para `w = 216` (18 anos): `n_janelas = 31`.
- Para `w = 12` (1 ano): `n_janelas = 230`.
- Para cada janela, calcular todos os indicadores da seção 2 (nominal e
  real conforme aplicável).
- Agregar por tamanho de janela: mediana, mínimo, máximo, p10, p25, p75,
  p90 de cada indicador entre todas as janelas daquele tamanho.

## 4. Estrutura do código (`src/`)

1. `01_prepare_data.py` — merge carteira + CDI, gera `output/base_consolidada.csv`.
2. `02_indicators.py` — módulo com as funções puras de cada indicador
   (recebem array de retornos, devolvem número ou dict) — sem side effects,
   testável isoladamente.
3. `03_rolling_windows.py` — usa `02_indicators.py`, gera todas as janelas
   de todos os tamanhos, calcula indicadores por janela, agrega por
   tamanho de janela. Gera `output/estatisticas_por_janela.csv` (uma linha
   por combinação tamanho-de-janela × indicador × estatística de resumo).
4. `04_correlacao_ativos.py` — matriz de correlação dos 5 ativos, gera
   `output/matriz_correlacao_ativos.csv`.

## 5. Estrutura do output

- `output/base_consolidada.csv` — carteira + CDI mesclados, auditoria.
- `output/janelas_detalhado.csv` — uma linha por janela individual (2.265
  linhas): `tamanho_janela_meses`, `data_inicio`, `data_fim`, e todos os
  indicadores calculados naquela janela específica. Permite rastrear
  *quando* ocorreu a pior/melhor janela de cada tamanho.
- `output/estatisticas_por_janela.csv` — resumo agregado de
  `janelas_detalhado.csv` por tamanho de janela: `tamanho_janela_meses`,
  `indicador`, `mediana`, `min`, `max`, `p10`, `p25`, `p75`, `p90`,
  `n_janelas`.
- `output/matriz_correlacao_ativos.csv` — 5×5, período completo.

## 6. Ordem de implementação (vira `tasks.md`)

1. `01_prepare_data.py` + validação do merge.
2. `02_indicators.py` com todos os indicadores, testados manualmente em
   1-2 janelas conhecidas antes de rodar em escala (ex: comparar CAGR de
   uma janela de 12 meses com cálculo manual).
3. `03_rolling_windows.py` rodando para todos os 15 tamanhos de janela.
4. `04_correlacao_ativos.py`.
5. Conferência manual dos resultados (sanity check: números batem com a
   intuição? ex. drawdown de 2008 aparece nas janelas que cobrem aquele
   período?).
