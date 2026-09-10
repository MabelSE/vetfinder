import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import FiltroPildoras from '../components/FiltroPildoras.jsx';
import SuperadminNav from '../components/SuperadminNav.jsx';
import { listarVeterinariasAdministracion } from '../services/superadminService.js';
import { textoDisponibilidad, textoEstadoRegistro } from '../utils/veterinaria.js';

const FILTROS_REGISTRO = [
  { valor: '', etiqueta: 'Todas' },
  { valor: 'PENDIENTE', etiqueta: 'Pendientes' },
  { valor: 'APROBADA', etiqueta: 'Aprobadas' },
  { valor: 'RECHAZADA', etiqueta: 'Rechazadas' },
];

function SuperadminVeterinarias() {
  const [veterinarias, setVeterinarias] = useState([]);
  const [filtro, setFiltro] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    let cancelado = false;

    async function cargar() {
      setCargando(true);
      setError('');
      try {
        const lista = await listarVeterinariasAdministracion(filtro || undefined);
        if (!cancelado) {
          setVeterinarias(lista);
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
  }, [filtro]);

  return (
    <main className="pagina pagina--ancha pagina-admin-veterinaria">
      <header className="pagina-cabecera">
        <h1>Veterinarias</h1>
      </header>
      <SuperadminNav />
      <FiltroPildoras
        etiqueta="Estado de registro"
        valor={filtro}
        opciones={FILTROS_REGISTRO}
        onCambiar={setFiltro}
      />
      {error ? <p className="mensaje-error">{error}</p> : null}
      {cargando ? <p>Cargando veterinarias...</p> : null}
      {!cargando && veterinarias.length === 0 ? (
        <p>No hay veterinarias para este filtro.</p>
      ) : (
        <ul className="lista-admin">
          {veterinarias.map((veterinaria) => (
            <li key={veterinaria.idVeterinaria} className="tarjeta tarjeta-admin tarjeta-admin--veterinaria">
              <div className="tarjeta-admin__titulo">
                <h2>{veterinaria.nombreComercial}</h2>
                <span className={`pildora-estado pildora-estado--${veterinaria.estadoRegistro}`}>
                  {textoEstadoRegistro(veterinaria.estadoRegistro)}
                </span>
              </div>
              <div className="tarjeta-admin__cuerpo">
                <p className="ayuda-campo tarjeta-admin__meta">
                  {textoDisponibilidad(veterinaria.disponibilidad)}
                  {veterinaria.atiendeUrgencias ? ' · Urgencias' : ''}
                  {veterinaria.atencion24Horas ? ' · 24 horas' : ''}
                </p>
              </div>
              <div className="tarjeta-admin__acciones">
                <Link
                  className="boton-contorno boton-pill"
                  to={`/superadmin/veterinarias/${veterinaria.idVeterinaria}`}
                >
                  Gestionar
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

export default SuperadminVeterinarias;
