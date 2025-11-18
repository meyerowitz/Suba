# Bus Tracker - Ciudad Bolívar

Sistema de seguimiento de buses en tiempo real para Ciudad Bolívar usando React Native con Expo, Mapbox y MongoDB.

## Características

- Rastreo en tiempo real de buses con marcadores móviles en el mapa
- Interfaz con dos pantallas principales:
  - **Mapa**: Visualización de buses en tiempo real
  - **Tracker**: Envío de ubicación (simula ser un bus)
- Actualización automática cada 10 segundos
- Navegación entre pantallas

## Configuración

### 1. Configuración de la API

Antes de usar la aplicación, debes actualizar la IP del servidor en `config/apiConfig.js`:

```javascript
BASE_URL: 'http://[TU_IP_AQUI]:3000'  // Cambia esta IP por la de tu computadora
```

Para encontrar tu IP:
- **Windows**: Ejecuta `ipconfig` en la terminal
- **Mac/Linux**: Ejecuta `ifconfig` o `ip addr` en la terminal

### 2. Configuraciones alternativas

Dependiendo de tu entorno de desarrollo:

- **Emulador Android**: `http://10.0.2.2:3000`
- **Emulador iOS**: `http://localhost:3000`
- **Dispositivo físico**: `http://[TU_IP_LOCAL]:3000`

### 3. Iniciar la API

1. Asegúrate de tener MongoDB configurado y actualiza tu `.env` con la URL de MongoDB:

```env
MONGO_URI=tu_url_aqui
```

2. Inicia el servidor:

```bash
cd bus-tracking-api
npm install
node index.js
```

### 4. Iniciar la aplicación móvil

1. Instala las dependencias:

```bash
cd Suba
npm install
```

2. Inicia la aplicación:

```bash
npx expo start
```

## Uso

1. **Pantalla Tracker**: Simula la ubicación de un bus (bus ID: BUS-101-PROTOTIPO)
2. **Pantalla Mapa**: Visualiza los buses en tiempo real en el mapa
3. Las ubicaciones se actualizan automáticamente cada 10 segundos

## Componentes

- `app/index.js`: Pantalla principal con navegación
- `app/pages/MapScreen.js`: Visualización del mapa con marcadores
- `app/pages/TrackerScreen.js`: Envío de ubicaciones simulando ser un bus
- `config/apiConfig.js`: Configuración de la API
- `app/_layout.js`: Configuración del enrutamiento
- `bus-tracking-api/index.js`: Servidor backend con endpoints para rastreo

## Notas

- Asegúrate que el servidor y el dispositivo móvil estén en la misma red Wi-Fi
- El token de Mapbox incluido es para pruebas; para uso en producción considera obtener tu propio token
- El sistema almacena la ubicación histórica y la última posición actual de cada bus
