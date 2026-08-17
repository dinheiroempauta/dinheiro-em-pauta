# Deploy do Worker de comentários

Rode isso com a conta Cloudflare já logada no `wrangler` (`wrangler login`,
se ainda não tiver feito). Tudo a partir desta pasta
(`cloudflare-worker-comments/`).

**Já fez o deploy inicial antes e só quer atualizar o código do Worker
(ex: depois que eu mudo algo em `src/`)?** Pula direto pro passo 4
(`wrangler deploy`) — os passos 1-3 (banco, schema, secrets) só precisam
rodar uma vez.

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

### 3.1 (Opcional) Notificação por e-mail

Sem isso configurado, tudo funciona normalmente — só não manda e-mail
quando um comentário é aprovado/rejeitado ou quando alguém responde.
Pra ativar:

1. Cria uma conta grátis em [resend.com](https://resend.com) (até 3 mil
   e-mails/mês de graça).
2. No painel do Resend, gera uma **API Key**.
3. Roda:
   ```
   wrangler secret put RESEND_API_KEY
   ```
   e cola a chave gerada.

**Limitação atual, até o domínio próprio ficar ativo**: sem um domínio
verificado no Resend, os e-mails saem do endereço de teste deles
(`onboarding@resend.dev`) — funciona, mas tem mais chance de cair em
spam, e alguns provedores de e-mail podem recusar. Quando o domínio
próprio (`dinheiroempauta.com.br`) estiver comprado e ativo,
verificar ele no painel do Resend e trocar o `FROM_EMAIL` em
`src/email.js` — item já anotado no `internal/BACKLOG.md`.

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
  -H "Origin: https://dinheiroempauta.com.br" \
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

## 6. Moderar no dia a dia

Depois de rodar `wrangler deploy` (passo 4), existe um painel de
moderação próprio em:

```
https://independencia-comments.independenciacalculada.workers.dev/admin
```

Abre essa URL no navegador, cola o `ADMIN_TOKEN` (o mesmo valor do passo
3) no campo de login uma vez — ele fica salvo no navegador (localStorage),
não precisa colar de novo depois. A partir daí é só ver a lista de
pendentes e clicar em "Aprovar" ou "Rejeitar", sem terminal.

Alternativas que continuam funcionando, se preferir (ex: pra automatizar
algo): os comandos `curl` do passo 5, ou direto pelo console D1 no
dashboard da Cloudflare:

```sql
UPDATE comments SET status='approved' WHERE id=X;
-- ou
DELETE FROM comments WHERE id=X;
```
