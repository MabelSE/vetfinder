import { Router } from 'express';
import {
  actualizarComprobanteDeVacuna,
  actualizarVacunaDeMascota,
  crearVacunaDeMascota,
  eliminarComprobanteDeVacuna,
  eliminarVacunaDeMascota,
  listarVacunasDeMascota,
} from '../controllers/vacunaController.js';
import { cargarFotografia } from '../middlewares/cargaArchivoMiddleware.js';

export const vacunaRoutes = Router({ mergeParams: true });

vacunaRoutes.get('/', listarVacunasDeMascota);
vacunaRoutes.post('/', crearVacunaDeMascota);
vacunaRoutes.put('/:idVacuna/comprobante', cargarFotografia, actualizarComprobanteDeVacuna);
vacunaRoutes.delete('/:idVacuna/comprobante', eliminarComprobanteDeVacuna);
vacunaRoutes.put('/:idVacuna', actualizarVacunaDeMascota);
vacunaRoutes.delete('/:idVacuna', eliminarVacunaDeMascota);
