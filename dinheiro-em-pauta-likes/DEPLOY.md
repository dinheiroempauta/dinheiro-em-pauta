# Deploy do Worker de curtidas

Tudo a partir desta pasta (`dinheiro-em-pauta-likes/`).

**Só quer atualizar o código do Worker (ex: depois que eu mudo algo em
`likes-worker.js`)?** Pula direto pro passo 2 — o namespace KV do passo
1 só precisa ser criado uma vez.

## 1. Criar o namespace KV

```
wrangler kv namespace create dinheiro_em_pauta_likes
```
(O título pode ser diferente de `LIKES` — títulos de namespace precisam
ser únicos na conta. O `binding` no `wrangler.toml` continua `"LIKES"`,
é o que o código usa.)

Copia o `id` que o comando devolve e cola em `wrangler.toml`, no lugar de
`COLE_AQUI_O_ID_DO_KV_NAMESPACE`.

## 2. Deploy

```
wrangler deploy
```

Anota a URL que aparece no final (deve ser
`https://dinheiro-em-pauta-likes.independenciacalculada.workers.dev`).

## 3. Testar

```
curl "https://dinheiro-em-pauta-likes.independenciacalculada.workers.dev/likes?slug=pwr-carteira-fire"
```
Resposta esperada: `{"slug":"pwr-carteira-fire","count":0}`.

```
curl -X POST "https://dinheiro-em-pauta-likes.independenciacalculada.workers.dev/likes?slug=pwr-carteira-fire" -H "Origin: https://dinheiroempauta.com.br"
```
Resposta esperada: `{"slug":"pwr-carteira-fire","count":1}`.
