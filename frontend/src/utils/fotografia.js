export const TAMANO_MAXIMO_FOTOGRAFIA = 5 * 1024 * 1024;

const TIPOS_PERMITIDOS = ['image/jpeg', 'image/png', 'image/webp'];
const EXTENSIONES_PERMITIDAS = ['.jpg', '.jpeg', '.png', '.webp'];

const TIPOS_POR_EXTENSION = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
};

export function validarArchivoFotografia(archivo) {
  if (!archivo) {
    return 'Debe seleccionar una fotografía.';
  }

  const nombre = archivo.name || '';
  const punto = nombre.lastIndexOf('.');
  const extension = punto >= 0 ? nombre.slice(punto).toLowerCase() : '';
  const tipo = archivo.type || TIPOS_POR_EXTENSION[extension] || '';

  if (!TIPOS_PERMITIDOS.includes(tipo) || !EXTENSIONES_PERMITIDAS.includes(extension)) {
    return 'La fotografía debe ser JPG, JPEG, PNG o WEBP.';
  }

  if (archivo.size > TAMANO_MAXIMO_FOTOGRAFIA) {
    return 'La fotografía no puede superar 5 MB.';
  }

  return '';
}
