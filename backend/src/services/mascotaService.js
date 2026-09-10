import { crearError } from '../utils/errorHttp.js';
import { existeEspecie } from '../repositories/especieRepository.js';
import {
  actualizarFotografiaMascota,
  actualizarMascota as actualizarMascotaRepositorio,
  contarVisitasPorMascota,
  crearMascota as crearMascotaRepositorio,
  eliminarRegistrosAsociadosYMascota,
  listarMascotasPorUsuario,
  obtenerMascotaPorId,
} from '../repositories/mascotaRepository.js';
import {
  destruirFotografiaMascota,
  subirFotografiaMascota,
  validarArchivoFotografia,
} from './fotografiaService.js';
import { armarPdfMascota } from './pdfMascotaService.js';
import { listarVacunas } from './vacunaService.js';
import { listarEnfermedades } from './enfermedadService.js';
import { listarAlergias } from './alergiaService.js';

export async function listarMascotas(idUsuario) {
  return listarMascotasPorUsuario(idUsuario);
}

export async function obtenerMascotaDePropietario(idMascota, idUsuario) {
  const mascota = await obtenerMascotaPorId(idMascota);

  if (!mascota || mascota.idUsuario !== idUsuario) {
    throw crearError(404, 'No se encontró la mascota.');
  }

  return mascota;
}

export async function crearMascota(idUsuario, datos) {
  const especieExiste = await existeEspecie(datos.idEspecie);

  if (!especieExiste) {
    throw crearError(400, 'La especie seleccionada no es válida.');
  }

  return crearMascotaRepositorio(idUsuario, datos);
}

export async function actualizarMascota(idMascota, idUsuario, datos) {
  await obtenerMascotaDePropietario(idMascota, idUsuario);

  const especieExiste = await existeEspecie(datos.idEspecie);

  if (!especieExiste) {
    throw crearError(400, 'La especie seleccionada no es válida.');
  }

  return actualizarMascotaRepositorio(idMascota, datos);
}

export async function actualizarFotografia(idMascota, idUsuario, archivo) {
  await obtenerMascotaDePropietario(idMascota, idUsuario);
  validarArchivoFotografia(archivo);

  const urlFotografia = await subirFotografiaMascota(idMascota, archivo.buffer);

  try {
    return await actualizarFotografiaMascota(idMascota, urlFotografia);
  } catch (error) {
    console.error('La fotografía se subió, pero no se pudo guardar la URL.', error);
    throw crearError(500, 'No fue posible guardar la fotografía.');
  }
}

export async function eliminarFotografia(idMascota, idUsuario) {
  const mascota = await obtenerMascotaDePropietario(idMascota, idUsuario);

  if (!mascota.fotografia) {
    return mascota;
  }

  const urlAnterior = mascota.fotografia;
  const actualizada = await actualizarFotografiaMascota(idMascota, null);

  try {
    await destruirFotografiaMascota(idMascota, urlAnterior);
  } catch (error) {
    try {
      await actualizarFotografiaMascota(idMascota, urlAnterior);
    } catch (errorRestaurar) {
      console.error('No se pudo restaurar la URL de la fotografía.', errorRestaurar);
    }

    throw error;
  }

  return actualizada;
}

export async function eliminarMascota(idMascota, idUsuario) {
  const mascota = await obtenerMascotaDePropietario(idMascota, idUsuario);

  // Primero se confirma que la mascota sea eliminable. Cloudinary solo se limpia después del DELETE en PostgreSQL.
  const totalVisitas = await contarVisitasPorMascota(idMascota);

  if (totalVisitas > 0) {
    throw crearError(
      409,
      'No es posible eliminar la mascota porque existe historial de visitas asociado.'
    );
  }

  await eliminarRegistrosAsociadosYMascota(idMascota);

  try {
    await destruirFotografiaMascota(idMascota, mascota.fotografia);
  } catch (error) {
    console.error('La mascota fue eliminada, pero no se pudo limpiar la fotografía.', error);
  }
}

export async function generarPdfMascota(mascota, secciones) {
  const vacunas = secciones.includes('vacunas') ? await listarVacunas(mascota.idMascota) : [];
  const enfermedades = secciones.includes('enfermedades')
    ? await listarEnfermedades(mascota.idMascota)
    : [];
  const alergias = secciones.includes('alergias') ? await listarAlergias(mascota.idMascota) : [];

  return armarPdfMascota({
    mascota,
    vacunas,
    enfermedades,
    alergias,
    secciones,
  });
}
