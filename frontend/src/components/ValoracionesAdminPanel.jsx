import { useEffect, useState } from 'react';
import EstrellasPuntuacion from './EstrellasPuntuacion.jsx';
import { listarValoracionesAdmin, reportarValoracion } from '../services/valoracionService.js';
import { formatearFechaCorta } from '../utils/fecha.js';

function ValoracionesAdminPanel({ tituloComo = 'h2' }) {
  const Titulo = tituloComo;
  const [resumen, setResumen] = useState({ cantidad: 0, promedio: null });
  const [valoraciones, setValoraciones] = useState([]);
  const [idReportando, setIdReportando] = useState(null);
  const [motivo, setMotivo] = useState('');
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [cargando, setCargando] = useState(true);
  const [enviando, setEnviando] = useState(false);

  async function cargar() {
    const datos = await listarValoracionesAdmin();
    setResumen(datos.resumen);
    setValoraciones(datos.valoraciones);
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

  async function manejarReporte(evento, idValoracion) {
    evento.preventDefault();
    setError('');
    setMensaje('');
    setEnviando(true);

    try {
      await reportarValoracion(idValoracion, motivo);
      setMensaje('El reporte quedó pendiente de revisión.');
      setIdReportando(null);
      setMotivo('');
      await cargar();
    } catch (err) {
      setError(err.message);
    } finally {
      setEnviando(false);
    }
  }

  if (cargando) {
    return <p>Cargando valoraciones...</p>;
  }

  const hayValoraciones = resumen.cantidad > 0;
  const textoCantidad = `${resumen.cantidad} ${resumen.cantidad === 1 ? 'valoración' : 'valoraciones'}`;

  return (
    <div className="valoraciones-admin-panel">
      <header className="valoraciones-cabecera">
        <Titulo>Valoraciones</Titulo>
        {hayValoraciones ? (
          <div className="valoraciones-cabecera__resumen">
            <div className="valoraciones-cabecera__promedio">
              <strong>{Number(resumen.promedio).toFixed(1).replace('.', ',')}</strong>
              <EstrellasPuntuacion valor={resumen.promedio} />
            </div>
            <p>{textoCantidad}</p>
          </div>
        ) : (
          <p className="valoraciones-cabecera__vacio">Aún no hay valoraciones.</p>
        )}
      </header>

      {error ? <p className="mensaje-error">{error}</p> : null}
      {mensaje ? <p className="mensaje-exito">{mensaje}</p> : null}

      <ul className="lista-valoraciones">
        {valoraciones.map((valoracion) => (
          <li key={valoracion.idValoracion} className="tarjeta tarjeta-valoracion">
            <div className="tarjeta-valoracion__cabecera">
              <div className="tarjeta-valoracion__identidad">
                <p className="tarjeta-valoracion__autor">{valoracion.autor}</p>
                <p className="tarjeta-valoracion__mascota">
                  {valoracion.mascota.nombre} · {valoracion.mascota.nombreEspecie}
                </p>
              </div>
              <div className="tarjeta-valoracion__puntuacion">
                <EstrellasPuntuacion valor={valoracion.puntuacion} />
              </div>
            </div>
            {valoracion.comentario ? <p>{valoracion.comentario}</p> : <p>Sin comentario.</p>}
            <p className="ayuda-campo">{formatearFechaCorta(valoracion.fechaPublicacion)}</p>
            {valoracion.tieneReportePendiente ? (
              <p className="aviso">Esta valoración ya tiene un reporte pendiente.</p>
            ) : idReportando === valoracion.idValoracion ? (
              <form className="formulario" onSubmit={(evento) => manejarReporte(evento, valoracion.idValoracion)}>
                <label htmlFor={`motivo-${valoracion.idValoracion}`}>Motivo del reporte</label>
                <textarea
                  id={`motivo-${valoracion.idValoracion}`}
                  value={motivo}
                  onChange={(evento) => setMotivo(evento.target.value)}
                  rows="3"
                  required
                  maxLength="2000"
                />
                <div className="acciones-formulario">
                  <button type="submit" className="boton-contorno boton-pill" disabled={enviando}>
                    {enviando ? 'Enviando...' : 'Enviar reporte'}
                  </button>
                  <button
                    type="button"
                    className="boton-contorno boton-pill"
                    onClick={() => {
                      setIdReportando(null);
                      setMotivo('');
                    }}
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            ) : (
              <button
                type="button"
                className="boton-contorno boton-pill"
                onClick={() => setIdReportando(valoracion.idValoracion)}
              >
                Reportar
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ValoracionesAdminPanel;
