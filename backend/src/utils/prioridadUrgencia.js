const ORDEN_DISPONIBILIDAD = {
  DISPONIBLE: 0,
  ALTA_DEMANDA: 1,
  SIN_URGENCIAS: 2,
};

function rangoDisponibilidad(disponibilidad) {
  if (Object.hasOwn(ORDEN_DISPONIBILIDAD, disponibilidad)) {
    return ORDEN_DISPONIBILIDAD[disponibilidad];
  }

  return 3;
}

export function compararVeterinariasUrgencia(a, b, hayUbicacion) {
  if (Boolean(a.estaAbierta) !== Boolean(b.estaAbierta)) {
    return a.estaAbierta ? -1 : 1;
  }

  if (Boolean(a.atiendeUrgencias) !== Boolean(b.atiendeUrgencias)) {
    return a.atiendeUrgencias ? -1 : 1;
  }

  if (a.estaAbierta) {
    const disponibilidadA = rangoDisponibilidad(a.disponibilidad);
    const disponibilidadB = rangoDisponibilidad(b.disponibilidad);

    if (disponibilidadA !== disponibilidadB) {
      return disponibilidadA - disponibilidadB;
    }
  }

  if (hayUbicacion) {
    const distanciaA = Number.isFinite(a.distanciaKmReal) ? a.distanciaKmReal : null;
    const distanciaB = Number.isFinite(b.distanciaKmReal) ? b.distanciaKmReal : null;

    if (distanciaA === null && distanciaB !== null) {
      return 1;
    }

    if (distanciaB === null && distanciaA !== null) {
      return -1;
    }

    if (distanciaA !== null && distanciaB !== null && distanciaA !== distanciaB) {
      return distanciaA - distanciaB;
    }
  }

  const porNombre = String(a.nombreComercial || '').localeCompare(String(b.nombreComercial || ''), 'es');

  if (porNombre !== 0) {
    return porNombre;
  }

  return Number(a.idVeterinaria) - Number(b.idVeterinaria);
}

export function ordenarVeterinariasUrgencia(veterinarias, hayUbicacion) {
  return veterinarias.slice().sort((primera, segunda) => (
    compararVeterinariasUrgencia(primera, segunda, hayUbicacion)
  ));
}
