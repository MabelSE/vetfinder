import { listarEspecialidades } from '../repositories/especialidadRepository.js';

export async function obtenerEspecialidades() {
  return listarEspecialidades();
}
