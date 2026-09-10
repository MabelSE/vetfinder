import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ordenarVeterinariasUrgencia } from './prioridadUrgencia.js';

function veterinaria(valores) {
  return {
    idVeterinaria: 1,
    nombreComercial: 'Veterinaria',
    estaAbierta: true,
    atiendeUrgencias: true,
    disponibilidad: 'DISPONIBLE',
    distanciaKmReal: null,
    ...valores,
  };
}

test('prioriza abiertas antes que cerradas', () => {
  const ordenadas = ordenarVeterinariasUrgencia([
    veterinaria({ idVeterinaria: 1, nombreComercial: 'Cerrada', estaAbierta: false }),
    veterinaria({ idVeterinaria: 2, nombreComercial: 'Abierta', estaAbierta: true }),
  ], false);

  assert.equal(ordenadas[0].nombreComercial, 'Abierta');
});

test('dentro de abiertas, prioriza las que atienden urgencias', () => {
  const ordenadas = ordenarVeterinariasUrgencia([
    veterinaria({ idVeterinaria: 1, nombreComercial: 'General', atiendeUrgencias: false }),
    veterinaria({ idVeterinaria: 2, nombreComercial: 'Urgencias', atiendeUrgencias: true }),
  ], false);

  assert.equal(ordenadas[0].nombreComercial, 'Urgencias');
});

test('en abiertas, DISPONIBLE va antes que ALTA_DEMANDA y SIN_URGENCIAS', () => {
  const ordenadas = ordenarVeterinariasUrgencia([
    veterinaria({ idVeterinaria: 3, nombreComercial: 'Sin urgencias', disponibilidad: 'SIN_URGENCIAS' }),
    veterinaria({ idVeterinaria: 2, nombreComercial: 'Alta demanda', disponibilidad: 'ALTA_DEMANDA' }),
    veterinaria({ idVeterinaria: 1, nombreComercial: 'Disponible', disponibilidad: 'DISPONIBLE' }),
  ], false);

  assert.deepEqual(
    ordenadas.map((item) => item.nombreComercial),
    ['Disponible', 'Alta demanda', 'Sin urgencias']
  );
});

test('SIN_URGENCIAS abierta no se trata como cerrada', () => {
  const ordenadas = ordenarVeterinariasUrgencia([
    veterinaria({
      idVeterinaria: 1,
      nombreComercial: 'Cerrada disponible',
      estaAbierta: false,
      disponibilidad: 'DISPONIBLE',
    }),
    veterinaria({
      idVeterinaria: 2,
      nombreComercial: 'Abierta sin urgencias',
      estaAbierta: true,
      disponibilidad: 'SIN_URGENCIAS',
    }),
  ], false);

  assert.equal(ordenadas[0].nombreComercial, 'Abierta sin urgencias');
});

test('no usa disponibilidad para ordenar veterinarias cerradas', () => {
  const ordenadas = ordenarVeterinariasUrgencia([
    veterinaria({
      idVeterinaria: 2,
      nombreComercial: 'Beta',
      estaAbierta: false,
      disponibilidad: 'DISPONIBLE',
    }),
    veterinaria({
      idVeterinaria: 1,
      nombreComercial: 'Alfa',
      estaAbierta: false,
      disponibilidad: 'SIN_URGENCIAS',
    }),
  ], false);

  assert.deepEqual(
    ordenadas.map((item) => item.nombreComercial),
    ['Alfa', 'Beta']
  );
});

test('no usa atencion 24 horas como criterio independiente', () => {
  const ordenadas = ordenarVeterinariasUrgencia([
    veterinaria({
      idVeterinaria: 2,
      nombreComercial: 'Beta',
      atencion24Horas: true,
    }),
    veterinaria({
      idVeterinaria: 1,
      nombreComercial: 'Alfa',
      atencion24Horas: false,
    }),
  ], false);

  assert.equal(ordenadas[0].nombreComercial, 'Alfa');
});

test('ordena por distancia real y no por la distancia redondeada', () => {
  const ordenadas = ordenarVeterinariasUrgencia([
    veterinaria({
      idVeterinaria: 2,
      nombreComercial: 'Mas lejos',
      distanciaKmReal: 0.84,
    }),
    veterinaria({
      idVeterinaria: 1,
      nombreComercial: 'Mas cerca',
      distanciaKmReal: 0.76,
    }),
  ], true);

  assert.equal(ordenadas[0].nombreComercial, 'Mas cerca');
});

test('sin ubicacion omite la distancia aunque exista el valor interno', () => {
  const ordenadas = ordenarVeterinariasUrgencia([
    veterinaria({
      idVeterinaria: 2,
      nombreComercial: 'Beta',
      distanciaKmReal: 0.2,
    }),
    veterinaria({
      idVeterinaria: 1,
      nombreComercial: 'Alfa',
      distanciaKmReal: 9.4,
    }),
  ], false);

  assert.equal(ordenadas[0].nombreComercial, 'Alfa');
});

test('sin coordenadas queda despues de las que tienen distancia', () => {
  const ordenadas = ordenarVeterinariasUrgencia([
    veterinaria({
      idVeterinaria: 2,
      nombreComercial: 'Sin coordenadas',
      distanciaKmReal: null,
    }),
    veterinaria({
      idVeterinaria: 1,
      nombreComercial: 'Con coordenadas',
      distanciaKmReal: 12.3,
    }),
  ], true);

  assert.equal(ordenadas[0].nombreComercial, 'Con coordenadas');
});

test('el ultimo desempate es idVeterinaria', () => {
  const ordenadas = ordenarVeterinariasUrgencia([
    veterinaria({ idVeterinaria: 8, nombreComercial: 'Misma' }),
    veterinaria({ idVeterinaria: 3, nombreComercial: 'Misma' }),
  ], false);

  assert.equal(ordenadas[0].idVeterinaria, 3);
});
