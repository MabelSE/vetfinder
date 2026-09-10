import { Router } from 'express';
import { cargarFotografia } from '../middlewares/cargaArchivoMiddleware.js';
import {
  actualizarMiAtencion,
  actualizarMiDireccion,
  actualizarMiDisponibilidad,
  actualizarMiServicioPersonalizado,
  actualizarMiVeterinaria,
  actualizarMisEspecialidades,
  actualizarMisEspecies,
  actualizarMisHorarios,
  actualizarMisServicios,
  crearMiFotografia,
  crearMiServicioPersonalizado,
  eliminarMiFotografia,
  eliminarMiServicioPersonalizado,
  obtenerMiVeterinaria,
  reemplazarMiFotografia,
  reordenarMisFotografias,
} from '../controllers/veterinariaAdminController.js';

export const veterinariaAdminRoutes = Router({ mergeParams: true });

veterinariaAdminRoutes.get('/', obtenerMiVeterinaria);
veterinariaAdminRoutes.put('/', actualizarMiVeterinaria);
veterinariaAdminRoutes.put('/direccion', actualizarMiDireccion);
veterinariaAdminRoutes.put('/horarios', actualizarMisHorarios);
veterinariaAdminRoutes.patch('/disponibilidad', actualizarMiDisponibilidad);
veterinariaAdminRoutes.patch('/atencion', actualizarMiAtencion);
veterinariaAdminRoutes.put('/servicios', actualizarMisServicios);
veterinariaAdminRoutes.put('/especialidades', actualizarMisEspecialidades);
veterinariaAdminRoutes.put('/especies', actualizarMisEspecies);
veterinariaAdminRoutes.post('/servicios-personalizados', crearMiServicioPersonalizado);
veterinariaAdminRoutes.put('/servicios-personalizados/:id', actualizarMiServicioPersonalizado);
veterinariaAdminRoutes.delete('/servicios-personalizados/:id', eliminarMiServicioPersonalizado);
veterinariaAdminRoutes.post('/fotografias', cargarFotografia, crearMiFotografia);
veterinariaAdminRoutes.put('/fotografias/orden', reordenarMisFotografias);
veterinariaAdminRoutes.put('/fotografias/:id', cargarFotografia, reemplazarMiFotografia);
veterinariaAdminRoutes.delete('/fotografias/:id', eliminarMiFotografia);
