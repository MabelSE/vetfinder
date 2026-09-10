import { obtenerServicios } from '../services/servicioService.js';

export async function listarServicios(req, res, next) {
  try {
    const servicios = await obtenerServicios();
    res.json({ servicios });
  } catch (error) {
    next(error);
  }
}
