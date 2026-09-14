import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import { validarEntorno, obtenerPuerto, esProduccion } from './config/entorno.js';
import { crearMiddlewareSesion } from './config/sesion.js';
import { estadoRoutes } from './routes/estadoRoutes.js';
import { usuariosRoutes } from './routes/usuariosRoutes.js';
import { sesionesRoutes } from './routes/sesionesRoutes.js';
import { perfilRoutes } from './routes/perfilRoutes.js';
import { especieRoutes } from './routes/especieRoutes.js';
import { mascotaRoutes } from './routes/mascotaRoutes.js';
import { veterinariaRoutes } from './routes/veterinariaRoutes.js';
import { visitaRoutes } from './routes/visitaRoutes.js';
import { valoracionRoutes } from './routes/valoracionRoutes.js';
import { servicioRoutes } from './routes/servicioRoutes.js';
import { especialidadRoutes } from './routes/especialidadRoutes.js';
import { superadminRoutes } from './routes/superadminRoutes.js';
import { requerirAutenticacion } from './middlewares/autenticacionMiddleware.js';
import { requerirRol } from './middlewares/autorizacionMiddleware.js';
import { noEncontradoMiddleware } from './middlewares/noEncontradoMiddleware.js';
import { errorMiddleware } from './middlewares/errorMiddleware.js';

validarEntorno();

const app = express();
const port = obtenerPuerto();

if (esProduccion()) {
  app.set('trust proxy', 1);
}

app.use(express.json());
app.use(crearMiddlewareSesion());
app.use('/api/estado', estadoRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/sesiones', sesionesRoutes);
app.use('/api/perfil', perfilRoutes);
app.use('/api/especies', especieRoutes);
app.use('/api/servicios', servicioRoutes);
app.use('/api/especialidades', especialidadRoutes);
app.use('/api/veterinarias', veterinariaRoutes);
app.use(
  '/api/administracion',
  requerirAutenticacion,
  requerirRol('SUPERADMIN'),
  superadminRoutes
);
app.use('/api/visitas', requerirAutenticacion, requerirRol('PROPIETARIO'), visitaRoutes);
app.use('/api/valoraciones', valoracionRoutes);
app.use('/api/mascotas', requerirAutenticacion, requerirRol('PROPIETARIO'), mascotaRoutes);

if (esProduccion()) {
  const directorioDist = path.join(path.dirname(fileURLToPath(import.meta.url)), '../../frontend/dist');

  app.use(express.static(directorioDist));
  app.use((req, res, next) => {
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      next();
      return;
    }

    if (req.path.startsWith('/api')) {
      next();
      return;
    }

    res.sendFile(path.join(directorioDist, 'index.html'), (error) => {
      if (error) {
        next(error);
      }
    });
  });
}

app.use(noEncontradoMiddleware);
app.use(errorMiddleware);

app.listen(port, () => {
  console.log(`API VetFinder en puerto ${port}`);
});
