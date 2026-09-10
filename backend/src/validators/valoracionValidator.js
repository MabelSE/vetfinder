const PUNTUACIONES_PERMITIDAS = [1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5];
const MAXIMO_COMENTARIO = 2000;
const MAXIMO_MOTIVO = 2000;

export function esPuntuacionPermitida(valor) {
  return PUNTUACIONES_PERMITIDAS.includes(Number(valor));
}

function textoOpcional(valor, maximo, campo) {
  if (valor === undefined || valor === null || valor === '') {
    return { valor: null };
  }

  if (typeof valor !== 'string') {
    return { error: `El campo ${campo} no es válido.` };
  }

  const texto = valor.trim();

  if (texto.length > maximo) {
    return { error: `El campo ${campo} no puede superar ${maximo} caracteres.` };
  }

  return { valor: texto || null };
}

export function validarDatosValoracion(cuerpo) {
  const errores = [];
  const idVisita = Number(cuerpo?.idVisita);
  const puntuacion = Number(cuerpo?.puntuacion);
  const comentario = textoOpcional(cuerpo?.comentario, MAXIMO_COMENTARIO, 'comentario');

  if (!Number.isInteger(idVisita) || idVisita <= 0) {
    errores.push('La visita no es válida.');
  }

  if (!esPuntuacionPermitida(puntuacion)) {
    errores.push('La puntuación debe estar entre 1 y 5, en pasos de 0,5.');
  }

  if (comentario.error) {
    errores.push(comentario.error);
  }

  return {
    errores,
    datos: {
      idVisita: Number.isInteger(idVisita) ? idVisita : null,
      puntuacion,
      comentario: comentario.valor,
    },
  };
}

export function validarDatosReporte(cuerpo) {
  const errores = [];
  const motivo = typeof cuerpo?.motivo === 'string' ? cuerpo.motivo.trim() : '';

  if (!motivo) {
    errores.push('Indique el motivo del reporte.');
  } else if (motivo.length > MAXIMO_MOTIVO) {
    errores.push(`El motivo no puede superar ${MAXIMO_MOTIVO} caracteres.`);
  }

  return {
    errores,
    datos: { motivo },
  };
}
