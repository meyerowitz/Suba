// Configuración de la API
const API_CONFIG = {
  // URL base de la API - cambia esta IP a la de tu computadora
  // Importante: Debes actualizar esta IP antes de usar la aplicación
  // Para encontrar la IP de tu computadora:
  // Windows: ipconfig
  // Mac/Linux: ifconfig o ip addr
  BASE_URL: 'http://192.168.0.105:3000', // Reemplaza con la IP de tu servidor

  // Opciones alternativas dependiendo del entorno:
  // Para emulador Android: 'http://10.0.2.2:3000'
  // Para emulador iOS: 'http://localhost:3000'
  // Para dispositivo físico Android/iOS: la IP local de tu computadora (ej: 'http://192.168.1.10:3000')

  // Tiempo de espera para las solicitudes (en milisegundos)
  TIMEOUT: 10000,

  // Endpoints
  ENDPOINTS: {
    TRACK: '/api/v1/track',
    BUS_LOCATIONS: '/api/v1/buses/locations',
    BUS_LOCATION: (busId) => `/api/v1/buses/${busId}/location`
  }
};

export default API_CONFIG;