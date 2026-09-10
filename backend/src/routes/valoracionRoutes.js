import { Router } from 'express';
import { requerirAutenticacion } from '../middlewares/autenticacionMiddleware.js';
import { requerirRol } from '../middlewares/autorizacionMiddleware.js';
import {
  crearReporteDeValoracion,
  crearValoracionDelPropietario,
  listarValoracionesAdmin,
} from '../controllers/valoracionController.js';

export const valoracionRoutes = Router();

valoracionRoutes.get(
  '/',
  requerirAutenticacion,
  requerirRol('ADMIN_VETERINARIA'),
  listarValoracionesAdmin
);
valoracionRoutes.post(
  '/',
  requerirAutenticacion,
  requerirRol('PROPIETARIO'),
  crearValoracionDelPropietario
);
valoracionRoutes.post(
  '/:id/reportes',
  requerirAutenticacion,
  requerirRol('ADMIN_VETERINARIA'),
  crearReporteDeValoracion
);
