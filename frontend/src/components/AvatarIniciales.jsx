import { useEffect, useState } from 'react';
import { EVENTO_COLOR_AVATAR, obtenerColorAvatar } from '../utils/colorAvatar.js';

function obtenerIniciales(usuario) {
  const nombre = usuario?.nombre?.trim()?.charAt(0) || '';
  const apellido = usuario?.apellido?.trim()?.charAt(0) || '';
  return `${nombre}${apellido}`.toUpperCase() || '?';
}

function AvatarIniciales({ usuario, compacto = false, grande = false }) {
  const [color, setColor] = useState(() => obtenerColorAvatar(usuario));

  useEffect(() => {
    setColor(obtenerColorAvatar(usuario));

    function actualizar(evento) {
      if (String(evento.detail?.idUsuario) === String(usuario?.idUsuario)) {
        setColor(evento.detail.color);
      }
    }

    window.addEventListener(EVENTO_COLOR_AVATAR, actualizar);
    return () => window.removeEventListener(EVENTO_COLOR_AVATAR, actualizar);
  }, [usuario]);

  if (!usuario) {
    return null;
  }

  const iniciales = obtenerIniciales(usuario);
  const claseTamano = compacto ? ' avatar-iniciales--compacto' : grande ? ' avatar-iniciales--grande' : '';

  return (
    <span
      className={`avatar-iniciales${claseTamano}`}
      style={{ backgroundColor: color }}
      aria-hidden="true"
    >
      {iniciales}
    </span>
  );
}

export default AvatarIniciales;
