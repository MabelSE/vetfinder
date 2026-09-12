const FECHA_REGEX = /^\d{4}-\d{2}-\d{2}$/;
const SEXOS_PERMITIDOS = ['MACHO', 'HEMBRA'];

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

  return { valor: texto };
}

function fechaOpcional(valor, campo) {
  if (valor === undefined || valor === null || valor === '') {
    return { valor: null };
  }

  if (typeof valor !== 'string' || !FECHA_REGEX.test(valor)) {
    return { error: `Ingrese una ${campo} válida.` };
  }

  return { valor };
}

export function validarDatosMascota(cuerpo) {
  const errores = [];
  const nombre = typeof cuerpo?.nombre === 'string' ? cuerpo.nombre.trim() : '';
  const idEspecie = Number(cuerpo?.idEspecie);
  const raza = textoOpcional(cuerpo?.raza, 100, 'raza');
  const antecedentes = textoOpcional(cuerpo?.antecedentesRelevantes, 10000, 'antecedentes relevantes');
  const fechaNacimiento = fechaOpcional(cuerpo?.fechaNacimiento, 'fecha de nacimiento');
  let sexo = null;
  let peso = null;
  const poseeMicrochip = Boolean(cuerpo?.poseeMicrochip);
  let numeroMicrochip = null;

  if (!nombre) {
    errores.push('El nombre es obligatorio.');
  } else if (nombre.length > 100) {
    errores.push('El nombre no puede superar 100 caracteres.');
  }

  if (!Number.isInteger(idEspecie) || idEspecie <= 0) {
    errores.push('Debe seleccionar una especie.');
  }

  if (raza.error) {
    errores.push(raza.error);
  }

  if (cuerpo?.sexo !== undefined && cuerpo?.sexo !== null && cuerpo?.sexo !== '') {
    if (!SEXOS_PERMITIDOS.includes(cuerpo.sexo)) {
      errores.push('El sexo debe ser MACHO, HEMBRA o quedar vacío.');
    } else {
      sexo = cuerpo.sexo;
    }
  }

  if (fechaNacimiento.error) {
    errores.push(fechaNacimiento.error);
  }

  if (cuerpo?.peso !== undefined && cuerpo?.peso !== null && cuerpo?.peso !== '') {
    peso = Number(cuerpo.peso);

    if (!Number.isFinite(peso) || peso <= 0) {
      errores.push('El peso debe ser mayor que 0.');
    }
  }

  if (antecedentes.error) {
    errores.push(antecedentes.error);
  }

  if (poseeMicrochip) {
    const microchip = textoOpcional(cuerpo?.numeroMicrochip, 50, 'número de microchip');

    if (microchip.error) {
      errores.push(microchip.error);
    } else if (!microchip.valor) {
      errores.push('Debe indicar el número de microchip.');
    } else {
      numeroMicrochip = microchip.valor;
    }
  } else if (cuerpo?.numeroMicrochip) {
    errores.push('El número de microchip solo se registra si la mascota posee microchip.');
  }

  return {
    errores,
    datos: {
      idEspecie,
      nombre,
      raza: raza.valor ?? null,
      sexo,
      fechaNacimiento: fechaNacimiento.valor ?? null,
      peso,
      poseeMicrochip,
      numeroMicrochip,
      antecedentesRelevantes: antecedentes.valor ?? null,
    },
  };
}

export function validarDatosVacuna(cuerpo) {
  const errores = [];
  const nombre = typeof cuerpo?.nombre === 'string' ? cuerpo.nombre.trim() : '';
  const fechaAplicacion = fechaOpcional(cuerpo?.fechaAplicacion, 'fecha de aplicación');
  const proximaFecha = fechaOpcional(cuerpo?.proximaFecha, 'próxima fecha');
  const observacion = textoOpcional(cuerpo?.observacion, 10000, 'observación');

  if (!nombre) {
    errores.push('El nombre de la vacuna es obligatorio.');
  } else if (nombre.length > 150) {
    errores.push('El nombre de la vacuna no puede superar 150 caracteres.');
  }

  if (!cuerpo?.fechaAplicacion) {
    errores.push('La fecha de aplicación es obligatoria.');
  } else if (fechaAplicacion.error) {
    errores.push(fechaAplicacion.error);
  }

  if (proximaFecha.error) {
    errores.push(proximaFecha.error);
  } else if (fechaAplicacion.valor && proximaFecha.valor && proximaFecha.valor < fechaAplicacion.valor) {
    errores.push('La próxima fecha no puede ser anterior a la fecha de aplicación.');
  }

  if (observacion.error) {
    errores.push(observacion.error);
  }

  return {
    errores,
    datos: {
      nombre,
      fechaAplicacion: fechaAplicacion.valor ?? null,
      proximaFecha: proximaFecha.valor ?? null,
      observacion: observacion.valor ?? null,
    },
  };
}

export function validarDatosEnfermedad(cuerpo) {
  const errores = [];
  const nombreDescripcion = typeof cuerpo?.nombreDescripcion === 'string'
    ? cuerpo.nombreDescripcion.trim()
    : '';
  const fechaDiagnostico = fechaOpcional(cuerpo?.fechaDiagnostico, 'fecha de diagnóstico');
  const observacion = textoOpcional(cuerpo?.observacion, 10000, 'observación');

  if (!nombreDescripcion) {
    errores.push('La descripción de la enfermedad es obligatoria.');
  } else if (nombreDescripcion.length > 200) {
    errores.push('La descripción no puede superar 200 caracteres.');
  }

  if (fechaDiagnostico.error) {
    errores.push(fechaDiagnostico.error);
  }

  if (observacion.error) {
    errores.push(observacion.error);
  }

  return {
    errores,
    datos: {
      nombreDescripcion,
      fechaDiagnostico: fechaDiagnostico.valor ?? null,
      observacion: observacion.valor ?? null,
    },
  };
}

export function validarDatosAlergia(cuerpo) {
  const errores = [];
  const nombreDescripcion = typeof cuerpo?.nombreDescripcion === 'string'
    ? cuerpo.nombreDescripcion.trim()
    : '';
  const observacion = textoOpcional(cuerpo?.observacion, 10000, 'observación');

  if (!nombreDescripcion) {
    errores.push('La descripción de la alergia es obligatoria.');
  } else if (nombreDescripcion.length > 200) {
    errores.push('La descripción no puede superar 200 caracteres.');
  }

  if (observacion.error) {
    errores.push(observacion.error);
  }

  return {
    errores,
    datos: {
      nombreDescripcion,
      observacion: observacion.valor ?? null,
    },
  };
}
