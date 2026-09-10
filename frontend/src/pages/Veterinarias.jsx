import { useEffect, useState } from 'react';
import FiltrosVeterinaria from '../components/FiltrosVeterinaria.jsx';
import VeterinariaCard from '../components/VeterinariaCard.jsx';
import { listarEspecies } from '../services/especieService.js';
import {
  listarEspecialidades,
  listarServicios,
  listarVeterinarias,
} from '../services/veterinariaService.js';

const FILTROS_VACIOS = {
  nombre: '',
  abiertasAhora: false,
  atencion24Horas: false,
  atiendeUrgencias: false,
  idEspecialidad: '',
  idEspecie: '',
  idServicio: '',
  mostrarMasFiltros: false,
};

function Veterinarias() {
  const [filtros, setFiltros] = useState(FILTROS_VACIOS);
  const [nombreDebounce, setNombreDebounce] = useState('');
  const [veterinarias, setVeterinarias] = useState([]);
  const [especies, setEspecies] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [especialidades, setEspecialidades] = useState([]);
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const temporizador = setTimeout(() => setNombreDebounce(filtros.nombre.trim()), 300);
    return () => clearTimeout(temporizador);
  }, [filtros.nombre]);

  useEffect(() => {
    let cancelado = false;

    async function cargarCatalogos() {
      try {
        const [listaEspecies, listaServicios, listaEspecialidades] = await Promise.all([
          listarEspecies(),
          listarServicios(),
          listarEspecialidades(),
        ]);
        if (!cancelado) {
          setEspecies(listaEspecies);
          setServicios(listaServicios);
          setEspecialidades(listaEspecialidades);
        }
      } catch (err) {
        if (!cancelado) {
          setError(err.message);
        }
      }
    }

    cargarCatalogos();
    return () => {
      cancelado = true;
    };
  }, []);

  useEffect(() => {
    let cancelado = false;

    async function cargar() {
      setCargando(true);
      setError('');

      try {
        const lista = await listarVeterinarias({
          nombre: nombreDebounce || undefined,
          abiertasAhora: filtros.abiertasAhora || undefined,
          atencion24Horas: filtros.atencion24Horas || undefined,
          atiendeUrgencias: filtros.atiendeUrgencias || undefined,
          idEspecialidad: filtros.idEspecialidad || undefined,
          idEspecie: filtros.idEspecie || undefined,
          idServicio: filtros.idServicio || undefined,
        });
        if (!cancelado) {
          setVeterinarias(lista);
        }
      } catch (err) {
        if (!cancelado) {
          setError(err.message);
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
  }, [nombreDebounce, filtros.abiertasAhora, filtros.atencion24Horas, filtros.atiendeUrgencias, filtros.idEspecialidad, filtros.idEspecie, filtros.idServicio]);

  function cambiarFiltro(campo, valor) {
    setFiltros((actual) => ({ ...actual, [campo]: valor }));
  }

  return (
    <main className="pagina pagina--ancha">
      <header className="hero-listado">
        <h1 className="hero-listado__titulo">
          <span>Atención inmediata</span>
          <span>para tus fieles compañeros.</span>
        </h1>
        <p>Consulta establecimientos aprobados en Osorno. La información es actualizada por la propia veterinaria.</p>
      </header>

      <FiltrosVeterinaria
        valores={filtros}
        especies={especies}
        servicios={servicios}
        especialidades={especialidades}
        onCambiar={cambiarFiltro}
        onBuscar={() => setNombreDebounce(filtros.nombre.trim())}
        onLimpiar={() => setFiltros(FILTROS_VACIOS)}
      />

      <div className="resultados-meta">
        <p>
          {cargando
            ? 'Cargando veterinarias...'
            : `Resultados: ${veterinarias.length} ${veterinarias.length === 1 ? 'veterinaria' : 'veterinarias'}`}
        </p>
      </div>
      {error ? <p className="mensaje-error">{error}</p> : null}
      {!cargando && veterinarias.length === 0 && !error ? (
        <p>No hay veterinarias que coincidan con la búsqueda o los filtros.</p>
      ) : null}

      <ul className="lista-tarjetas lista-veterinarias">
        {veterinarias.map((veterinaria) => (
          <VeterinariaCard key={veterinaria.idVeterinaria} veterinaria={veterinaria} />
        ))}
      </ul>
    </main>
  );
}

export default Veterinarias;
