import { crearError } from '../utils/errorHttp.js';
import { parsearId } from '../utils/identificador.js';
import { validarDatosAlergia } from '../validators/mascotaValidator.js';
import {
  actualizarAlergia,
  crearAlergia,
  eliminarAlergia,
  listarAlergias,
} from '../services/alergiaService.js';

export async function listarAlergiasDeMascota(req, res, next) {
  try {
    const alergias = await listarAlergias(req.mascota.idMascota);
    res.json({ alergias });
  } catch (error) {
    next(error);
  }
}

export async function crearAlergiaDeMascota(req, res, next) {
  try {
    const { errores, datos } = validarDatosAlergia(req.body);

    if (errores.length > 0) {
      next(crearError(400, errores[0]));
      return;
    }

    const alergia = await crearAlergia(req.mascota.idMascota, datos);
    res.status(201).json({ alergia });
  } catch (error) {
    next(error);
  }
}

export async function actualizarAlergiaDeMascota(req, res, next) {
  try {
    const { id, error } = parsearId(req.params.idAlergia, 'alergia');

    if (error) {
      next(crearError(400, error));
      return;
    }

    const { errores, datos } = validarDatosAlergia(req.body);

    if (errores.length > 0) {
      next(crearError(400, errores[0]));
      return;
    }

    const alergia = await actualizarAlergia(req.mascota.idMascota, id, datos);
    res.json({ alergia });
  } catch (error) {
    next(error);
  }
}

export async function eliminarAlergiaDeMascota(req, res, next) {
  try {
    const { id, error } = parsearId(req.params.idAlergia, 'alergia');

    if (error) {
      next(crearError(400, error));
      return;
    }

    await eliminarAlergia(req.mascota.idMascota, id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}
