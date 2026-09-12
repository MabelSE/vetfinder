import { pool } from '../config/baseDatos.js';
import { formatearFecha } from '../utils/fecha.js';

function mapearVacuna(fila) {
  if (!fila) {
    return null;
  }

  return {
    idVacuna: fila.id_vacuna,
    idMascota: fila.id_mascota,
    nombre: fila.nombre,
    fechaAplicacion: formatearFecha(fila.fecha_aplicacion),
    proximaFecha: formatearFecha(fila.proxima_fecha),
    fotografiaComprobante: fila.fotografia_comprobante,
    observacion: fila.observacion,
  };
}

export async function listarVacunasPorMascota(idMascota) {
  const resultado = await pool.query(
    `SELECT id_vacuna, id_mascota, nombre, fecha_aplicacion::text AS fecha_aplicacion,
            proxima_fecha::text AS proxima_fecha, fotografia_comprobante, observacion
     FROM vacuna
     WHERE id_mascota = $1
     ORDER BY fecha_aplicacion DESC, id_vacuna DESC`,
    [idMascota]
  );

  return resultado.rows.map(mapearVacuna);
}

export async function obtenerVacunaPorId(idVacuna) {
  const resultado = await pool.query(
    `SELECT id_vacuna, id_mascota, nombre, fecha_aplicacion::text AS fecha_aplicacion,
            proxima_fecha::text AS proxima_fecha, fotografia_comprobante, observacion
     FROM vacuna
     WHERE id_vacuna = $1`,
    [idVacuna]
  );

  return mapearVacuna(resultado.rows[0]);
}

export async function crearVacuna(idMascota, datos) {
  const resultado = await pool.query(
    `INSERT INTO vacuna (
       id_mascota, nombre, fecha_aplicacion, proxima_fecha, fotografia_comprobante, observacion
     )
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING id_vacuna`,
    [
      idMascota,
      datos.nombre,
      datos.fechaAplicacion,
      datos.proximaFecha,
      null,
      datos.observacion,
    ]
  );

  return obtenerVacunaPorId(resultado.rows[0].id_vacuna);
}

export async function actualizarVacuna(idVacuna, datos) {
  await pool.query(
    `UPDATE vacuna
     SET nombre = $1,
         fecha_aplicacion = $2,
         proxima_fecha = $3,
         observacion = $4
     WHERE id_vacuna = $5`,
    [
      datos.nombre,
      datos.fechaAplicacion,
      datos.proximaFecha,
      datos.observacion,
      idVacuna,
    ]
  );

  return obtenerVacunaPorId(idVacuna);
}

export async function actualizarFotografiaComprobante(idVacuna, urlComprobante) {
  await pool.query(
    `UPDATE vacuna
     SET fotografia_comprobante = $2
     WHERE id_vacuna = $1`,
    [idVacuna, urlComprobante]
  );

  return obtenerVacunaPorId(idVacuna);
}

export async function eliminarVacuna(idVacuna) {
  await pool.query('DELETE FROM vacuna WHERE id_vacuna = $1', [idVacuna]);
}
