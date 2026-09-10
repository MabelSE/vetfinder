export function textoNombreCorto(usuario) {
  const nombre = String(usuario?.nombre || '').trim();
  const apellido = String(usuario?.apellido || '').trim();
  const primerApellido = apellido.split(/\s+/).filter(Boolean)[0] || '';
  const inicial = primerApellido.charAt(0).toUpperCase();

  if (!nombre) {
    return inicial ? `${inicial}.` : 'Cuenta';
  }

  return inicial ? `${nombre} ${inicial}.` : nombre;
}