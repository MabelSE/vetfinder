import { Router } from 'express';
import { crearVisitaDelPropietario, listarVisitasDelPropietario } from '../controllers/visitaController.js';

export const visitaRoutes = Router();

visitaRoutes.get('/', listarVisitasDelPropietario);
visitaRoutes.post('/', crearVisitaDelPropietario);
