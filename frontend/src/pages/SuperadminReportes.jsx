import { useEffect, useState } from 'react';
import EstrellasPuntuacion from '../components/EstrellasPuntuacion.jsx';
import FiltroPildoras from '../components/FiltroPildoras.jsx';
import SuperadminNav from '../components/SuperadminNav.jsx';
import {
  listarReportesAdministracion,
  resolverReporteAdministracion,
} from '../services/superadminService.js';
import { formatearFechaCorta } from '../utils/fecha.js';
import { textoEstadoReporte } from '../utils/veterinaria.js';

const FILTROS_REPORTE = [
  { valor: 'TODAS', etiqueta: 'Todos' },
  { valor: '', etiqueta: 'Pendientes' },
  { valor: 'REVISADO', etiqueta: 'Revisados' },
  { valor: 'DESESTIMADO', etiqueta: 'Desestimados' },
];

function SuperadminReportes() {
  const [reportes, setReportes] = useState([]);
  const [filtro, setFiltro] = useState('');
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [cargando, setCargando] = useState(true);
  const [enviando, setEnviando] = useState('');
  const [observaciones, setObservaciones] = useState({});

  async function cargar(estado) {
    const lista = await listarReportesAdministracion(estado || undefined);
    setReportes(lista);
  }

  useEffect(() => {
    let cancelado = false;

    async function iniciar() {
      setCargando(true);
      setError('');
      try {
        await cargar(filtro);
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
  }, [filtro]);

  async function resolver(idReporte, estado) {
    setError('');
    setMensaje('');
    setEnviando(`${idReporte}-${estado}`);

    try {
      await resolverReporteAdministracion(idReporte, {
        estado,
        observacionAdmin: observaciones[idReporte] || '',
      });
      await cargar(filtro);
      setMensaje('El reporte se resolvió. La valoración sigue visible.');
    } catch (err) {
      setError(err.message);
    } finally {
      setEnviando('');
    }
  }

  return (
    <main className="pagina pagina--ancha pagina-admin-veterinaria">
      <header className="pagina-cabecera">
        <h1>Reportes de valoraciones</h1>
      </header>
      <SuperadminNav />
      <FiltroPildoras
        etiqueta="Estado del reporte"
        valor={filtro}
        opciones={FILTROS_REPORTE}
        onCambiar={setFiltro}
      />
      {error ? <p className="mensaje-error">{error}</p> : null}
      {mensaje ? <p className="mensaje-exito">{mensaje}</p> : null}
      {cargando ? <p>Cargando reportes...</p> : null}
      {!cargando && reportes.length === 0 ? (
        <p>No hay reportes para este filtro.</p>
      ) : (
        <ul className="lista-admin">
          {reportes.map((reporte) => (
            <li key={reporte.idReporte} className="tarjeta tarjeta-admin">
              <div className="tarjeta-admin__cabecera">
                <div>
                  <h2>{reporte.veterinaria.nombreComercial}</h2>
                  <p className="ayuda-campo">{formatearFechaCorta(reporte.fechaReporte)}</p>
                </div>
                <span className={`pildora-estado pildora-estado--${reporte.estado}`}>
                  {textoEstadoReporte(reporte.estado)}
                </span>
              </div>
              <p>
                Reportado por
                {' '}
                {reporte.reportadoPor.nombre}
                {' '}
                {reporte.reportadoPor.apellido}
                {' '}
                ({reporte.reportadoPor.correo})
              </p>
              <p>{reporte.motivo}</p>
              <div className="cita-valoracion">
                <div className="tarjeta-valoracion__cabecera">
                  <p className="tarjeta-valoracion__autor">{reporte.valoracion.autor}</p>
                  <div className="tarjeta-valoracion__puntuacion">
                    <EstrellasPuntuacion valor={reporte.valoracion.puntuacion} />
                  </div>
                </div>
                <p className="tarjeta-valoracion__mascota">
                  {reporte.valoracion.mascota.nombre} · {reporte.valoracion.mascota.nombreEspecie}
                </p>
                {reporte.valoracion.comentario
                  ? <p>{reporte.valoracion.comentario}</p>
                  : <p>Sin comentario.</p>}
              </div>
              {reporte.observacionAdmin ? (
                <p className="ayuda-campo">Observación: {reporte.observacionAdmin}</p>
              ) : null}
              {reporte.estado === 'PENDIENTE' ? (
                <form
                  className="formulario"
                  onSubmit={(evento) => evento.preventDefault()}
                >
                  <label htmlFor={`obs-${reporte.idReporte}`}>Observación administrativa (opcional)</label>
                  <textarea
                    id={`obs-${reporte.idReporte}`}
                    rows="2"
                    maxLength="2000"
                    value={observaciones[reporte.idReporte] || ''}
                    onChange={(evento) => setObservaciones({
                      ...observaciones,
                      [reporte.idReporte]: evento.target.value,
                    })}
                  />
                  <div className="acciones-formulario">
                    <button
                      type="button"
                      className="boton-primario boton-pill"
                      disabled={Boolean(enviando)}
                      onClick={() => resolver(reporte.idReporte, 'REVISADO')}
                    >
                      Marcar revisado
                    </button>
                    <button
                      type="button"
                      className="boton-destructivo-suave boton-pill"
                      disabled={Boolean(enviando)}
                      onClick={() => resolver(reporte.idReporte, 'DESESTIMADO')}
                    >
                      Desestimar
                    </button>
                  </div>
                </form>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

export default SuperadminReportes;
