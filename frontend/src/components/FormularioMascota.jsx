import { useEffect, useState } from 'react';
import { listarEspecies } from '../services/especieService.js';
import CampoFotografia from './CampoFotografia.jsx';

const VALORES_INICIALES = {
  nombre: '',
  idEspecie: '',
  raza: '',
  sexo: '',
  fechaNacimiento: '',
  peso: '',
  fotografia: '',
  poseeMicrochip: false,
  numeroMicrochip: '',
  antecedentesRelevantes: '',
};

const ENFERMEDAD_VACIA = {
  nombreDescripcion: '',
  fechaDiagnostico: '',
  observacion: '',
};

const ALERGIA_VACIA = {
  nombreDescripcion: '',
  observacion: '',
};

const VACUNA_VACIA = {
  nombre: '',
  fechaAplicacion: '',
  proximaFecha: '',
  archivoComprobante: null,
  observacion: '',
};

function FormularioMascota({
  valoresIniciales,
  onGuardar,
  onCancelar,
  textoBoton,
  enviando,
  error,
  incluirSalud = false,
  esEdicion = false,
}) {
  const [especies, setEspecies] = useState([]);
  const [valores, setValores] = useState({ ...VALORES_INICIALES, ...valoresIniciales });
  const [archivoFotografia, setArchivoFotografia] = useState(null);
  const [eliminarFotografia, setEliminarFotografia] = useState(false);
  const [enfermedades, setEnfermedades] = useState([{ ...ENFERMEDAD_VACIA }]);
  const [alergias, setAlergias] = useState([]);
  const [alergiaForm, setAlergiaForm] = useState({ ...ALERGIA_VACIA });
  const [indiceAlergiaEditando, setIndiceAlergiaEditando] = useState(null);
  const [claveFormAlergia, setClaveFormAlergia] = useState(0);
  const [vacunas, setVacunas] = useState([{ ...VACUNA_VACIA }]);
  const [errorLocal, setErrorLocal] = useState('');

  useEffect(() => {
    setValores({ ...VALORES_INICIALES, ...valoresIniciales });
    setArchivoFotografia(null);
    setEliminarFotografia(false);
  }, [valoresIniciales]);

  useEffect(() => {
    let cancelado = false;

    async function cargarEspecies() {
      try {
        const lista = await listarEspecies();
        if (!cancelado) {
          setEspecies(lista);
        }
      } catch {
        if (!cancelado) {
          setEspecies([]);
        }
      }
    }

    cargarEspecies();

    return () => {
      cancelado = true;
    };
  }, []);

  function actualizarCampo(campo, valor) {
    setValores((actual) => ({ ...actual, [campo]: valor }));
  }

  function actualizarLista(setter, indice, campo, valor) {
    setter((actual) => actual.map((item, actualIndice) => (
      actualIndice === indice ? { ...item, [campo]: valor } : item
    )));
  }

  function enfermedadesListas() {
    return enfermedades
      .map((item) => ({
        nombreDescripcion: item.nombreDescripcion.trim(),
        fechaDiagnostico: item.fechaDiagnostico || null,
        observacion: item.observacion.trim() || null,
      }))
      .filter((item) => item.nombreDescripcion);
  }

  function alergiasListas() {
    return alergias
      .map((item) => ({
        nombreDescripcion: item.nombreDescripcion.trim(),
        observacion: item.observacion.trim() || null,
      }))
      .filter((item) => item.nombreDescripcion);
  }

  function vacunasListas() {
    return vacunas
      .map((item) => ({
        nombre: item.nombre.trim(),
        fechaAplicacion: item.fechaAplicacion,
        proximaFecha: item.proximaFecha || null,
        observacion: item.observacion.trim() || null,
        archivoComprobante: item.archivoComprobante || null,
      }))
      .filter((item) => item.nombre || item.fechaAplicacion);
  }

  function manejarEnvio(evento) {
    evento.preventDefault();
    setErrorLocal('');

    if (valores.poseeMicrochip && !valores.numeroMicrochip.trim()) {
      setErrorLocal('Debe indicar el número de microchip.');
      return;
    }

    if (valores.peso !== '' && Number(valores.peso) <= 0) {
      setErrorLocal('El peso debe ser mayor que 0.');
      return;
    }

    const vacunasIncompletas = vacunasListas().some((item) => !item.nombre || !item.fechaAplicacion);
    if (vacunasIncompletas) {
      setErrorLocal('Cada vacuna debe incluir nombre y fecha de aplicación.');
      return;
    }

    onGuardar({
      datos: {
        nombre: valores.nombre.trim(),
        idEspecie: Number(valores.idEspecie),
        raza: valores.raza.trim() || null,
        sexo: valores.sexo || null,
        fechaNacimiento: valores.fechaNacimiento || null,
        peso: valores.peso === '' ? null : Number(valores.peso),
        poseeMicrochip: Boolean(valores.poseeMicrochip),
        numeroMicrochip: valores.poseeMicrochip ? valores.numeroMicrochip.trim() : null,
        antecedentesRelevantes: valores.antecedentesRelevantes.trim() || null,
      },
      archivoFotografia,
      eliminarFotografia,
      salud: incluirSalud
        ? {
          enfermedades: enfermedadesListas(),
          alergias: alergiasListas(),
          vacunas: vacunasListas(),
        }
        : { enfermedades: [], alergias: [], vacunas: [] },
    });
  }

  const claseAccion = esEdicion ? 'boton-contorno' : 'boton-primario';
  const claseCancelar = esEdicion ? 'boton-contorno' : 'boton-secundario';

  return (
    <form className="formulario formulario-mascota" onSubmit={manejarEnvio}>
      <section className="bloque-formulario">
        <h2>Datos generales</h2>
        <div className="bloque-formulario__cuerpo">
          <label htmlFor="nombre">Nombre</label>
          <input
            id="nombre"
            value={valores.nombre}
            onChange={(evento) => actualizarCampo('nombre', evento.target.value)}
            required
            maxLength={100}
          />

          <label htmlFor="idEspecie">Especie</label>
          <select
            id="idEspecie"
            value={valores.idEspecie}
            onChange={(evento) => actualizarCampo('idEspecie', evento.target.value)}
            required
          >
            <option value="">Seleccione una especie</option>
            {especies.map((especie) => (
              <option key={especie.idEspecie} value={especie.idEspecie}>
                {especie.nombre}
              </option>
            ))}
          </select>

          <div className="grupo-campos grupo-campos--dos">
            <div>
              <label htmlFor="raza">Raza (opcional)</label>
              <input
                id="raza"
                value={valores.raza}
                onChange={(evento) => actualizarCampo('raza', evento.target.value)}
                maxLength={100}
              />
            </div>
            <div>
              <span>Sexo (opcional)</span>
              <div className="grupo-opciones grupo-opciones--par">
                <button
                  type="button"
                  className={valores.sexo === 'MACHO' ? 'opcion-activa' : ''}
                  onClick={() => actualizarCampo('sexo', valores.sexo === 'MACHO' ? '' : 'MACHO')}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <circle cx="10" cy="14" r="5" />
                    <path d="M14 10l6-6M16 4h4v4" />
                  </svg>
                  Macho
                </button>
                <button
                  type="button"
                  className={valores.sexo === 'HEMBRA' ? 'opcion-activa' : ''}
                  onClick={() => actualizarCampo('sexo', valores.sexo === 'HEMBRA' ? '' : 'HEMBRA')}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <circle cx="12" cy="9" r="5" />
                    <path d="M12 14v7M9 18h6" />
                  </svg>
                  Hembra
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="ficha-mascota-resumen ficha-mascota-resumen--formulario">
          <CampoFotografia
            urlActual={valores.fotografia}
            archivo={archivoFotografia}
            eliminarFotografia={eliminarFotografia}
            onArchivo={(archivo, errorArchivo) => {
              setArchivoFotografia(archivo);
              setEliminarFotografia(false);
              setErrorLocal(errorArchivo);
            }}
            onEliminar={() => {
              setErrorLocal('');
              if (archivoFotografia) {
                setArchivoFotografia(null);
                return;
              }
              setEliminarFotografia(Boolean(valores.fotografia));
            }}
          />
          <div className="ficha-mascota-resumen__datos">
            <label htmlFor="fechaNacimiento">Fecha de nacimiento (opcional)</label>
            <input
              id="fechaNacimiento"
              type="date"
              value={valores.fechaNacimiento}
              onChange={(evento) => actualizarCampo('fechaNacimiento', evento.target.value)}
            />
            <label htmlFor="peso">Peso en kg (opcional)</label>
            <input
              id="peso"
              type="number"
              min="0.01"
              step="0.01"
              placeholder="Ej: 4,5"
              value={valores.peso}
              onChange={(evento) => actualizarCampo('peso', evento.target.value)}
            />
            <span>¿Tiene microchip?</span>
            <div className="grupo-opciones grupo-opciones--par">
              <button
                type="button"
                className={valores.poseeMicrochip ? 'opcion-activa' : ''}
                onClick={() => setValores((actual) => ({ ...actual, poseeMicrochip: true }))}
              >
                Sí
              </button>
              <button
                type="button"
                className={!valores.poseeMicrochip ? 'opcion-activa' : ''}
                onClick={() => setValores((actual) => ({
                  ...actual,
                  poseeMicrochip: false,
                  numeroMicrochip: '',
                }))}
              >
                No
              </button>
            </div>
            {valores.poseeMicrochip ? (
              <>
                <label htmlFor="numeroMicrochip">Número de microchip</label>
                <input
                  id="numeroMicrochip"
                  value={valores.numeroMicrochip}
                  onChange={(evento) => actualizarCampo('numeroMicrochip', evento.target.value)}
                  required
                  maxLength={50}
                />
              </>
            ) : null}
          </div>
        </div>
      </section>

      {incluirSalud ? (
        <>
          <section className="bloque-formulario">
            <h2>Salud</h2>
            <div className="bloque-formulario__cuerpo">
              <label htmlFor="antecedentesRelevantes">Antecedentes relevantes (opcional)</label>
              <textarea
                id="antecedentesRelevantes"
                rows="4"
                placeholder="Cirugías, tratamientos, hospitalizaciones..."
                value={valores.antecedentesRelevantes}
                onChange={(evento) => actualizarCampo('antecedentesRelevantes', evento.target.value)}
              />

              <h3>Enfermedades</h3>
              {enfermedades.map((enfermedad, indice) => (
                <div key={`enfermedad-${indice}`} className="subbloque-formulario">
                  <div className="grupo-campos grupo-campos--dos">
                    <div>
                      <label htmlFor={`enfermedadDesc-${indice}`}>Descripción</label>
                      <input
                        id={`enfermedadDesc-${indice}`}
                        value={enfermedad.nombreDescripcion}
                        onChange={(evento) => actualizarLista(setEnfermedades, indice, 'nombreDescripcion', evento.target.value)}
                        maxLength={200}
                        placeholder="Diagnósticos actuales o crónicos..."
                      />
                    </div>
                    <div>
                      <label htmlFor={`enfermedadFecha-${indice}`}>Fecha de diagnóstico (opcional)</label>
                      <input
                        id={`enfermedadFecha-${indice}`}
                        type="date"
                        value={enfermedad.fechaDiagnostico}
                        onChange={(evento) => actualizarLista(setEnfermedades, indice, 'fechaDiagnostico', evento.target.value)}
                      />
                    </div>
                  </div>
                  <label htmlFor={`enfermedadObs-${indice}`}>Observación (opcional)</label>
                  <input
                    id={`enfermedadObs-${indice}`}
                    value={enfermedad.observacion}
                    onChange={(evento) => actualizarLista(setEnfermedades, indice, 'observacion', evento.target.value)}
                  />
                </div>
              ))}
              <button
                type="button"
                className="boton-contorno"
                onClick={() => setEnfermedades((actual) => [...actual, { ...ENFERMEDAD_VACIA }])}
              >
                + Agregar enfermedad
              </button>

              <h3>Alergias</h3>
              {alergias.length > 0 ? (
                <ul className="lista-simple lista-antecedente">
                  {alergias.map((alergia, indice) => (
                    <li key={`alergia-${indice}`} className="item-antecedente">
                      <div className="lista-antecedente__datos item-antecedente__textos">
                        <span className="item-antecedente__titulo">{alergia.nombreDescripcion}</span>
                        {alergia.observacion ? (
                          <span className="item-antecedente__detalle">{alergia.observacion}</span>
                        ) : null}
                      </div>
                      <div className="lista-antecedente__acciones">
                        <button
                          type="button"
                          className="boton-contorno boton-compacto"
                          onClick={() => {
                            setIndiceAlergiaEditando(indice);
                            setAlergiaForm({
                              nombreDescripcion: alergia.nombreDescripcion,
                              observacion: alergia.observacion || '',
                            });
                            setErrorLocal('');
                          }}
                        >
                          Editar
                        </button>
                        <button
                          type="button"
                          className="boton-destructivo-suave boton-compacto"
                          onClick={() => {
                            setAlergias((actual) => actual.filter((_, actualIndice) => actualIndice !== indice));
                            if (indiceAlergiaEditando === indice) {
                              setAlergiaForm({ ...ALERGIA_VACIA });
                              setIndiceAlergiaEditando(null);
                              setClaveFormAlergia((actual) => actual + 1);
                            } else if (indiceAlergiaEditando !== null && indiceAlergiaEditando > indice) {
                              setIndiceAlergiaEditando(indiceAlergiaEditando - 1);
                            }
                          }}
                        >
                          Eliminar
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : null}
              <div key={`form-alergia-${claveFormAlergia}`} className="subbloque-formulario">
                <p className="item-antecedente__form-titulo">
                  {indiceAlergiaEditando !== null ? 'Editar alergia' : 'Nueva alergia'}
                </p>
                <label htmlFor="alergiaDescNueva">Descripción</label>
                <input
                  id="alergiaDescNueva"
                  value={alergiaForm.nombreDescripcion}
                  onChange={(evento) => setAlergiaForm({
                    ...alergiaForm,
                    nombreDescripcion: evento.target.value,
                  })}
                  maxLength={200}
                  placeholder="Alimentos, medicamentos, ambientales..."
                />
                <label htmlFor="alergiaObsNueva">Observación (opcional)</label>
                <input
                  id="alergiaObsNueva"
                  value={alergiaForm.observacion}
                  onChange={(evento) => setAlergiaForm({
                    ...alergiaForm,
                    observacion: evento.target.value,
                  })}
                />
                <div className="acciones-formulario">
                  <button
                    type="button"
                    className="boton-contorno boton-pill"
                    onClick={() => {
                      const nombreDescripcion = alergiaForm.nombreDescripcion.trim();

                      if (!nombreDescripcion) {
                        setErrorLocal('La alergia debe incluir una descripción.');
                        return;
                      }

                      const registro = {
                        nombreDescripcion,
                        observacion: alergiaForm.observacion,
                      };

                      if (indiceAlergiaEditando !== null) {
                        setAlergias((actual) => actual.map((item, actualIndice) => (
                          actualIndice === indiceAlergiaEditando ? registro : item
                        )));
                      } else {
                        setAlergias((actual) => [...actual, registro]);
                      }

                      setAlergiaForm({ ...ALERGIA_VACIA });
                      setIndiceAlergiaEditando(null);
                      setClaveFormAlergia((actual) => actual + 1);
                      setErrorLocal('');
                    }}
                  >
                    {indiceAlergiaEditando !== null ? 'Guardar cambios' : 'Agregar alergia'}
                  </button>
                  {indiceAlergiaEditando !== null ? (
                    <button
                      type="button"
                      className="boton-contorno boton-pill"
                      onClick={() => {
                        setAlergiaForm({ ...ALERGIA_VACIA });
                        setIndiceAlergiaEditando(null);
                        setClaveFormAlergia((actual) => actual + 1);
                        setErrorLocal('');
                      }}
                    >
                      Cancelar
                    </button>
                  ) : null}
                </div>
              </div>
            </div>
          </section>

          <section className="bloque-formulario">
            <h2>Vacunas</h2>
            <div className="bloque-formulario__cuerpo">
              {vacunas.map((vacuna, indice) => (
                <div key={`vacuna-${indice}`} className="subbloque-formulario">
                  <div className="formulario-vacuna">
                    <div className="formulario-vacuna__principal">
                      <div>
                        <label htmlFor={`vacunaNombre-${indice}`}>Nombre de la vacuna</label>
                        <input
                          id={`vacunaNombre-${indice}`}
                          value={vacuna.nombre}
                          onChange={(evento) => actualizarLista(setVacunas, indice, 'nombre', evento.target.value)}
                          maxLength={150}
                        />
                      </div>
                      <div>
                        <span className="formulario-vacuna__etiqueta">Comprobante (opcional)</span>
                        <CampoFotografia
                          id={`comprobante-vacuna-${indice}`}
                          compacto
                          urlActual=""
                          archivo={vacuna.archivoComprobante}
                          eliminarFotografia={false}
                          textoSubir="Subir comprobante"
                          textoCambiar="Cambiar comprobante"
                          textoQuitar="Quitar comprobante"
                          onArchivo={(archivo, errorArchivo) => {
                            setErrorLocal(errorArchivo);
                            actualizarLista(setVacunas, indice, 'archivoComprobante', archivo);
                          }}
                          onEliminar={() => {
                            setErrorLocal('');
                            actualizarLista(setVacunas, indice, 'archivoComprobante', null);
                          }}
                        />
                      </div>
                    </div>
                    <div className="grupo-campos grupo-campos--dos">
                      <div>
                        <label htmlFor={`vacunaFecha-${indice}`}>Fecha de aplicación</label>
                        <input
                          id={`vacunaFecha-${indice}`}
                          type="date"
                          value={vacuna.fechaAplicacion}
                          onChange={(evento) => actualizarLista(setVacunas, indice, 'fechaAplicacion', evento.target.value)}
                        />
                      </div>
                      <div>
                        <label htmlFor={`vacunaProxima-${indice}`}>Próxima fecha (opcional)</label>
                        <input
                          id={`vacunaProxima-${indice}`}
                          type="date"
                          value={vacuna.proximaFecha}
                          onChange={(evento) => actualizarLista(setVacunas, indice, 'proximaFecha', evento.target.value)}
                        />
                      </div>
                    </div>
                    <label htmlFor={`vacunaObs-${indice}`}>Observación (opcional)</label>
                    <textarea
                      id={`vacunaObs-${indice}`}
                      rows="3"
                      value={vacuna.observacion}
                      onChange={(evento) => actualizarLista(setVacunas, indice, 'observacion', evento.target.value)}
                    />
                  </div>
                </div>
              ))}
              <button
                type="button"
                className="boton-contorno"
                onClick={() => setVacunas((actual) => [...actual, { ...VACUNA_VACIA }])}
              >
                + Agregar vacuna
              </button>
            </div>
          </section>
        </>
      ) : (
        <section className="bloque-formulario">
          <h2>Antecedentes relevantes</h2>
          <div className="bloque-formulario__cuerpo">
            <label htmlFor="antecedentesRelevantes">Antecedentes (opcional)</label>
            <textarea
              id="antecedentesRelevantes"
              rows="4"
              placeholder="Cirugías, tratamientos u otra información relevante..."
              value={valores.antecedentesRelevantes}
              onChange={(evento) => actualizarCampo('antecedentesRelevantes', evento.target.value)}
            />
          </div>
        </section>
      )}

      {errorLocal || error ? <p className="mensaje-error">{errorLocal || error}</p> : null}

      <div className="acciones-formulario">
        {onCancelar ? (
          <button type="button" className={claseCancelar} onClick={onCancelar}>
            Cancelar
          </button>
        ) : null}
        <button type="submit" className={claseAccion} disabled={enviando}>
          {enviando ? 'Guardando...' : textoBoton}
        </button>
      </div>
    </form>
  );
}

export default FormularioMascota;
