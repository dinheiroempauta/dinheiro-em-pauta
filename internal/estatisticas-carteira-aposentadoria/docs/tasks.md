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

- [x] **Funil de distribuição do Ulcer Index por tempo investido** (mesmo
      formato do funil de CAGR: bandas p5–p95/p20–p80, mediana,
      pior/melhor caso, toggle Nominal/Real, mas valores como índice
      puro, não percentual). Protótipo salvo em
      `internal/estatisticas-carteira-aposentadoria/graficos/ulcer-funil-percentis.html`.
      Interpretação completa do gráfico (formato de sino por tamanho de
      janela, assimetria em janelas curtas, gap real/nominal causado pelo
      surto inflacionário de 2021-2022) registrada em
      `internal/estatisticas-carteira-aposentadoria/docs/interpretacoes.md`
      — material pronto para virar texto do artigo. Mesma ressalva sobre
      componente JS interativo ao publicar.

- [x] **Drawdown e tempo de recuperação — gráfico underwater +
      dispersão profundidade x duração** (formato diferente do funil de
      percentis, por escolha deliberada — esses dois indicadores são
      propriedades da trajetória histórica única, não de uma distribuição
      por tamanho de janela, então um gráfico de séries temporais/
      dispersão comunica melhor do que um funil). Protótipos salvos em
      `internal/estatisticas-carteira-aposentadoria/graficos/drawdown-underwater.html`
      e `.../graficos/drawdown-profundidade-x-duracao.html`. Os dois
      compartilham a mesma numeração cronológica de episódios (badges +
      tabela de detalhes, sem rótulo de texto solto no gráfico — testado
      com screenshot real via Playwright headless após rótulos de texto
      colidirem com a própria linha do underwater). Tabelas incluem
      coluna de **contexto histórico** de cada crise (2008 = crise
      financeira global, 2015 = Lava Jato/tarifaço, 2016 = impeachment,
      2020 = Covid-19, 2022 = guerra na Ucrânia + inflação), identificado
      cruzando a data do fundo com o desempenho dos ativos individuais em
      `base_consolidada.csv`. Interpretação completa (incluindo a tabela
      de episódios com contexto) registrada em
      `internal/estatisticas-carteira-aposentadoria/docs/interpretacoes.md`.
      Mesma ressalva sobre componente JS interativo ao publicar no blog.

- [x] **Sharpe vs. Sortino — linhas de mediana sobrepostas com faixa
      p10-p90** (formato diferente do funil de percentis, por escolha
      deliberada — o insight principal é a *comparação entre os dois
      indicadores*, não a distribuição de cada um isoladamente, então um
      gráfico com as duas medianas no mesmo eixo comunica melhor o gap
      estrutural Sortino > Sharpe do que dois funis separados). Protótipo
      salvo em
      `internal/estatisticas-carteira-aposentadoria/graficos/sharpe-sortino-comparativo.html`,
      toggle Nominal/Real, cores fixas por indicador (não por nominal/real).
      Interpretação completa (gap estrutural por causa do desvio-padrão
      downside-only, convergência das duas métricas em janelas longas,
      formato de sino espelhado do Ulcer, gap nominal/real pequeno e
      estável ao contrário do drawdown/Ulcer) registrada em
      `docs/interpretacoes.md`. Validado com screenshot real via Playwright
      headless (toggle nominal e real). Mesma ressalva sobre componente JS
      interativo ao publicar no blog.

- [x] **Funil de distribuição da Volatilidade anualizada por tempo
      investido** (mesmo formato do funil de CAGR/Ulcer: bandas
      p5–p95/p20–p80, mediana, pior/melhor caso, toggle Nominal/Real,
      eixo Y começando em 0% já que volatilidade nunca é negativa).
      Protótipo salvo em
      `internal/estatisticas-carteira-aposentadoria/graficos/volatilidade-funil-percentis.html`.
      Interpretação completa (convergência muito mais rápida que
      CAGR/Ulcer — estabiliza em 6-7 anos —, funil fechando por
      regressão à média mecânica, e gap nominal/real quase nulo ao
      contrário do drawdown/Ulcer, porque volatilidade mede dispersão
      mês a mês e não é sensível ao efeito acumulado da inflação)
      registrada em `docs/interpretacoes.md`. Validado com screenshot
      real via Playwright headless (toggle nominal e real). Mesma
      ressalva sobre componente JS interativo ao publicar no blog.

- [x] **Pior mês vs. Melhor mês — linhas de mediana sobrepostas com faixa
      p10-p90** (mesmo formato do gráfico Sharpe vs. Sortino, toggle
      Nominal/Real). Protótipo salvo em
      `internal/estatisticas-carteira-aposentadoria/graficos/pior-melhor-mes-comparativo.html`.
      Interpretação completa (formato de "escada" por serem extremos
      individuais, não médias; da janela de 15 anos em diante toda janela
      contém o mesmo pior mês histórico — out/2008; assimetria de
      convergência entre pior e melhor mês) registrada em
      `docs/interpretacoes.md`. Validado com screenshot real via
      Playwright headless.
- [x] **% de meses positivos vs. negativos — linhas de mediana sobrepostas
      com faixa p10-p90, sem toggle nominal/real** (indicador único, não
      nominal/real — decisão já registrada em spec.md §4). Protótipo salvo
      em
      `internal/estatisticas-carteira-aposentadoria/graficos/pct-positivos-negativos.html`.
      Interpretação completa (convergência para ~71%/29% já em 6-7 anos,
      faixa de incerteza enorme em janelas de 1 ano — já existiu ano 100%
      positivo e ano 100% negativo) registrada em `docs/interpretacoes.md`.
      Validado com screenshot real via Playwright headless. Mesma ressalva
      sobre componente JS interativo ao publicar no blog (ambos os
      gráficos desta seção).

