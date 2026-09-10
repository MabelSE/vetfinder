const CORREO_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const LONGITUD_MAXIMA_NOMBRE = 100;
const LONGITUD_MAXIMA_CORREO = 150;
const LONGITUD_MAXIMA_TELEFONO = 20;
const LONGITUD_MINIMA_CONTRASENA = 8;
const LONGITUD_MAXIMA_CONTRASENA = 72;

function textoObligatorio(valor, campo, maximo) {
  if (typeof valor !== 'string' || valor.trim() === '') {
    return `El campo ${campo} es obligatorio.`;
  }

  if (valor.trim().length > maximo) {
    return `El campo ${campo} no puede superar ${maximo} caracteres.`;
  }

  return null;
}

export function normalizarCorreo(correo) {
  return typeof correo === 'string' ? correo.trim().toLowerCase() : '';
}

export function normalizarTelefono(telefono) {
  if (telefono === undefined || telefono === null || telefono === '') {
    return null;
  }

  return String(telefono).trim();
}

export function validarRegistro(cuerpo) {
  const errores = [];
  const errorNombre = textoObligatorio(cuerpo?.nombre, 'nombre', LONGITUD_MAXIMA_NOMBRE);
  const errorApellido = textoObligatorio(cuerpo?.apellido, 'apellido', LONGITUD_MAXIMA_NOMBRE);
  const correo = normalizarCorreo(cuerpo?.correo);
  const telefono = normalizarTelefono(cuerpo?.telefono);

  if (errorNombre) {
    errores.push(errorNombre);
  }

  if (errorApellido) {
    errores.push(errorApellido);
  }

  if (!correo) {
    errores.push('El campo correo es obligatorio.');
  } else if (!CORREO_REGEX.test(correo) || correo.length > LONGITUD_MAXIMA_CORREO) {
    errores.push('Ingrese un correo válido.');
  }

  if (typeof cuerpo?.contrasena !== 'string' || cuerpo.contrasena.length < LONGITUD_MINIMA_CONTRASENA) {
    errores.push(`La contraseña debe tener al menos ${LONGITUD_MINIMA_CONTRASENA} caracteres.`);
  } else if (cuerpo.contrasena.length > LONGITUD_MAXIMA_CONTRASENA) {
    errores.push('La contraseña es demasiado larga.');
  }

  if (telefono && telefono.length > LONGITUD_MAXIMA_TELEFONO) {
    errores.push('El teléfono no puede superar 20 caracteres.');
  }

  return {
    errores,
    datos: {
      nombre: typeof cuerpo?.nombre === 'string' ? cuerpo.nombre.trim() : '',
      apellido: typeof cuerpo?.apellido === 'string' ? cuerpo.apellido.trim() : '',
      correo,
      contrasena: cuerpo?.contrasena,
      telefono,
    },
  };
}

export function validarInicioSesion(cuerpo) {
  const errores = [];
  const correo = normalizarCorreo(cuerpo?.correo);

  if (!correo) {
    errores.push('El campo correo es obligatorio.');
  }

  if (typeof cuerpo?.contrasena !== 'string' || cuerpo.contrasena === '') {
    errores.push('El campo contraseña es obligatorio.');
  }

  return {
    errores,
    datos: {
      correo,
      contrasena: cuerpo?.contrasena,
    },
  };
}
