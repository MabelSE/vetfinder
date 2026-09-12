import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';

const AVISO_REGISTRO = 'Tu veterinaria fue registrada y se encuentra pendiente de revisión. Completa la información de tu establecimiento, especialmente sus horarios de atención, para que pueda ser evaluada por el administrador.';

function RegistroVeterinaria() {
  const { registrarVeterinaria } = useAuth();
  const navigate = useNavigate();
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [correo, setCorreo] = useState('');
  const [telefono, setTelefono] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [nombreComercial, setNombreComercial] = useState('');
  const [telefonoVeterinaria, setTelefonoVeterinaria] = useState('');
  const [correoVeterinaria, setCorreoVeterinaria] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [calle, setCalle] = useState('');
  const [numero, setNumero] = useState('');
  const [comuna, setComuna] = useState('');
  const [region, setRegion] = useState('');
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
      await registrarVeterinaria({
        nombre,
        apellido,
        correo,
        telefono: telefono || null,
        contrasena,
        veterinaria: {
          nombreComercial,
          telefono: telefonoVeterinaria,
          correo: correoVeterinaria,
          descripcion: descripcion || null,
        },
        direccion: {
          calle,
          numero,
          comuna,
          region,
        },
      });
      navigate('/mi-veterinaria', { state: { avisoRegistro: AVISO_REGISTRO } });
    } catch (err) {
      setError(err.message);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <main className="pagina pagina--auth pagina--registro-veterinaria">
      <section className="tarjeta-auth tarjeta-auth--amplia">
        <h1>Registrar veterinaria</h1>
        <p className="ayuda-auth">
          Solicita una cuenta para administrar una sucursal. La ficha quedará pendiente
          hasta que el SuperAdmin la revise.
        </p>
        <form className="formulario" onSubmit={manejarEnvio}>
          <fieldset>
            <legend>Tu cuenta</legend>
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

            <label htmlFor="telefono">Teléfono personal (opcional)</label>
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
          </fieldset>

          <fieldset>
            <legend>Veterinaria</legend>
            <label htmlFor="nombreComercial">Nombre comercial</label>
            <input
              id="nombreComercial"
              name="nombreComercial"
              value={nombreComercial}
              onChange={(evento) => setNombreComercial(evento.target.value)}
              required
              maxLength={150}
            />

            <label htmlFor="telefonoVeterinaria">Teléfono de la veterinaria</label>
            <input
              id="telefonoVeterinaria"
              name="telefonoVeterinaria"
              type="tel"
              value={telefonoVeterinaria}
              onChange={(evento) => setTelefonoVeterinaria(evento.target.value)}
              required
              maxLength={20}
            />

            <label htmlFor="correoVeterinaria">Correo de la veterinaria</label>
            <input
              id="correoVeterinaria"
              name="correoVeterinaria"
              type="email"
              value={correoVeterinaria}
              onChange={(evento) => setCorreoVeterinaria(evento.target.value)}
              required
            />

            <label htmlFor="descripcion">Descripción (opcional)</label>
            <textarea
              id="descripcion"
              name="descripcion"
              value={descripcion}
              onChange={(evento) => setDescripcion(evento.target.value)}
              rows={3}
              maxLength={5000}
            />
          </fieldset>

          <fieldset>
            <legend>Dirección</legend>
            <label htmlFor="calle">Calle</label>
            <input
              id="calle"
              name="calle"
              value={calle}
              onChange={(evento) => setCalle(evento.target.value)}
              required
              maxLength={150}
            />

            <label htmlFor="numero">Número</label>
            <input
              id="numero"
              name="numero"
              value={numero}
              onChange={(evento) => setNumero(evento.target.value)}
              required
              maxLength={20}
            />

            <label htmlFor="comuna">Comuna</label>
            <input
              id="comuna"
              name="comuna"
              value={comuna}
              onChange={(evento) => setComuna(evento.target.value)}
              required
              maxLength={100}
              placeholder="Osorno"
            />

            <label htmlFor="region">Región</label>
            <input
              id="region"
              name="region"
              value={region}
              onChange={(evento) => setRegion(evento.target.value)}
              required
              maxLength={100}
              placeholder="Los Lagos"
            />
          </fieldset>

          {error ? <p className="mensaje-error">{error}</p> : null}

          <button type="submit" disabled={enviando}>
            {enviando ? 'Enviando solicitud...' : 'Solicitar registro'}
          </button>
        </form>
        <p>
          ¿Ya tienes cuenta? <Link to="/iniciar-sesion"><strong>Inicia sesión</strong></Link>
        </p>
        <p>
          ¿Eres propietario de una mascota? <Link to="/registro"><strong>Crear cuenta</strong></Link>
        </p>
      </section>
    </main>
  );
}

export default RegistroVeterinaria;
