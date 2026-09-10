const VARIABLES_OBLIGATORIAS = ['DB_HOST', 'DB_PORT', 'DB_NAME', 'DB_USER', 'SESSION_SECRET'];

export function validarEntorno() {
  const faltantes = VARIABLES_OBLIGATORIAS.filter((nombre) => !process.env[nombre]);

  if (process.env.DB_PASSWORD === undefined) {
    faltantes.push('DB_PASSWORD');
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
