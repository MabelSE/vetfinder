import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';

function IniciarSesion() {
  const { iniciarSesion } = useAuth();
  const navigate = useNavigate();
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  async function manejarEnvio(evento) {
    evento.preventDefault();
    setError('');
    setEnviando(true);

    try {
      await iniciarSesion({ correo, contrasena });
      navigate('/perfil');
    } catch (err) {
      setError(err.message);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <main className="pagina pagina--auth">
      <section className="tarjeta-auth">
        <h1>Iniciar sesión</h1>
        <p className="ayuda-auth">
          Accede con tu cuenta para utilizar las funciones disponibles según tu perfil.
        </p>
        <form className="formulario" onSubmit={manejarEnvio}>
          <label htmlFor="correo">Correo</label>
          <input
            id="correo"
            name="correo"
            type="email"
            autoComplete="email"
            placeholder="tucorreo@correo.com"
            value={correo}
            onChange={(evento) => setCorreo(evento.target.value)}
            required
          />

          <label htmlFor="contrasena">Contraseña</label>
          <input
            id="contrasena"
            name="contrasena"
            type="password"
            autoComplete="current-password"
            value={contrasena}
            onChange={(evento) => setContrasena(evento.target.value)}
            required
          />

          {error ? <p className="mensaje-error">{error}</p> : null}

          <button type="submit" disabled={enviando}>
            {enviando ? 'Ingresando...' : 'Entrar'}
          </button>
        </form>
        <p>
          ¿No tienes cuenta? <Link to="/registro"><strong>Crear una</strong></Link>
        </p>
      </section>
    </main>
  );
}

export default IniciarSesion;
