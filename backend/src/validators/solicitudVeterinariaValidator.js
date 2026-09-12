import { validarRegistro } from './autenticacionValidator.js';
import { validarDatosDireccion, validarDatosGenerales } from './veterinariaAdminValidator.js';

export function validarSolicitudVeterinaria(cuerpo) {
  const cuenta = validarRegistro(cuerpo);
  const veterinaria = validarDatosGenerales(cuerpo?.veterinaria);
  const direccion = validarDatosDireccion(cuerpo?.direccion);
  const errores = [...cuenta.errores, ...veterinaria.errores, ...direccion.errores];

  return {
    errores,
    datos: {
      usuario: {
        nombre: cuenta.datos.nombre,
        apellido: cuenta.datos.apellido,
        correo: cuenta.datos.correo,
        contrasena: cuenta.datos.contrasena,
        telefono: cuenta.datos.telefono,
      },
      veterinaria: {
        nombreComercial: veterinaria.datos.nombreComercial,
        descripcion: veterinaria.datos.descripcion,
        telefono: veterinaria.datos.telefono,
        correo: veterinaria.datos.correo,
      },
      direccion: {
        calle: direccion.datos.calle,
        numero: direccion.datos.numero,
        comuna: direccion.datos.comuna,
        region: direccion.datos.region,
      },
    },
  };
}
