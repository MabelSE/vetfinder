import { crearError } from '../utils/errorHttp.js';
import { validarDatosVisita } from '../validators/visitaValidator.js';
import { crearVisita, listarVisitas } from '../services/visitaService.js';

export async function listarVisitasDelPropietario(req, res, next) {
  try {
    const visitas = await listarVisitas(req.usuario.idUsuario);
    res.json({ visitas });
  } catch (error) {
    next(error);
  }
}

export async function crearVisitaDelPropietario(req, res, next) {
  try {
    const { errores, datos } = validarDatosVisita(req.body);

    if (errores.length > 0) {
      next(crearError(400, errores[0]));
      return;
    }

    const visita = await crearVisita(req.usuario.idUsuario, datos);
    res.status(201).json({ visita });
  } catch (error) {
    next(error);
  }
}
