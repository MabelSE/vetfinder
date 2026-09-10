export function mapearUsuario(fila) {
  if (!fila) {
    return null;
  }

  return {
    idUsuario: fila.id_usuario,
    nombre: fila.nombre,
    apellido: fila.apellido,
    correo: fila.correo,
    contrasena: fila.contrasena,
    telefono: fila.telefono,
    rol: fila.rol,
    estadoCuenta: fila.estado_cuenta,
    fechaRegistro: fila.fecha_registro,
  };
}

export function omitirContrasena(usuario) {
  if (!usuario) {
    return null;
  }

  const { contrasena, ...usuarioPublico } = usuario;
  return usuarioPublico;
}
