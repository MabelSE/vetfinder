import { textoDisponibilidadVisible } from '../utils/veterinaria.js';

function EstadoVeterinaria({ estaAbierta, disponibilidad, extras = [], distancia }) {
  const disponibilidadVisible = textoDisponibilidadVisible(estaAbierta, disponibilidad);
  const extrasVisibles = extras.filter((item) => item && item !== '24 horas');

  return (
    <div className="estado-veterinaria">
      <div className="tarjeta-veterinaria__estado">
        <span className={estaAbierta ? 'estado-abierta' : 'estado-cerrada'}>
          {estaAbierta ? (extras.includes('24 horas') ? 'Abierta 24h' : 'Abierta') : 'Cerrada'}
        </span>
        {distancia ? <span className="estado-veterinaria__extras">a {distancia}</span> : null}
      </div>
      {disponibilidadVisible ? (
        <div className="disponibilidad-bloque">
          <span className="disponibilidad-bloque__etiqueta">Disponibilidad</span>
          <span className={`disponibilidad-visible disponibilidad-visible--${disponibilidad}`}>
            {disponibilidadVisible}
          </span>
        </div>
      ) : null}
      {extrasVisibles.length > 0 ? (
        <span className="estado-veterinaria__extras">
          {extrasVisibles.join(' · ')}
        </span>
      ) : null}
    </div>
  );
}

export default EstadoVeterinaria;
