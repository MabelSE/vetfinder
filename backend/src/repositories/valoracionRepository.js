import { pool } from '../config/baseDatos.js';
import { formatearFecha } from '../utils/fecha.js';
import { nombrePublico } from '../utils/nombrePublico.js';

function mapearValoracionPublica(fila) {
  return {
    idValoracion: fila.id_valoracion,
    puntuacion: Number(fila.puntuacion),
    comentario: fila.comentario,
    fechaPublicacion: formatearFecha(fila.fecha_publicacion),
    autor: nombrePublico(fila.nombre_propietario, fila.apellido_propietario),
    mascota: {
      nombre: fila.nombre_mascota,
      nombreEspecie: fila.nombre_especie,
    },
  };
}

const FROM_VALORACION_PUBLICA = `
  FROM valoracion va
  JOIN visita vi ON vi.id_visita = va.id_visita
  JOIN mascota m ON m.id_mascota = vi.id_mascota
  JOIN especie e ON e.id_especie = m.id_especie
  JOIN usuario u ON u.id_usuario = m.id_usuario
`;

export async function obtenerResumenValoraciones(idVeterinaria) {
  const resultado = await pool.query(
    `SELECT COUNT(*)::int AS cantidad,
            ROUND(AVG(va.puntuacion), 1) AS promedio
     FROM valoracion va
     JOIN visita vi ON vi.id_visita = va.id_visita
     WHERE vi.id_veterinaria = $1`,
    [idVeterinaria]
  );

  const fila = resultado.rows[0];
  const cantidad = fila.cantidad;

  return {
    cantidad,
    promedio: cantidad === 0 ? null : Number(fila.promedio),
  };
}

export async function listarValoracionesPublicasPorVeterinaria(idVeterinaria) {
  const resultado = await pool.query(
    `SELECT va.id_valoracion, va.puntuacion, va.comentario,
            va.fecha_publicacion::date::text AS fecha_publicacion,
            m.nombre AS nombre_mascota, e.nombre AS nombre_especie,
            u.nombre AS nombre_propietario, u.apellido AS apellido_propietario
     ${FROM_VALORACION_PUBLICA}
     WHERE vi.id_veterinaria = $1
     ORDER BY va.fecha_publicacion DESC, va.id_valoracion DESC`,
    [idVeterinaria]
  );

  return resultado.rows.map(mapearValoracionPublica);
}

export async function listarValoracionesPorVeterinariaAdmin(idVeterinaria) {
  const resultado = await pool.query(
    `SELECT va.id_valoracion, va.puntuacion, va.comentario,
            va.fecha_publicacion::date::text AS fecha_publicacion,
            m.nombre AS nombre_mascota, e.nombre AS nombre_especie,
            u.nombre AS nombre_propietario, u.apellido AS apellido_propietario,
            EXISTS (
              SELECT 1
              FROM reporte_valoracion r
              WHERE r.id_valoracion = va.id_valoracion
                AND r.estado = 'PENDIENTE'
            ) AS tiene_reporte_pendiente
     ${FROM_VALORACION_PUBLICA}
     WHERE vi.id_veterinaria = $1
     ORDER BY va.fecha_publicacion DESC, va.id_valoracion DESC`,
    [idVeterinaria]
  );

  return resultado.rows.map((fila) => ({
    ...mapearValoracionPublica(fila),
    tieneReportePendiente: Boolean(fila.tiene_reporte_pendiente),
  }));
}

export async function obtenerValoracionConVeterinaria(idValoracion) {
  const resultado = await pool.query(
    `SELECT va.id_valoracion, va.id_visita, va.puntuacion, va.comentario, va.fecha_publicacion,
            vi.id_veterinaria, v.id_usuario AS id_usuario_admin
     FROM valoracion va
     JOIN visita vi ON vi.id_visita = va.id_visita
     JOIN veterinaria v ON v.id_veterinaria = vi.id_veterinaria
     WHERE va.id_valoracion = $1`,
    [idValoracion]
  );

  const fila = resultado.rows[0];

  if (!fila) {
    return null;
  }

  return {
    idValoracion: fila.id_valoracion,
    idVisita: fila.id_visita,
    idVeterinaria: fila.id_veterinaria,
    idUsuarioAdmin: fila.id_usuario_admin,
    puntuacion: Number(fila.puntuacion),
    comentario: fila.comentario,
    fechaPublicacion: formatearFecha(fila.fecha_publicacion),
  };
}

export async function obtenerValoracionPorVisita(idVisita) {
  const resultado = await pool.query(
    `SELECT id_valoracion
     FROM valoracion
     WHERE id_visita = $1`,
    [idVisita]
  );

  return resultado.rows[0] ? resultado.rows[0].id_valoracion : null;
}

