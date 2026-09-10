import { crearError } from '../utils/errorHttp.js';
import { parsearId } from '../utils/identificador.js';
import {
  validarEstadoCuenta,
  validarFiltroEstadoRegistro,
  validarFiltroEstadoReporte,
  validarResolucionReporte,
} from '../validators/superadminValidator.js';
import {
  aprobarVeterinaria,
  actualizarEstadoCuentaDelSuperAdmin,
  eliminarVeterinariaDelSuperAdmin,
  listarReportesDelSuperAdmin,
  listarSolicitudesPendientes,
  listarUsuariosDelSuperAdmin,
  listarVeterinariasDelSuperAdmin,
  obtenerResumenDelSuperAdmin,
  rechazarVeterinaria,
  resolverReporteDelSuperAdmin,
} from '../services/superadminService.js';

function responderSiInvalido(errores, next) {
  if (errores.length > 0) {
    next(crearError(400, errores[0]));
    return true;
  }

  return false;
}

export async function obtenerResumen(req, res, next) {
  try {
    const resumen = await obtenerResumenDelSuperAdmin();
    res.json({ resumen });
  } catch (error) {
    next(error);
  }
}

export async function listarSolicitudes(req, res, next) {
  try {
    const veterinarias = await listarSolicitudesPendientes();
    res.json({ veterinarias });
  } catch (error) {
    next(error);
  }
}

export async function listarVeterinarias(req, res, next) {
  try {
    const { errores, estadoRegistro } = validarFiltroEstadoRegistro(req.query.estadoRegistro);

    if (responderSiInvalido(errores, next)) {
      return;
    }

    const veterinarias = await listarVeterinariasDelSuperAdmin(estadoRegistro);
    res.json({ veterinarias });
  } catch (error) {
    next(error);
  }
}

export async function aprobar(req, res, next) {
  try {
    const { id, error } = parsearId(req.params.idVeterinaria, 'veterinaria');

    if (error) {
      next(crearError(400, error));
      return;
    }

    const veterinaria = await aprobarVeterinaria(id);
    res.json({ veterinaria });
  } catch (error) {
    next(error);
  }
}

export async function rechazar(req, res, next) {
  try {
    const { id, error } = parsearId(req.params.idVeterinaria, 'veterinaria');

    if (error) {
      next(crearError(400, error));
      return;
    }

    const veterinaria = await rechazarVeterinaria(id);
    res.json({ veterinaria });
  } catch (error) {
    next(error);
  }
}

export async function eliminarVeterinaria(req, res, next) {
  try {
    const { id, error } = parsearId(req.params.idVeterinaria, 'veterinaria');

    if (error) {
      next(crearError(400, error));
      return;
    }

    await eliminarVeterinariaDelSuperAdmin(id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

export async function listarUsuarios(req, res, next) {
  try {
    const usuarios = await listarUsuariosDelSuperAdmin();
    res.json({ usuarios });
  } catch (error) {
    next(error);
  }
}

export async function actualizarEstadoUsuario(req, res, next) {
  try {
    const { id, error } = parsearId(req.params.id, 'usuario');

    if (error) {
      next(crearError(400, error));
      return;
    }

    const { errores, datos } = validarEstadoCuenta(req.body);

    if (responderSiInvalido(errores, next)) {
      return;
    }

    const usuario = await actualizarEstadoCuentaDelSuperAdmin(
      id,
      datos.estadoCuenta,
      req.usuario.idUsuario
    );
    res.json({ usuario });
  } catch (error) {
    next(error);
  }
}

export async function listarReportes(req, res, next) {
  try {
    const { errores, estado } = validarFiltroEstadoReporte(req.query.estado);

    if (responderSiInvalido(errores, next)) {
      return;
    }

    const reportes = await listarReportesDelSuperAdmin(estado);
    res.json({ reportes });
  } catch (error) {
    next(error);
  }
}

export async function resolverReporte(req, res, next) {
  try {
    const { id, error } = parsearId(req.params.id, 'reporte');

    if (error) {
      next(crearError(400, error));
      return;
    }

    const { errores, datos } = validarResolucionReporte(req.body);

    if (responderSiInvalido(errores, next)) {
      return;
    }

    const reporte = await resolverReporteDelSuperAdmin(id, datos);
    res.json({ reporte });
  } catch (error) {
    next(error);
  }
}
