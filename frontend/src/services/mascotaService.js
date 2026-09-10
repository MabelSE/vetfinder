import { solicitarApi } from './apiCliente.js';

export async function listarMascotas() {
  const respuesta = await solicitarApi('/api/mascotas');
  return respuesta.mascotas;
}

export async function obtenerMascota(idMascota) {
  const respuesta = await solicitarApi(`/api/mascotas/${idMascota}`);
  return respuesta.mascota;
}

export async function crearMascota(datos) {
  const respuesta = await solicitarApi('/api/mascotas', {
    method: 'POST',
    cuerpo: datos,
  });
  return respuesta.mascota;
}

export async function actualizarMascota(idMascota, datos) {
  const respuesta = await solicitarApi(`/api/mascotas/${idMascota}`, {
    method: 'PUT',
    cuerpo: datos,
  });
  return respuesta.mascota;
}

export async function actualizarFotografia(idMascota, archivo) {
  const formulario = new FormData();
  formulario.append('fotografia', archivo);

  const respuesta = await solicitarApi(`/api/mascotas/${idMascota}/fotografia`, {
    method: 'PUT',
    cuerpo: formulario,
  });
  return respuesta.mascota;
}

export async function eliminarFotografia(idMascota) {
  const respuesta = await solicitarApi(`/api/mascotas/${idMascota}/fotografia`, {
    method: 'DELETE',
  });
  return respuesta.mascota;
}

export async function eliminarMascota(idMascota) {
  await solicitarApi(`/api/mascotas/${idMascota}`, { method: 'DELETE' });
}

export async function exportarPdfMascota(idMascota, secciones) {
  return solicitarApi(`/api/mascotas/${idMascota}/pdf`, {
    method: 'POST',
    cuerpo: { secciones },
    respuestaBinaria: true,
  });
}

export async function listarVacunas(idMascota) {
  const respuesta = await solicitarApi(`/api/mascotas/${idMascota}/vacunas`);
  return respuesta.vacunas;
}

export async function crearVacuna(idMascota, datos) {
  const respuesta = await solicitarApi(`/api/mascotas/${idMascota}/vacunas`, {
    method: 'POST',
    cuerpo: datos,
  });
  return respuesta.vacuna;
}

export async function actualizarVacuna(idMascota, idVacuna, datos) {
  const respuesta = await solicitarApi(`/api/mascotas/${idMascota}/vacunas/${idVacuna}`, {
    method: 'PUT',
    cuerpo: datos,
  });
  return respuesta.vacuna;
}

export async function eliminarVacuna(idMascota, idVacuna) {
  await solicitarApi(`/api/mascotas/${idMascota}/vacunas/${idVacuna}`, { method: 'DELETE' });
}

export async function listarEnfermedades(idMascota) {
  const respuesta = await solicitarApi(`/api/mascotas/${idMascota}/enfermedades`);
  return respuesta.enfermedades;
}

export async function crearEnfermedad(idMascota, datos) {
  const respuesta = await solicitarApi(`/api/mascotas/${idMascota}/enfermedades`, {
    method: 'POST',
    cuerpo: datos,
  });
  return respuesta.enfermedad;
}

export async function actualizarEnfermedad(idMascota, idEnfermedad, datos) {
  const respuesta = await solicitarApi(
    `/api/mascotas/${idMascota}/enfermedades/${idEnfermedad}`,
    { method: 'PUT', cuerpo: datos }
  );
  return respuesta.enfermedad;
}

export async function eliminarEnfermedad(idMascota, idEnfermedad) {
  await solicitarApi(`/api/mascotas/${idMascota}/enfermedades/${idEnfermedad}`, {
    method: 'DELETE',
  });
}

export async function listarAlergias(idMascota) {
  const respuesta = await solicitarApi(`/api/mascotas/${idMascota}/alergias`);
  return respuesta.alergias;
}

export async function crearAlergia(idMascota, datos) {
  const respuesta = await solicitarApi(`/api/mascotas/${idMascota}/alergias`, {
    method: 'POST',
    cuerpo: datos,
  });
  return respuesta.alergia;
}

export async function actualizarAlergia(idMascota, idAlergia, datos) {
  const respuesta = await solicitarApi(`/api/mascotas/${idMascota}/alergias/${idAlergia}`, {
    method: 'PUT',
    cuerpo: datos,
  });
  return respuesta.alergia;
}

export async function eliminarAlergia(idMascota, idAlergia) {
  await solicitarApi(`/api/mascotas/${idMascota}/alergias/${idAlergia}`, { method: 'DELETE' });
}
