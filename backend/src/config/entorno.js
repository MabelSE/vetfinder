export function validarEntorno() {
  const faltantes = [];

  if (!process.env.SESSION_SECRET) {
    faltantes.push('SESSION_SECRET');
  }

  const urlBaseDatos = process.env.DATABASE_URL?.trim();

  if (!urlBaseDatos) {
    ['DB_HOST', 'DB_PORT', 'DB_NAME', 'DB_USER'].forEach((nombre) => {
      if (!process.env[nombre]) {
        faltantes.push(nombre);
      }
    });

    if (process.env.DB_PASSWORD === undefined) {
      faltantes.push('DB_PASSWORD');
    }
  }

  if (faltantes.length > 0) {
    throw new Error(`Faltan variables de entorno: ${faltantes.join(', ')}`);
  }
}

export function obtenerPuerto() {
  return Number(process.env.PORT) || 3001;
}

export function obtenerSecretoSesion() {
  return process.env.SESSION_SECRET;
}

export function esProduccion() {
  return process.env.NODE_ENV === 'production';
}
