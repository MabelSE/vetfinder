function buscarPorNombre(lista, nombre) {
  return (lista || []).find((item) => item.nombre === nombre) || null;
}

function FiltrosVeterinaria({
  valores,
  especies,
  servicios,
  especialidades,
  onCambiar,
  onBuscar,
  onLimpiar,
}) {
  const hayFiltrosExtra = Boolean(valores.idEspecialidad || valores.idEspecie || valores.idServicio);
  const hayFiltrosActivos = Boolean(
    valores.abiertasAhora
    || valores.atencion24Horas
    || valores.atiendeUrgencias
    || hayFiltrosExtra
  );
  const mostrarMas = Boolean(valores.mostrarMasFiltros);

  const servicioPeluqueria = buscarPorNombre(servicios, 'Peluquería');
  const especieGato = buscarPorNombre(especies, 'Gato');
  const especialidadDermatologia = buscarPorNombre(especialidades, 'Dermatología');

  function estaSeleccionado(campo, id) {
    return String(valores[campo] || '') === String(id);
  }

  function alternarFiltroCatalogo(campo, id) {
    onCambiar(campo, estaSeleccionado(campo, id) ? '' : String(id));
  }

  return (
    <form
      className="filtros-veterinaria"
      onSubmit={(evento) => {
        evento.preventDefault();
        onBuscar();
      }}
    >
      <div className="busqueda-principal">
        <label htmlFor="filtroNombre" className="visually-hidden">Buscar por nombre comercial</label>
        <input
          id="filtroNombre"
          value={valores.nombre}
          onChange={(evento) => onCambiar('nombre', evento.target.value)}
          placeholder="Buscar por clínica..."
        />
        <button type="submit" className="boton-primario">
          Buscar ahora
        </button>
      </div>

      <div className="filtros-pildoras">
        <button
          type="button"
          className={`filtro-pildora${valores.abiertasAhora ? ' filtro-pildora--activa' : ''}`}
          onClick={() => onCambiar('abiertasAhora', !valores.abiertasAhora)}
        >
          Abiertas ahora
        </button>
        <button
          type="button"
          className={`filtro-pildora${valores.atiendeUrgencias ? ' filtro-pildora--activa' : ''}`}
          onClick={() => onCambiar('atiendeUrgencias', !valores.atiendeUrgencias)}
        >
          Urgencias
        </button>
        <button
          type="button"
          className={`filtro-pildora${valores.atencion24Horas ? ' filtro-pildora--activa' : ''}`}
          onClick={() => onCambiar('atencion24Horas', !valores.atencion24Horas)}
        >
          24 horas
        </button>
        {servicioPeluqueria ? (
          <button
            type="button"
            className={`filtro-pildora${estaSeleccionado('idServicio', servicioPeluqueria.idServicio) ? ' filtro-pildora--activa' : ''}`}
            onClick={() => alternarFiltroCatalogo('idServicio', servicioPeluqueria.idServicio)}
          >
            Peluquería
          </button>
        ) : null}
        {especieGato ? (
          <button
            type="button"
            className={`filtro-pildora${estaSeleccionado('idEspecie', especieGato.idEspecie) ? ' filtro-pildora--activa' : ''}`}
            onClick={() => alternarFiltroCatalogo('idEspecie', especieGato.idEspecie)}
          >
            Gato
          </button>
        ) : null}
        {especialidadDermatologia ? (
          <button
            type="button"
            className={`filtro-pildora${estaSeleccionado('idEspecialidad', especialidadDermatologia.idEspecialidad) ? ' filtro-pildora--activa' : ''}`}
            onClick={() => alternarFiltroCatalogo('idEspecialidad', especialidadDermatologia.idEspecialidad)}
          >
            Dermatología
          </button>
        ) : null}
        <button
          type="button"
          className={`filtro-pildora${mostrarMas ? ' filtro-pildora--activa' : ''}`}
          onClick={() => onCambiar('mostrarMasFiltros', !valores.mostrarMasFiltros)}
          aria-expanded={mostrarMas}
        >
          Más filtros
        </button>
        {hayFiltrosActivos ? (
          <button type="button" className="enlace-discreto" onClick={onLimpiar}>
            Quitar filtros
          </button>
        ) : null}
      </div>

      {mostrarMas ? (
        <div className="filtros-selects">
          <div>
            <label htmlFor="filtroEspecialidad">Especialidad</label>
            <select
              id="filtroEspecialidad"
              value={valores.idEspecialidad}
              onChange={(evento) => onCambiar('idEspecialidad', evento.target.value)}
            >
              <option value="">Todas</option>
              {especialidades.map((item) => (
                <option key={item.idEspecialidad} value={item.idEspecialidad}>
                  {item.nombre}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="filtroEspecie">Especie atendida</label>
            <select
              id="filtroEspecie"
              value={valores.idEspecie}
              onChange={(evento) => onCambiar('idEspecie', evento.target.value)}
            >
              <option value="">Todas</option>
              {especies.map((item) => (
                <option key={item.idEspecie} value={item.idEspecie}>
                  {item.nombre}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="filtroServicio">Servicio</label>
            <select
              id="filtroServicio"
              value={valores.idServicio}
              onChange={(evento) => onCambiar('idServicio', evento.target.value)}
            >
              <option value="">Todos</option>
              {servicios.map((item) => (
                <option key={item.idServicio} value={item.idServicio}>
                  {item.nombre}
                </option>
              ))}
            </select>
          </div>
        </div>
      ) : null}
    </form>
  );
}

export default FiltrosVeterinaria;
