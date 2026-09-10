const CORREO_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const LONGITUD_MAXIMA_NOMBRE = 100;
const LONGITUD_MAXIMA_CORREO = 150;
const LONGITUD_MAXIMA_TELEFONO = 20;

function textoObligatorio(valor, campo, maximo) {
  if (typeof valor !== 'string' || valor.trim() === '') {
    return `El campo ${campo} es obligatorio.`;
  }

  if (valor.trim().length > maximo) {
    return `El campo ${campo} no puede superar ${maximo} caracteres.`;
  }

  return null;
}

export function extraerDatosPersonales(cuerpo) {
  return {
    nombre: cuerpo?.nombre,
    apellido: cuerpo?.apellido,
    correo: cuerpo?.correo,
    telefono: cuerpo?.telefono,
  };
}

export function validarDatosPersonales(cuerpo) {
  const datos = extraerDatosPersonales(cuerpo);
  const errores = [];
  const errorNombre = textoObligatorio(datos.nombre, 'nombre', LONGITUD_MAXIMA_NOMBRE);
  const errorApellido = textoObligatorio(datos.apellido, 'apellido', LONGITUD_MAXIMA_NOMBRE);
  const correo = typeof datos.correo === 'string' ? datos.correo.trim().toLowerCase() : '';
  const telefono = datos.telefono === undefined || datos.telefono === null || datos.telefono === ''
    ? null
    : String(datos.telefono).trim();

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

  if (telefono && telefono.length > LONGITUD_MAXIMA_TELEFONO) {
    errores.push('El teléfono no puede superar 20 caracteres.');
  }

  return {
    errores,
    datos: {
      nombre: typeof datos.nombre === 'string' ? datos.nombre.trim() : '',
      apellido: typeof datos.apellido === 'string' ? datos.apellido.trim() : '',
      correo,
      telefono,
    },
  };
}
