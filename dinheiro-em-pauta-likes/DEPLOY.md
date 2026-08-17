# Deploy do Worker de curtidas (nome novo, Fase 2 do rebrand)

Tudo a partir desta pasta (`dinheiro-em-pauta-likes/`). Worker novo, em
paralelo ao antigo (`cloudflare-worker/`, ainda no ar) — contador de
curtidas começa do zero.

## 1. Criar o namespace KV

```
wrangler kv namespace create LIKES
```

Copia o `id` que o comando devolve e cola em `wrangler.toml`, no lugar de
`COLE_AQUI_O_ID_DO_KV_NAMESPACE`.

## 2. Deploy

```
wrangler deploy
```

Anota a URL que aparece no final.

## 3. Testar

```
curl "SUA_URL_NOVA/likes?slug=pwr-carteira-fire"
```
Resposta esperada: `{"slug":"pwr-carteira-fire","count":0}`.

```
curl -X POST "SUA_URL_NOVA/likes?slug=pwr-carteira-fire" -H "Origin: https://dinheiroempauta.com.br"
```
Resposta esperada: `{"slug":"pwr-carteira-fire","count":1}`.

## 4. Depois de testado

Me avisa a URL final — eu troco `LIKES_API` em `assets/site.js` pra
apontar pra ela. Só depois disso o Worker antigo (`cloudflare-worker/`)
deve ser apagado.
