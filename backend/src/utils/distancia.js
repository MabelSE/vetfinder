const RADIO_TIERRA_KM = 6371;

function aRadianes(grados) {
  return (grados * Math.PI) / 180;
}

export function calcularDistanciaKm(latitudOrigen, longitudOrigen, latitudDestino, longitudDestino) {
  if (
    ![latitudOrigen, longitudOrigen, latitudDestino, longitudDestino].every((valor) => Number.isFinite(Number(valor)))
  ) {
    return null;
  }

  const origenLat = aRadianes(Number(latitudOrigen));
  const destinoLat = aRadianes(Number(latitudDestino));
  const deltaLat = aRadianes(Number(latitudDestino) - Number(latitudOrigen));
  const deltaLng = aRadianes(Number(longitudDestino) - Number(longitudOrigen));

  const a =
    Math.sin(deltaLat / 2) ** 2
    + Math.cos(origenLat) * Math.cos(destinoLat) * Math.sin(deltaLng / 2) ** 2;

  return RADIO_TIERRA_KM * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function redondearDistanciaKm(distanciaKm) {
  if (!Number.isFinite(distanciaKm)) {
    return null;
  }

  return Math.round(distanciaKm * 10) / 10;
}
