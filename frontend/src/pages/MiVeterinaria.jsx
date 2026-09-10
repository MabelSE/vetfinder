import GestionFichaVeterinaria from '../components/GestionFichaVeterinaria.jsx';
import { apiMiVeterinaria } from '../services/superadminService.js';

function MiVeterinaria() {
  return (
    <GestionFichaVeterinaria
      titulo="Mi veterinaria"
      api={apiMiVeterinaria}
      mostrarValoraciones
    />
  );
}

export default MiVeterinaria;
