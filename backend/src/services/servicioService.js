import { listarServicios } from '../repositories/servicioRepository.js';

export async function obtenerServicios() {
  return listarServicios();
}
