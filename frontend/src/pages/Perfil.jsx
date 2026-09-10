import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth.js';
import AvatarIniciales from '../components/AvatarIniciales.jsx';
import { guardarColorAvatar, obtenerColorAvatar, siguienteColorAvatar } from '../utils/colorAvatar.js';
import { textoNombreCorto } from '../utils/usuario.js';
import { textoRol } from '../utils/veterinaria.js';

function Perfil() {
  const { usuario, actualizarPerfil } = useAuth();
  const [nombre, setNombre] = useState(usuario?.nombre || '');
  const [apellido, setApellido] = useState(usuario?.apellido || '');
  const [correo, setCorreo] = useState(usuario?.correo || '');
  const [telefono, setTelefono] = useState(usuario?.telefono || '');
  const [error, setError] = useState('');
  const [exito, setExito] = useState('');
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    setNombre(usuario?.nombre || '');
    setApellido(usuario?.apellido || '');
    setCorreo(usuario?.correo || '');
    setTelefono(usuario?.telefono || '');
  }, [usuario]);

  async function manejarEnvio(evento) {
    evento.preventDefault();
    setError('');
    setExito('');
    setEnviando(true);

    try {
      await actualizarPerfil({
        nombre,
        apellido,
        correo,
        telefono,
      });
      setExito('Los datos personales se actualizaron correctamente.');
    } catch (err) {
      setError(err.message);
    } finally {
      setEnviando(false);
    }
  }

  function cambiarColorAvatar() {
    if (usuario?.idUsuario == null) {
      return;
    }

    const siguiente = siguienteColorAvatar(obtenerColorAvatar(usuario));
    guardarColorAvatar(usuario.idUsuario, siguiente);
  }

  return (
    <main className="pagina pagina-perfil">
      <section className="tarjeta tarjeta-perfil">
        <aside className="tarjeta-perfil__identidad">
          <h1>Mi perfil</h1>
          <div className="tarjeta-perfil__avatar">
            <AvatarIniciales usuario={usuario} grande />
            <button
              type="button"
              className="boton-color-avatar"
              aria-label="Cambiar color del avatar"
              onClick={cambiarColorAvatar}
            />
          </div>
          <p className="perfil-nombre">{textoNombreCorto(usuario)}</p>
          <span className="pildora-estado pildora-rol">{textoRol(usuario?.rol)}</span>
          <p className="ayuda-campo tarjeta-perfil__ayuda">
            Mantén tus datos personales actualizados para una mejor experiencia en VetFinder.
          </p>
        </aside>

        <div className="tarjeta-perfil__datos">
          <h2 className="tarjeta-perfil__titulo-datos">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="12" cy="8" r="3.2" />
              <path d="M5.5 19c.6-3.1 3-5 6.5-5s5.9 1.9 6.5 5" />
            </svg>
            Datos personales
          </h2>

          <form className="formulario formulario-perfil" onSubmit={manejarEnvio}>
            <div className="grupo-campos grupo-campos--dos">
              <div>
                <label htmlFor="nombre">Nombre</label>
                <input
                  id="nombre"
                  name="nombre"
                  value={nombre}
                  onChange={(evento) => setNombre(evento.target.value)}
                  required
                  maxLength={100}
                />
              </div>
              <div>
                <label htmlFor="apellido">Apellido</label>
                <input
                  id="apellido"
                  name="apellido"
                  value={apellido}
                  onChange={(evento) => setApellido(evento.target.value)}
                  required
                  maxLength={100}
                />
              </div>
            </div>

            <label htmlFor="correo">Correo</label>
            <input
              id="correo"
              name="correo"
              type="email"
              value={correo}
              onChange={(evento) => setCorreo(evento.target.value)}
              required
            />

            <label htmlFor="telefono">Teléfono</label>
            <input
              id="telefono"
              name="telefono"
              type="tel"
              value={telefono}
              onChange={(evento) => setTelefono(evento.target.value)}
              maxLength={20}
            />

            {error ? <p className="mensaje-error">{error}</p> : null}
            {exito ? <p className="mensaje-exito">{exito}</p> : null}

            <button type="submit" className="boton-contorno boton-pill" disabled={enviando}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M5 5h11l3 3v11H5V5z" />
                <path d="M8 5v4h7V5" />
                <path d="M8 19v-6h8v6" />
              </svg>
              {enviando ? 'Guardando...' : 'Guardar cambios'}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}

export default Perfil;
