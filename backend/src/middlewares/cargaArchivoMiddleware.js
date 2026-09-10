import path from 'node:path';
import multer from 'multer';
import { crearError } from '../utils/errorHttp.js';
import {
  EXTENSIONES_FOTOGRAFIA_PERMITIDAS,
  TAMANO_MAXIMO_FOTOGRAFIA,
  TIPOS_FOTOGRAFIA_PERMITIDOS,
} from '../utils/fotografia.js';

const carga = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: TAMANO_MAXIMO_FOTOGRAFIA,
    files: 1,
  },
  fileFilter(req, archivo, completar) {
    const extension = path.extname(archivo.originalname || '').toLowerCase();

    if (
      !TIPOS_FOTOGRAFIA_PERMITIDOS.includes(archivo.mimetype)
      || !EXTENSIONES_FOTOGRAFIA_PERMITIDAS.includes(extension)
    ) {
      completar(crearError(400, 'La fotografía debe ser JPG, JPEG, PNG o WEBP.'));
      return;
    }

    completar(null, true);
  },
});

export function cargarFotografia(req, res, next) {
  carga.single('fotografia')(req, res, (error) => {
    if (error?.code === 'LIMIT_FILE_SIZE') {
      next(crearError(400, 'La fotografía no puede superar 5 MB.'));
      return;
    }

    if (error) {
      next(error.statusCode ? error : crearError(400, 'No fue posible procesar el archivo.'));
      return;
    }

    if (!req.file) {
      next(crearError(400, 'Debe seleccionar una fotografía.'));
      return;
    }

    next();
  });
}

export const cargarFotografiaMascota = cargarFotografia;
