export const DIAS_SEMANA = ['LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO', 'DOMINGO'];

const ZONA_HORARIA = 'America/Santiago';

const DIAS_POR_ABREVIATURA = {
  Sun: 'DOMINGO',
  Mon: 'LUNES',
  Tue: 'MARTES',
  Wed: 'MIERCOLES',
  Thu: 'JUEVES',
  Fri: 'VIERNES',
  Sat: 'SABADO',
};

export function horaAMinutos(valor) {
  if (valor === undefined || valor === null || valor === '') {
    return null;
  }

  if (valor instanceof Date) {
    return valor.getUTCHours() * 60 + valor.getUTCMinutes() + valor.getUTCSeconds() / 60;
  }

  const partes = String(valor).split(':');
  const horas = Number(partes[0]);
  const minutos = Number(partes[1] || 0);
  const segundos = Number(partes[2] || 0);

  if (!Number.isFinite(horas) || !Number.isFinite(minutos) || !Number.isFinite(segundos)) {
    return null;
  }

  return horas * 60 + minutos + segundos / 60;
}

export function obtenerMomentoSantiago(fecha = new Date()) {
  const partes = Object.fromEntries(
    new Intl.DateTimeFormat('en-US', {
      timeZone: ZONA_HORARIA,
      weekday: 'short',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
      hourCycle: 'h23',
    })
      .formatToParts(fecha)
      .filter((parte) => parte.type !== 'literal')
      .map((parte) => [parte.type, parte.value])
  );

  return {
    diaSemana: DIAS_POR_ABREVIATURA[partes.weekday],
    minutos: Number(partes.hour) * 60 + Number(partes.minute) + Number(partes.second) / 60,
  };
}

export function estaAbierta(horarios, atencion24Horas, momento = obtenerMomentoSantiago()) {
  if (atencion24Horas) {
    return true;
  }

  if (!momento?.diaSemana) {
    return false;
  }

  return (horarios || []).some((horario) => {
    if (horario.diaSemana !== momento.diaSemana || horario.cerrado) {
      return false;
    }

    const apertura = horaAMinutos(horario.horaApertura);
    const cierre = horaAMinutos(horario.horaCierre);

    if (apertura === null || cierre === null) {
      return false;
    }

    return apertura <= momento.minutos && momento.minutos < cierre;
  });
}

export function formatearHora(valor) {
  if (valor === undefined || valor === null || valor === '') {
    return null;
  }

  if (valor instanceof Date) {
    const horas = String(valor.getUTCHours()).padStart(2, '0');
    const minutos = String(valor.getUTCMinutes()).padStart(2, '0');
    return `${horas}:${minutos}`;
  }

  return String(valor).slice(0, 5);
}