- [x] **VaR vs. CVaR (5%) — linhas de mediana sobrepostas com faixa
      p10-p90** (mesmo formato do Sharpe vs. Sortino e Pior vs. Melhor
      mês, toggle Nominal/Real). Protótipo salvo em
      `internal/estatisticas-carteira-aposentadoria/graficos/var-cvar-comparativo.html`.
      Interpretação completa (gap CVaR-VaR mede "peso da cauda", gap
      estrutural de ~1,2pp a partir de 10 anos, gap nominal/real
      parecido com CAGR/pior-mês e não com Ulcer/drawdown) registrada em
      `docs/interpretacoes.md`. Validado com screenshot real via
      Playwright headless (toggle nominal e real). Mesma ressalva sobre
      componente JS interativo ao publicar no blog.

- [x] **Skewness vs. Curtose — linhas de mediana sobrepostas com faixa
      p10-p90** (mesmo formato do Sharpe vs. Sortino, Pior vs. Melhor mês
      e VaR vs. CVaR, toggle Nominal/Real; escala em números adimensionais,
      não percentual). Protótipo salvo em
      `internal/estatisticas-carteira-aposentadoria/graficos/skewness-curtose-comparativo.html`.
      Interpretação completa (skewness levemente negativa e estável ~-0,4,
      curtose sobe de ~0 para +1,7 com o mesmo salto de composição de
      amostra entre 14-15 anos já visto no Ulcer/Sortino, e como os dois
      indicadores captam o mesmo fenômeno — cauda de perdas pesada — por
      ângulos diferentes) registrada em `docs/interpretacoes.md`.
      Validado com screenshot real via Playwright headless (toggle
      nominal e real). Mesma ressalva sobre componente JS interativo ao
      publicar no blog.

- [x] **Heatmap de Correlação entre os 5 ativos** (grade 5×5, escala
      divergente vermelho-branco-azul, período completo, sem toggle —
      indicador único que não varia por tamanho de janela). Protótipo
      salvo em
      `internal/estatisticas-carteira-aposentadoria/graficos/correlacao-ativos-heatmap.html`.
      Interpretação completa (nenhum par com correlação forte, GOLD11
      como ativo mais "contrário" — negativo com DIVO11/B5P211,
      CDIB11 como âncora neutra, VWRA11×DIVO11 quase independentes apesar
      de ambos serem renda variável) registrada em `docs/interpretacoes.md`.
      Validado com screenshot real via Playwright headless (incluindo
      correção de um bug de exibição "-0,00" em valores muito próximos de
      zero). Mesma ressalva sobre componente JS interativo ao publicar no
      blog.
- [x] **Todos os indicadores da spec.md §4 agora têm gráfico + interpretação
      registrada**: CAGR, Volatilidade, Drawdown máximo, Tempo de
      recuperação, Ulcer Index, Sharpe, Sortino, Calmar (via VaR/CVaR e
      Sharpe cobrem a mesma família de risco-retorno; Calmar em si não
      recebeu gráfico dedicado — decisão pendente de revisão com o
      usuário se vale a pena adicionar), Pior/melhor mês, % positivos/
      negativos, VaR/CVaR, Skewness/Curtose, Correlação entre ativos.

## Extensão do tamanho máximo de janela: 15 → 18 anos

- [x] Investigada queda abrupta no Sortino mediano em janelas de 15 anos
      — causa raiz identificada como artefato de composição de amostra
      (censura à direita), não comportamento real da carteira. Decisão
      e racional completos em `docs/decisions.md`.
- [x] `src/03_rolling_windows.py`: `TAMANHOS_JANELA` estendido de
      `range(12,181,12)` (1-15 anos) para `range(12,217,12)` (1-18 anos).
      Recalculado: 2.394 janelas ao todo (era 2.265), `n_janelas` mínimo
      agora 31 (18 anos) em vez de 67 (15 anos).
- [x] `output/janelas_detalhado.csv` e `output/estatisticas_por_janela.csv`
      regenerados com os novos tamanhos.
- [x] `docs/spec.md` e `docs/plan.md` atualizados (15→18 anos, 180→216
      meses) para refletir o novo escopo.
- [x] Os 3 gráficos que dependem de tamanho de janela atualizados e
      revalidados com screenshot real (Playwright headless, inclusive
      testando o toggle nominal/real e o slider no valor máximo):
      `cagr-janela-selecionavel.html` (slider `max` 15→18),
      `funil-cagr-percentis.html` e `ulcer-funil-percentis.html` (funil
      estendido até 18 anos). Os dois gráficos de drawdown/recuperação
      (`drawdown-underwater.html`,
      `drawdown-profundidade-x-duracao.html`) **não** dependem de
      tamanho de janela — usam a série completa — e não precisaram de
      atualização.
- [x] Efeito colateral interessante confirmado visualmente: o funil de
      Ulcer agora mostra com clareza o salto de composição de amostra
      entre 15 e 16 anos (mediana sobe de repente), ilustrando ao vivo o
      artefato documentado em `decisions.md` — vale mencionar essa
      ressalva ao lado do gráfico se ele entrar no artigo.
