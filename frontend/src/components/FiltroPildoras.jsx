function FiltroPildoras({ etiqueta, valor, opciones, onCambiar }) {
  return (
    <div className="filtro-pildoras" role="group" aria-label={etiqueta}>
      {opciones.map((opcion) => (
        <button
          key={opcion.valor}
          type="button"
          className={`filtro-pildora${valor === opcion.valor ? ' filtro-pildora--activa' : ''}`}
          aria-pressed={valor === opcion.valor}
          onClick={() => onCambiar(opcion.valor)}
        >
          {opcion.etiqueta}
        </button>
      ))}
    </div>
  );
}

export default FiltroPildoras;
