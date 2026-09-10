import { crearError } from '../utils/errorHttp.js';
import {
  actualizarAlergia as actualizarAlergiaRepositorio,
  crearAlergia as crearAlergiaRepositorio,
  eliminarAlergia as eliminarAlergiaRepositorio,
  listarAlergiasPorMascota,
  obtenerAlergiaPorId,
} from '../repositories/alergiaRepository.js';

async function obtenerAlergiaDeMascota(idAlergia, idMascota) {
  const alergia = await obtenerAlergiaPorId(idAlergia);

  if (!alergia || alergia.idMascota !== idMascota) {
    throw crearError(404, 'No se encontró la alergia.');
  }

  return alergia;
}

export async function listarAlergias(idMascota) {
  return listarAlergiasPorMascota(idMascota);
}

export async function crearAlergia(idMascota, datos) {
  return crearAlergiaRepositorio(idMascota, datos);
}

export async function actualizarAlergia(idMascota, idAlergia, datos) {
  await obtenerAlergiaDeMascota(idAlergia, idMascota);
  return actualizarAlergiaRepositorio(idAlergia, datos);
}

export async function eliminarAlergia(idMascota, idAlergia) {
  await obtenerAlergiaDeMascota(idAlergia, idMascota);
  await eliminarAlergiaRepositorio(idAlergia);
}
