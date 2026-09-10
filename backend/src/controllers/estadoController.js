import { verificarConexion } from '../repositories/estadoRepository.js';
import { crearError } from '../utils/errorHttp.js';

export async function obtenerEstado(req, res, next) {
  try {
    await verificarConexion();

    res.json({
      estado: 'ok',
      baseDatos: 'conectada',
    });
  } catch (error) {
    console.error(error);
    next(crearError(503, 'No fue posible conectar con la base de datos.'));
  }
}
