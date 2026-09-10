import fs from 'node:fs';
import path from 'node:path';
import session from 'express-session';
import sessionFileStore from 'session-file-store';
import { esProduccion, obtenerSecretoSesion } from './entorno.js';

const crearFileStore = sessionFileStore.default ?? sessionFileStore;
const FileStore = crearFileStore(session);
const RUTA_SESIONES = path.join(process.cwd(), 'sesiones');

export function crearMiddlewareSesion() {
  fs.mkdirSync(RUTA_SESIONES, { recursive: true });

  return session({
    name: 'vetfinder.sid',
    secret: obtenerSecretoSesion(),
    resave: false,
    saveUninitialized: false,
    rolling: true,
    store: new FileStore({
      path: RUTA_SESIONES,
      ttl: 60 * 60 * 24,
      retries: 0,
      logFn: () => {},
    }),
    cookie: {
      httpOnly: true,
      sameSite: 'lax',
      secure: esProduccion(),
      maxAge: 1000 * 60 * 60 * 24,
    },
  });
}

export function establecerSesion(req, usuario) {
  return new Promise((resolve, reject) => {
    req.session.regenerate((errorRegenerar) => {
      if (errorRegenerar) {
        reject(errorRegenerar);
        return;
      }

      req.session.idUsuario = usuario.idUsuario;
      req.session.rol = usuario.rol;

      req.session.save((errorGuardar) => {
        if (errorGuardar) {
          reject(errorGuardar);
          return;
        }

        resolve();
      });
    });
  });
}

export function destruirSesion(req, res) {
  return new Promise((resolve, reject) => {
    req.session.destroy((error) => {
      if (error) {
        reject(error);
        return;
      }

      res.clearCookie('vetfinder.sid');
      resolve();
    });
  });
}
