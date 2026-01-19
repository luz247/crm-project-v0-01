# 🚀 CRM 

Una breve descripción de lo que hace este proyecto y cuál es su objetivo principal.

## 🛠️ Configuración del Proyecto

Sigue estos pasos para levantar el entorno de desarrollo localmente.

### 1. Requisitos Previos
Asegúrate de tener instalado [Node.js](https://nodejs.org/) (versión 18 o superior recomendada).

### 2. Instalación
Clona el repositorio y entra en la carpeta del proyecto:
```bash
git clone <URL_DEL_REPOSITORIO>
cd <NOMBRE_DEL_DIRECTORIO>
npm install


## 🛠️ Configuración del Entorno

Este proyecto requiere variables de entorno para conectarse a la API y otros servicios. 

1. **Crea un archivo `.env`** en la raíz del proyecto.
2. **Copia el contenido** de `.env-example` y rellena los valores correspondientes:

| Variable | Descripción |
| :--- | :--- |
| `VITE_API` | URL base de la API de servicios. |
| `VITE_TOKEN` | Token de acceso (JWT) para las peticiones. |
| `VITE_VICI` | Endpoint o identificador para la integración con ViciDial. |

```bash
# Ejemplo de contenido en tu .env
VITE_API=[https://apirest.tu-servidor.cl:3000](https://apirest.tu-servidor.cl:3000)
VITE_TOKEN=tu_token_aqui
VITE_VICI=tu_valor_aqui