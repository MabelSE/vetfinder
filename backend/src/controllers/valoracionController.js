import { crearError } from '../utils/errorHttp.js';
import { parsearId } from '../utils/identificador.js';
import { validarDatosReporte, validarDatosValoracion } from '../validators/valoracionValidator.js';
import {
  crearReporte,
  crearValoracion,
  listarValoracionesDelAdministrador,
  obtenerValoracionesPublicas,
} from '../services/valoracionService.js';

export async function listarValoracionesPublicas(req, res, next) {
  try {
    const { id, error } = parsearId(req.params.id, 'veterinaria');

    if (error) {
      next(crearError(400, error));
      return;
    }

    const resultado = await obtenerValoracionesPublicas(id);
    res.json(resultado);
  } catch (error) {
    next(error);
  }
}

export async function listarValoracionesAdmin(req, res, next) {
  try {
    const resultado = await listarValoracionesDelAdministrador(req.usuario.idUsuario);
    res.json(resultado);
  } catch (error) {
    next(error);
  }
}

export async function crearValoracionDelPropietario(req, res, next) {
  try {
    const { errores, datos } = validarDatosValoracion(req.body);

    if (errores.length > 0) {
      next(crearError(400, errores[0]));
      return;
    }

    const valoracion = await crearValoracion(req.usuario.idUsuario, datos);
    res.status(201).json({ valoracion });
  } catch (error) {
    next(error);
  }
}

export async function crearReporteDeValoracion(req, res, next) {
  try {
    const { id, error } = parsearId(req.params.id, 'valoración');

    if (error) {
      next(crearError(400, error));
      return;
    }

    const { errores, datos } = validarDatosReporte(req.body);

    if (errores.length > 0) {
      next(crearError(400, errores[0]));
      return;
    }

    const reporte = await crearReporte(req.usuario.idUsuario, id, datos);
    res.status(201).json({ reporte });
  } catch (error) {
    next(error);
  }
}
