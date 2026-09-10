import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';

function RutaInvitado({ children }) {
  const { usuario, cargando } = useAuth();

  if (cargando) {
    return <p className="pagina-estado">Cargando sesión...</p>;
  }

  if (usuario) {
    return <Navigate to="/perfil" replace />;
  }

  return children;
}

export default RutaInvitado;
