import { solicitarApi } from './apiCliente.js';

export async function obtenerValoracionesPublicas(idVeterinaria) {
  return solicitarApi(`/api/veterinarias/${idVeterinaria}/valoraciones`);
}

export async function crearValoracion(datos) {
  const respuesta = await solicitarApi('/api/valoraciones', {
    method: 'POST',
    cuerpo: datos,
  });
  return respuesta.valoracion;
}

export async function listarValoracionesAdmin() {
  return solicitarApi('/api/valoraciones');
}

export async function reportarValoracion(idValoracion, motivo) {
  const respuesta = await solicitarApi(`/api/valoraciones/${idValoracion}/reportes`, {
    method: 'POST',
    cuerpo: { motivo },
  });
  return respuesta.reporte;
}
