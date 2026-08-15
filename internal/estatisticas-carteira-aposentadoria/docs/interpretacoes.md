# Interpretações — leituras e explicações já validadas

Análises textuais dos indicadores/gráficos desta pasta, geradas durante
exploração com o usuário. Diferente de `decisions.md` (decisões
metodológicas de *como calcular*), este arquivo guarda *o que os números
significam* — material que pode alimentar diretamente o texto do artigo
futuro.

## Ulcer Index — nominal vs. real, por tamanho de janela

**Gráfico:** `graficos/ulcer-funil-percentis.html` (funil de percentis
p5–p95/p20–p80, mediana, pior/melhor caso, toggle nominal/real).

### Formato geral: sobe, atinge um pico entre 8-10 anos, depois cede

| | Mediana 1 ano | Pico (ano) | Mediana 15 anos |
|---|---|---|---|
| Nominal | 0,59 | 1,36 (ano 8) | 1,21 |
| Real | 1,13 | 3,88 (ano 10) | 3,39 |

O Ulcer não cresce indefinidamente com o tempo — acumula "dor"
(profundidade × duração de drawdowns) até um ponto, depois a mediana
relaxa porque a janela passa a incluir mais anos recentes saudáveis
(2023–2026), diluindo a dor histórica de 2008/2020/2021-22.

### Cauda longa em janelas curtas = assinatura de crise pontual

Em janelas de 1 ano, a mediana real é 1,13 mas o p95 é 5,51 e o máximo é
11,29 — quase 10x a mediana. Distribuição bem assimétrica: a maioria dos
anos individuais foi tranquila, uma fração pequena (anos que capturam
2008 e 2020) foi extremamente dolorosa.

Conforme a janela cresce, essa assimetria desaparece: em 10 anos, mediana
real = 3,88 e p95 = 4,37 — a distância entre "típico" e "pior caso
extremo" praticamente some.

**Mensagem central do gráfico:** quanto mais tempo investido, menos a
experiência do investidor depende de "sorte de timing" e mais ela se
aproxima do comportamento típico da carteira.

### Real sistematicamente maior que nominal, gap cresce até 10 anos

| Anos | Gap mediana (real − nominal) |
|---|---|
| 1 | 0,54 |
| 5 | 0,94 |
| 10 | 2,56 (máximo) |
| 15 | 2,18 |

O gap não é constante — cresce até os 10 anos e depois encolhe um pouco,
no mesmo formato de sino que cada série tem isoladamente. Inflação
corrosiva precisa de tempo para se acumular e criar "dor real" que o
nominal não vê — mas depois de um certo ponto, o mesmo efeito de diluição
por anos bons recentes que afeta a mediana isolada também afeta o gap
entre as duas séries.

**Causa raiz do gap, identificada nos dados brutos:** o surto
inflacionário de 2021-2022 (IPCA acumulado de 16,4% nesses dois anos,
contra média histórica de ~0,5-0,6%/mês). Em janelas de 10 anos
terminando entre dez/2021 e jun/2022, o drawdown máximo **nominal** mal
se move (-6,6% → -6,6%), mas o **real** quase dobra (-6,9% → -12,3%). A
carteira em preço de mercado não caiu muito — mas como a inflação corria
muito mais rápido que o retorno nominal, o poder de compra afundou. Meses
com retorno nominal positivo (ex: +1,1% em mar/2022) tiveram retorno real
negativo (-0,5%) porque a inflação do mês (1,6%) consumiu o ganho
inteiro.

### Nominal em 9-10 anos: salto de p50 (~1,3) para p80 (~3,1)

Indica um grupo bem definido de ~20% das janelas (as que pegam a crise de
2008 inteira) com Ulcer muito mais alto que a maioria — quase bimodal
entre "peguei uma crise séria" e "não peguei". O salto é bem mais suave
nas janelas de 12-15 anos, porque nelas quase todas as janelas já incluem
alguma crise — o grupo "sortudo" desaparece.

### Síntese para o artigo

O Ulcer Index mostra dois efeitos simultâneos e complementares:
1. Tempo reduz a dependência de sorte de timing (a banda de percentis
   encolhe conforme a janela cresce).
2. A inflação tem um efeito cumulativo de dor que só aparece plenamente
   na série real, quase invisível na nominal — o gap entre as duas é a
   evidência visual mais direta de por que "olhar só para o nominal" é
   enganoso para quem vive de renda.
