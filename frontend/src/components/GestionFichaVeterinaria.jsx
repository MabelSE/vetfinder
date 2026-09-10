import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import FormularioHorarios, {
  armarHorariosParaEnviar,
  crearEstadoHorarios,
} from './FormularioHorarios.jsx';
import GestorFotografiasVeterinaria from './GestorFotografiasVeterinaria.jsx';
import SelectorCatalogo from './SelectorCatalogo.jsx';
import ValoracionesAdminPanel from './ValoracionesAdminPanel.jsx';
import { listarEspecies } from '../services/especieService.js';
import { listarEspecialidades, listarServicios } from '../services/veterinariaService.js';
import { textoDisponibilidad, textoEstadoRegistro } from '../utils/veterinaria.js';

const PESTANAS_BASE = [
  { id: 'general', etiqueta: 'General' },
  { id: 'direccion', etiqueta: 'Dirección' },
  { id: 'fotografias', etiqueta: 'Fotografías' },
  { id: 'atencion', etiqueta: 'Atención y horarios' },
  { id: 'servicios', etiqueta: 'Servicios' },
  { id: 'especialidades', etiqueta: 'Especialidades' },
  { id: 'especies', etiqueta: 'Especies' },
];

const OPCIONES_DISPONIBILIDAD = ['DISPONIBLE', 'ALTA_DEMANDA', 'SIN_URGENCIAS'];

