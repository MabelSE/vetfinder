import { obtenerEspecies } from '../services/especieService.js';

export async function listarEspecies(req, res, next) {
  try {
    const especies = await obtenerEspecies();
    res.json({ especies });
  } catch (error) {
    next(error);
  }
}
