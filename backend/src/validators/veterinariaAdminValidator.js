import { parsearId } from '../utils/identificador.js';
import { DIAS_SEMANA, horaAMinutos } from '../utils/horario.js';

const CORREO_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const HORA_REGEX = /^\d{2}:\d{2}$/;
const DISPONIBILIDADES = ['DISPONIBLE', 'ALTA_DEMANDA', 'SIN_URGENCIAS'];

function textoObligatorio(valor, campo, maximo) {
  if (typeof valor !== 'string' || valor.trim() === '') {
    return { error: `El campo ${campo} es obligatorio.` };
  }

  const texto = valor.trim();

  if (texto.length > maximo) {
    return { error: `El campo ${campo} no puede superar ${maximo} caracteres.` };
  }

  return { valor: texto };
}

function textoOpcional(valor, campo, maximo) {
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

function booleanoObligatorio(valor, campo) {
  if (typeof valor !== 'boolean') {
    return { error: `El campo ${campo} no es válido.` };
  }

  return { valor };
}

function idsUnicos(lista, nombreCampo) {
  if (!Array.isArray(lista)) {
    return { error: `Debe indicar los identificadores de ${nombreCampo}.` };
  }

  const ids = [];

  for (const valor of lista) {
    const parseado = parsearId(valor, nombreCampo);

    if (parseado.error) {
      return { error: parseado.error };
    }

    if (!ids.includes(parseado.id)) {
      ids.push(parseado.id);
    }
  }

  return { ids };
}

export function validarDatosGenerales(cuerpo) {
  const errores = [];
  const nombreComercial = textoObligatorio(cuerpo?.nombreComercial, 'nombre comercial', 150);
  const descripcion = textoOpcional(cuerpo?.descripcion, 'descripción', 5000);
  const telefono = textoObligatorio(cuerpo?.telefono, 'teléfono', 20);
  const correo = typeof cuerpo?.correo === 'string' ? cuerpo.correo.trim().toLowerCase() : '';
  const sitioWeb = textoOpcional(cuerpo?.sitioWeb, 'sitio web', 300);
  const instagram = textoOpcional(cuerpo?.instagram, 'Instagram', 300);
  const facebook = textoOpcional(cuerpo?.facebook, 'Facebook', 300);

  if (nombreComercial.error) {
    errores.push(nombreComercial.error);
  }

  if (descripcion.error) {
    errores.push(descripcion.error);
  }

  if (telefono.error) {
    errores.push(telefono.error);
  }

  if (!correo) {
    errores.push('El campo correo es obligatorio.');
  } else if (!CORREO_REGEX.test(correo) || correo.length > 150) {
    errores.push('Ingrese un correo válido.');
  }

  if (sitioWeb.error) {
    errores.push(sitioWeb.error);
  }

  if (instagram.error) {
    errores.push(instagram.error);
  }

  if (facebook.error) {
    errores.push(facebook.error);
  }

  return {
    errores,
    datos: {
      nombreComercial: nombreComercial.valor,
      descripcion: descripcion.valor,
      telefono: telefono.valor,
      correo,
      sitioWeb: sitioWeb.valor,
      instagram: instagram.valor,
      facebook: facebook.valor,
    },
  };
}

export function validarDatosDireccion(cuerpo) {
  const errores = [];
  const calle = textoObligatorio(cuerpo?.calle, 'calle', 150);
  const numero = textoObligatorio(cuerpo?.numero, 'número', 20);
  const comuna = textoObligatorio(cuerpo?.comuna, 'comuna', 100);
  const region = textoObligatorio(cuerpo?.region, 'región', 100);
  const latitudVacia = cuerpo?.latitud === undefined || cuerpo?.latitud === null || cuerpo?.latitud === '';
  const longitudVacia = cuerpo?.longitud === undefined || cuerpo?.longitud === null || cuerpo?.longitud === '';
  let latitud = null;
  let longitud = null;

  if (calle.error) {
    errores.push(calle.error);
  }

  if (numero.error) {
    errores.push(numero.error);
  }

  if (comuna.error) {
    errores.push(comuna.error);
  }

  if (region.error) {
    errores.push(region.error);
  }

  if (latitudVacia !== longitudVacia) {
    errores.push('Debe indicar latitud y longitud juntas.');
  } else if (!latitudVacia) {
    latitud = Number(cuerpo.latitud);
    longitud = Number(cuerpo.longitud);

    if (!Number.isFinite(latitud) || latitud < -90 || latitud > 90) {
      errores.push('La latitud no es válida.');
    }

    if (!Number.isFinite(longitud) || longitud < -180 || longitud > 180) {
      errores.push('La longitud no es válida.');
    }
  }

  return {
    errores,
    datos: {
      calle: calle.valor,
      numero: numero.valor,
      comuna: comuna.valor,
      region: region.valor,
      latitud,
      longitud,
    },
  };
}

export function validarDisponibilidad(cuerpo) {
  const disponibilidad = typeof cuerpo?.disponibilidad === 'string' ? cuerpo.disponibilidad.trim() : '';

  if (!DISPONIBILIDADES.includes(disponibilidad)) {
    return {
      errores: ['La disponibilidad no es válida.'],
      datos: { disponibilidad: null },
    };
  }

  return { errores: [], datos: { disponibilidad } };
}

export function validarAtencion(cuerpo) {
  const errores = [];
  const atencion24Horas = booleanoObligatorio(cuerpo?.atencion24Horas, 'atención 24 horas');
  const atiendeUrgencias = booleanoObligatorio(cuerpo?.atiendeUrgencias, 'atención de urgencias');

  if (atencion24Horas.error) {
    errores.push(atencion24Horas.error);
  }

  if (atiendeUrgencias.error) {
    errores.push(atiendeUrgencias.error);
  }

  return {
    errores,
    datos: {
      atencion24Horas: atencion24Horas.valor,
      atiendeUrgencias: atiendeUrgencias.valor,
    },
  };
}

function validarBloqueHorario(bloque, indice) {
  const prefijo = `El horario ${indice + 1}`;
  const diaSemana = typeof bloque?.diaSemana === 'string' ? bloque.diaSemana.trim() : '';
  const cerrado = bloque?.cerrado === true;

  if (!DIAS_SEMANA.includes(diaSemana)) {
    return { error: `${prefijo} no tiene un día válido.` };
  }

  if (cerrado) {
    if (bloque?.horaApertura || bloque?.horaCierre) {
      return { error: `${prefijo} está cerrado y no debe incluir horas.` };
    }

    return {
      datos: {
        diaSemana,
        cerrado: true,
        horaApertura: null,
        horaCierre: null,
      },
    };
  }

  const horaApertura = typeof bloque?.horaApertura === 'string' ? bloque.horaApertura.trim() : '';
  const horaCierre = typeof bloque?.horaCierre === 'string' ? bloque.horaCierre.trim() : '';

  if (!HORA_REGEX.test(horaApertura) || !HORA_REGEX.test(horaCierre)) {
    return { error: `${prefijo} debe incluir hora de apertura y cierre.` };
  }

  const minutosApertura = horaAMinutos(horaApertura);
  const minutosCierre = horaAMinutos(horaCierre);

  if (minutosApertura === null || minutosCierre === null || minutosCierre <= minutosApertura) {
    return { error: `${prefijo} debe tener hora de cierre posterior a la de apertura.` };
  }

  return {
    datos: {
      diaSemana,
      cerrado: false,
      horaApertura,
      horaCierre,
    },
  };
}

export function validarHorarios(cuerpo) {
  const errores = [];

  if (!Array.isArray(cuerpo?.horarios) || cuerpo.horarios.length === 0) {
    return {
      errores: ['Debe registrar al menos un horario.'],
      datos: { horarios: [] },
    };
  }

  const horarios = [];

  for (let indice = 0; indice < cuerpo.horarios.length; indice += 1) {
    const resultado = validarBloqueHorario(cuerpo.horarios[indice], indice);

    if (resultado.error) {
      errores.push(resultado.error);
      continue;
    }

    horarios.push(resultado.datos);
  }

  if (errores.length > 0) {
    return { errores, datos: { horarios } };
  }

  const porDia = new Map();

  for (const bloque of horarios) {
    const lista = porDia.get(bloque.diaSemana) || [];
    lista.push(bloque);
    porDia.set(bloque.diaSemana, lista);
  }

  for (const [dia, bloques] of porDia.entries()) {
    const cerrados = bloques.filter((bloque) => bloque.cerrado);
    const abiertos = bloques.filter((bloque) => !bloque.cerrado);

    if (cerrados.length > 0 && abiertos.length > 0) {
      errores.push(`El ${dia.toLowerCase()} no puede estar cerrado y abierto a la vez.`);
      continue;
    }

    if (cerrados.length > 1) {
      errores.push(`El ${dia.toLowerCase()} solo puede tener un bloque cerrado.`);
      continue;
    }

    const ordenados = abiertos
      .slice()
      .sort((a, b) => horaAMinutos(a.horaApertura) - horaAMinutos(b.horaApertura));

    for (let indice = 1; indice < ordenados.length; indice += 1) {
      const anterior = ordenados[indice - 1];
      const actual = ordenados[indice];

      if (horaAMinutos(actual.horaApertura) < horaAMinutos(anterior.horaCierre)) {
        errores.push(`Los bloques de ${dia.toLowerCase()} se superponen.`);
        break;
      }
    }
  }

  return { errores, datos: { horarios } };
}

export function validarIdsCatalogo(cuerpo, clave, nombreCampo) {
  const resultado = idsUnicos(cuerpo?.[clave], nombreCampo);
  return {
    errores: resultado.error ? [resultado.error] : [],
    datos: { ids: resultado.ids || [] },
  };
}

export function validarServicioPersonalizado(cuerpo) {
  const errores = [];
  const nombre = textoObligatorio(cuerpo?.nombre, 'nombre', 150);
  const descripcion = textoOpcional(cuerpo?.descripcion, 'descripción', 2000);

  if (nombre.error) {
    errores.push(nombre.error);
  }

  if (descripcion.error) {
    errores.push(descripcion.error);
  }

  return {
    errores,
    datos: {
      nombre: nombre.valor,
      descripcion: descripcion.valor,
    },
  };
}

export function validarOrdenFotografias(cuerpo) {
  const resultado = idsUnicos(cuerpo?.idsFotografia, 'fotografía');

  if (resultado.error) {
    return { errores: [resultado.error], datos: { idsFotografia: [] } };
  }

  if (resultado.ids.length === 0) {
    return { errores: ['Debe indicar el orden de las fotografías.'], datos: { idsFotografia: [] } };
  }

  return { errores: [], datos: { idsFotografia: resultado.ids } };
}
