import { pool } from '../config/baseDatos.js';
import { crearError } from '../utils/errorHttp.js';
import { esViolacionUnica } from '../utils/errorBaseDatos.js';
import { hashearContrasena } from '../utils/contrasena.js';
import { omitirContrasena } from '../utils/usuarioPublico.js';
import { crearUsuarioAdministradorVeterinaria } from '../repositories/usuarioRepository.js';
import {
  crearDireccionInicial,
  crearVeterinariaPendiente,
} from '../repositories/veterinariaRepository.js';

export async function registrarSolicitudVeterinaria(datos) {
  const hash = await hashearContrasena(datos.usuario.contrasena);
  const cliente = await pool.connect();

  try {
    await cliente.query('BEGIN');

    const usuario = await crearUsuarioAdministradorVeterinaria(cliente, {
      nombre: datos.usuario.nombre,
      apellido: datos.usuario.apellido,
      correo: datos.usuario.correo,
      contrasena: hash,
      telefono: datos.usuario.telefono,
    });

    const veterinaria = await crearVeterinariaPendiente(cliente, {
      idUsuario: usuario.idUsuario,
      nombreComercial: datos.veterinaria.nombreComercial,
      descripcion: datos.veterinaria.descripcion,
      telefono: datos.veterinaria.telefono,
      correo: datos.veterinaria.correo,
    });

    await crearDireccionInicial(cliente, veterinaria.idVeterinaria, {
      calle: datos.direccion.calle,
      numero: datos.direccion.numero,
      comuna: datos.direccion.comuna,
      region: datos.direccion.region,
    });

    await cliente.query('COMMIT');
    return omitirContrasena(usuario);
  } catch (error) {
    await cliente.query('ROLLBACK');

    if (esViolacionUnica(error, 'usuario_correo_key')) {
      throw crearError(409, 'Ya existe una cuenta con ese correo.');
    }

    throw error;
  } finally {
    cliente.release();
  }
}
