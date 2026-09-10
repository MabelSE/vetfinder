import { Router } from 'express';
import { veterinariaAdminRoutes } from './veterinariaAdminRoutes.js';
import { requerirVeterinariaPorParametro } from '../middlewares/veterinariaSuperAdminMiddleware.js';
import {
  aprobar,
  actualizarEstadoUsuario,
  eliminarVeterinaria,
  listarReportes,
  listarSolicitudes,
  listarUsuarios,
  listarVeterinarias,
  obtenerResumen,
  rechazar,
  resolverReporte,
} from '../controllers/superadminController.js';

export const superadminRoutes = Router();

superadminRoutes.get('/resumen', obtenerResumen);
superadminRoutes.get('/veterinarias/solicitudes', listarSolicitudes);
superadminRoutes.get('/veterinarias', listarVeterinarias);
superadminRoutes.patch('/veterinarias/:idVeterinaria/aprobacion', aprobar);
superadminRoutes.patch('/veterinarias/:idVeterinaria/rechazo', rechazar);
superadminRoutes.delete('/veterinarias/:idVeterinaria', eliminarVeterinaria);
superadminRoutes.use(
  '/veterinarias/:idVeterinaria',
  requerirVeterinariaPorParametro,
  veterinariaAdminRoutes
);
superadminRoutes.get('/usuarios', listarUsuarios);
superadminRoutes.patch('/usuarios/:id/estado', actualizarEstadoUsuario);
superadminRoutes.get('/reportes', listarReportes);
superadminRoutes.patch('/reportes/:id', resolverReporte);
