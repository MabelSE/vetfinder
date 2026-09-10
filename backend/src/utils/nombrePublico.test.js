import { test } from 'node:test';
import assert from 'node:assert/strict';
import { nombrePublico } from './nombrePublico.js';

test('muestra nombre e inicial del apellido', () => {
  assert.equal(nombrePublico('Camila', 'Soto'), 'Camila S.');
  assert.equal(nombrePublico('Ana', 'Pérez'), 'Ana P.');
});

test('omite la inicial si no hay apellido', () => {
  assert.equal(nombrePublico('Camila', ''), 'Camila');
});

test('usa un texto genérico si falta el nombre', () => {
  assert.equal(nombrePublico('', 'Soto'), 'Propietario');
});
