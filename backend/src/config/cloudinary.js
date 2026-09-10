import { v2 as cloudinary } from 'cloudinary';
import { crearError } from '../utils/errorHttp.js';

function limpiarVariableEntorno(valor) {
  if (valor === undefined || valor === null) {
    return '';
  }

  let texto = String(valor).trim();

  if (texto.endsWith(';')) {
    texto = texto.slice(0, -1).trim();
  }

  if (
    (texto.startsWith("'") && texto.endsWith("'"))
    || (texto.startsWith('"') && texto.endsWith('"'))
  ) {
    texto = texto.slice(1, -1).trim();
  }

  return texto;
}

export function obtenerCarpetaCloudinary() {
  return limpiarVariableEntorno(process.env.CLOUDINARY_CARPETA) || 'vetfinder/mascotas';
}

export function obtenerCredencialesCloudinary() {
  const cloudName = limpiarVariableEntorno(process.env.CLOUDINARY_CLOUD_NAME);
  const apiKey = limpiarVariableEntorno(process.env.CLOUDINARY_API_KEY);
  const apiSecret = limpiarVariableEntorno(process.env.CLOUDINARY_API_SECRET);

  if (!cloudName || !apiKey || !apiSecret) {
    return null;
  }

  return { cloudName, apiKey, apiSecret };
}

export function obtenerClienteCloudinary() {
  const credenciales = obtenerCredencialesCloudinary();

  if (!credenciales) {
    throw crearError(503, 'El almacenamiento de fotografías no está configurado.');
  }

  cloudinary.config({
    cloud_name: credenciales.cloudName,
    api_key: credenciales.apiKey,
    api_secret: credenciales.apiSecret,
  });

  return cloudinary;
}
