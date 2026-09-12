import { crearError } from '../utils/errorHttp.js';
import {
  actualizarFotografiaComprobante,
  actualizarVacuna as actualizarVacunaRepositorio,
  crearVacuna as crearVacunaRepositorio,
  eliminarVacuna as eliminarVacunaRepositorio,
  listarVacunasPorMascota,
  obtenerVacunaPorId,
} from '../repositories/vacunaRepository.js';
import {
  destruirComprobanteVacuna,
  subirComprobanteVacuna,
  validarArchivoFotografia,
} from './fotografiaService.js';

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

export async function actualizarComprobanteVacuna(idMascota, idVacuna, archivo) {
  await obtenerVacunaDeMascota(idVacuna, idMascota);
  validarArchivoFotografia(archivo);

  const urlComprobante = await subirComprobanteVacuna(idMascota, idVacuna, archivo.buffer);

  try {
    return await actualizarFotografiaComprobante(idVacuna, urlComprobante);
  } catch (error) {
    console.error('El comprobante se subió, pero no se pudo guardar la URL.', error);
    throw crearError(500, 'No fue posible guardar el comprobante.');
  }
}

export async function eliminarComprobanteVacuna(idMascota, idVacuna) {
  const vacuna = await obtenerVacunaDeMascota(idVacuna, idMascota);

  if (!vacuna.fotografiaComprobante) {
    return vacuna;
  }

  const urlAnterior = vacuna.fotografiaComprobante;
  const actualizada = await actualizarFotografiaComprobante(idVacuna, null);

  try {
    await destruirComprobanteVacuna(urlAnterior, idMascota, idVacuna);
  } catch (error) {
    try {
      await actualizarFotografiaComprobante(idVacuna, urlAnterior);
    } catch (errorRestaurar) {
      console.error('No se pudo restaurar la URL del comprobante.', errorRestaurar);
    }

    throw error;
  }

  return actualizada;
}

export async function asegurarEliminacionComprobantesVacunas(vacunas, idMascota) {
  for (const vacuna of vacunas) {
    await destruirComprobanteVacuna(vacuna.fotografiaComprobante, idMascota, vacuna.idVacuna);
  }
}

export async function eliminarVacuna(idMascota, idVacuna) {
  const vacuna = await obtenerVacunaDeMascota(idVacuna, idMascota);
  await destruirComprobanteVacuna(vacuna.fotografiaComprobante, idMascota, idVacuna);
  await eliminarVacunaRepositorio(idVacuna);
}
