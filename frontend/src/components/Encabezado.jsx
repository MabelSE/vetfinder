import { useLayoutEffect, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import { enlacesFuncionalesPorRol } from '../utils/navegacion.js';
import MenuCuenta from './MenuCuenta.jsx';
import logoHorizontal from '../assets/Logo_horizontal_VetFinder.png';
import logoCuadrado from '../assets/Logo_VetFinder_SinTexto.png';

function Encabezado() {
  const { usuario } = useAuth();
  const cabeceraRef = useRef(null);
  const medidaRef = useRef(null);
  const accesoRef = useRef(null);
  const [compacta, setCompacta] = useState(false);
  const enlaces = usuario
    ? enlacesFuncionalesPorRol(usuario.rol)
    : [{ to: '/veterinarias', etiqueta: 'Veterinarias' }];

  useLayoutEffect(() => {
    const cabecera = cabeceraRef.current;
    const medida = medidaRef.current;
    if (!cabecera || !medida) {
      return undefined;
    }

    function medir() {
      const marca = cabecera.querySelector('.encabezado__marca');
      const acceso = accesoRef.current;
      if (!marca) {
        return;
      }

      const estilos = getComputedStyle(cabecera);
      const gap = Number.parseFloat(estilos.columnGap || estilos.gap) || 12;
      const padding = (Number.parseFloat(estilos.paddingLeft) || 0)
        + (Number.parseFloat(estilos.paddingRight) || 0);
      const disponible = cabecera.clientWidth
        - padding
        - marca.offsetWidth
        - (acceso?.offsetWidth || 0)
        - (gap * 2);
      setCompacta(medida.scrollWidth > disponible + 1);
    }

    const observer = new ResizeObserver(medir);
    observer.observe(cabecera);
    medir();

    return () => observer.disconnect();
  }, [enlaces.length, usuario]);

  return (
    <header className={`encabezado${compacta ? ' encabezado--compacto' : ''}`} ref={cabeceraRef}>
      <NavLink to="/veterinarias" className="encabezado__marca">
        <picture>
          <source media="(max-width: 519px)" srcSet={logoCuadrado} />
          <img
            src={logoHorizontal}
            alt="VetFinder"
            className="encabezado__logo"
          />
        </picture>
      </NavLink>
      <div className="encabezado__medida" ref={medidaRef} aria-hidden="true">
        {enlaces.map((enlace) => (
          <span key={enlace.to}>{enlace.etiqueta}</span>
        ))}
      </div>
      <nav className="encabezado__nav" aria-label="Principal">
        <div className="encabezado__enlaces">
          {compacta ? null : enlaces.map((enlace) => (
            <NavLink key={enlace.to} to={enlace.to} end={enlace.to === '/superadmin'}>
              {enlace.etiqueta}
            </NavLink>
          ))}
        </div>
        <div className="encabezado__acceso" ref={accesoRef}>
          {usuario ? (
            <MenuCuenta
              enlacesFuncionales={enlaces}
              incluirNavegacion={compacta}
            />
          ) : (
            <NavLink to="/iniciar-sesion">Ingresar / Registrarse</NavLink>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Encabezado;
