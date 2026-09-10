import { crearError } from '../utils/errorHttp.js';
import { esViolacionUnica } from '../utils/errorBaseDatos.js';
import { estaAbierta } from '../utils/horario.js';
import { esUrlDeNuestroCloudinary } from '../utils/fotografia.js';
import { obtenerCredencialesCloudinary } from '../config/cloudinary.js';
import { existenServicios } from '../repositories/servicioRepository.js';
import { existenEspecialidades } from '../repositories/especialidadRepository.js';
import { existenEspecies } from '../repositories/especieRepository.js';
import {
  actualizarAtencion as actualizarAtencionRepositorio,
  actualizarDatosGenerales,
  actualizarDisponibilidad as actualizarDisponibilidadRepositorio,
  actualizarServicioPersonalizado as actualizarServicioPersonalizadoRepositorio,
  actualizarUrlFotografia,
  compactarOrdenFotografias,
  crearFotografiaPendiente,
  crearServicioPersonalizado as crearServicioPersonalizadoRepositorio,
  eliminarFilaFotografia,
  eliminarServicioPersonalizado as eliminarServicioPersonalizadoRepositorio,
  guardarDireccion,
  listarEspeciesDeVeterinaria,
  listarEspecialidadesDeVeterinaria,
  listarFotografias,
  listarHorariosPorVeterinarias,
  listarServiciosDeVeterinaria,
  listarServiciosPersonalizados,
  obtenerFotografiaDeVeterinaria,
  obtenerServicioPersonalizado,
  obtenerSiguienteOrdenFotografia,
  obtenerVeterinariaAdminPorId,
  obtenerVeterinariaPorAdministrador,
  reemplazarHorarios as reemplazarHorariosRepositorio,
  reemplazarRelacionCatalogo,
  reordenarFotografias,
} from '../repositories/veterinariaRepository.js';
import {
  destruirFotografiaVeterinaria,
  subirFotografiaVeterinaria,
  validarArchivoFotografia,
} from './fotografiaService.js';

export async function resolverVeterinariaDelAdmin(idUsuario) {
  const veterinaria = await obtenerVeterinariaPorAdministrador(idUsuario);

  if (!veterinaria) {
    throw crearError(404, 'No se encontró la veterinaria.');
  }

  return veterinaria;
}

export async function obtenerFichaAdminPorId(idVeterinaria) {
  return armarFichaAdmin(idVeterinaria);
}

async function armarFichaAdmin(idVeterinaria) {
  const veterinaria = await obtenerVeterinariaAdminPorId(idVeterinaria);

  if (!veterinaria) {
    throw crearError(404, 'No se encontró la veterinaria.');
  }

  const [horarios, fotografias, servicios, serviciosPersonalizados, especialidades, especies] = await Promise.all([
    listarHorariosPorVeterinarias([idVeterinaria]),
    listarFotografias(idVeterinaria),
    listarServiciosDeVeterinaria(idVeterinaria),
    listarServiciosPersonalizados(idVeterinaria),
    listarEspecialidadesDeVeterinaria(idVeterinaria),
    listarEspeciesDeVeterinaria(idVeterinaria),
  ]);

  const bloques = horarios.map(({ idVeterinaria: _id, ...horario }) => horario);

  return {
    ...veterinaria,
    estaAbierta: estaAbierta(bloques, veterinaria.atencion24Horas),
    horarios: bloques,
    fotografias,
    servicios,
    serviciosPersonalizados,
    especialidades,
    especies,
  };
}

export async function obtenerFichaDelAdministrador(idUsuario) {
  const veterinaria = await resolverVeterinariaDelAdmin(idUsuario);
  return armarFichaAdmin(veterinaria.idVeterinaria);
}

export async function actualizarDatosGeneralesDelAdmin(idVeterinaria, datos) {
  await actualizarDatosGenerales(idVeterinaria, datos);
  return armarFichaAdmin(idVeterinaria);
}

export async function guardarDireccionDelAdmin(idVeterinaria, datos) {
  const direccion = await guardarDireccion(idVeterinaria, datos);
  return { direccion };
}

export async function actualizarDisponibilidadDelAdmin(idVeterinaria, disponibilidad) {
  await actualizarDisponibilidadRepositorio(idVeterinaria, disponibilidad);
  return armarFichaAdmin(idVeterinaria);
}

export async function actualizarAtencionDelAdmin(idVeterinaria, datos) {
  await actualizarAtencionRepositorio(idVeterinaria, datos);
  return armarFichaAdmin(idVeterinaria);
}

export async function reemplazarHorariosDelAdmin(idVeterinaria, horarios) {
  await reemplazarHorariosRepositorio(idVeterinaria, horarios);
  return armarFichaAdmin(idVeterinaria);
}

export async function reemplazarServiciosDelAdmin(idVeterinaria, ids) {
  if (!(await existenServicios(ids))) {
    throw crearError(400, 'Uno o más servicios no son válidos.');
  }

  await reemplazarRelacionCatalogo('veterinaria_servicio', 'id_servicio', idVeterinaria, ids);
  return armarFichaAdmin(idVeterinaria);
}

export async function reemplazarEspecialidadesDelAdmin(idVeterinaria, ids) {
  if (!(await existenEspecialidades(ids))) {
    throw crearError(400, 'Una o más especialidades no son válidas.');
  }

  await reemplazarRelacionCatalogo('veterinaria_especialidad', 'id_especialidad', idVeterinaria, ids);
  return armarFichaAdmin(idVeterinaria);
}

