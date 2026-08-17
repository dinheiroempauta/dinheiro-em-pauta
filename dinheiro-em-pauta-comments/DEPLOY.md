# Deploy do Worker de comentários

Rode isso com a conta Cloudflare já logada no `wrangler` (`wrangler login`,
se ainda não tiver feito). Tudo a partir desta pasta
(`dinheiro-em-pauta-comments/`).

**Já fez o deploy inicial antes e só quer atualizar o código do Worker
(ex: depois que eu mudo algo em `src/`)?** Pula direto pro passo 4
(`wrangler deploy`) — os passos 1-3 (banco, schema, secrets) só precisam
rodar uma vez.

## 1. Criar o banco D1

```
wrangler d1 create dinheiro-em-pauta-comments-db
```

Copia o `database_id` que o comando devolve e cola em `wrangler.toml`, no
lugar de `COLE_AQUI_O_DATABASE_ID`.

## 2. Rodar o schema

```
wrangler d1 execute dinheiro-em-pauta-comments-db --remote --file=schema.sql
```

## 3. Configurar os secrets

```
wrangler secret put ADMIN_TOKEN
```
Cola qualquer string longa e aleatória (ex: gerada com
`openssl rand -hex 32`) — é o token que protege os endpoints `/admin/*`.
Pode ser o mesmo valor que você já usa no Worker antigo, ou um novo — sua
escolha. Guarda esse valor.

```
wrangler secret put IP_SALT
```
Outra string aleatória qualquer (ex: `openssl rand -hex 16`).

```
wrangler secret put RESEND_API_KEY
```
A mesma chave que você já usa no Worker antigo (a conta do Resend não
muda) — cola ela aqui de novo.

## 4. Deploy

```
wrangler deploy
```

Anota a URL que aparece no final (deve ser
`https://dinheiro-em-pauta-comments.independenciacalculada.workers.dev`
— se vier diferente, me avisa que eu ajusto o `data-comments-api` nas
páginas e o CORS no Worker pra bater com a URL real).

## 5. Testar os endpoints

Troca `https://dinheiro-em-pauta-comments.independenciacalculada.workers.dev` pela URL real que apareceu no passo 4 em todos os
comandos abaixo.

Comentar (deve entrar como pendente):
```
curl -X POST https://dinheiro-em-pauta-comments.independenciacalculada.workers.dev/comments \
  -H "Content-Type: application/json" \
  -H "Origin: https://dinheiroempauta.com.br" \
  -d '{"slug":"pwr-carteira-fire","nickname":"Teste","email":"","message":"Comentário de teste"}'
```
Resposta esperada: `{"status":"pending"}`.

Listar pendentes (troca `SEU_TOKEN` pelo valor que você colou no passo 3):
```
curl "https://dinheiro-em-pauta-comments.independenciacalculada.workers.dev/admin/pending?token=SEU_TOKEN"
```

Aprovar (troca `ID` pelo id retornado acima):
```
curl -X POST https://dinheiro-em-pauta-comments.independenciacalculada.workers.dev/admin/moderate \
  -H "Content-Type: application/json" \
  -d '{"token":"SEU_TOKEN","id":ID,"action":"approve"}'
```

Ver se aparece na listagem pública:
```
curl "https://dinheiro-em-pauta-comments.independenciacalculada.workers.dev/comments?slug=pwr-carteira-fire"
```

## 6. Painel de moderação

```
https://dinheiro-em-pauta-comments.independenciacalculada.workers.dev/admin
```

Mesmo fluxo de sempre: cola o `ADMIN_TOKEN` no login, fica salvo no
navegador.

Alternativas que continuam funcionando, se preferir (ex: pra automatizar
algo): os comandos `curl` do passo 5, ou direto pelo console D1 no
dashboard da Cloudflare:

```sql
UPDATE comments SET status='approved' WHERE id=X;
-- ou
DELETE FROM comments WHERE id=X;
```
