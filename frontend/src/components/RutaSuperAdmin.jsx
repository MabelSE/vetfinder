import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';

function RutaSuperAdmin({ children }) {
  const { usuario, cargando } = useAuth();

  if (cargando) {
    return <p className="pagina-estado">Cargando sesión...</p>;
  }

  if (!usuario) {
    return <Navigate to="/iniciar-sesion" replace />;
  }

  if (usuario.rol !== 'SUPERADMIN') {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default RutaSuperAdmin;
