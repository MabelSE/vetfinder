import { Router } from 'express';
import { cerrarSesion, iniciarSesion } from '../controllers/autenticacionController.js';

export const sesionesRoutes = Router();

sesionesRoutes.post('/', iniciarSesion);
sesionesRoutes.delete('/', cerrarSesion);
