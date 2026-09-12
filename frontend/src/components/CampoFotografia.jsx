import { useEffect, useRef, useState } from 'react';
import { validarArchivoFotografia } from '../utils/fotografia.js';

function CampoFotografia({
  id = 'fotografia',
  urlActual,
  archivo,
  eliminarFotografia,
  onArchivo,
  onEliminar,
  textoSubir = 'Subir foto',
  textoCambiar = 'Cambiar comprobante',
  textoQuitar = 'Quitar fotografía',
  compacto = false,
}) {
  const inputRef = useRef(null);
  const [vistaPrevia, setVistaPrevia] = useState('');

  useEffect(() => {
    if (!archivo) {
      setVistaPrevia('');
      return undefined;
    }

    const url = URL.createObjectURL(archivo);
    setVistaPrevia(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [archivo]);

  function manejarSeleccion(evento) {
    const seleccionado = evento.target.files?.[0];

    if (!seleccionado) {
      onArchivo(null, '');
      return;
    }

    const error = validarArchivoFotografia(seleccionado);

    if (error) {
      evento.target.value = '';
      onArchivo(null, error);
      return;
    }

    onArchivo(seleccionado, '');
  }

  function quitarFotografia() {
    if (inputRef.current) {
      inputRef.current.value = '';
    }

    onEliminar();
  }

  const urlVisible = vistaPrevia || (!eliminarFotografia && urlActual) || '';

  return (
    <div className={`campo-fotografia${compacto ? ' campo-fotografia--compacto' : ''}`}>
      {compacto ? (
        <div className="campo-fotografia__acciones">
          <button
            type="button"
            className="boton-contorno boton-pill boton-subir-foto"
            onClick={() => inputRef.current?.click()}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M12 5v14M5 12h14" />
            </svg>
            {urlVisible ? textoCambiar : textoSubir}
          </button>
          {urlVisible ? (
            <img className="campo-fotografia__miniatura" src={urlVisible} alt="" />
          ) : null}
        </div>
      ) : (
        <label htmlFor={id} className="campo-fotografia__recuadro">
          {urlVisible ? (
            <>
              <img src={urlVisible} alt="" />
              <span className="visually-hidden">{textoSubir}</span>
            </>
          ) : (
            <span className="campo-fotografia__mensaje">{textoSubir}</span>
          )}
        </label>
      )}
      <input
        ref={inputRef}
        id={id}
        className="campo-fotografia__input"
        type="file"
        accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
        onChange={manejarSeleccion}
      />
      <p className="ayuda-campo">JPG, JPEG, PNG o WEBP. Máximo 5 MB.</p>

      {archivo || (urlActual && !eliminarFotografia) ? (
        <button type="button" className="boton-quitar-foto" onClick={quitarFotografia}>
          {textoQuitar}
        </button>
      ) : null}
    </div>
  );
}

export default CampoFotografia;
