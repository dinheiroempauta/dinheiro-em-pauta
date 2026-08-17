// Regressão: mover a estilização do iframe de comentários (Cusdis) pra
// assets/site.js, carregado no fim do <body>, criou uma corrida — o
// script async do Cusdis pode inserir o iframe ANTES do nosso observer
// ser registrado, e nesse caso o CSS do tema nunca era aplicado (visual
// padrão do Cusdis: fundo branco, sem seguir o dark mode).
//
// Testa isso sem depender de nenhum navegador nem pacote externo: extrai
// setupCusdisComments() do assets/site.js real e roda ela num sandbox com
// um DOM falso mínimo (só os métodos que a função realmente usa), com um
// iframe já presente no container ANTES da função rodar — o pior caso da
// corrida.
'use strict';

const { test } = require('node:test');
const assert = require('node:assert/strict');
const { loadFunctions } = require('./extract-fn');

function makeFakeDoc() {
  const style = { tagName: 'STYLE', textContent: '' };
  const head = { appendChild(child) { head.children.push(child); }, children: [] };
  const body = { scrollHeight: 100 };
  return {
    createElement(tag) { return tag === 'style' ? { ...style } : { tagName: tag.toUpperCase() }; },
    head,
    body,
    documentElement: { scrollHeight: 100 },
  };
}

function makeFakeIframe(contentDocument) {
  return {
    tagName: 'IFRAME',
    style: {},
    contentDocument,
    listeners: {},
    addEventListener(evt, fn) { this.listeners[evt] = fn; },
    setAttribute(name, value) { this[name] = value; },
  };
}

test('estiliza o iframe de comentários mesmo se ele já existir antes da função rodar', () => {
  const { setupCusdisComments } = loadFunctions('assets/site.js', ['setupCusdisComments']);

  const fakeDoc = makeFakeDoc();
  const fakeIframe = makeFakeIframe(fakeDoc);
  const container = {
    querySelector(sel) { return sel === 'iframe' ? fakeIframe : null; },
  };

  const rootStyleTokens = {
    '--ink': '#EDEFEA', '--muted': '#9AA396', '--paper-raised': '#1B1F16',
    '--line-strong': '#333', '--line': '#333', '--placeholder': '#777',
    '--green': '#1E6B4F', '--green-deep': '#123B2A', '--brick': '#A8402A',
    '--gold': '#D6A94E', '--color-scheme': 'dark',
  };

  const sandboxWindow = { ResizeObserver: undefined };
  const documentMock = {
    getElementById(id) { return id === 'cusdis_thread' ? container : null; },
    documentElement: {},
  };

  const fakeGlobal = {
    document: documentMock,
    window: sandboxWindow,
    getComputedStyle() {
      return { getPropertyValue(name) { return rootStyleTokens[name] || ''; } };
    },
    MutationObserver: function (cb) {
      this.observe = function () {}; // não importa pra este teste: já existe iframe
    },
    requestAnimationFrame(fn) { fn(); },
    setInterval() { return 0; },
    clearInterval() {},
    setTimeout(fn) { fn(); return 0; },
  };

  // roda com o "this" de funções livres apontando pros globais fake —
  // setupCusdisComments só usa identificadores livres (document, window,
  // getComputedStyle, MutationObserver, requestAnimationFrame), então
  // basta chamar com esses nomes no escopo via Function constructor.
  const fn = new Function(
    'document', 'window', 'getComputedStyle', 'MutationObserver', 'requestAnimationFrame', 'setInterval', 'clearInterval', 'setTimeout',
    `return (${setupCusdisComments.toString()})();`
  );
  fn(
    fakeGlobal.document, fakeGlobal.window, fakeGlobal.getComputedStyle, fakeGlobal.MutationObserver,
    fakeGlobal.requestAnimationFrame, fakeGlobal.setInterval, fakeGlobal.clearInterval, fakeGlobal.setTimeout
  );

  assert.equal(fakeDoc.head.children.length, 1, 'deveria ter injetado um <style> no head do iframe');
  const css = fakeDoc.head.children[0].textContent;
  assert.ok(css.includes('#EDEFEA'), 'o CSS injetado deveria usar as cores do tema atual');
  assert.equal(fakeIframe.title, 'Comentários do artigo');

  // Regressão: nome/data/corpo do comentário postado (não os campos do
  // formulário) apareciam com contraste baixíssimo — o Cusdis define cor
  // própria nesses elementos, e herdar de html/body não é suficiente pra
  // vencer uma regra explícita do widget. Confirmado com prova em
  // navegador real (ver PR): sem "*{color:inherit!important}", o texto
  // ficava com a cor original do widget (ex: #8a8a8a) mesmo em cima do
  // fundo escuro da página; com essa regra, resolve pro --ink do tema.
  assert.match(css, /\*\{color:inherit\s*!important;?\}/, 'precisa forçar herança de cor em todo o conteúdo do iframe, não só no html/body');
  // O focus ring precisa seguir o padrão global do site (outline dourado),
  // não o "outline:none" que existia antes (falha de acessibilidade).
  assert.match(css, /input:focus,textarea:focus\{outline:2px solid #[0-9a-fA-F]{6} !important/, 'input/textarea precisam do anel de foco dourado do site, não outline:none');
});
