import { solicitarApi } from './apiCliente.js';

function crearApiGestion(base) {
  return {
    async obtener() {
      const respuesta = await solicitarApi(base);
      return respuesta.veterinaria;
    },
    async actualizarDatosGenerales(datos) {
      const respuesta = await solicitarApi(base, { method: 'PUT', cuerpo: datos });
      return respuesta.veterinaria;
    },
    async actualizarDireccion(datos) {
      const respuesta = await solicitarApi(`${base}/direccion`, { method: 'PUT', cuerpo: datos });
      return respuesta.direccion;
    },
    async actualizarHorarios(horarios) {
      const respuesta = await solicitarApi(`${base}/horarios`, {
        method: 'PUT',
        cuerpo: { horarios },
      });
      return respuesta.veterinaria;
    },
    async actualizarDisponibilidad(disponibilidad) {
      const respuesta = await solicitarApi(`${base}/disponibilidad`, {
        method: 'PATCH',
        cuerpo: { disponibilidad },
      });
      return respuesta.veterinaria;
    },
    async actualizarAtencion(datos) {
      const respuesta = await solicitarApi(`${base}/atencion`, { method: 'PATCH', cuerpo: datos });
      return respuesta.veterinaria;
    },
    async actualizarServicios(idsServicio) {
      const respuesta = await solicitarApi(`${base}/servicios`, {
        method: 'PUT',
        cuerpo: { idsServicio },
      });
      return respuesta.veterinaria;
    },
    async actualizarEspecialidades(idsEspecialidad) {
      const respuesta = await solicitarApi(`${base}/especialidades`, {
        method: 'PUT',
        cuerpo: { idsEspecialidad },
      });
      return respuesta.veterinaria;
    },
    async actualizarEspecies(idsEspecie) {
      const respuesta = await solicitarApi(`${base}/especies`, {
        method: 'PUT',
        cuerpo: { idsEspecie },
      });
      return respuesta.veterinaria;
    },
    async crearServicioPersonalizado(datos) {
      const respuesta = await solicitarApi(`${base}/servicios-personalizados`, {
        method: 'POST',
        cuerpo: datos,
      });
      return respuesta.servicioPersonalizado;
    },
    async actualizarServicioPersonalizado(idServicioPersonalizado, datos) {
      const respuesta = await solicitarApi(
        `${base}/servicios-personalizados/${idServicioPersonalizado}`,
        { method: 'PUT', cuerpo: datos }
      );
      return respuesta.servicioPersonalizado;
    },
    async eliminarServicioPersonalizado(idServicioPersonalizado) {
      await solicitarApi(`${base}/servicios-personalizados/${idServicioPersonalizado}`, {
        method: 'DELETE',
      });
    },
    async subirFotografiaVeterinaria(archivo) {
      const formulario = new FormData();
      formulario.append('fotografia', archivo);
      const respuesta = await solicitarApi(`${base}/fotografias`, {
        method: 'POST',
        cuerpo: formulario,
      });
      return respuesta.fotografia;
    },
    async reemplazarFotografiaVeterinaria(idFotografiaVeterinaria, archivo) {
      const formulario = new FormData();
      formulario.append('fotografia', archivo);
      const respuesta = await solicitarApi(`${base}/fotografias/${idFotografiaVeterinaria}`, {
        method: 'PUT',
        cuerpo: formulario,
      });
      return respuesta.fotografia;
    },
    async eliminarFotografiaVeterinaria(idFotografiaVeterinaria) {
      await solicitarApi(`${base}/fotografias/${idFotografiaVeterinaria}`, { method: 'DELETE' });
    },
    async reordenarFotografiasVeterinaria(idsFotografia) {
      const respuesta = await solicitarApi(`${base}/fotografias/orden`, {
        method: 'PUT',
        cuerpo: { idsFotografia },
      });
      return respuesta.fotografias;
    },
  };
}

export const apiMiVeterinaria = crearApiGestion('/api/veterinarias/mia');

export function crearApiVeterinariaAdministracion(idVeterinaria) {
  return crearApiGestion(`/api/administracion/veterinarias/${idVeterinaria}`);
}

export async function obtenerResumenAdministracion() {
  const respuesta = await solicitarApi('/api/administracion/resumen');
  return respuesta.resumen;
}

export async function listarSolicitudesVeterinarias() {
  const respuesta = await solicitarApi('/api/administracion/veterinarias/solicitudes');
  return respuesta.veterinarias;
}

export async function listarVeterinariasAdministracion(estadoRegistro) {
  const consulta = estadoRegistro ? `?estadoRegistro=${encodeURIComponent(estadoRegistro)}` : '';
  const respuesta = await solicitarApi(`/api/administracion/veterinarias${consulta}`);
  return respuesta.veterinarias;
}

export async function aprobarVeterinaria(idVeterinaria) {
  const respuesta = await solicitarApi(
    `/api/administracion/veterinarias/${idVeterinaria}/aprobacion`,
    { method: 'PATCH' }
  );
  return respuesta.veterinaria;
}

export async function rechazarVeterinaria(idVeterinaria) {
  const respuesta = await solicitarApi(
    `/api/administracion/veterinarias/${idVeterinaria}/rechazo`,
    { method: 'PATCH' }
  );
  return respuesta.veterinaria;
}

export async function eliminarVeterinariaAdministracion(idVeterinaria) {
  await solicitarApi(`/api/administracion/veterinarias/${idVeterinaria}`, { method: 'DELETE' });
}

export async function listarUsuariosAdministracion() {
  const respuesta = await solicitarApi('/api/administracion/usuarios');
  return respuesta.usuarios;
}

export async function actualizarEstadoCuentaUsuario(idUsuario, estadoCuenta) {
  const respuesta = await solicitarApi(`/api/administracion/usuarios/${idUsuario}/estado`, {
    method: 'PATCH',
    cuerpo: { estadoCuenta },
  });
  return respuesta.usuario;
}

export async function listarReportesAdministracion(estado) {
  const consulta = estado ? `?estado=${encodeURIComponent(estado)}` : '';
  const respuesta = await solicitarApi(`/api/administracion/reportes${consulta}`);
  return respuesta.reportes;
}

export async function resolverReporteAdministracion(idReporte, datos) {
  const respuesta = await solicitarApi(`/api/administracion/reportes/${idReporte}`, {
    method: 'PATCH',
    cuerpo: datos,
  });
  return respuesta.reporte;
}