function GestionFichaVeterinaria({
  titulo,
  api,
  mostrarValoraciones = false,
  accionesEstado = null,
  navExtra = null,
}) {
  const [veterinaria, setVeterinaria] = useState(null);
  const [serviciosCatalogo, setServiciosCatalogo] = useState([]);
  const [especialidadesCatalogo, setEspecialidadesCatalogo] = useState([]);
  const [especiesCatalogo, setEspeciesCatalogo] = useState([]);
  const [generales, setGenerales] = useState({
    nombreComercial: '',
    descripcion: '',
    telefono: '',
    correo: '',
    sitioWeb: '',
    instagram: '',
    facebook: '',
  });
  const [direccion, setDireccion] = useState({
    calle: '',
    numero: '',
    comuna: '',
    region: '',
    latitud: '',
    longitud: '',
  });
  const [horarios, setHorarios] = useState([]);
  const [disponibilidad, setDisponibilidad] = useState('DISPONIBLE');
  const [atencion24Horas, setAtencion24Horas] = useState(false);
  const [atiendeUrgencias, setAtiendeUrgencias] = useState(false);
  const [idsServicio, setIdsServicio] = useState([]);
  const [idsEspecialidad, setIdsEspecialidad] = useState([]);
  const [idsEspecie, setIdsEspecie] = useState([]);
  const [personalizado, setPersonalizado] = useState({ nombre: '', descripcion: '' });
  const [idEditandoPersonalizado, setIdEditandoPersonalizado] = useState(null);
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [cargando, setCargando] = useState(true);
  const [enviando, setEnviando] = useState('');
  const [autoguardado, setAutoguardado] = useState('');
  const [pestanaActiva, setPestanaActiva] = useState('general');
  const autoguardandoRef = useRef(false);

  const pestanas = mostrarValoraciones
    ? [...PESTANAS_BASE, { id: 'valoraciones', etiqueta: 'Valoraciones' }]
    : PESTANAS_BASE;

  function aplicarVeterinaria(ficha) {
    setVeterinaria(ficha);
    setGenerales({
      nombreComercial: ficha.nombreComercial || '',
      descripcion: ficha.descripcion || '',
      telefono: ficha.telefono || '',
      correo: ficha.correo || '',
      sitioWeb: ficha.sitioWeb || '',
      instagram: ficha.instagram || '',
      facebook: ficha.facebook || '',
    });
    setDireccion({
      calle: ficha.direccion?.calle || '',
      numero: ficha.direccion?.numero || '',
      comuna: ficha.direccion?.comuna || '',
      region: ficha.direccion?.region || '',
      latitud: ficha.direccion?.latitud ?? '',
      longitud: ficha.direccion?.longitud ?? '',
    });
    setHorarios(crearEstadoHorarios(ficha.horarios));
    setDisponibilidad(ficha.disponibilidad);
    setAtencion24Horas(Boolean(ficha.atencion24Horas));
    setAtiendeUrgencias(Boolean(ficha.atiendeUrgencias));
    setIdsServicio((ficha.servicios || []).map((item) => item.idServicio));
    setIdsEspecialidad((ficha.especialidades || []).map((item) => item.idEspecialidad));
    setIdsEspecie((ficha.especies || []).map((item) => item.idEspecie));
  }

  useEffect(() => {
    let cancelado = false;

    async function cargar() {
      try {
        const [ficha, servicios, especialidades, especies] = await Promise.all([
          api.obtener(),
          listarServicios(),
          listarEspecialidades(),
          listarEspecies(),
        ]);
        if (!cancelado) {
          aplicarVeterinaria(ficha);
          setServiciosCatalogo(servicios);
          setEspecialidadesCatalogo(especialidades);
          setEspeciesCatalogo(especies);
        }
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

    cargar();
    return () => {
      cancelado = true;
    };
  }, [api]);

  async function ejecutar(clave, accion) {
    setError('');
    setMensaje('');
    setEnviando(clave);

    try {
      const resultado = await accion();
      if (resultado?.idVeterinaria) {
        aplicarVeterinaria(resultado);
      } else if (clave === 'direccion' && resultado) {
        setVeterinaria((actual) => ({ ...actual, direccion: resultado }));
        setDireccion({
          calle: resultado.calle || '',
          numero: resultado.numero || '',
          comuna: resultado.comuna || '',
          region: resultado.region || '',
          latitud: resultado.latitud ?? '',
          longitud: resultado.longitud ?? '',
        });
      } else {
        aplicarVeterinaria(await api.obtener());
      }
      setMensaje('Los cambios se guardaron correctamente.');
    } catch (err) {
      setError(err.message);
    } finally {
      setEnviando('');
    }
  }

  async function guardarInmediatamente(clave, persistir, restaurar) {
    if (autoguardandoRef.current) {
      return;
    }

    autoguardandoRef.current = true;
    setError('');
    setMensaje('');
    setAutoguardado(clave);

    try {
      const resultado = await persistir();
      if (resultado?.idVeterinaria) {
        if (clave === 'disponibilidad') {
          setVeterinaria((actual) => ({
            ...actual,
            disponibilidad: resultado.disponibilidad,
          }));
          setDisponibilidad(resultado.disponibilidad);
        } else if (clave === 'servicios') {
          setVeterinaria((actual) => ({ ...actual, servicios: resultado.servicios || [] }));
          setIdsServicio((resultado.servicios || []).map((item) => item.idServicio));
        } else if (clave === 'especialidades') {
          setVeterinaria((actual) => ({ ...actual, especialidades: resultado.especialidades || [] }));
          setIdsEspecialidad((resultado.especialidades || []).map((item) => item.idEspecialidad));
        } else if (clave === 'especies') {
          setVeterinaria((actual) => ({ ...actual, especies: resultado.especies || [] }));
          setIdsEspecie((resultado.especies || []).map((item) => item.idEspecie));
        } else if (clave === 'atencion') {
          setVeterinaria((actual) => ({
            ...actual,
            atencion24Horas: resultado.atencion24Horas,
            atiendeUrgencias: resultado.atiendeUrgencias,
          }));
          setAtencion24Horas(Boolean(resultado.atencion24Horas));
          setAtiendeUrgencias(Boolean(resultado.atiendeUrgencias));
        }
      }
      setAutoguardado(`${clave}-ok`);
    } catch (err) {
      restaurar();
      setError(err.message);
      setAutoguardado('');
    } finally {
      autoguardandoRef.current = false;
    }
  }

  function textoAutoguardado(clave) {
    if (autoguardado === clave) {
      return 'Guardando...';
    }

    if (autoguardado === `${clave}-ok`) {
      return 'Guardado';
    }

    return '';
  }

  if (cargando) {
    return <p className="pagina-estado">Cargando veterinaria...</p>;
  }

  if (!veterinaria) {
    return (
      <main className="pagina">
        <p className="mensaje-error">{error || 'No se encontró la veterinaria.'}</p>
      </main>
    );
  }

  return (
    <main className="pagina pagina--ancha pagina-admin-veterinaria">
      <header className="pagina-cabecera">
        <h1>{titulo}</h1>
      </header>

      {navExtra}

      <div className="pestanas-ficha" role="tablist" aria-label="Secciones de la veterinaria">
        {pestanas.map((pestana) => {
          const activa = pestanaActiva === pestana.id;

          return (
            <button
              key={pestana.id}
              type="button"
              role="tab"
              id={`pestana-${pestana.id}`}
              aria-selected={activa}
              aria-controls={`panel-${pestana.id}`}
              tabIndex={0}
              className={`pestanas-ficha__tab${activa ? ' pestanas-ficha__tab--activa' : ''}`}
              onClick={() => setPestanaActiva(pestana.id)}
            >
              {pestana.etiqueta}
            </button>
          );
        })}
      </div>

      {error ? <p className="mensaje-error">{error}</p> : null}
      {mensaje ? <p className="mensaje-exito">{mensaje}</p> : null}

      <section
        id="panel-general"
        role="tabpanel"
        aria-labelledby="pestana-general"
        hidden={pestanaActiva !== 'general'}
        className="bloque-formulario"
      >
        <h2>General</h2>
        <div className="resumen-operativo">
          <article className="resumen-operativo__tarjeta">
            <h3>Estado de registro</h3>
            <span className={`pildora-estado pildora-estado--${veterinaria.estadoRegistro}`}>
              {textoEstadoRegistro(veterinaria.estadoRegistro)}
            </span>
          </article>
          <article className="resumen-operativo__tarjeta">
            <h3>Estado actual</h3>
            <span className={veterinaria.estaAbierta ? 'estado-abierta' : 'estado-cerrada'}>
              {veterinaria.estaAbierta ? 'Abierta' : 'Cerrada'}
            </span>
          </article>
          <article className="resumen-operativo__tarjeta">
            <h3>Disponibilidad actual</h3>
            <span className={`pildora-estado pildora-disponibilidad pildora-disponibilidad--${veterinaria.disponibilidad}`}>
              {textoDisponibilidad(veterinaria.disponibilidad)}
            </span>
          </article>
        </div>
        <p className="ayuda-campo">
          El estado Abierta/Cerrada se calcula a partir de los horarios y de la atención 24 horas.
        </p>

        <div className="formulario formulario-disponibilidad">
          <div className="cabecera-autoguardado">
            <h3>Actualizar disponibilidad</h3>
            {textoAutoguardado('disponibilidad') ? (
              <p className="ayuda-campo estado-autoguardado" aria-live="polite">
                {textoAutoguardado('disponibilidad')}
              </p>
            ) : null}
          </div>
          <p className="ayuda-campo">
            La disponibilidad la informa la veterinaria; no reemplaza Abierta/Cerrada.
          </p>
          <div className="grupo-pildoras-disponibilidad" role="group" aria-label="Disponibilidad">
            {OPCIONES_DISPONIBILIDAD.map((opcion) => (
              <button
                key={opcion}
                type="button"
                className={`filtro-pildora pildora-disponibilidad pildora-disponibilidad--${opcion}${disponibilidad === opcion ? ' filtro-pildora--activa' : ''}`}
                aria-pressed={disponibilidad === opcion}
                disabled={autoguardado === 'disponibilidad'}
                onClick={() => {
                  if (opcion === disponibilidad || autoguardado === 'disponibilidad') {
                    return;
                  }

                  const anterior = disponibilidad;
                  setDisponibilidad(opcion);
                  guardarInmediatamente(
                    'disponibilidad',
                    () => api.actualizarDisponibilidad(opcion),
                    () => setDisponibilidad(anterior)
                  );
                }}
              >
                {textoDisponibilidad(opcion)}
              </button>
            ))}
          </div>
        </div>
        {veterinaria.estadoRegistro === 'APROBADA' ? (
          <p>
            <Link to={`/veterinarias/${veterinaria.idVeterinaria}`}>Ver ficha pública</Link>
          </p>
        ) : null}
        {accionesEstado
          ? accionesEstado(veterinaria, {
            enviando: Boolean(enviando),
            recargar: async () => aplicarVeterinaria(await api.obtener()),
            setError,
            setMensaje,
            setEnviando,
          })
          : null}

        <form
          className="formulario formulario-datos-generales"
          onSubmit={(evento) => {
            evento.preventDefault();
            ejecutar('datos', () => api.actualizarDatosGenerales(generales));
          }}
        >
          <h3>Datos generales</h3>
          <label htmlFor="nombreComercial">Nombre comercial</label>
          <input
            id="nombreComercial"
            value={generales.nombreComercial}
            onChange={(evento) => setGenerales({ ...generales, nombreComercial: evento.target.value })}
            required
            maxLength={150}
          />
          <label htmlFor="descripcion">Descripción</label>
          <textarea
            id="descripcion"
            rows="4"
            value={generales.descripcion}
            onChange={(evento) => setGenerales({ ...generales, descripcion: evento.target.value })}
          />
          <div className="grupo-campos grupo-campos--dos">
            <div>
              <label htmlFor="telefono">Teléfono</label>
              <input
                id="telefono"
                value={generales.telefono}
                onChange={(evento) => setGenerales({ ...generales, telefono: evento.target.value })}
                required
                maxLength={20}
              />
            </div>
            <div>
              <label htmlFor="correoVeterinaria">Correo</label>
              <input
                id="correoVeterinaria"
                type="email"
                value={generales.correo}
                onChange={(evento) => setGenerales({ ...generales, correo: evento.target.value })}
                required
              />
            </div>
          </div>
          <label htmlFor="sitioWeb">Sitio web (opcional)</label>
          <input
            id="sitioWeb"
            value={generales.sitioWeb}
            onChange={(evento) => setGenerales({ ...generales, sitioWeb: evento.target.value })}
          />
          <label htmlFor="instagram">Instagram (opcional)</label>
          <input
            id="instagram"
            value={generales.instagram}
            onChange={(evento) => setGenerales({ ...generales, instagram: evento.target.value })}
          />
          <label htmlFor="facebook">Facebook (opcional)</label>
          <input
            id="facebook"
            value={generales.facebook}
            onChange={(evento) => setGenerales({ ...generales, facebook: evento.target.value })}
          />
          <button type="submit" className="boton-contorno boton-pill" disabled={Boolean(enviando)}>
            {enviando === 'datos' ? 'Guardando...' : 'Guardar datos'}
          </button>
        </form>
      </section>

      <form
        id="panel-direccion"
        role="tabpanel"
        aria-labelledby="pestana-direccion"
        hidden={pestanaActiva !== 'direccion'}
        className="bloque-formulario formulario"
        onSubmit={(evento) => {
          evento.preventDefault();
          ejecutar('direccion', () => api.actualizarDireccion({
            ...direccion,
            latitud: direccion.latitud === '' ? null : Number(direccion.latitud),
            longitud: direccion.longitud === '' ? null : Number(direccion.longitud),
          }));
        }}
      >
        <h2>Dirección</h2>
        <label htmlFor="calle">Calle</label>
        <input
          id="calle"
          value={direccion.calle}
          onChange={(evento) => setDireccion({ ...direccion, calle: evento.target.value })}
          required
        />
        <div className="grupo-campos grupo-campos--dos">
          <div>
            <label htmlFor="numero">Número</label>
            <input
              id="numero"
              value={direccion.numero}
              onChange={(evento) => setDireccion({ ...direccion, numero: evento.target.value })}
              required
            />
          </div>
          <div>
            <label htmlFor="comuna">Comuna</label>
            <input
              id="comuna"
              value={direccion.comuna}
              onChange={(evento) => setDireccion({ ...direccion, comuna: evento.target.value })}
              required
            />
          </div>
        </div>
        <label htmlFor="region">Región</label>
        <input
          id="region"
          value={direccion.region}
          onChange={(evento) => setDireccion({ ...direccion, region: evento.target.value })}
          required
        />
        <div className="grupo-campos grupo-campos--dos">
          <div>
            <label htmlFor="latitud">Latitud (opcional)</label>
            <input
              id="latitud"
              value={direccion.latitud}
              onChange={(evento) => setDireccion({ ...direccion, latitud: evento.target.value })}
            />
          </div>
          <div>
            <label htmlFor="longitud">Longitud (opcional)</label>
            <input
              id="longitud"
              value={direccion.longitud}
              onChange={(evento) => setDireccion({ ...direccion, longitud: evento.target.value })}
            />
          </div>
        </div>
        <button type="submit" className="boton-contorno boton-pill" disabled={Boolean(enviando)}>
          {enviando === 'direccion' ? 'Guardando...' : 'Guardar dirección'}
        </button>
      </form>

      <section
        id="panel-fotografias"
        role="tabpanel"
        aria-labelledby="pestana-fotografias"
        hidden={pestanaActiva !== 'fotografias'}
        className="bloque-formulario"
      >
        <h2>Fotografías</h2>
        <GestorFotografiasVeterinaria
          fotografias={veterinaria.fotografias || []}
          enviando={Boolean(enviando)}
          onSubir={(archivo) => ejecutar('fotografias', () => api.subirFotografiaVeterinaria(archivo))}
          onReemplazar={(id, archivo) => ejecutar('fotografias', () => api.reemplazarFotografiaVeterinaria(id, archivo))}
          onEliminar={(id) => ejecutar('fotografias', () => api.eliminarFotografiaVeterinaria(id))}
          onReordenar={(ids) => ejecutar('fotografias', () => api.reordenarFotografiasVeterinaria(ids))}
        />
      </section>

      <section
        id="panel-atencion"
        role="tabpanel"
        aria-labelledby="pestana-atencion"
        hidden={pestanaActiva !== 'atencion'}
        className="bloque-formulario"
      >
        <h2>Atención y horarios</h2>
        <div className="formulario">
          <div className="cabecera-autoguardado">
            <h3>Atención</h3>
            {textoAutoguardado('atencion') ? (
              <p className="ayuda-campo estado-autoguardado" aria-live="polite">
                {textoAutoguardado('atencion')}
              </p>
            ) : null}
          </div>
          <div className="grupo-atencion">
            <label className="campo-check">
              <input
                type="checkbox"
                checked={atencion24Horas}
                disabled={autoguardado === 'atencion'}
                onChange={(evento) => {
                  const siguiente = evento.target.checked;
                  const anterior = atencion24Horas;
                  setAtencion24Horas(siguiente);
                  guardarInmediatamente(
                    'atencion',
                    () => api.actualizarAtencion({ atencion24Horas: siguiente, atiendeUrgencias }),
                    () => setAtencion24Horas(anterior)
                  );
                }}
              />
              Atención 24 horas
            </label>
            <label className="campo-check">
              <input
                type="checkbox"
                checked={atiendeUrgencias}
                disabled={autoguardado === 'atencion'}
                onChange={(evento) => {
                  const siguiente = evento.target.checked;
                  const anterior = atiendeUrgencias;
                  setAtiendeUrgencias(siguiente);
                  guardarInmediatamente(
                    'atencion',
                    () => api.actualizarAtencion({ atencion24Horas, atiendeUrgencias: siguiente }),
                    () => setAtiendeUrgencias(anterior)
                  );
                }}
              />
              Atención de urgencias
            </label>
          </div>
        </div>
        <form
          className="formulario subbloque-formulario"
          onSubmit={(evento) => {
            evento.preventDefault();
            ejecutar('horarios', () => api.actualizarHorarios(armarHorariosParaEnviar(horarios)));
          }}
        >
          <h3>Horarios</h3>
          <FormularioHorarios
            dias={horarios}
            onCambiar={setHorarios}
            atencion24Horas={atencion24Horas}
          />
          <button type="submit" className="boton-contorno boton-pill" disabled={Boolean(enviando)}>
            {enviando === 'horarios' ? 'Guardando...' : 'Guardar horarios'}
          </button>
        </form>
      </section>

      <section
        id="panel-servicios"
        role="tabpanel"
        aria-labelledby="pestana-servicios"
        hidden={pestanaActiva !== 'servicios'}
        className="bloque-formulario"
      >
        <h2>Servicios</h2>
        <div className="formulario">
          <div className="cabecera-autoguardado">
            <h3>Servicios estándar</h3>
            {textoAutoguardado('servicios') ? (
              <p className="ayuda-campo estado-autoguardado" aria-live="polite">
                {textoAutoguardado('servicios')}
              </p>
            ) : null}
          </div>
          <SelectorCatalogo
            etiqueta="Servicios estándar"
            items={serviciosCatalogo}
            idsSeleccionados={idsServicio}
            claveId="idServicio"
            deshabilitado={autoguardado === 'servicios'}
            onCambiar={(siguientes) => {
              const anteriores = idsServicio;
              setIdsServicio(siguientes);
              guardarInmediatamente(
                'servicios',
                () => api.actualizarServicios(siguientes),
                () => setIdsServicio(anteriores)
              );
            }}
          />
        </div>

        <div className="servicios-personalizados">
          <h2>Servicios personalizados</h2>
          {(veterinaria.serviciosPersonalizados || []).length > 0 ? (
            <ul className="lista-servicio-personalizado">
              {(veterinaria.serviciosPersonalizados || []).map((servicio) => (
                <li key={servicio.idServicioPersonalizado}>
                  <div>
                    <p className="lista-servicio-personalizado__nombre">{servicio.nombre}</p>
                    {servicio.descripcion ? <p className="ayuda-campo">{servicio.descripcion}</p> : null}
                  </div>
                  <div className="acciones-formulario">
                    <button
                      type="button"
                      className="boton-contorno boton-compacto"
                      onClick={() => {
                        setIdEditandoPersonalizado(servicio.idServicioPersonalizado);
                        setPersonalizado({
                          nombre: servicio.nombre,
                          descripcion: servicio.descripcion || '',
                        });
                      }}
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      className="boton-destructivo-suave boton-compacto"
                      onClick={() => ejecutar('personalizado', () => api.eliminarServicioPersonalizado(servicio.idServicioPersonalizado))}
                    >
                      Eliminar
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="ayuda-campo">Aún no hay servicios personalizados.</p>
          )}
          <form
            className="formulario formulario-servicio-personalizado"
            onSubmit={(evento) => {
              evento.preventDefault();
              ejecutar('personalizado', async () => {
                if (idEditandoPersonalizado) {
                  await api.actualizarServicioPersonalizado(idEditandoPersonalizado, personalizado);
                } else {
                  await api.crearServicioPersonalizado(personalizado);
                }
                setPersonalizado({ nombre: '', descripcion: '' });
                setIdEditandoPersonalizado(null);
              });
            }}
          >
            <h3>{idEditandoPersonalizado ? 'Editar servicio personalizado' : 'Nuevo servicio personalizado'}</h3>
            <label htmlFor="nombrePersonalizado">Nombre</label>
            <input
              id="nombrePersonalizado"
              value={personalizado.nombre}
              onChange={(evento) => setPersonalizado({ ...personalizado, nombre: evento.target.value })}
              required
              maxLength={150}
            />
            <label htmlFor="descripcionPersonalizado">Descripción (opcional)</label>
            <textarea
              id="descripcionPersonalizado"
              rows="3"
              value={personalizado.descripcion}
              onChange={(evento) => setPersonalizado({ ...personalizado, descripcion: evento.target.value })}
            />
            <div className="acciones-formulario">
              <button type="submit" className="boton-contorno boton-pill" disabled={Boolean(enviando)}>
                {enviando === 'personalizado' ? 'Guardando...' : (idEditandoPersonalizado ? 'Guardar servicio' : 'Agregar servicio')}
              </button>
              {idEditandoPersonalizado ? (
                <button
                  type="button"
                  className="boton-contorno boton-pill"
                  onClick={() => {
                    setIdEditandoPersonalizado(null);
                    setPersonalizado({ nombre: '', descripcion: '' });
                  }}
                >
                  Cancelar
                </button>
              ) : null}
            </div>
          </form>
        </div>
      </section>

      <section
        id="panel-especialidades"
        role="tabpanel"
        aria-labelledby="pestana-especialidades"
        hidden={pestanaActiva !== 'especialidades'}
        className="bloque-formulario"
      >
        <h2>Especialidades</h2>
        <div className="formulario">
          {textoAutoguardado('especialidades') ? (
            <p className="ayuda-campo estado-autoguardado" aria-live="polite">
              {textoAutoguardado('especialidades')}
            </p>
          ) : null}
          <SelectorCatalogo
            etiqueta="Especialidades"
            className="selector-catalogo--ancho"
            items={especialidadesCatalogo}
            idsSeleccionados={idsEspecialidad}
            claveId="idEspecialidad"
            deshabilitado={autoguardado === 'especialidades'}
            onCambiar={(siguientes) => {
              const anteriores = idsEspecialidad;
              setIdsEspecialidad(siguientes);
              guardarInmediatamente(
                'especialidades',
                () => api.actualizarEspecialidades(siguientes),
                () => setIdsEspecialidad(anteriores)
              );
            }}
          />
        </div>
      </section>

      <section
        id="panel-especies"
        role="tabpanel"
        aria-labelledby="pestana-especies"
        hidden={pestanaActiva !== 'especies'}
        className="bloque-formulario"
      >
        <h2>Especies atendidas</h2>
        <div className="formulario">
          {textoAutoguardado('especies') ? (
            <p className="ayuda-campo estado-autoguardado" aria-live="polite">
              {textoAutoguardado('especies')}
            </p>
          ) : null}
          <SelectorCatalogo
            etiqueta="Especies atendidas"
            className="selector-catalogo--holgado"
            items={especiesCatalogo}
            idsSeleccionados={idsEspecie}
            claveId="idEspecie"
            deshabilitado={autoguardado === 'especies'}
            onCambiar={(siguientes) => {
              const anteriores = idsEspecie;
              setIdsEspecie(siguientes);
              guardarInmediatamente(
                'especies',
                () => api.actualizarEspecies(siguientes),
                () => setIdsEspecie(anteriores)
              );
            }}
          />
        </div>
      </section>

      {mostrarValoraciones ? (
        <section
          id="panel-valoraciones"
          role="tabpanel"
          aria-labelledby="pestana-valoraciones"
          hidden={pestanaActiva !== 'valoraciones'}
          className="bloque-formulario"
        >
          <ValoracionesAdminPanel />
        </section>
      ) : null}
    </main>
  );
}

export default GestionFichaVeterinaria;
