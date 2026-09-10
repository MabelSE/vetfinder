import { crearError } from '../utils/errorHttp.js';

export function requerirRol(...rolesPermitidos) {
  return (req, res, next) => {
    if (!req.usuario) {
      next(crearError(401, 'Debe iniciar sesión.'));
      return;
    }

    if (!rolesPermitidos.includes(req.usuario.rol)) {
      next(crearError(403, 'No tiene permiso para esta operación.'));
      return;
    }

    next();
  };
}

export function crearMiddlewarePropiedad(verificarPropiedad) {
  return async (req, res, next) => {
    try {
      if (!req.usuario) {
        next(crearError(401, 'Debe iniciar sesión.'));
        return;
      }

      const permitido = await verificarPropiedad({
        usuario: req.usuario,
        req,
      });

      if (!permitido) {
        next(crearError(403, 'No tiene permiso sobre este recurso.'));
        return;
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}
