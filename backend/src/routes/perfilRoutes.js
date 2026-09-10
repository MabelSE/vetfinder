import { Router } from 'express';
import { actualizarPerfilActual, obtenerPerfilActual } from '../controllers/usuarioController.js';
import { requerirAutenticacion } from '../middlewares/autenticacionMiddleware.js';

export const perfilRoutes = Router();

perfilRoutes.get('/', requerirAutenticacion, obtenerPerfilActual);
perfilRoutes.put('/', requerirAutenticacion, actualizarPerfilActual);
