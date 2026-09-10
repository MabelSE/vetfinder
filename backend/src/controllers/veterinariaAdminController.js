import { crearError } from '../utils/errorHttp.js';
import { parsearId } from '../utils/identificador.js';
import { idVeterinariaAdmin } from '../middlewares/veterinariaAdminMiddleware.js';
import {
  validarAtencion,
  validarDatosDireccion,
  validarDatosGenerales,
  validarDisponibilidad,
  validarHorarios,
  validarIdsCatalogo,
  validarOrdenFotografias,
  validarServicioPersonalizado,
} from '../validators/veterinariaAdminValidator.js';
import {
  actualizarAtencionDelAdmin,
  actualizarDatosGeneralesDelAdmin,
  actualizarDisponibilidadDelAdmin,
  actualizarServicioPersonalizadoDelAdmin,
  crearFotografiaDelAdmin,
  crearServicioPersonalizadoDelAdmin,
  eliminarFotografiaDelAdmin,
  eliminarServicioPersonalizadoDelAdmin,
  guardarDireccionDelAdmin,
  obtenerFichaAdminPorId,
  reemplazarEspecialidadesDelAdmin,
  reemplazarEspeciesDelAdmin,
  reemplazarFotografiaDelAdmin,
  reemplazarHorariosDelAdmin,
  reemplazarServiciosDelAdmin,
  reordenarFotografiasDelAdmin,
} from '../services/veterinariaAdminService.js';

function responderSiInvalido(errores, next) {
  if (errores.length > 0) {
    next(crearError(400, errores[0]));
    return true;
  }

  return false;
}

export async function obtenerMiVeterinaria(req, res, next) {
  try {
    const veterinaria = await obtenerFichaAdminPorId(idVeterinariaAdmin(req));
    res.json({ veterinaria });
  } catch (error) {
    next(error);
  }
}

export async function actualizarMiVeterinaria(req, res, next) {
  try {
    const { errores, datos } = validarDatosGenerales(req.body);

    if (responderSiInvalido(errores, next)) {
      return;
    }

    const veterinaria = await actualizarDatosGeneralesDelAdmin(idVeterinariaAdmin(req), datos);
    res.json({ veterinaria });
  } catch (error) {
    next(error);
  }
}

export async function actualizarMiDireccion(req, res, next) {
  try {
    const { errores, datos } = validarDatosDireccion(req.body);

    if (responderSiInvalido(errores, next)) {
      return;
    }

    const resultado = await guardarDireccionDelAdmin(idVeterinariaAdmin(req), datos);
    res.json(resultado);
  } catch (error) {
    next(error);
  }
}

export async function actualizarMiDisponibilidad(req, res, next) {
  try {
    const { errores, datos } = validarDisponibilidad(req.body);

    if (responderSiInvalido(errores, next)) {
      return;
    }

    const veterinaria = await actualizarDisponibilidadDelAdmin(
      idVeterinariaAdmin(req),
      datos.disponibilidad
    );
    res.json({ veterinaria });
  } catch (error) {
    next(error);
  }
}

export async function actualizarMiAtencion(req, res, next) {
  try {
    const { errores, datos } = validarAtencion(req.body);

    if (responderSiInvalido(errores, next)) {
      return;
    }

    const veterinaria = await actualizarAtencionDelAdmin(idVeterinariaAdmin(req), datos);
    res.json({ veterinaria });
  } catch (error) {
    next(error);
  }
}

export async function actualizarMisHorarios(req, res, next) {
  try {
    const { errores, datos } = validarHorarios(req.body);

    if (responderSiInvalido(errores, next)) {
      return;
    }

    const veterinaria = await reemplazarHorariosDelAdmin(idVeterinariaAdmin(req), datos.horarios);
    res.json({ veterinaria });
  } catch (error) {
    next(error);
  }
}

