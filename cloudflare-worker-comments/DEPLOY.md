# Deploy do Worker de comentários

Rode isso com a conta Cloudflare já logada no `wrangler` (`wrangler login`,
se ainda não tiver feito). Tudo a partir desta pasta
(`cloudflare-worker-comments/`).

## 1. Criar o banco D1

```
wrangler d1 create independencia-comments-db
```

Copia o `database_id` que o comando devolve e cola em `wrangler.toml`, no
lugar de `COLE_AQUI_O_DATABASE_ID`.

## 2. Rodar o schema

```
wrangler d1 execute independencia-comments-db --remote --file=schema.sql
```

## 3. Configurar os secrets

```
wrangler secret put ADMIN_TOKEN
```
Cola qualquer string longa e aleatória (ex: gerada com
`openssl rand -hex 32`) — é o token que protege os endpoints `/admin/*`.
Guarda esse valor, você vai precisar dele pra aprovar comentários.

```
wrangler secret put IP_SALT
```
Outra string aleatória qualquer (ex: `openssl rand -hex 16`) — só é usada
pra hashear IP, nunca precisa ser lembrada por você depois.

## 4. Deploy

```
wrangler deploy
```

Anota a URL que aparece no final (deve ser
`https://independencia-comments.independenciacalculada.workers.dev` — se
vier diferente, ex. `SEU_USUARIO.workers.dev`, me avisa que eu ajusto o
`data-comments-api` nas páginas e o CORS no Worker pra bater com a URL
real).

## 5. Testar os endpoints

Comentar (deve entrar como pendente):
```
curl -X POST https://independencia-comments.independenciacalculada.workers.dev/comments \
  -H "Content-Type: application/json" \
  -H "Origin: https://independenciacalculada-droid.github.io" \
  -d '{"slug":"pwr-carteira-fire","nickname":"Teste","email":"","message":"Comentário de teste"}'
```
Resposta esperada: `{"status":"pending"}`.

Listar pendentes (troca `SEU_TOKEN` pelo valor que você colou no passo 3):
```
curl "https://independencia-comments.independenciacalculada.workers.dev/admin/pending?token=SEU_TOKEN"
```

Aprovar (troca `ID` pelo id retornado acima):
```
curl -X POST https://independencia-comments.independenciacalculada.workers.dev/admin/moderate \
  -H "Content-Type: application/json" \
  -d '{"token":"SEU_TOKEN","id":ID,"action":"approve"}'
```

Ver se aparece na listagem pública:
```
curl "https://independencia-comments.independenciacalculada.workers.dev/comments?slug=pwr-carteira-fire"
```

Rejeitar/apagar um comentário (mesma rota, `action` diferente):
```
curl -X POST https://independencia-comments.independenciacalculada.workers.dev/admin/moderate \
  -H "Content-Type: application/json" \
  -d '{"token":"SEU_TOKEN","id":ID,"action":"reject"}'
```

## 6. Moderar no dia a dia (até existir painel HTML)

Pendência conhecida do projeto — ainda não existe painel de moderação
próprio. Por enquanto, moderar comentários novos com os dois comandos
`curl` do passo 5 (listar pendentes + aprovar/rejeitar), ou direto pelo
console D1 no dashboard da Cloudflare:

```sql
UPDATE comments SET status='approved' WHERE id=X;
-- ou
DELETE FROM comments WHERE id=X;
```

## Depois de confirmar que está tudo funcionando

Me avisa que o Worker está no ar e testado — aí eu confirmo com você se
quer que eu apague de vez o app do Cusdis (não precisa fazer nada do lado
do Cusdis, já não tem mais página nenhuma referenciando ele no código).
