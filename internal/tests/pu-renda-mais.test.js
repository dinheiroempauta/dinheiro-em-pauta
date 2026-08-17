// Testa a lógica de dias úteis e o cálculo de PU do simulador pu-renda-mais.
// Roda com: node --test internal/tests
'use strict';

const { test } = require('node:test');
const assert = require('node:assert/strict');
const { loadFunctionsWithPrelude } = require('./extract-fn');

const { dateKey, isBiz, parseISO, sameDay, addMonths, businessDaysTo } = loadFunctionsWithPrelude(
  'simuladores/pu-renda-mais/index.html',
  ['var HOLIDAYS_RAW = [', 'var HOLIDAYS = new Set(HOLIDAYS_RAW);'],
  ['dateKey', 'isBiz', 'parseISO', 'sameDay', 'addMonths', 'businessDaysTo']
);

test('parseISO / dateKey / sameDay são consistentes entre si', () => {
  const d = parseISO('2026-08-17');
  assert.equal(dateKey(d), 20260817);
  assert.ok(sameDay(d, parseISO('2026-08-17')));
  assert.ok(!sameDay(d, parseISO('2026-08-18')));
});

test('isBiz rejeita sábado, domingo e feriado nacional fixo (25/dez)', () => {
  assert.equal(isBiz(parseISO('2026-08-15')), false); // sábado
  assert.equal(isBiz(parseISO('2026-08-16')), false); // domingo
  assert.equal(isBiz(parseISO('2026-08-17')), true);  // segunda comum
  assert.equal(isBiz(parseISO('2026-12-25')), false); // Natal
});

test('addMonths preserva o dia e trata mês mais curto (regra "clamp")', () => {
  const d = addMonths(parseISO('2026-01-31'), 1); // fev/2026 não tem dia 31
  assert.equal(dateKey(d), 20260228);
});

test('businessDaysTo conta dias úteis inclusivos, igual ao NETWORKDAYS do Excel', () => {
  // segunda 17/ago/2026 até sexta 21/ago/2026: 5 dias úteis corridos, sem feriado no meio
  const ref = parseISO('2026-08-17');
  const alvo = parseISO('2026-08-21');
  const [dias] = businessDaysTo(ref, [alvo]);
  assert.equal(dias, 5);
});
