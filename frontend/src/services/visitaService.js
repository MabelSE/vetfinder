import { solicitarApi } from './apiCliente.js';

export async function listarVisitas() {
  const respuesta = await solicitarApi('/api/visitas');
  return respuesta.visitas;
}

export async function crearVisita(datos) {
  const respuesta = await solicitarApi('/api/visitas', {
    method: 'POST',
    cuerpo: datos,
  });
  return respuesta.visita;
}
