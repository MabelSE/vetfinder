import { solicitarApi } from './apiCliente.js';

export async function solicitarRegistroVeterinaria(datos) {
  const respuesta = await solicitarApi('/api/veterinarias', {
    method: 'POST',
    cuerpo: datos,
  });

  return respuesta.usuario;
}

export async function listarVeterinarias(filtros = {}) {
  const parametros = new URLSearchParams();

  Object.entries(filtros).forEach(([clave, valor]) => {
    if (valor === undefined || valor === null || valor === '' || valor === false) {
      return;
    }

    parametros.set(clave, String(valor));
  });

  const consulta = parametros.toString();
  const respuesta = await solicitarApi(`/api/veterinarias${consulta ? `?${consulta}` : ''}`);
  return respuesta.veterinarias;
}

export async function obtenerVeterinaria(idVeterinaria) {
  const respuesta = await solicitarApi(`/api/veterinarias/${idVeterinaria}`);
  return respuesta.veterinaria;
}

export async function listarServicios() {
  const respuesta = await solicitarApi('/api/servicios');
  return respuesta.servicios;
}

export async function listarEspecialidades() {
  const respuesta = await solicitarApi('/api/especialidades');
  return respuesta.especialidades;
}
