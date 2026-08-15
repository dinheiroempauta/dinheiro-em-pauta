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
- 241 observações mensais, `2006-01-01` a `2026-06-01`.
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
  **cada** janela possível daquele tamanho (ex: janela de 5 anos = 241-60+1
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
| Drawdown máximo | a decidir | a decidir | ver decisions.md |
| Tempo de recuperação do drawdown máximo | a decidir | a decidir | em meses; janelas sem recuperação dentro do próprio período: tratamento a definir |
| Ulcer Index | a decidir | a decidir | |
| Sharpe | a decidir | a decidir | precisa de taxa livre de risco — fonte a definir |
| Sortino | a decidir | a decidir | idem Sharpe |
| Calmar (CAGR / \|drawdown máx\|) | a decidir | a decidir | proposto — mede retorno por unidade de pior perda |
| Pior mês / melhor mês (dentro da janela) | sim | sim | |
| % meses positivos / % meses negativos | sim | não aplicável* | *tratado como conceito único, não nominal/real |
| VaR e CVaR históricos (mensal, ex: 5%) | sim | sim | proposto — cauda de perda mais realista que só "pior mês" |
| Skewness e curtose dos retornos mensais | sim | sim | proposto — assimetria e "gordura de cauda" |
| Correlação entre os 5 ativos | — | — | matriz única, período completo, fora do loop de janelas |

Itens marcados "a decidir" viram entradas em `decisions.md` antes de
implementar (taxa livre de risco para Sharpe/Sortino, convenção de
anualização, tratamento de drawdown que não recupera dentro da janela,
etc.) — nenhuma dessas decisões deve ser tomada silenciosamente no código.

## 5. Decisões metodológicas pendentes (a resolver antes do código, na ordem)

Cada uma vira entrada em `decisions.md` com fonte/racional quando resolvida.

1. Taxa livre de risco para Sharpe/Sortino: qual série usar (CDI já está na
   base como `ret_cdib11`? ou taxa livre de risco "real" via IPCA+ curto?) e
   se varia por mês ou é constante.
2. Convenção de anualização de volatilidade e CAGR (√12, geométrica vs.
   aritmética) — manter consistência com o que já foi decidido no projeto
   PWR (`internal/pwr-project/docs/decisions.md`), se aplicável.
3. Drawdown/tempo de recuperação: como tratar janela em que o drawdown
   máximo não recupera antes do fim da própria janela (marcar como "não
   recuperado" vs. estender a busca além da janela usando a série completa).
4. Sharpe/Sortino/drawdown/Ulcer: calcular só sobre a série real, só sobre a
   nominal, ou ambas (a série nominal mistura retorno com inflação, o que
   pode distorcer risco ajustado — avaliar qual é mais informativa aqui).
5. Definição de sucesso/corte para VaR e CVaR (ex: 5%, 10%?).
6. Confirmar se a lista de indicadores "propostos" (Calmar, VaR/CVaR,
   skew/curtose) deve entrar nesta primeira rodada ou fica pra uma segunda
   passada.

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
