import { pool } from '../config/baseDatos.js';
import { formatearHora } from '../utils/horario.js';

function mapearDireccion(fila) {
  if (!fila?.id_direccion) {
    return null;
  }

  return {
    calle: fila.calle,
    numero: fila.numero,
    comuna: fila.comuna,
    region: fila.region,
    latitud: fila.latitud === null ? null : Number(fila.latitud),
    longitud: fila.longitud === null ? null : Number(fila.longitud),
  };
}

function mapearVeterinariaListado(fila) {
  return {
    idVeterinaria: fila.id_veterinaria,
    nombreComercial: fila.nombre_comercial,
    descripcion: fila.descripcion,
    telefono: fila.telefono,
    atiendeUrgencias: fila.atiende_urgencias,
    atencion24Horas: fila.atencion_24_horas,
    disponibilidad: fila.disponibilidad,
    direccion: mapearDireccion(fila),
    fotografiaPrincipal: fila.url_fotografia || null,
  };
}

export function mapearVeterinariaFicha(fila) {
  return {
    ...mapearVeterinariaListado(fila),
    correo: fila.correo,
    sitioWeb: fila.sitio_web,
    instagram: fila.instagram,
    facebook: fila.facebook,
  };
}

export function mapearHorario(fila) {
  return {
    diaSemana: fila.dia_semana,
    horaApertura: formatearHora(fila.hora_apertura),
    horaCierre: formatearHora(fila.hora_cierre),
    cerrado: fila.cerrado,
  };
}

const SELECT_LISTADO = `
  SELECT v.id_veterinaria, v.nombre_comercial, v.descripcion, v.telefono,
         v.atiende_urgencias, v.atencion_24_horas, v.disponibilidad,
         d.id_direccion, d.calle, d.numero, d.comuna, d.region, d.latitud, d.longitud,
         (
           SELECT fv.url_imagen
           FROM fotografia_veterinaria fv
           WHERE fv.id_veterinaria = v.id_veterinaria
           ORDER BY fv.orden_visualizacion
           LIMIT 1
         ) AS url_fotografia
  FROM veterinaria v
  LEFT JOIN direccion d ON d.id_veterinaria = v.id_veterinaria
`;

export async function listarVeterinariasAprobadas(filtros) {
  const condiciones = [`v.estado_registro = 'APROBADA'`];
  const valores = [];

  if (filtros.nombre) {
    valores.push(`%${filtros.nombre}%`);
    condiciones.push(`v.nombre_comercial ILIKE $${valores.length}`);
  }

  if (filtros.atencion24Horas) {
    condiciones.push('v.atencion_24_horas = TRUE');
  }

  if (filtros.atiendeUrgencias) {
    condiciones.push('v.atiende_urgencias = TRUE');
  }

  if (filtros.idServicio) {
    valores.push(filtros.idServicio);
    condiciones.push(`EXISTS (
      SELECT 1 FROM veterinaria_servicio vs
      WHERE vs.id_veterinaria = v.id_veterinaria AND vs.id_servicio = $${valores.length}
    )`);
  }

  if (filtros.idEspecialidad) {
    valores.push(filtros.idEspecialidad);
    condiciones.push(`EXISTS (
      SELECT 1 FROM veterinaria_especialidad ve
      WHERE ve.id_veterinaria = v.id_veterinaria AND ve.id_especialidad = $${valores.length}
    )`);
  }

  if (filtros.idEspecie) {
    valores.push(filtros.idEspecie);
    condiciones.push(`EXISTS (
      SELECT 1 FROM veterinaria_especie ves
      WHERE ves.id_veterinaria = v.id_veterinaria AND ves.id_especie = $${valores.length}
    )`);
  }

  const resultado = await pool.query(
    `${SELECT_LISTADO}
     WHERE ${condiciones.join(' AND ')}
     ORDER BY v.nombre_comercial`,
    valores
  );

  return resultado.rows.map(mapearVeterinariaListado);
}

