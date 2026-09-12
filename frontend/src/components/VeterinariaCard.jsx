import { Link } from 'react-router-dom';
import EstadoVeterinaria from './EstadoVeterinaria.jsx';
import { formatearDireccion, formatearDistancia, recortarLista } from '../utils/veterinaria.js';

const MAXIMO_ESPECIES = 4;
const MAXIMO_SERVICIOS = 3;

function ResumenCatalogo({ etiqueta, items, maximo }) {
  const { visibles, restantes } = recortarLista(items, maximo);

  if (visibles.length === 0) {
    return null;
  }

  const valores = visibles.map((item) => item.nombre).join(', ');

  return (
    <p className="resumen-catalogo-texto">
      <strong>{etiqueta}:</strong>
      {' '}
      <span>
        {valores}
        {restantes > 0 ? ` +${restantes}` : ''}
      </span>
    </p>
  );
}

function VeterinariaCard({ veterinaria, mostrarLlamar = false }) {
  const distancia = formatearDistancia(veterinaria.distanciaKm);
  const hayCatalogo = Boolean(
    (veterinaria.especies && veterinaria.especies.length > 0)
    || (veterinaria.servicios && veterinaria.servicios.length > 0)
  );
  const mostrarBotonLlamar = mostrarLlamar && Boolean(veterinaria.telefono);
  const rutaFicha = `/veterinarias/${veterinaria.idVeterinaria}`;

  return (
    <li className="tarjeta tarjeta-veterinaria">
      {veterinaria.fotografiaPrincipal ? (
        <Link
          to={rutaFicha}
          className="tarjeta-veterinaria__foto-enlace"
          aria-label={`Ver ficha de ${veterinaria.nombreComercial}`}
        >
          <img
            src={veterinaria.fotografiaPrincipal}
            alt=""
            className="tarjeta-veterinaria__foto"
          />
        </Link>
      ) : (
        <div className="tarjeta-veterinaria__foto-vacia">Sin fotografía</div>
      )}
      <div className="tarjeta-veterinaria__cuerpo">
        <EstadoVeterinaria
          estaAbierta={veterinaria.estaAbierta}
          disponibilidad={veterinaria.disponibilidad}
          distancia={distancia}
          extras={[
            veterinaria.atencion24Horas ? '24 horas' : null,
            veterinaria.atiendeUrgencias ? 'Urgencias' : null,
          ]}
        />
        <h2>{veterinaria.nombreComercial}</h2>
        <p>{formatearDireccion(veterinaria.direccion)}</p>
        {veterinaria.descripcion ? (
          <p className="tarjeta-veterinaria__descripcion">{veterinaria.descripcion}</p>
        ) : null}
        {veterinaria.descripcion && hayCatalogo ? (
          <hr className="tarjeta-veterinaria__divisor" />
        ) : null}
        <ResumenCatalogo etiqueta="Especies" items={veterinaria.especies} maximo={MAXIMO_ESPECIES} />
        <ResumenCatalogo etiqueta="Servicios" items={veterinaria.servicios} maximo={MAXIMO_SERVICIOS} />
        <div className={mostrarBotonLlamar ? 'tarjeta-veterinaria__acciones' : undefined}>
          {mostrarBotonLlamar ? (
            <a className="boton-primario" href={`tel:${veterinaria.telefono}`}>
              Llamar
            </a>
          ) : null}
          <Link className="boton-contorno" to={rutaFicha}>
            Ver ficha
          </Link>
        </div>
      </div>
    </li>
  );
}

export default VeterinariaCard;
