# Relatório de Inspeção de Dados — Fase 1

**Data:** 2026-08-09
**Arquivo fonte:** `data/BD_Carteira_Claude.xlsx` (7 abas)
**Regra da fase:** apenas diagnóstico. Nenhuma decisão de tratamento é
tomada aqui — vai para `decisions.md` na Fase 2.

## Resumo por aba

| Aba | Linhas | Início | Fim | Frequência | Nulos | Duplicatas |
|---|---|---|---|---|---|---|
| IDIV | 260 | 2005-12 | 2026-07 | mensal | 0 | **12 linhas (2016 inteiro)** |
| Gold | 799 | 1960-01 | 2026-07 | mensal | 0 | 0 |
| IMA-B5 | 5.751 | 2003-09-16 | 2026-08-07 | **diária** | 1 (esperado, 1ª linha) | 0 |
| CDI | 481 | 1986-07 | 2026-07 | mensal | 0 | 0 |
| FTSE All-World | 275 | 2003-09 | 2026-07 | mensal | 0 | 0 |
| Câmbio | 6.681 | 1999-12-31 | 2026-08-06 | **diária** | 0 | 0 |
| IPCA | 319 | 1999-12 | 2026-06 | mensal | 0 | 0 |

## Achados relevantes

### 1. IDIV — datas duplicadas (2016 inteiro, 12 linhas)
Todo o ano de 2016 aparece duas vezes, com valores idênticos em cada par
(confirmado célula a célula — não é conflito de valores, é duplicação de
linha). Tratamento trivial: `drop_duplicates` por data. Registrar como
decisão formal na Fase 2 apenas por rastreabilidade (é mecânico, não exige
pesquisa).

### 2. IDIV — início em dez/2005, não set/2003
Todas as outras séries relevantes para o proxy do FTSE All-World e do
IMA-B5 começam em set/2003. O IDIV só começa em dez/2005 — **gap de ~2 anos
e 3 meses** no início da amostra. Isso força uma decisão explícita (Fase 2,
item já previsto no spec):
- Op. A: iniciar a simulação da carteira inteira em dez/2005 (perde ~2,25
  anos de histórico de todos os outros ativos).
- Op. B: manter os outros ativos desde set/2003 e usar algum proxy adicional
  só para o DIVO11 nesse sub-período (mais complexo, risco de introduzir
  outra fonte de erro).
- Op. C: pesquisar se existe série do IDIV B3 com histórico mais longo
  (o índice foi lançado oficialmente em 2011, mas a B3 costuma publicar
  retroativo — verificar).

Isso é a "Decisão 1" do plano (tratamento de ativo com histórico curto),
mas agora sabemos que é especificamente o IDIV, não os outros.

### 3. IMA-B5 e Câmbio estão em frequência diária, os demais em mensal
Precisa de agregação para mensal antes de combinar com as outras séries.
Isso é mecânico, mas a *convenção* de qual dia do mês representa "o mês"
(último dia útil vs. primeiro dia útil vs. fechamento) precisa ser
consistente entre todas as séries — os ativos mensais (IDIV, CDI, FTSE,
Gold, IPCA) usam o dia 1 do mês como rótulo, mas isso não deixa claro se o
valor é o fechamento do mês anterior ou do próprio mês. **Isso vira uma
pergunta a fazer antes de prosseguir** (ver seção "Perguntas ao usuário"
abaixo) — não é uma decisão que pesquisa resolve, é sobre a convenção da
fonte de dados original.

### 4. CDI — unidade e consistência
Valores em decimal (ex: 0,0122 = 1,22% ao mês), plausível: CAGR calculado
por composição mensal desde set/2003 = 11,11% a.a., compatível com a
trajetória conhecida da taxa CDI/Selic no Brasil no período (tetos de ~19%
a.a. em 2003 e 2015-16, mínima de ~2% a.a. em 2020-21). Sem tratamento
necessário além da agregação de frequência (já mensal).

