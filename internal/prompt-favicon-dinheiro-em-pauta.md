# Prompt: gerar favicon novo para o Dinheiro em Pauta

Rebrand Fase 5 — o favicon atual (`favicon.png`, raiz do repositório) tem o
monograma "IC" (Independência Calculada), que não faz mais sentido depois
do rebrand pra "Dinheiro em Pauta". Este prompt gera o substituto, seguindo
o mesmo processo/estilo do favicon atual.

Cole o prompt abaixo numa ferramenta de geração de imagem.

---

## PROMPT

Crie um favicon (ícone de app) para o blog **Dinheiro em Pauta**, em PNG
**512×512px**, fundo **não-transparente** (cantos arredondados tipo
"app icon", squircle — não um círculo nem um quadrado com cantos vivos).

### Estilo (replicar exatamente a lógica do favicon atual, "IC" → "DP")

- **Fundo**: verde escuro sólido, `#123B2A` (mesmo tom de `--green-deep`
  do design system do site, `assets/site.css`) — não usar gradiente.
- **Monograma**: as duas letras **"DP"** centralizadas, em creme/marfim
  claro `#EDE0C4` (mesmo tom de `--gold-soft` do site), preenchendo a
  maior parte do quadro (margem pequena e uniforme nas quatro bordas).
- **Tipografia do monograma**: serifada, peso bold/black, com leve
  variação editorial entre as duas letras (no favicon anterior o "I" tinha
  serifas em traço fino tipo slab/old-style e o "C" era uma serifada
  clássica de peso mais leve — replique essa mesma sensação "editorial,
  não corporativa" nas letras "D" e "P": ambas na mesma família serifada,
  mas sem parecer um logotipo de fonte única genérica).
- **Traço de destaque**: uma linha horizontal fina, cor dourada `#7A5820`
  (mesmo tom de `--gold` do site), centralizada logo abaixo do monograma,
  bem mais curta que a largura das letras — é a mesma assinatura visual
  usada no favicon atual, não pule esse elemento.
- **Sem**: sombras, brilho, textura, gradiente, contorno/stroke adicional
  nas letras, ícones, ou qualquer elemento fora do monograma + traço.

### O que NÃO fazer

- Não usar a paleta clara do site (`--paper`/`--ink`) — o favicon é sempre
  fundo escuro, para ter contraste em aba de navegador clara ou escura.
- Não inventar cores fora dos tokens listados acima.
- Não deixar as letras "D" e "P" pequenas/centralizadas com muita margem —
  o favicon precisa ser legível em 16×16px (tamanho real de aba de
  navegador), então o monograma tem que ocupar a maior parte do quadro.

### Entrega

- Arquivo único, 512×512px, PNG.
- Confirmar dimensões exatas antes de entregar.
- Salvar em `/mnt/user-data/outputs/favicon.png` e usar `present_files`
  para entregar (mesmo nome do arquivo atual — ao subir no repositório,
  o arquivo antigo é simplesmente sobrescrito, já que `favicon.png` é
  referenciado por nome fixo em todas as páginas, sem versionamento de
  URL como as og-images).

---

*Depois de gerado e aprovado, o usuário sobe o arquivo substituindo
`favicon.png` na raiz do repositório — nenhuma mudança de código é
necessária, o nome do arquivo não muda.*
