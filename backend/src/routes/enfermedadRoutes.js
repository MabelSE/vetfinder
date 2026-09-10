import { Router } from 'express';
import {
  actualizarEnfermedadDeMascota,
  crearEnfermedadDeMascota,
  eliminarEnfermedadDeMascota,
  listarEnfermedadesDeMascota,
} from '../controllers/enfermedadController.js';

export const enfermedadRoutes = Router({ mergeParams: true });

enfermedadRoutes.get('/', listarEnfermedadesDeMascota);
enfermedadRoutes.post('/', crearEnfermedadDeMascota);
enfermedadRoutes.put('/:idEnfermedad', actualizarEnfermedadDeMascota);
enfermedadRoutes.delete('/:idEnfermedad', eliminarEnfermedadDeMascota);
