import { Link } from 'react-router-dom';

function debeMostrarFab(pathname) {
  return pathname === '/veterinarias' || pathname.startsWith('/veterinarias/');
}

function FabUrgencia({ pathname }) {
  if (!debeMostrarFab(pathname)) {
    return null;
  }

  return (
    <Link to="/urgencia" className="fab-urgencia">
      Urgencia
    </Link>
  );
}

export default FabUrgencia;
