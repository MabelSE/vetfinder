import { Router } from 'express';
import { listarServicios } from '../controllers/servicioController.js';

export const servicioRoutes = Router();

servicioRoutes.get('/', listarServicios);
