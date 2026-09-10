import { Router } from 'express';
import {
  actualizarVacunaDeMascota,
  crearVacunaDeMascota,
  eliminarVacunaDeMascota,
  listarVacunasDeMascota,
} from '../controllers/vacunaController.js';

export const vacunaRoutes = Router({ mergeParams: true });

vacunaRoutes.get('/', listarVacunasDeMascota);
vacunaRoutes.post('/', crearVacunaDeMascota);
vacunaRoutes.put('/:idVacuna', actualizarVacunaDeMascota);
vacunaRoutes.delete('/:idVacuna', eliminarVacunaDeMascota);
