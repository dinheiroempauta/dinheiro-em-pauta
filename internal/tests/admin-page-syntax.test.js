// Regressão: cloudflare-worker-comments/src/adminPage.js embute o HTML/JS
// do painel de moderação dentro de uma template string. Qualquer `\n`
// (ou outra sequência de escape) digitado "cru" ali dentro é processado
// pelo JavaScript da PRÓPRIA template string, virando um caractere real
// (quebra de linha de verdade) em vez do texto literal `\n` — o que
// corrompe a sintaxe do <script> embutido sem gerar nenhum erro na hora
// de escrever o arquivo (só quebra em tempo de execução, no navegador).
// Já aconteceu: `lines.join("\n\n")` virou uma string com quebra de linha
// literal dentro das aspas, deixando TODO o script da página inutilizado
// (nem o botão "Entrar" respondia a clique). Este teste importa o módulo
// de verdade, extrai o <script> gerado e confirma que ele é JS válido —
// sem precisar de navegador nem duplicar o código em outro lugar.
'use strict';

const { test } = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');

test('o <script> do painel /admin é JavaScript sintaticamente válido', async () => {
  const { ADMIN_PAGE_HTML } = await import('../../cloudflare-worker-comments/src/adminPage.js');
  const match = ADMIN_PAGE_HTML.match(/<script>([\s\S]*)<\/script>/);
  assert.ok(match, 'não achei um bloco <script>...</script> no HTML gerado');

  const scriptSource = match[1];
  // new vm.Script lança SyntaxError se o código não parsear — não executa
  // nada (o script real depende de `document`/`window`, que não existem
  // aqui), só valida a sintaxe.
  assert.doesNotThrow(() => new vm.Script(scriptSource), /SyntaxError/);
});
