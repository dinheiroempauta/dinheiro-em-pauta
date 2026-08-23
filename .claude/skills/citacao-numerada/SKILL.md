---
name: citacao-numerada
description: Aplica ou audita citação numerada estilo livro (nota sobrescrita no corpo do texto, ligada por link à lista de referências) num artigo do blog Dinheiro em Pauta. Use sempre que o usuário pedir para "adicionar citação numerada", "linkar as referências", "fazer nota de rodapé estilo livro", "conferir se as fontes estão citadas corretamente no texto", ou quando um artigo novo tiver seção de "Referências técnicas"/"Notas e referências" e ainda não tiver marcadores no corpo apontando para ela.
---

# Citação numerada estilo livro

Liga cada afirmação do corpo do artigo à sua fonte na lista de referências, do jeito que um livro físico faz: um número sobrescrito no texto, que o leitor pode clicar para pular até a referência completa lá embaixo — sem precisar caçar o nome do autor manualmente na lista.

## Quando usar

- Ao publicar um artigo novo que cita papers/fontes técnicas (parte do checklist de publicação, ver `internal/CHECKLIST-NOVO-ARTIGO.md`).
- Quando o usuário pedir para conferir/adicionar esse padrão num artigo já publicado.
- **Não** use como parte do rascunho inicial — rode isso só depois que o texto do artigo já estiver na versão final (depois do `humanizer` e da revisão de clareza/storytelling, se houver uma). Retrofit prematuro obriga a redigitar os marcadores se o texto mudar de ordem depois.

## O componente já existe — não reinvente

`assets/site.css` já tem o CSS pronto:

```css
sup.cite{ font-size: 0.68em; line-height: 0; margin-left: 1px; }
sup.cite a{ color: var(--green); text-decoration: none; padding: 0 1px; font-weight: 600; }
sup.cite a:hover{ color: var(--brick); text-decoration: underline; }
.disclaimer ol li:target, .refs ol li:target{ color: var(--ink); background: var(--gold-soft); border-radius: 2px; padding: 2px 6px; margin-left: -6px; }
.disclaimer ol li[id]{ scroll-margin-top: 90px; }
```

Marcação a usar no corpo do artigo:

```html
William Sharpe<sup class="cite"><a href="#ref-1">1</a></sup>, em 1975, fez o teste...
```

E na lista de referências (`.disclaimer` com `<div class="cap">Referências técnicas</div>` ou `<div class="cap">Notas e referências</div>`):

```html
<li id="ref-1">SHARPE, William F. Likely gains from market timing. ...</li>
```

Não crie um componente novo, não redefina cores/estilo — reaproveite exatamente esse.

## Passo a passo

1. **Leia a lista de referências primeiro.** A numeração dos marcadores segue a ordem em que as fontes aparecem *nessa lista*, não a ordem em que são mencionadas no corpo. Anote autor(es)/tema de cada item, na ordem.

2. **Para cada referência, ache a primeira menção substantiva no corpo do artigo.**
   - Se a fonte é citada pelo nome do autor em algum parágrafo ("William Sharpe...", "Ilia Dichev respondeu..."), o marcador vai logo depois do nome (ou do último nome, se forem vários autores em sequência: "Hubert Dichtl, Wolfgang Drobetz e Lawrence Kryzanowski<sup>...</sup>").
   - Se a fonte não é atribuída a um autor no texto (comum em notas de dados/metodologia, ex: "Um estudo de 2022 mostrou..."), o marcador vai no fim da frase que introduz o achado ("Um estudo de 2022<sup>...</sup>, conduzido por...").
   - Se dois papers são citados juntos na mesma frase (ex: "os estudos de Brinson (1986 e 1991)"), cada um leva seu próprio marcador, colado ao ano correspondente: `(1986<sup>2</sup> e 1991<sup>3</sup>)`.

3. **Quando a fonte NÃO tem uma "primeira menção" clara e única — não force.** Isso acontece em dois padrões reconhecíveis:
   - A referência é uma fonte de dados genérica usada implicitamente ao longo de todo o artigo (ex: uma série do Banco Central usada por trás de um simulador inteiro), sem um parágrafo específico que a "cite".
   - O artigo nunca nomeia nenhum autor no corpo (comum em artigos de metodologia própria, tipo explicação de bootstrap estatístico), e várias referências da lista cobrem aspectos técnicos parecidos — colocar o marcador arriscaria atribuir o trecho errado ao paper errado.

   Nesses casos, **pule esse artigo (ou essa referência específica) e diga isso explicitamente ao usuário**, com o motivo — não invente um lugar só para preencher a lacuna. Casos reais já encontrados: `ipca-hiperinflacao` (referência é fonte de dados genérica + aviso de preço variável, não citação pontual) e `pwr-carteira-fire` (nenhum dos 8 autores é nomeado em nenhum ponto do corpo).

4. **Aproveite para conferir a própria nota de referência.** Notas que mencionam "a afirmação da seção X" ou "os números da seção Y" precisam apontar para a seção certa — confira contra os `id="sec-NN"` reais do artigo. Já foram encontrados e corrigidos dois casos de número de seção errado (`montar-carteira-estudo-de-caso`) só por causa desse processo de achar a "primeira menção".

5. **Aplique os marcadores e os `id`.** Use `Edit`, nunca reescreva o parágrafo inteiro — a mudança deve ser cirúrgica (só inserir `<sup class="cite">...</sup>` e `id="ref-N"`), sem alterar nenhuma palavra do texto original.

## Conferência obrigatória depois (nunca pule)

Depois de aplicar, rode esta checagem em cada artigo tocado — sem exceção, mesmo que pareça óbvio que deu certo:

```bash
# 1. Todo href="#ref-N" tem exatamente um id="ref-N" correspondente, e vice-versa
grep -o 'href="#ref-[0-9]*"' <arquivo> | sed 's/href="#ref-//;s/"//' | sort -n
grep -o 'id="ref-[0-9]*"' <arquivo> | sed 's/id="ref-//;s/"//' | sort -n
# as duas listas têm que ser idênticas

# 2. Sem id duplicado
grep -o 'id="ref-[0-9]*"' <arquivo> | sort | uniq -d
# tem que vir vazio

# 3. Tags balanceadas (cuidado: <link> contém "<li", filtre com <li[ >] )
python3 -c "
import re
s = open('<arquivo>', encoding='utf-8').read()
print('sup:', len(re.findall(r'<sup', s)), len(re.findall(r'</sup>', s)))
print('a:', len(re.findall(r'<a ', s)), len(re.findall(r'</a>', s)))
"
```

Depois, **releia cada marcador no contexto, ao lado do texto da referência correspondente**, para confirmar que o número aponta pro paper certo — a checagem estrutural acima garante que os links não quebram, mas não garante que o número 4 é de fato o paper certo. Nunca considere a tarefa concluída só com a checagem estrutural passando.

Por fim: `node internal/tools/sync-cards.js --check` (esse retrofit não deveria mudar eyebrow/título/data, mas confirme).

## Reportar, nunca esconder

Ao final, diga ao usuário exatamente: quantos artigos foram tocados, quantas referências foram linkadas em cada um, e quais referências/artigos foram deliberadamente pulados e por quê. Um artigo pulado por ambiguidade não é uma falha silenciosa — é uma decisão a ser comunicada.
