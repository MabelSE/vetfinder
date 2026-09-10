import { crearError } from '../utils/errorHttp.js';
import { esViolacionUnica } from '../utils/errorBaseDatos.js';
import { obtenerVeterinariaPublicaPorId, obtenerVeterinariaPorAdministrador } from '../repositories/veterinariaRepository.js';
import {
  crearReporteValoracion as crearReporteRepositorio,
  crearValoracion as crearValoracionRepositorio,
  listarValoracionesPorVeterinariaAdmin,
  listarValoracionesPublicasPorVeterinaria,
  obtenerResumenValoraciones,
  obtenerValoracionConVeterinaria,
  obtenerValoracionPorVisita,
} from '../repositories/valoracionRepository.js';
import { obtenerVisitaDePropietario } from './visitaService.js';

export async function obtenerValoracionesPublicas(idVeterinaria) {
  const veterinaria = await obtenerVeterinariaPublicaPorId(idVeterinaria);

  if (!veterinaria) {
    throw crearError(404, 'No se encontró la veterinaria.');
  }

  const [resumen, valoraciones] = await Promise.all([
    obtenerResumenValoraciones(idVeterinaria),
    listarValoracionesPublicasPorVeterinaria(idVeterinaria),
  ]);

  return { resumen, valoraciones };
}

export async function listarValoracionesDelAdministrador(idUsuario) {
  const veterinaria = await obtenerVeterinariaPorAdministrador(idUsuario);

  if (!veterinaria) {
    throw crearError(404, 'No se encontró la veterinaria.');
  }

  const [resumen, valoraciones] = await Promise.all([
    obtenerResumenValoraciones(veterinaria.idVeterinaria),
    listarValoracionesPorVeterinariaAdmin(veterinaria.idVeterinaria),
  ]);

  return {
    veterinaria: {
      idVeterinaria: veterinaria.idVeterinaria,
      nombreComercial: veterinaria.nombreComercial,
    },
    resumen,
    valoraciones,
  };
}

export async function crearValoracion(idUsuario, datos) {
  const visita = await obtenerVisitaDePropietario(datos.idVisita, idUsuario);
  const existente = await obtenerValoracionPorVisita(visita.idVisita);

  if (existente) {
    throw crearError(409, 'Esta visita ya tiene una valoración.');
  }

  try {
    return await crearValoracionRepositorio({
      idVisita: visita.idVisita,
      puntuacion: datos.puntuacion,
      comentario: datos.comentario,
    });
  } catch (error) {
    if (esViolacionUnica(error, 'valoracion_id_visita_key')) {
      throw crearError(409, 'Esta visita ya tiene una valoración.');
    }
    throw error;
  }
}

export async function crearReporte(idUsuario, idValoracion, datos) {
  const valoracion = await obtenerValoracionConVeterinaria(idValoracion);

  if (!valoracion) {
    throw crearError(404, 'No se encontró la valoración.');
  }

  if (valoracion.idUsuarioAdmin !== idUsuario) {
    throw crearError(403, 'No puede reportar valoraciones de otra veterinaria.');
  }

  try {
    return await crearReporteRepositorio({
      idValoracion,
      idUsuario,
      motivo: datos.motivo,
    });
  } catch (error) {
    if (esViolacionUnica(error, 'uq_reporte_activo_valoracion')) {
      throw crearError(409, 'Esta valoración ya tiene un reporte pendiente.');
    }
    throw error;
  }
}
