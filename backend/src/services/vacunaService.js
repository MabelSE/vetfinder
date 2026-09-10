import { crearError } from '../utils/errorHttp.js';
import {
  actualizarVacuna as actualizarVacunaRepositorio,
  crearVacuna as crearVacunaRepositorio,
  eliminarVacuna as eliminarVacunaRepositorio,
  listarVacunasPorMascota,
  obtenerVacunaPorId,
} from '../repositories/vacunaRepository.js';

async function obtenerVacunaDeMascota(idVacuna, idMascota) {
  const vacuna = await obtenerVacunaPorId(idVacuna);

  if (!vacuna || vacuna.idMascota !== idMascota) {
    throw crearError(404, 'No se encontró la vacuna.');
  }

  return vacuna;
}

export async function listarVacunas(idMascota) {
  return listarVacunasPorMascota(idMascota);
}

export async function crearVacuna(idMascota, datos) {
  return crearVacunaRepositorio(idMascota, datos);
}

export async function actualizarVacuna(idMascota, idVacuna, datos) {
  await obtenerVacunaDeMascota(idVacuna, idMascota);
  return actualizarVacunaRepositorio(idVacuna, datos);
}

export async function eliminarVacuna(idMascota, idVacuna) {
  await obtenerVacunaDeMascota(idVacuna, idMascota);
  await eliminarVacunaRepositorio(idVacuna);
}
