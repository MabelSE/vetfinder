import EstrellasPuntuacion from './EstrellasPuntuacion.jsx';
import { formatearFechaCorta } from '../utils/fecha.js';

function ListaValoraciones({ valoraciones, resumen }) {
  const hayValoraciones = Boolean(resumen && resumen.cantidad > 0);
  const textoCantidad = hayValoraciones
    ? `${resumen.cantidad} ${resumen.cantidad === 1 ? 'valoración' : 'valoraciones'}`
    : '';

  return (
    <>
      <header className="valoraciones-cabecera">
        <h2>Valoraciones</h2>
        {hayValoraciones ? (
          <div className="valoraciones-cabecera__resumen">
            <div className="valoraciones-cabecera__promedio">
              <EstrellasPuntuacion valor={resumen.promedio} />
              <strong>{Number(resumen.promedio).toFixed(1).replace('.', ',')}</strong>
            </div>
            <p>{textoCantidad}</p>
          </div>
        ) : (
          <p className="valoraciones-cabecera__vacio">Aún no hay valoraciones.</p>
        )}
      </header>
      {hayValoraciones ? (
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
              {valoracion.comentario ? <p>{valoracion.comentario}</p> : null}
              <p className="ayuda-campo">{formatearFechaCorta(valoracion.fechaPublicacion)}</p>
            </li>
          ))}
        </ul>
      ) : null}
    </>
  );
}

export default ListaValoraciones;
