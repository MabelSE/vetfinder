const DIAS = {
  LUNES: 'Lunes',
  MARTES: 'Martes',
  MIERCOLES: 'Miércoles',
  JUEVES: 'Jueves',
  VIERNES: 'Viernes',
  SABADO: 'Sábado',
  DOMINGO: 'Domingo',
};

const ORDEN_DIAS = ['LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO', 'DOMINGO'];

export function textoDia(diaSemana) {
  return DIAS[diaSemana] || diaSemana;
}

function textoDiaEnRango(diaSemana) {
  const nombre = textoDia(diaSemana);
  return nombre.charAt(0).toLowerCase() + nombre.slice(1);
}

function claveHorarioDelDia(bloques) {
  const abiertos = bloques.filter((bloque) => !bloque.cerrado);

  if (abiertos.length === 0) {
    return 'CERRADO';
  }

  return abiertos
    .slice()
    .sort((a, b) => String(a.horaApertura).localeCompare(String(b.horaApertura)))
    .map((bloque) => `${bloque.horaApertura}-${bloque.horaCierre}`)
    .join('|');
}

function etiquetaRangoDias(dias) {
  if (dias.length === 1) {
    return textoDia(dias[0]);
  }

  if (dias.length === 2) {
    return `${textoDia(dias[0])} y ${textoDiaEnRango(dias[1])}`;
  }

  return `${textoDia(dias[0])} a ${textoDiaEnRango(dias[dias.length - 1])}`;
}

function bloquesVisibles(clave) {
  if (clave === 'CERRADO') {
    return { cerrado: true, bloques: [] };
  }

  return {
    cerrado: false,
    bloques: clave.split('|').map((rango) => rango.replace('-', '–')),
  };
}

export function agruparHorariosParaMostrar(horarios, atencion24Horas = false) {
  if (atencion24Horas) {
    return [{
      etiqueta: 'Todos los días',
      cerrado: false,
      bloques: ['Atención 24 horas'],
    }];
  }

  const porDia = new Map(ORDEN_DIAS.map((dia) => [dia, []]));

  for (const horario of horarios || []) {
    if (!porDia.has(horario.diaSemana)) {
      continue;
    }
    porDia.get(horario.diaSemana).push(horario);
  }

  const grupos = [];

  for (const dia of ORDEN_DIAS) {
    const bloques = porDia.get(dia);
    if (!bloques || bloques.length === 0) {
      continue;
    }

    const clave = claveHorarioDelDia(bloques);
    const anterior = grupos[grupos.length - 1];

    if (anterior && anterior.clave === clave && ORDEN_DIAS.indexOf(dia) === ORDEN_DIAS.indexOf(anterior.dias[anterior.dias.length - 1]) + 1) {
      anterior.dias.push(dia);
      continue;
    }

    grupos.push({
      clave,
      dias: [dia],
    });
  }

  return grupos.map((grupo) => ({
    etiqueta: etiquetaRangoDias(grupo.dias),
    ...bloquesVisibles(grupo.clave),
  }));
}

export function textoDisponibilidad(disponibilidad) {
  if (disponibilidad === 'ALTA_DEMANDA') {
    return 'Alta demanda';
  }

  if (disponibilidad === 'SIN_URGENCIAS') {
    return 'Sin urgencias';
  }

  return 'Disponible';
}

export function textoEstadoRegistro(estado) {
  if (estado === 'APROBADA') {
    return 'Aprobada';
  }

  if (estado === 'RECHAZADA') {
    return 'Rechazada';
  }

  return 'Pendiente';
}

export function textoEstadoReporte(estado) {
  if (estado === 'REVISADO') {
    return 'Revisado';
  }

  if (estado === 'DESESTIMADO') {
    return 'Desestimado';
  }

  return 'Pendiente';
}

export function textoRol(rol) {
  if (rol === 'PROPIETARIO') {
    return 'Propietario';
  }

  if (rol === 'ADMIN_VETERINARIA') {
    return 'Administrador de veterinaria';
  }

  if (rol === 'SUPERADMIN') {
    return 'SuperAdmin';
  }

  return rol;
}

export function textoEstadoCuenta(estado) {
  return estado === 'INACTIVA' ? 'Inactiva' : 'Activa';
}

export function textoDisponibilidadVisible(estaAbierta, disponibilidad) {
  if (!estaAbierta) {
    return null;
  }

  return textoDisponibilidad(disponibilidad);
}

export function formatearDireccion(direccion) {
  if (!direccion) {
    return 'Dirección no registrada';
  }

  return `${direccion.calle} ${direccion.numero}, ${direccion.comuna}`;
}

export function urlGoogleMaps(direccion) {
  if (!direccion || direccion.latitud === null || direccion.longitud === null) {
    return null;
  }

  return `https://www.google.com/maps/search/?api=1&query=${direccion.latitud},${direccion.longitud}`;
}

export function recortarLista(items, maximo) {
  const lista = items || [];

  if (lista.length <= maximo) {
    return { visibles: lista, restantes: 0 };
  }

  return {
    visibles: lista.slice(0, maximo),
    restantes: lista.length - maximo,
  };
}

export function formatearDistancia(distanciaKm) {
  if (distanciaKm === null || distanciaKm === undefined) {
    return null;
  }

  if (distanciaKm < 1) {
    return `${Math.round(distanciaKm * 1000)} m`;
  }

  return `${distanciaKm} km`;
}

export function textoEstadoUbicacion(estado) {
  if (estado === 'disponible') {
    return 'Detectada';
  }

  if (estado === 'solicitando') {
    return 'Solicitando';
  }

  if (estado === 'denegada' || estado === 'error') {
    return 'No disponible';
  }

  return 'No utilizada';
}

export function mensajeEstadoUrgencia(veterinarias) {
  if (!veterinarias.length) {
    return '';
  }

  const abiertas = veterinarias.filter((veterinaria) => veterinaria.estaAbierta);

  if (abiertas.length === 0) {
    return 'Ninguna veterinaria está abierta ahora. Se muestran las aprobadas para que puedas consultar horarios, llamar o ver la ficha.';
  }

  const conUrgencias = abiertas.filter((veterinaria) => veterinaria.atiendeUrgencias);

  if (conUrgencias.length === 0) {
    return 'Ninguna veterinaria abierta informa atención de urgencias. Se muestran las alternativas disponibles.';
  }

  if (conUrgencias.every((veterinaria) => veterinaria.disponibilidad === 'SIN_URGENCIAS')) {
    return 'Las veterinarias abiertas que atienden urgencias informan que no están recibiendo urgencias en este momento. Se muestran igual para que puedas consultar o llamar.';
  }

  return '';
}
