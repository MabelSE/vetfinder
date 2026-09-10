import { Router } from 'express';
import {
  actualizarFotografiaActual,
  actualizarMascotaActual,
  crearMascotaDelPropietario,
  eliminarFotografiaActual,
  eliminarMascotaActual,
  exportarPdfMascotaActual,
  listarMascotasDelPropietario,
  obtenerMascotaActual,
} from '../controllers/mascotaController.js';
import { cargarFotografiaMascota } from '../middlewares/cargaArchivoMiddleware.js';
import { requerirMascotaPropia } from '../middlewares/mascotaMiddleware.js';
import { vacunaRoutes } from './vacunaRoutes.js';
import { enfermedadRoutes } from './enfermedadRoutes.js';
import { alergiaRoutes } from './alergiaRoutes.js';

export const mascotaRoutes = Router();

mascotaRoutes.get('/', listarMascotasDelPropietario);
mascotaRoutes.post('/', crearMascotaDelPropietario);
mascotaRoutes.get('/:id', requerirMascotaPropia, obtenerMascotaActual);
mascotaRoutes.put('/:id', requerirMascotaPropia, actualizarMascotaActual);
mascotaRoutes.put(
  '/:id/fotografia',
  requerirMascotaPropia,
  cargarFotografiaMascota,
  actualizarFotografiaActual
);
mascotaRoutes.delete('/:id/fotografia', requerirMascotaPropia, eliminarFotografiaActual);
mascotaRoutes.post('/:id/pdf', requerirMascotaPropia, exportarPdfMascotaActual);
mascotaRoutes.delete('/:id', requerirMascotaPropia, eliminarMascotaActual);
mascotaRoutes.use('/:id/vacunas', requerirMascotaPropia, vacunaRoutes);
mascotaRoutes.use('/:id/enfermedades', requerirMascotaPropia, enfermedadRoutes);
mascotaRoutes.use('/:id/alergias', requerirMascotaPropia, alergiaRoutes);
