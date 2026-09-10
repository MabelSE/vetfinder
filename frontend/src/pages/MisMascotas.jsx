import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { listarMascotas } from '../services/mascotaService.js';

function textoSexo(sexo) {
  if (sexo === 'MACHO') {
    return 'Macho';
  }

  if (sexo === 'HEMBRA') {
    return 'Hembra';
  }

  return null;
}

function textoEdad(fechaNacimiento) {
  if (!fechaNacimiento) {
    return null;
  }

  const nacimiento = new Date(`${fechaNacimiento}T00:00:00`);
  if (Number.isNaN(nacimiento.getTime())) {
    return null;
  }

  const ahora = new Date();
  let meses = (ahora.getFullYear() - nacimiento.getFullYear()) * 12 + (ahora.getMonth() - nacimiento.getMonth());
  if (ahora.getDate() < nacimiento.getDate()) {
    meses -= 1;
  }
  if (meses < 0) {
    return null;
  }

  const anios = Math.floor(meses / 12);
  const mesesRestantes = meses % 12;

  if (anios === 0) {
    return mesesRestantes === 1 ? '1 mes' : `${mesesRestantes} meses`;
  }

  if (mesesRestantes === 0) {
    return anios === 1 ? '1 año' : `${anios} años`;
  }

  return `${anios} ${anios === 1 ? 'año' : 'años'} y ${mesesRestantes} ${mesesRestantes === 1 ? 'mes' : 'meses'}`;
}

function MisMascotas() {
  const [mascotas, setMascotas] = useState([]);
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    let cancelado = false;

    async function cargar() {
      try {
        const lista = await listarMascotas();
        if (!cancelado) {
          setMascotas(lista);
        }
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

    cargar();

    return () => {
      cancelado = true;
    };
  }, []);

  return (
    <main className="pagina pagina--ancha">
      <header className="titulo-mascotas">
        <h1>Mis mascotas ({mascotas.length})</h1>
        <p>Haz clic sobre una mascota para ver su ficha</p>
      </header>

      {cargando ? <p>Cargando mascotas...</p> : null}
      {error ? <p className="mensaje-error">{error}</p> : null}

      {!cargando && mascotas.length === 0 && !error ? (
        <p>Aún no tienes mascotas registradas.</p>
      ) : null}

      <ul className="lista-tarjetas lista-mascotas">
        {mascotas.map((mascota) => {
          const sexo = textoSexo(mascota.sexo);
          const edad = textoEdad(mascota.fechaNacimiento);

          return (
            <li key={mascota.idMascota}>
              <Link className="tarjeta tarjeta-mascota" to={`/mascotas/${mascota.idMascota}`}>
                {mascota.fotografia ? (
                  <img src={mascota.fotografia} alt="" />
                ) : (
                  <div className="tarjeta-mascota__placeholder">Sin fotografía</div>
                )}
                <div className="tarjeta-mascota__hover">
                  <h2>{mascota.nombre}</h2>
                  <p>
                    {mascota.nombreEspecie}
                    {mascota.raza ? ` · ${mascota.raza}` : ''}
                  </p>
                  <div className="tarjeta-mascota__etiquetas">
                    {sexo ? <span>{sexo}</span> : null}
                    {edad ? <span>{edad}</span> : null}
                  </div>
                </div>
              </Link>
            </li>
          );
        })}
        <li>
          <Link className="tarjeta tarjeta-mascota-accion" to="/mascotas/nueva">
            <span>+</span>
            Registrar mascota
          </Link>
        </li>
      </ul>
    </main>
  );
}

export default MisMascotas;
