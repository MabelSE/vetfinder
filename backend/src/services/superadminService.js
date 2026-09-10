import { crearError } from '../utils/errorHttp.js';
import { omitirContrasena } from '../utils/usuarioPublico.js';
import {
  actualizarEstadoCuenta,
  contarSuperAdminActivos,
  listarUsuariosAdministracion,
  obtenerUsuarioPorId,
} from '../repositories/usuarioRepository.js';
import {
  actualizarEstadoRegistro,
  contarHorariosPorVeterinaria,
  eliminarVeterinariaYDependencias,
  listarFotografias,
  listarVeterinariasAdministracion,
  obtenerResumenAdministracion,
  obtenerVeterinariaAdminPorId,
} from '../repositories/veterinariaRepository.js';
import {
  listarReportesAdministracion,
  obtenerReportePorId,
  resolverReporteValoracion,
} from '../repositories/valoracionRepository.js';
import { contarVisitasPorVeterinaria } from '../repositories/visitaRepository.js';
import {
  asegurarEliminacionCloudinaryDeFotografias,
  obtenerFichaAdminPorId,
} from './veterinariaAdminService.js';

export async function obtenerResumenDelSuperAdmin() {
  return obtenerResumenAdministracion();
}

export async function listarSolicitudesPendientes() {
  return listarVeterinariasAdministracion('PENDIENTE');
}

export async function listarVeterinariasDelSuperAdmin(estadoRegistro) {
  return listarVeterinariasAdministracion(estadoRegistro);
}

export async function obtenerVeterinariaDelSuperAdmin(idVeterinaria) {
  return obtenerFichaAdminPorId(idVeterinaria);
}

export async function aprobarVeterinaria(idVeterinaria) {
  const veterinaria = await obtenerVeterinariaAdminPorId(idVeterinaria);

  if (!veterinaria) {
    throw crearError(404, 'No se encontró la veterinaria.');
  }

  if (veterinaria.estadoRegistro === 'APROBADA') {
    throw crearError(409, 'La veterinaria ya está aprobada.');
  }

  if (veterinaria.estadoRegistro !== 'PENDIENTE' && veterinaria.estadoRegistro !== 'RECHAZADA') {
    throw crearError(409, 'La veterinaria no puede aprobarse en su estado actual.');
  }

  const cantidadHorarios = await contarHorariosPorVeterinaria(idVeterinaria);

  if (cantidadHorarios < 1) {
    throw crearError(409, 'Debe existir al menos un horario registrado antes de aprobar.');
  }

  await actualizarEstadoRegistro(idVeterinaria, 'APROBADA');
  return obtenerFichaAdminPorId(idVeterinaria);
}

export async function rechazarVeterinaria(idVeterinaria) {
  const veterinaria = await obtenerVeterinariaAdminPorId(idVeterinaria);

  if (!veterinaria) {
    throw crearError(404, 'No se encontró la veterinaria.');
  }

  if (veterinaria.estadoRegistro === 'RECHAZADA') {
    throw crearError(409, 'La veterinaria ya está rechazada.');
  }

  if (veterinaria.estadoRegistro !== 'PENDIENTE' && veterinaria.estadoRegistro !== 'APROBADA') {
    throw crearError(409, 'La veterinaria no puede rechazarse en su estado actual.');
  }

  await actualizarEstadoRegistro(idVeterinaria, 'RECHAZADA');
  return obtenerFichaAdminPorId(idVeterinaria);
}

export async function eliminarVeterinariaDelSuperAdmin(idVeterinaria) {
  const veterinaria = await obtenerVeterinariaAdminPorId(idVeterinaria);

  if (!veterinaria) {
    throw crearError(404, 'No se encontró la veterinaria.');
  }

  const totalVisitas = await contarVisitasPorVeterinaria(idVeterinaria);

  if (totalVisitas > 0) {
    throw crearError(
      409,
      'No es posible eliminar la veterinaria porque existen visitas registradas.'
    );
  }

  const fotografias = await listarFotografias(idVeterinaria);
  await asegurarEliminacionCloudinaryDeFotografias(fotografias, idVeterinaria);

  const eliminada = await eliminarVeterinariaYDependencias(idVeterinaria);

  if (!eliminada) {
    throw crearError(404, 'No se encontró la veterinaria.');
  }
}

export async function listarUsuariosDelSuperAdmin() {
  return listarUsuariosAdministracion();
}

export async function actualizarEstadoCuentaDelSuperAdmin(idUsuario, estadoCuenta, idSuperAdminSesion) {
  if (idUsuario === idSuperAdminSesion) {
    throw crearError(400, 'No puede cambiar el estado de su propia cuenta.');
  }

  const usuario = await obtenerUsuarioPorId(idUsuario);

  if (!usuario) {
    throw crearError(404, 'No se encontró el usuario.');
  }

  if (
    usuario.rol === 'SUPERADMIN'
    && usuario.estadoCuenta === 'ACTIVA'
    && estadoCuenta === 'INACTIVA'
  ) {
    const activos = await contarSuperAdminActivos();

    if (activos <= 1) {
      throw crearError(409, 'Debe permanecer al menos un SuperAdmin con cuenta activa.');
    }
  }

  const actualizado = await actualizarEstadoCuenta(idUsuario, estadoCuenta);
  return omitirContrasena(actualizado);
}

export async function listarReportesDelSuperAdmin(estado) {
  return listarReportesAdministracion(estado);
}

export async function resolverReporteDelSuperAdmin(idReporte, datos) {
  const reporte = await obtenerReportePorId(idReporte);

  if (!reporte) {
    throw crearError(404, 'No se encontró el reporte.');
  }

  if (reporte.estado !== 'PENDIENTE') {
    throw crearError(409, 'Este reporte ya fue resuelto.');
  }

  const actualizado = await resolverReporteValoracion(idReporte, datos);

  if (!actualizado) {
    throw crearError(409, 'Este reporte ya fue resuelto.');
  }

  return obtenerReportePorId(idReporte);
}
