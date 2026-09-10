export function formatearFecha(valor) {
  if (!valor) {
    return null;
  }

  if (valor instanceof Date) {
    const anio = valor.getFullYear();
    const mes = String(valor.getMonth() + 1).padStart(2, '0');
    const dia = String(valor.getDate()).padStart(2, '0');
    return `${anio}-${mes}-${dia}`;
  }

  return String(valor).slice(0, 10);
}

export function formatearFechaLegible(valor) {
  const iso = formatearFecha(valor);

  if (!iso || !/^\d{4}-\d{2}-\d{2}$/.test(iso)) {
    return null;
  }

  const [anio, mes, dia] = iso.split('-');
  return `${dia}-${mes}-${anio}`;
}

export function formatearFechaActualLegible() {
  return new Intl.DateTimeFormat('es-CL', {
    timeZone: 'America/Santiago',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date());
}

export function obtenerFechaHoySantiago() {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Santiago',
  }).format(new Date());
}
