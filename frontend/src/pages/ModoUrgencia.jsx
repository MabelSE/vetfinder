import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import VeterinariaCard from '../components/VeterinariaCard.jsx';
import { useGeolocalizacion } from '../hooks/useGeolocalizacion.js';
import { listarVeterinarias } from '../services/veterinariaService.js';
import { mensajeEstadoUrgencia, textoEstadoUbicacion } from '../utils/veterinaria.js';

function ModoUrgencia() {
  const { ubicacion, estado, error, solicitarUbicacion, olvidarUbicacion } = useGeolocalizacion();
  const [veterinarias, setVeterinarias] = useState([]);
  const [errorCarga, setErrorCarga] = useState('');
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    solicitarUbicacion();
  }, [solicitarUbicacion]);

  useEffect(() => {
    let cancelado = false;

    async function cargar() {
      setCargando(true);
      setErrorCarga('');

      try {
        const lista = await listarVeterinarias({
          modoUrgencia: true,
          lat: ubicacion?.lat,
          lng: ubicacion?.lng,
        });

        if (!cancelado) {
          setVeterinarias(lista);
        }
      } catch (err) {
        if (!cancelado) {
          setErrorCarga(err.message);
          setVeterinarias([]);
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
  }, [ubicacion]);

  const mensajeDegradado = mensajeEstadoUrgencia(veterinarias);
  const hayUbicacion = estado === 'disponible';

  return (
    <main className="pagina pagina--ancha">
      <header className="hero-listado">
        <h1>Atención de urgencia</h1>
        <p>Mostramos veterinarias priorizadas para atender ahora. El modo funciona con o sin ubicación.</p>
      </header>

      <p className={`urgencia-ubicacion urgencia-ubicacion--${estado}`}>
        Ubicación: <strong>{textoEstadoUbicacion(estado)}</strong>
      </p>
      {error ? <p className="ayuda-campo">{error}</p> : null}

      <div className="acciones urgencia-acciones">
        <button type="button" className="boton-primario" onClick={solicitarUbicacion}>
          Actualizar ubicación
        </button>
        <button type="button" className="boton-contorno" onClick={olvidarUbicacion}>
          Continuar sin ubicación
        </button>
      </div>

      <section className="seccion urgencia-prioridad">
        <h2>Prioridad aplicada</h2>
        <ul>
          <li>Abiertas ahora</li>
          <li>Atienden urgencias</li>
          <li>Disponibilidad, si está abierta</li>
          <li>{hayUbicacion ? 'Cercanía según tu ubicación' : 'Cercanía omitida (sin ubicación)'}</li>
        </ul>
      </section>

      <div className="resultados-meta">
        <p>
          {cargando
            ? 'Buscando veterinarias...'
            : `Resultados: ${veterinarias.length} ${veterinarias.length === 1 ? 'veterinaria' : 'veterinarias'}`}
        </p>
      </div>

      {mensajeDegradado && !cargando ? (
        <p className="aviso">{mensajeDegradado}</p>
      ) : null}
      {errorCarga ? <p className="mensaje-error">{errorCarga}</p> : null}

      {!cargando && veterinarias.length === 0 && !errorCarga ? (
        <p>No hay veterinarias publicadas en este momento.</p>
      ) : null}

      <ul className="lista-tarjetas lista-veterinarias">
        {veterinarias.map((veterinaria) => (
          <VeterinariaCard
            key={veterinaria.idVeterinaria}
            veterinaria={veterinaria}
            mostrarLlamar
          />
        ))}
      </ul>

      <p>
        <Link to="/veterinarias">Volver al listado</Link>
      </p>
    </main>
  );
}

export default ModoUrgencia;
