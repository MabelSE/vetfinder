export function enlacesFuncionalesPorRol(rol) {
  if (rol === 'PROPIETARIO') {
    return [
      { to: '/veterinarias', etiqueta: 'Veterinarias' },
      { to: '/mascotas', etiqueta: 'Mis mascotas' },
      { to: '/visitas', etiqueta: 'Visitas' },
    ];
  }

  if (rol === 'ADMIN_VETERINARIA') {
    return [
      { to: '/veterinarias', etiqueta: 'Veterinarias' },
      { to: '/mi-veterinaria', etiqueta: 'Mi veterinaria' },
    ];
  }

  if (rol === 'SUPERADMIN') {
    return [
      { to: '/veterinarias', etiqueta: 'Veterinarias' },
      { to: '/superadmin', etiqueta: 'Panel' },
    ];
  }

  return [{ to: '/veterinarias', etiqueta: 'Veterinarias' }];
}
