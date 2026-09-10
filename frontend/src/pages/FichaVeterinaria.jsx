import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import EstadoVeterinaria from '../components/EstadoVeterinaria.jsx';
import GaleriaVeterinaria from '../components/GaleriaVeterinaria.jsx';
import ListaHorarios from '../components/ListaHorarios.jsx';
import ListaValoraciones from '../components/ListaValoraciones.jsx';
import MapaVeterinarias from '../components/MapaVeterinarias.jsx';
import { obtenerVeterinaria } from '../services/veterinariaService.js';
import { obtenerValoracionesPublicas } from '../services/valoracionService.js';
import {
  formatearDireccion,
  formatearDistancia,
  urlGoogleMaps,
} from '../utils/veterinaria.js';

function FichaVeterinaria() {
  const { id } = useParams();
  const [veterinaria, setVeterinaria] = useState(null);
  const [resumen, setResumen] = useState({ cantidad: 0, promedio: null });
  const [valoraciones, setValoraciones] = useState([]);
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    let cancelado = false;

    async function cargar() {
      setError('');
      setCargando(true);
      setResumen({ cantidad: 0, promedio: null });
      setValoraciones([]);

      try {
        const [ficha, datosValoraciones] = await Promise.all([
          obtenerVeterinaria(id),
          obtenerValoracionesPublicas(id),
        ]);
        if (!cancelado) {
          setVeterinaria(ficha);
          setResumen(datosValoraciones.resumen);
          setValoraciones(datosValoraciones.valoraciones);
        }
      } catch (err) {
        if (!cancelado) {
          setError(err.message);
          setVeterinaria(null);
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
  }, [id]);

  if (cargando) {
    return <p className="pagina-estado">Cargando ficha...</p>;
  }

  if (!veterinaria) {
    return (
      <main className="pagina">
        <p className="mensaje-error">{error || 'No se encontró la veterinaria.'}</p>
        <Link to="/veterinarias">Volver al listado</Link>
      </main>
    );
  }

  const enlaceMapa = urlGoogleMaps(veterinaria.direccion);
  const distancia = formatearDistancia(veterinaria.distanciaKm);

  return (
    <main className="pagina pagina--ancha ficha-veterinaria">
      <p>
        <Link to="/veterinarias">Volver al listado</Link>
      </p>

      <section className="ficha-principal">
        <GaleriaVeterinaria fotografias={veterinaria.fotografias} />

        <div className="ficha-principal__datos">
          <section className="ficha-identidad">
            <h1>{veterinaria.nombreComercial}</h1>
            {veterinaria.telefono ? (
              <a className="boton-secundario boton-pill ficha-identidad__llamar" href={`tel:${veterinaria.telefono}`}>
                Llamar
              </a>
            ) : null}
            <EstadoVeterinaria
              estaAbierta={veterinaria.estaAbierta}
              disponibilidad={veterinaria.disponibilidad}
              distancia={distancia}
              extras={[veterinaria.atencion24Horas ? '24 horas' : null]}
            />
          </section>
          <section className="seccion ficha-resumen">
            {veterinaria.descripcion ? (
              <>
                <h2>Sobre la veterinaria</h2>
                <p>{veterinaria.descripcion}</p>
              </>
            ) : null}
            <h2>Horarios</h2>
            <ListaHorarios
              horarios={veterinaria.horarios}
              atencion24Horas={veterinaria.atencion24Horas}
            />
          </section>
        </div>
      </section>

      <section className="ficha-ubicacion">
        <section className="seccion seccion-ubicacion">
          <h2>Ubicación</h2>
          <dl className="ficha-datos">
            <div>
              <dt>Dirección</dt>
              <dd>{formatearDireccion(veterinaria.direccion)}</dd>
            </div>
            {distancia ? (
              <div>
                <dt>Distancia</dt>
                <dd>{distancia}</dd>
              </div>
            ) : null}
          </dl>
          <MapaVeterinarias veterinarias={[veterinaria]} />
          {enlaceMapa ? (
            <p className="acciones">
              <a className="boton-primario" href={enlaceMapa} target="_blank" rel="noreferrer">
                Abrir en Google Maps
              </a>
            </p>
          ) : null}
        </section>

        <section className="seccion ficha-ubicacion__contacto">
          <h2>Información adicional</h2>
          <dl className="ficha-datos">
            <div>
              <dt>Teléfono</dt>
              <dd>{veterinaria.telefono}</dd>
            </div>
            <div>
              <dt>Correo</dt>
              <dd>{veterinaria.correo}</dd>
            </div>
            {veterinaria.sitioWeb ? (
              <div>
                <dt>Sitio web</dt>
                <dd>
                  <a href={veterinaria.sitioWeb} target="_blank" rel="noreferrer">
                    {veterinaria.sitioWeb}
                  </a>
                </dd>
              </div>
            ) : null}
            {veterinaria.instagram ? (
              <div>
                <dt>Instagram</dt>
                <dd>
                  <a href={veterinaria.instagram} target="_blank" rel="noreferrer">
                    {veterinaria.instagram}
                  </a>
                </dd>
              </div>
            ) : null}
            {veterinaria.facebook ? (
              <div>
                <dt>Facebook</dt>
                <dd>
                  <a href={veterinaria.facebook} target="_blank" rel="noreferrer">
                    {veterinaria.facebook}
                  </a>
                </dd>
              </div>
            ) : null}
            <div>
              <dt>Atención de urgencias</dt>
              <dd>{veterinaria.atiendeUrgencias ? 'Sí' : 'No'}</dd>
            </div>
          </dl>
        </section>
      </section>

      <section className="ficha-catalogo">
        <div className="ficha-catalogo__grupo">
          <h2>Servicios</h2>
          <ul className="pildoras">
            {veterinaria.servicios.map((servicio) => (
              <li key={servicio.idServicio}>{servicio.nombre}</li>
            ))}
          </ul>
        </div>
        {veterinaria.serviciosPersonalizados.length > 0 ? (
          <div className="ficha-catalogo__grupo">
            <h2>Servicios adicionales</h2>
            <ul className="lista-catalogo">
              {veterinaria.serviciosPersonalizados.map((servicio) => (
                <li key={servicio.idServicioPersonalizado || servicio.nombre}>
                  {servicio.nombre}
                  {servicio.descripcion ? <span> · {servicio.descripcion}</span> : null}
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <div className="ficha-catalogo__grupo">
          <h2>Especialidades</h2>
          <ul className="lista-catalogo">
            {veterinaria.especialidades.map((item) => (
              <li key={item.idEspecialidad}>{item.nombre}</li>
            ))}
          </ul>
        </div>

        <div className="ficha-catalogo__grupo">
          <h2>Especies atendidas</h2>
          <ul className="pildoras">
            {veterinaria.especies.map((item) => (
              <li key={item.idEspecie}>{item.nombre}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="seccion ficha-valoraciones">
        <ListaValoraciones resumen={resumen} valoraciones={valoraciones} />
      </section>
    </main>
  );
}

export default FichaVeterinaria;
