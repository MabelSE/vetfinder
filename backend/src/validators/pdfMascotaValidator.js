export const SECCIONES_PDF = [
  'datosBasicos',
  'fotografia',
  'vacunas',
  'enfermedades',
  'alergias',
  'antecedentesRelevantes',
];

export function validarSeccionesPdf(cuerpo) {
  if (!Array.isArray(cuerpo?.secciones) || cuerpo.secciones.length === 0) {
    return { errores: ['Debe seleccionar al menos una sección.'], secciones: [] };
  }

  const seleccionadas = [];

  for (const seccion of cuerpo.secciones) {
    if (!SECCIONES_PDF.includes(seccion)) {
      return { errores: ['Una o más secciones no son válidas.'], secciones: [] };
    }

    if (!seleccionadas.includes(seccion)) {
      seleccionadas.push(seccion);
    }
  }

  return {
    errores: [],
    secciones: SECCIONES_PDF.filter((seccion) => seleccionadas.includes(seccion)),
  };
}
