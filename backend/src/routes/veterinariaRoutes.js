import { Router } from 'express';
import { listarVeterinarias, obtenerVeterinaria } from '../controllers/veterinariaController.js';
import { listarValoracionesPublicas } from '../controllers/valoracionController.js';
import { requerirAutenticacion } from '../middlewares/autenticacionMiddleware.js';
import { requerirRol } from '../middlewares/autorizacionMiddleware.js';
import { requerirVeterinariaDelAdmin } from '../middlewares/veterinariaAdminMiddleware.js';
import { veterinariaAdminRoutes } from './veterinariaAdminRoutes.js';

export const veterinariaRoutes = Router();

veterinariaRoutes.use(
  '/mia',
  requerirAutenticacion,
  requerirRol('ADMIN_VETERINARIA'),
  requerirVeterinariaDelAdmin,
  veterinariaAdminRoutes
);
veterinariaRoutes.get('/', listarVeterinarias);
veterinariaRoutes.get('/:id/valoraciones', listarValoracionesPublicas);
veterinariaRoutes.get('/:id', obtenerVeterinaria);
