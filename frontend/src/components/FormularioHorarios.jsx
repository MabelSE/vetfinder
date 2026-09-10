import { textoDia } from '../utils/veterinaria.js';

const DIAS = ['LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO', 'DOMINGO'];

function bloquesDesdeHorarios(horarios, diaSemana) {
  return (horarios || []).filter((bloque) => bloque.diaSemana === diaSemana);
}

export function crearEstadoHorarios(horarios) {
  return DIAS.map((diaSemana) => {
    const bloques = bloquesDesdeHorarios(horarios, diaSemana);
    const cerrado = bloques.length === 0 || bloques.every((bloque) => bloque.cerrado);

    return {
      diaSemana,
      cerrado,
      bloques: cerrado
        ? []
        : bloques
          .filter((bloque) => !bloque.cerrado)
          .map((bloque) => ({
            horaApertura: String(bloque.horaApertura || '').slice(0, 5),
            horaCierre: String(bloque.horaCierre || '').slice(0, 5),
          })),
    };
  });
}

export function armarHorariosParaEnviar(dias) {
  const horarios = [];

  dias.forEach((dia) => {
    if (dia.cerrado) {
      horarios.push({ diaSemana: dia.diaSemana, cerrado: true });
      return;
    }

    dia.bloques.forEach((bloque) => {
      if (bloque.horaApertura && bloque.horaCierre) {
        horarios.push({
          diaSemana: dia.diaSemana,
          cerrado: false,
          horaApertura: bloque.horaApertura,
          horaCierre: bloque.horaCierre,
        });
      }
    });
  });

  return horarios;
}

function FormularioHorarios({ dias, onCambiar, atencion24Horas }) {
  function actualizarDia(diaSemana, cambios) {
    onCambiar(dias.map((dia) => (dia.diaSemana === diaSemana ? { ...dia, ...cambios } : dia)));
  }

  function actualizarBloque(diaSemana, indice, campo, valor) {
    onCambiar(dias.map((dia) => {
      if (dia.diaSemana !== diaSemana) {
        return dia;
      }

      return {
        ...dia,
        bloques: dia.bloques.map((bloque, actual) => (
          actual === indice ? { ...bloque, [campo]: valor } : bloque
        )),
      };
    }));
  }

  return (
    <div className="formulario-horarios">
      {atencion24Horas ? (
        <p className="aviso">
          Con atención 24 horas la veterinaria aparece siempre abierta. Los bloques se conservan
          para cuando se desactive esa opción.
        </p>
      ) : null}
      {dias.map((dia) => (
        <section key={dia.diaSemana} className="formulario-horarios__dia">
          <div className="formulario-horarios__cabecera">
            <h3>{textoDia(dia.diaSemana)}</h3>
            <label className="campo-check">
              <input
                type="checkbox"
                checked={dia.cerrado}
                onChange={(evento) => actualizarDia(dia.diaSemana, {
                  cerrado: evento.target.checked,
                  bloques: evento.target.checked
                    ? []
                    : (dia.bloques.length > 0
                      ? dia.bloques
                      : [{ horaApertura: '09:00', horaCierre: '18:00' }]),
                })}
              />
              Cerrado
            </label>
          </div>
          {dia.cerrado ? null : (
            <>
              {dia.bloques.map((bloque, indice) => (
                <div key={`${dia.diaSemana}-${indice}`} className="formulario-horarios__bloque">
                  <label>
                    Apertura
                    <input
                      type="time"
                      value={bloque.horaApertura}
                      onChange={(evento) => actualizarBloque(dia.diaSemana, indice, 'horaApertura', evento.target.value)}
                    />
                  </label>
                  <label>
                    Cierre
                    <input
                      type="time"
                      value={bloque.horaCierre}
                      onChange={(evento) => actualizarBloque(dia.diaSemana, indice, 'horaCierre', evento.target.value)}
                    />
                  </label>
                  <button
                    type="button"
                    className="boton-texto"
                    onClick={() => actualizarDia(dia.diaSemana, {
                      bloques: dia.bloques.filter((_, actual) => actual !== indice),
                    })}
                  >
                    Quitar
                  </button>
                </div>
              ))}
              <button
                type="button"
                className="boton-contorno boton-pill"
                onClick={() => actualizarDia(dia.diaSemana, {
                  bloques: [...dia.bloques, { horaApertura: '09:00', horaCierre: '18:00' }],
                })}
              >
                Agregar bloque
              </button>
            </>
          )}
        </section>
      ))}
    </div>
  );
}

export default FormularioHorarios;
