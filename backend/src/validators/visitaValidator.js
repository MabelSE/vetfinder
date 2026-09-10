import { parsearId } from '../utils/identificador.js';

const FECHA_REGEX = /^\d{4}-\d{2}-\d{2}$/;

export function validarDatosVisita(cuerpo) {
  const errores = [];
  const mascota = parsearId(cuerpo?.idMascota, 'mascota');
  const veterinaria = parsearId(cuerpo?.idVeterinaria, 'veterinaria');
  const fechaVisita = typeof cuerpo?.fechaVisita === 'string' ? cuerpo.fechaVisita.trim() : '';

  if (mascota.error) {
    errores.push('Debe seleccionar una mascota.');
  }

  if (veterinaria.error) {
    errores.push('Debe seleccionar una veterinaria.');
  }

  if (!FECHA_REGEX.test(fechaVisita)) {
    errores.push('Ingrese una fecha de visita válida.');
  }

  return {
    errores,
    datos: {
      idMascota: mascota.id || null,
      idVeterinaria: veterinaria.id || null,
      fechaVisita,
    },
  };
}
