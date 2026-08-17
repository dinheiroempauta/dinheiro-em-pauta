# Dinheiro em Pauta — guia de configuração

Este pacote já está pronto para publicar. Siga os passos abaixo uma única vez;
depois disso, publicar um novo artigo leva menos de 1 minuto.

## Estrutura do projeto

```
dist/
  index.html                                 → página inicial (lista de artigos)
  pwr-carteira-fire/index.html                → artigo 1
  ipca-hiperinflacao/index.html                → artigo 2
  quanto-posso-retirar-aposentadoria/index.html → artigo 3
  .nojekyll                                   → obrigatório p/ GitHub Pages não processar o site com Jekyll
  dinheiro-em-pauta-likes/
    likes-worker.js                          → código do contador de curtidas
    wrangler.toml                            → config de deploy do worker
```

Cada artigo fica em uma **pasta com o nome do artigo** contendo um `index.html`.
Isso dá URLs limpas automaticamente: `dinheiroempauta.com.br/pwr-carteira-fire`
funciona em qualquer host estático, sem configuração extra.

---

## Passo 1 — Publicar no GitHub Pages (gratuito)

1. Crie uma conta no [github.com](https://github.com) se ainda não tiver.
2. Crie um repositório novo, público, chamado `independencia-calculada` (ou o nome que quiser).
3. Suba todo o conteúdo da pasta `dist/` para a raiz do repositório (pode arrastar os arquivos direto na interface web do GitHub, em "Add file → Upload files").
4. Vá em **Settings → Pages**.
5. Em "Source", selecione a branch `main` e a pasta `/ (root)`. Salve.
6. Em alguns minutos seu site estará no ar em `https://SEU-USUARIO.github.io/independencia-calculada/`.

> Nesse endereço temporário os links internos (`/pwr-carteira-fire`, etc.) não vão
> funcionar perfeitamente por causa do subcaminho do repositório. Isso se resolve
> sozinho assim que você configurar o domínio próprio no Passo 2 — não se preocupe
> com isso agora, é só um estágio intermediário.

## Passo 2 — Domínio próprio (quando decidir comprar)

1. Compre o domínio em qualquer registrador (Registro.br para `.com.br`, ou Namecheap/Cloudflare para outros).
2. No DNS do domínio, crie:
   - Um registro `A` apontando `@` para os IPs do GitHub Pages: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - Um registro `CNAME` apontando `www` para `SEU-USUARIO.github.io`
3. No repositório, crie um arquivo chamado `CNAME` (sem extensão) na raiz, contendo apenas:
   ```
   dinheiroempauta.com.br
   ```
4. Em **Settings → Pages**, digite o domínio próprio no campo "Custom domain" e marque "Enforce HTTPS".

Isso não quebra nada do que já está pronto — todos os links internos já foram
escritos para o domínio final (`dinheiroempauta.com.br`), então funcionam
perfeitamente assim que o domínio estiver ativo.

---

## Passo 3 — Curtidas (Cloudflare Workers, gratuito)

1. Crie uma conta gratuita em [cloudflare.com](https://cloudflare.com).
2. Instale a CLI (requer Node.js instalado):
   ```
   npm install -g wrangler
   wrangler login
   ```
3. Dentro da pasta `dinheiro-em-pauta-likes/`, crie o namespace de dados:
   ```
   wrangler kv namespace create LIKES
   ```
   Isso devolve um `id`. Cole esse `id` no arquivo `wrangler.toml`, no lugar de
   `COLE_AQUI_O_ID_DO_KV_NAMESPACE`.
4. Publique o worker:
   ```
   wrangler deploy
   ```
5. O comando devolve uma URL parecida com:
   `https://independencia-likes.SEU-SUBDOMINIO.workers.dev`
6. Em **cada** arquivo `index.html` de artigo, procure por (perto do fim do arquivo):
   ```js
   var API = 'https://independencia-likes.SEU-SUBDOMINIO.workers.dev';
   ```
   e substitua pela URL real que você recebeu no passo 5.
7. Abra `dinheiro-em-pauta-likes/likes-worker.js` e confirme que `ALLOWED_ORIGIN`
   está com o seu domínio final correto.

## Passo 4 — Comentários anônimos com moderação (Worker próprio)

Desde 17/08/2026 os comentários **não usam mais o Cusdis** (o widget
hospedado deles roda em iframe de outra origem e não permitia customizar
o visual — ficava sempre "torto" em relação ao design do site). O sistema
atual é um Cloudflare Worker próprio (`dinheiro-em-pauta-comments/`), com
banco D1, que renderiza o formulário e a lista de comentários direto no
HTML do site — mesmo comportamento de antes (anônimo, e-mail opcional,
fila de moderação manual), mas com controle visual total.

1. Siga o passo a passo completo em `dinheiro-em-pauta-comments/DEPLOY.md`
   (`wrangler d1 create`, secrets, `wrangler deploy`).
2. Depois do deploy, todo comentário novo entra como `pending` — aprove ou
   rejeite no painel próprio em
   `https://independencia-comments.dinheiroempauta.workers.dev/admin`
   (login com o `ADMIN_TOKEN` configurado no deploy). Também dá pra usar
   `curl` nos endpoints `/admin/*` (comandos exatos no `DEPLOY.md`) ou o
   console D1 do dashboard da Cloudflare, se preferir.
3. O leitor não precisa de conta, só digita nome (e e-mail opcional) —
   igual ao comportamento anterior.
4. (Opcional) Configure `RESEND_API_KEY` — seção 3.1 do `DEPLOY.md` — pra
   notificar por e-mail quando um comentário é aprovado/rejeitado ou
   quando alguém responde. Sem isso, tudo funciona igual, só sem
   notificação.

## Passo 5 — Favicon

Os arquivos já referenciam `/favicon.png`. Basta colocar um arquivo PNG
quadrado (ex: 512×512) com esse nome exato na raiz do repositório.

---

## Fluxo de publicação de um novo artigo

Esse é o fluxo que você já usa e que continua igual:

1. Você escreve o conteúdo em Word.
2. Me manda o conteúdo aqui no chat, junto com uma instrução do tipo
   "gera esse artigo seguindo o padrão dos outros 3".
3. Eu parto de `internal/template-artigo.html` (o esqueleto oficial do
   design system) em vez de escrever o HTML do zero, e confiro o resultado
   contra `internal/CHECKLIST-NOVO-ARTIGO.md` antes de entregar. Isso já
   garante automaticamente:
   - todas as meta tags de SEO (title, description, Open Graph, Twitter Card,
     canonical, JSON-LD de Article + BreadcrumbList, e FAQPage quando cabível)
   - bloco de curtir/compartilhar
   - seção de comentários (Worker próprio, ver Passo 4 acima)
   - barra de navegação "← Todos os artigos", progress bar, TOC e botão
     "voltar ao topo"
4. Também gero a imagem de capa (og:image) seguindo o prompt padronizado em
   `internal/prompt-og-image-independencia-calculada.md`.
5. Você cria uma pasta nova no repositório com o slug do artigo (ex: `nome-do-artigo/`)
   e sobe o `index.html` gerado dentro dela, junto com a imagem em `assets/`.
6. Eu te devolvo também: o card pronto pra colar em `index.html` (home), a
   entrada nova para `sitemap.xml` e o `<item>` novo para `feed.xml` — os
   três últimos passos do checklist, pra nada ficar esquecido.

Isso significa que, a partir de agora, cada novo artigo que você me mandar já sai
pronto com curtidas, comentários, compartilhamento e todo o SEO — sem trabalho
manual extra de sua parte, e sem depender da minha memória para não esquecer
nenhum item: `internal/CHECKLIST-NOVO-ARTIGO.md` é a fonte de verdade.
