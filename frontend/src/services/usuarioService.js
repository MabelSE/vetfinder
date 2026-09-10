import { solicitarApi } from './apiCliente.js';

export async function obtenerPerfil() {
  const respuesta = await solicitarApi('/api/perfil');
  return respuesta.usuario;
}

export async function actualizarPerfil(datosPersonales) {
  const respuesta = await solicitarApi('/api/perfil', {
    method: 'PUT',
    cuerpo: {
      nombre: datosPersonales.nombre,
      apellido: datosPersonales.apellido,
      correo: datosPersonales.correo,
      telefono: datosPersonales.telefono,
    },
  });

  return respuesta.usuario;
}
