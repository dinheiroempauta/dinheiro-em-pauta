# TASKS — Estatísticas de Comportamento da Carteira em Janelas Móveis

Marcar `[x]` conforme concluído. Ordem sequencial — não pular etapas de
validação.

## Preparação de dados
- [x] `src/01_prepare_data.py`: ler `retornos_mensais_carteira.csv` e
      `cdi_mensal.csv`
- [x] Converter `Data` do CDI (MM/AAAA) e `CDI` (string percentual,
      vírgula) para os mesmos tipos/formato da base da carteira
- [x] Merge por data (inner join), assert de que resultou em exatamente
      246 linhas
- [x] Calcular `cdi_real` via Fisher
- [x] Gerar `output/base_consolidada.csv`
- [x] Conferir manualmente 3-4 linhas do output contra os CSVs originais

## Indicadores (módulo puro)
- [x] `src/02_indicators.py`: CAGR
- [x] Volatilidade anualizada
- [x] Curva de capital acumulado + drawdown máximo
- [x] Tempo de recuperação (com extensão além da janela)
- [x] Ulcer Index
- [x] Sharpe (nominal e real)
- [x] Sortino (nominal e real)
- [x] Calmar
- [x] Pior mês / melhor mês
- [x] % meses positivos / negativos
- [x] VaR e CVaR históricos (corte 5%)
- [x] Skewness e curtose
- [x] Teste manual: CAGR/vol/drawdown/pior-melhor-mês/%pos-neg/tempo de
      recuperação conferidos à mão contra a saída do código (janela
      2006 e janela 2008-2010) — todos bateram; Sortino em janela com
      só 1 mês negativo retorna `NaN` corretamente (regra: mínimo 2
      meses negativos para desvio-padrão)

## Janelas móveis
- [x] `src/03_rolling_windows.py`: gerar janelas de 12 a 180 meses
      (step 12) — 2.265 janelas ao todo
- [x] Rodar todos os indicadores em todas as janelas de todos os tamanhos
- [x] Agregar por tamanho de janela (mediana, min, max, p10, p25, p75, p90)
- [x] Gerar `output/estatisticas_por_janela.csv`
- [x] Sanity check: CAGR mediano estável (~13%) em todos os tamanhos de
      janela e dispersão (min/max) cai conforme a janela cresce — padrão
      esperado de regressão à média

## Correlação entre ativos
- [x] `src/04_correlacao_ativos.py`: matriz de correlação de Pearson dos
      5 ativos, período completo
- [x] Gerar `output/matriz_correlacao_ativos.csv` — correlações baixas/
      negativas entre a maioria dos pares, consistente com carteira
      diversificada

## Fechamento
- [x] Revisão geral dos números antes de considerar a análise "pronta"
      (30 indicadores × 15 tamanhos de janela = 450 linhas; Sharpe real
      mediano ~0,5 e drawdown máximo real em janelas de 15 anos entre
      -12% e -17% — plausível)
- [x] Commit + push
- [ ] Decidir com o usuário: essa é a base final, ou abre uma segunda
      iteração (gráficos, outro corte de indicadores, virar artigo)?

## Candidatos a gráfico para o futuro artigo

Gráficos exploratórios já validados nesta sessão (fora do repositório,
gerados como artifact) que o usuário confirmou querer no artigo quando
ele for escrito. Ainda não há código de geração de gráfico em `src/` —
os artifacts foram construídos ad-hoc a partir de `janelas_detalhado.csv`.

- [x] CAGR (real e nominal) em janelas móveis, com seletor de tamanho de
      janela (1 a 15 anos) — confirmado pelo usuário como gráfico
      desejado, **versão interativa com slider** (decisão fechada, não
      estática). Protótipo final salvo em
      `internal/estatisticas-carteira-aposentadoria/graficos/cagr-janela-selecionavel.html`
      (HTML/SVG/JS autocontido, dados das 15 janelas embutidos inline,
      todas as 2.265 janelas individuais — não só o resumo agregado).
      Ao escrever o artigo: (1) checar em `internal/CHECKLIST-NOVO-ARTIGO.md`
      e `internal/template-artigo.html` se o design system do blog já
      suporta um componente JS interativo embutido no artigo, ou se isso
      é uma extensão nova do padrão; (2) se for extensão nova, é decisão
      arquiteturalmente significativa — não implementar sem alinhar com
      o usuário antes (ver CLAUDE.md, seção "Modo de operação"); (3)
      script de geração dos dados ainda não existe em `src/` — só o
      resultado final (HTML com dados embutidos) está salvo.

- [x] **Funil de distribuição do CAGR por tempo investido** (bandas de
      percentil p5–p95 e p20–p80, mediana, pior/melhor caso observado,
      toggle Nominal/Real) — confirmado pelo usuário como gráfico
      **importante** para o artigo. Protótipo final salvo em
      `internal/estatisticas-carteira-aposentadoria/graficos/funil-cagr-percentis.html`
      (HTML/SVG/JS autocontido, sem dependências externas, dados dos 15
      tamanhos de janela embutidos inline). Dados-fonte: percentis 5/20/50/80/95
      + mín/máx de `cagr_nominal` e `cagr_real` por tamanho de janela,
      calculados a partir de `janelas_detalhado.csv` (script de geração
      desses percentis ainda não existe em `src/` — só o resultado final
      está salvo). Ao escrever o artigo: mesma ressalva do item acima
      sobre componente JS interativo (não estático) — checar suporte do
      design system do blog e alinhar com o usuário antes de embutir.
