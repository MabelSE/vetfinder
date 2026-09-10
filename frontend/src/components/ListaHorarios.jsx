import { agruparHorariosParaMostrar } from '../utils/veterinaria.js';

function ListaHorarios({ horarios, atencion24Horas = false }) {
  const grupos = agruparHorariosParaMostrar(horarios, atencion24Horas);

  if (grupos.length === 0) {
    return <p>Horario no registrado.</p>;
  }

  return (
    <ul className="lista-horarios">
      {grupos.map((grupo) => (
        <li key={grupo.etiqueta}>
          <strong>{grupo.etiqueta}</strong>
          {grupo.cerrado ? (
            <span>Cerrado</span>
          ) : (
            grupo.bloques.map((bloque) => (
              <span key={bloque}>{bloque}</span>
            ))
          )}
        </li>
      ))}
    </ul>
  );
}

export default ListaHorarios;
