// Extrai uma função nomeada diretamente do HTML de produção (sem copiar o
// código pra um segundo lugar) e devolve ela executável, pra testar o
// mesmo código que é servido no site, não uma cópia que pode divergir dele.
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

function extractFunctionSource(html, fnName) {
  const marker = `function ${fnName}(`;
  const start = html.indexOf(marker);
  if (start === -1) {
    throw new Error(`função "${fnName}" não encontrada no HTML`);
  }
  const braceStart = html.indexOf('{', start);
  let depth = 0;
  let end = -1;
  for (let i = braceStart; i < html.length; i++) {
    if (html[i] === '{') depth++;
    else if (html[i] === '}') {
      depth--;
      if (depth === 0) { end = i + 1; break; }
    }
  }
  if (end === -1) {
    throw new Error(`não foi possível fechar o corpo de "${fnName}" (chaves desbalanceadas)`);
  }
  return html.slice(start, end);
}

/**
 * Carrega uma ou mais funções puras de um arquivo HTML do site, direto do
 * arquivo real (não de uma cópia mantida à parte), e devolve um objeto
 * { nomeDaFuncao: function }.
 */
function loadFunctions(htmlRelativePath, fnNames) {
  const htmlPath = path.join(__dirname, '..', '..', htmlRelativePath);
  const html = fs.readFileSync(htmlPath, 'utf-8');
  const sources = fnNames.map((name) => extractFunctionSource(html, name));
  const exportsList = fnNames.map((name) => `module.exports.${name} = ${name};`).join('\n');
  const sandbox = { module: { exports: {} } };
  vm.createContext(sandbox);
  const script = new vm.Script(`${sources.join('\n\n')}\n\n${exportsList}`);
  script.runInContext(sandbox);
  return sandbox.module.exports;
}

/**
 * Extrai um trecho arbitrário de código (ex: uma declaração `var` que uma
 * função pura depende) entre dois marcadores literais, inclusive.
 */
function extractRaw(html, startMarker, endMarker) {
  const start = html.indexOf(startMarker);
  if (start === -1) throw new Error(`marcador inicial não encontrado: "${startMarker}"`);
  const endMarkerIdx = html.indexOf(endMarker, start);
  if (endMarkerIdx === -1) throw new Error(`marcador final não encontrado: "${endMarker}"`);
  return html.slice(start, endMarkerIdx + endMarker.length);
}

/**
 * Como loadFunctions, mas com um trecho de código extra ("prelude") — para
 * funções puras que dependem de uma constante de módulo (ex: uma tabela de
 * feriados) em vez de só dos próprios parâmetros. O prelude pode vir de um
 * arquivo diferente do que tem as funções (ex: uma tabela compartilhada em
 * assets/, usada por vários simuladores) via `preludeFile`; por padrão usa
 * o mesmo arquivo das funções. `extraPrelude` permite colar uma linha extra
 * (ex: um alias de nome de variável) sem precisar de outro marcador.
 */
function loadFunctionsWithPrelude(htmlRelativePath, preludeMarkers, fnNames, options) {
  const { preludeFile, extraPrelude } = options || {};
  const htmlPath = path.join(__dirname, '..', '..', htmlRelativePath);
  const html = fs.readFileSync(htmlPath, 'utf-8');
  const preludeHtml = preludeFile
    ? fs.readFileSync(path.join(__dirname, '..', '..', preludeFile), 'utf-8')
    : html;
  const prelude = extractRaw(preludeHtml, preludeMarkers[0], preludeMarkers[1]);
  const sources = fnNames.map((name) => extractFunctionSource(html, name));
  const exportsList = fnNames.map((name) => `module.exports.${name} = ${name};`).join('\n');
  const sandbox = { module: { exports: {} } };
  vm.createContext(sandbox);
  const script = new vm.Script(
    `${prelude}\n${extraPrelude || ''}\n\n${sources.join('\n\n')}\n\n${exportsList}`
  );
  script.runInContext(sandbox);
  return sandbox.module.exports;
}

module.exports = { loadFunctions, loadFunctionsWithPrelude, extractFunctionSource, extractRaw };
