import { useEffect, useId, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import { textoNombreCorto } from '../utils/usuario.js';
import AvatarIniciales from './AvatarIniciales.jsx';

function MenuCuenta({ enlacesFuncionales = [], incluirNavegacion = false }) {
  const { usuario, cerrarSesion } = useAuth();
  const [abierto, setAbierto] = useState(false);
  const contenedorRef = useRef(null);
  const triggerRef = useRef(null);
  const idMenu = useId();

  useEffect(() => {
    if (!abierto) {
      return undefined;
    }

    function manejarPointer(evento) {
      if (!contenedorRef.current?.contains(evento.target)) {
        setAbierto(false);
      }
    }

    function manejarTecla(evento) {
      if (evento.key === 'Escape') {
        setAbierto(false);
        triggerRef.current?.focus();
      }
    }

    document.addEventListener('mousedown', manejarPointer);
    document.addEventListener('keydown', manejarTecla);

    return () => {
      document.removeEventListener('mousedown', manejarPointer);
      document.removeEventListener('keydown', manejarTecla);
    };
  }, [abierto]);

  if (!usuario) {
    return null;
  }

  async function manejarCierreSesion() {
    setAbierto(false);

    try {
      await cerrarSesion();
    } catch {
      // El cierre visual de sesión no debe bloquearse por un error de red.
    }
  }

  return (
    <div className="menu-cuenta" ref={contenedorRef}>
      <button
        ref={triggerRef}
        type="button"
        className="menu-cuenta__trigger"
        aria-expanded={abierto}
        aria-haspopup="menu"
        aria-controls={idMenu}
        onClick={() => setAbierto((actual) => !actual)}
      >
        <AvatarIniciales usuario={usuario} compacto />
        <span>{textoNombreCorto(usuario)}</span>
      </button>
      {abierto ? (
        <div className="menu-cuenta__lista" id={idMenu} role="menu">
          {incluirNavegacion
            ? enlacesFuncionales.map((opcion) => (
              <NavLink
                key={opcion.to}
                role="menuitem"
                to={opcion.to}
                end={opcion.to === '/superadmin'}
                onClick={() => setAbierto(false)}
              >
                {opcion.etiqueta}
              </NavLink>
            ))
            : null}
          {incluirNavegacion ? <div className="menu-cuenta__separador" role="separator" /> : null}
          <NavLink
            role="menuitem"
            to="/perfil"
            onClick={() => setAbierto(false)}
          >
            Mi perfil
          </NavLink>
          <div className="menu-cuenta__separador" role="separator" />
          <button
            type="button"
            role="menuitem"
            className="menu-cuenta__salida"
            onClick={manejarCierreSesion}
          >
            Cerrar sesión
          </button>
        </div>
      ) : null}
    </div>
  );
}

export default MenuCuenta;
