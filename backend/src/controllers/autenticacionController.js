import { crearError } from '../utils/errorHttp.js';
import { validarInicioSesion, validarRegistro } from '../validators/autenticacionValidator.js';
import { autenticarUsuario, registrarPropietario } from '../services/autenticacionService.js';
import { destruirSesion, establecerSesion } from '../config/sesion.js';

export async function registrarUsuario(req, res, next) {
  try {
    const { errores, datos } = validarRegistro(req.body);

    if (errores.length > 0) {
      next(crearError(400, errores[0]));
      return;
    }

    const usuario = await registrarPropietario(datos);
    await establecerSesion(req, usuario);

    res.status(201).json({ usuario });
  } catch (error) {
    next(error);
  }
}

export async function iniciarSesion(req, res, next) {
  try {
    const { errores, datos } = validarInicioSesion(req.body);

    if (errores.length > 0) {
      next(crearError(400, errores[0]));
      return;
    }

    const usuario = await autenticarUsuario(datos.correo, datos.contrasena);
    await establecerSesion(req, usuario);

    res.json({ usuario });
  } catch (error) {
    next(error);
  }
}

export async function cerrarSesion(req, res, next) {
  try {
    await destruirSesion(req, res);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}
