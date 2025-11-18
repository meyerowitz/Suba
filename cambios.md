# Documentación de Cambios Realizados

## Resumen de Cambios

He realizado importantes modificaciones en ambos proyectos (`Suba` y `bus-tracking-api`) para implementar un sistema funcional de seguimiento de buses con un mapa interactivo que no depende de Google Maps.

## Cambios en `/Suba` (Aplicación Móvil)

### 1. Nueva estructura de navegación con Expo Router
- **`app/_layout.js`**: Configuración de rutas con Stack Navigator
- **`app/index.js`**: Página principal con botones de navegación

### 2. Nueva pantalla de mapa interactivo
- **`app/pages/MapScreen.js`**: 
  - Visualización de mapas con `react-native-maps` y OpenStreetMap
  - Marcadores móviles para mostrar buses en tiempo real
  - Actualización automática cada 10 segundos
  - Panel de información y botones de navegación

### 3. Mejora de la pantalla de seguimiento
- **`app/pages/TrackerScreen.js`**:
  - Actualizado para usar el archivo de configuración
  - Añadido botón de navegación a la pantalla de mapa
  - Uso de timeouts configurables

### 4. Archivo de configuración centralizado
- **`config/apiConfig.js`**:
  - URL base de la API
  - Endpoints definidos como constantes
  - Instrucciones claras para cambiar la IP según el entorno
  - Tiempos de espera configurables

### 5. Dependencias instaladas
- `react-native-maps`: Para mostrar mapas con OpenStreetMap
- `@react-navigation/*`: Para navegación entre pantallas
- `expo-router`: Para la estructura de rutas

## Cambios en `/bus-tracking-api` (API Backend)

### 1. Nuevos endpoints para la visualización en tiempo real
- **`GET /api/v1/buses/locations`**:
  - Obtiene todas las ubicaciones de buses registradas
  - Devuelve un array con la última posición de cada bus
  - Usado por la pantalla de mapa para mostrar marcadores

- **`GET /api/v1/buses/:busId/location`**:
  - Obtiene la ubicación específica de un bus
  - Recibe el busId como parámetro de ruta

### 2. Mantenimiento del endpoint original
- **`POST /api/v1/track`**:
  - Endpoint original para recibir ubicaciones de buses
  - Almacena la ubicación en historial
  - Actualiza la última posición en la colección de estado

## Características Implementadas

### 1. Visualización en Tiempo Real
- Marcadores móviles actualizados cada 10 segundos
- Panel de información con número de buses y hora de actualización
- Indicación visual de que la API está funcionando

### 2. Navegación entre Pantallas
- Pestañas de navegación o botones entre pantallas
- Fácil acceso entre el mapa y el modo de seguimiento
- Indicadores visuales claros de cada sección

### 3. Configuración Flexible
- Archivo de configuración centralizado
- Instrucciones claras para cambiar la IP según el entorno
- Soporte para diferentes escenarios de desarrollo (emulador, dispositivo físico)

### 4. Proveedor de Mapas
- Uso de OpenStreetMap a través de `react-native-maps`
- No requiere API keys privadas
- Tiles estándar de OpenStreetMap (estilo base del mapa)
- Compatible con Android e iOS

### 5. Manejo de Errores
- Feedback visual cuando la API no responde
- Indicadores de errores en ambas pantallas
- Mensajes de ayuda en la interfaz

## Archivos Creados

### En `/Suba`:
- `app/_layout.js` - Configuración de navegación
- `app/index.js` - Página principal
- `app/pages/MapScreen.js` - Pantalla de mapa con marcadores
- `config/apiConfig.js` - Configuración centralizada de la API
- `README.md` - Documentación del proyecto (en la raíz)

### En `/bus-tracking-api`:
- No se crearon nuevos archivos, solo se modificó `index.js`

## Instrucciones para Despliegue

### 1. Configurar la API
- Actualizar `MONGO_URI` en el archivo `.env`
- Iniciar MongoDB
- Ejecutar `node index.js`

### 2. Configurar la Aplicación
- Actualizar `BASE_URL` en `config/apiConfig.js` con la IP del servidor
- Asegurarse que el dispositivo móvil y el servidor estén en la misma red
- Instalar dependencias: `npm install`
- Iniciar aplicación: `npx expo start`

### 3. Uso
- Usar pestaña "Enviar Ubicación" para simular un bus
- Usar pestaña "Mapa" para ver ubicaciones en tiempo real
- Las ubicaciones se actualizan automáticamente cada 10 segundos

## Tecnologías Utilizadas

- **Cliente Móvil**: Expo, React Native, Expo Router
- **Mapas**: react-native-maps con proveedor OpenStreetMap
- **Navegación**: Expo Router con Stack Navigator
- **Backend**: Node.js, Express, MongoDB
- **Comunicación**: REST API con endpoints para seguimiento y visualización

## Tiles de Mapa

- **Proveedor**: OpenStreetMap
- **Estilo**: Estilo estándar de OpenStreetMap (no personalizado)
- **Tipo**: Tiles vectoriales estándar que muestran calles, edificios, nombres de lugares
- **Ventajas**: Acceso gratuito, cobertura global, no requiere API key privada