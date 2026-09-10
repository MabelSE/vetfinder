import { pool } from '../config/baseDatos.js';

export async function verificarConexion() {
  await pool.query('SELECT 1');
}
