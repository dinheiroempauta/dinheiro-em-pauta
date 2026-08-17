# SPEC — Cálculo de PWR (Perpetual Withdrawal Rate) via Simulação

**Status:** rascunho inicial
**Última atualização:** 2026-08-09
**Dono:** Bruno (Dinheiro em Pauta)

## 1. Objetivo

Calcular a PWR de uma carteira de investimentos definida (ativos + pesos fixos),
usando dados históricos mensais reais desde 2003, via simulação computacional
(block bootstrap), para embasar o artigo #3 do blog (funil já referenciado
no artigo #1 sobre guardrails de Guyton-Klinger).

## 2. Definição de PWR adotada

Taxa de retirada anual real (corrigida pela inflação) que, aplicada sobre uma
carteira com alocação fixa e rebalanceamento periódico, preserva o patrimônio
em termos reais ao longo de um horizonte que aproxima a perpetuidade (não
literalmente infinito — ver decisão sobre horizonte em plan.md).

Como sucesso 100% das trajetórias simuladas é estruturalmente inatingível com
qualquer volatilidade > 0 em horizonte longo, a PWR será reportada em múltiplos
percentis de sucesso (ex: PWR@90%, PWR@95%), não como número único.

## 3. Escopo

### Dentro do escopo
- Ingestão de dados mensais reais de N ativos fornecidos pelo usuário (2003–2026).
- Cálculo de retornos da carteira com peso fixo + rebalanceamento mensal.
- Deflação pelo IPCA (retornos reais).
- Block bootstrap (tamanho de bloco a definir com base em pesquisa + teste de
  autocorrelação nos dados reais).
- Simulação de N trajetórias de longo horizonte.
- Busca binária da taxa de retirada por percentil de sucesso.
- Análise de sensibilidade (tamanho de bloco, critério de sucesso).
- Documentação de cada decisão metodológica com fonte/racional.
- Gráficos e tabelas de resultado.

### Fora do escopo (por ora)
- Formatação final no design system do site (HTML/SVG) — só depois dos números
  validados.
- Comparação com SWR de horizonte finito (pode virar artigo separado).
- Ativos sem histórico completo desde 2003 — tratamento é uma decisão pendente
  (ver seção 5).
- Fees, impostos, come-cotas — tratamento é decisão pendente.

## 4. Dados necessários (aguardando upload do usuário)

- [ ] Retornos ou cotas mensais de cada ativo da carteira, 2003–presente.
- [ ] Pesos-alvo de cada ativo (soma = 100%).
- [ ] Série de IPCA mensal (usuário pode fornecer ou eu busco de fonte oficial
      — decisão a registrar quando chegarmos lá).

## 5. Decisões metodológicas pendentes (a resolver com pesquisa, na ordem)

Cada uma vira uma entrada no `decisions.md` (log de decisões) quando resolvida.

1. Tratamento de ativos com histórico mais curto que 2003 (se houver).
2. Tamanho de bloco do block bootstrap (ou bootstrap estacionário de Politis &
   Romano) — validar com teste de autocorrelação nos dados reais.
3. Critério de "sucesso" (pico nunca cai abaixo do inicial vs. valor final ≥
   inicial vs. nunca zera).
4. Horizonte de simulação usado como proxy de perpetuidade (quantos anos).
5. Número de trajetórias simuladas (convergência de Monte Carlo).
6. Frequência de rebalanceamento (mensal assumido — confirmar se é o desejado).
7. Fonte e tratamento do IPCA (mensal, com defasagem de divulgação ou não).
8. Regime de retirada (real fixa vs. percentual do saldo vs. guardrails) —
   spec atual assume retirada real fixa (padrão para PWR clássica); guardrails
   ficam para artigo futuro, mas registrar a decisão explicitamente.

## 6. Critérios de aceite

- Todas as decisões da seção 5 documentadas em `decisions.md` com fonte e
  racional, **antes** de serem aplicadas ao código.
- Código auditável (sem libs de simulação "caixa-preta"), em `src/`.
- Resultado final: tabela com PWR@90%, PWR@95%, PWR@99% (ou percentis que
  fizerem sentido), gráfico de sensibilidade por tamanho de bloco, e piso de
  sanidade (pior janela histórica real sem reamostragem).
- Tudo reprodutível a partir dos dados brutos em `data/`.

## 7. Perguntas em aberto para o usuário

- Ativos: quais exatamente entram na carteira e com qual peso?
- Formato dos dados que serão enviados (CSV com preço/cota, ou já em retorno
  mensal)?
- Fonte de preferência para IPCA (usuário fornece, ou eu busco no SIDRA/IBGE)?
