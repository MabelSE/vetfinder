import { Router } from 'express';
import { listarEspecialidades } from '../controllers/especialidadController.js';

export const especialidadRoutes = Router();

especialidadRoutes.get('/', listarEspecialidades);
