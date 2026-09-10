import { crearError } from '../utils/errorHttp.js';
import { resolverVeterinariaDelAdmin } from '../services/veterinariaAdminService.js';

export async function requerirVeterinariaDelAdmin(req, res, next) {
  try {
    req.veterinariaAdmin = await resolverVeterinariaDelAdmin(req.usuario.idUsuario);
    next();
  } catch (error) {
    next(error);
  }
}

export function idVeterinariaAdmin(req) {
  return req.veterinariaAdmin.idVeterinaria;
}
