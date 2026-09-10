import { obtenerEspecialidades } from '../services/especialidadService.js';

export async function listarEspecialidades(req, res, next) {
  try {
    const especialidades = await obtenerEspecialidades();
    res.json({ especialidades });
  } catch (error) {
    next(error);
  }
}
