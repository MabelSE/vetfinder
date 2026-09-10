const PALETA_AVATAR = [
  '#1e8aa8',
  '#2a6f8f',
  '#3d6b7a',
  '#3f7a4a',
  '#5a7a32',
  '#5a5d8a',
  '#7a4e6a',
  '#8a5a38',
  '#4a6e6a',
  '#3d5a7a',
];

export const EVENTO_COLOR_AVATAR = 'vetfinder-color-avatar';

function claveColorAvatar(idUsuario) {
  return `vetfinder.color-avatar.${idUsuario}`;
}

function colorDesdeTexto(texto) {
  let hash = 0;

  for (let indice = 0; indice < texto.length; indice += 1) {
    hash = texto.charCodeAt(indice) + ((hash << 5) - hash);
  }

  const tono = Math.abs(hash) % 360;
  return `hsl(${tono} 35% 38%)`;
}

export function obtenerColorAvatar(usuario) {
  const idUsuario = usuario?.idUsuario;

  if (idUsuario != null && typeof localStorage !== 'undefined') {
    const guardado = localStorage.getItem(claveColorAvatar(idUsuario));
    if (guardado && PALETA_AVATAR.includes(guardado)) {
      return guardado;
    }
  }

  return colorDesdeTexto(`${usuario?.idUsuario}-${usuario?.nombre}-${usuario?.apellido}`);
}

export function siguienteColorAvatar(actual) {
  const opciones = PALETA_AVATAR.filter((color) => color.toLowerCase() !== String(actual || '').toLowerCase());
  const lista = opciones.length > 0 ? opciones : PALETA_AVATAR;
  return lista[Math.floor(Math.random() * lista.length)];
}

export function guardarColorAvatar(idUsuario, color) {
  if (idUsuario == null || typeof localStorage === 'undefined') {
    return;
  }

  localStorage.setItem(claveColorAvatar(idUsuario), color);
  window.dispatchEvent(new CustomEvent(EVENTO_COLOR_AVATAR, {
    detail: { idUsuario, color },
  }));
}
