import { useEffect, useId, useRef, useState } from 'react';
import { validarArchivoFotografia } from '../utils/fotografia.js';

function GestorFotografiasVeterinaria({
  fotografias,
  onSubir,
  onReemplazar,
  onEliminar,
  onReordenar,
  enviando,
}) {
  const idAlta = useId();
  const altaRef = useRef(null);
  const reemplazoRefs = useRef({});
  const [error, setError] = useState('');
  const [idsOrden, setIdsOrden] = useState(null);
  const claveOrden = fotografias.map((foto) => foto.idFotografiaVeterinaria).join(',');

  useEffect(() => {
    setIdsOrden(null);
  }, [claveOrden]);

  function numeroVisible(idFotografiaVeterinaria, ordenGuardado) {
    if (!idsOrden) {
      return ordenGuardado;
    }

    const indice = idsOrden.indexOf(idFotografiaVeterinaria);
    return indice >= 0 ? indice + 1 : null;
  }

  function asignarOrden(idFotografiaVeterinaria) {
    const base = idsOrden || [];
    const siguiente = base.includes(idFotografiaVeterinaria)
      ? base.filter((id) => id !== idFotografiaVeterinaria)
      : [...base, idFotografiaVeterinaria];

    setIdsOrden(siguiente.length === 0 ? null : siguiente);

    if (siguiente.length === fotografias.length && fotografias.length > 0 && !enviando) {
      const actuales = fotografias.map((foto) => foto.idFotografiaVeterinaria);
      const igual = actuales.every((id, indice) => id === siguiente[indice]);

      if (!igual) {
        onReordenar(siguiente);
      }
    }
  }

  async function procesarArchivo(archivo, accion) {
    setError('');
    const errorArchivo = validarArchivoFotografia(archivo);

    if (errorArchivo) {
      setError(errorArchivo);
      return;
    }

    try {
      await accion(archivo);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="gestor-fotografias">
      <p className="ayuda-campo">
        Pulse las fotografías en el orden en que desea mostrarlas. El número grande indica la posición.
        {idsOrden && idsOrden.length < fotografias.length
          ? ` ${idsOrden.length} de ${fotografias.length} numeradas; pulse las restantes para guardar.`
          : ''}
      </p>
      <div className="gestor-fotografias__lista">
        {fotografias.map((foto) => {
          const numero = numeroVisible(foto.idFotografiaVeterinaria, foto.ordenVisualizacion);

          return (
            <article key={foto.idFotografiaVeterinaria} className="gestor-fotografias__item">
              <button
                type="button"
                className={`gestor-fotografias__card${numero ? ' gestor-fotografias__card--numerada' : ''}`}
                disabled={enviando}
                aria-label={numero ? `Fotografía en posición ${numero}` : 'Fotografía sin orden asignado'}
                onClick={() => asignarOrden(foto.idFotografiaVeterinaria)}
              >
                <img src={foto.urlImagen} alt="" />
                {numero ? <span className="gestor-fotografias__orden">{numero}</span> : null}
              </button>
              <div className="gestor-fotografias__acciones">
                <button
                  type="button"
                  className="boton-contorno boton-compacto"
                  disabled={enviando}
                  onClick={() => reemplazoRefs.current[foto.idFotografiaVeterinaria]?.click()}
                >
                  Reemplazar
                </button>
                <button
                  type="button"
                  className="boton-destructivo-suave boton-compacto"
                  disabled={enviando}
                  onClick={() => onEliminar(foto.idFotografiaVeterinaria)}
                >
                  Eliminar
                </button>
              </div>
              <input
                ref={(nodo) => {
                  reemplazoRefs.current[foto.idFotografiaVeterinaria] = nodo;
                }}
                className="campo-fotografia__input"
                type="file"
                accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                onChange={(evento) => {
                  const archivo = evento.target.files?.[0];
                  evento.target.value = '';
                  if (archivo) {
                    procesarArchivo(archivo, (seleccionado) => onReemplazar(foto.idFotografiaVeterinaria, seleccionado));
                  }
                }}
              />
            </article>
          );
        })}
      </div>

      <button
        type="button"
        className="boton-contorno boton-pill boton-subir-foto"
        disabled={enviando}
        onClick={() => altaRef.current?.click()}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M12 5v14M5 12h14" />
        </svg>
        Subir foto
      </button>
      <input
        ref={altaRef}
        id={idAlta}
        className="campo-fotografia__input"
        type="file"
        accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
        disabled={enviando}
        onChange={(evento) => {
          const archivo = evento.target.files?.[0];
          evento.target.value = '';
          if (archivo) {
            procesarArchivo(archivo, onSubir);
          }
        }}
      />
      <p className="ayuda-campo">JPG, JPEG, PNG o WEBP. Máximo 5 MB.</p>
      {error ? <p className="mensaje-error">{error}</p> : null}
    </div>
  );
}

export default GestorFotografiasVeterinaria;
