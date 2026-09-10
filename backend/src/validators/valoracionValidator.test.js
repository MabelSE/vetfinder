import { test } from 'node:test';
import assert from 'node:assert/strict';
import { esPuntuacionPermitida, validarDatosValoracion, validarDatosReporte } from './valoracionValidator.js';

test('acepta puntuaciones de 1 a 5 en pasos de 0.5', () => {
  assert.equal(esPuntuacionPermitida(1), true);
  assert.equal(esPuntuacionPermitida(1.5), true);
  assert.equal(esPuntuacionPermitida(4.5), true);
  assert.equal(esPuntuacionPermitida(5), true);
});

test('rechaza puntuaciones fuera de rango o con otro paso', () => {
  assert.equal(esPuntuacionPermitida(0), false);
  assert.equal(esPuntuacionPermitida(5.5), false);
  assert.equal(esPuntuacionPermitida(3.3), false);
  assert.equal(esPuntuacionPermitida('4,5'), false);
});

test('validarDatosValoracion exige visita y puntuacion valida', () => {
  const invalida = validarDatosValoracion({ idVisita: 1, puntuacion: 3.3 });
  assert.ok(invalida.errores.length > 0);

  const valida = validarDatosValoracion({ idVisita: 2, puntuacion: 4.5, comentario: '  Bien  ' });
  assert.equal(valida.errores.length, 0);
  assert.equal(valida.datos.comentario, 'Bien');
});

test('validarDatosReporte exige motivo', () => {
  const vacio = validarDatosReporte({ motivo: '   ' });
  assert.ok(vacio.errores.length > 0);

  const ok = validarDatosReporte({ motivo: 'Comentario sospechoso' });
  assert.equal(ok.errores.length, 0);
});
