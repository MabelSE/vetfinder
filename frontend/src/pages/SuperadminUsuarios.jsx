import { useEffect, useState } from 'react';
import SuperadminNav from '../components/SuperadminNav.jsx';
import { useAuth } from '../hooks/useAuth.js';
import {
  actualizarEstadoCuentaUsuario,
  listarUsuariosAdministracion,
} from '../services/superadminService.js';
import { textoEstadoRegistro, textoRol } from '../utils/veterinaria.js';

function ordenarUsuarios(lista) {
  return lista.slice().sort((primero, segundo) => {
    const primeroInactiva = primero.estadoCuenta === 'INACTIVA' ? 1 : 0;
    const segundoInactiva = segundo.estadoCuenta === 'INACTIVA' ? 1 : 0;
    return primeroInactiva - segundoInactiva;
  });
}

function textoVeterinariaUsuario(usuario) {
  if (usuario.veterinaria) {
    return `${usuario.veterinaria.nombreComercial} (${textoEstadoRegistro(usuario.veterinaria.estadoRegistro)})`;
  }

  return 'No aplica';
}

function InterruptorCuenta({ activa, deshabilitado, guardando, titulo, onCambiar }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={activa}
      aria-label={activa ? 'Cuenta activa' : 'Cuenta inactiva'}
      title={titulo}
      className={`interruptor-cuenta${activa ? ' interruptor-cuenta--activa' : ''}`}
      disabled={deshabilitado}
      onClick={onCambiar}
    >
      <span className="interruptor-cuenta__pista" aria-hidden="true">
        <span className="interruptor-cuenta__boton" />
      </span>
      <span className="interruptor-cuenta__texto">
        {guardando ? 'Guardando...' : (activa ? 'Activa' : 'Inactiva')}
      </span>
    </button>
  );
}

function SuperadminUsuarios() {
  const { usuario: sesion } = useAuth();
  const [usuarios, setUsuarios] = useState([]);
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [cargando, setCargando] = useState(true);
  const [enviando, setEnviando] = useState('');

  async function cargar() {
    setUsuarios(ordenarUsuarios(await listarUsuariosAdministracion()));
  }

  useEffect(() => {
    let cancelado = false;

    async function iniciar() {
      try {
        await cargar();
      } catch (err) {
        if (!cancelado) {
          setError(err.message);
        }
      } finally {
        if (!cancelado) {
          setCargando(false);
        }
      }
    }

    iniciar();
    return () => {
      cancelado = true;
    };
  }, []);

  async function cambiarEstado(usuario) {
    const siguiente = usuario.estadoCuenta === 'ACTIVA' ? 'INACTIVA' : 'ACTIVA';
    const anterior = usuario.estadoCuenta;
    setError('');
    setMensaje('');
    setEnviando(String(usuario.idUsuario));
    setUsuarios((lista) => lista.map((item) => (
      item.idUsuario === usuario.idUsuario ? { ...item, estadoCuenta: siguiente } : item
    )));

    try {
      await actualizarEstadoCuentaUsuario(usuario.idUsuario, siguiente);
      await cargar();
      setMensaje('El estado de la cuenta se actualizó.');
    } catch (err) {
      setUsuarios((lista) => lista.map((item) => (
        item.idUsuario === usuario.idUsuario ? { ...item, estadoCuenta: anterior } : item
      )));
      setError(err.message);
    } finally {
      setEnviando('');
    }
  }

  if (cargando) {
    return <p className="pagina-estado">Cargando usuarios...</p>;
  }

  return (
    <main className="pagina pagina--ancha pagina-admin-veterinaria">
      <header className="pagina-cabecera">
        <h1>Usuarios</h1>
      </header>
      <SuperadminNav />
      {error ? <p className="mensaje-error">{error}</p> : null}
      {mensaje ? <p className="mensaje-exito">{mensaje}</p> : null}

      <ul className="lista-usuarios">
        {usuarios.map((usuario) => {
          const veterinariaTexto = textoVeterinariaUsuario(usuario);
          const interruptor = (
            <InterruptorCuenta
              activa={usuario.estadoCuenta === 'ACTIVA'}
              deshabilitado={Boolean(enviando) || usuario.idUsuario === sesion?.idUsuario}
              titulo={usuario.idUsuario === sesion?.idUsuario
                ? 'No puede cambiar el estado de su propia cuenta.'
                : undefined}
              guardando={enviando === String(usuario.idUsuario)}
              onCambiar={() => cambiarEstado(usuario)}
            />
          );

          return (
            <li
              key={usuario.idUsuario}
              className={`card-usuario${usuario.estadoCuenta === 'INACTIVA' ? ' card-usuario--inactiva' : ''}`}
            >
              <header className="card-usuario__encabezado">
                <h2 className="card-usuario__nombre">{usuario.nombre} {usuario.apellido}</h2>
                <span className="card-usuario__rol">{textoRol(usuario.rol)}</span>
              </header>
              <div className="card-usuario__cuerpo">
                <div className="card-usuario__dato card-usuario__dato--correo">
                  <span className="card-usuario__etiqueta">Correo</span>
                  <p className="card-usuario__correo">{usuario.correo}</p>
                </div>
                <div className="card-usuario__datos">
                  <div className="card-usuario__dato">
                    <span className="card-usuario__etiqueta">Veterinaria</span>
                    <p className={`card-usuario__valor${usuario.veterinaria ? '' : ' card-usuario__valor--suave'}`}>
                      {veterinariaTexto}
                    </p>
                  </div>
                  <div className="card-usuario__dato card-usuario__dato--cuenta">
                    <span className="card-usuario__etiqueta">Cuenta</span>
                    {interruptor}
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      <div className="tabla-desplazable tabla-usuarios vidrio">
        <table className="tabla-admin">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Correo</th>
              <th>Rol</th>
              <th>Veterinaria</th>
              <th>Cuenta</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((usuario) => (
              <tr
                key={`tabla-${usuario.idUsuario}`}
                className={usuario.estadoCuenta === 'INACTIVA' ? 'cuenta-inactiva' : undefined}
              >
                <td>{usuario.nombre} {usuario.apellido}</td>
                <td>{usuario.correo}</td>
                <td>{textoRol(usuario.rol)}</td>
                <td>{textoVeterinariaUsuario(usuario)}</td>
                <td>
                  <InterruptorCuenta
                    activa={usuario.estadoCuenta === 'ACTIVA'}
                    deshabilitado={Boolean(enviando) || usuario.idUsuario === sesion?.idUsuario}
                    titulo={usuario.idUsuario === sesion?.idUsuario
                      ? 'No puede cambiar el estado de su propia cuenta.'
                      : undefined}
                    guardando={enviando === String(usuario.idUsuario)}
                    onCambiar={() => cambiarEstado(usuario)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}

export default SuperadminUsuarios;
