const ESTADOS_REGISTRO = ['PENDIENTE', 'APROBADA', 'RECHAZADA'];
const ESTADOS_CUENTA = ['ACTIVA', 'INACTIVA'];
const ESTADOS_REPORTE = ['PENDIENTE', 'REVISADO', 'DESESTIMADO'];
const ESTADOS_RESOLUCION = ['REVISADO', 'DESESTIMADO'];
const MAXIMO_OBSERVACION = 2000;

export function validarFiltroEstadoRegistro(valor) {
  if (valor === undefined || valor === null || valor === '') {
    return { errores: [], estadoRegistro: null };
  }

  if (!ESTADOS_REGISTRO.includes(valor)) {
    return { errores: ['El estado de registro no es válido.'], estadoRegistro: null };
  }

  return { errores: [], estadoRegistro: valor };
}

export function validarFiltroEstadoReporte(valor) {
  if (valor === undefined || valor === null || valor === '') {
    return { errores: [], estado: 'PENDIENTE' };
  }

  if (valor === 'TODAS') {
    return { errores: [], estado: null };
  }

  if (!ESTADOS_REPORTE.includes(valor)) {
    return { errores: ['El estado del reporte no es válido.'], estado: null };
  }

  return { errores: [], estado: valor };
}

export function validarEstadoCuenta(cuerpo) {
  const estadoCuenta = typeof cuerpo?.estadoCuenta === 'string' ? cuerpo.estadoCuenta.trim() : '';

  if (!ESTADOS_CUENTA.includes(estadoCuenta)) {
    return {
      errores: ['El estado de cuenta no es válido.'],
      datos: { estadoCuenta: null },
    };
  }

  return { errores: [], datos: { estadoCuenta } };
}

export function validarResolucionReporte(cuerpo) {
  const errores = [];
  const estado = typeof cuerpo?.estado === 'string' ? cuerpo.estado.trim() : '';
  const observacionVacia = cuerpo?.observacionAdmin === undefined
    || cuerpo?.observacionAdmin === null
    || cuerpo?.observacionAdmin === '';

  if (!ESTADOS_RESOLUCION.includes(estado)) {
    errores.push('El reporte solo puede resolverse como revisado o desestimado.');
  }

  let observacionAdmin = null;

  if (!observacionVacia) {
    if (typeof cuerpo.observacionAdmin !== 'string') {
      errores.push('La observación administrativa no es válida.');
    } else {
      observacionAdmin = cuerpo.observacionAdmin.trim();

      if (observacionAdmin.length > MAXIMO_OBSERVACION) {
        errores.push(`La observación no puede superar ${MAXIMO_OBSERVACION} caracteres.`);
        observacionAdmin = null;
      } else if (observacionAdmin === '') {
        observacionAdmin = null;
      }
    }
  }

  return {
    errores,
    datos: {
      estado: ESTADOS_RESOLUCION.includes(estado) ? estado : null,
      observacionAdmin,
    },
  };
}
