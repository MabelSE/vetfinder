import { useId, useState } from 'react';
import EstrellasPuntuacion from './EstrellasPuntuacion.jsx';

function FormularioValoracion({ onEnviar, onCancelar }) {
  const idComentario = useId();
  const [puntuacion, setPuntuacion] = useState(5);
  const [comentario, setComentario] = useState('');
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  async function manejarEnvio(evento) {
    evento.preventDefault();
    setError('');
    setEnviando(true);

    try {
      await onEnviar({
        puntuacion,
        comentario: comentario.trim() || undefined,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <form className="formulario formulario-valoracion" onSubmit={manejarEnvio}>
      <p>Puntuación</p>
      <EstrellasPuntuacion valor={puntuacion} onCambiar={setPuntuacion} />
      <p className="ayuda-campo">{puntuacion} de 5</p>
      <label htmlFor={idComentario}>Comentario (opcional)</label>
      <textarea
        id={idComentario}
        value={comentario}
        onChange={(evento) => setComentario(evento.target.value)}
        rows="3"
        maxLength="2000"
      />
      {error ? <p className="mensaje-error">{error}</p> : null}
      <div className="acciones-formulario">
        <button type="submit" className="boton-primario" disabled={enviando}>
          {enviando ? 'Guardando...' : 'Publicar valoración'}
        </button>
        {onCancelar ? (
          <button type="button" className="boton-contorno" onClick={onCancelar} disabled={enviando}>
            Cancelar
          </button>
        ) : null}
      </div>
    </form>
  );
}

export default FormularioValoracion;
