// Testa internal/tools/sync-cards.js — a ferramenta que confere/corrige
// os campos mecânicos do card (eyebrow, título, data, tempo de leitura)
// contra o artigo real. Roda contra um fixture temporário mínimo, não
// contra o repositório de verdade, mesmo em modo --apply.
'use strict';

const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

function buildFixture() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'sync-cards-fixture-'));
  fs.mkdirSync(path.join(root, 'meu-artigo'));
  fs.mkdirSync(path.join(root, 'artigos'));

  fs.writeFileSync(
    path.join(root, 'meu-artigo', 'index.html'),
    `<div class="eyebrow fade-in">Categoria X</div>
     <h1 class="title fade-in d1">Título do artigo</h1>
     <div class="meta fade-in d2">
       <span><b>Publicado em</b> 1 jan. 2026</span>
       <span><b>~7 min</b> de leitura</span>
     </div>`
  );

  fs.writeFileSync(
    path.join(root, 'index.html'),
    `<div class="vitrine-track">
       <a href="meu-artigo/" class="vitrine-card">
         <div class="card-eyebrow">Categoria ERRADA</div>
         <div class="card-top"><h3 class="card-title">Título do artigo</h3></div>
         <div class="card-summary-wrap"><p class="card-summary">Um teaser qualquer.</p></div>
         <div class="card-meta">
           <span><b>Publicado em</b> 1 jan. 2026</span>
           <span>~7 min de leitura</span>
         </div>
       </a>
     </div>`
  );

  fs.writeFileSync(
    path.join(root, 'artigos', 'index.html'),
    `<a href="../meu-artigo/" class="article-card">
       <div class="card-eyebrow">Categoria X</div>
       <h2 class="card-title">Título do artigo</h2>
       <div class="card-summary-wrap"><p class="card-summary">Um resumo mais longo.</p></div>
       <div class="card-meta">
         <span><b>Publicado em</b> 1 jan. 2026</span>
         <span>~99 min de leitura</span>
       </div>
     </a>`
  );

  return root;
}

function runTool(root, args) {
  try {
    const out = execFileSync('node', [path.join(__dirname, '..', 'tools', 'sync-cards.js'), ...args], {
      env: { ...process.env, SYNC_CARDS_ROOT: root },
      encoding: 'utf-8',
    });
    return { code: 0, out };
  } catch (e) {
    return { code: e.status, out: e.stdout };
  }
}

test('--check detecta divergência de eyebrow (home) e de tempo de leitura (listagem)', () => {
  const root = buildFixture();
  const { code, out } = runTool(root, ['--check']);
  assert.equal(code, 1);
  assert.match(out, /eyebrow: card="Categoria ERRADA" artigo="Categoria X"/);
  assert.match(out, /readTime: card="~99 min" artigo="~7 min"/);
  fs.rmSync(root, { recursive: true });
});

test('--apply corrige os campos errados e deixa o resumo intocado', () => {
  const root = buildFixture();
  runTool(root, ['--apply']);

  const home = fs.readFileSync(path.join(root, 'index.html'), 'utf-8');
  const listagem = fs.readFileSync(path.join(root, 'artigos', 'index.html'), 'utf-8');

  assert.match(home, /<div class="card-eyebrow">Categoria X<\/div>/);
  assert.match(home, /Um teaser qualquer\./); // resumo não foi tocado
  assert.match(listagem, /~7 min de leitura/);
  assert.match(listagem, /Um resumo mais longo\./); // resumo não foi tocado

  const { code } = runTool(root, ['--check']);
  assert.equal(code, 0);

  fs.rmSync(root, { recursive: true });
});

test('--check não acusa nada quando já está tudo consistente', () => {
  const root = buildFixture();
  runTool(root, ['--apply']);
  const { code, out } = runTool(root, ['--check']);
  assert.equal(code, 0);
  assert.match(out, /Todos os cards batem com os artigos\./);
  fs.rmSync(root, { recursive: true });
});
