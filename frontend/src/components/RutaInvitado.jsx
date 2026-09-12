import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import { destinoTrasAutenticacion } from '../utils/navegacion.js';

function RutaInvitado({ children }) {
  const { usuario, cargando } = useAuth();

  if (cargando) {
    return <p className="pagina-estado">Cargando sesión...</p>;
  }

  if (usuario) {
    return <Navigate to={destinoTrasAutenticacion(usuario.rol)} replace />;
  }

  return children;
}

export default RutaInvitado;
