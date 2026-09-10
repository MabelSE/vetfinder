import { NavLink } from 'react-router-dom';

function SuperadminNav() {
  return (
    <nav className="anclas-admin" aria-label="Panel SuperAdmin">
      <NavLink to="/superadmin" end>Panel</NavLink>
      <NavLink to="/superadmin/solicitudes">Solicitudes</NavLink>
      <NavLink to="/superadmin/veterinarias">Veterinarias</NavLink>
      <NavLink to="/superadmin/usuarios">Usuarios</NavLink>
      <NavLink to="/superadmin/reportes">Reportes</NavLink>
    </nav>
  );
}

export default SuperadminNav;
