# Fontes — market-timing-funciona

Os PDFs originais **não são versionados neste repositório** (são conteúdo
com direitos autorais dos periódicos/editores — publicar num repositório
público seria redistribuição indevida). Esta pasta guarda só a referência
completa de cada um, para que possam ser reobtidos (assinatura
institucional, SSRN, biblioteca) sem depender do upload original na
conversa que gerou o artigo.

Usado para embasar `market-timing-funciona/index.html`, publicado em
23 ago. 2026, e conferido pela skill `conferencia-tecnica-artigo` no
mesmo dia.

## Citadas no artigo (fontes primárias)

1. SHARPE, William F. Likely gains from market timing. *Financial Analysts Journal*, v. 31, n. 2, p. 60-69, mar./abr. 1975.
2. BAUER, Rob J.; DAHLQUIST, Julie R. Market timing and roulette wheels. *Financial Analysts Journal*, v. 57, n. 1, p. 28-40, jan./fev. 2001.
3. DICHEV, Ilia D. What are stock investors' actual historical returns? Evidence from dollar-weighted returns. *American Economic Review*, v. 97, n. 1, p. 386-401, 2007. DOI: https://doi.org/10.1257/aer.97.1.386.
4. FRIESEN, Geoffrey C.; SAPP, Travis R. A. Mutual fund flows and investor returns: an empirical examination of fund investor timing ability. *Journal of Banking & Finance*, v. 31, n. 9, p. 2796-2816, 2007.
5. FULKERSON, Jon A.; JORDAN, Bradford D.; RILEY, Timothy B.; YAN, Xuemin (Sterling). Bad timing does not cost investors 15% of their funds' returns: an examination of Morningstar's "Mind the Gap" study. *Financial Analysts Journal*, no prelo, 2026.
6. GARAY, Urbi; PULGA, Fredy. The performance of retail investors, trading intensity and time in the market: evidence from an emerging stock market. *Heliyon*, v. 7, e08583, 2021. DOI: https://doi.org/10.1016/j.heliyon.2021.e08583.
7. BARBER, Brad M.; ODEAN, Terrance. Trading is hazardous to your wealth: the common stock investment performance of individual investors. *The Journal of Finance*, v. 55, n. 2, p. 773-806, 2000.
8. ELKIND, Daniel; KAMINSKI, Kathryn; LO, Andrew W.; SIAH, Kien Wei; WONG, Chi Heem. When do investors freak out? Machine learning predictions of panic selling. *The Journal of Financial Data Science*, v. 4, n. 1, p. 11-39, 2022. DOI: https://doi.org/10.3905/jfds.2021.1.085.
9. GRAHAM, John R.; HARVEY, Campbell R. Grading the performance of market-timing newsletters. *Financial Analysts Journal*, v. 53, n. 6, p. 54-66, 1997. DOI: https://doi.org/10.2469/faj.v53.n6.2130.
10. DICHTL, Hubert; DROBETZ, Wolfgang; KRYZANOWSKI, Lawrence. Timing the stock market: does it really make no sense? *Journal of Behavioral and Experimental Finance*, v. 12, p. 62-76, 2016. DOI: https://doi.org/10.1016/j.jbef.2016.09.001.

## Citadas só como apoio matemático/metodológico (não empírico)

11. METCALFE, Andrew. The mathematics of market timing. arXiv:1712.05031, dez. 2017. Preprint, sem revisão por pares — acesso aberto (arXiv), pode ser versionado se necessário; usado só como ilustração matemática, não como evidência empírica.
12. HENRIKSSON, Roy D.; MERTON, Robert C. On market timing and investment performance II: statistical procedures for evaluating forecasting skills. *The Journal of Business*, v. 54, n. 4, p. 513-533, 1981. Paper metodológico — fornece o teste estatístico usado por Garay & Pulga (2021), sem alegação empírica própria no artigo.

## Avaliadas durante a pesquisa, mas não usadas no artigo final

- COVAL, Joshua D.; HIRSHLEIFER, David; SHUMWAY, Tyler. Can individual investors beat the market? Harvard Business School / NBER working paper, set. 2005. (Foco em seleção de ações, não timing de mercado — excluída por escopo.)
- TRACHTENBERG. It's time in, not timing, the market that counts. *Journal of Private Portfolio Management*, outono 1999. (Autor é executivo de marketing de asset manager — conflito de interesse, excluída.)
- SHILLER, Robert J. Do stock prices move too much to be justified by subsequent changes in dividends? NBER Working Paper No. 456, fev. 1980. (Testa excesso de volatilidade/eficiência de mercado, não timing — excluída por escopo, ainda que seja um paper clássico.)
- BROOKS, Chris; WILLIAMS, Louis. When it comes to the crunch: retail investor decision-making during periods of market volatility. *International Review of Financial Analysis*, v. 80, 102038, 2022. (Survey com cenários hipotéticos, não dado de conta real — evidência mais fraca, deixada de fora do conjunto final "sólido e direto".)

## Nota sobre esta pasta

Os arquivos PDF em si ficam apenas no disco local da sessão que os
processou (não sobrevivem entre sessões/clones). Como esta sessão não
tinha acesso ao repositório-irmão `dinheiroempauta/dinheiro-em-pauta-fontes`
(anexado apenas o repositório principal), os 12 PDFs citados foram
empacotados num `.zip` e entregues ao usuário via `SendUserFile`, para
serem commitados manualmente no repositório de fontes numa sessão
separada — ver `CLAUDE.md`, seção "Repositório separado para os PDFs das
fontes", para o fluxo completo. Para reauditar este artigo no futuro,
reobtenha os PDFs pelas referências acima (ou pelo `.zip` já entregue) e
coloque-os nesta pasta antes de rodar `/conferencia-tecnica-artigo` — o
`.gitignore` já está configurado para não versionar `*.pdf` dentro de
`internal/fontes/*/`.
