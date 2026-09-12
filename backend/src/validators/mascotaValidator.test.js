import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validarDatosVacuna } from './mascotaValidator.js';

const VACUNA_VALIDA = {
  nombre: 'Antirrábica',
  fechaAplicacion: '2026-06-10',
  proximaFecha: '2027-06-10',
  observacion: 'Control anual',
};

test('validarDatosVacuna no persiste una URL enviada por el cliente', () => {
  const resultado = validarDatosVacuna({
    ...VACUNA_VALIDA,
    fotografiaComprobante: 'https://placehold.co/600x400?text=Comprobante',
  });

  assert.equal(resultado.errores.length, 0);
  assert.equal(resultado.datos.fotografiaComprobante, undefined);
  assert.equal(Object.hasOwn(resultado.datos, 'fotografiaComprobante'), false);
});

test('validarDatosVacuna acepta una vacuna sin comprobante', () => {
  const resultado = validarDatosVacuna(VACUNA_VALIDA);

  assert.equal(resultado.errores.length, 0);
  assert.equal(resultado.datos.nombre, 'Antirrábica');
  assert.equal(resultado.datos.observacion, 'Control anual');
});
