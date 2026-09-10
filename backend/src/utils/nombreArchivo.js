export function sanitizarNombreArchivoMascota(nombre) {
  const base = String(nombre || '')
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);

  return base ? `ficha-mascota-${base}.pdf` : 'ficha-mascota.pdf';
}
