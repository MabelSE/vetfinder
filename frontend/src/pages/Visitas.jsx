import { useEffect, useState } from 'react';
import FormularioValoracion from '../components/FormularioValoracion.jsx';
import EstrellasPuntuacion from '../components/EstrellasPuntuacion.jsx';
import { listarMascotas } from '../services/mascotaService.js';
import { listarVeterinarias } from '../services/veterinariaService.js';
import { crearVisita, listarVisitas } from '../services/visitaService.js';
import { crearValoracion } from '../services/valoracionService.js';
import { fechaHoyIso, formatearFechaCorta } from '../utils/fecha.js';

function Visitas() {
  const [mascotas, setMascotas] = useState([]);
  const [veterinarias, setVeterinarias] = useState([]);
  const [visitas, setVisitas] = useState([]);
  const [idMascota, setIdMascota] = useState('');
  const [idVeterinaria, setIdVeterinaria] = useState('');
  const [fechaVisita, setFechaVisita] = useState(fechaHoyIso());
  const [idVisitaValorando, setIdVisitaValorando] = useState(null);
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [cargando, setCargando] = useState(true);
  const [enviando, setEnviando] = useState(false);

  async function cargar() {
    const [listaMascotas, listaVeterinarias, listaVisitas] = await Promise.all([
      listarMascotas(),
      listarVeterinarias(),
      listarVisitas(),
    ]);
    setMascotas(listaMascotas);
    setVeterinarias(listaVeterinarias);
    setVisitas(listaVisitas);
    setIdMascota((actual) => actual || (listaMascotas[0] ? String(listaMascotas[0].idMascota) : ''));
    setIdVeterinaria((actual) => actual || (listaVeterinarias[0] ? String(listaVeterinarias[0].idVeterinaria) : ''));
  }

  useEffect(() => {
    let cancelado = false;

    async function iniciar() {
      try {
        await cargar();
      } catch (err) {
        if (!cancelado) {
          setError(err.message);
        }
      } finally {
        if (!cancelado) {
          setCargando(false);
        }
      }
    }

    iniciar();
    return () => {
      cancelado = true;
    };
  }, []);

  async function manejarRegistro(evento) {
    evento.preventDefault();
    setError('');
    setMensaje('');
    setEnviando(true);

    try {
      await crearVisita({
        idMascota: Number(idMascota),
        idVeterinaria: Number(idVeterinaria),
        fechaVisita,
      });
      setMensaje('La visita se registró correctamente.');
      await cargar();
    } catch (err) {
      setError(err.message);
    } finally {
      setEnviando(false);
    }
  }

  async function manejarValoracion(idVisita, datos) {
    await crearValoracion({ idVisita, ...datos });
    setIdVisitaValorando(null);
    setMensaje('La valoración se publicó correctamente.');
    await cargar();
  }

  if (cargando) {
    return <p className="pagina-estado">Cargando visitas...</p>;
  }

  return (
    <main className="pagina pagina--ancha">
      <header className="pagina-cabecera">
        <h1>Visitas y valoraciones</h1>
      </header>

      <section className="seccion">
        <h2>Registrar visita</h2>
        {mascotas.length === 0 ? (
          <p>Registra una mascota antes de poder guardar visitas.</p>
        ) : (
          <form className="formulario" onSubmit={manejarRegistro}>
            <p>Mascota</p>
            <div className="selector-mascotas">
              {mascotas.map((mascota) => {
                const seleccionada = String(idMascota) === String(mascota.idMascota);

                return (
                  <button
                    key={mascota.idMascota}
                    type="button"
                    className={`selector-mascota${seleccionada ? ' selector-mascota--activa' : ''}`}
                    onClick={() => setIdMascota(String(mascota.idMascota))}
                    aria-pressed={seleccionada}
                  >
                    {mascota.fotografia ? (
                      <img
                        src={mascota.fotografia}
                        alt=""
                        className="selector-mascota__foto"
                      />
                    ) : (
                      <span className="selector-mascota__foto selector-mascota__foto--vacia" aria-hidden="true">
                        {mascota.nombre.trim().charAt(0).toUpperCase() || '?'}
                      </span>
                    )}
                    <span className="selector-mascota__nombre">{mascota.nombre}</span>
                  </button>
                );
              })}
            </div>
            <div className="grupo-campos grupo-campos--visita">
              <div>
                <label htmlFor="idVeterinaria">Veterinaria</label>
                {veterinarias.length === 0 ? (
                  <p>No hay veterinarias publicadas para registrar una visita.</p>
                ) : (
                  <select
                    id="idVeterinaria"
                    value={idVeterinaria}
                    onChange={(evento) => setIdVeterinaria(evento.target.value)}
                    required
                  >
                    {veterinarias.map((veterinaria) => (
                      <option key={veterinaria.idVeterinaria} value={veterinaria.idVeterinaria}>
                        {veterinaria.nombreComercial}
                      </option>
                    ))}
                  </select>
                )}
              </div>
              <div>
                <label htmlFor="fechaVisita">Fecha</label>
                <input
                  id="fechaVisita"
                  type="date"
                  max={fechaHoyIso()}
                  value={fechaVisita}
                  onChange={(evento) => setFechaVisita(evento.target.value)}
                  required
                />
              </div>
            </div>
            <button type="submit" className="boton-contorno" disabled={enviando || !idVeterinaria}>
              {enviando ? 'Registrando...' : 'Registrar visita'}
            </button>
          </form>
        )}
      </section>

      {error || mensaje ? (
        <div className="visitas-alertas">
          {error ? <p className="mensaje-error">{error}</p> : null}
          {mensaje ? <p className="mensaje-exito">{mensaje}</p> : null}
        </div>
      ) : null}

      <h2>Historial de visitas</h2>
      {visitas.length === 0 ? (
        <p>Aún no hay visitas registradas.</p>
      ) : (
        <ul className="lista-visitas">
          {visitas.map((visita) => (
            <li key={visita.idVisita} className="tarjeta tarjeta-visita">
              <div className="tarjeta-visita__cabecera">
                <div className="tarjeta-visita__identidad">
                  <h3>{visita.veterinaria.nombreComercial}</h3>
                  <p>
                    {visita.mascota.nombre}, {formatearFechaCorta(visita.fechaVisita)}
                  </p>
                </div>
                {visita.valoracion ? (
                  <div className="tarjeta-visita__puntuacion">
                    <EstrellasPuntuacion valor={visita.valoracion.puntuacion} />
                  </div>
                ) : null}
              </div>
              {visita.valoracion ? (
                <p>{visita.valoracion.comentario || 'Sin comentario.'}</p>
              ) : idVisitaValorando === visita.idVisita ? (
                <FormularioValoracion
                  onEnviar={(datos) => manejarValoracion(visita.idVisita, datos)}
                  onCancelar={() => setIdVisitaValorando(null)}
                />
              ) : (
                <button
                  type="button"
                  className="boton-primario"
                  onClick={() => setIdVisitaValorando(visita.idVisita)}
                >
                  Valorar visita
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

export default Visitas;
