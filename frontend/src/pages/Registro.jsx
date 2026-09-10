import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';

function Registro() {
  const { registrar } = useAuth();
  const navigate = useNavigate();
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [correo, setCorreo] = useState('');
  const [telefono, setTelefono] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  async function manejarEnvio(evento) {
    evento.preventDefault();
    setError('');

    if (contrasena.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.');
      return;
    }

    setEnviando(true);

    try {
      await registrar({
        nombre,
        apellido,
        correo,
        telefono: telefono || null,
        contrasena,
      });
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
        <h1>Crear cuenta</h1>
        <p className="ayuda-auth">El registro público corresponde a una cuenta de propietario.</p>
        <form className="formulario" onSubmit={manejarEnvio}>
        <label htmlFor="nombre">Nombre</label>
        <input
          id="nombre"
          name="nombre"
          value={nombre}
          onChange={(evento) => setNombre(evento.target.value)}
          required
          maxLength={100}
        />

        <label htmlFor="apellido">Apellido</label>
        <input
          id="apellido"
          name="apellido"
          value={apellido}
          onChange={(evento) => setApellido(evento.target.value)}
          required
          maxLength={100}
        />

        <label htmlFor="correo">Correo</label>
        <input
          id="correo"
          name="correo"
          type="email"
          autoComplete="email"
          value={correo}
          onChange={(evento) => setCorreo(evento.target.value)}
          required
        />

        <label htmlFor="telefono">Teléfono (opcional)</label>
        <input
          id="telefono"
          name="telefono"
          type="tel"
          value={telefono}
          onChange={(evento) => setTelefono(evento.target.value)}
          maxLength={20}
        />

        <label htmlFor="contrasena">Contraseña</label>
        <input
          id="contrasena"
          name="contrasena"
          type="password"
          autoComplete="new-password"
          value={contrasena}
          onChange={(evento) => setContrasena(evento.target.value)}
          required
          minLength={8}
        />

        {error ? <p className="mensaje-error">{error}</p> : null}

        <button type="submit" disabled={enviando}>
          {enviando ? 'Registrando...' : 'Registrarse'}
        </button>
      </form>
      <p>
        ¿Ya tienes cuenta? <Link to="/iniciar-sesion"><strong>Inicia sesión</strong></Link>
      </p>
      </section>
    </main>
  );
}

export default Registro;
