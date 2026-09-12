import { crearError } from '../utils/errorHttp.js';
import { parsearId } from '../utils/identificador.js';
import { validarDatosVacuna } from '../validators/mascotaValidator.js';
import {
  actualizarComprobanteVacuna,
  actualizarVacuna,
  crearVacuna,
  eliminarComprobanteVacuna,
  eliminarVacuna,
  listarVacunas,
} from '../services/vacunaService.js';

export async function listarVacunasDeMascota(req, res, next) {
  try {
    const vacunas = await listarVacunas(req.mascota.idMascota);
    res.json({ vacunas });
  } catch (error) {
    next(error);
  }
}

export async function crearVacunaDeMascota(req, res, next) {
  try {
    const { errores, datos } = validarDatosVacuna(req.body);

    if (errores.length > 0) {
      next(crearError(400, errores[0]));
      return;
    }

    const vacuna = await crearVacuna(req.mascota.idMascota, datos);
    res.status(201).json({ vacuna });
  } catch (error) {
    next(error);
  }
}

export async function actualizarVacunaDeMascota(req, res, next) {
  try {
    const { id, error } = parsearId(req.params.idVacuna, 'vacuna');

    if (error) {
      next(crearError(400, error));
      return;
    }

    const { errores, datos } = validarDatosVacuna(req.body);

    if (errores.length > 0) {
      next(crearError(400, errores[0]));
      return;
    }

    const vacuna = await actualizarVacuna(req.mascota.idMascota, id, datos);
    res.json({ vacuna });
  } catch (error) {
    next(error);
  }
}

export async function actualizarComprobanteDeVacuna(req, res, next) {
  try {
    const { id, error } = parsearId(req.params.idVacuna, 'vacuna');

    if (error) {
      next(crearError(400, error));
      return;
    }

    const vacuna = await actualizarComprobanteVacuna(req.mascota.idMascota, id, req.file);
    res.json({ vacuna });
  } catch (error) {
    next(error);
  }
}

export async function eliminarComprobanteDeVacuna(req, res, next) {
  try {
    const { id, error } = parsearId(req.params.idVacuna, 'vacuna');

    if (error) {
      next(crearError(400, error));
      return;
    }

    const vacuna = await eliminarComprobanteVacuna(req.mascota.idMascota, id);
    res.json({ vacuna });
  } catch (error) {
    next(error);
  }
}

export async function eliminarVacunaDeMascota(req, res, next) {
  try {
    const { id, error } = parsearId(req.params.idVacuna, 'vacuna');

    if (error) {
      next(crearError(400, error));
      return;
    }

    await eliminarVacuna(req.mascota.idMascota, id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}
