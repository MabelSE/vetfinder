import { pool } from '../config/baseDatos.js';

function mapearAlergia(fila) {
  if (!fila) {
    return null;
  }

  return {
    idAlergia: fila.id_alergia,
    idMascota: fila.id_mascota,
    nombreDescripcion: fila.nombre_descripcion,
    observacion: fila.observacion,
  };
}

export async function listarAlergiasPorMascota(idMascota) {
  const resultado = await pool.query(
    `SELECT id_alergia, id_mascota, nombre_descripcion, observacion
     FROM alergia
     WHERE id_mascota = $1
     ORDER BY id_alergia DESC`,
    [idMascota]
  );

  return resultado.rows.map(mapearAlergia);
}

export async function obtenerAlergiaPorId(idAlergia) {
  const resultado = await pool.query(
    `SELECT id_alergia, id_mascota, nombre_descripcion, observacion
     FROM alergia
     WHERE id_alergia = $1`,
    [idAlergia]
  );

  return mapearAlergia(resultado.rows[0]);
}

export async function crearAlergia(idMascota, datos) {
  const resultado = await pool.query(
    `INSERT INTO alergia (id_mascota, nombre_descripcion, observacion)
     VALUES ($1, $2, $3)
     RETURNING id_alergia`,
    [idMascota, datos.nombreDescripcion, datos.observacion]
  );

  return obtenerAlergiaPorId(resultado.rows[0].id_alergia);
}

export async function actualizarAlergia(idAlergia, datos) {
  await pool.query(
    `UPDATE alergia
     SET nombre_descripcion = $1,
         observacion = $2
     WHERE id_alergia = $3`,
    [datos.nombreDescripcion, datos.observacion, idAlergia]
  );

  return obtenerAlergiaPorId(idAlergia);
}

export async function eliminarAlergia(idAlergia) {
  await pool.query('DELETE FROM alergia WHERE id_alergia = $1', [idAlergia]);
}
