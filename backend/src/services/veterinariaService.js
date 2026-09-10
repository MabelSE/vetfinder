import { crearError } from '../utils/errorHttp.js';
import { calcularDistanciaKm, redondearDistanciaKm } from '../utils/distancia.js';
import { estaAbierta } from '../utils/horario.js';
import { ordenarVeterinariasUrgencia } from '../utils/prioridadUrgencia.js';
import {
  listarEspeciesDeVeterinaria,
  listarEspeciesDeVeterinarias,
  listarEspecialidadesDeVeterinaria,
  listarFotografias,
  listarHorariosPorVeterinarias,
  listarServiciosDeVeterinaria,
  listarServiciosDeVeterinarias,
  listarServiciosPersonalizados,
  listarVeterinariasAprobadas,
  obtenerVeterinariaPublicaPorId,
} from '../repositories/veterinariaRepository.js';

function agruparPorVeterinaria(filas) {
  const porVeterinaria = new Map();

  for (const fila of filas) {
    const lista = porVeterinaria.get(fila.idVeterinaria) || [];
    lista.push(fila);
    porVeterinaria.set(fila.idVeterinaria, lista);
  }

  return porVeterinaria;
}

function agruparHorarios(filas) {
  const porVeterinaria = new Map();

  for (const fila of filas) {
    const lista = porVeterinaria.get(fila.idVeterinaria) || [];
    lista.push({
      diaSemana: fila.diaSemana,
      horaApertura: fila.horaApertura,
      horaCierre: fila.horaCierre,
      cerrado: fila.cerrado,
    });
    porVeterinaria.set(fila.idVeterinaria, lista);
  }

  return porVeterinaria;
}

function completarListado(veterinaria, horarios, filtros) {
  const estaAbiertaAhora = estaAbierta(horarios, veterinaria.atencion24Horas);
  let distanciaKmReal = null;

  if (filtros.lat !== null && filtros.lng !== null) {
    distanciaKmReal = calcularDistanciaKm(
      filtros.lat,
      filtros.lng,
      veterinaria.direccion?.latitud,
      veterinaria.direccion?.longitud
    );
  }

  return {
    ...veterinaria,
    estaAbierta: estaAbiertaAhora,
    distanciaKmReal,
    distanciaKm: redondearDistanciaKm(distanciaKmReal),
  };
}

function publicarListado(veterinaria) {
  const { distanciaKmReal, ...publica } = veterinaria;
  return publica;
}

function compararPorDistanciaReal(a, b) {
  if (a.distanciaKmReal === null && b.distanciaKmReal === null) {
    return a.nombreComercial.localeCompare(b.nombreComercial, 'es');
  }

  if (a.distanciaKmReal === null) {
    return 1;
  }

  if (b.distanciaKmReal === null) {
    return -1;
  }

  if (a.distanciaKmReal !== b.distanciaKmReal) {
    return a.distanciaKmReal - b.distanciaKmReal;
  }

  return a.nombreComercial.localeCompare(b.nombreComercial, 'es');
}

export async function listarVeterinariasPublicas(filtros) {
  const filtrosConsulta = filtros.modoUrgencia ? {} : filtros;
  const veterinarias = await listarVeterinariasAprobadas(filtrosConsulta);
  const ids = veterinarias.map((item) => item.idVeterinaria);
  const [filasHorarios, filasServicios, filasEspecies] = await Promise.all([
    listarHorariosPorVeterinarias(ids),
    listarServiciosDeVeterinarias(ids),
    listarEspeciesDeVeterinarias(ids),
  ]);
  const horarios = agruparHorarios(filasHorarios);
  const serviciosPorVeterinaria = agruparPorVeterinaria(filasServicios);
  const especiesPorVeterinaria = agruparPorVeterinaria(filasEspecies);
  const hayUbicacion = filtros.lat !== null && filtros.lng !== null;

  let resultado = veterinarias.map((veterinaria) => ({
    ...completarListado(veterinaria, horarios.get(veterinaria.idVeterinaria) || [], filtros),
    servicios: (serviciosPorVeterinaria.get(veterinaria.idVeterinaria) || []).map(({ idServicio, nombre }) => ({
      idServicio,
      nombre,
    })),
    especies: (especiesPorVeterinaria.get(veterinaria.idVeterinaria) || []).map(({ idEspecie, nombre }) => ({
      idEspecie,
      nombre,
    })),
  }));

  if (filtros.modoUrgencia) {
    resultado = ordenarVeterinariasUrgencia(resultado, hayUbicacion);
    return resultado.map(publicarListado);
  }

  if (filtros.abiertasAhora) {
    resultado = resultado.filter((veterinaria) => veterinaria.estaAbierta);
  }

  if (hayUbicacion) {
    resultado.sort(compararPorDistanciaReal);
  }

  return resultado.map(publicarListado);
}

export async function obtenerFichaPublica(idVeterinaria) {
  const veterinaria = await obtenerVeterinariaPublicaPorId(idVeterinaria);

  if (!veterinaria) {
    throw crearError(404, 'No se encontró la veterinaria.');
  }

  const [horarios, fotografias, servicios, serviciosPersonalizados, especialidades, especies] = await Promise.all([
    listarHorariosPorVeterinarias([idVeterinaria]),
    listarFotografias(idVeterinaria),
    listarServiciosDeVeterinaria(idVeterinaria),
    listarServiciosPersonalizados(idVeterinaria),
    listarEspecialidadesDeVeterinaria(idVeterinaria),
    listarEspeciesDeVeterinaria(idVeterinaria),
  ]);

  const bloques = horarios.map(({ idVeterinaria: _id, ...horario }) => horario);

  return {
    ...veterinaria,
    estaAbierta: estaAbierta(bloques, veterinaria.atencion24Horas),
    horarios: bloques,
    fotografias,
    servicios,
    serviciosPersonalizados,
    especialidades,
    especies,
  };
}
