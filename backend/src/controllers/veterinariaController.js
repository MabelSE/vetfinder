import { crearError } from '../utils/errorHttp.js';
import { parsearId } from '../utils/identificador.js';
import { validarFiltrosVeterinaria } from '../validators/veterinariaValidator.js';
import { listarVeterinariasPublicas, obtenerFichaPublica } from '../services/veterinariaService.js';

export async function listarVeterinarias(req, res, next) {
  try {
    const { errores, filtros } = validarFiltrosVeterinaria(req.query);

    if (errores.length > 0) {
      next(crearError(400, errores[0]));
      return;
    }

    const veterinarias = await listarVeterinariasPublicas(filtros);
    res.json({ veterinarias });
  } catch (error) {
    next(error);
  }
}

export async function obtenerVeterinaria(req, res, next) {
  try {
    const { id, error } = parsearId(req.params.id, 'veterinaria');

    if (error) {
      next(crearError(400, error));
      return;
    }

    const veterinaria = await obtenerFichaPublica(id);
    res.json({ veterinaria });
  } catch (error) {
    next(error);
  }
}
