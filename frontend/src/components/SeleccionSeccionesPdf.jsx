import { useState } from 'react';

const SECCIONES = [
  { id: 'datosBasicos', etiqueta: 'Datos básicos' },
  { id: 'fotografia', etiqueta: 'Fotografía' },
  { id: 'vacunas', etiqueta: 'Vacunas' },
  { id: 'enfermedades', etiqueta: 'Enfermedades' },
  { id: 'alergias', etiqueta: 'Alergias' },
  { id: 'antecedentesRelevantes', etiqueta: 'Antecedentes relevantes' },
];

const SELECCION_INICIAL = Object.fromEntries(SECCIONES.map((seccion) => [seccion.id, true]));

function SeleccionSeccionesPdf({ onExportar, enviando, error }) {
  const [seleccion, setSeleccion] = useState(SELECCION_INICIAL);
  const [errorLocal, setErrorLocal] = useState('');

  function cambiarSeccion(id, marcada) {
    setSeleccion((actual) => ({ ...actual, [id]: marcada }));
  }

  function manejarEnvio(evento) {
    evento.preventDefault();
    const secciones = SECCIONES.filter((seccion) => seleccion[seccion.id]).map((seccion) => seccion.id);

    if (secciones.length === 0) {
      setErrorLocal('Debe seleccionar al menos una sección.');
      return;
    }

    setErrorLocal('');
    onExportar(secciones);
  }

  return (
    <form className="formulario seleccion-pdf" onSubmit={manejarEnvio}>
      <p>Seleccione las secciones que desea incluir. Todas vienen marcadas por defecto.</p>
      <div className="seleccion-pdf__lista">
        {SECCIONES.map((seccion) => (
          <label key={seccion.id} className="campo-check">
            <input
              type="checkbox"
              checked={seleccion[seccion.id]}
              onChange={(evento) => cambiarSeccion(seccion.id, evento.target.checked)}
            />
            <span>{seccion.etiqueta}</span>
          </label>
        ))}
      </div>
      {errorLocal || error ? <p className="mensaje-error">{errorLocal || error}</p> : null}
      <button type="submit" className="boton-contorno boton-pill" disabled={enviando}>
        {enviando ? 'Generando PDF...' : 'Exportar PDF'}
      </button>
    </form>
  );
}

export default SeleccionSeccionesPdf;
