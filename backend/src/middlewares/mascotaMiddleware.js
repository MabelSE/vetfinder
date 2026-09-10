import { crearError } from '../utils/errorHttp.js';
import { parsearId } from '../utils/identificador.js';
import { obtenerMascotaDePropietario } from '../services/mascotaService.js';

export async function requerirMascotaPropia(req, res, next) {
  try {
    const { id, error } = parsearId(req.params.id, 'mascota');

    if (error) {
      next(crearError(400, error));
      return;
    }

    req.mascota = await obtenerMascotaDePropietario(id, req.usuario.idUsuario);
    next();
  } catch (error) {
    next(error);
  }
}
