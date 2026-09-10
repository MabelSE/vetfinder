import { useCallback, useRef, useState } from 'react';

export function useGeolocalizacion() {
  const [ubicacion, setUbicacion] = useState(null);
  const [estado, setEstado] = useState('inactiva');
  const [error, setError] = useState('');
  const solicitudRef = useRef(0);

  const solicitarUbicacion = useCallback(() => {
    const idSolicitud = solicitudRef.current + 1;
    solicitudRef.current = idSolicitud;

    if (!navigator.geolocation) {
      setUbicacion(null);
      setEstado('error');
      setError('Este navegador no permite geolocalización. El modo de urgencia sigue disponible sin distancia.');
      return;
    }

    setEstado('solicitando');
    setError('');

    navigator.geolocation.getCurrentPosition(
      (posicion) => {
        if (solicitudRef.current !== idSolicitud) {
          return;
        }

        setUbicacion({
          lat: posicion.coords.latitude,
          lng: posicion.coords.longitude,
        });
        setEstado('disponible');
        setError('');
      },
      () => {
        if (solicitudRef.current !== idSolicitud) {
          return;
        }

        setUbicacion(null);
        setEstado('denegada');
        setError('No se pudo obtener la ubicación. El modo de urgencia sigue disponible sin distancia.');
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 }
    );
  }, []);

  const olvidarUbicacion = useCallback(() => {
    solicitudRef.current += 1;
    setUbicacion(null);
    setEstado('inactiva');
    setError('');
  }, []);

  return { ubicacion, estado, error, solicitarUbicacion, olvidarUbicacion };
}
