import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import FormularioMascota from '../components/FormularioMascota.jsx';
import {
  actualizarFotografia,
  actualizarMascota,
  crearAlergia,
  crearEnfermedad,
  crearMascota,
  actualizarComprobanteVacuna,
  crearVacuna,
  eliminarFotografia,
  obtenerMascota,
} from '../services/mascotaService.js';

function MascotaFormulario() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const esEdicion = Boolean(id);
  const [valoresIniciales, setValoresIniciales] = useState(null);
  const [error, setError] = useState(location.state?.error || '');
  const [enviando, setEnviando] = useState(false);
  const [cargando, setCargando] = useState(esEdicion);

  useEffect(() => {
    if (!esEdicion) {
      return undefined;
    }

    let cancelado = false;

    async function cargar() {
      try {
        const mascota = await obtenerMascota(id);
        if (!cancelado) {
          setValoresIniciales({
            nombre: mascota.nombre,
            idEspecie: String(mascota.idEspecie),
            raza: mascota.raza || '',
            sexo: mascota.sexo || '',
            fechaNacimiento: mascota.fechaNacimiento || '',
            peso: mascota.peso ?? '',
            fotografia: mascota.fotografia || '',
            poseeMicrochip: mascota.poseeMicrochip,
            numeroMicrochip: mascota.numeroMicrochip || '',
            antecedentesRelevantes: mascota.antecedentesRelevantes || '',
          });
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
  }, [esEdicion, id]);

  async function guardar({ datos, archivoFotografia, eliminarFotografia, salud }) {
    setError('');
    setEnviando(true);

    let mascotaCreada = null;

    try {
      const mascota = esEdicion
        ? await actualizarMascota(id, datos)
        : await crearMascota(datos);
      mascotaCreada = mascota;

      if (archivoFotografia) {
        await actualizarFotografia(mascota.idMascota, archivoFotografia);
      } else if (esEdicion && eliminarFotografia) {
        await eliminarFotografia(mascota.idMascota);
      }

      if (!esEdicion) {
        const idMascota = mascota.idMascota;
        for (const enfermedad of salud?.enfermedades || []) {
          await crearEnfermedad(idMascota, enfermedad);
        }
        for (const alergia of salud?.alergias || []) {
          await crearAlergia(idMascota, alergia);
        }
        let errorComprobante = '';
        for (const vacuna of salud?.vacunas || []) {
          const { archivoComprobante, ...datosVacuna } = vacuna;
          const creada = await crearVacuna(idMascota, datosVacuna);

          if (archivoComprobante) {
            try {
              await actualizarComprobanteVacuna(idMascota, creada.idVacuna, archivoComprobante);
            } catch (err) {
              errorComprobante = `La vacuna ${creada.nombre} fue guardada, pero el comprobante no pudo cargarse. Puedes adjuntarlo más tarde. ${err.message}`;
            }
          }
        }

        if (errorComprobante) {
          navigate(`/mascotas/${mascota.idMascota}`, {
            replace: true,
            state: { error: errorComprobante },
          });
          return;
        }
      }

      navigate(`/mascotas/${mascota.idMascota}`);
    } catch (err) {
      if (!esEdicion && mascotaCreada) {
        navigate(`/mascotas/${mascotaCreada.idMascota}`, {
          replace: true,
          state: {
            error: `La mascota se registró, pero no se pudieron completar todos los datos: ${err.message}`,
          },
        });
        return;
      }

      setError(err.message);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <main className="pagina pagina--ancha">
      <p>
        <Link to="/mascotas">Volver a mis mascotas</Link>
      </p>
      <h1>{esEdicion ? 'Editar mascota' : 'Registrar mascota'}</h1>
      {cargando ? <p>Cargando ficha...</p> : null}
      {!cargando ? (
        <FormularioMascota
          valoresIniciales={valoresIniciales || undefined}
          onGuardar={guardar}
          onCancelar={() => navigate('/mascotas')}
          textoBoton="Guardar mascota"
          enviando={enviando}
          error={error}
          incluirSalud={!esEdicion}
          esEdicion={esEdicion}
        />
      ) : null}
    </main>
  );
}

export default MascotaFormulario;
