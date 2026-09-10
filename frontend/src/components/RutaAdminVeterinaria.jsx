import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';

function RutaAdminVeterinaria({ children }) {
  const { usuario, cargando } = useAuth();

  if (cargando) {
    return <p className="pagina-estado">Cargando sesión...</p>;
  }

  if (!usuario) {
    return <Navigate to="/iniciar-sesion" replace />;
  }

  if (usuario.rol !== 'ADMIN_VETERINARIA') {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default RutaAdminVeterinaria;