export async function actualizarMisServicios(req, res, next) {
  try {
    const { errores, datos } = validarIdsCatalogo(req.body, 'idsServicio', 'servicio');

    if (responderSiInvalido(errores, next)) {
      return;
    }

    const veterinaria = await reemplazarServiciosDelAdmin(idVeterinariaAdmin(req), datos.ids);
    res.json({ veterinaria });
  } catch (error) {
    next(error);
  }
}

export async function actualizarMisEspecialidades(req, res, next) {
  try {
    const { errores, datos } = validarIdsCatalogo(req.body, 'idsEspecialidad', 'especialidad');

    if (responderSiInvalido(errores, next)) {
      return;
    }

    const veterinaria = await reemplazarEspecialidadesDelAdmin(idVeterinariaAdmin(req), datos.ids);
    res.json({ veterinaria });
  } catch (error) {
    next(error);
  }
}

export async function actualizarMisEspecies(req, res, next) {
  try {
    const { errores, datos } = validarIdsCatalogo(req.body, 'idsEspecie', 'especie');

    if (responderSiInvalido(errores, next)) {
      return;
    }

    const veterinaria = await reemplazarEspeciesDelAdmin(idVeterinariaAdmin(req), datos.ids);
    res.json({ veterinaria });
  } catch (error) {
    next(error);
  }
}

export async function crearMiServicioPersonalizado(req, res, next) {
  try {
    const { errores, datos } = validarServicioPersonalizado(req.body);

    if (responderSiInvalido(errores, next)) {
      return;
    }

    const servicioPersonalizado = await crearServicioPersonalizadoDelAdmin(
      idVeterinariaAdmin(req),
      datos
    );
    res.status(201).json({ servicioPersonalizado });
  } catch (error) {
    next(error);
  }
}

export async function actualizarMiServicioPersonalizado(req, res, next) {
  try {
    const { id, error } = parsearId(req.params.id, 'servicio personalizado');

    if (error) {
      next(crearError(400, error));
      return;
    }

    const { errores, datos } = validarServicioPersonalizado(req.body);

    if (responderSiInvalido(errores, next)) {
      return;
    }

    const servicioPersonalizado = await actualizarServicioPersonalizadoDelAdmin(
      idVeterinariaAdmin(req),
      id,
      datos
    );
    res.json({ servicioPersonalizado });
  } catch (error) {
    next(error);
  }
}

export async function eliminarMiServicioPersonalizado(req, res, next) {
  try {
    const { id, error } = parsearId(req.params.id, 'servicio personalizado');

    if (error) {
      next(crearError(400, error));
      return;
    }

    await eliminarServicioPersonalizadoDelAdmin(idVeterinariaAdmin(req), id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

export async function crearMiFotografia(req, res, next) {
  try {
    const fotografia = await crearFotografiaDelAdmin(idVeterinariaAdmin(req), req.file);
    res.status(201).json({ fotografia });
  } catch (error) {
    next(error);
  }
}

export async function reemplazarMiFotografia(req, res, next) {
  try {
    const { id, error } = parsearId(req.params.id, 'fotografía');

    if (error) {
      next(crearError(400, error));
      return;
    }

    const fotografia = await reemplazarFotografiaDelAdmin(idVeterinariaAdmin(req), id, req.file);
    res.json({ fotografia });
  } catch (error) {
    next(error);
  }
}

export async function eliminarMiFotografia(req, res, next) {
  try {
    const { id, error } = parsearId(req.params.id, 'fotografía');

    if (error) {
      next(crearError(400, error));
      return;
    }

    await eliminarFotografiaDelAdmin(idVeterinariaAdmin(req), id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

export async function reordenarMisFotografias(req, res, next) {
  try {
    const { errores, datos } = validarOrdenFotografias(req.body);

    if (responderSiInvalido(errores, next)) {
      return;
    }

    const fotografias = await reordenarFotografiasDelAdmin(
      idVeterinariaAdmin(req),
      datos.idsFotografia
    );
    res.json({ fotografias });
  } catch (error) {
    next(error);
  }
}
