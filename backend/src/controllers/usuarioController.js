import { crearError } from '../utils/errorHttp.js';
import { validarDatosPersonales } from '../validators/usuarioValidator.js';
import { actualizarPerfil, obtenerPerfil } from '../services/usuarioService.js';

export async function obtenerPerfilActual(req, res, next) {
  try {
    const usuario = await obtenerPerfil(req.usuario.idUsuario);
    res.json({ usuario });
  } catch (error) {
    next(error);
  }
}

export async function actualizarPerfilActual(req, res, next) {
  try {
    const { errores, datos } = validarDatosPersonales(req.body);

    if (errores.length > 0) {
      next(crearError(400, errores[0]));
      return;
    }

    const usuario = await actualizarPerfil(req.usuario.idUsuario, datos);
    res.json({ usuario });
  } catch (error) {
    next(error);
  }
}
