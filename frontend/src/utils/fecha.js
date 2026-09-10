export function formatearFechaCorta(valor) {
  if (!valor) {
    return '';
  }

  const iso = String(valor).slice(0, 10);

  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) {
    return '';
  }

  const [anio, mes, dia] = iso.split('-');
  return `${Number(dia)} de ${nombreMes(mes)} de ${anio}`;
}

function nombreMes(mes) {
  const meses = [
    'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
    'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
  ];
  return meses[Number(mes) - 1] || mes;
}

export function fechaHoyIso() {
  const ahora = new Date();
  const anio = ahora.getFullYear();
  const mes = String(ahora.getMonth() + 1).padStart(2, '0');
  const dia = String(ahora.getDate()).padStart(2, '0');
  return `${anio}-${mes}-${dia}`;
}
