import { listarEspecies } from '../repositories/especieRepository.js';

export async function obtenerEspecies() {
  return listarEspecies();
}
