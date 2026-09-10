import { solicitarApi } from './apiCliente.js';

export async function obtenerMiVeterinaria() {
  const respuesta = await solicitarApi('/api/veterinarias/mia');
  return respuesta.veterinaria;
}

export async function actualizarDatosGenerales(datos) {
  const respuesta = await solicitarApi('/api/veterinarias/mia', {
    method: 'PUT',
    cuerpo: datos,
  });
  return respuesta.veterinaria;
}

export async function actualizarDireccion(datos) {
  const respuesta = await solicitarApi('/api/veterinarias/mia/direccion', {
    method: 'PUT',
    cuerpo: datos,
  });
  return respuesta.direccion;
}

export async function actualizarHorarios(horarios) {
  const respuesta = await solicitarApi('/api/veterinarias/mia/horarios', {
    method: 'PUT',
    cuerpo: { horarios },
  });
  return respuesta.veterinaria;
}

export async function actualizarDisponibilidad(disponibilidad) {
  const respuesta = await solicitarApi('/api/veterinarias/mia/disponibilidad', {
    method: 'PATCH',
    cuerpo: { disponibilidad },
  });
  return respuesta.veterinaria;
}

export async function actualizarAtencion(datos) {
  const respuesta = await solicitarApi('/api/veterinarias/mia/atencion', {
    method: 'PATCH',
    cuerpo: datos,
  });
  return respuesta.veterinaria;
}

export async function actualizarServicios(idsServicio) {
  const respuesta = await solicitarApi('/api/veterinarias/mia/servicios', {
    method: 'PUT',
    cuerpo: { idsServicio },
  });
  return respuesta.veterinaria;
}

export async function actualizarEspecialidades(idsEspecialidad) {
  const respuesta = await solicitarApi('/api/veterinarias/mia/especialidades', {
    method: 'PUT',
    cuerpo: { idsEspecialidad },
  });
  return respuesta.veterinaria;
}

export async function actualizarEspecies(idsEspecie) {
  const respuesta = await solicitarApi('/api/veterinarias/mia/especies', {
    method: 'PUT',
    cuerpo: { idsEspecie },
  });
  return respuesta.veterinaria;
}

export async function crearServicioPersonalizado(datos) {
  const respuesta = await solicitarApi('/api/veterinarias/mia/servicios-personalizados', {
    method: 'POST',
    cuerpo: datos,
  });
  return respuesta.servicioPersonalizado;
}

export async function actualizarServicioPersonalizado(idServicioPersonalizado, datos) {
  const respuesta = await solicitarApi(
    `/api/veterinarias/mia/servicios-personalizados/${idServicioPersonalizado}`,
    { method: 'PUT', cuerpo: datos }
  );
  return respuesta.servicioPersonalizado;
}

export async function eliminarServicioPersonalizado(idServicioPersonalizado) {
  await solicitarApi(`/api/veterinarias/mia/servicios-personalizados/${idServicioPersonalizado}`, {
    method: 'DELETE',
  });
}

export async function subirFotografiaVeterinaria(archivo) {
  const formulario = new FormData();
  formulario.append('fotografia', archivo);
  const respuesta = await solicitarApi('/api/veterinarias/mia/fotografias', {
    method: 'POST',
    cuerpo: formulario,
  });
  return respuesta.fotografia;
}

export async function reemplazarFotografiaVeterinaria(idFotografiaVeterinaria, archivo) {
  const formulario = new FormData();
  formulario.append('fotografia', archivo);
  const respuesta = await solicitarApi(
    `/api/veterinarias/mia/fotografias/${idFotografiaVeterinaria}`,
    { method: 'PUT', cuerpo: formulario }
  );
  return respuesta.fotografia;
}

export async function eliminarFotografiaVeterinaria(idFotografiaVeterinaria) {
  await solicitarApi(`/api/veterinarias/mia/fotografias/${idFotografiaVeterinaria}`, {
    method: 'DELETE',
  });
}

export async function reordenarFotografiasVeterinaria(idsFotografia) {
  const respuesta = await solicitarApi('/api/veterinarias/mia/fotografias/orden', {
    method: 'PUT',
    cuerpo: { idsFotografia },
  });
  return respuesta.fotografias;
}
