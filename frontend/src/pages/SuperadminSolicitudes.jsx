import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SuperadminNav from '../components/SuperadminNav.jsx';
import {
  aprobarVeterinaria,
  listarSolicitudesVeterinarias,
  rechazarVeterinaria,
} from '../services/superadminService.js';

function etiquetaCantidad(cantidad, singular, plural) {
  const total = Number(cantidad) || 0;
  return `${total} ${total === 1 ? singular : plural}`;
}

function SuperadminSolicitudes() {
  const [veterinarias, setVeterinarias] = useState([]);
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [cargando, setCargando] = useState(true);
  const [enviando, setEnviando] = useState('');

  async function cargar() {
    const lista = await listarSolicitudesVeterinarias();
    setVeterinarias(lista);
  }

  useEffect(() => {
    let cancelado = false;

    async function iniciar() {
      try {
        await cargar();
      } catch (err) {
        if (!cancelado) {
          setError(err.message);
        }
      } finally {
        if (!cancelado) {
          setCargando(false);
        }
      }
    }

    iniciar();
    return () => {
      cancelado = true;
    };
  }, []);

  async function ejecutar(clave, accion) {
    setError('');
    setMensaje('');
    setEnviando(clave);

    try {
      await accion();
      await cargar();
      setMensaje('El estado de registro se actualizó.');
    } catch (err) {
      setError(err.message);
    } finally {
      setEnviando('');
    }
  }

  if (cargando) {
    return <p className="pagina-estado">Cargando solicitudes...</p>;
  }

  return (
    <main className="pagina pagina--ancha pagina-admin-veterinaria">
      <header className="pagina-cabecera">
        <h1>Solicitudes</h1>
      </header>
      <SuperadminNav />
      {error ? <p className="mensaje-error">{error}</p> : null}
      {mensaje ? <p className="mensaje-exito">{mensaje}</p> : null}
      {veterinarias.length === 0 ? (
        <p>No hay solicitudes pendientes.</p>
      ) : (
        <ul className="lista-admin">
          {veterinarias.map((veterinaria) => (
            <li key={veterinaria.idVeterinaria} className="tarjeta tarjeta-admin tarjeta-admin--solicitudes">
              <div className="tarjeta-admin__cuerpo">
                <h2>{veterinaria.nombreComercial}</h2>
                <p className="tarjeta-admin__admin">
                  {veterinaria.administrador.nombre}
                  {' '}
                  {veterinaria.administrador.apellido}
                  {' - '}
                  {veterinaria.administrador.correo}
                </p>
                <p className="tarjeta-admin__resumen">
                  <span>{etiquetaCantidad(veterinaria.cantidadFotografias, 'fotografía', 'fotografías')}</span>
                  <span>{etiquetaCantidad(veterinaria.cantidadServicios, 'servicio', 'servicios')}</span>
                  <span>{etiquetaCantidad(veterinaria.cantidadEspecialidades, 'especialidad', 'especialidades')}</span>
                  <span>{etiquetaCantidad(veterinaria.cantidadEspecies, 'especie', 'especies')}</span>
                  <span>{etiquetaCantidad(veterinaria.cantidadHorarios, 'horario', 'horarios')}</span>
                </p>
              </div>
              <div className="tarjeta-admin__acciones">
                <Link
                  className="boton-contorno boton-pill"
                  to={`/superadmin/veterinarias/${veterinaria.idVeterinaria}`}
                >
                  Revisar
                </Link>
                <button
                  type="button"
                  className="boton-primario boton-pill"
                  disabled={Boolean(enviando)}
                  onClick={() => ejecutar(`aprobar-${veterinaria.idVeterinaria}`, () => aprobarVeterinaria(veterinaria.idVeterinaria))}
                >
                  Aprobar
                </button>
                <button
                  type="button"
                  className="boton-destructivo-suave boton-pill"
                  disabled={Boolean(enviando)}
                  onClick={() => ejecutar(`rechazar-${veterinaria.idVeterinaria}`, () => rechazarVeterinaria(veterinaria.idVeterinaria))}
                >
                  Rechazar
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

export default SuperadminSolicitudes;
