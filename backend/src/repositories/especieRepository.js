import { pool } from '../config/baseDatos.js';

export async function listarEspecies() {
  const resultado = await pool.query(
    `SELECT id_especie, nombre
     FROM especie
     ORDER BY nombre`
  );

  return resultado.rows.map((fila) => ({
    idEspecie: fila.id_especie,
    nombre: fila.nombre,
  }));
}

export async function existeEspecie(idEspecie) {
  const resultado = await pool.query(
    `SELECT 1 FROM especie WHERE id_especie = $1`,
    [idEspecie]
  );

  return resultado.rows.length > 0;
}

export async function existenEspecies(ids) {
  if (ids.length === 0) {
    return true;
  }

  const resultado = await pool.query(
    `SELECT COUNT(*)::int AS cantidad
     FROM especie
     WHERE id_especie = ANY($1)`,
    [ids]
  );

  return resultado.rows[0].cantidad === ids.length;
}
