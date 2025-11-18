import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, Alert, Platform, TouchableOpacity } from 'react-native';
import MapView, { Marker, PROVIDER_OPENSTREETMAP } from 'react-native-maps';
import axios from 'axios';
import { Link } from 'expo-router';
import API_CONFIG from '../../config/apiConfig';

// URL de la API
const API_URL = API_CONFIG.BASE_URL;

const MapScreen = () => {
  const [busLocations, setBusLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Función para obtener ubicaciones de buses en tiempo real
  const fetchBusLocations = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/v1/buses/locations`);
      setBusLocations(response.data);
      setLastUpdate(new Date());
      setLoading(false);
    } catch (error) {
      console.error('Error fetching bus locations:', error);
      Alert.alert('Error', `No se pudieron cargar las ubicaciones de los buses. Asegúrate que la API esté corriendo.\n\n${error.message}`);
      setLoading(false);
    }
  };

  // Cargar ubicaciones cuando se monte el componente
  useEffect(() => {
    fetchBusLocations();

    // Actualizar cada 10 segundos
    const interval = setInterval(fetchBusLocations, 10000);

    return () => clearInterval(interval);
  }, []);

  // Mostrar un mensaje si no hay buses
  if (loading && busLocations.length === 0) {
    return (
      <View style={styles.container}>
        <MapView
          style={styles.map}
          provider={PROVIDER_OPENSTREETMAP}
          initialRegion={{
            latitude: 8.0586, // Coordenadas aproximadas de Ciudad Bolívar, Venezuela
            longitude: -65.7167,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        />
        <View style={styles.loadingPanel}>
          <Text style={styles.loadingText}>Cargando ubicaciones de buses...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        provider={PROVIDER_OPENSTREETMAP} // Usar OpenStreetMap en lugar de Google Maps
        initialRegion={{
          latitude: 8.0586, // Coordenadas aproximadas de Ciudad Bolívar, Venezuela
          longitude: -65.7167,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {/* Marcadores para cada bus */}
        {busLocations.map((bus) => {
          // Asegurarse de que las coordenadas estén en el formato correcto
          if (bus.last_location && bus.last_location.coordinates) {
            return (
              <Marker
                key={bus._id || bus.bus_id}
                coordinate={{
                  latitude: bus.last_location.coordinates[1], // [long, lat] -> {lat, long}
                  longitude: bus.last_location.coordinates[0]
                }}
                title={bus.bus_id || 'BUS'}
                description={`Velocidad: ${bus.last_speed || 0} km/h`}
              >
                <View style={styles.markerContainer}>
                  <View style={styles.busMarker}>
                    <Text style={styles.busText}>{bus.bus_id || 'BUS'}</Text>
                  </View>
                </View>
              </Marker>
            );
          }
          return null;
        })}
      </MapView>

      <View style={styles.infoPanel}>
        <Text style={styles.infoText}>Buses en tiempo real: {busLocations.length}</Text>
        <Text style={styles.infoText}>Actualizado: {lastUpdate.toLocaleTimeString()}</Text>
      </View>

      <View style={styles.helpPanel}>
        <Text style={styles.helpText}>Tip: Asegúrate que la API esté corriendo en {API_URL}</Text>
      </View>

      <Link href="/pages/TrackerScreen" asChild>
        <TouchableOpacity style={styles.trackerButton}>
          <Text style={styles.trackerButtonText}>Enviar Ubicación</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  markerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  busMarker: {
    backgroundColor: '#FF5722',
    padding: 8,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    minWidth: 60,
  },
  busText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  infoPanel: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 10,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoText: {
    fontSize: 14,
    fontWeight: '500',
  },
  loadingPanel: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -100 }, { translateY: -25 }],
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 20,
    borderRadius: 8,
    minWidth: 200,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '500',
  },
  helpPanel: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    right: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 10,
    borderRadius: 8,
  },
  helpText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  trackerButton: {
    position: 'absolute',
    bottom: 80,
    left: 20,
    right: 20,
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  trackerButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default MapScreen;