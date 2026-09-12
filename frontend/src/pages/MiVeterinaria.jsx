import { useLocation } from 'react-router-dom';
import GestionFichaVeterinaria from '../components/GestionFichaVeterinaria.jsx';
import { apiMiVeterinaria } from '../services/superadminService.js';

function MiVeterinaria() {
  const { state } = useLocation();

  return (
    <GestionFichaVeterinaria
      titulo="Mi veterinaria"
      api={apiMiVeterinaria}
      mostrarValoraciones
      avisoInicial={state?.avisoRegistro}
    />
  );
}

export default MiVeterinaria;
