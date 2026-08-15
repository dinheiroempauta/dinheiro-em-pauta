# TASKS — Estatísticas de Comportamento da Carteira em Janelas Móveis

Marcar `[x]` conforme concluído. Ordem sequencial — não pular etapas de
validação.

## Preparação de dados
- [ ] `src/01_prepare_data.py`: ler `retornos_mensais_carteira.csv` e
      `cdi_mensal.csv`
- [ ] Converter `Data` do CDI (MM/AAAA) e `CDI` (string percentual,
      vírgula) para os mesmos tipos/formato da base da carteira
- [ ] Merge por data (inner join), assert de que resultou em exatamente
      241 linhas
- [ ] Calcular `cdi_real` via Fisher
- [ ] Gerar `output/base_consolidada.csv`
- [ ] Conferir manualmente 3-4 linhas do output contra os CSVs originais

## Indicadores (módulo puro)
- [ ] `src/02_indicators.py`: CAGR
- [ ] Volatilidade anualizada
- [ ] Curva de capital acumulado + drawdown máximo
- [ ] Tempo de recuperação (com extensão além da janela)
- [ ] Ulcer Index
- [ ] Sharpe (nominal e real)
- [ ] Sortino (nominal e real)
- [ ] Calmar
- [ ] Pior mês / melhor mês
- [ ] % meses positivos / negativos
- [ ] VaR e CVaR históricos (corte 5%)
- [ ] Skewness e curtose
- [ ] Teste manual: calcular à mão (ou em planilha) 1-2 indicadores para
      uma janela de 12 meses conhecida e comparar com a saída do código

## Janelas móveis
- [ ] `src/03_rolling_windows.py`: gerar janelas de 12 a 180 meses
      (step 12)
- [ ] Rodar todos os indicadores em todas as janelas de todos os tamanhos
- [ ] Agregar por tamanho de janela (mediana, min, max, p10, p25, p75, p90)
- [ ] Gerar `output/estatisticas_por_janela.csv`
- [ ] Sanity check: o drawdown máximo aparece nas janelas que cobrem
      2008 e 2020? A janela de 15 anos tem menos dispersão que a de 1 ano?

## Correlação entre ativos
- [ ] `src/04_correlacao_ativos.py`: matriz de correlação de Pearson dos
      5 ativos, período completo
- [ ] Gerar `output/matriz_correlacao_ativos.csv`

## Fechamento
- [ ] Revisão geral dos números antes de considerar a análise "pronta"
- [ ] Commit + push
- [ ] Decidir com o usuário: essa é a base final, ou abre uma segunda
      iteração (gráficos, outro corte de indicadores, virar artigo)?
