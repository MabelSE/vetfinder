import { crearError } from '../utils/errorHttp.js';
import { omitirContrasena } from '../utils/usuarioPublico.js';
import {
  actualizarDatosPersonales,
  obtenerUsuarioPorCorreo,
  obtenerUsuarioPorId,
} from '../repositories/usuarioRepository.js';

export async function obtenerPerfil(idUsuario) {
  const usuario = await obtenerUsuarioPorId(idUsuario);

  if (!usuario) {
    throw crearError(404, 'No se encontró el perfil solicitado.');
  }

  return omitirContrasena(usuario);
}

export async function actualizarPerfil(idUsuario, datosPersonales) {
  const usuarioActual = await obtenerUsuarioPorId(idUsuario);

  if (!usuarioActual) {
    throw crearError(404, 'No se encontró el perfil solicitado.');
  }

  if (datosPersonales.correo !== usuarioActual.correo) {
    const existente = await obtenerUsuarioPorCorreo(datosPersonales.correo);

    if (existente && existente.idUsuario !== idUsuario) {
      throw crearError(409, 'Ya existe una cuenta con ese correo.');
    }
  }

  const usuarioActualizado = await actualizarDatosPersonales(idUsuario, datosPersonales);
  return omitirContrasena(usuarioActualizado);
}
