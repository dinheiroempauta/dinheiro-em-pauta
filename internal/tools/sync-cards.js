#!/usr/bin/env node
/**
 * Fonte única de metadados: o artigo (<slug>/index.html) é a fonte de
 * verdade para eyebrow, título, data de publicação e tempo de leitura.
 * Este script confere (ou corrige) esses 4 campos nos cards de index.html
 * (home) e artigos/index.html (listagem) — sem mexer no resumo do card,
 * que é editorial e pode legitimamente ser diferente do artigo (ver
 * CLAUDE.md, seção "Invariante: card da home tem que espelhar o artigo").
 *
 * Uso:
 *   node internal/tools/sync-cards.js --check          (não escreve nada, sai com código 1 se houver divergência)
 *   node internal/tools/sync-cards.js --apply           (corrige os cards pra bater com o artigo)
 *   node internal/tools/sync-cards.js --check <slug>    (só um artigo)
 */
'use strict';

const fs = require('node:fs');
const path = require('node:path');

// Override só usado pelos testes (internal/tests), pra rodar contra um
// diretório de exemplo em vez do repositório real.
const ROOT = process.env.SYNC_CARDS_ROOT || path.join(__dirname, '..', '..');
const CARD_FILES = ['index.html', 'artigos/index.html'];

function readArticleFields(slug) {
  const articlePath = path.join(ROOT, slug, 'index.html');
  const html = fs.readFileSync(articlePath, 'utf-8');

  const eyebrow = matchOrThrow(html, /<div class="eyebrow[^"]*">([^<]+)<\/div>/, `eyebrow em ${slug}`);
  const title = matchOrThrow(html, /<h1 class="title[^"]*">([^<]+)<\/h1>/, `título em ${slug}`);
  const metaBlock = matchOrThrow(html, /<div class="meta[^"]*">([\s\S]*?)<\/div>/, `.meta em ${slug}`);
  const publishedDate = matchOrThrow(metaBlock, /<b>Publicado em<\/b>\s*([^<]+?)\s*<\/span>/, `data de publicação em ${slug}`);
  const readTime = matchOrThrow(metaBlock, /<b>(~[^<]+)<\/b>\s*de leitura/, `tempo de leitura em ${slug}`);

  return { eyebrow: eyebrow.trim(), title: title.trim(), publishedDate: publishedDate.trim(), readTime: readTime.trim() };
}

function matchOrThrow(haystack, re, label) {
  const m = haystack.match(re);
  if (!m) throw new Error(`não encontrei ${label}`);
  return m[1];
}

function findCardBlock(html, slug) {
  // um <a href="<slug>/" class="...card">...</a>, balanceando pelo primeiro </a> de fechamento
  const anchorRe = new RegExp(`<a href="(?:\\.\\./)?${slug}/" class="[^"]*card[^"]*">`);
  const m = anchorRe.exec(html);
  if (!m) return null;
  const start = m.index;
  const end = html.indexOf('</a>', start) + '</a>'.length;
  return { start, end, block: html.slice(start, end) };
}

function extractCardFields(block) {
  const eyebrowM = block.match(/<div class="card-eyebrow">([^<]+)<\/div>/);
  const titleM = block.match(/class="card-title">([^<]+)</);
  const dateM = block.match(/<b>Publicado em<\/b>\s*([^<]+?)\s*<\/span>/);
  const readM = block.match(/<span>(~[^<]+ de leitura)<\/span>/);
  return {
    eyebrow: eyebrowM ? eyebrowM[1].trim() : null,
    title: titleM ? titleM[1].trim() : null,
    publishedDate: dateM ? dateM[1].trim() : null,
    readTime: readM ? readM[1].replace(/ de leitura$/, '').trim() : null,
  };
}

function applyCardFields(block, article) {
  let out = block;
  out = out.replace(/(<div class="card-eyebrow">)[^<]+(<\/div>)/, `$1${article.eyebrow}$2`);
  out = out.replace(/(class="card-title">)[^<]+(<)/, `$1${article.title}$2`);
  out = out.replace(/(<b>Publicado em<\/b>\s*)[^<]+?(\s*<\/span>)/, `$1${article.publishedDate}$2`);
  out = out.replace(/(<span>)~[^<]+( de leitura<\/span>)/, `$1${article.readTime}$2`);
  return out;
}

function main() {
  const args = process.argv.slice(2);
  const mode = args.includes('--apply') ? 'apply' : args.includes('--check') ? 'check' : null;
  if (!mode) {
    console.error('Uso: node internal/tools/sync-cards.js --check|--apply [slug...]');
    process.exit(2);
  }
  const requestedSlugs = args.filter((a) => !a.startsWith('--'));

  const homeHtml = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf-8');
  const allSlugs = [...homeHtml.matchAll(/href="([a-z0-9-]+)\/" class="[^"]*vitrine-card"/g)].map((m) => m[1]);
  const slugs = requestedSlugs.length ? requestedSlugs : allSlugs;

  let mismatches = 0;

  for (const cardFilePath of CARD_FILES) {
    const fullPath = path.join(ROOT, cardFilePath);
    let html = fs.readFileSync(fullPath, 'utf-8');
    let changed = false;

    for (const slug of slugs) {
      let article;
      try {
        article = readArticleFields(slug);
      } catch (e) {
        console.error(`[erro] ${slug}: ${e.message}`);
        process.exitCode = 2;
        continue;
      }

      const found = findCardBlock(html, slug);
      if (!found) continue; // esse arquivo pode não ter card pra esse slug (ok)

      const cardFields = extractCardFields(found.block);
      const fieldNames = ['eyebrow', 'title', 'publishedDate', 'readTime'];
      const diffs = fieldNames.filter((f) => cardFields[f] !== article[f]);

      if (diffs.length) {
        mismatches += diffs.length;
        console.log(`\n${cardFilePath} — card de "${slug}" diverge do artigo:`);
        for (const f of diffs) {
          console.log(`  ${f}: card="${cardFields[f]}" artigo="${article[f]}"`);
        }
        if (mode === 'apply') {
          const fixedBlock = applyCardFields(found.block, article);
          html = html.slice(0, found.start) + fixedBlock + html.slice(found.end);
          changed = true;
          console.log('  -> corrigido');
        }
      }
    }

    if (changed) {
      fs.writeFileSync(fullPath, html, 'utf-8');
    }
  }

  if (mode === 'check') {
    if (mismatches) {
      console.log(`\n${mismatches} divergência(s) encontrada(s).`);
      process.exit(1);
    }
    console.log('Todos os cards batem com os artigos.');
  } else {
    console.log(mismatches ? `\n${mismatches} divergência(s) corrigida(s).` : 'Nada para corrigir — já estava tudo batendo.');
  }
}

main();
