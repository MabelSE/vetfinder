function EstrellasPuntuacion({ valor = 0, onCambiar }) {
  const interactiva = typeof onCambiar === 'function';

  function valorMitad(estrella, mitad) {
    if (mitad === 'izquierda') {
      return estrella === 1 ? 1 : estrella - 0.5;
    }
    return estrella;
  }

  return (
    <div
      className={`estrellas${interactiva ? ' estrellas--interactiva' : ''}`}
      role={interactiva ? 'radiogroup' : 'img'}
      aria-label={`${valor} de 5`}
    >
      {[1, 2, 3, 4, 5].map((estrella) => {
        const llenado = Math.max(0, Math.min(1, Number(valor) - (estrella - 1)));
        const porcentaje = `${llenado * 100}%`;

        return (
          <span key={estrella} className="estrella">
            <span className="estrella__base" aria-hidden="true">★</span>
            <span className="estrella__lleno" style={{ width: porcentaje }} aria-hidden="true">★</span>
            {interactiva ? (
              <>
                <button
                  type="button"
                  className="estrella__mitad estrella__mitad--izq"
                  aria-label={`${valorMitad(estrella, 'izquierda')} estrellas`}
                  onClick={() => onCambiar(valorMitad(estrella, 'izquierda'))}
                />
                <button
                  type="button"
                  className="estrella__mitad estrella__mitad--der"
                  aria-label={`${estrella} estrellas`}
                  onClick={() => onCambiar(estrella)}
                />
              </>
            ) : null}
          </span>
        );
      })}
    </div>
  );
}

export default EstrellasPuntuacion;
