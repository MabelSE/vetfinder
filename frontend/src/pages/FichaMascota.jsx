import { useCallback, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import CampoFotografia from '../components/CampoFotografia.jsx';
import SeleccionSeccionesPdf from '../components/SeleccionSeccionesPdf.jsx';
import {
  actualizarAlergia,
  actualizarComprobanteVacuna,
  actualizarEnfermedad,
  actualizarMascota,
  actualizarVacuna,
  crearAlergia,
  crearEnfermedad,
  crearVacuna,
  eliminarComprobanteVacuna,
  eliminarAlergia,
  eliminarEnfermedad,
  eliminarMascota,
  eliminarVacuna,
  exportarPdfMascota,
  listarAlergias,
  listarEnfermedades,
  listarVacunas,
  obtenerMascota,
} from '../services/mascotaService.js';

function textoSexo(sexo) {
  if (sexo === 'MACHO') {
    return 'Macho';
  }

  if (sexo === 'HEMBRA') {
    return 'Hembra';
  }

  return 'Sin especificar';
}

const VACUNA_VACIA = {
  nombre: '',
  fechaAplicacion: '',
  proximaFecha: '',
  fotografiaComprobante: '',
  observacion: '',
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

function fechaParaInput(valor) {
  if (!valor) {
    return '';
  }

  const iso = String(valor).slice(0, 10);
  return /^\d{4}-\d{2}-\d{2}$/.test(iso) ? iso : '';
}

function FichaMascota() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [mascota, setMascota] = useState(null);
  const [vacunas, setVacunas] = useState([]);
  const [enfermedades, setEnfermedades] = useState([]);
  const [alergias, setAlergias] = useState([]);
  const [antecedentes, setAntecedentes] = useState('');
  const [error, setError] = useState(location.state?.error || '');
  const [mensaje, setMensaje] = useState('');
  const [cargando, setCargando] = useState(true);
  const [vacunaForm, setVacunaForm] = useState(VACUNA_VACIA);
  const [archivoComprobante, setArchivoComprobante] = useState(null);
  const [quitarComprobante, setQuitarComprobante] = useState(false);
  const [idVacunaEditando, setIdVacunaEditando] = useState(null);
  const [enfermedadForm, setEnfermedadForm] = useState(ENFERMEDAD_VACIA);
  const [idEnfermedadEditando, setIdEnfermedadEditando] = useState(null);
  const [alergiaForm, setAlergiaForm] = useState(ALERGIA_VACIA);
  const [idAlergiaEditando, setIdAlergiaEditando] = useState(null);
  const [claveFormVacuna, setClaveFormVacuna] = useState(0);
  const [claveFormAlergia, setClaveFormAlergia] = useState(0);
  const [exportandoPdf, setExportandoPdf] = useState(false);
  const [errorPdf, setErrorPdf] = useState('');

  const cargar = useCallback(async () => {
    const [ficha, listaVacunas, listaEnfermedades, listaAlergias] = await Promise.all([
      obtenerMascota(id),
      listarVacunas(id),
      listarEnfermedades(id),
      listarAlergias(id),
    ]);
    setMascota(ficha);
    setAntecedentes(ficha.antecedentesRelevantes || '');
    setVacunas(listaVacunas);
    setEnfermedades(listaEnfermedades);
    setAlergias(listaAlergias);
  }, [id]);

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
  }, [cargar]);

  async function ejecutar(accion, exito) {
    setError('');
    setMensaje('');

    try {
      await accion();
      await cargar();
      if (exito) {
        setMensaje(exito);
      }
    } catch (err) {
      setError(err.message);
    }
  }

  async function guardarRegistroAntecedente({ evento, idEditando, datos, crear, actualizar, alExito, mensajeExito }) {
    evento.preventDefault();
    setError('');
    setMensaje('');

    try {
      if (idEditando) {
        await actualizar(idEditando, datos);
      } else {
        await crear(datos);
      }
      await cargar();
      alExito();
      setMensaje(mensajeExito);
    } catch (err) {
      setError(err.message);
    }
  }

  function reiniciarFormularioVacuna() {
    setVacunaForm(VACUNA_VACIA);
    setArchivoComprobante(null);
    setQuitarComprobante(false);
    setIdVacunaEditando(null);
    setClaveFormVacuna((actual) => actual + 1);
  }

  async function guardarVacuna(evento) {
    evento.preventDefault();
    const idEditando = idVacunaEditando;
    const datos = {
      nombre: vacunaForm.nombre.trim(),
      fechaAplicacion: vacunaForm.fechaAplicacion,
      proximaFecha: vacunaForm.proximaFecha || null,
      observacion: vacunaForm.observacion.trim() || null,
    };

    if (!datos.nombre || !datos.fechaAplicacion) {
      setError('Cada vacuna debe incluir nombre y fecha de aplicación.');
      return;
    }

    setError('');
    setMensaje('');

    try {
      if (idEditando) {
        await actualizarVacuna(id, idEditando, datos);

        if (archivoComprobante) {
          await actualizarComprobanteVacuna(id, idEditando, archivoComprobante);
        } else if (quitarComprobante) {
          await eliminarComprobanteVacuna(id, idEditando);
        }

        await cargar();
        reiniciarFormularioVacuna();
        setMensaje('Vacuna actualizada.');
        return;
      }

      const vacuna = await crearVacuna(id, datos);

      if (archivoComprobante) {
        try {
          await actualizarComprobanteVacuna(id, vacuna.idVacuna, archivoComprobante);
        } catch (err) {
          await cargar();
          reiniciarFormularioVacuna();
          setError(
            `La vacuna fue guardada, pero el comprobante no pudo cargarse. Puedes adjuntarlo más tarde. ${err.message}`
          );
          return;
        }
      }

      await cargar();
      reiniciarFormularioVacuna();
      setMensaje('Vacuna registrada.');
    } catch (err) {
      setError(err.message);
    }
  }

  async function guardarEnfermedad(evento) {
    evento.preventDefault();
    const idEditando = idEnfermedadEditando;
    const datos = {
      nombreDescripcion: enfermedadForm.nombreDescripcion.trim(),
      fechaDiagnostico: enfermedadForm.fechaDiagnostico || null,
      observacion: enfermedadForm.observacion.trim() || null,
    };

    if (!datos.nombreDescripcion) {
      setError('La enfermedad debe incluir una descripción.');
      return;
    }

    await guardarRegistroAntecedente({
      evento,
      idEditando,
      datos,
      crear: (cuerpo) => crearEnfermedad(id, cuerpo),
      actualizar: (idRegistro, cuerpo) => actualizarEnfermedad(id, idRegistro, cuerpo),
      alExito: () => {
        setEnfermedadForm(ENFERMEDAD_VACIA);
        setIdEnfermedadEditando(null);
      },
      mensajeExito: idEditando ? 'Enfermedad actualizada.' : 'Enfermedad registrada.',
    });
  }

  async function guardarAlergia(evento) {
    evento.preventDefault();
    const idEditando = idAlergiaEditando;
    const datos = {
      nombreDescripcion: alergiaForm.nombreDescripcion.trim(),
      observacion: alergiaForm.observacion.trim() || null,
    };

    if (!datos.nombreDescripcion) {
      setError('La alergia debe incluir una descripción.');
      return;
    }

    await guardarRegistroAntecedente({
      evento,
      idEditando,
      datos,
      crear: (cuerpo) => crearAlergia(id, cuerpo),
      actualizar: (idRegistro, cuerpo) => actualizarAlergia(id, idRegistro, cuerpo),
      alExito: () => {
        setAlergiaForm(ALERGIA_VACIA);
        setIdAlergiaEditando(null);
        setClaveFormAlergia((actual) => actual + 1);
      },
      mensajeExito: idEditando ? 'Alergia actualizada.' : 'Alergia registrada.',
    });
  }

  async function guardarAntecedentes(evento) {
    evento.preventDefault();
    await ejecutar(
      () => actualizarMascota(id, {
        nombre: mascota.nombre,
        idEspecie: mascota.idEspecie,
        raza: mascota.raza,
        sexo: mascota.sexo,
        fechaNacimiento: mascota.fechaNacimiento,
        peso: mascota.peso,
        poseeMicrochip: mascota.poseeMicrochip,
        numeroMicrochip: mascota.numeroMicrochip,
        antecedentesRelevantes: antecedentes.trim() || null,
      }),
      'Antecedentes actualizados.'
    );
  }

  async function manejarEliminarMascota() {
    const confirma = window.confirm(`¿Eliminar a ${mascota.nombre}? Esta acción no se puede deshacer.`);

    if (!confirma) {
      return;
    }

    setError('');
    setMensaje('');

    try {
      await eliminarMascota(id);
      navigate('/mascotas');
    } catch (err) {
      setError(err.message);
    }
  }

  async function manejarExportarPdf(secciones) {
    setError('');
    setErrorPdf('');
    setExportandoPdf(true);

    try {
      const { blob, nombreArchivo } = await exportarPdfMascota(id, secciones);
      const url = URL.createObjectURL(blob);
      const enlace = document.createElement('a');
      enlace.href = url;
      enlace.download = nombreArchivo;
      enlace.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      setErrorPdf(err.message);
    } finally {
      setExportandoPdf(false);
    }
  }

  if (cargando) {
    return <p className="pagina-estado">Cargando ficha...</p>;
  }

  if (!mascota) {
    return (
      <main className="pagina">
        <p className="mensaje-error">{error || 'No se encontró la mascota.'}</p>
        <Link to="/mascotas">Volver a mis mascotas</Link>
      </main>
    );
  }

  return (
    <main className="pagina pagina--ancha">
      <p>
        <Link to="/mascotas">Volver a mis mascotas</Link>
      </p>
      <div className="pagina-cabecera">
        <div>
          <h1>{mascota.nombre}</h1>
          <p>
            {mascota.nombreEspecie}
            {mascota.raza ? ` · ${mascota.raza}` : ''} · {textoSexo(mascota.sexo)}
          </p>
        </div>
        <div className="acciones">
          <Link className="boton-contorno" to={`/mascotas/${mascota.idMascota}/editar`}>
            Editar
          </Link>
          <button type="button" className="boton-peligro" onClick={manejarEliminarMascota}>
            Eliminar
          </button>
        </div>
      </div>

      <section className="ficha-mascota-resumen">
        {mascota.fotografia ? (
          <img className="foto-mascota" src={mascota.fotografia} alt={`Fotografía de ${mascota.nombre}`} />
        ) : (
          <div className="foto-mascota foto-mascota--vacia" aria-hidden="true">Sin fotografía</div>
        )}
        <dl className="ficha-datos">
          <div>
            <dt>Fecha de nacimiento</dt>
            <dd>{mascota.fechaNacimiento || 'No registrada'}</dd>
          </div>
          <div>
            <dt>Peso</dt>
            <dd>{mascota.peso ? `${mascota.peso} kg` : 'No registrado'}</dd>
          </div>
          <div>
            <dt>Microchip</dt>
            <dd>
              {mascota.poseeMicrochip ? mascota.numeroMicrochip : 'No posee microchip'}
            </dd>
          </div>
        </dl>
      </section>

      {error ? <p className="mensaje-error">{error}</p> : null}
      {mensaje ? <p className="mensaje-exito">{mensaje}</p> : null}

      <section className="seccion">
        <h2>Exportar ficha PDF</h2>
        <p className="aviso">
          Esta ficha es informativa. No constituye una ficha clínica oficial ni está validada por un
          veterinario.
        </p>
        <SeleccionSeccionesPdf
          onExportar={manejarExportarPdf}
          enviando={exportandoPdf}
          error={errorPdf}
        />
      </section>

      <section className="seccion">
        <h2>Antecedentes relevantes</h2>
        <p className="aviso">
          Estos antecedentes son informativos. No constituyen una ficha clínica oficial ni están
          validados por un veterinario.
        </p>
        <form className="formulario" onSubmit={guardarAntecedentes}>
          <textarea
            rows="4"
            value={antecedentes}
            onChange={(evento) => setAntecedentes(evento.target.value)}
            aria-label="Antecedentes relevantes"
          />
          <button type="submit">Guardar antecedentes</button>
        </form>
      </section>

      <section className="seccion">
        <h2>Vacunas</h2>
        <ul className="lista-simple lista-antecedente">
          {vacunas.map((vacuna) => (
            <li key={vacuna.idVacuna}>
              <div className="lista-antecedente__datos">
                <strong>{vacuna.nombre}</strong>
                <span> · Aplicada: {vacuna.fechaAplicacion}</span>
                {vacuna.proximaFecha ? <span> · Próxima: {vacuna.proximaFecha}</span> : null}
                {vacuna.fotografiaComprobante ? (
                  <span> · Comprobante adjunto</span>
                ) : null}
              </div>
              <div className="lista-antecedente__acciones">
                <button
                  type="button"
                  className="boton-contorno boton-compacto"
                  onClick={() => {
                    setIdVacunaEditando(vacuna.idVacuna);
                    setVacunaForm({
                      nombre: vacuna.nombre,
                      fechaAplicacion: fechaParaInput(vacuna.fechaAplicacion),
                      proximaFecha: fechaParaInput(vacuna.proximaFecha),
                      fotografiaComprobante: vacuna.fotografiaComprobante || '',
                      observacion: vacuna.observacion || '',
                    });
                    setArchivoComprobante(null);
                    setQuitarComprobante(false);
                    setError('');
                  }}
                >
                  Editar
                </button>
                <button
                  type="button"
                  className="boton-destructivo-suave boton-compacto"
                  onClick={() => ejecutar(() => eliminarVacuna(id, vacuna.idVacuna))}
                >
                  Eliminar
                </button>
              </div>
            </li>
          ))}
        </ul>
        <form
          key={`${idVacunaEditando || 'crear-vacuna'}-${claveFormVacuna}`}
          className="formulario"
          onSubmit={guardarVacuna}
        >
          <h3>{idVacunaEditando ? 'Editar vacuna' : 'Nueva vacuna'}</h3>
          <label htmlFor="vacunaNombre">Nombre</label>
          <input
            id="vacunaNombre"
            value={vacunaForm.nombre}
            onChange={(evento) => setVacunaForm({ ...vacunaForm, nombre: evento.target.value })}
            required
            maxLength={150}
          />
          <label htmlFor="vacunaFecha">Fecha de aplicación</label>
          <input
            id="vacunaFecha"
            type="date"
            value={vacunaForm.fechaAplicacion}
            onChange={(evento) => setVacunaForm({ ...vacunaForm, fechaAplicacion: evento.target.value })}
            required
          />
          <label htmlFor="vacunaProxima">Próxima fecha (opcional)</label>
          <input
            id="vacunaProxima"
            type="date"
            value={vacunaForm.proximaFecha}
            onChange={(evento) => setVacunaForm({ ...vacunaForm, proximaFecha: evento.target.value })}
          />
          <p className="ayuda-campo">Comprobante (opcional)</p>
          <CampoFotografia
            id="comprobanteVacuna"
            urlActual={vacunaForm.fotografiaComprobante}
            archivo={archivoComprobante}
            eliminarFotografia={quitarComprobante}
            textoSubir="Subir comprobante"
            textoQuitar="Quitar comprobante"
            onArchivo={(archivo, errorArchivo) => {
              setArchivoComprobante(archivo);
              setQuitarComprobante(false);
              setError(errorArchivo);
            }}
            onEliminar={() => {
              setError('');
              if (archivoComprobante) {
                setArchivoComprobante(null);
                return;
              }
              setQuitarComprobante(Boolean(vacunaForm.fotografiaComprobante));
            }}
          />
          <label htmlFor="vacunaObs">Observación (opcional)</label>
          <textarea
            id="vacunaObs"
            value={vacunaForm.observacion}
            onChange={(evento) => setVacunaForm({ ...vacunaForm, observacion: evento.target.value })}
          />
          <div className="acciones-formulario">
            <button type="submit" className="boton-contorno boton-pill">
              {idVacunaEditando ? 'Guardar cambios' : 'Agregar vacuna'}
            </button>
            {idVacunaEditando ? (
              <button
                type="button"
                className="boton-contorno boton-pill"
                onClick={() => {
                  reiniciarFormularioVacuna();
                  setError('');
                }}
              >
                Cancelar
              </button>
            ) : null}
          </div>
        </form>
      </section>

      <section className="seccion">
        <h2>Enfermedades</h2>
        <ul className="lista-simple lista-antecedente">
          {enfermedades.map((enfermedad) => (
            <li key={enfermedad.idEnfermedad}>
              <div className="lista-antecedente__datos">
                <strong>{enfermedad.nombreDescripcion}</strong>
                {enfermedad.fechaDiagnostico ? <span> · {enfermedad.fechaDiagnostico}</span> : null}
              </div>
              <div className="lista-antecedente__acciones">
                <button
                  type="button"
                  className="boton-contorno boton-compacto"
                  onClick={() => {
                    setIdEnfermedadEditando(enfermedad.idEnfermedad);
                    setEnfermedadForm({
                      nombreDescripcion: enfermedad.nombreDescripcion,
                      fechaDiagnostico: fechaParaInput(enfermedad.fechaDiagnostico),
                      observacion: enfermedad.observacion || '',
                    });
                    setError('');
                  }}
                >
                  Editar
                </button>
                <button
                  type="button"
                  className="boton-destructivo-suave boton-compacto"
                  onClick={() => ejecutar(() => eliminarEnfermedad(id, enfermedad.idEnfermedad))}
                >
                  Eliminar
                </button>
              </div>
            </li>
          ))}
        </ul>
        <form key={idEnfermedadEditando || 'crear-enfermedad'} className="formulario" onSubmit={guardarEnfermedad}>
          <h3>{idEnfermedadEditando ? 'Editar enfermedad' : 'Nueva enfermedad'}</h3>
          <label htmlFor="enfDesc">Descripción</label>
          <input
            id="enfDesc"
            value={enfermedadForm.nombreDescripcion}
            onChange={(evento) => setEnfermedadForm({ ...enfermedadForm, nombreDescripcion: evento.target.value })}
            required
            maxLength={200}
          />
          <label htmlFor="enfFecha">Fecha de diagnóstico (opcional)</label>
          <input
            id="enfFecha"
            type="date"
            value={enfermedadForm.fechaDiagnostico}
            onChange={(evento) => setEnfermedadForm({ ...enfermedadForm, fechaDiagnostico: evento.target.value })}
          />
          <label htmlFor="enfObs">Observación (opcional)</label>
          <textarea
            id="enfObs"
            value={enfermedadForm.observacion}
            onChange={(evento) => setEnfermedadForm({ ...enfermedadForm, observacion: evento.target.value })}
          />
          <div className="acciones-formulario">
            <button type="submit" className="boton-contorno boton-pill">
              {idEnfermedadEditando ? 'Guardar cambios' : 'Agregar enfermedad'}
            </button>
            {idEnfermedadEditando ? (
              <button
                type="button"
                className="boton-contorno boton-pill"
                onClick={() => {
                  setEnfermedadForm(ENFERMEDAD_VACIA);
                  setIdEnfermedadEditando(null);
                  setError('');
                }}
              >
                Cancelar
              </button>
            ) : null}
          </div>
        </form>
      </section>

      <section className="seccion">
        <h2>Alergias</h2>
        <ul className="lista-simple lista-antecedente">
          {alergias.map((alergia) => (
            <li key={alergia.idAlergia} className="item-antecedente">
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
                    setIdAlergiaEditando(alergia.idAlergia);
                    setAlergiaForm({
                      nombreDescripcion: alergia.nombreDescripcion,
                      observacion: alergia.observacion || '',
                    });
                    setError('');
                  }}
                >
                  Editar
                </button>
                <button
                  type="button"
                  className="boton-destructivo-suave boton-compacto"
                  onClick={() => ejecutar(() => eliminarAlergia(id, alergia.idAlergia))}
                >
                  Eliminar
                </button>
              </div>
            </li>
          ))}
        </ul>
        <form key={`${idAlergiaEditando || 'crear-alergia'}-${claveFormAlergia}`} className="formulario" onSubmit={guardarAlergia}>
          <h3>{idAlergiaEditando ? 'Editar alergia' : 'Nueva alergia'}</h3>
          <label htmlFor="alDesc">Descripción</label>
          <input
            id="alDesc"
            value={alergiaForm.nombreDescripcion}
            onChange={(evento) => setAlergiaForm({ ...alergiaForm, nombreDescripcion: evento.target.value })}
            required
            maxLength={200}
          />
          <label htmlFor="alObs">Observación (opcional)</label>
          <textarea
            id="alObs"
            value={alergiaForm.observacion}
            onChange={(evento) => setAlergiaForm({ ...alergiaForm, observacion: evento.target.value })}
          />
          <div className="acciones-formulario">
            <button type="submit" className="boton-contorno boton-pill">
              {idAlergiaEditando ? 'Guardar cambios' : 'Agregar alergia'}
            </button>
            {idAlergiaEditando ? (
              <button
                type="button"
                className="boton-contorno boton-pill"
                onClick={() => {
                  setAlergiaForm(ALERGIA_VACIA);
                  setIdAlergiaEditando(null);
                  setError('');
                }}
              >
                Cancelar
              </button>
            ) : null}
          </div>
        </form>
      </section>
    </main>
  );
}

export default FichaMascota;
