import { pool } from '../config/baseDatos.js';

export async function listarEspecialidades() {
  const resultado = await pool.query(
    `SELECT id_especialidad, nombre
     FROM especialidad
     ORDER BY nombre`
  );

  return resultado.rows.map((fila) => ({
    idEspecialidad: fila.id_especialidad,
    nombre: fila.nombre,
  }));
}

export async function existenEspecialidades(ids) {
  if (ids.length === 0) {
    return true;
  }

  const resultado = await pool.query(
    `SELECT COUNT(*)::int AS cantidad
     FROM especialidad
     WHERE id_especialidad = ANY($1)`,
    [ids]
  );

  return resultado.rows[0].cantidad === ids.length;
}
