import bcrypt from 'bcrypt';

const RONDAS_SALT = 10;

export async function hashearContrasena(contrasena) {
  return bcrypt.hash(contrasena, RONDAS_SALT);
}

export async function verificarContrasena(contrasena, hash) {
  return bcrypt.compare(contrasena, hash);
}
