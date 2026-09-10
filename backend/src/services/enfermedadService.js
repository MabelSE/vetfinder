import { crearError } from '../utils/errorHttp.js';
import {
  actualizarEnfermedad as actualizarEnfermedadRepositorio,
  crearEnfermedad as crearEnfermedadRepositorio,
  eliminarEnfermedad as eliminarEnfermedadRepositorio,
  listarEnfermedadesPorMascota,
  obtenerEnfermedadPorId,
} from '../repositories/enfermedadRepository.js';

async function obtenerEnfermedadDeMascota(idEnfermedad, idMascota) {
  const enfermedad = await obtenerEnfermedadPorId(idEnfermedad);

  if (!enfermedad || enfermedad.idMascota !== idMascota) {
    throw crearError(404, 'No se encontró la enfermedad.');
  }

  return enfermedad;
}

export async function listarEnfermedades(idMascota) {
  return listarEnfermedadesPorMascota(idMascota);
}

export async function crearEnfermedad(idMascota, datos) {
  return crearEnfermedadRepositorio(idMascota, datos);
}

export async function actualizarEnfermedad(idMascota, idEnfermedad, datos) {
  await obtenerEnfermedadDeMascota(idEnfermedad, idMascota);
  return actualizarEnfermedadRepositorio(idEnfermedad, datos);
}

export async function eliminarEnfermedad(idMascota, idEnfermedad) {
  await obtenerEnfermedadDeMascota(idEnfermedad, idMascota);
  await eliminarEnfermedadRepositorio(idEnfermedad);
}
