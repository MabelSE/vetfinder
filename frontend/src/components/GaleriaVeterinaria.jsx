import { useEffect, useState } from 'react';

function GaleriaVeterinaria({ fotografias = [] }) {
  const [indice, setIndice] = useState(0);

  useEffect(() => {
    setIndice(0);
  }, [fotografias]);

  if (fotografias.length === 0) {
    return (
      <div className="galeria-veterinaria">
        <div className="tarjeta-veterinaria__foto-vacia galeria-veterinaria__principal">
          Sin fotografías
        </div>
      </div>
    );
  }

  const indiceSeguro = Math.min(indice, fotografias.length - 1);
  const principal = fotografias[indiceSeguro];

  return (
    <div className="galeria-veterinaria">
      <img
        className="galeria-veterinaria__principal"
        src={principal.urlImagen}
        alt=""
      />
      {fotografias.length > 1 ? (
        <div className="galeria-miniaturas">
          {fotografias.map((foto, posicion) => (
            <button
              key={foto.ordenVisualizacion ?? foto.urlImagen}
              type="button"
              className={`galeria-miniatura${posicion === indiceSeguro ? ' galeria-miniatura--activa' : ''}`}
              onClick={() => setIndice(posicion)}
              aria-pressed={posicion === indiceSeguro}
              aria-label={`Ver fotografía ${posicion + 1}`}
            >
              <img src={foto.urlImagen} alt="" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export default GaleriaVeterinaria;
