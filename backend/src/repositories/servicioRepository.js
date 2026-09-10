import { pool } from '../config/baseDatos.js';

export async function listarServicios() {
  const resultado = await pool.query(
    `SELECT id_servicio, nombre
     FROM servicio
     ORDER BY nombre`
  );

  return resultado.rows.map((fila) => ({
    idServicio: fila.id_servicio,
    nombre: fila.nombre,
  }));
}

export async function existenServicios(ids) {
  if (ids.length === 0) {
    return true;
  }

  const resultado = await pool.query(
    `SELECT COUNT(*)::int AS cantidad
     FROM servicio
     WHERE id_servicio = ANY($1)`,
    [ids]
  );

  return resultado.rows[0].cantidad === ids.length;
}
