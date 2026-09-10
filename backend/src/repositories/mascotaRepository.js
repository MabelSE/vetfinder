import { pool } from '../config/baseDatos.js';
import { formatearFecha } from '../utils/fecha.js';

function mapearMascota(fila) {
  if (!fila) {
    return null;
  }

  return {
    idMascota: fila.id_mascota,
    idUsuario: fila.id_usuario,
    idEspecie: fila.id_especie,
    nombreEspecie: fila.nombre_especie,
    nombre: fila.nombre,
    raza: fila.raza,
    sexo: fila.sexo,
    fechaNacimiento: formatearFecha(fila.fecha_nacimiento),
    peso: fila.peso === null ? null : Number(fila.peso),
    fotografia: fila.fotografia,
    poseeMicrochip: fila.posee_microchip,
    numeroMicrochip: fila.numero_microchip,
    antecedentesRelevantes: fila.antecedentes_relevantes,
  };
}

const SELECT_MASCOTA = `
  SELECT m.id_mascota, m.id_usuario, m.id_especie, e.nombre AS nombre_especie,
         m.nombre, m.raza, m.sexo, m.fecha_nacimiento::text AS fecha_nacimiento,
         m.peso, m.fotografia, m.posee_microchip, m.numero_microchip, m.antecedentes_relevantes
  FROM mascota m
  JOIN especie e ON e.id_especie = m.id_especie
`;

export async function listarMascotasPorUsuario(idUsuario) {
  const resultado = await pool.query(
    `${SELECT_MASCOTA}
     WHERE m.id_usuario = $1
     ORDER BY m.nombre`,
    [idUsuario]
  );

  return resultado.rows.map(mapearMascota);
}

export async function obtenerMascotaPorId(idMascota) {
  const resultado = await pool.query(
    `${SELECT_MASCOTA}
     WHERE m.id_mascota = $1`,
    [idMascota]
  );

  return mapearMascota(resultado.rows[0]);
}

export async function crearMascota(idUsuario, datos) {
  const resultado = await pool.query(
    `INSERT INTO mascota (
       id_usuario, id_especie, nombre, raza, sexo, fecha_nacimiento, peso,
       fotografia, posee_microchip, numero_microchip, antecedentes_relevantes
     )
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
     RETURNING id_mascota`,
    [
      idUsuario,
      datos.idEspecie,
      datos.nombre,
      datos.raza,
      datos.sexo,
      datos.fechaNacimiento,
      datos.peso,
      null, // La URL se guarda solo después de una subida correcta a Cloudinary.
      datos.poseeMicrochip,
      datos.numeroMicrochip,
      datos.antecedentesRelevantes,
    ]
  );

  return obtenerMascotaPorId(resultado.rows[0].id_mascota);
}

export async function actualizarMascota(idMascota, datos) {
  await pool.query(
    `UPDATE mascota
     SET id_especie = $1,
         nombre = $2,
         raza = $3,
         sexo = $4,
         fecha_nacimiento = $5,
         peso = $6,
         posee_microchip = $7,
         numero_microchip = $8,
         antecedentes_relevantes = $9
     WHERE id_mascota = $10`,
    [
      datos.idEspecie,
      datos.nombre,
      datos.raza,
      datos.sexo,
      datos.fechaNacimiento,
      datos.peso,
      datos.poseeMicrochip,
      datos.numeroMicrochip,
      datos.antecedentesRelevantes,
      idMascota,
    ]
  );

  return obtenerMascotaPorId(idMascota);
}

export async function actualizarFotografiaMascota(idMascota, urlFotografia) {
  await pool.query(
    `UPDATE mascota
     SET fotografia = $1
     WHERE id_mascota = $2`,
    [urlFotografia, idMascota]
  );

  return obtenerMascotaPorId(idMascota);
}

export async function contarVisitasPorMascota(idMascota) {
  const resultado = await pool.query(
    `SELECT COUNT(*)::int AS total
     FROM visita
     WHERE id_mascota = $1`,
    [idMascota]
  );

  return resultado.rows[0].total;
}

export async function eliminarRegistrosAsociadosYMascota(idMascota) {
  const cliente = await pool.connect();

  try {
    await cliente.query('BEGIN');
    await cliente.query('DELETE FROM alergia WHERE id_mascota = $1', [idMascota]);
    await cliente.query('DELETE FROM enfermedad WHERE id_mascota = $1', [idMascota]);
    await cliente.query('DELETE FROM vacuna WHERE id_mascota = $1', [idMascota]);
    await cliente.query('DELETE FROM mascota WHERE id_mascota = $1', [idMascota]);
    await cliente.query('COMMIT');
  } catch (error) {
    await cliente.query('ROLLBACK');
    throw error;
  } finally {
    cliente.release();
  }
}
