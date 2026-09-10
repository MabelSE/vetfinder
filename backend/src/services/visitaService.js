import { crearError } from '../utils/errorHttp.js';
import { obtenerFechaHoySantiago } from '../utils/fecha.js';
import { obtenerMascotaDePropietario } from './mascotaService.js';
import { obtenerVeterinariaPublicaPorId } from '../repositories/veterinariaRepository.js';
import {
  crearVisita as crearVisitaRepositorio,
  listarVisitasPorPropietario,
  obtenerVisitaPorId,
} from '../repositories/visitaRepository.js';

export async function listarVisitas(idUsuario) {
  return listarVisitasPorPropietario(idUsuario);
}

export async function crearVisita(idUsuario, datos) {
  await obtenerMascotaDePropietario(datos.idMascota, idUsuario);

  const veterinaria = await obtenerVeterinariaPublicaPorId(datos.idVeterinaria);

  if (!veterinaria) {
    throw crearError(400, 'Seleccione una veterinaria publicada.');
  }

  if (datos.fechaVisita > obtenerFechaHoySantiago()) {
    throw crearError(400, 'Ingrese una fecha de visita válida.');
  }

  const visita = await crearVisitaRepositorio(datos);
  delete visita.idUsuarioPropietario;
  return visita;
}

export async function obtenerVisitaDePropietario(idVisita, idUsuario) {
  const visita = await obtenerVisitaPorId(idVisita);

  if (!visita || visita.idUsuarioPropietario !== idUsuario) {
    throw crearError(404, 'No se encontró la visita.');
  }

  const { idUsuarioPropietario, ...publica } = visita;
  return publica;
}
