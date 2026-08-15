# PLAN — Como vamos executar

**Status:** rascunho inicial
**Última atualização:** 2026-08-09

## Stack

- Python (pandas, numpy, scipy, matplotlib) — execução no ambiente de código
  do Claude, sem dependência local do usuário.
- Sem bibliotecas de simulação prontas (ex: nenhuma lib de "Monte Carlo
  retirement" pronta) — bootstrap e busca binária implementados manualmente
  para manter tudo auditável.

## Fluxo (SDD — spec primeiro, depois plano, depois execução)

```
docs/spec.md       ← o quê e por quê (este documento não muda com frequência)
docs/plan.md        ← este arquivo — como, tecnicamente
docs/decisions.md   ← log incremental de cada decisão metodológica, com fonte
docs/tasks.md        ← checklist executável, atualizado a cada etapa concluída
data/                ← dados brutos fornecidos pelo usuário (não versionar publicamente)
src/                 ← código Python, um módulo por etapa
output/               ← resultados: tabelas, gráficos, PWR final
```

## Fases

### Fase 0 — Planejamento (atual)
Criar spec.md, plan.md, tasks.md. Sem código ainda.

### Fase 1 — Ingestão e inspeção dos dados
- Carregar arquivos enviados pelo usuário.
- Relatório de inspeção: período coberto por ativo, lacunas, frequência,
  outliers óbvios. NENHUMA decisão de tratamento é tomada nesta fase — só
  diagnóstico.
- Output: `output/01_data_inspection.md`

### Fase 2 — Pesquisa e decisões metodológicas
Para cada item da seção 5 do spec.md, nesta ordem:
- Pesquisa (web_search / literatura) → registrar em `decisions.md` com fonte.
- Quando aplicável, validar com teste estatístico nos dados reais (ex:
  autocorrelação para justificar tamanho de bloco) antes de fechar a decisão.
- Cada decisão é aprovada (implicitamente, seguindo em frente) antes de
  passar pra próxima — usuário pode interromper e pedir revisão a qualquer
  momento.

### Fase 3 — Implementação
- `src/01_prepare_returns.py` — retornos da carteira, deflação IPCA.
- `src/02_bootstrap.py` — block bootstrap / bootstrap estacionário.
- `src/03_simulate.py` — geração de trajetórias, aplicação de taxa de retirada.
- `src/04_find_pwr.py` — busca binária por percentil de sucesso.
- `src/05_sensitivity.py` — variação de tamanho de bloco, comparação com pior
  caso histórico puro.

### Fase 4 — Resultados
- Tabelas: PWR por percentil de sucesso.
- Gráficos: sensibilidade, distribuição de trajetórias, comparação de
  métodos.
- `output/05_results.md` — resumo final com todas as decisões referenciadas.

### Fase 5 — (opcional, depois de validar números) formatação para o site
Fora do escopo deste ciclo — decisão explícita no spec.md.

## Formato do log de decisões (decisions.md)

Cada entrada segue este template:

```
## Decisão N — <título curto>
**Data:** AAAA-MM-DD
**Pergunta:** o que precisava ser decidido
**Pesquisa:** resumo do que foi encontrado (com fontes)
**Decisão:** o que foi escolhido
**Racional:** por que essa escolha, incluindo trade-offs descartados
**Validação nos dados (se aplicável):** teste feito, resultado
```

## Regra de atualização

Este conjunto de arquivos (`spec.md`, `plan.md`, `decisions.md`, `tasks.md`)
é atualizado ao final de cada etapa concluída, não só no fim do projeto —
para permitir retomar de qualquer IA sem perda de contexto.
