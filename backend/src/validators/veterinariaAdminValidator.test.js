import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  validarAtencion,
  validarDatosGenerales,
  validarDisponibilidad,
  validarHorarios,
} from './veterinariaAdminValidator.js';

test('acepta disponibilidad permitida', () => {
  assert.equal(validarDisponibilidad({ disponibilidad: 'ALTA_DEMANDA' }).errores.length, 0);
});

test('rechaza disponibilidad inválida', () => {
  assert.ok(validarDisponibilidad({ disponibilidad: 'ABIERTA' }).errores.length > 0);
});

test('atiende 24 horas y urgencias de forma independiente', () => {
  const resultado = validarAtencion({ atencion24Horas: true, atiendeUrgencias: false });
  assert.equal(resultado.errores.length, 0);
  assert.equal(resultado.datos.atencion24Horas, true);
  assert.equal(resultado.datos.atiendeUrgencias, false);
});

test('acepta varios bloques en el mismo día sin solape', () => {
  const resultado = validarHorarios({
    horarios: [
      { diaSemana: 'LUNES', cerrado: false, horaApertura: '09:00', horaCierre: '13:00' },
      { diaSemana: 'LUNES', cerrado: false, horaApertura: '15:00', horaCierre: '19:00' },
      { diaSemana: 'DOMINGO', cerrado: true },
    ],
  });
  assert.equal(resultado.errores.length, 0);
});

test('rechaza día cerrado con horas o bloques superpuestos', () => {
  const cerradoConHoras = validarHorarios({
    horarios: [{ diaSemana: 'LUNES', cerrado: true, horaApertura: '09:00', horaCierre: '18:00' }],
  });
  assert.ok(cerradoConHoras.errores.length > 0);

  const solape = validarHorarios({
    horarios: [
      { diaSemana: 'LUNES', cerrado: false, horaApertura: '09:00', horaCierre: '13:00' },
      { diaSemana: 'LUNES', cerrado: false, horaApertura: '12:00', horaCierre: '18:00' },
    ],
  });
  assert.ok(solape.errores.length > 0);
});

test('ignora estado de registro enviado en datos generales', () => {
  const resultado = validarDatosGenerales({
    nombreComercial: 'Clínica de prueba',
    telefono: '642221000',
    correo: 'contacto@prueba.cl',
    estadoRegistro: 'APROBADA',
  });

  assert.equal(resultado.errores.length, 0);
  assert.equal(resultado.datos.estadoRegistro, undefined);
});
