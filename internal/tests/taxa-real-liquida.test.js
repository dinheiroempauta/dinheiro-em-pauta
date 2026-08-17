// Testa a fórmula central do artigo "ipca-hiperinflacao" — a que prova que
// a taxa real líquida de um Tesouro IPCA+ não desaba com hiperinflação.
// Roda com: node --test internal/tests
'use strict';

const { test } = require('node:test');
const assert = require('node:assert/strict');
const { loadFunctions } = require('./extract-fn');

const { calcularTaxaRealLiquida } = loadFunctions(
  'ipca-hiperinflacao/index.html',
  ['calcularTaxaRealLiquida']
);

// A: preço unitário | B: juro real | C: IPCA | D: custódia | E: prazo (anos) | F: taxa IR

test('sem juro real, sem custódia, sem IR: taxa real líquida é ~0 em qualquer IPCA', () => {
  for (const ipca of [0, 0.05, 1.0, 10.24]) {
    const r = calcularTaxaRealLiquida(1000, 0, ipca, 0, 5, 0);
    assert.ok(Math.abs(r.taxaRealLiquida) < 1e-9, `IPCA=${ipca}: esperava ~0, obteve ${r.taxaRealLiquida}`);
  }
});

test('juro real fixo é preservado independente do nível de IPCA (o ponto central do artigo)', () => {
  const jurosReal = 0.06;
  const semCustodiaSemIR = [0, 0.10, 1.0, 10.24].map(
    (ipca) => calcularTaxaRealLiquida(1000, jurosReal, ipca, 0, 10, 0).taxaRealLiquida
  );
  for (const taxa of semCustodiaSemIR) {
    assert.ok(
      Math.abs(taxa - jurosReal) < 1e-9,
      `esperava taxa real líquida ~${jurosReal}, obteve ${taxa}`
    );
  }
});

test('custódia e IR corroem a taxa real líquida (fica abaixo do juro real bruto)', () => {
  const jurosReal = 0.06;
  const r = calcularTaxaRealLiquida(1000, jurosReal, 0.05, 0.002, 10, 0.15);
  assert.ok(r.taxaRealLiquida < jurosReal, 'taxa líquida deveria ficar abaixo do juro real bruto');
  assert.ok(r.taxaRealLiquida > 0, 'nesse cenário moderado a taxa líquida ainda deveria ser positiva');
});

test('IR incide só sobre o ganho de capital, não sobre o principal', () => {
  const A = 1000;
  const r = calcularTaxaRealLiquida(A, 0.06, 0.05, 0, 10, 0.15);
  assert.equal(r.ganhoCapital, r.valorVencimento - A);
  assert.ok(Math.abs(r.ir - r.ganhoCapital * 0.15) < 1e-9);
});
