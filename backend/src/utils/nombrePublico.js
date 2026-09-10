export function nombrePublico(nombre, apellido) {
  const nombreVisible = String(nombre || '').trim();
  const inicial = String(apellido || '').trim().charAt(0);

  if (!nombreVisible) {
    return 'Propietario';
  }

  if (!inicial) {
    return nombreVisible;
  }

  return `${nombreVisible} ${inicial.toUpperCase()}.`;
}