export async function obtenerVeterinariaPublicaPorId(idVeterinaria) {
  const resultado = await pool.query(
    `SELECT v.id_veterinaria, v.nombre_comercial, v.descripcion, v.telefono, v.correo,
            v.sitio_web, v.instagram, v.facebook, v.atiende_urgencias, v.atencion_24_horas,
            v.disponibilidad, d.id_direccion, d.calle, d.numero, d.comuna, d.region,
            d.latitud, d.longitud,
            (
              SELECT fv.url_imagen
              FROM fotografia_veterinaria fv
              WHERE fv.id_veterinaria = v.id_veterinaria
              ORDER BY fv.orden_visualizacion
              LIMIT 1
            ) AS url_fotografia
     FROM veterinaria v
     LEFT JOIN direccion d ON d.id_veterinaria = v.id_veterinaria
     WHERE v.id_veterinaria = $1 AND v.estado_registro = 'APROBADA'`,
    [idVeterinaria]
  );

  return resultado.rows[0] ? mapearVeterinariaFicha(resultado.rows[0]) : null;
}

export async function listarHorariosPorVeterinarias(idsVeterinaria) {
  if (idsVeterinaria.length === 0) {
    return [];
  }

  const resultado = await pool.query(
    `SELECT id_veterinaria, dia_semana, hora_apertura, hora_cierre, cerrado
     FROM horario
     WHERE id_veterinaria = ANY($1)
     ORDER BY id_veterinaria,
              CASE dia_semana
                WHEN 'LUNES' THEN 1 WHEN 'MARTES' THEN 2 WHEN 'MIERCOLES' THEN 3
                WHEN 'JUEVES' THEN 4 WHEN 'VIERNES' THEN 5 WHEN 'SABADO' THEN 6
                ELSE 7
              END,
              hora_apertura NULLS LAST`,
    [idsVeterinaria]
  );

  return resultado.rows.map((fila) => ({
    idVeterinaria: fila.id_veterinaria,
    ...mapearHorario(fila),
  }));
}

export async function listarFotografias(idVeterinaria) {
  const resultado = await pool.query(
    `SELECT id_fotografia_veterinaria, url_imagen, orden_visualizacion
     FROM fotografia_veterinaria
     WHERE id_veterinaria = $1
     ORDER BY orden_visualizacion`,
    [idVeterinaria]
  );

  return resultado.rows.map((fila) => ({
    idFotografiaVeterinaria: fila.id_fotografia_veterinaria,
    urlImagen: fila.url_imagen,
    ordenVisualizacion: fila.orden_visualizacion,
  }));
}

export async function listarServiciosDeVeterinaria(idVeterinaria) {
  const resultado = await pool.query(
    `SELECT s.id_servicio, s.nombre
     FROM veterinaria_servicio vs
     JOIN servicio s ON s.id_servicio = vs.id_servicio
     WHERE vs.id_veterinaria = $1
     ORDER BY s.nombre`,
    [idVeterinaria]
  );

  return resultado.rows.map((fila) => ({
    idServicio: fila.id_servicio,
    nombre: fila.nombre,
  }));
}

export async function listarServiciosPersonalizados(idVeterinaria) {
  const resultado = await pool.query(
    `SELECT id_servicio_personalizado, nombre, descripcion
     FROM servicio_personalizado
     WHERE id_veterinaria = $1
     ORDER BY nombre`,
    [idVeterinaria]
  );

  return resultado.rows.map((fila) => ({
    idServicioPersonalizado: fila.id_servicio_personalizado,
    nombre: fila.nombre,
    descripcion: fila.descripcion,
  }));
}

export async function listarEspecialidadesDeVeterinaria(idVeterinaria) {
  const resultado = await pool.query(
    `SELECT e.id_especialidad, e.nombre
     FROM veterinaria_especialidad ve
     JOIN especialidad e ON e.id_especialidad = ve.id_especialidad
     WHERE ve.id_veterinaria = $1
     ORDER BY e.nombre`,
    [idVeterinaria]
  );

  return resultado.rows.map((fila) => ({
    idEspecialidad: fila.id_especialidad,
    nombre: fila.nombre,
  }));
}

export async function listarEspeciesDeVeterinaria(idVeterinaria) {
  const resultado = await pool.query(
    `SELECT es.id_especie, es.nombre
     FROM veterinaria_especie ve
     JOIN especie es ON es.id_especie = ve.id_especie
     WHERE ve.id_veterinaria = $1
     ORDER BY es.nombre`,
    [idVeterinaria]
  );

  return resultado.rows.map((fila) => ({
    idEspecie: fila.id_especie,
    nombre: fila.nombre,
  }));
}

