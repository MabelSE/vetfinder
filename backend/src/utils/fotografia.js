export const TAMANO_MAXIMO_FOTOGRAFIA = 5 * 1024 * 1024;

export const TIPOS_FOTOGRAFIA_PERMITIDOS = ['image/jpeg', 'image/png', 'image/webp'];

export const EXTENSIONES_FOTOGRAFIA_PERMITIDAS = ['.jpg', '.jpeg', '.png', '.webp'];

export function obtenerPublicIdMascota(carpeta, idMascota) {
  return `${carpeta}/${idMascota}`;
}

export function obtenerPublicIdFotografiaVeterinaria(idVeterinaria, idFotografiaVeterinaria) {
  return `vetfinder/veterinarias/${idVeterinaria}/${idFotografiaVeterinaria}`;
}

export function obtenerPublicIdComprobanteVacuna(idMascota, idVacuna) {
  return `vetfinder/mascotas/${idMascota}/vacunas/${idVacuna}`;
}

export function extraerPublicIdCloudinary(url) {
  if (!url) {
    return null;
  }

  try {
    const direccion = new URL(url);
    const partes = direccion.pathname.split('/').filter(Boolean);
    const indiceUpload = partes.indexOf('upload');

    if (indiceUpload < 0) {
      return null;
    }

    let resto = partes.slice(indiceUpload + 1);

    if (resto[0] && /^v\d+$/.test(resto[0])) {
      resto = resto.slice(1);
    }

    if (resto.length === 0) {
      return null;
    }

    const ultimo = resto[resto.length - 1].replace(/\.[^.]+$/, '');
    resto[resto.length - 1] = ultimo;
    return resto.join('/');
  } catch {
    return null;
  }
}

export function esUrlDeNuestroCloudinary(url, cloudName) {
  if (!url || !cloudName) {
    return false;
  }

  try {
    const direccion = new URL(url);
    return direccion.hostname === 'res.cloudinary.com' && direccion.pathname.includes(`/${cloudName}/`);
  } catch {
    return false;
  }
}

export function validarContenidoFotografia(buffer, mimetype) {
  if (!buffer || buffer.length < 12) {
    return false;
  }

  if (mimetype === 'image/jpeg') {
    return buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  }

  if (mimetype === 'image/png') {
    return buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47;
  }

  if (mimetype === 'image/webp') {
    return buffer.toString('ascii', 0, 4) === 'RIFF' && buffer.toString('ascii', 8, 12) === 'WEBP';
  }

  return false;
}
