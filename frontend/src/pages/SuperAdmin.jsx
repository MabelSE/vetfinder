import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import IconoResumen from '../components/IconoResumen.jsx';
import SuperadminNav from '../components/SuperadminNav.jsx';
import { obtenerResumenAdministracion } from '../services/superadminService.js';

function SuperAdmin() {
  const [resumen, setResumen] = useState(null);
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    let cancelado = false;

    async function cargar() {
      try {
        const datos = await obtenerResumenAdministracion();
        if (!cancelado) {
          setResumen(datos);
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
  }, []);

  if (cargando) {
    return <p className="pagina-estado">Cargando panel...</p>;
  }

  return (
    <main className="pagina pagina--ancha pagina-admin-veterinaria">
      <header className="pagina-cabecera">
        <h1>Panel SuperAdmin</h1>
      </header>
      <SuperadminNav />
      {error ? <p className="mensaje-error">{error}</p> : null}
      {resumen ? (
        <ul className="resumen-admin">
          <li>
            <Link to="/superadmin/solicitudes">
              <span className="resumen-admin__icono">
                <IconoResumen tipo="solicitudes" />
              </span>
              <strong>{resumen.solicitudesPendientes}</strong>
              <span>Solicitudes pendientes</span>
            </Link>
          </li>
          <li>
            <Link to="/superadmin/reportes">
              <span className="resumen-admin__icono">
                <IconoResumen tipo="reportes" />
              </span>
              <strong>{resumen.reportesPendientes}</strong>
              <span>Reportes pendientes</span>
            </Link>
          </li>
          <li>
            <Link to="/superadmin/veterinarias">
              <span className="resumen-admin__icono">
                <IconoResumen tipo="veterinarias" />
              </span>
              <strong>{resumen.veterinariasAprobadas}</strong>
              <span>Veterinarias aprobadas</span>
            </Link>
          </li>
          <li>
            <Link to="/superadmin/veterinarias">
              <span className="resumen-admin__icono">
                <IconoResumen tipo="rechazadas" />
              </span>
              <strong>{resumen.veterinariasRechazadas}</strong>
              <span>Veterinarias rechazadas</span>
            </Link>
          </li>
          <li>
            <Link to="/superadmin/usuarios">
              <span className="resumen-admin__icono">
                <IconoResumen tipo="usuarios" />
              </span>
              <strong>{resumen.usuariosInactivos}</strong>
              <span>Cuentas inactivas</span>
            </Link>
          </li>
        </ul>
      ) : null}
    </main>
  );
}

export default SuperAdmin;
