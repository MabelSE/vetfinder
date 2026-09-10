import { crearError } from '../utils/errorHttp.js';
import { parsearId } from '../utils/identificador.js';
import { validarDatosEnfermedad } from '../validators/mascotaValidator.js';
import {
  actualizarEnfermedad,
  crearEnfermedad,
  eliminarEnfermedad,
  listarEnfermedades,
} from '../services/enfermedadService.js';

export async function listarEnfermedadesDeMascota(req, res, next) {
  try {
    const enfermedades = await listarEnfermedades(req.mascota.idMascota);
    res.json({ enfermedades });
  } catch (error) {
    next(error);
  }
}

export async function crearEnfermedadDeMascota(req, res, next) {
  try {
    const { errores, datos } = validarDatosEnfermedad(req.body);

    if (errores.length > 0) {
      next(crearError(400, errores[0]));
      return;
    }

    const enfermedad = await crearEnfermedad(req.mascota.idMascota, datos);
    res.status(201).json({ enfermedad });
  } catch (error) {
    next(error);
  }
}

export async function actualizarEnfermedadDeMascota(req, res, next) {
  try {
    const { id, error } = parsearId(req.params.idEnfermedad, 'enfermedad');

    if (error) {
      next(crearError(400, error));
      return;
    }

    const { errores, datos } = validarDatosEnfermedad(req.body);

    if (errores.length > 0) {
      next(crearError(400, errores[0]));
      return;
    }

    const enfermedad = await actualizarEnfermedad(req.mascota.idMascota, id, datos);
    res.json({ enfermedad });
  } catch (error) {
    next(error);
  }
}

export async function eliminarEnfermedadDeMascota(req, res, next) {
  try {
    const { id, error } = parsearId(req.params.idEnfermedad, 'enfermedad');

    if (error) {
      next(crearError(400, error));
      return;
    }

    await eliminarEnfermedad(req.mascota.idMascota, id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}
