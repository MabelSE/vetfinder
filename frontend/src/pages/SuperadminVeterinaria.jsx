import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import GestionFichaVeterinaria from '../components/GestionFichaVeterinaria.jsx';
import SuperadminNav from '../components/SuperadminNav.jsx';
import {
  aprobarVeterinaria,
  crearApiVeterinariaAdministracion,
  eliminarVeterinariaAdministracion,
  rechazarVeterinaria,
} from '../services/superadminService.js';

function SuperadminVeterinaria() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [confirmarEliminar, setConfirmarEliminar] = useState(false);
  const api = useMemo(() => crearApiVeterinariaAdministracion(id), [id]);

  return (
    <GestionFichaVeterinaria
      titulo="Gestionar veterinaria"
      api={api}
      navExtra={<SuperadminNav />}
      accionesEstado={(veterinaria, { enviando, recargar, setError, setMensaje, setEnviando }) => (
        <div className="acciones-formulario">
          {veterinaria.estadoRegistro !== 'APROBADA' ? (
            <button
              type="button"
              className="boton-primario boton-pill"
              disabled={enviando}
              onClick={async () => {
                setError('');
                setMensaje('');
                setEnviando('aprobacion');
                try {
                  await aprobarVeterinaria(veterinaria.idVeterinaria);
                  await recargar();
                  setMensaje('La veterinaria quedó aprobada.');
                } catch (err) {
                  setError(err.message);
                } finally {
                  setEnviando('');
                }
              }}
            >
              Aprobar
            </button>
          ) : null}
          {veterinaria.estadoRegistro !== 'RECHAZADA' ? (
            <button
              type="button"
              className="boton-destructivo-suave boton-pill"
              disabled={enviando}
              onClick={async () => {
                setError('');
                setMensaje('');
                setEnviando('rechazo');
                try {
                  await rechazarVeterinaria(veterinaria.idVeterinaria);
                  await recargar();
                  setMensaje('La veterinaria quedó rechazada.');
                } catch (err) {
                  setError(err.message);
                } finally {
                  setEnviando('');
                }
              }}
            >
              Rechazar
            </button>
          ) : null}
          {confirmarEliminar ? (
            <>
              <p className="ayuda-campo">Si hay visitas, la eliminación se rechazará. La cuenta administradora quedará inactiva.</p>
              <button
                type="button"
                className="boton-peligro"
                disabled={enviando}
                onClick={async () => {
                  setError('');
                  setMensaje('');
                  setEnviando('eliminar');
                  try {
                    await eliminarVeterinariaAdministracion(veterinaria.idVeterinaria);
                    navigate('/superadmin/veterinarias', { replace: true });
                  } catch (err) {
                    setError(err.message);
                    setConfirmarEliminar(false);
                  } finally {
                    setEnviando('');
                  }
                }}
              >
                Confirmar eliminación
              </button>
              <button
                type="button"
                className="boton-contorno"
                onClick={() => setConfirmarEliminar(false)}
              >
                Cancelar
              </button>
            </>
          ) : (
            <button
              type="button"
              className="boton-peligro"
              disabled={enviando}
              onClick={() => setConfirmarEliminar(true)}
            >
              Eliminar veterinaria
            </button>
          )}
        </div>
      )}
    />
  );
}

export default SuperadminVeterinaria;