export async function listarServiciosDeVeterinarias(idsVeterinaria) {
  if (idsVeterinaria.length === 0) {
    return [];
  }

  const resultado = await pool.query(
    `SELECT vs.id_veterinaria, s.id_servicio, s.nombre
     FROM veterinaria_servicio vs
     JOIN servicio s ON s.id_servicio = vs.id_servicio
     WHERE vs.id_veterinaria = ANY($1)
     ORDER BY s.nombre`,
    [idsVeterinaria]
  );

  return resultado.rows.map((fila) => ({
    idVeterinaria: fila.id_veterinaria,
    idServicio: fila.id_servicio,
    nombre: fila.nombre,
  }));
}

export async function listarEspeciesDeVeterinarias(idsVeterinaria) {
  if (idsVeterinaria.length === 0) {
    return [];
  }

  const resultado = await pool.query(
    `SELECT ve.id_veterinaria, es.id_especie, es.nombre
     FROM veterinaria_especie ve
     JOIN especie es ON es.id_especie = ve.id_especie
     WHERE ve.id_veterinaria = ANY($1)
     ORDER BY es.nombre`,
    [idsVeterinaria]
  );

  return resultado.rows.map((fila) => ({
    idVeterinaria: fila.id_veterinaria,
    idEspecie: fila.id_especie,
    nombre: fila.nombre,
  }));
}

export async function obtenerVeterinariaPorAdministrador(idUsuario) {
  const resultado = await pool.query(
    `SELECT id_veterinaria, nombre_comercial, estado_registro
     FROM veterinaria
     WHERE id_usuario = $1`,
    [idUsuario]
  );

  if (!resultado.rows[0]) {
    return null;
  }

  return {
    idVeterinaria: resultado.rows[0].id_veterinaria,
    nombreComercial: resultado.rows[0].nombre_comercial,
    estadoRegistro: resultado.rows[0].estado_registro,
  };
}

export async function obtenerVeterinariaAdminPorId(idVeterinaria) {
  const resultado = await pool.query(
    `SELECT v.id_veterinaria, v.nombre_comercial, v.descripcion, v.telefono, v.correo,
            v.sitio_web, v.instagram, v.facebook, v.atiende_urgencias, v.atencion_24_horas,
            v.disponibilidad, v.estado_registro,
            d.id_direccion, d.calle, d.numero, d.comuna, d.region, d.latitud, d.longitud
     FROM veterinaria v
     LEFT JOIN direccion d ON d.id_veterinaria = v.id_veterinaria
     WHERE v.id_veterinaria = $1`,
    [idVeterinaria]
  );

  const fila = resultado.rows[0];

  if (!fila) {
    return null;
  }

  return {
    ...mapearVeterinariaFicha(fila),
    estadoRegistro: fila.estado_registro,
  };
}

export async function crearVeterinariaPendiente(cliente, {
  idUsuario,
  nombreComercial,
  descripcion,
  telefono,
  correo,
}) {
  const resultado = await cliente.query(
    `INSERT INTO veterinaria (id_usuario, nombre_comercial, descripcion, telefono, correo, estado_registro)
     VALUES ($1, $2, $3, $4, $5, 'PENDIENTE')
     RETURNING id_veterinaria`,
    [idUsuario, nombreComercial, descripcion, telefono, correo]
  );

  return { idVeterinaria: resultado.rows[0].id_veterinaria };
}

export async function crearDireccionInicial(cliente, idVeterinaria, {
  calle,
  numero,
  comuna,
  region,
}) {
  await cliente.query(
    `INSERT INTO direccion (id_veterinaria, calle, numero, comuna, region)
     VALUES ($1, $2, $3, $4, $5)`,
    [idVeterinaria, calle, numero, comuna, region]
  );
}

export async function actualizarDatosGenerales(idVeterinaria, datos) {
  const resultado = await pool.query(
    `UPDATE veterinaria
     SET nombre_comercial = $2,
         descripcion = $3,
         telefono = $4,
         correo = $5,
         sitio_web = $6,
         instagram = $7,
         facebook = $8
     WHERE id_veterinaria = $1
     RETURNING id_veterinaria`,
    [
      idVeterinaria,
      datos.nombreComercial,
      datos.descripcion,
      datos.telefono,
      datos.correo,
      datos.sitioWeb,
      datos.instagram,
      datos.facebook,
    ]
  );

  return resultado.rows[0] ? obtenerVeterinariaAdminPorId(idVeterinaria) : null;
}

