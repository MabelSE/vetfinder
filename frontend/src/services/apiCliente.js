export async function solicitarApi(ruta, { method = 'GET', cuerpo, respuestaBinaria = false } = {}) {
  const esFormulario = typeof FormData !== 'undefined' && cuerpo instanceof FormData;
  const respuesta = await fetch(ruta, {
    method,
    credentials: 'include',
    headers: cuerpo && !esFormulario ? { 'Content-Type': 'application/json' } : undefined,
    body: cuerpo ? (esFormulario ? cuerpo : JSON.stringify(cuerpo)) : undefined,
  });

  if (respuesta.status === 204) {
    return null;
  }

  if (respuestaBinaria) {
    if (!respuesta.ok) {
      let datos = {};

      try {
        datos = await respuesta.json();
      } catch {
        datos = {};
      }

      throw new Error(datos.error || 'No fue posible completar la solicitud.');
    }

    const blob = await respuesta.blob();
    const disposicion = respuesta.headers.get('Content-Disposition') || '';
    const coincidencia = disposicion.match(/filename="([^"]+)"/);

    return {
      blob,
      nombreArchivo: coincidencia?.[1] || 'ficha-mascota.pdf',
    };
  }

  let datos = {};

  try {
    datos = await respuesta.json();
  } catch {
    datos = {};
  }

  if (!respuesta.ok) {
    throw new Error(datos.error || 'No fue posible completar la solicitud.');
  }

  return datos;
}
