import { Router } from 'express';
import {
  actualizarAlergiaDeMascota,
  crearAlergiaDeMascota,
  eliminarAlergiaDeMascota,
  listarAlergiasDeMascota,
} from '../controllers/alergiaController.js';

export const alergiaRoutes = Router({ mergeParams: true });

alergiaRoutes.get('/', listarAlergiasDeMascota);
alergiaRoutes.post('/', crearAlergiaDeMascota);
alergiaRoutes.put('/:idAlergia', actualizarAlergiaDeMascota);
alergiaRoutes.delete('/:idAlergia', eliminarAlergiaDeMascota);
