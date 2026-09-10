import { solicitarApi } from './apiCliente.js';

export async function listarEspecies() {
  const respuesta = await solicitarApi('/api/especies');
  return respuesta.especies;
}
