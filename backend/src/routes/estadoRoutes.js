import { Router } from 'express';
import { obtenerEstado } from '../controllers/estadoController.js';

export const estadoRoutes = Router();

estadoRoutes.get('/', obtenerEstado);
