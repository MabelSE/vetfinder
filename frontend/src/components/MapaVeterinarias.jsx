import { useEffect, useRef } from 'react';
import L from 'leaflet';
import iconoUrl from 'leaflet/dist/images/marker-icon.png';
import iconoRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import sombraUrl from 'leaflet/dist/images/marker-shadow.png';
import 'leaflet/dist/leaflet.css';

const CENTRO_OSORNO = [-40.5738, -73.135];

const iconoPredeterminado = L.icon({
  iconUrl: iconoUrl,
  iconRetinaUrl: iconoRetinaUrl,
  shadowUrl: sombraUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

function MapaVeterinarias({ veterinarias, ubicacionUsuario }) {
  const contenedorRef = useRef(null);
  const mapaRef = useRef(null);

  useEffect(() => {
    if (!contenedorRef.current || mapaRef.current) {
      return undefined;
    }

    const mapa = L.map(contenedorRef.current).setView(CENTRO_OSORNO, 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap',
    }).addTo(mapa);
    mapaRef.current = mapa;

    const observador = new ResizeObserver(() => {
      mapa.invalidateSize();
    });
    observador.observe(contenedorRef.current);

    return () => {
      observador.disconnect();
      mapa.remove();
      mapaRef.current = null;
    };
  }, []);

  useEffect(() => {
    const mapa = mapaRef.current;

    if (!mapa) {
      return undefined;
    }

    const capa = L.layerGroup().addTo(mapa);
    const puntos = [];

    veterinarias.forEach((veterinaria) => {
      const lat = veterinaria.direccion?.latitud;
      const lng = veterinaria.direccion?.longitud;

      if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
        return;
      }

      puntos.push([lat, lng]);
      L.marker([lat, lng], { icon: iconoPredeterminado })
        .bindPopup(
          `<strong>${veterinaria.nombreComercial}</strong><br>`
          + `<a href="/veterinarias/${veterinaria.idVeterinaria}">Ver ficha</a>`
        )
        .addTo(capa);
    });

    if (ubicacionUsuario) {
      puntos.push([ubicacionUsuario.lat, ubicacionUsuario.lng]);
      L.circleMarker([ubicacionUsuario.lat, ubicacionUsuario.lng], {
        radius: 8,
        color: '#1f6f4a',
        fillColor: '#1f6f4a',
        fillOpacity: 0.85,
      })
        .bindPopup('Tu ubicación')
        .addTo(capa);
    }

    mapa.invalidateSize();

    if (puntos.length > 0) {
      mapa.fitBounds(puntos, { padding: [28, 28], maxZoom: 15 });
    } else {
      mapa.setView(CENTRO_OSORNO, 13);
    }

    return () => {
      capa.remove();
    };
  }, [veterinarias, ubicacionUsuario]);

  return (
    <section className="mapa-veterinarias" aria-label="Mapa de veterinarias">
      <div ref={contenedorRef} className="mapa-veterinarias__lienzo" />
      <p className="ayuda-campo">
        Para indicaciones de viaje, use “Abrir en Google Maps” en la ficha del establecimiento.
      </p>
    </section>
  );
}

export default MapaVeterinarias;
