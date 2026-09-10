import { crearError } from '../utils/errorHttp.js';
import { obtenerUsuarioPorId } from '../repositories/usuarioRepository.js';
import { omitirContrasena } from '../utils/usuarioPublico.js';

export async function requerirAutenticacion(req, res, next) {
  try {
    const idUsuario = req.session?.idUsuario;

    if (!idUsuario) {
      next(crearError(401, 'Debe iniciar sesión.'));
      return;
    }

    const usuario = await obtenerUsuarioPorId(idUsuario);

    if (!usuario || usuario.estadoCuenta !== 'ACTIVA') {
      req.session.destroy(() => {});
      next(crearError(401, 'Debe iniciar sesión.'));
      return;
    }

    req.usuario = omitirContrasena(usuario);
    next();
  } catch (error) {
    next(error);
  }
}
