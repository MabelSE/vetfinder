import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validarSolicitudVeterinaria } from './solicitudVeterinariaValidator.js';

function solicitudValida(extra = {}) {
  return {
    nombre: 'Camila',
    apellido: 'Soto',
    correo: 'camila.admin@veterinaria.cl',
    contrasena: 'VetFinder123',
    telefono: '642221000',
    veterinaria: {
      nombreComercial: 'Clínica Los Notros',
      telefono: '642221111',
      correo: 'contacto@losnotros.cl',
      descripcion: 'Atención general.',
    },
    direccion: {
      calle: 'Av. República',
      numero: '1250',
      comuna: 'Osorno',
      region: 'Los Lagos',
    },
    ...extra,
  };
}

function noExponeCamposControlados(datos) {
  assert.equal(datos.rol, undefined);
  assert.equal(datos.estadoRegistro, undefined);
  assert.equal(datos.idUsuario, undefined);
  assert.equal(datos.estadoCuenta, undefined);
  assert.equal(datos.usuario.rol, undefined);
  assert.equal(datos.usuario.estadoCuenta, undefined);
  assert.equal(datos.usuario.idUsuario, undefined);
  assert.equal(datos.veterinaria.rol, undefined);
  assert.equal(datos.veterinaria.estadoRegistro, undefined);
  assert.equal(datos.veterinaria.idUsuario, undefined);
}

test('acepta una solicitud válida y no incluye rol ni estado', () => {
  const resultado = validarSolicitudVeterinaria(solicitudValida());

  assert.equal(resultado.errores.length, 0);
  assert.equal(resultado.datos.usuario.correo, 'camila.admin@veterinaria.cl');
  assert.equal(resultado.datos.veterinaria.nombreComercial, 'Clínica Los Notros');
  assert.equal(resultado.datos.veterinaria.correo, 'contacto@losnotros.cl');
  assert.equal(resultado.datos.direccion.comuna, 'Osorno');
  assert.equal(resultado.datos.direccion.latitud, undefined);
  assert.equal(resultado.datos.direccion.longitud, undefined);
  noExponeCamposControlados(resultado.datos);
});

test('rechaza nombre comercial faltante', () => {
  const cuerpo = solicitudValida();
  delete cuerpo.veterinaria.nombreComercial;

  const resultado = validarSolicitudVeterinaria(cuerpo);

  assert.ok(resultado.errores.some((error) => error.includes('nombre comercial')));
});

test('rechaza teléfono de veterinaria faltante', () => {
  const cuerpo = solicitudValida();
  delete cuerpo.veterinaria.telefono;

  const resultado = validarSolicitudVeterinaria(cuerpo);

  assert.ok(resultado.errores.some((error) => error.includes('teléfono')));
});

test('rechaza correo de veterinaria faltante', () => {
  const cuerpo = solicitudValida({
    veterinaria: {
      nombreComercial: 'Clínica Los Notros',
      telefono: '642221111',
    },
  });

  const resultado = validarSolicitudVeterinaria(cuerpo);

  assert.ok(resultado.errores.some((error) => error.includes('correo')));
});

test('rechaza contraseña corta', () => {
  const resultado = validarSolicitudVeterinaria(solicitudValida({ contrasena: 'corta' }));

  assert.ok(resultado.errores.some((error) => error.includes('contraseña')));
});

test('rechaza dirección obligatoria incompleta', () => {
  const cuerpo = solicitudValida();
  delete cuerpo.direccion.calle;

  const resultado = validarSolicitudVeterinaria(cuerpo);

  assert.ok(resultado.errores.some((error) => error.includes('calle')));
});

test('el intento de enviar rol SUPERADMIN no altera el rol final', () => {
  const resultado = validarSolicitudVeterinaria(solicitudValida({
    rol: 'SUPERADMIN',
    estadoCuenta: 'INACTIVA',
    idUsuario: 99,
    veterinaria: {
      nombreComercial: 'Clínica Los Notros',
      telefono: '642221111',
      correo: 'contacto@losnotros.cl',
      rol: 'SUPERADMIN',
    },
  }));

  assert.equal(resultado.errores.length, 0);
  noExponeCamposControlados(resultado.datos);
});

test('el intento de enviar estadoRegistro APROBADA no altera el estado final', () => {
  const resultado = validarSolicitudVeterinaria(solicitudValida({
    estadoRegistro: 'APROBADA',
    veterinaria: {
      nombreComercial: 'Clínica Los Notros',
      telefono: '642221111',
      correo: 'contacto@losnotros.cl',
      estadoRegistro: 'APROBADA',
    },
  }));

  assert.equal(resultado.errores.length, 0);
  noExponeCamposControlados(resultado.datos);
  assert.equal(resultado.datos.veterinaria.estadoRegistro, undefined);
});