export async function crearValoracion(datos) {
  const resultado = await pool.query(
    `INSERT INTO valoracion (id_visita, puntuacion, comentario)
     VALUES ($1, $2, $3)
     RETURNING id_valoracion, id_visita, puntuacion, comentario, fecha_publicacion`,
    [datos.idVisita, datos.puntuacion, datos.comentario]
  );

  const fila = resultado.rows[0];

  return {
    idValoracion: fila.id_valoracion,
    idVisita: fila.id_visita,
    puntuacion: Number(fila.puntuacion),
    comentario: fila.comentario,
    fechaPublicacion: formatearFecha(fila.fecha_publicacion),
  };
}

function mapearReporteAdministracion(fila) {
  return {
    idReporte: fila.id_reporte,
    motivo: fila.motivo,
    fechaReporte: fila.fecha_reporte,
    estado: fila.estado,
    observacionAdmin: fila.observacion_admin,
    valoracion: {
      idValoracion: fila.id_valoracion,
      puntuacion: Number(fila.puntuacion),
      comentario: fila.comentario,
      fechaPublicacion: formatearFecha(fila.fecha_publicacion),
      autor: nombrePublico(fila.nombre_propietario, fila.apellido_propietario),
      mascota: {
        nombre: fila.nombre_mascota,
        nombreEspecie: fila.nombre_especie,
      },
    },
    veterinaria: {
      idVeterinaria: fila.id_veterinaria,
      nombreComercial: fila.nombre_comercial,
    },
    reportadoPor: {
      idUsuario: fila.id_admin,
      nombre: fila.nombre_admin,
      apellido: fila.apellido_admin,
      correo: fila.correo_admin,
    },
  };
}

const FROM_REPORTE_ADMIN = `
  FROM reporte_valoracion r
  JOIN valoracion va ON va.id_valoracion = r.id_valoracion
  JOIN visita vi ON vi.id_visita = va.id_visita
  JOIN veterinaria v ON v.id_veterinaria = vi.id_veterinaria
  JOIN mascota m ON m.id_mascota = vi.id_mascota
  JOIN especie e ON e.id_especie = m.id_especie
  JOIN usuario up ON up.id_usuario = m.id_usuario
  JOIN usuario ua ON ua.id_usuario = r.id_usuario
`;

export async function listarReportesAdministracion(estado) {
  const valores = [];
  let filtro = '';

  if (estado) {
    valores.push(estado);
    filtro = `WHERE r.estado = $1`;
  }

  const resultado = await pool.query(
    `SELECT r.id_reporte, r.motivo, r.fecha_reporte, r.estado, r.observacion_admin,
            va.id_valoracion, va.puntuacion, va.comentario,
            va.fecha_publicacion::date::text AS fecha_publicacion,
            m.nombre AS nombre_mascota, e.nombre AS nombre_especie,
            up.nombre AS nombre_propietario, up.apellido AS apellido_propietario,
            v.id_veterinaria, v.nombre_comercial,
            ua.id_usuario AS id_admin, ua.nombre AS nombre_admin,
            ua.apellido AS apellido_admin, ua.correo AS correo_admin
     ${FROM_REPORTE_ADMIN}
     ${filtro}
     ORDER BY CASE r.estado WHEN 'PENDIENTE' THEN 0 ELSE 1 END,
              r.fecha_reporte DESC, r.id_reporte DESC`,
    valores
  );

  return resultado.rows.map(mapearReporteAdministracion);
}

export async function obtenerReportePorId(idReporte) {
  const resultado = await pool.query(
    `SELECT r.id_reporte, r.motivo, r.fecha_reporte, r.estado, r.observacion_admin,
            va.id_valoracion, va.puntuacion, va.comentario,
            va.fecha_publicacion::date::text AS fecha_publicacion,
            m.nombre AS nombre_mascota, e.nombre AS nombre_especie,
            up.nombre AS nombre_propietario, up.apellido AS apellido_propietario,
            v.id_veterinaria, v.nombre_comercial,
            ua.id_usuario AS id_admin, ua.nombre AS nombre_admin,
            ua.apellido AS apellido_admin, ua.correo AS correo_admin
     ${FROM_REPORTE_ADMIN}
     WHERE r.id_reporte = $1`,
    [idReporte]
  );

  return resultado.rows[0] ? mapearReporteAdministracion(resultado.rows[0]) : null;
}

export async function resolverReporteValoracion(idReporte, datos) {
  const resultado = await pool.query(
    `UPDATE reporte_valoracion
     SET estado = $2, observacion_admin = $3
     WHERE id_reporte = $1 AND estado = 'PENDIENTE'
     RETURNING id_reporte`,
    [idReporte, datos.estado, datos.observacionAdmin]
  );

  return Boolean(resultado.rows[0]);
}

export async function crearReporteValoracion(datos) {
  const resultado = await pool.query(
    `INSERT INTO reporte_valoracion (id_valoracion, id_usuario, motivo)
     VALUES ($1, $2, $3)
     RETURNING id_reporte, id_valoracion, estado, fecha_reporte`,
    [datos.idValoracion, datos.idUsuario, datos.motivo]
  );

  const fila = resultado.rows[0];

  return {
    idReporte: fila.id_reporte,
    idValoracion: fila.id_valoracion,
    estado: fila.estado,
    fechaReporte: fila.fecha_reporte,
  };
}
