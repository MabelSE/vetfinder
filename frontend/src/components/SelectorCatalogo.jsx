function SelectorCatalogo({
  etiqueta,
  items,
  idsSeleccionados,
  claveId,
  onCambiar,
  className = '',
  deshabilitado = false,
}) {
  function alternar(id) {
    if (deshabilitado) {
      return;
    }

    if (idsSeleccionados.includes(id)) {
      onCambiar(idsSeleccionados.filter((actual) => actual !== id));
      return;
    }

    onCambiar([...idsSeleccionados, id]);
  }

  return (
    <fieldset className={`selector-catalogo${className ? ` ${className}` : ''}`} disabled={deshabilitado}>
      <legend className="visually-hidden">{etiqueta}</legend>
      <div className="selector-catalogo__lista">
        {items.map((item) => {
          const id = item[claveId];
          const marcado = idsSeleccionados.includes(id);

          return (
            <label key={id} className={`selector-catalogo__opcion${marcado ? ' selector-catalogo__opcion--activa' : ''}`}>
              <input
                type="checkbox"
                checked={marcado}
                disabled={deshabilitado}
                onChange={() => alternar(id)}
              />
              <span>{item.nombre}</span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

export default SelectorCatalogo;
