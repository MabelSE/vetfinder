import { useEffect, useRef, useState } from 'react';
import { validarArchivoFotografia } from '../utils/fotografia.js';

function CampoFotografia({ urlActual, archivo, eliminarFotografia, onArchivo, onEliminar }) {
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
    <div className="campo-fotografia">
      <label htmlFor="fotografia" className="campo-fotografia__recuadro">
        {urlVisible ? (
          <>
            <img src={urlVisible} alt="" />
            <span className="visually-hidden">Subir foto</span>
          </>
        ) : (
          <span className="campo-fotografia__mensaje">Subir foto</span>
        )}
      </label>
      <input
        ref={inputRef}
        id="fotografia"
        className="campo-fotografia__input"
        type="file"
        accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
        onChange={manejarSeleccion}
      />
      <p className="ayuda-campo">JPG, JPEG, PNG o WEBP. Máximo 5 MB.</p>

      {archivo || (urlActual && !eliminarFotografia) ? (
        <button type="button" className="boton-quitar-foto" onClick={quitarFotografia}>
          Quitar fotografía
        </button>
      ) : null}
    </div>
  );
}

export default CampoFotografia;
