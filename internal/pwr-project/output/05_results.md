# Resultados Finais — PWR da Carteira

**Data:** 2026-08-09
**Configuração final** (todas as decisões em `docs/decisions.md`):
bootstrap estacionário (Politis-Romano), bloco médio 12 meses, horizonte de
60 anos, 10.000 trajetórias, critério de sucesso = valor real final ≥ valor
real inicial, retirada real fixa mensal, carteira 30% VWRA11 / 20% DIVO11 /
40% B5P211 / 5% CDIB11 / 5% GOLD11 via proxies de índice líquidos de taxa de
administração, retornos reais deflacionados pelo IPCA, amostra de 246 meses
(jan/2006–jun/2026).

## Tabela principal

| Percentil de sucesso | PWR (real, a.a.) | Sucesso alcançado | Nunca-drawdown* |
|---|---|---|---|
| 75% | 5,880% | 75,00% | 10,16% |
| 80% | 5,687% | 80,01% | 11,39% |
| 85% | 5,443% | 85,01% | 12,63% |
| **90%** | **5,163%** | 90,01% | 14,02% |
| **95%** | **4,752%** | 95,01% | 16,57% |
| 99% | 4,022% | 99,00% | 20,07% |

\* Fração de trajetórias em que o patrimônio real nunca cai abaixo do valor
inicial em nenhum momento intermediário (métrica complementar mais estrita,
não é a definição de PWR usada — ver Decisão 7).

**Leitura:** com 90% de confiança, retirar 5,16% ao ano em termos reais
preserva (ou recupera até) o patrimônio real inicial ao final de um
horizonte de 60 anos. Com 95% de confiança, a taxa cai para 4,75%.

## Validações de robustez executadas

1. **Convergência do número de trajetórias** (Decisão 9): 10k vs. 20k vs.
   40k trajetórias — diferença máxima de 0,028 p.p. Confirmado que 10k é
   suficiente.
2. **Robustez do horizonte** (Decisão 8): 40/60/80/100 anos — PWR converge
   assintoticamente; diferença entre 80 e 100 anos já é <0,01 p.p. 60 anos
   captura a maior parte da convergência.
3. **Sensibilidade ao tamanho de bloco** (Decisão 6): 6/9/12/18/24 meses —
   estável na faixa 6-12 meses (~5,16-5,17% em PWR@90%), diverge em blocos
   maiores (18-24m) por causa do tamanho limitado da amostra (246 meses).
   12 meses está na região estável.
4. **Piso de sanidade histórico** (sem reamostragem): pior janela rolante de
   10 anos observada na amostra real teve CAGR real de 4,49% a.a. — na mesma
   ordem de grandeza da PWR@95% (4,75%), o que é um sinal de consistência
   (não deveria ser drasticamente menor que a PWR simulada).

## Limitações a declarar no artigo

- Amostra de apenas ~20,5 anos (246 meses) para estimar comportamento de
  perpetuidade — inerentemente uma extrapolação de longo alcance a partir de
  uma janela curta. Blocos de bootstrap maiores que ~12-15 meses já perdem
  confiabilidade por causa disso.
- Proxies de índice para os ETFs ignoram tracking error residual além da
  taxa de administração (Decisão 0).
- Um valor do FTSE All-World (fev/2009) foi corrigido por inferência
  (dividido por 10) — não confirmado na fonte primária (Decisão 5).
- A CAGR real de 7,01% a.a. da carteira é elevada por causa do peso de 40%
  em títulos IPCA+ (B5P211/IMA-B5), que pagaram juros reais historicamente
  altos no Brasil entre 2003-2016 — não é garantido que esse padrão persista
  daqui para frente. A PWR calculada reflete a história 2006-2026, não uma
  previsão.
- Critério de sucesso adotado (valor final ≥ inicial) é o padrão da
  indústria (Portfolio Charts etc.), mas é mais permissivo que "nunca cair
  abaixo do inicial em momento algum" — a métrica complementar de
  nunca-drawdown mostra que a maioria das trajetórias tem drawdown
  temporário mesmo nos cenários de sucesso.

## Arquivos gerados

- `output/portfolio_monthly_returns.csv` — 246 retornos mensais reais da
  carteira, com todos os componentes.
- `output/pwr_final_results.csv` — tabela de PWR por percentil de sucesso.
- `src/01_prepare_returns.py`, `src/02_bootstrap.py`, `src/03_simulate.py`,
  `src/04_find_pwr_final.py` — pipeline completo, reprodutível.
