# TASKS — Checklist executável

**Última atualização:** 2026-08-09
**Legenda:** [ ] pendente · [~] em andamento · [x] concluído · [!] bloqueado

## Fase 0 — Planejamento
- [x] Criar spec.md
- [x] Criar plan.md
- [x] Criar tasks.md
- [x] Criar decisions.md (log vazio, pronto pra receber entradas)
- [x] Decisão 0: uso de proxies de índice para os ETFs (ver decisions.md) —
      aprovada pelo usuário

## Fase 1 — Ingestão e inspeção
- [x] Carregar arquivos em `data/` (`BD_Carteira_Claude.xlsx`, 7 abas: IDIV,
      Gold, IMA-B5, CDI, FTSE All-World, Câmbio, IPCA)
- [x] Relatório de inspeção (`output/01_data_inspection.md`)
- [x] Checagem de consistência Total Return vs Price Return (FTSE All-World
      e IDIV confirmados como Total Return, com fontes)
- [x] Gap do IDIV resolvido: Opção A — amostra da carteira completa começa
      em dez/2005 (Decisão 3, ~20,7 anos / 248 meses)
- [x] Fase 1 concluída — pronto para Fase 2 (decisões metodológicas restantes)

## Fase 2 — Decisões metodológicas (cada uma com pesquisa registrada em decisions.md)
- [x] Decisão 0: uso de proxies de índice (ver Fase 0)
- [x] Decisão 1: convenção de data mensal
- [x] Decisão 2: duplicatas do IDIV
- [x] Decisão 3: início da amostra (dez/2005)
- [x] Decisão 4: janela final de retornos mensais — jan/2006 a jun/2026
      (246 observações)
- [x] Decisão 5: correção de outlier no FTSE All-World (fev/2009, ÷10)
- [x] src/01_prepare_returns.py — retornos mensais reais da carteira
      gerados (`output/portfolio_monthly_returns.csv`), CAGR real 7,01%
      a.a. em 20,5 anos — plausível para o perfil da carteira
- [x] Decisão 6: tamanho de bloco do bootstrap — bootstrap estacionário
      (Politis-Romano), bloco médio de 12 meses (análise de ACF, clustering
      de volatilidade e Politis-White nos dados reais + literatura de
      retirement withdrawal); sensibilidade planejada 6/9/12/18/24 meses
- [x] Decisão 7: critério de sucesso — valor real ao final do horizonte ≥
      valor inicial real (padrão da literatura/Portfolio Charts), com
      métrica complementar de "nunca cair abaixo" reportada à parte
- [x] Decisão 8: horizonte de simulação — 60 anos (720 meses), com
      robustez planejada comparando 40/60/80/100 anos
- [x] Decisão 9: número de trajetórias simuladas — 10.000 (padrão de
      mercado), com validação empírica de convergência a 20k/40k na Fase 3
- [x] Decisão 10: frequência de rebalanceamento — mensal (já implementado;
      literatura confirma impacto desprezível vs. anual/trimestral)
- [x] Decisão 11: fonte e tratamento do IPCA — confirmado como IPCA oficial
      IBGE (checagem cruzada 2015-2022), sem defasagem de divulgação (já
      implementado)
- [x] Decisão 12: regime de retirada — real fixa, mensal (1/12 da taxa
      anual sobre valor inicial real), confirmado como padrão da literatura
      (Bengen, Trinity, Portfolio Charts, Bogleheads)

## Fase 2 concluída — todas as 13 decisões metodológicas (0 a 12) registradas
em `docs/decisions.md`. Pronto para Fase 3 (implementação).

## Fase 3 — Implementação
- [x] src/01_prepare_returns.py — retornos mensais reais da carteira
- [x] src/02_bootstrap.py — bootstrap estacionário (Politis-Romano)
- [x] src/03_simulate.py — simulador de retirada + busca binária pela PWR
- [x] src/04_find_pwr_final.py — tabela final de resultados
- [x] Validação empírica de convergência de trajetórias (10k/20k/40k)
- [x] Validação empírica de robustez do horizonte (40/60/80/100 anos)
- [x] Análise de sensibilidade ao tamanho de bloco (6/9/12/18/24 meses)

## Fase 4 — Resultados
- [x] Tabela PWR por percentil de sucesso (`output/pwr_final_results.csv`)
- [x] output/05_results.md — resumo final com todas as decisões referenciadas
- [ ] Gráficos de sensibilidade (pendente — próximo passo, se desejado)

## RESULTADO PRINCIPAL
PWR@90% = 5,163% a.a. real | PWR@95% = 4,752% a.a. real
(bootstrap estacionário, bloco 12m, horizonte 60 anos, 10.000 trajetórias)
Ver `output/05_results.md` para tabela completa e limitações.

## Fase 5 — Formatação para o site (fora do escopo atual)
- [ ] (não iniciar sem decisão explícita do usuário)

## Próxima ação imediata
Pipeline completo, resultado principal calculado e validado (ver seção
"RESULTADO PRINCIPAL" acima; detalhes em `output/05_results.md`). Falta:
1. Gráficos de sensibilidade (opcional).
2. Decisão do usuário: formatação no design system do site (fora do
   escopo original — exige decisão explícita) ou revisão/discussão dos
   números primeiro.
