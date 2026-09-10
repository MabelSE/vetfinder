import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  validarEstadoCuenta,
  validarFiltroEstadoRegistro,
  validarFiltroEstadoReporte,
  validarResolucionReporte,
} from './superadminValidator.js';

test('acepta filtro de registro válido y rechaza uno inválido', () => {
  assert.equal(validarFiltroEstadoRegistro('PENDIENTE').estadoRegistro, 'PENDIENTE');
  assert.ok(validarFiltroEstadoRegistro('ABIERTA').errores.length > 0);
});

test('filtra reportes pendientes por omisión y permite TODAS', () => {
  assert.equal(validarFiltroEstadoReporte(undefined).estado, 'PENDIENTE');
  assert.equal(validarFiltroEstadoReporte('TODAS').estado, null);
  assert.ok(validarFiltroEstadoReporte('OCULTO').errores.length > 0);
});

test('solo acepta ACTIVA o INACTIVA como estado de cuenta', () => {
  assert.equal(validarEstadoCuenta({ estadoCuenta: 'INACTIVA' }).errores.length, 0);
  assert.ok(validarEstadoCuenta({ estadoCuenta: 'SUPERADMIN' }).errores.length > 0);
  assert.ok(validarEstadoCuenta({ rol: 'PROPIETARIO' }).errores.length > 0);
});

test('resuelve reporte solo a REVISADO o DESESTIMADO', () => {
  const valido = validarResolucionReporte({ estado: 'REVISADO', observacionAdmin: '  Revisado.  ' });
  assert.equal(valido.errores.length, 0);
  assert.equal(valido.datos.observacionAdmin, 'Revisado.');

  const desestimado = validarResolucionReporte({ estado: 'DESESTIMADO' });
  assert.equal(desestimado.errores.length, 0);
  assert.equal(desestimado.datos.observacionAdmin, null);

  assert.ok(validarResolucionReporte({ estado: 'PENDIENTE' }).errores.length > 0);
});