### 5. FTSE All-World — checagem de consistência Total Return vs Price Return
CAGR calculado na série fornecida (set/2003 a jul/2026): **9,57% a.a. em
USD**. Comparação com dado oficial FTSE Russell (relatório LSEG/FTSE
Russell, out/2024): retorno anualizado de **7,7% a.a. em USD no período
2008–2024** (16 anos), citado explicitamente como **Total Return**. Como
2003–2008 foi um período de alta forte (pré-crise de 2008), é esperado que
o CAGR do período mais longo (2003–2026) seja *maior* que o do subperíodo
2008–2024 — o que bate com os 9,57% vs. 7,7%. Se a série fornecida fosse
Price Return (sem dividendos), o CAGR deveria ser sistematicamente **menor**
que o Total Return oficial, o que não é o caso. **Conclusão: a série é
consistente com Total Return.** Será registrado como decisão formal
(com fonte) na Fase 2.

### 6. IDIV — checagem de consistência Total Return
Pesquisa confirma que o IDIV B3, em sua versão histórica (publicada desde
2011, a versão usada por padrão), é definido pela própria B3 como **índice
de retorno total** — reinveste 100% dos proventos, sem distribuição. Uma
versão "Price Return" só foi lançada recentemente (2024) como opção
adicional, não substituindo a original. A série fornecida (CAGR de 13,13%
a.a. desde dez/2005) é compatível com essa natureza de retorno total.
**Conclusão: a série é consistente com Total Return**, que é também o que
precisamos para comparar com o DIVO11 (que reinveste proventos). Registrar
como decisão formal com fonte na Fase 2.

### 7. IMA-B5 — natureza do índice
Índices da família IMA (IMA-B5 incluso) são, por construção, índices de
retorno total: acumulam o carrego (juros/cupom) dos títulos públicos
indexados ao IPCA, não apenas a variação de preço. Não há uma versão
"Price Return" alternativa a distinguir aqui — a checagem de TR vs PR não
se aplica da mesma forma que para índices de ações. CAGR de 12,51% a.a.
desde set/2003 é compatível com a trajetória histórica de juros reais no
Brasil (NTN-Bs pagaram prêmios reais elevados em boa parte do período,
especialmente 2003-2006 e 2015-2016).

### 8. Gold — cobertura excedente
Série começa em 1960; só precisamos de set/2003 em diante. Sem problema de
qualidade, só vai ser recortada.

### 9. CDI e IPCA — cobertura excedente
Ambos cobrem período anterior a set/2003 (CDI desde 1986, IPCA desde
1999). Também serão recortados para o período de interesse.

## Perguntas ao usuário antes da Fase 2

1. **IDIV começa em dez/2005** — prefere (a) truncar toda a análise para
   começar em dez/2005, (b) que eu pesquise se há série do IDIV retroativa
   a 2003, ou (c) outra abordagem para os ~2,25 anos faltantes?
2. **Convenção de data nas séries mensais** (IDIV, CDI, FTSE All-World,
   Gold, IPCA): os valores rotulados com dia 1 do mês representam o
   fechamento *daquele* mês ou o valor no *início* daquele mês (= fechamento
   do mês anterior)? Isso afeta o alinhamento com IMA-B5 e Câmbio (diários,
   que serão agregados para fechamento mensal). Você sabe a convenção da
   fonte de onde tirou os dados, ou devo inferir comparando datas de
   pregão/feriados?
3. Confirma que os proxies devem cobrir exatamente o período **set/2003 até
   o mês mais recente completo** (jul/2026), dado que essa é a interseção
   de cobertura após resolver o ponto 1?

## Próximo passo

Aguardando resposta às perguntas acima antes de prosseguir para a Fase 2
(decisões formais de metodologia, incluindo tamanho de bloco do bootstrap,
critério de sucesso, etc., já listadas em `spec.md`).
