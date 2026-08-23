---
name: redacao-artigo-de-fontes
description: Leva um ou mais PDFs/documentos de pesquisa (papers acadêmicos, working papers, notas institucionais) até o primeiro rascunho em HTML de um artigo novo do blog Dinheiro em Pauta. Use quando o usuário enviar PDFs pedindo para avaliar se bastam para escrever um artigo, pedir para pesquisar mais fontes sobre um tema, pedir um resumo/curadoria de quais papers usar, pedir um esqueleto/outline de artigo baseado nas fontes, ou pedir para "escrever o artigo completo em HTML" a partir do material já reunido.
---

# De PDFs ao primeiro rascunho

Esta skill cobre o começo do processo de um artigo novo baseado em fontes técnicas — da chegada dos PDFs até o primeiro HTML publicável. Ela tem partes mecânicas (sempre no mesmo formato) e partes que são, por natureza, uma conversa com o usuário — misturar as duas é o erro mais fácil de cometer aqui.

## Passo 1 — Avaliar cada fonte com honestidade máxima (mecânico)

Para cada PDF enviado:

- **Leia o PDF inteiro**, não só o resumo/abstract — usando o `pdf-reading` como referência de estratégia de leitura por tipo de documento. Amostra, metodologia, achados principais e **as limitações que os próprios autores declaram** (nunca inventadas por você).
- **Confirme autor, título, ano, veículo direto no cabeçalho/primeira página do PDF** — nunca de memória, nunca por suposição a partir do nome do arquivo. Nomes de arquivo genéricos (`ssrn219228.pdf`, `graham1997.pdf`) já mentiram sobre o conteúdo real em sessões anteriores deste projeto — o nome do arquivo é uma pista, não uma fonte de verdade.
- Regra permanente do `CLAUDE.md`, "Nunca inventar referência": toda citação, todo número, toda alegação sobre premissa/metodologia de uma fonte só entra se você de fato verificou no PDF. Se não for possível verificar algo (link quebrado, paywall), diga isso ao usuário em vez de preencher o vazio com algo plausível.

## Passo 2 — Manter um índice de fontes desde a primeira leitura (mecânico)

Assim que ler o primeiro PDF — não espere ter vários pra começar —, crie um arquivo de trabalho no diretório de scratchpad da sessão: `fontes-<slug-provisorio>.md`. Uma linha por PDF:

```markdown
- **arquivo enviado**: nome-do-arquivo.pdf
- **identidade confirmada no cabeçalho**: Autor(es), "Título completo", Veículo, Ano
- **resumo (3-5 linhas)**: achados principais, tamanho/tipo de amostra, limitações declaradas
```

Atualize esse arquivo a cada novo PDF avaliado, em vez de reconstruir a lista de cabeça a cada resposta ao usuário. Isso existe porque, numa sessão anterior deste projeto, ler vários PDFs em lote no mesmo turno levou a trocar o conteúdo de um arquivo pelo de outro nas anotações — só descoberto numa auditoria final, por sorte sem contaminar o artigo publicado. O índice pego na hora custa segundos; reconstruir de memória semanas depois quase não pegou o erro.

## Passo 3 — PARE: análise de lacunas e curadoria é conversa, não procedimento

Depois de avaliar as fontes disponíveis, **não decida sozinho** se elas bastam para o artigo. Apresente ao usuário:

- O que as fontes atuais já sustentam com solidez.
- Onde há lacuna, viés (ex: fonte com conflito de interesse), ou generalização que a evidência não cobre.
- Se fizer sentido, use `AskUserQuestion` para perguntar como prosseguir — ex: "pesquiso candidatos e você traz os PDFs", "sigo com o que temos e trato a lacuna como limitação reconhecida no texto", "espero mais fontes suas antes de continuar".

Se o usuário pedir pesquisa adicional (via `WebSearch`), **candidatos encontrados por busca não viram fonte do artigo até serem lidos na íntegra** — trate-os como sugestões a confirmar, nunca cite um achado de um paper que você só viu em snippet de busca.

Quando o usuário pedir explicitamente uma lista curada ("quero só os mais sólidos e diretos"), produza a tabela pedida — mas a curadoria em si (o que é "sólido o bastante") é sempre uma chamada que passa pelo usuário antes de virar o conjunto final, nunca uma filtragem silenciosa sua.

## Passo 4 — PARE: monte e confirme o esqueleto antes de escrever

Antes do HTML, produza um esqueleto/outline mapeando cada seção planejada às fontes que a sustentam (título, subtítulo, promise, nivelamento básico, seções numeradas com as fontes de cada uma, notas de premissa necessárias, referências finais). Mostre isso ao usuário e só prossiga para o HTML depois de alguma confirmação ou pedido explícito ("escreva o artigo completo") — não pule direto de "fontes avaliadas" para "artigo pronto" sem esse checkpoint intermediário.

## Passo 5 — Montar o primeiro rascunho em HTML (mecânico)

Com o esqueleto confirmado:

1. Leia `internal/CHECKLIST-NOVO-ARTIGO.md` e `internal/template-artigo.html` — são o contrato do padrão do blog, não um ponto de partida opcional.
2. Leia um artigo já publicado (`grep` por qualquer `*/index.html` recente) como referência viva de tom, densidade de componente e estrutura — o checklist descreve o padrão, um artigo real mostra como ele fica aplicado.
3. Monte o HTML com os componentes do design system que o conteúdo pedir: `.glossary`, `.stat-card`, `.note`, `table.data`, `.steps-list`, `.recap`, `.mitigation-grid` — nunca invente um componente novo sem necessidade.
4. Gere, sem precisar que seja pedido: tempo de leitura (contagem de palavras do `.prose` real ÷ 200/min, nunca estimado de cabeça), bloco `#nivelamento-basico`, bullets do `.promise`, e o JSON-LD `FAQPage` com 3-4 perguntas geradas a partir do próprio conteúdo.
5. Toda citação no corpo (nome de autor, achado específico) tem que corresponder a algo que você de fato leu no PDF no Passo 1 — nunca ao que "parece razoável" o paper dizer.

## O que vem depois desta skill

Esta skill termina no rascunho em HTML pronto — **não inclui** os passos de acabamento e publicação, que têm skills e checklist próprios: `conferencia-tecnica-artigo` (auditoria do rascunho contra os PDFs) → ajustes → `clareza-e-fluidez` → `humanizer` → `citacao-numerada` → checklist de publicação (`internal/CHECKLIST-NOVO-ARTIGO.md`, seção 5: card, sitemap, feed, og-image, zip de fontes). Não tente comprimir essas etapas dentro desta skill — cada uma existe separadamente porque a ordem entre elas importa (ver `CLAUDE.md`, seção "Publicação de artigo novo").
