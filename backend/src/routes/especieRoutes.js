import { Router } from 'express';
import { listarEspecies } from '../controllers/especieController.js';

export const especieRoutes = Router();

especieRoutes.get('/', listarEspecies);
