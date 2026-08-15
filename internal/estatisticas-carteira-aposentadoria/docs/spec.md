# SPEC — Estatísticas de Comportamento da Carteira em Janelas Móveis

**Status:** rascunho inicial
**Última atualização:** 2026-08-15
**Dono:** Bruno (Independência Calculada)

## 1. Objetivo

Caracterizar o comportamento histórico da carteira (retorno, risco e
consistência) usando um leque de janelas móveis de tamanhos diferentes,
para entender "qual é o comportamento comum" — não um número único, mas a
distribuição de resultados possíveis dependendo de quando o investidor
entrou e por quanto tempo ficou. Uso primário: entendimento pessoal do
dono da carteira. Uso secundário, eventual: virar artigo no blog.

## 2. Dados de entrada

- Fonte: `internal/estatisticas-carteira-aposentadoria/retornos_mensais_carteira.csv`
  (cópia independente de `internal/pwr-project/output/portfolio_monthly_returns.csv`;
  esta pasta nunca escreve de volta no projeto PWR).
- 246 observações mensais, `2006-01-01` a `2026-06-01`.
- Colunas: `ret_vwra11`, `ret_divo11`, `ret_b5p211`, `ret_cdib11`, `ret_gold11`
  (retornos mensais dos 5 ativos), `ret_carteira_nominal`, `ret_ipca`,
  `ret_carteira_real`.

## 3. Escopo

### Dentro do escopo
- Indicadores completos calculados para a **carteira combinada**, em versão
  **nominal e real**, sempre que o conceito de nominal/real se aplicar
  (retorno e CAGR sim; drawdown, Sharpe, correlação — decisão registrada em
  `decisions.md` sobre se calculamos só na série real, só na nominal, ou
  ambas).
- Janelas **móveis** (rolling) de 1 a 15 anos, incremento de 1 ano
  (15 tamanhos de janela: 12, 24, 36, ..., 180 meses), cada uma deslizando
  mês a mês por toda a série disponível.
- Para cada tamanho de janela, todos os indicadores da seção 4 calculados em
  **cada** janela possível daquele tamanho (ex: janela de 5 anos = 246-60+1
  = 182 janelas de 60 meses cada) — o resultado é uma distribuição por
  tamanho de janela (mediana, mínimo, máximo, percentis), não um número
  único por tamanho.
- Matriz de correlação entre os 5 ativos individuais (retornos mensais,
  período completo — os ativos individuais entram *só* aqui, não recebem os
  indicadores completos da seção 4).
- Script Python reproduzível em `src/`, resultados tabulares (CSV) em
  `output/`.

### Fora do escopo (por ora)
- Indicadores completos rodados para os 5 ativos individuais isoladamente
  (só entram na correlação).
- Gráficos/visualizações — só tabelas nesta etapa (avaliar depois, se virar
  artigo).
- Qualquer redação ou formatação para publicação no blog.
- Simulação/projeção futura (isso é o domínio do projeto PWR, já feito) —
  aqui é caracterização do **passado observado**, não simulação.

## 4. Indicadores por janela

Nominal e real onde aplicável (marcado abaixo):

| Indicador | Nominal | Real | Observação |
|---|---|---|---|
| CAGR (retorno anualizado) | sim | sim | |
| Volatilidade anualizada (desvio-padrão) | sim | sim | |
| Drawdown máximo | sim | sim | |
| Tempo de recuperação do drawdown máximo | sim | sim | em meses; se não recupera dentro da janela, busca estendida na série completa (ver decisions.md) |
| Ulcer Index | sim | sim | |
| Sharpe | sim | sim | taxa livre de risco = CDI oficial (`cdi_mensal.csv`), nominal e real via Fisher |
| Sortino | sim | sim | idem Sharpe |
| Calmar (CAGR / \|drawdown máx\|) | sim | sim | |
| Pior mês / melhor mês (dentro da janela) | sim | sim | |
| % meses positivos / % meses negativos | sim | não aplicável* | *tratado como conceito único, não nominal/real |
| VaR e CVaR históricos (corte 5%) | sim | sim | |
| Skewness e curtose dos retornos mensais | sim | sim | |
| Correlação entre os 5 ativos | — | — | matriz única, período completo, fora do loop de janelas |

Todas as decisões metodológicas desta tabela estão fechadas e registradas
em `decisions.md`.

## 5. Decisões metodológicas

Todas fechadas e registradas em `decisions.md`, com fonte/racional:

1. Taxa livre de risco: CDI oficial (`cdi_mensal.csv`), não o proxy via ETF.
2. Conversão nominal → real: fórmula de Fisher exata, `(1+nominal)/(1+ipca)-1`
   (confirmado por reprodução numérica da própria base original).
3. Drawdown/tempo de recuperação: busca estendida na série completa quando
   a janela em si não recupera; "não recuperado" só se nem a série inteira
   recupera.
4. Sharpe/Sortino/drawdown/Ulcer: calculados nominal e real.
5. Corte de cauda para VaR/CVaR: 5%.
6. Indicadores "propostos" (Calmar, VaR/CVaR, skew/curtose): entram todos
   já nesta primeira rodada.

Convenção de anualização (√12 para volatilidade, geométrica para CAGR) a
detalhar no `plan.md`, junto da fórmula exata de cada indicador.

## 6. Critérios de aceite

- Todas as decisões da seção 5 registradas em `decisions.md`, com fonte e
  racional, antes de implementadas no código.
- Script em `src/` auditável, sem "caixa-preta" (bibliotecas de
  estatística básica como numpy/pandas/scipy são aceitáveis; nada que
  esconda a fórmula do indicador).
- Saída: uma tabela por indicador (ou uma tabela larga única), com uma
  linha por tamanho de janela (12 a 180 meses) e colunas de
  mediana/mínimo/máximo/percentis (p10/p25/p75/p90 a definir em
  `decisions.md`) daquele indicador entre todas as janelas daquele
  tamanho.
- Matriz de correlação dos 5 ativos como tabela separada.
- Tudo reprodutível a partir do CSV em `retornos_mensais_carteira.csv`,
  sem dependência do restante do repositório.

## 7. Perguntas em aberto para o usuário

- Confirmar se este é só um primeiro corte (indicadores "core": CAGR, vol,
  drawdown, tempo de recuperação, Ulcer, Sharpe, Sortino, pior/melhor mês,
  % positivos/negativos, correlação) e os indicadores "propostos" (Calmar,
  VaR/CVaR, skew/curtose) ficam pra uma iteração seguinte — ou tudo entra
  junto desde já.
- Percentis de interesse para resumir a distribuição de cada indicador por
  tamanho de janela (proponho mediana + p10/p90 + mín/máx, mas confirmar).
