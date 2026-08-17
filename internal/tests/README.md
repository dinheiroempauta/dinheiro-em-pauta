# Testes automáticos

Cobre as fórmulas financeiras dos artigos/simuladores. Roda com Node puro,
sem instalar nada:

```
node --test internal/tests
```

## Por que extrai do HTML em vez de duplicar a função aqui

O site não tem build — cada cálculo vive dentro de um `<script>` inline no
próprio `index.html` do artigo. Se os testes tivessem uma cópia própria da
fórmula, a cópia poderia divergir do código real publicado sem o teste
perceber. Em vez disso, `extract-fn.js` lê o `index.html` de verdade, extrai
o texto-fonte da função pelo nome (contando chaves pra achar onde ela
termina) e executa esse texto num sandbox (`vm` do Node) — ou seja, o teste
roda exatamente o código que está no ar.

Duas formas de carregar:

- `loadFunctions(caminhoHtml, ['nomeDaFuncao', ...])` — quando a função não
  depende de nenhuma variável de módulo (só dos próprios parâmetros).
- `loadFunctionsWithPrelude(caminhoHtml, [marcadorInicio, marcadorFim], [...])`
  — quando a função depende de uma constante declarada antes dela no mesmo
  `<script>` (ex: uma tabela de feriados). Os marcadores delimitam o trecho
  de código a incluir junto.

## Cobertura atual

- `taxa-real-liquida.test.js` — fórmula central de `ipca-hiperinflacao`
  (taxa real líquida de um Tesouro IPCA+, o ponto que o artigo defende).
- `pu-renda-mais.test.js` — contagem de dias úteis e regras de calendário
  do simulador de PU (`pu-renda-mais`; `pu-educa-mais` usa a mesma lógica).
- `sync-cards.test.js` — testa `internal/tools/sync-cards.js` (a
  ferramenta que confere/corrige eyebrow, título, data e tempo de leitura
  dos cards contra o artigo real) contra um fixture temporário isolado,
  nunca contra o repositório de verdade, mesmo em modo `--apply`.

Não cobre (ainda): `quanto-posso-retirar-aposentadoria`,
`pwr-carteira-fire`, `montar-carteira-estudo-de-caso`,
`simuladores/comparador-composicao`. Pra estender, siga o mesmo padrão:
identifique a função pura central do cálculo, extraia com
`loadFunctions`/`loadFunctionsWithPrelude`, teste casos de borda conhecidos
(zero, valores extremos, uma invariante que o artigo defende).
