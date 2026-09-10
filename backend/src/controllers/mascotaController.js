import { crearError } from '../utils/errorHttp.js';
import { validarDatosMascota } from '../validators/mascotaValidator.js';
import { validarSeccionesPdf } from '../validators/pdfMascotaValidator.js';
import {
  actualizarFotografia,
  actualizarMascota,
  crearMascota,
  eliminarFotografia,
  eliminarMascota,
  generarPdfMascota,
  listarMascotas,
} from '../services/mascotaService.js';

export async function listarMascotasDelPropietario(req, res, next) {
  try {
    const mascotas = await listarMascotas(req.usuario.idUsuario);
    res.json({ mascotas });
  } catch (error) {
    next(error);
  }
}

export async function obtenerMascotaActual(req, res, next) {
  try {
    res.json({ mascota: req.mascota });
  } catch (error) {
    next(error);
  }
}

export async function crearMascotaDelPropietario(req, res, next) {
  try {
    const { errores, datos } = validarDatosMascota(req.body);

    if (errores.length > 0) {
      next(crearError(400, errores[0]));
      return;
    }

    const mascota = await crearMascota(req.usuario.idUsuario, datos);
    res.status(201).json({ mascota });
  } catch (error) {
    next(error);
  }
}

export async function actualizarMascotaActual(req, res, next) {
  try {
    const { errores, datos } = validarDatosMascota(req.body);

    if (errores.length > 0) {
      next(crearError(400, errores[0]));
      return;
    }

    const mascota = await actualizarMascota(req.mascota.idMascota, req.usuario.idUsuario, datos);
    res.json({ mascota });
  } catch (error) {
    next(error);
  }
}

export async function actualizarFotografiaActual(req, res, next) {
  try {
    const mascota = await actualizarFotografia(
      req.mascota.idMascota,
      req.usuario.idUsuario,
      req.file
    );
    res.json({ mascota });
  } catch (error) {
    next(error);
  }
}

export async function eliminarFotografiaActual(req, res, next) {
  try {
    const mascota = await eliminarFotografia(req.mascota.idMascota, req.usuario.idUsuario);
    res.json({ mascota });
  } catch (error) {
    next(error);
  }
}

export async function eliminarMascotaActual(req, res, next) {
  try {
    await eliminarMascota(req.mascota.idMascota, req.usuario.idUsuario);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

export async function exportarPdfMascotaActual(req, res, next) {
  try {
    const { errores, secciones } = validarSeccionesPdf(req.body);

    if (errores.length > 0) {
      next(crearError(400, errores[0]));
      return;
    }

    const { buffer, nombreArchivo } = await generarPdfMascota(req.mascota, secciones);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${nombreArchivo}"`);
    res.setHeader('Content-Length', String(buffer.length));
    res.end(buffer);
  } catch (error) {
    next(error);
  }
}
