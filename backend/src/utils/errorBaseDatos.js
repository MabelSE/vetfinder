export function esViolacionUnica(error, nombreRestriccion) {
  if (error?.code !== '23505') {
    return false;
  }

  if (!nombreRestriccion) {
    return true;
  }

  return error.constraint === nombreRestriccion;
}
