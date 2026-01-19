// En su archivo de configuración de Axios
import { getEnvVariables } from "@/utils/getEnvVariables";
import axios from "axios";
const { VITE_API, VITE_TOKEN } = getEnvVariables();

const ApiWeb = axios.create({
  baseURL: VITE_API,
  headers: {
    // CAMBIO CLAVE: Usar el encabezado 'Authorization' con el prefijo 'Bearer '
    "Authorization": `Bearer ${VITE_TOKEN}`, 
  }
});

export default ApiWeb;