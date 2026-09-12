import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import Encabezado from './components/Encabezado.jsx';
import FabUrgencia from './components/FabUrgencia.jsx';
import RutaInvitado from './components/RutaInvitado.jsx';
import RutaProtegida from './components/RutaProtegida.jsx';
import IniciarSesion from './pages/IniciarSesion.jsx';
import Registro from './pages/Registro.jsx';
import RegistroVeterinaria from './pages/RegistroVeterinaria.jsx';
import Perfil from './pages/Perfil.jsx';
import Veterinarias from './pages/Veterinarias.jsx';
import FichaVeterinaria from './pages/FichaVeterinaria.jsx';
import ModoUrgencia from './pages/ModoUrgencia.jsx';
import MisMascotas from './pages/MisMascotas.jsx';
import MascotaFormulario from './pages/MascotaFormulario.jsx';
import FichaMascota from './pages/FichaMascota.jsx';
import RutaPropietario from './components/RutaPropietario.jsx';
import RutaAdminVeterinaria from './components/RutaAdminVeterinaria.jsx';
import Visitas from './pages/Visitas.jsx';
import ValoracionesVeterinaria from './pages/ValoracionesVeterinaria.jsx';
import MiVeterinaria from './pages/MiVeterinaria.jsx';
import RutaSuperAdmin from './components/RutaSuperAdmin.jsx';
import SuperAdmin from './pages/SuperAdmin.jsx';
import SuperadminSolicitudes from './pages/SuperadminSolicitudes.jsx';
import SuperadminVeterinarias from './pages/SuperadminVeterinarias.jsx';
import SuperadminVeterinaria from './pages/SuperadminVeterinaria.jsx';
import SuperadminUsuarios from './pages/SuperadminUsuarios.jsx';
import SuperadminReportes from './pages/SuperadminReportes.jsx';

function App() {
  const { pathname } = useLocation();

  return (
    <>
      <Encabezado />
      <Routes>
        <Route path="/" element={<Navigate to="/veterinarias" replace />} />
        <Route path="/veterinarias" element={<Veterinarias />} />
        <Route path="/veterinarias/:id" element={<FichaVeterinaria />} />
        <Route path="/urgencia" element={<ModoUrgencia />} />
        <Route
          path="/iniciar-sesion"
          element={
            <RutaInvitado>
              <IniciarSesion />
            </RutaInvitado>
          }
        />
        <Route
          path="/registro"
          element={
            <RutaInvitado>
              <Registro />
            </RutaInvitado>
          }
        />
        <Route
          path="/registro-veterinaria"
          element={
            <RutaInvitado>
              <RegistroVeterinaria />
            </RutaInvitado>
          }
        />
        <Route
          path="/perfil"
          element={
            <RutaProtegida>
              <Perfil />
            </RutaProtegida>
          }
        />
        <Route
          path="/mascotas"
          element={
            <RutaPropietario>
              <MisMascotas />
            </RutaPropietario>
          }
        />
        <Route
          path="/mascotas/nueva"
          element={
            <RutaPropietario>
              <MascotaFormulario />
            </RutaPropietario>
          }
        />
        <Route
          path="/mascotas/:id/editar"
          element={
            <RutaPropietario>
              <MascotaFormulario />
            </RutaPropietario>
          }
        />
        <Route
          path="/mascotas/:id"
          element={
            <RutaPropietario>
              <FichaMascota />
            </RutaPropietario>
          }
        />
        <Route
          path="/visitas"
          element={
            <RutaPropietario>
              <Visitas />
            </RutaPropietario>
          }
        />
        <Route
          path="/valoraciones"
          element={
            <RutaAdminVeterinaria>
              <ValoracionesVeterinaria />
            </RutaAdminVeterinaria>
          }
        />
        <Route
          path="/mi-veterinaria"
          element={
            <RutaAdminVeterinaria>
              <MiVeterinaria />
            </RutaAdminVeterinaria>
          }
        />
        <Route
          path="/superadmin"
          element={
            <RutaSuperAdmin>
              <SuperAdmin />
            </RutaSuperAdmin>
          }
        />
        <Route
          path="/superadmin/solicitudes"
          element={
            <RutaSuperAdmin>
              <SuperadminSolicitudes />
            </RutaSuperAdmin>
          }
        />
        <Route
          path="/superadmin/veterinarias"
          element={
            <RutaSuperAdmin>
              <SuperadminVeterinarias />
            </RutaSuperAdmin>
          }
        />
        <Route
          path="/superadmin/veterinarias/:id"
          element={
            <RutaSuperAdmin>
              <SuperadminVeterinaria />
            </RutaSuperAdmin>
          }
        />
        <Route
          path="/superadmin/usuarios"
          element={
            <RutaSuperAdmin>
              <SuperadminUsuarios />
            </RutaSuperAdmin>
          }
        />
        <Route
          path="/superadmin/reportes"
          element={
            <RutaSuperAdmin>
              <SuperadminReportes />
            </RutaSuperAdmin>
          }
        />
      </Routes>
      <FabUrgencia pathname={pathname} />
    </>
  );
}

export default App;
