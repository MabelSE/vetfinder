import { pool } from '../config/baseDatos.js';
import { mapearUsuario } from '../utils/usuarioPublico.js';

export async function obtenerUsuarioPorId(idUsuario) {
  const resultado = await pool.query(
    `SELECT id_usuario, nombre, apellido, correo, contrasena, telefono, rol, estado_cuenta, fecha_registro
     FROM usuario
     WHERE id_usuario = $1`,
    [idUsuario]
  );

  return mapearUsuario(resultado.rows[0]);
}

export async function obtenerUsuarioPorCorreo(correo) {
  const resultado = await pool.query(
    `SELECT id_usuario, nombre, apellido, correo, contrasena, telefono, rol, estado_cuenta, fecha_registro
     FROM usuario
     WHERE correo = $1`,
    [correo]
  );

  return mapearUsuario(resultado.rows[0]);
}

export async function crearUsuarioPropietario({ nombre, apellido, correo, contrasena, telefono }) {
  const resultado = await pool.query(
    `INSERT INTO usuario (nombre, apellido, correo, contrasena, telefono, rol, estado_cuenta)
     VALUES ($1, $2, $3, $4, $5, 'PROPIETARIO', 'ACTIVA')
     RETURNING id_usuario, nombre, apellido, correo, contrasena, telefono, rol, estado_cuenta, fecha_registro`,
    [nombre, apellido, correo, contrasena, telefono]
  );

  return mapearUsuario(resultado.rows[0]);
}

export async function listarUsuariosAdministracion() {
  const resultado = await pool.query(
    `SELECT u.id_usuario, u.nombre, u.apellido, u.correo, u.telefono, u.rol,
            u.estado_cuenta, u.fecha_registro,
            v.id_veterinaria, v.nombre_comercial, v.estado_registro
     FROM usuario u
     LEFT JOIN veterinaria v ON v.id_usuario = u.id_usuario
     ORDER BY u.fecha_registro DESC, u.id_usuario DESC`
  );

  return resultado.rows.map((fila) => ({
    idUsuario: fila.id_usuario,
    nombre: fila.nombre,
    apellido: fila.apellido,
    correo: fila.correo,
    telefono: fila.telefono,
    rol: fila.rol,
    estadoCuenta: fila.estado_cuenta,
    fechaRegistro: fila.fecha_registro,
    veterinaria: fila.id_veterinaria
      ? {
        idVeterinaria: fila.id_veterinaria,
        nombreComercial: fila.nombre_comercial,
        estadoRegistro: fila.estado_registro,
      }
      : null,
  }));
}

export async function contarSuperAdminActivos() {
  const resultado = await pool.query(
    `SELECT COUNT(*)::int AS total
     FROM usuario
     WHERE rol = 'SUPERADMIN' AND estado_cuenta = 'ACTIVA'`
  );

  return resultado.rows[0].total;
}

export async function actualizarEstadoCuenta(idUsuario, estadoCuenta) {
  const resultado = await pool.query(
    `UPDATE usuario
     SET estado_cuenta = $2
     WHERE id_usuario = $1
     RETURNING id_usuario, nombre, apellido, correo, telefono, rol, estado_cuenta, fecha_registro`,
    [idUsuario, estadoCuenta]
  );

  if (!resultado.rows[0]) {
    return null;
  }

  const fila = resultado.rows[0];
  return {
    idUsuario: fila.id_usuario,
    nombre: fila.nombre,
    apellido: fila.apellido,
    correo: fila.correo,
    telefono: fila.telefono,
    rol: fila.rol,
    estadoCuenta: fila.estado_cuenta,
    fechaRegistro: fila.fecha_registro,
  };
}

export async function actualizarDatosPersonales(idUsuario, { nombre, apellido, correo, telefono }) {
  const resultado = await pool.query(
    `UPDATE usuario
     SET nombre = $1,
         apellido = $2,
         correo = $3,
         telefono = $4
     WHERE id_usuario = $5
     RETURNING id_usuario, nombre, apellido, correo, contrasena, telefono, rol, estado_cuenta, fecha_registro`,
    [nombre, apellido, correo, telefono, idUsuario]
  );

  return mapearUsuario(resultado.rows[0]);
}
