import {
  obtenerCarpetaCloudinary,
  obtenerClienteCloudinary,
  obtenerCredencialesCloudinary,
} from '../config/cloudinary.js';
import { crearError } from '../utils/errorHttp.js';
import {
  esUrlDeNuestroCloudinary,
  extraerPublicIdCloudinary,
  obtenerPublicIdComprobanteVacuna,
  obtenerPublicIdFotografiaVeterinaria,
  obtenerPublicIdMascota,
  validarContenidoFotografia,
} from '../utils/fotografia.js';

function obtenerPublicId(idMascota) {
  return obtenerPublicIdMascota(obtenerCarpetaCloudinary(), idMascota);
}

export function validarArchivoFotografia(archivo) {
  if (!validarContenidoFotografia(archivo.buffer, archivo.mimetype)) {
    throw crearError(400, 'El archivo seleccionado no es una imagen válida.');
  }
}

export async function subirFotografiaMascota(idMascota, buffer) {
  const cliente = obtenerClienteCloudinary();
  const publicId = obtenerPublicId(idMascota);

  return new Promise((resolver, rechazar) => {
    const stream = cliente.uploader.upload_stream(
      {
        public_id: publicId,
        unique_filename: false,
        overwrite: true,
        invalidate: true,
        resource_type: 'image',
        allowed_formats: ['jpg', 'png', 'webp'],
      },
      (error, resultado) => {
        if (error || !resultado?.secure_url) {
          rechazar(crearError(502, 'No fue posible guardar la fotografía.'));
          return;
        }

        if (resultado.public_id !== publicId) {
          rechazar(crearError(502, 'No fue posible guardar la fotografía.'));
          return;
        }

        resolver(resultado.secure_url);
      }
    );

    stream.end(buffer);
  });
}

export async function destruirFotografiaMascota(idMascota, urlFotografia) {
  const credenciales = obtenerCredencialesCloudinary();

  if (!credenciales) {
    return;
  }

  if (urlFotografia && !esUrlDeNuestroCloudinary(urlFotografia, credenciales.cloudName)) {
    return;
  }

  const cliente = obtenerClienteCloudinary();
  const resultado = await cliente.uploader.destroy(obtenerPublicId(idMascota));

  if (resultado.result !== 'ok' && resultado.result !== 'not found') {
    throw crearError(502, 'No fue posible eliminar la fotografía.');
  }
}

function subirImagenCloudinary(publicId, buffer) {
  const cliente = obtenerClienteCloudinary();

  return new Promise((resolver, rechazar) => {
    const stream = cliente.uploader.upload_stream(
      {
        public_id: publicId,
        unique_filename: false,
        overwrite: true,
        invalidate: true,
        resource_type: 'image',
        allowed_formats: ['jpg', 'png', 'webp'],
      },
      (error, resultado) => {
        if (error || !resultado?.secure_url) {
          rechazar(crearError(502, 'No fue posible guardar la fotografía.'));
          return;
        }

        if (resultado.public_id !== publicId) {
          rechazar(crearError(502, 'No fue posible guardar la fotografía.'));
          return;
        }

        resolver(resultado.secure_url);
      }
    );

    stream.end(buffer);
  });
}

export async function subirFotografiaVeterinaria(idVeterinaria, idFotografiaVeterinaria, buffer) {
  const publicId = obtenerPublicIdFotografiaVeterinaria(idVeterinaria, idFotografiaVeterinaria);
  return subirImagenCloudinary(publicId, buffer);
}

export async function subirComprobanteVacuna(idMascota, idVacuna, buffer) {
  const publicId = obtenerPublicIdComprobanteVacuna(idMascota, idVacuna);
  return subirImagenCloudinary(publicId, buffer);
}

export async function destruirComprobanteVacuna(urlFotografia, idMascota, idVacuna) {
  const credenciales = obtenerCredencialesCloudinary();

  if (!urlFotografia || !credenciales || !esUrlDeNuestroCloudinary(urlFotografia, credenciales.cloudName)) {
    return;
  }

  const publicId = extraerPublicIdCloudinary(urlFotografia)
    || obtenerPublicIdComprobanteVacuna(idMascota, idVacuna);
  const cliente = obtenerClienteCloudinary();
  const resultado = await cliente.uploader.destroy(publicId);

  if (resultado.result !== 'ok' && resultado.result !== 'not found') {
    throw crearError(502, 'No fue posible eliminar la fotografía.');
  }
}

export async function destruirFotografiaVeterinaria(urlFotografia, idVeterinaria, idFotografiaVeterinaria) {
  const credenciales = obtenerCredencialesCloudinary();

  if (!urlFotografia || !credenciales || !esUrlDeNuestroCloudinary(urlFotografia, credenciales.cloudName)) {
    return;
  }

  const publicId = extraerPublicIdCloudinary(urlFotografia)
    || obtenerPublicIdFotografiaVeterinaria(idVeterinaria, idFotografiaVeterinaria);
  const cliente = obtenerClienteCloudinary();
  const resultado = await cliente.uploader.destroy(publicId);

  if (resultado.result !== 'ok' && resultado.result !== 'not found') {
    throw crearError(502, 'No fue posible eliminar la fotografía.');
  }
}
