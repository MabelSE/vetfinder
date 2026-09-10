import { parsearId } from '../utils/identificador.js';

function booleanoQuery(valor) {
  return valor === true || valor === 'true' || valor === '1';
}

function textoBusqueda(valor) {
  if (valor === undefined || valor === null) {
    return null;
  }

  const texto = String(valor).trim();
  return texto ? texto.slice(0, 100) : null;
}

function parsearCoordenada(valor, minimo, maximo, campo) {
  if (valor === undefined || valor === null || valor === '') {
    return { valor: null };
  }

  const numero = Number(valor);

  if (!Number.isFinite(numero) || numero < minimo || numero > maximo) {
    return { error: `La ${campo} no es válida.` };
  }

  return { valor: numero };
}

export function validarFiltrosVeterinaria(consulta) {
  const errores = [];
  const nombre = textoBusqueda(consulta?.nombre);
  let idEspecialidad = null;
  let idEspecie = null;
  let idServicio = null;

  if (consulta?.idEspecialidad) {
    const parseado = parsearId(consulta.idEspecialidad, 'especialidad');
    if (parseado.error) {
      errores.push(parseado.error);
    } else {
      idEspecialidad = parseado.id;
    }
  }

  if (consulta?.idEspecie) {
    const parseado = parsearId(consulta.idEspecie, 'especie');
    if (parseado.error) {
      errores.push(parseado.error);
    } else {
      idEspecie = parseado.id;
    }
  }

  if (consulta?.idServicio) {
    const parseado = parsearId(consulta.idServicio, 'servicio');
    if (parseado.error) {
      errores.push(parseado.error);
    } else {
      idServicio = parseado.id;
    }
  }

  const latitud = parsearCoordenada(consulta?.lat, -90, 90, 'latitud');
  const longitud = parsearCoordenada(consulta?.lng, -180, 180, 'longitud');

  if (latitud.error) {
    errores.push(latitud.error);
  }

  if (longitud.error) {
    errores.push(longitud.error);
  }

  if ((latitud.valor === null) !== (longitud.valor === null)) {
    errores.push('Debe indicar latitud y longitud juntas.');
  }

  return {
    errores,
    filtros: {
      nombre,
      abiertasAhora: booleanoQuery(consulta?.abiertasAhora),
      atencion24Horas: booleanoQuery(consulta?.atencion24Horas),
      atiendeUrgencias: booleanoQuery(consulta?.atiendeUrgencias),
      idEspecialidad,
      idEspecie,
      idServicio,
      lat: latitud.valor,
      lng: longitud.valor,
      modoUrgencia: booleanoQuery(consulta?.modoUrgencia),
    },
  };
}
