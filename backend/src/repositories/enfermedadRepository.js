import { pool } from '../config/baseDatos.js';
import { formatearFecha } from '../utils/fecha.js';

function mapearEnfermedad(fila) {
  if (!fila) {
    return null;
  }

  return {
    idEnfermedad: fila.id_enfermedad,
    idMascota: fila.id_mascota,
    nombreDescripcion: fila.nombre_descripcion,
    fechaDiagnostico: formatearFecha(fila.fecha_diagnostico),
    observacion: fila.observacion,
  };
}

export async function listarEnfermedadesPorMascota(idMascota) {
  const resultado = await pool.query(
    `SELECT id_enfermedad, id_mascota, nombre_descripcion,
            fecha_diagnostico::text AS fecha_diagnostico, observacion
     FROM enfermedad
     WHERE id_mascota = $1
     ORDER BY fecha_diagnostico DESC NULLS LAST, id_enfermedad DESC`,
    [idMascota]
  );

  return resultado.rows.map(mapearEnfermedad);
}

export async function obtenerEnfermedadPorId(idEnfermedad) {
  const resultado = await pool.query(
    `SELECT id_enfermedad, id_mascota, nombre_descripcion,
            fecha_diagnostico::text AS fecha_diagnostico, observacion
     FROM enfermedad
     WHERE id_enfermedad = $1`,
    [idEnfermedad]
  );

  return mapearEnfermedad(resultado.rows[0]);
}

export async function crearEnfermedad(idMascota, datos) {
  const resultado = await pool.query(
    `INSERT INTO enfermedad (id_mascota, nombre_descripcion, fecha_diagnostico, observacion)
     VALUES ($1, $2, $3, $4)
     RETURNING id_enfermedad`,
    [idMascota, datos.nombreDescripcion, datos.fechaDiagnostico, datos.observacion]
  );

  return obtenerEnfermedadPorId(resultado.rows[0].id_enfermedad);
}

export async function actualizarEnfermedad(idEnfermedad, datos) {
  await pool.query(
    `UPDATE enfermedad
     SET nombre_descripcion = $1,
         fecha_diagnostico = $2,
         observacion = $3
     WHERE id_enfermedad = $4`,
    [datos.nombreDescripcion, datos.fechaDiagnostico, datos.observacion, idEnfermedad]
  );

  return obtenerEnfermedadPorId(idEnfermedad);
}

export async function eliminarEnfermedad(idEnfermedad) {
  await pool.query('DELETE FROM enfermedad WHERE id_enfermedad = $1', [idEnfermedad]);
}
