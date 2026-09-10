import { Router } from 'express';
import { registrarUsuario } from '../controllers/autenticacionController.js';

export const usuariosRoutes = Router();

usuariosRoutes.post('/', registrarUsuario);
