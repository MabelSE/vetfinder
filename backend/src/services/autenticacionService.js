import { crearError } from '../utils/errorHttp.js';
import { hashearContrasena, verificarContrasena } from '../utils/contrasena.js';
import { omitirContrasena } from '../utils/usuarioPublico.js';
import {
  crearUsuarioPropietario,
  obtenerUsuarioPorCorreo,
} from '../repositories/usuarioRepository.js';

const MENSAJE_CREDENCIALES = 'Correo o contraseña incorrectos.';

function esCorreoDuplicado(error) {
  return error?.code === '23505';
}

export async function registrarPropietario(datos) {
  const hash = await hashearContrasena(datos.contrasena);

  try {
    const usuario = await crearUsuarioPropietario({
      nombre: datos.nombre,
      apellido: datos.apellido,
      correo: datos.correo,
      contrasena: hash,
      telefono: datos.telefono,
    });

    return omitirContrasena(usuario);
  } catch (error) {
    if (esCorreoDuplicado(error)) {
      throw crearError(409, 'Ya existe una cuenta con ese correo.');
    }

    throw error;
  }
}

export async function autenticarUsuario(correo, contrasena) {
  const usuario = await obtenerUsuarioPorCorreo(correo);

  if (!usuario) {
    throw crearError(401, MENSAJE_CREDENCIALES);
  }

  const contrasenaValida = await verificarContrasena(contrasena, usuario.contrasena);

  if (!contrasenaValida) {
    throw crearError(401, MENSAJE_CREDENCIALES);
  }

  if (usuario.estadoCuenta !== 'ACTIVA') {
    throw crearError(403, 'La cuenta no está activa.');
  }

  return omitirContrasena(usuario);
}