export async function reemplazarEspeciesDelAdmin(idVeterinaria, ids) {
  if (!(await existenEspecies(ids))) {
    throw crearError(400, 'Una o más especies no son válidas.');
  }

  await reemplazarRelacionCatalogo('veterinaria_especie', 'id_especie', idVeterinaria, ids);
  return armarFichaAdmin(idVeterinaria);
}

export async function crearServicioPersonalizadoDelAdmin(idVeterinaria, datos) {
  try {
    const servicio = await crearServicioPersonalizadoRepositorio(idVeterinaria, datos);
    return servicio;
  } catch (error) {
    if (esViolacionUnica(error, 'uq_servicio_personalizado')) {
      throw crearError(409, 'Ya existe un servicio personalizado con ese nombre.');
    }
    throw error;
  }
}

export async function actualizarServicioPersonalizadoDelAdmin(idVeterinaria, idServicioPersonalizado, datos) {
  const existente = await obtenerServicioPersonalizado(idVeterinaria, idServicioPersonalizado);

  if (!existente) {
    throw crearError(404, 'No se encontró el servicio personalizado.');
  }

  try {
    return await actualizarServicioPersonalizadoRepositorio(idVeterinaria, idServicioPersonalizado, datos);
  } catch (error) {
    if (esViolacionUnica(error, 'uq_servicio_personalizado')) {
      throw crearError(409, 'Ya existe un servicio personalizado con ese nombre.');
    }
    throw error;
  }
}

export async function eliminarServicioPersonalizadoDelAdmin(idVeterinaria, idServicioPersonalizado) {
  const eliminado = await eliminarServicioPersonalizadoRepositorio(idVeterinaria, idServicioPersonalizado);

  if (!eliminado) {
    throw crearError(404, 'No se encontró el servicio personalizado.');
  }
}

export async function crearFotografiaDelAdmin(idVeterinaria, archivo) {
  validarArchivoFotografia(archivo);
  const orden = await obtenerSiguienteOrdenFotografia(idVeterinaria);
  const pendiente = await crearFotografiaPendiente(idVeterinaria, orden);
  let urlImagen = null;

  try {
    urlImagen = await subirFotografiaVeterinaria(
      idVeterinaria,
      pendiente.idFotografiaVeterinaria,
      archivo.buffer
    );
    return await actualizarUrlFotografia(pendiente.idFotografiaVeterinaria, urlImagen);
  } catch (error) {
    await eliminarFilaFotografia(idVeterinaria, pendiente.idFotografiaVeterinaria);

    if (urlImagen) {
      try {
        await destruirFotografiaVeterinaria(
          urlImagen,
          idVeterinaria,
          pendiente.idFotografiaVeterinaria
        );
      } catch (errorLimpieza) {
        console.error('No se pudo revertir la fotografía en Cloudinary.', errorLimpieza);
      }
    }

    throw error;
  }
}

export async function reemplazarFotografiaDelAdmin(idVeterinaria, idFotografiaVeterinaria, archivo) {
  validarArchivoFotografia(archivo);
  const fotografia = await obtenerFotografiaDeVeterinaria(idVeterinaria, idFotografiaVeterinaria);

  if (!fotografia) {
    throw crearError(404, 'No se encontró la fotografía.');
  }

  const urlImagen = await subirFotografiaVeterinaria(
    idVeterinaria,
    idFotografiaVeterinaria,
    archivo.buffer
  );
  return actualizarUrlFotografia(idFotografiaVeterinaria, urlImagen);
}

function hostnameDeUrl(url) {
  try {
    return new URL(url).hostname;
  } catch {
    return '';
  }
}

export async function asegurarEliminacionCloudinaryDeFotografias(fotografias, idVeterinaria) {
  const credenciales = obtenerCredencialesCloudinary();

  for (const fotografia of fotografias) {
    const urlImagen = fotografia.urlImagen;
    const esNuestra = Boolean(
      credenciales && esUrlDeNuestroCloudinary(urlImagen, credenciales.cloudName)
    );

    if (esNuestra) {
      await destruirFotografiaVeterinaria(
        urlImagen,
        idVeterinaria,
        fotografia.idFotografiaVeterinaria
      );
    } else if (!credenciales && hostnameDeUrl(urlImagen) === 'res.cloudinary.com') {
      throw crearError(503, 'El almacenamiento de fotografías no está configurado.');
    }
  }
}

export async function eliminarFotografiaDelAdmin(idVeterinaria, idFotografiaVeterinaria) {
  const fotografia = await obtenerFotografiaDeVeterinaria(idVeterinaria, idFotografiaVeterinaria);

  if (!fotografia) {
    throw crearError(404, 'No se encontró la fotografía.');
  }

  await asegurarEliminacionCloudinaryDeFotografias([fotografia], idVeterinaria);
  await eliminarFilaFotografia(idVeterinaria, idFotografiaVeterinaria);
  await compactarOrdenFotografias(idVeterinaria);
}

export async function reordenarFotografiasDelAdmin(idVeterinaria, idsFotografia) {
  const actuales = await listarFotografias(idVeterinaria);
  const idsActuales = actuales.map((foto) => foto.idFotografiaVeterinaria).sort((a, b) => a - b);
  const idsEnviados = [...idsFotografia].sort((a, b) => a - b);

  if (
    idsActuales.length !== idsEnviados.length
    || idsActuales.some((id, indice) => id !== idsEnviados[indice])
  ) {
    throw crearError(400, 'El orden de fotografías no es válido.');
  }

  await reordenarFotografias(idVeterinaria, idsFotografia);
  return listarFotografias(idVeterinaria);
}
