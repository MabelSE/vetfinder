import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { cerrarSesion as cerrarSesionApi, iniciarSesion as iniciarSesionApi, registrarUsuario } from '../services/autenticacionService.js';
import { actualizarPerfil as actualizarPerfilApi, obtenerPerfil } from '../services/usuarioService.js';
import { solicitarRegistroVeterinaria } from '../services/veterinariaService.js';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    let cancelado = false;

    async function cargarSesion() {
      try {
        const perfil = await obtenerPerfil();

        if (!cancelado) {
          setUsuario(perfil);
        }
      } catch {
        if (!cancelado) {
          setUsuario(null);
        }
      } finally {
        if (!cancelado) {
          setCargando(false);
        }
      }
    }

    cargarSesion();

    return () => {
      cancelado = true;
    };
  }, []);

  const registrar = useCallback(async (datos) => {
    const perfil = await registrarUsuario(datos);
    setUsuario(perfil);
    return perfil;
  }, []);

  const registrarVeterinaria = useCallback(async (datos) => {
    const perfil = await solicitarRegistroVeterinaria(datos);
    setUsuario(perfil);
    return perfil;
  }, []);

  const iniciarSesion = useCallback(async (datos) => {
    const perfil = await iniciarSesionApi(datos);
    setUsuario(perfil);
    return perfil;
  }, []);

  const cerrarSesion = useCallback(async () => {
    await cerrarSesionApi();
    setUsuario(null);
  }, []);

  const actualizarPerfil = useCallback(async (datosPersonales) => {
    const perfil = await actualizarPerfilApi(datosPersonales);
    setUsuario(perfil);
    return perfil;
  }, []);

  const valor = useMemo(
    () => ({
      usuario,
      cargando,
      registrar,
      registrarVeterinaria,
      iniciarSesion,
      cerrarSesion,
      actualizarPerfil,
    }),
    [usuario, cargando, registrar, registrarVeterinaria, iniciarSesion, cerrarSesion, actualizarPerfil]
  );

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}
