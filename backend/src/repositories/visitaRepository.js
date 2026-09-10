import { pool } from '../config/baseDatos.js';
import { formatearFecha } from '../utils/fecha.js';

function mapearValoracionDeVisita(fila) {
  if (!fila.id_valoracion) {
    return null;
  }

  return {
    idValoracion: fila.id_valoracion,
    puntuacion: Number(fila.puntuacion),
    comentario: fila.comentario,
    fechaPublicacion: fila.fecha_publicacion,
  };
}

function mapearVisita(fila) {
  return {
    idVisita: fila.id_visita,
    idUsuarioPropietario: fila.id_usuario,
    fechaVisita: formatearFecha(fila.fecha_visita),
    fechaRegistro: fila.fecha_registro,
    mascota: {
      idMascota: fila.id_mascota,
      nombre: fila.nombre_mascota,
      nombreEspecie: fila.nombre_especie,
      fotografia: fila.fotografia_mascota,
    },
    veterinaria: {
      idVeterinaria: fila.id_veterinaria,
      nombreComercial: fila.nombre_comercial,
    },
    valoracion: mapearValoracionDeVisita(fila),
  };
}

const SELECT_VISITA = `
  SELECT vi.id_visita, vi.fecha_visita::text AS fecha_visita, vi.fecha_registro,
         m.id_usuario, vi.id_mascota, m.nombre AS nombre_mascota,
         m.fotografia AS fotografia_mascota, e.nombre AS nombre_especie,
         vi.id_veterinaria, v.nombre_comercial,
         va.id_valoracion, va.puntuacion, va.comentario, va.fecha_publicacion
  FROM visita vi
  JOIN mascota m ON m.id_mascota = vi.id_mascota
  JOIN especie e ON e.id_especie = m.id_especie
  JOIN veterinaria v ON v.id_veterinaria = vi.id_veterinaria
  LEFT JOIN valoracion va ON va.id_visita = vi.id_visita
`;

export async function listarVisitasPorPropietario(idUsuario) {
  const resultado = await pool.query(
    `${SELECT_VISITA}
     WHERE m.id_usuario = $1
     ORDER BY vi.fecha_visita DESC, vi.id_visita DESC`,
    [idUsuario]
  );

  return resultado.rows.map((fila) => {
    const visita = mapearVisita(fila);
    delete visita.idUsuarioPropietario;
    return visita;
  });
}

export async function obtenerVisitaPorId(idVisita) {
  const resultado = await pool.query(
    `${SELECT_VISITA}
     WHERE vi.id_visita = $1`,
    [idVisita]
  );

  return resultado.rows[0] ? mapearVisita(resultado.rows[0]) : null;
}

export async function contarVisitasPorVeterinaria(idVeterinaria) {
  const resultado = await pool.query(
    `SELECT COUNT(*)::int AS total
     FROM visita
     WHERE id_veterinaria = $1`,
    [idVeterinaria]
  );

  return resultado.rows[0].total;
}

export async function crearVisita(datos) {
  const resultado = await pool.query(
    `INSERT INTO visita (id_mascota, id_veterinaria, fecha_visita)
     VALUES ($1, $2, $3)
     RETURNING id_visita`,
    [datos.idMascota, datos.idVeterinaria, datos.fechaVisita]
  );

  return obtenerVisitaPorId(resultado.rows[0].id_visita);
}