export async function obtenerDireccionPorVeterinaria(idVeterinaria) {
  const resultado = await pool.query(
    `SELECT id_direccion, calle, numero, comuna, region, latitud, longitud
     FROM direccion
     WHERE id_veterinaria = $1`,
    [idVeterinaria]
  );

  return resultado.rows[0] ? mapearDireccion(resultado.rows[0]) : null;
}

export async function guardarDireccion(idVeterinaria, datos) {
  const existente = await pool.query(
    `SELECT id_direccion FROM direccion WHERE id_veterinaria = $1`,
    [idVeterinaria]
  );

  if (existente.rows[0]) {
    await pool.query(
      `UPDATE direccion
       SET calle = $2, numero = $3, comuna = $4, region = $5, latitud = $6, longitud = $7
       WHERE id_veterinaria = $1`,
      [idVeterinaria, datos.calle, datos.numero, datos.comuna, datos.region, datos.latitud, datos.longitud]
    );
  } else {
    await pool.query(
      `INSERT INTO direccion (id_veterinaria, calle, numero, comuna, region, latitud, longitud)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [idVeterinaria, datos.calle, datos.numero, datos.comuna, datos.region, datos.latitud, datos.longitud]
    );
  }

  return obtenerDireccionPorVeterinaria(idVeterinaria);
}

export async function actualizarDisponibilidad(idVeterinaria, disponibilidad) {
  await pool.query(
    `UPDATE veterinaria SET disponibilidad = $2 WHERE id_veterinaria = $1`,
    [idVeterinaria, disponibilidad]
  );
}

export async function actualizarAtencion(idVeterinaria, datos) {
  await pool.query(
    `UPDATE veterinaria
     SET atencion_24_horas = $2, atiende_urgencias = $3
     WHERE id_veterinaria = $1`,
    [idVeterinaria, datos.atencion24Horas, datos.atiendeUrgencias]
  );
}

export async function reemplazarHorarios(idVeterinaria, horarios) {
  const cliente = await pool.connect();

  try {
    await cliente.query('BEGIN');
    await cliente.query('DELETE FROM horario WHERE id_veterinaria = $1', [idVeterinaria]);

    for (const bloque of horarios) {
      await cliente.query(
        `INSERT INTO horario (id_veterinaria, dia_semana, hora_apertura, hora_cierre, cerrado)
         VALUES ($1, $2, $3, $4, $5)`,
        [
          idVeterinaria,
          bloque.diaSemana,
          bloque.cerrado ? null : bloque.horaApertura,
          bloque.cerrado ? null : bloque.horaCierre,
          bloque.cerrado,
        ]
      );
    }

    await cliente.query('COMMIT');
  } catch (error) {
    await cliente.query('ROLLBACK');
    throw error;
  } finally {
    cliente.release();
  }
}

const TABLAS_CATALOGO = {
  veterinaria_servicio: 'id_servicio',
  veterinaria_especialidad: 'id_especialidad',
  veterinaria_especie: 'id_especie',
};

export async function reemplazarRelacionCatalogo(tabla, columnaCatalogo, idVeterinaria, ids) {
  if (TABLAS_CATALOGO[tabla] !== columnaCatalogo) {
    throw new Error('Relación de catálogo no permitida.');
  }

  const cliente = await pool.connect();

  try {
    await cliente.query('BEGIN');
    await cliente.query(`DELETE FROM ${tabla} WHERE id_veterinaria = $1`, [idVeterinaria]);

    for (const idCatalogo of ids) {
      await cliente.query(
        `INSERT INTO ${tabla} (id_veterinaria, ${columnaCatalogo}) VALUES ($1, $2)`,
        [idVeterinaria, idCatalogo]
      );
    }

    await cliente.query('COMMIT');
  } catch (error) {
    await cliente.query('ROLLBACK');
    throw error;
  } finally {
    cliente.release();
  }
}

export async function crearServicioPersonalizado(idVeterinaria, datos) {
  const resultado = await pool.query(
    `INSERT INTO servicio_personalizado (id_veterinaria, nombre, descripcion)
     VALUES ($1, $2, $3)
     RETURNING id_servicio_personalizado, nombre, descripcion`,
    [idVeterinaria, datos.nombre, datos.descripcion]
  );

  const fila = resultado.rows[0];
  return {
    idServicioPersonalizado: fila.id_servicio_personalizado,
    nombre: fila.nombre,
    descripcion: fila.descripcion,
  };
}

export async function obtenerServicioPersonalizado(idVeterinaria, idServicioPersonalizado) {
  const resultado = await pool.query(
    `SELECT id_servicio_personalizado, nombre, descripcion
     FROM servicio_personalizado
     WHERE id_veterinaria = $1 AND id_servicio_personalizado = $2`,
    [idVeterinaria, idServicioPersonalizado]
  );

  if (!resultado.rows[0]) {
    return null;
  }

  const fila = resultado.rows[0];
  return {
    idServicioPersonalizado: fila.id_servicio_personalizado,
    nombre: fila.nombre,
    descripcion: fila.descripcion,
  };
}

export async function actualizarServicioPersonalizado(idVeterinaria, idServicioPersonalizado, datos) {
  const resultado = await pool.query(
    `UPDATE servicio_personalizado
     SET nombre = $3, descripcion = $4
     WHERE id_veterinaria = $1 AND id_servicio_personalizado = $2
     RETURNING id_servicio_personalizado, nombre, descripcion`,
    [idVeterinaria, idServicioPersonalizado, datos.nombre, datos.descripcion]
  );

  if (!resultado.rows[0]) {
    return null;
  }

  const fila = resultado.rows[0];
  return {
    idServicioPersonalizado: fila.id_servicio_personalizado,
    nombre: fila.nombre,
    descripcion: fila.descripcion,
  };
}

export async function eliminarServicioPersonalizado(idVeterinaria, idServicioPersonalizado) {
  const resultado = await pool.query(
    `DELETE FROM servicio_personalizado
     WHERE id_veterinaria = $1 AND id_servicio_personalizado = $2
     RETURNING id_servicio_personalizado`,
    [idVeterinaria, idServicioPersonalizado]
  );

  return Boolean(resultado.rows[0]);
}

export async function obtenerFotografiaDeVeterinaria(idVeterinaria, idFotografiaVeterinaria) {
  const resultado = await pool.query(
    `SELECT id_fotografia_veterinaria, url_imagen, orden_visualizacion
     FROM fotografia_veterinaria
     WHERE id_veterinaria = $1 AND id_fotografia_veterinaria = $2`,
    [idVeterinaria, idFotografiaVeterinaria]
  );

  if (!resultado.rows[0]) {
    return null;
  }

  const fila = resultado.rows[0];
  return {
    idFotografiaVeterinaria: fila.id_fotografia_veterinaria,
    urlImagen: fila.url_imagen,
    ordenVisualizacion: fila.orden_visualizacion,
  };
}

export async function obtenerSiguienteOrdenFotografia(idVeterinaria) {
  const resultado = await pool.query(
    `SELECT COALESCE(MAX(orden_visualizacion), 0) + 1 AS siguiente
     FROM fotografia_veterinaria
     WHERE id_veterinaria = $1`,
    [idVeterinaria]
  );

  return resultado.rows[0].siguiente;
}

export async function crearFotografiaPendiente(idVeterinaria, ordenVisualizacion) {
  const resultado = await pool.query(
    `INSERT INTO fotografia_veterinaria (id_veterinaria, url_imagen, orden_visualizacion)
     VALUES ($1, $2, $3)
     RETURNING id_fotografia_veterinaria, orden_visualizacion`,
    [idVeterinaria, 'pendiente://fotografia', ordenVisualizacion]
  );

  const fila = resultado.rows[0];
  return {
    idFotografiaVeterinaria: fila.id_fotografia_veterinaria,
    ordenVisualizacion: fila.orden_visualizacion,
  };
}

export async function actualizarUrlFotografia(idFotografiaVeterinaria, urlImagen) {
  const resultado = await pool.query(
    `UPDATE fotografia_veterinaria
     SET url_imagen = $2
     WHERE id_fotografia_veterinaria = $1
     RETURNING id_fotografia_veterinaria, url_imagen, orden_visualizacion`,
    [idFotografiaVeterinaria, urlImagen]
  );

  const fila = resultado.rows[0];
  return {
    idFotografiaVeterinaria: fila.id_fotografia_veterinaria,
    urlImagen: fila.url_imagen,
    ordenVisualizacion: fila.orden_visualizacion,
  };
}

export async function eliminarFilaFotografia(idVeterinaria, idFotografiaVeterinaria) {
  const resultado = await pool.query(
    `DELETE FROM fotografia_veterinaria
     WHERE id_veterinaria = $1 AND id_fotografia_veterinaria = $2
     RETURNING id_fotografia_veterinaria`,
    [idVeterinaria, idFotografiaVeterinaria]
  );

  return Boolean(resultado.rows[0]);
}

export async function compactarOrdenFotografias(idVeterinaria) {
  const cliente = await pool.connect();

  try {
    await cliente.query('BEGIN');
    await cliente.query(
      `UPDATE fotografia_veterinaria
       SET orden_visualizacion = orden_visualizacion + 1000
       WHERE id_veterinaria = $1`,
      [idVeterinaria]
    );
    await cliente.query(
      `UPDATE fotografia_veterinaria AS f
       SET orden_visualizacion = sub.nuevo_orden
       FROM (
         SELECT id_fotografia_veterinaria,
                ROW_NUMBER() OVER (ORDER BY orden_visualizacion, id_fotografia_veterinaria) AS nuevo_orden
         FROM fotografia_veterinaria
         WHERE id_veterinaria = $1
       ) AS sub
       WHERE f.id_fotografia_veterinaria = sub.id_fotografia_veterinaria`,
      [idVeterinaria]
    );
    await cliente.query('COMMIT');
  } catch (error) {
    await cliente.query('ROLLBACK');
    throw error;
  } finally {
    cliente.release();
  }
}

export async function reordenarFotografias(idVeterinaria, idsFotografia) {
  const cliente = await pool.connect();

  try {
    await cliente.query('BEGIN');
    await cliente.query(
      `UPDATE fotografia_veterinaria
       SET orden_visualizacion = orden_visualizacion + 1000
       WHERE id_veterinaria = $1`,
      [idVeterinaria]
    );

    for (let indice = 0; indice < idsFotografia.length; indice += 1) {
      await cliente.query(
        `UPDATE fotografia_veterinaria
         SET orden_visualizacion = $3
         WHERE id_veterinaria = $1 AND id_fotografia_veterinaria = $2`,
        [idVeterinaria, idsFotografia[indice], indice + 1]
      );
    }

    await cliente.query('COMMIT');
  } catch (error) {
    await cliente.query('ROLLBACK');
    throw error;
  } finally {
    cliente.release();
  }
}

function mapearVeterinariaAdministracion(fila) {
  return {
    idVeterinaria: fila.id_veterinaria,
    nombreComercial: fila.nombre_comercial,
    telefono: fila.telefono,
    correo: fila.correo,
    disponibilidad: fila.disponibilidad,
    estadoRegistro: fila.estado_registro,
    atiendeUrgencias: fila.atiende_urgencias,
    atencion24Horas: fila.atencion_24_horas,
    fechaRegistro: fila.fecha_registro,
    cantidadHorarios: fila.cantidad_horarios,
    cantidadFotografias: fila.cantidad_fotografias,
    cantidadServicios: fila.cantidad_servicios,
    cantidadEspecialidades: fila.cantidad_especialidades,
    cantidadEspecies: fila.cantidad_especies,
    direccion: fila.comuna
      ? { comuna: fila.comuna, region: fila.region }
      : null,
    administrador: {
      idUsuario: fila.id_usuario,
      nombre: fila.nombre,
      apellido: fila.apellido,
      correo: fila.correo_admin,
      estadoCuenta: fila.estado_cuenta,
    },
  };
}

export async function listarVeterinariasAdministracion(estadoRegistro) {
  const valores = [];
  let filtro = '';

  if (estadoRegistro) {
    valores.push(estadoRegistro);
    filtro = 'WHERE v.estado_registro = $1';
  }

  const resultado = await pool.query(
    `SELECT v.id_veterinaria, v.nombre_comercial, v.telefono, v.correo,
            v.disponibilidad, v.estado_registro, v.atiende_urgencias,
            v.atencion_24_horas, v.fecha_registro,
            u.id_usuario, u.nombre, u.apellido, u.correo AS correo_admin, u.estado_cuenta,
            d.comuna, d.region,
            (
              SELECT COUNT(*)::int FROM horario h WHERE h.id_veterinaria = v.id_veterinaria
            ) AS cantidad_horarios,
            (
              SELECT COUNT(*)::int FROM fotografia_veterinaria f WHERE f.id_veterinaria = v.id_veterinaria
            ) AS cantidad_fotografias,
            (
              SELECT COUNT(*)::int FROM veterinaria_servicio vs WHERE vs.id_veterinaria = v.id_veterinaria
            ) AS cantidad_servicios,
            (
              SELECT COUNT(*)::int FROM veterinaria_especialidad ve WHERE ve.id_veterinaria = v.id_veterinaria
            ) AS cantidad_especialidades,
            (
              SELECT COUNT(*)::int FROM veterinaria_especie ves WHERE ves.id_veterinaria = v.id_veterinaria
            ) AS cantidad_especies
     FROM veterinaria v
     JOIN usuario u ON u.id_usuario = v.id_usuario
     LEFT JOIN direccion d ON d.id_veterinaria = v.id_veterinaria
     ${filtro}
     ORDER BY v.fecha_registro DESC, v.id_veterinaria DESC`,
    valores
  );

  return resultado.rows.map(mapearVeterinariaAdministracion);
}

export async function contarHorariosPorVeterinaria(idVeterinaria) {
  const resultado = await pool.query(
    `SELECT COUNT(*)::int AS total
     FROM horario
     WHERE id_veterinaria = $1`,
    [idVeterinaria]
  );

  return resultado.rows[0].total;
}

export async function actualizarEstadoRegistro(idVeterinaria, estadoRegistro) {
  const resultado = await pool.query(
    `UPDATE veterinaria
     SET estado_registro = $2
     WHERE id_veterinaria = $1
     RETURNING id_veterinaria`,
    [idVeterinaria, estadoRegistro]
  );

  return Boolean(resultado.rows[0]);
}

export async function obtenerResumenAdministracion() {
  const resultado = await pool.query(
    `SELECT
       (SELECT COUNT(*)::int FROM veterinaria WHERE estado_registro = 'PENDIENTE') AS solicitudes_pendientes,
       (SELECT COUNT(*)::int FROM veterinaria WHERE estado_registro = 'APROBADA') AS veterinarias_aprobadas,
       (SELECT COUNT(*)::int FROM veterinaria WHERE estado_registro = 'RECHAZADA') AS veterinarias_rechazadas,
       (SELECT COUNT(*)::int FROM reporte_valoracion WHERE estado = 'PENDIENTE') AS reportes_pendientes,
       (SELECT COUNT(*)::int FROM usuario WHERE estado_cuenta = 'INACTIVA') AS usuarios_inactivos`
  );

  const fila = resultado.rows[0];
  return {
    solicitudesPendientes: fila.solicitudes_pendientes,
    veterinariasAprobadas: fila.veterinarias_aprobadas,
    veterinariasRechazadas: fila.veterinarias_rechazadas,
    reportesPendientes: fila.reportes_pendientes,
    usuariosInactivos: fila.usuarios_inactivos,
  };
}

export async function eliminarVeterinariaYDependencias(idVeterinaria) {
  const cliente = await pool.connect();

  try {
    await cliente.query('BEGIN');

    const veterinaria = await cliente.query(
      `SELECT id_usuario FROM veterinaria WHERE id_veterinaria = $1 FOR UPDATE`,
      [idVeterinaria]
    );

    if (!veterinaria.rows[0]) {
      await cliente.query('ROLLBACK');
      return null;
    }

    const idUsuarioAdmin = veterinaria.rows[0].id_usuario;

    await cliente.query('DELETE FROM veterinaria_servicio WHERE id_veterinaria = $1', [idVeterinaria]);
    await cliente.query('DELETE FROM veterinaria_especialidad WHERE id_veterinaria = $1', [idVeterinaria]);
    await cliente.query('DELETE FROM veterinaria_especie WHERE id_veterinaria = $1', [idVeterinaria]);
    await cliente.query('DELETE FROM servicio_personalizado WHERE id_veterinaria = $1', [idVeterinaria]);
    await cliente.query('DELETE FROM fotografia_veterinaria WHERE id_veterinaria = $1', [idVeterinaria]);
    await cliente.query('DELETE FROM horario WHERE id_veterinaria = $1', [idVeterinaria]);
    await cliente.query('DELETE FROM direccion WHERE id_veterinaria = $1', [idVeterinaria]);
    await cliente.query('DELETE FROM veterinaria WHERE id_veterinaria = $1', [idVeterinaria]);
    await cliente.query(
      `UPDATE usuario
       SET estado_cuenta = 'INACTIVA'
       WHERE id_usuario = $1 AND rol = 'ADMIN_VETERINARIA'`,
      [idUsuarioAdmin]
    );

    await cliente.query('COMMIT');
    return { idUsuarioAdmin };
  } catch (error) {
    await cliente.query('ROLLBACK');
    throw error;
  } finally {
    cliente.release();
  }
}

