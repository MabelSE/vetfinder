import { crearError } from '../utils/errorHttp.js';
import { parsearId } from '../utils/identificador.js';
import { obtenerVeterinariaAdminPorId } from '../repositories/veterinariaRepository.js';

export async function requerirVeterinariaPorParametro(req, res, next) {
  try {
    const { id, error } = parsearId(req.params.idVeterinaria, 'veterinaria');

    if (error) {
      next(crearError(400, error));
      return;
    }

    const veterinaria = await obtenerVeterinariaAdminPorId(id);

    if (!veterinaria) {
      next(crearError(404, 'No se encontró la veterinaria.'));
      return;
    }

    req.veterinariaAdmin = { idVeterinaria: id };
    next();
  } catch (error) {
    next(error);
  }
}
