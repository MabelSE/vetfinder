import { solicitarApi } from './apiCliente.js';

export async function registrarUsuario(datos) {
  const respuesta = await solicitarApi('/api/usuarios', {
    method: 'POST',
    cuerpo: datos,
  });

  return respuesta.usuario;
}

export async function iniciarSesion(datos) {
  const respuesta = await solicitarApi('/api/sesiones', {
    method: 'POST',
    cuerpo: datos,
  });

  return respuesta.usuario;
}

export async function cerrarSesion() {
  await solicitarApi('/api/sesiones', { method: 'DELETE' });
}
