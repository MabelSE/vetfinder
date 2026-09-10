export function parsearId(valor, nombreCampo) {
  const id = Number(valor);

  if (!Number.isInteger(id) || id <= 0) {
    return { error: `El identificador de ${nombreCampo} es inválido.` };
  }

  return { id };
}
